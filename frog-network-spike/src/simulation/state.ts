import type {ArenaMechanicsState} from './arena-mechanics';
import type {StickyState} from '../chaos/sticky-frogs';
import type {ExtremeChaosState} from '../chaos/extreme-chaos';
import type {FrogChaosState} from '../chaos/frog-chaos';
import type {ArenaChaosState} from '../chaos/arena-chaos';
import {resizeFrogs} from './frog-size';
import {sizeSimulation} from './roster';
import {Vec2, RopeJoint, type Body} from 'planck';
import {Simulation, type Input, type Tongue} from './world';
export type FrogState = {
 active?:boolean;
 stickyNormal?:{x:number;y:number};stickyAttachTick?:number;stickyReleaseTick?:number;
 chaosBubbles?:{id:number;x:number;y:number;slot?:number}[];
 gravityDirection?:1|-1;gravityWarningSeconds?:number;pogoTick?:number;gravityFlipTick?:number;balloonPopTick?:number;balloonBounceTick?:number;bubbleEscapePresses?:number;bubblePressTick?:number;balloonScale?:number;balloonInflated?:boolean;balloonWarning?:boolean;bumperTick?:number;swapTick?:number;swapProtectedUntil?:number;swapPartner?:number;bubbleId?:number;bubbleEscapeTick?:number;
 radius?:number;chaosTurbo?:boolean;chaosSuperSuckers?:boolean;aimAssistTick?:number;aimAssistTarget?:number;
 slipperySoap?:boolean;stickyMud?:boolean;surfaceBounceTick?:number;surfaceBounceStrength?:number;surfaceImpactSpeed?:number;surfaceImpactTick?:number;
 poisonPullFromTick?:number;
 x:number; y:number; vx:number; vy:number; facing:number; input:Input; held:boolean;
 charging:boolean; charge:number; grounded:boolean; jumpPending:boolean; holdTime:number;
 coyote:number; suppressSupport:number; landingWait:number; pressDirection:Input;
 bufferedRelease?:{remaining:number;x:number;charge:number};
 tongue?:{phase:Tongue['phase'];direction:{x:number;y:number};tip:{x:number;y:number};distance:number;length:number;
 target?:{frog:number}|{terrain:number};localAnchor?:{x:number;y:number}};
};
export type PhysicsState={tick:number;frogs:FrogState[];arenaMechanics?:ArenaMechanicsState;stickyFrogs?:StickyState;extremeChaos?:ExtremeChaosState;arenaChaos?:ArenaChaosState;frogChaos?:FrogChaosState};
export function capture(sim:Simulation):PhysicsState {
 const arenaMechanics=sim.arenaMechanics.capture(),stickyFrogs=sim.stickyFrogs.capture(),extremeChaos=sim.extremeChaos.capture(),frogChaos=sim.frogChaos.capture(),arenaChaos=sim.arenaChaos.capture();
 const terrain:Body[]=[];for(let b=sim.world.getBodyList();b;b=b.getNext())if((!b.isDynamic()||(b.getUserData()as{chaosPlatform?:boolean}|undefined)?.chaosPlatform)&&!(b.getUserData()as{arenaPivot?:boolean}|undefined)?.arenaPivot&&!sim.frogs.some(f=>f.body===b))terrain.push(b);
 return {tick:sim.tick,...(arenaMechanics?{arenaMechanics}:{}),...(stickyFrogs?{stickyFrogs}:{}),...(extremeChaos?{extremeChaos}:{}),...(frogChaos?{frogChaos}:{}),...(arenaChaos?{arenaChaos}:{}),frogs:sim.frogs.map(f=>{
  const p=f.body.getPosition(),v=f.body.getLinearVelocity(),t=f.tongue;
  let tongue:FrogState['tongue'];if(t){const frog=t.target?sim.frogs.findIndex(f=>f.body===t.target):-1;
   tongue={phase:t.phase,direction:{...t.direction},tip:{...t.tip},distance:t.distance,length:t.length,
    target:t.target?(frog>=0?{frog}:{terrain:terrain.indexOf(t.target)}):undefined,
    localAnchor:t.localAnchor?{...t.localAnchor}:undefined};}
  const stickyNormal=sim.stickyFrogs.normal(f);
  return {active:f.body.isActive(),stickyNormal:stickyNormal?{x:stickyNormal.x,y:stickyNormal.y}:undefined,stickyAttachTick:f.stickyAttachTick,stickyReleaseTick:f.stickyReleaseTick,...(f===sim.frogs[0]&&frogChaos?{chaosBubbles:frogChaos.bubbles.map(({id,x,y,slot})=>({id,x,y,slot}))}:{}),gravityDirection:sim.extremeChaos.gravityActive?sim.chaosGravityDirection:undefined,gravityWarningSeconds:sim.extremeChaos.warningSeconds,pogoTick:f.pogoTick,gravityFlipTick:f.gravityFlipTick,balloonPopTick:f.balloonPopTick,balloonBounceTick:f.balloonBounceTick,bubbleEscapePresses:f.bubbleEscapePresses,bubblePressTick:f.bubblePressTick,balloonScale:f.balloonScale,balloonInflated:f.balloonInflated,balloonWarning:f.balloonWarning,bumperTick:f.bumperTick,swapTick:f.swapTick,swapProtectedUntil:f.swapProtectedUntil,swapPartner:f.swapPartner,bubbleId:f.bubbleId,bubbleEscapeTick:f.bubbleEscapeTick,radius:sim.tuning.frogRadius,chaosTurbo:sim.chaosTurbo,chaosSuperSuckers:sim.chaosSuperSuckers,aimAssistTick:f.aimAssistTick,aimAssistTarget:f.aimAssistTarget,slipperySoap:f.slipperySoap,stickyMud:f.stickyMud,surfaceBounceTick:f.surfaceBounceTick,surfaceBounceStrength:f.surfaceBounceStrength,surfaceImpactSpeed:f.surfaceImpactSpeed,surfaceImpactTick:f.surfaceImpactTick,poisonPullFromTick:f.poisonPullFromTick,x:p.x,y:p.y,vx:v.x,vy:v.y,facing:f.facing,input:{...f.input},held:f.held,charging:f.charging,charge:f.charge,
   grounded:f.grounded,jumpPending:f.jumpPending,holdTime:f.holdTime,coyote:f.coyote,suppressSupport:f.suppressSupport,
   landingWait:f.landingWait,pressDirection:{...f.pressDirection},bufferedRelease:f.bufferedRelease?{...f.bufferedRelease}:undefined,tongue};
 })};
}
export function restore(sim:Simulation,state:PhysicsState){
 if(state.frogs[0]?.radius!==undefined)sim.tuning.frogRadius=state.frogs[0].radius;
 sizeSimulation(sim,state.frogs.length);resizeFrogs(sim);
 const terrain:Body[]=[];for(let b=sim.world.getBodyList();b;b=b.getNext())if((!b.isDynamic()||(b.getUserData()as{chaosPlatform?:boolean}|undefined)?.chaosPlatform)&&!(b.getUserData()as{arenaPivot?:boolean}|undefined)?.arenaPivot&&!sim.frogs.some(f=>f.body===b))terrain.push(b);
 for(const f of sim.frogs)sim.detach(f);
 sim.tick=state.tick;sim.arenaChaos.restore(state.arenaChaos);sim.arenaMechanics.restore(state.arenaMechanics);
 state.frogs.forEach((s,i)=>{const f=sim.frogs[i];f.body.setActive(s.active!==false);f.body.setTransform(Vec2(s.x,s.y),0);f.body.setLinearVelocity(Vec2(s.vx,s.vy));f.body.setAngularVelocity(0);
  for(const key of ['stickyAttachTick','stickyReleaseTick','pogoTick','gravityFlipTick','balloonPopTick','balloonBounceTick','bubbleEscapePresses','bubblePressTick','balloonScale','balloonInflated','balloonWarning','bumperTick','swapTick','swapProtectedUntil','swapPartner','bubbleId','bubbleEscapeTick'] as const)(f as any)[key]=s[key];
  f.aimAssistTick=s.aimAssistTick;f.aimAssistTarget=s.aimAssistTarget;f.slipperySoap=s.slipperySoap;f.stickyMud=s.stickyMud;f.surfaceBounceTick=s.surfaceBounceTick;f.surfaceBounceStrength=s.surfaceBounceStrength;f.surfaceImpactSpeed=s.surfaceImpactSpeed;f.surfaceImpactTick=s.surfaceImpactTick;f.poisonPullFromTick=s.poisonPullFromTick;f.facing=s.facing;f.input={...s.input};f.events=[];f.held=s.held;f.charging=s.charging;f.charge=s.charge;f.grounded=s.grounded;
  f.jumpPending=s.jumpPending;f.holdTime=s.holdTime;f.coyote=s.coyote;f.suppressSupport=s.suppressSupport;f.landingWait=s.landingWait;
  f.pressDirection={...s.pressDirection};f.bufferedRelease=s.bufferedRelease?{...s.bufferedRelease}:undefined;
  const t=s.tongue;if(t){f.tongue={phase:t.phase,distance:t.distance,length:t.length,direction:{...t.direction},tip:{...t.tip},localAnchor:t.localAnchor?{...t.localAnchor}:undefined};
   if(t.phase==='attached'&&t.target&&t.localAnchor){const target='frog'in t.target?sim.frogs[t.target.frog].body:terrain[t.target.terrain];
    f.tongue.target=target;f.tongue.joint=sim.world.createJoint(new RopeJoint({maxLength:t.length,collideConnected:true,bodyA:f.body,bodyB:target,localAnchorA:Vec2(0,0),localAnchorB:Vec2(t.localAnchor.x,t.localAnchor.y)}))!;
   }
  }
 });
 // Refresh collision manifolds after restoring body transforms without advancing time.
 sim.frogChaos.restore(state.frogChaos);
 sim.extremeChaos.restore(state.extremeChaos);
 sim.stickyFrogs.restore(state.stickyFrogs);
 sim.world.step(0);
 // New environmental contacts must not invent impact history during a zero-time restore.
 if(state.arenaMechanics)state.frogs.forEach((v,i)=>{sim.frogs[i].surfaceImpactSpeed=v.surfaceImpactSpeed;sim.frogs[i].surfaceImpactTick=v.surfaceImpactTick;});
}
