import {Vec2,type Body} from 'planck';
import type {Simulation,Frog} from './world';
/** Localized Sunny Pond effects. Base movement/grapple tuning is untouched. */
export const SURFACES={lilyLaunchSpeed:12,lilyMinLandingSpeed:.8,lilyCooldownTicks:12,mudGroundSpeedMultiplier:.75};
type Material='lily'|'mud';
function support(f:Frog):Material|undefined{
 let mud=false;
 for(let e=f.body.getContactList();e;e=e.next){const c=e.contact;if(!c.isTouching()||!c.isEnabled()||c.getFixtureA().isSensor()||c.getFixtureB().isSensor())continue;
  const a=c.getFixtureA().getBody(),b=c.getFixtureB().getBody(),normal=c.getWorldManifold(null)?.normal;
  if(!normal||(a===f.body?normal.y:-normal.y)<=.5)continue;
  const other:Body=a===f.body?b:a;if(other.isDynamic())continue;
  const data=other.getUserData()as{surface?:Material}|undefined;if(data?.surface==='lily')return 'lily';if(data?.surface==='mud')mud=true;
 }return mud?'mud':undefined;
}
export function prepareSurfaces(sim:Simulation){
 return sim.frogs.map(f=>{f.stickyMud=sim.grounded(f)&&support(f)==='mud'||undefined;return {down:f.body.getLinearVelocity().y,position:f.body.getPosition().clone()};});
}
export function resolveSurfaces(sim:Simulation,before:ReturnType<typeof prepareSurfaces>){
 sim.frogs.forEach((f,i)=>{const prior=before[i],p=f.body.getPosition();
  // Physical top contact + downward arrival, not a tongue hit, underside, side scrape or standing on a pad.
  // A buffered normal/charged jump already launched by the controller takes priority.
  if(prior&&prior.down>=SURFACES.lilyMinLandingSpeed&&p.y>=prior.position.y-.1&&f.body.getLinearVelocity().y>=-.5&&support(f)==='lily'&&sim.tick-(f.surfaceBounceTick??-1000)>=SURFACES.lilyCooldownTicks){
   const v=f.body.getLinearVelocity();f.body.applyLinearImpulse(Vec2(0,(-SURFACES.lilyLaunchSpeed-v.y)*f.body.getMass()),f.body.getWorldCenter(),true);
   f.surfaceBounceTick=sim.tick;f.grounded=false;f.coyote=0;f.suppressSupport=.06;
  }
  f.stickyMud=sim.grounded(f)&&support(f)==='mud'||undefined;
 });
}
