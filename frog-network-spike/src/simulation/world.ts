import { World, Vec2, Box, Circle, RopeJoint, Body } from 'planck';
import {prepareSurfaces,resolveSurfaces,SURFACES} from './surfaces';
import {POISON_BALANCE} from '../game/poison-balance';
import { defaults, DT, arena, WIDTH, HEIGHT, type Tuning } from './config';
export type Input = { x: number; y: number; held: boolean };
export type Tongue = {
  phase: 'flying' | 'attached' | 'retracting';
  direction: { x: number; y: number }; tip: { x: number; y: number };
  distance: number; length: number; joint?: RopeJoint;
  target?: Body; localAnchor?: { x: number; y: number };
};
export type Frog = {
  slipperySoap?: boolean; stickyMud?: boolean; surfaceBounceTick?: number;
  poisonPullFromTick?: number;
  body: Body; facing: number; input: Input; events: Input[]; held: boolean;
  charging: boolean; charge: number; grounded: boolean; tongue?: Tongue;
  jumpPending: boolean; holdTime: number; coyote: number; suppressSupport: number;
  landingWait: number; pressDirection: Input;
  bufferedRelease?: { remaining: number; x: number; charge: number };
};
const neutral = (): Input => ({ x: 0, y: 0, held: false });
export class Simulation {
  world: World;
  frogs: Frog[] = [];
  tick = 0;
  constructor(public tuning: Tuning = { ...defaults }) {
    this.world = new World(Vec2(0, tuning.gravity));
    for (const r of arena) {
      const b = this.world.createBody(Vec2(r.x, r.y));
      b.createFixture(Box(r.w / 2, r.h / 2), { friction: tuning.friction });
    }
    for (const x of [12, 20]) {
      const body = this.world.createDynamicBody({ position: Vec2(x, 16), fixedRotation: true, bullet: true });
      body.createFixture(Circle(tuning.frogRadius), {
        density: tuning.frogMass / (Math.PI * tuning.frogRadius ** 2),
        friction: tuning.friction, restitution: tuning.restitution,
      });
      this.frogs.push({
        body, facing: x < 16 ? 1 : -1, input: neutral(), events: [], held: false,
        charging: false, charge: 0, grounded: false, jumpPending: false,
        holdTime: 0, coyote: 0, suppressSupport: 0, landingWait: 0, pressDirection: neutral(),
      });
    }
  }
  setInput(index: number, input: Input) {
    const f = this.frogs[index];
    if (input.held !== f.input.held) f.events.push({ ...input });
    f.input = { ...input };
  }
  detach(f: Frog) {
    if (f.tongue?.joint) this.world.destroyJoint(f.tongue.joint);
    f.tongue = undefined; // Never change velocity on release.
  }
  cancelAction(f: Frog) {
    f.events = []; f.held = false; f.charging = false; f.charge = 0;
    f.holdTime = 0; f.jumpPending = false; f.landingWait = 0; f.bufferedRelease = undefined;
    this.detach(f);
  }
  clearInputs() {
    for (const f of this.frogs) { f.input = neutral(); this.cancelAction(f); }
  }
  grounded(f: Frog) {
    // Contacts can survive a takeoff step; do not reuse them to jump twice.
    if (f.suppressSupport > 0 || f.body.getLinearVelocity().y < -0.5) return false;
    for (let e = f.body.getContactList(); e; e = e.next) {
      const c = e.contact;
      if (!c.isTouching()) continue;
      const n = c.getWorldManifold(null)?.normal;
      if (n && (c.getFixtureA().getBody() === f.body ? n.y : -n.y) > 0.5) return true;
    }
    return false;
  }
  nearLanding(f: Frog) {
    const v = f.body.getLinearVelocity();
    if (v.y <= 0 || f.tongue || f.suppressSupport > 0) return false;
    const p = f.body.getPosition();
    const reach = this.tuning.frogRadius + v.y * this.tuning.jumpBufferSeconds + 0.04;
    let support = false;
    // A short downward probe disambiguates a landing tap from an airborne tongue press.
    this.world.rayCast(p, Vec2(p.x, p.y + reach), (fixture, _point, normal, fraction) => {
      if (fixture.getBody() === f.body || normal.y > -0.5) return -1;
      support = true; return fraction;
    });
    return support;
  }
  launch(f: Frog, x: number, charge: number) {
    const q = Math.min(1, charge / this.tuning.chargeSeconds);
    const vertical = this.tuning.jumpImpulse + (this.tuning.chargedJumpImpulse - this.tuning.jumpImpulse) * q;
    // Set a predictable upward launch speed; retain horizontal carried momentum.
    const vy = f.body.getLinearVelocity().y;
    f.body.applyLinearImpulse(Vec2(
      x * this.tuning.chargeHorizontalImpulse * q * f.body.getMass(),
      (-vertical - vy) * f.body.getMass(),
    ), f.body.getWorldCenter(), true);
    f.grounded = false; f.coyote = 0; f.suppressSupport = 0.06;
    f.bufferedRelease = undefined; f.jumpPending = false;
    f.charging = false; f.charge = 0; f.holdTime = 0; f.landingWait = 0;
  }
  fire(f: Frog, input: Input) {
    this.detach(f);
    let x = input.x, y = input.y;
    const m = Math.hypot(x, y);
    if (!m) { x = f.facing; y = 0; } else { x /= m; y /= m; }
    const p = f.body.getPosition();
    f.tongue = { phase: 'flying', direction: { x, y }, tip: { x: p.x, y: p.y }, distance: 0, length: 0 };
  }
  step() {
    const t = this.tuning;
    const surfaceFrame = prepareSurfaces(this);
    this.world.setGravity(Vec2(0, t.gravity));
    const coupled = new Set<Body>();
    for (const f of this.frogs) if (f.tongue?.phase === 'attached' && f.tongue.target?.isDynamic()) {
      coupled.add(f.body); coupled.add(f.tongue.target);
    }
    for (const f of this.frogs) {
      f.suppressSupport = Math.max(0, f.suppressSupport - DT);
      f.grounded = this.grounded(f);
      f.coyote = f.grounded ? t.coyoteSeconds : Math.max(0, f.coyote - DT);
      if (f.bufferedRelease) {
        f.bufferedRelease.remaining -= DT;
        if (f.bufferedRelease.remaining < 0) f.bufferedRelease = undefined;
      }
      for (const input of f.events) {
        if (input.held && !f.held) {
          f.bufferedRelease = undefined;
          if (f.grounded || f.coyote > 0 || this.nearLanding(f)) {
            this.detach(f); f.jumpPending = true; f.holdTime = 0; f.charge = 0;
            f.pressDirection = { ...input };
            f.landingWait = f.grounded || f.coyote > 0 ? 0 : t.jumpBufferSeconds;
          } else this.fire(f, input);
        }
        if (!input.held && f.held) {
          if (f.jumpPending) {
            f.bufferedRelease = { remaining: t.jumpBufferSeconds, x: input.x, charge: f.charge };
            f.jumpPending = false; f.charging = false; f.charge = 0; f.holdTime = 0;
          }
          this.detach(f);
        }
        f.held = input.held;
      }
      f.events = [];
      if (f.bufferedRelease && (f.grounded || f.coyote > 0)) {
        this.launch(f, f.bufferedRelease.x, f.bufferedRelease.charge);
      }
      if (f.jumpPending) {
        if (f.grounded) {
          f.landingWait = 0;
          f.holdTime += DT;
          f.charging = f.holdTime >= t.chargeThreshold;
          f.charge = f.charging ? Math.min(t.chargeSeconds, f.holdTime - t.chargeThreshold) : 0;
        } else if (f.landingWait > 0) {
          f.landingWait -= DT;
          if (f.landingWait <= 0) { f.jumpPending = false; if (f.held) this.fire(f, f.pressDirection); }
        } else if (f.coyote <= 0) {
          f.jumpPending = false; f.charging = false; f.charge = 0;
        }
      }
      const x = f.input.x;
      if (x) f.facing = x;
      const v = f.body.getLinearVelocity();
      let dv = x * t.airAcceleration * DT;
      if (f.grounded && coupled.has(f.body)) {
        // Do not let a neutral ground controller erase reciprocal grapple momentum.
        dv = x * Math.max(0, Math.min(t.groundAcceleration * DT, t.groundSpeed * (f.stickyMud ? SURFACES.mudGroundSpeedMultiplier : 1) - x * v.x));
      } else if (f.grounded && !f.tongue) {
        const target = x * t.groundSpeed * (f.stickyMud ? SURFACES.mudGroundSpeedMultiplier : 1);
        const a = (x ? t.groundAcceleration : t.groundBrake) * (f.slipperySoap ? (x ? SURFACES.soapAccelerationMultiplier : SURFACES.soapBrakeMultiplier) : 1);
        dv = Math.max(-a * DT, Math.min(a * DT, target - v.x));
      }
      f.body.applyLinearImpulse(Vec2(dv * f.body.getMass(), 0), f.body.getWorldCenter(), true);
    }
    // Apply pulls after every movement controller: frog order must not cancel target impulses.
    for (const f of this.frogs) this.updateTongue(f);
    this.world.step(DT, t.velocityIterations, t.positionIterations);
    this.tick++;
    for (const f of this.frogs) {
      f.grounded = this.grounded(f);
      if (f.grounded && f.bufferedRelease) this.launch(f, f.bufferedRelease.x, f.bufferedRelease.charge);
      if (f.tongue?.phase === 'attached') {
        const a = f.tongue.target!.getWorldPoint(Vec2(f.tongue.localAnchor!.x, f.tongue.localAnchor!.y));
        f.tongue.tip = { x: a.x, y: a.y };
      }
      const p = f.body.getPosition();
      if (!Number.isFinite(p.x + p.y) || p.x < -5 || p.x > WIDTH + 5 || p.y > HEIGHT + 5) {
        this.reset(); break;
      }
    }
    resolveSurfaces(this, surfaceFrame);
  }
  pullGrapple(f: Frog) {
    const tongue = f.tongue!;
    const target = tongue.target!;
    const anchor = target.getWorldPoint(Vec2(tongue.localAnchor!.x, tongue.localAnchor!.y));
    tongue.tip = { x: anchor.x, y: anchor.y };
    const p = f.body.getWorldCenter();
    const dx = anchor.x - p.x, dy = anchor.y - p.y, d = Math.hypot(dx, dy);
    const minLength = target.isDynamic() ? this.tuning.frogRadius * 2 + this.tuning.frogGrappleClearance
      : Math.max(this.tuning.grappleMinLength, this.tuning.frogRadius + 0.05);
    // Take up existing slack only. Never forcibly shorten a taut constraint.
    tongue.length = Math.max(target.isDynamic() ? minLength : Math.min(minLength, tongue.length), tongue.length - Math.min(
      this.tuning.grappleTakeupSpeed * DT, Math.max(0, tongue.length - Math.max(minLength, d)),
    ));
    tongue.joint!.setMaxLength(tongue.length);
    if (d <= minLength || d < 0.001) return;
    const nx = dx / d, ny = dy / d;
    const va = f.body.getLinearVelocity(), vb = target.getLinearVelocity();
    const closingSpeed = (va.x - vb.x) * nx + (va.y - vb.y) * ny;
    // Soft radial speed ceiling: stop adding inward impulse, never clamp carried velocity.
    const dv = Math.min(this.tuning.grapplePullAcceleration * (f.poisonPullFromTick !== undefined && this.tick >= f.poisonPullFromTick ? POISON_BALANCE.grapplePullMultiplier : 1) * DT,
      Math.max(0, this.tuning.grappleMaxPullSpeed - closingSpeed));
    const inverseMass = 1 / f.body.getMass() + (target.isDynamic() ? 1 / target.getMass() : 0);
    const impulse = Vec2(nx * dv / inverseMass, ny * dv / inverseMass);
    f.body.applyLinearImpulse(impulse, f.body.getWorldCenter(), true);
    if (target.isDynamic()) target.applyLinearImpulse(Vec2(-impulse.x, -impulse.y), target.getWorldCenter(), true);
  }
  updateTongue(f: Frog) {
    const tongue = f.tongue;
    if (!tongue) return;
    const t = this.tuning, p = f.body.getPosition();
    if (tongue.phase === 'attached') { this.pullGrapple(f); return; }
    if (tongue.phase === 'retracting') {
      const dx = p.x - tongue.tip.x, dy = p.y - tongue.tip.y, m = Math.hypot(dx, dy);
      if (m <= t.tongueRetractSpeed * DT) { f.tongue = undefined; return; }
      tongue.tip.x += dx / m * t.tongueRetractSpeed * DT;
      tongue.tip.y += dy / m * t.tongueRetractSpeed * DT;
      return;
    }
    const start = Vec2(tongue.tip.x, tongue.tip.y);
    const travel = Math.min(t.tongueSpeed * DT, Math.max(0, t.tongueRange - tongue.distance));
    const end = Vec2(start.x + tongue.direction.x * travel, start.y + tongue.direction.y * travel);
    let hit: { body: Body; point: { x: number; y: number } } | undefined;
    this.world.rayCast(start, end, (fixture, point, _normal, fraction) => {
      if (fixture.getBody() === f.body) return -1;
      hit = { body: fixture.getBody(), point: { x: point.x, y: point.y } }; return fraction;
    });
    tongue.distance += travel;
    if (hit) {
      const h = hit as { body: Body; point: { x: number; y: number } };
      tongue.tip = h.point;
      // Dynamic attachments use centers, avoiding offset ropes fighting body contact.
      const a = h.body.isDynamic() ? h.body.getWorldCenter().clone() : Vec2(h.point.x, h.point.y);
      tongue.length = Math.max(h.body.isDynamic() ? t.frogRadius * 2 + t.frogGrappleClearance : 0.05, Vec2.distance(p, a));
      const local = h.body.getLocalPoint(a);
      tongue.target = h.body; tongue.localAnchor = { x: local.x, y: local.y };
      tongue.joint = this.world.createJoint(new RopeJoint({
        maxLength: tongue.length, collideConnected: true, bodyA: f.body, bodyB: h.body,
        localAnchorA: Vec2(0, 0), localAnchorB: local,
      }))!;
      tongue.phase = 'attached'; this.pullGrapple(f);
    } else {
      tongue.tip = { x: end.x, y: end.y };
      if (tongue.distance >= t.tongueRange) tongue.phase = 'retracting';
    }
  }
  reset() {
    for (let i = 0; i < this.frogs.length; i++) {
      const f = this.frogs[i]; this.cancelAction(f); f.slipperySoap = undefined; f.stickyMud = undefined; f.surfaceBounceTick = undefined;
      f.body.setTransform(Vec2(i ? 20 : 12, 16), 0);
      f.body.setLinearVelocity(Vec2(0, 0)); f.body.setAngularVelocity(0);
      f.input = neutral(); f.grounded = false; f.coyote = 0; f.suppressSupport = 0;
    }
  }
}
