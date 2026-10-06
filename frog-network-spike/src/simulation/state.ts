import {Vec2, RopeJoint, type Body} from 'planck';
import {Simulation, type Input, type Tongue} from './world';
export type FrogState = {
 x:number; y:number; vx:number; vy:number; facing:number; input:Input; held:boolean;
 charging:boolean; charge:number; grounded:boolean; jumpPending:boolean; holdTime:number;
 coyote:number; suppressSupport:number; landingWait:number; pressDirection:Input;
 bufferedRelease?:{remaining:number;x:number;charge:number};
 tongue?:{phase:Tongue['phase'];direction:{x:number;y:number};tip:{x:number;y:number};distance:number;length:number;
 target?:{frog:number}|{terrain:number};localAnchor?:{x:number;y:number}};
};
export type PhysicsState={tick:number;frogs:FrogState[]};
export function capture(sim:Simulation):PhysicsState {
 const terrain:Body[]=[];for(let b=sim.world.getBodyList();b;b=b.getNext())if(!b.isDynamic())terrain.push(b);
 return {tick:sim.tick,frogs:sim.frogs.map(f=>{
  const p=f.body.getPosition(),v=f.body.getLinearVelocity(),t=f.tongue;
  let tongue:FrogState['tongue'];if(t){const frog=t.target?sim.frogs.findIndex(f=>f.body===t.target):-1;
   tongue={phase:t.phase,direction:{...t.direction},tip:{...t.tip},distance:t.distance,length:t.length,
    target:t.target?(frog>=0?{frog}:{terrain:terrain.indexOf(t.target)}):undefined,
    localAnchor:t.localAnchor?{...t.localAnchor}:undefined};}
  return {x:p.x,y:p.y,vx:v.x,vy:v.y,facing:f.facing,input:{...f.input},held:f.held,charging:f.charging,charge:f.charge,
   grounded:f.grounded,jumpPending:f.jumpPending,holdTime:f.holdTime,coyote:f.coyote,suppressSupport:f.suppressSupport,
   landingWait:f.landingWait,pressDirection:{...f.pressDirection},bufferedRelease:f.bufferedRelease?{...f.bufferedRelease}:undefined,tongue};
 })};
}
export function restore(sim:Simulation,state:PhysicsState){
 const terrain:Body[]=[];for(let b=sim.world.getBodyList();b;b=b.getNext())if(!b.isDynamic())terrain.push(b);
 for(const f of sim.frogs)sim.detach(f);
 sim.tick=state.tick;
 state.frogs.forEach((s,i)=>{const f=sim.frogs[i];f.body.setTransform(Vec2(s.x,s.y),0);f.body.setLinearVelocity(Vec2(s.vx,s.vy));f.body.setAngularVelocity(0);
  f.facing=s.facing;f.input={...s.input};f.events=[];f.held=s.held;f.charging=s.charging;f.charge=s.charge;f.grounded=s.grounded;
  f.jumpPending=s.jumpPending;f.holdTime=s.holdTime;f.coyote=s.coyote;f.suppressSupport=s.suppressSupport;f.landingWait=s.landingWait;
  f.pressDirection={...s.pressDirection};f.bufferedRelease=s.bufferedRelease?{...s.bufferedRelease}:undefined;
  const t=s.tongue;if(t){f.tongue={phase:t.phase,distance:t.distance,length:t.length,direction:{...t.direction},tip:{...t.tip},localAnchor:t.localAnchor?{...t.localAnchor}:undefined};
   if(t.phase==='attached'&&t.target&&t.localAnchor){const target='frog'in t.target?sim.frogs[t.target.frog].body:terrain[t.target.terrain];
    f.tongue.target=target;f.tongue.joint=sim.world.createJoint(new RopeJoint({maxLength:t.length,collideConnected:true,bodyA:f.body,bodyB:target,localAnchorA:Vec2(0,0),localAnchorB:Vec2(t.localAnchor.x,t.localAnchor.y)}))!;
   }
  }
 });
 // Refresh collision manifolds after restoring body transforms without advancing time.
 sim.world.step(0);
}
