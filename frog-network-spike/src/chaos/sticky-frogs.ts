import {Vec2,type Body} from 'planck';
import type {Simulation,Frog} from '../simulation/world';
import {platformContact} from '../simulation/platform-contact';
import {DT,defaults} from '../simulation/config';
import {SURFACES} from '../simulation/surfaces';

/** Adhesion changes only this modifier's contacted frogs; no joints, teleports or fixture changes. */
export const STICKY={speed:5,acceleration:45,brake:55,adhesionSpeed:1,normalAcceleration:110,detachSpeed:5,reach:.14,jumpCooldownTicks:12};
type Point={x:number;y:number};
type Attachment={body:Body;point:Point;normal:Point;attachTick:number};
export type StickyState={paused:boolean;cooldowns:number[];attachments:({terrain:number;point:Point;normal:Point;attachTick:number}|null)[]};
export function stickyTerrain(sim:Simulation){const bodies:Body[]=[];for(let b=sim.world.getBodyList();b;b=b.getNext())if((!b.isDynamic()||(b.getUserData()as any)?.chaosPlatform)&&!(b.getUserData()as any)?.arenaPivot&&!sim.frogs.some(f=>f.body===b))bodies.push(b);return bodies;}
export class StickyFrogs{
 active=false;private pausedOverride?:boolean;private attachments=new Map<Frog,Attachment>();private cooldowns=new Map<Frog,number>();
 constructor(private sim:Simulation){}
 private get paused(){return this.pausedOverride??this.sim.frogChaos.paused;}
 configure(ids:readonly string[]){const active=ids.includes('sticky_frogs');if(active===this.active)return;this.active=active;this.reset();}
 reset(){for(const f of this.attachments.keys()){f.grounded=false;f.coyote=0;f.jumpPending=false;f.charging=false;f.charge=0;f.holdTime=0;f.landingWait=0;f.bufferedRelease=undefined;}this.attachments.clear();this.cooldowns.clear();this.pausedOverride=undefined;for(const f of this.sim.frogs){f.stickyAttachTick=undefined;f.stickyReleaseTick=undefined;}}
 private solid(body:Body){const d=body.getUserData()as any;return body.isActive()&&(!body.isDynamic()||d?.chaosPlatform)&&!d?.chaosBall&&!d?.chaosBallBoundary&&!this.sim.frogs.some(f=>f.body===body);}
 private eligible(f:Frog){return this.active&&f.body.isDynamic()&&f.body.isActive()&&!this.sim.frogChaos.trapped(f)&&f.suppressSupport<=0&&this.sim.tick>=(this.cooldowns.get(f)??0);}
 private frame(a:Attachment){const point=a.body.getWorldPoint(Vec2(a.point.x,a.point.y)),out=a.body.getWorldVector(Vec2(a.normal.x,a.normal.y));return{body:a.body,point,out,tangent:Vec2(-out.y,out.x)};}
 support(f:Frog){const a=this.attachments.get(f);return this.active&&a&&this.eligible(f)&&this.solid(a.body)?this.frame(a):undefined;}
 release(f:Frog,cooldown=STICKY.jumpCooldownTicks){if(this.attachments.delete(f))f.stickyReleaseTick=this.sim.tick;this.cooldowns.set(f,this.sim.tick+cooldown);f.grounded=false;f.coyote=0;}
 private remember(f:Frog,body:Body,point:Point,out:Point){const old=this.attachments.get(f);const p=body.getLocalPoint(Vec2(point.x,point.y)),n=body.getLocalVector(Vec2(out.x,out.y));this.attachments.set(f,{body,point:{x:p.x,y:p.y},normal:{x:n.x,y:n.y},attachTick:old?.body===body&&old.normal.x*n.x+old.normal.y*n.y>.7?old.attachTick:this.sim.tick});if(!old)f.stickyAttachTick=this.sim.tick;}
 private refresh(f:Frog){
  if(!this.eligible(f)){if(this.attachments.has(f))this.release(f);return;}
  const old=this.attachments.get(f),p=f.body.getPosition(),radius=this.sim.tuning.frogRadius;
  const contacts=[];for(let e=f.body.getContactList();e;e=e.next){const pc=platformContact(e.contact,f.body);if(!pc||!this.solid(pc.body))continue;const v=f.body.getLinearVelocity(),pv=pc.body.getLinearVelocityFromWorldPoint(pc.point);if(Vec2.dot(Vec2(v.x-pv.x,v.y-pv.y),pc.out)>STICKY.detachSpeed)continue;contacts.push(pc);}
  // At an inner corner, intentional diagonal input may transfer onto the adjoining face.
  // Neutral contact always prefers the current face; a short lock avoids alternate-contact chatter.
  if(old&&this.solid(old.body)&&this.sim.tick-old.attachTick>=6){const current=this.frame(old),input=Vec2(f.input.x,f.input.y),corner=contacts.find(c=>Vec2.dot(c.out,current.out)<.3&&Vec2.dot(input,current.out)>.3&&Vec2.dot(input,c.out)<-.3&&Math.abs(Vec2.dot(input,Vec2(-c.out.y,c.out.x)))>.3);if(corner){this.remember(f,corner.body,corner.point,corner.out);return;}}
  // Prefer an existing face while it remains within reach. Probe only this already-contacted body.
  if(old&&this.solid(old.body)){
   const frame=this.frame(old),pv=old.body.getLinearVelocityFromWorldPoint(frame.point),v=f.body.getLinearVelocity(),away=Vec2.dot(Vec2(v.x-pv.x,v.y-pv.y),frame.out);
   if(away>STICKY.detachSpeed){this.release(f);return;}
   let retained=false;this.sim.world.rayCast(p,Vec2(p.x-frame.out.x*(radius+STICKY.reach),p.y-frame.out.y*(radius+STICKY.reach)),(fix,point,normal,fraction)=>{if(fix.getBody()!==old.body||fix.isSensor())return -1;this.remember(f,old.body,point,normal);retained=true;return fraction;});if(retained)return;
  }
  const chosen=contacts.find(c=>old?.body===c.body)??contacts[0];if(chosen)this.remember(f,chosen.body,chosen.point,chosen.out);else if(old){this.attachments.delete(f);f.stickyReleaseTick=this.sim.tick;f.coyote=0;}
 }
 before(){if(!this.active)return;for(const f of this.sim.frogs)this.refresh(f);}
 after(){if(!this.active)return;for(const f of this.sim.frogs)this.refresh(f);}
 /** Controller operates in the contact frame, with reciprocal impulses at the real surface point. */
 move(f:Frog){const frame=this.support(f);if(!frame||this.paused)return false;const {body,point,out,tangent}=frame,v=f.body.getLinearVelocity(),pv=body.getLinearVelocityFromWorldPoint(point),rel=Vec2(v.x-pv.x,v.y-pv.y);
  const input=Vec2(f.input.x,f.input.y),length=input.length();if(length>1)input.mul(1/length);const command=Vec2.dot(input,tangent),material=Vec2.dot(out,body.getWorldVector(Vec2(0,-1)))>.5?(body.getUserData()as any)?.surface:undefined;
  const speed=STICKY.speed*(this.sim.tuning.groundSpeed/defaults.groundSpeed)*(material==='mud'?SURFACES.mudGroundSpeedMultiplier:1);
  const a=command?STICKY.acceleration*(this.sim.tuning.groundAcceleration/defaults.groundAcceleration):STICKY.brake;
  // Butterfeet/soap retain reduced tangential traction; adhesion and neutral holding remain reliable.
  const traction=command?(material==='soap'?SURFACES.soapAccelerationMultiplier:1):1;
  const dt=Math.max(-a*traction*DT,Math.min(a*traction*DT,command*speed-Vec2.dot(rel,tangent)));
  const dn=Math.max(-STICKY.normalAcceleration*DT,Math.min(STICKY.normalAcceleration*DT,-STICKY.adhesionSpeed-Vec2.dot(rel,out))),mass=f.body.getMass();
  const impulse=Vec2((tangent.x*dt+out.x*dn)*mass,(tangent.y*dt+out.y*dn)*mass);f.body.applyLinearImpulse(impulse,f.body.getWorldCenter(),true);if(body.isDynamic())body.applyLinearImpulse(Vec2(-impulse.x,-impulse.y),point,true);
  const gravity=Vec2(0,this.sim.tuning.gravity*f.body.getGravityScale()*mass);f.body.applyForce(Vec2(-gravity.x,-gravity.y),f.body.getWorldCenter(),true);if(body.isDynamic())body.applyForce(gravity,point,true);
  for(let e=f.body.getContactList();e;e=e.next)if(platformContact(e.contact,f.body)?.body===body)e.contact.setFriction(0);
  if(Math.abs(command)>.05)f.facing=command>0?1:-1;return true;
 }
 jump(f:Frog,charge:number){const frame=this.support(f);if(!frame)return false;const q=Math.min(1,charge/this.sim.tuning.chargeSeconds),speed=this.sim.tuning.jumpImpulse+(this.sim.tuning.chargedJumpImpulse-this.sim.tuning.jumpImpulse)*q,{out,tangent,body,point}=frame;
  const v=f.body.getLinearVelocity(),pv=body.getLinearVelocityFromWorldPoint(point),rel=Vec2(v.x-pv.x,v.y-pv.y),command=Math.max(-1,Math.min(1,Vec2.dot(Vec2(f.input.x,f.input.y),tangent))),normal=speed-Vec2.dot(rel,out),lateral=command*this.sim.tuning.chargeHorizontalImpulse*q;
  const impulse=Vec2((out.x*normal+tangent.x*lateral)*f.body.getMass(),(out.y*normal+tangent.y*lateral)*f.body.getMass());f.body.applyLinearImpulse(impulse,f.body.getWorldCenter(),true);if(body.isDynamic())body.applyLinearImpulse(Vec2(-impulse.x,-impulse.y),point,true);this.release(f);return true;
 }
 normal(f:Frog){return this.support(f)?.out;}
 capture():StickyState|undefined{if(!this.active)return;const terrain=stickyTerrain(this.sim);return{paused:this.paused,cooldowns:this.sim.frogs.map(f=>this.cooldowns.get(f)??0),attachments:this.sim.frogs.map(f=>{const a=this.attachments.get(f),index=a?terrain.indexOf(a.body):-1;return a&&index>=0&&this.solid(a.body)?{terrain:index,point:{...a.point},normal:{...a.normal},attachTick:a.attachTick}:null;})};}
 restore(state?:StickyState){this.active=!!state;this.attachments.clear();this.cooldowns.clear();if(!state)return;this.active=true;this.pausedOverride=state.paused;const terrain=stickyTerrain(this.sim);state.attachments.forEach((a,i)=>{const f=this.sim.frogs[i];if(f&&a&&terrain[a.terrain])this.attachments.set(f,{body:terrain[a.terrain],point:{...a.point},normal:{...a.normal},attachTick:a.attachTick});});state.cooldowns.forEach((t,i)=>{if(this.sim.frogs[i])this.cooldowns.set(this.sim.frogs[i],t);});}
}
