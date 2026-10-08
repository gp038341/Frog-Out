import {Vec2,type Body} from 'planck';
import type {Simulation,Frog} from './world';
/** Localized Sunny Pond effects. Base movement/grapple tuning is untouched. */
export const SURFACES={lilyLaunchSpeed:12,lilyImpactThreshold:14,lilyImpactEnergy:.8,lilyMaxLaunchSpeed:18,lilyCooldownTicks:12,mudGroundSpeedMultiplier:.75,soapAccelerationMultiplier:.3,soapBrakeMultiplier:.12,soapContactFriction:0};
/** Normal impact energy adds smoothly above the gentle-landing dead zone. */
export function bounceLaunchSpeed(impact:number){const v=Number.isFinite(impact)?Math.max(0,impact):0;return Math.min(SURFACES.lilyMaxLaunchSpeed,Math.sqrt(SURFACES.lilyLaunchSpeed**2+SURFACES.lilyImpactEnergy*Math.max(0,v*v-SURFACES.lilyImpactThreshold**2)));}
type Material='lily'|'mud'|'soap';
/** Observe approach speed before the contact solver removes it (including bullet/TOI contacts). */
export function bindSurfaceImpacts(sim:Simulation){sim.world.on('pre-solve',c=>{if(!c.isEnabled()||c.getFixtureA().isSensor()||c.getFixtureB().isSensor())return;const a=c.getFixtureA().getBody(),b=c.getFixtureB().getBody(),n=c.getWorldManifold(null)?.normal;if(!n)return;for(const f of sim.frogs){if(f.body!==a&&f.body!==b)continue;const other=a===f.body?b:a,sign=a===f.body?1:-1;if(other.isDynamic()||(other.getUserData()as{surface?:Material})?.surface!=='lily'||n.y*sign<=.5)continue;const v=f.body.getLinearVelocity(),speed=Math.max(0,(v.x*n.x+v.y*n.y)*sign),old=f.surfaceImpactSpeed;f.surfaceImpactSpeed=Math.max(speed,sim.tick-(f.surfaceImpactTick??-1000)<=SURFACES.lilyCooldownTicks?old??0:0);f.surfaceImpactTick=sim.tick;}});}

function lilyImpact(f:Frog,prior:{down:number;horizontal?:number}){let impact=0;for(let e=f.body.getContactList();e;e=e.next){const c=e.contact;if(!c.isTouching()||!c.isEnabled()||c.getFixtureA().isSensor()||c.getFixtureB().isSensor())continue;const a=c.getFixtureA().getBody(),b=c.getFixtureB().getBody(),n=c.getWorldManifold(null)?.normal,other=a===f.body?b:a;if(!n||other.isDynamic()||(other.getUserData()as{surface?:Material})?.surface!=='lily')continue;const sign=a===f.body?1:-1;if(n.y*sign<=.5)continue;impact=Math.max(impact,((prior.horizontal??0)*n.x+prior.down*n.y)*sign);}return impact;}

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
 return sim.frogs.map(f=>{const material=sim.grounded(f)?support(f):undefined;f.stickyMud=material==='mud'||undefined;f.slipperySoap=material==='soap'||undefined;for(let e=f.body.getContactList();e;e=e.next){const c=e.contact;c.resetFriction();const a=c.getFixtureA().getBody(),b=c.getFixtureB().getBody(),other=a===f.body?b:a,n=c.getWorldManifold(null)?.normal;if(f.slipperySoap&&n&&(a===f.body?n.y:-n.y)>.5&&(other.getUserData()as{surface?:Material}|undefined)?.surface==='soap')c.setFriction(SURFACES.soapContactFriction);}return {horizontal:f.body.getLinearVelocity().x,down:f.body.getLinearVelocity().y,position:f.body.getPosition().clone()};});
}
export function resolveSurfaces(sim:Simulation,before:ReturnType<typeof prepareSurfaces>){
 sim.frogs.forEach((f,i)=>{const prior=before[i],p=f.body.getPosition();
  // Any supported top contact auto-launches, including a resting frog; return landings repeat.
  // Side/underside/tongue contacts never trigger. Cooldown prevents duplicate solver impulses.
  // A buffered normal/charged jump already launched by the controller takes priority.
  if(prior&&p.y>=prior.position.y-.1&&f.suppressSupport<=0&&support(f)==='lily'&&sim.tick-(f.surfaceBounceTick??-1000)>=SURFACES.lilyCooldownTicks){
   const launch=bounceLaunchSpeed(Math.max(lilyImpact(f,prior),sim.tick-(f.surfaceImpactTick??-1000)<=SURFACES.lilyCooldownTicks?f.surfaceImpactSpeed??0:0)),v=f.body.getLinearVelocity();f.body.applyLinearImpulse(Vec2(0,(-launch-v.y)*f.body.getMass()),f.body.getWorldCenter(),true);
   f.surfaceImpactSpeed=undefined;f.surfaceImpactTick=undefined;f.surfaceBounceStrength=(launch-SURFACES.lilyLaunchSpeed)/(SURFACES.lilyMaxLaunchSpeed-SURFACES.lilyLaunchSpeed);f.surfaceBounceTick=sim.tick;f.grounded=false;f.coyote=0;f.suppressSupport=.06;
  }
  const material=sim.grounded(f)?support(f):undefined;f.stickyMud=material==='mud'||undefined;f.slipperySoap=material==='soap'||undefined;
 });
}
