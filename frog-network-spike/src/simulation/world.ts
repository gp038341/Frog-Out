import {StickyFrogs} from '../chaos/sticky-frogs';
import {ExtremeChaos} from '../chaos/extreme-chaos';
import {FrogChaos} from '../chaos/frog-chaos';
import {platformContact} from './platform-contact';
import {ArenaChaos} from '../chaos/arena-chaos';
import {assistedDirection,GRAPPLE_AIM} from './aim-assist';
import { World, Vec2, Box, Circle, RopeJoint, Body } from 'planck';
import {prepareSurfaces,resolveSurfaces,SURFACES,bindSurfaceImpacts} from './surfaces';
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
  stickyAttachTick?:number;stickyReleaseTick?:number;
  pogoTick?:number;gravityFlipTick?:number;balloonPopTick?:number;balloonBounceTick?:number;bubbleEscapePresses?:number;bubblePressTick?:number;balloonScale?:number;balloonInflated?:boolean;balloonWarning?:boolean;bumperTick?:number;swapTick?:number;swapProtectedUntil?:number;swapPartner?:number;bubbleId?:number;bubbleEscapeTick?:number;
  slipperySoap?: boolean; stickyMud?: boolean; surfaceBounceTick?: number; surfaceBounceStrength?: number; surfaceImpactSpeed?: number; surfaceImpactTick?: number;
  aimAssistTick?: number; aimAssistTarget?: number;
  poisonPullFromTick?: number;
  body: Body; facing: number; input: Input; events: Input[]; held: boolean;
  charging: boolean; charge: number; grounded: boolean; tongue?: Tongue;
  jumpPending: boolean; holdTime: number; coyote: number; suppressSupport: number;
  landingWait: number; pressDirection: Input;
  bufferedRelease?: { remaining: number; x: number; charge: number };
};
const neutral = (): Input => ({ x: 0, y: 0, held: false });
export class Simulation {
  stickyFrogs = new StickyFrogs(this);
  extremeChaos = new ExtremeChaos(this);
  chaosGravityDirection:1|-1=1;
  arenaChaos = new ArenaChaos(this);
  frogChaos = new FrogChaos(this);
  chaosAimDegrees = GRAPPLE_AIM.defaultDegrees;
  chaosAimLeadSeconds = GRAPPLE_AIM.defaultLeadSeconds;
  chaosSuperSuckers = false;
  chaosTurbo = false;
  chaosMoon = false;
  chaosMoonDragX = 1.5;
  chaosMoonDragY = .6;
  chaosMoonFallSpeed = 4.2;
  chaosButterfeet = false;
  chaosGroundFriction = .03;
  world: World;
  frogs: Frog[] = [];
  tick = 0;
  constructor(public tuning: Tuning = { ...defaults }) {
    this.world = new World(Vec2(0, tuning.gravity));
    bindSurfaceImpacts(this);
    this.frogChaos.bind();
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
    if (f.suppressSupport > 0) return false;
    if(this.stickyFrogs.support(f))return true;
    if(this.chaosGravityDirection<0)return this.extremeChaos.ceilingGrounded(f);
    const ascending=f.body.getLinearVelocity().y < -0.5;
    for (let e = f.body.getContactList(); e; e = e.next) {
      const c = e.contact;
      if (!c.isTouching()) continue;
      const n = c.getWorldManifold(null)?.normal;
      const support=platformContact(c,f.body);
      if(support?.rotating){const v=f.body.getLinearVelocity(),pv=support.body.getLinearVelocityFromWorldPoint(support.point);if(support.top&&(v.x-pv.x)*support.out.x+(v.y-pv.y)*support.out.y<=.5)return true;continue;}
      if (n && (c.getFixtureA().getBody() === f.body ? n.y : -n.y) > 0.5) {const other=c.getFixtureA().getBody()===f.body?c.getFixtureB().getBody():c.getFixtureA().getBody();if(!ascending||((other.getUserData()as{chaosPlatform?:boolean}|undefined)?.chaosPlatform&&f.body.getLinearVelocity().y-other.getLinearVelocityFromWorldPoint(f.body.getWorldCenter()).y>=-.5))return true;}
    }
    return false;
  }
  nearLanding(f: Frog) {
    if(this.chaosGravityDirection<0)return this.extremeChaos.ceilingNearLanding(f);
    const v = f.body.getLinearVelocity();
    if (v.y <= 0 || f.tongue || f.suppressSupport > 0) return false;
    const p = f.body.getPosition();
    const reach = this.tuning.frogRadius + v.y * this.tuning.jumpBufferSeconds + 0.04 * (this.tuning.frogRadius / defaults.frogRadius);
    let support = false;
    // A short downward probe disambiguates a landing tap from an airborne tongue press.
    this.world.rayCast(p, Vec2(p.x, p.y + reach), (fixture, _point, normal, fraction) => {
      if (fixture.getBody() === f.body || (fixture.getBody().getUserData()as{chaosBallBoundary?:boolean}|undefined)?.chaosBallBoundary || normal.y > -0.5) return -1;
      support = true; return fraction;
    });
    return support;
  }
  launch(f: Frog, x: number, charge: number) {
    const q = Math.min(1, charge / this.tuning.chargeSeconds);
    const vertical = this.tuning.jumpImpulse + (this.tuning.chargedJumpImpulse - this.tuning.jumpImpulse) * q;
    // Set a predictable upward launch speed; retain horizontal carried momentum.
    if(!this.stickyFrogs.jump(f,charge)){
    const vy = f.body.getLinearVelocity().y;
    f.body.applyLinearImpulse(Vec2(
      x * this.tuning.chargeHorizontalImpulse * q * f.body.getMass(),
      (-vertical * this.chaosGravityDirection - vy) * f.body.getMass(),
    ), f.body.getWorldCenter(), true);
    }
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
    if(this.chaosAimDegrees>0){const aim=assistedDirection(this,f,{x,y},this.chaosAimDegrees,this.chaosAimLeadSeconds);x=aim.x;y=aim.y;f.aimAssistTarget=aim.target;f.aimAssistTick=aim.target===undefined?undefined:this.tick;}else{f.aimAssistTarget=undefined;f.aimAssistTick=undefined;}
    f.tongue = { phase: 'flying', direction: { x, y }, tip: { x: p.x, y: p.y }, distance: 0, length: 0 };
  }
  step() {
    const t = this.tuning;
    this.arenaChaos.before();
    this.frogChaos.before();
    this.extremeChaos.before();
    this.stickyFrogs.before();
    const surfaceFrame = prepareSurfaces(this);
    if(this.chaosButterfeet)for(let c=this.world.getContactList();c;c=c.getNext()){
      if(this.frogs.some(f=>f.body===c.getFixtureA().getBody()||f.body===c.getFixtureB().getBody()))c.setFriction(Math.min(c.getFriction(),this.chaosGroundFriction));
    }
    this.world.setGravity(Vec2(0, t.gravity));
    const coupled = new Set<Body>();
    for (const f of this.frogs) if (f.tongue?.phase === 'attached' && f.tongue.target?.isDynamic()) {
      coupled.add(f.body); coupled.add(f.tongue.target);
    }
    for (const f of this.frogs) {
      if(!f.body.isActive())continue;
      if(this.frogChaos.trapped(f)){f.grounded=false;f.charging=false;f.coyote=0;continue;}
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
      if(this.stickyFrogs.move(f))continue;
      const x = f.input.x;
      if (x) f.facing = Math.sign(x);
      // Moon resistance affects free flight only; neither end of a live grapple is damped.
      if(this.chaosMoon && !f.grounded && f.tongue?.phase !== 'attached' && !coupled.has(f.body)){
        const velocity=f.body.getLinearVelocity();
        const vy=velocity.y*Math.exp(-this.chaosMoonDragY*DT);
        f.body.setLinearVelocity(Vec2(velocity.x*Math.exp(-this.chaosMoonDragX*DT),Math.min(vy,Math.max(0,this.chaosMoonFallSpeed-t.gravity*DT))));
      }
      const v = f.body.getLinearVelocity();
      let dv = x * t.airAcceleration * DT;
      if (f.grounded && coupled.has(f.body)) {
        // Do not let a neutral ground controller erase reciprocal grapple momentum.
        dv = x * Math.max(0, Math.min(t.groundAcceleration * DT, t.groundSpeed * (f.stickyMud ? SURFACES.mudGroundSpeedMultiplier : 1) - x * v.x));
      } else if (f.grounded && !f.tongue) {
        const target = x * t.groundSpeed * (f.stickyMud ? SURFACES.mudGroundSpeedMultiplier : 1);
        const soap = f.slipperySoap ? (x ? SURFACES.soapAccelerationMultiplier : SURFACES.soapBrakeMultiplier) : 1;
        const a = this.chaosButterfeet ? (x ? defaults.groundAcceleration : defaults.groundBrake) * Math.min(x ? t.groundAcceleration / defaults.groundAcceleration : t.groundBrake / defaults.groundBrake, soap) : (x ? t.groundAcceleration : t.groundBrake) * soap;
        dv = Math.max(-a * DT, Math.min(a * DT, target - v.x));
      }
      f.body.applyLinearImpulse(Vec2(dv * f.body.getMass(), 0), f.body.getWorldCenter(), true);
    }
    // Apply pulls after every movement controller: frog order must not cancel target impulses.
    for (const f of this.frogs) this.updateTongue(f);
    this.arenaChaos.applyWind();
    this.world.step(DT, t.velocityIterations, t.positionIterations);
    this.tick++;
    for (const f of this.frogs) {
      if(!f.body.isActive())continue;
      f.grounded = this.grounded(f);
      if (f.grounded && f.bufferedRelease) this.launch(f, f.bufferedRelease.x, f.bufferedRelease.charge);
      if (f.tongue?.phase === 'attached') {
        const a = f.tongue.target!.getWorldPoint(Vec2(f.tongue.localAnchor!.x, f.tongue.localAnchor!.y));
        f.tongue.tip = { x: a.x, y: a.y };
      }
      const p = f.body.getPosition();
      if (!Number.isFinite(p.x + p.y) || p.x < -5 || p.x > WIDTH + 5 || p.y > HEIGHT + 5 || this.chaosGravityDirection<0&&p.y < -5) {
        this.reset(); break;
      }
    }
    resolveSurfaces(this, surfaceFrame);
    this.arenaChaos.after();
    this.frogChaos.after();
    this.extremeChaos.after();
    this.stickyFrogs.after();
    if(!this.frogChaos.deferContacts)this.frogChaos.resolveContacts();
  }
  pullGrapple(f: Frog) {
    const tongue = f.tongue!;
    const target = tongue.target!;
    const anchor = target.getWorldPoint(Vec2(tongue.localAnchor!.x, tongue.localAnchor!.y));
    tongue.tip = { x: anchor.x, y: anchor.y };
    const p = f.body.getWorldCenter();
    const dx = anchor.x - p.x, dy = anchor.y - p.y, d = Math.hypot(dx, dy);
    const rotatingPlatform=!!(target.getUserData() as {chaosPlatform?:boolean}|undefined)?.chaosPlatform;
    const frogTarget=target.isDynamic()&&!rotatingPlatform;
    const minLength = frogTarget ? this.tuning.frogRadius * 2 + this.tuning.frogGrappleClearance
      : Math.max(this.tuning.grappleMinLength, this.tuning.frogRadius + 0.05 * (this.tuning.frogRadius / defaults.frogRadius));
    // Take up existing slack only. Never forcibly shorten a taut constraint.
    tongue.length = Math.max(frogTarget ? minLength : Math.min(minLength, tongue.length), tongue.length - Math.min(
      this.tuning.grappleTakeupSpeed * DT, Math.max(0, tongue.length - Math.max(minLength, d)),
    ));
    tongue.joint!.setMaxLength(tongue.length);
    if (d <= minLength || d < 0.001) return;
    const nx = dx / d, ny = dy / d;
    const va = f.body.getLinearVelocity(), vb = rotatingPlatform?target.getLinearVelocityFromWorldPoint(anchor):target.getLinearVelocity();
    const closingSpeed = (va.x - vb.x) * nx + (va.y - vb.y) * ny;
    // Soft radial speed ceiling: stop adding inward impulse, never clamp carried velocity.
    const dv = Math.min(this.tuning.grapplePullAcceleration * (f.poisonPullFromTick !== undefined && this.tick >= f.poisonPullFromTick ? POISON_BALANCE.grapplePullMultiplier : 1) * DT,
      Math.max(0, this.tuning.grappleMaxPullSpeed - closingSpeed));
    const center=target.getWorldCenter(),lever=(anchor.x-center.x)*ny-(anchor.y-center.y)*nx;
    const inverseMass = 1 / f.body.getMass() + (target.isDynamic() ? rotatingPlatform?lever*lever/target.getInertia():1/target.getMass() : 0);
    const impulse = Vec2(nx * dv / inverseMass, ny * dv / inverseMass);
    f.body.applyLinearImpulse(impulse, f.body.getWorldCenter(), true);
    if (target.isDynamic()) target.applyLinearImpulse(Vec2(-impulse.x, -impulse.y), rotatingPlatform?anchor:target.getWorldCenter(), true);
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
      if (fixture.getBody() === f.body || (fixture.getBody().getUserData() as {frozenTag?:boolean;chaosBall?:boolean;chaosBallBoundary?:boolean}|undefined)?.frozenTag || (fixture.getBody().getUserData() as {chaosBall?:boolean}|undefined)?.chaosBall || (fixture.getBody().getUserData() as {chaosBallBoundary?:boolean}|undefined)?.chaosBallBoundary) return -1;
      hit = { body: fixture.getBody(), point: { x: point.x, y: point.y } }; return fraction;
    });
    tongue.distance += travel;
    if (hit) {
      const h = hit as { body: Body; point: { x: number; y: number } };
      tongue.tip = h.point;
      // Only frogs use center anchors. Rotating terrain keeps the exact raycast hit.
      const frogTarget=this.frogs.some(other=>other.body===h.body);
      const a = frogTarget ? h.body.getWorldCenter().clone() : Vec2(h.point.x, h.point.y);
      tongue.length = Math.max(frogTarget ? t.frogRadius * 2 + t.frogGrappleClearance : 0.05, Vec2.distance(p, a));
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
    this.arenaChaos.reset();
    this.frogChaos.reset();
    this.extremeChaos.reset();
    this.stickyFrogs.reset();
    for (let i = 0; i < this.frogs.length; i++) {
      const f = this.frogs[i]; this.cancelAction(f); f.slipperySoap = undefined; f.stickyMud = undefined; f.surfaceBounceTick = undefined; f.surfaceBounceStrength = undefined; f.surfaceImpactSpeed = undefined; f.surfaceImpactTick = undefined;
      f.body.setTransform(Vec2(i ? 20 : 12, 16), 0);
      f.body.setLinearVelocity(Vec2(0, 0)); f.body.setAngularVelocity(0);
      f.input = neutral(); f.grounded = false; f.coyote = 0; f.suppressSupport = 0;
    }
  }
}
