import {Vec2,type Body} from 'planck';
import type {Simulation,Frog} from './world';
/** Localized Sunny Pond effects. Base movement/grapple tuning is untouched. */
export const SURFACES={lilyLaunchSpeed:12,lilyCooldownTicks:12,mudGroundSpeedMultiplier:.75,soapAccelerationMultiplier:.3,soapBrakeMultiplier:.12,soapContactFriction:0};
type Material='lily'|'mud'|'soap';
function support(f:Frog):Material|undefined{
 let mud=false,soap=false;
 for(let e=f.body.getContactList();e;e=e.next){const c=e.contact;if(!c.isTouching()||!c.isEnabled()||c.getFixtureA().isSensor()||c.getFixtureB().isSensor())continue;
  const a=c.getFixtureA().getBody(),b=c.getFixtureB().getBody(),normal=c.getWorldManifold(null)?.normal;
  if(!normal||(a===f.body?normal.y:-normal.y)<=.5)continue;
  const other:Body=a===f.body?b:a;if(other.isDynamic())continue;
  const data=other.getUserData()as{surface?:Material}|undefined;if(data?.surface==='lily')return 'lily';if(data?.surface==='mud')mud=true;if(data?.surface==='soap')soap=true;
 }return mud?'mud':soap?'soap':undefined;
}
export function prepareSurfaces(sim:Simulation){
 return sim.frogs.map(f=>{const material=sim.grounded(f)?support(f):undefined;f.stickyMud=material==='mud'||undefined;f.slipperySoap=material==='soap'||undefined;for(let e=f.body.getContactList();e;e=e.next){const c=e.contact;c.resetFriction();const a=c.getFixtureA().getBody(),b=c.getFixtureB().getBody(),other=a===f.body?b:a,n=c.getWorldManifold(null)?.normal;if(f.slipperySoap&&n&&(a===f.body?n.y:-n.y)>.5&&(other.getUserData()as{surface?:Material}|undefined)?.surface==='soap')c.setFriction(SURFACES.soapContactFriction);}return {down:f.body.getLinearVelocity().y,position:f.body.getPosition().clone()};});
}
export function resolveSurfaces(sim:Simulation,before:ReturnType<typeof prepareSurfaces>){
 sim.frogs.forEach((f,i)=>{const prior=before[i],p=f.body.getPosition();
  // Any supported top contact auto-launches, including a resting frog; return landings repeat.
  // Side/underside/tongue contacts never trigger. Cooldown prevents duplicate solver impulses.
  // A buffered normal/charged jump already launched by the controller takes priority.
  if(prior&&p.y>=prior.position.y-.1&&f.body.getLinearVelocity().y>=-.5&&support(f)==='lily'&&sim.tick-(f.surfaceBounceTick??-1000)>=SURFACES.lilyCooldownTicks){
   const v=f.body.getLinearVelocity();f.body.applyLinearImpulse(Vec2(0,(-SURFACES.lilyLaunchSpeed-v.y)*f.body.getMass()),f.body.getWorldCenter(),true);
   f.surfaceBounceTick=sim.tick;f.grounded=false;f.coyote=0;f.suppressSupport=.06;
  }
  const material=sim.grounded(f)?support(f):undefined;f.stickyMud=material==='mud'||undefined;f.slipperySoap=material==='soap'||undefined;
 });
}
