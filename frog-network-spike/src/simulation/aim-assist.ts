import {Vec2} from 'planck';
import type {Simulation,Frog} from './world';
/** Committed, bounded firing correction; neither homing nor a range extension. */
export function assistedDirection(sim:Simulation,source:Frog,direction:{x:number;y:number},degrees:number){
 const p=source.body.getPosition();const choices:{slot:number;angle:number;distance:number;x:number;y:number}[]=[];
 sim.frogs.forEach((frog,slot)=>{if(frog===source||!frog.body.isDynamic())return;const target=frog.body.getPosition();const dx=target.x-p.x,dy=target.y-p.y,distance=Math.hypot(dx,dy);if(distance<1e-6||distance>sim.tuning.tongueRange)return;const x=dx/distance,y=dy/distance,angle=Math.acos(Math.max(-1,Math.min(1,x*direction.x+y*direction.y)));if(angle>degrees*Math.PI/180+1e-10)return;
  let blocked=false;sim.world.rayCast(p,target,(fixture,_point,_normal,fraction)=>{const b=fixture.getBody();if(b===source.body||sim.frogs.some(f=>f.body===b))return -1;blocked=true;return fraction;});if(blocked)return;
  // Keep an intentionally aimed terrain hit in front of this frog unchanged.
  let terrainAhead=false;sim.world.rayCast(p,Vec2(p.x+direction.x*distance,p.y+direction.y*distance),(fixture,_point,_normal,fraction)=>{if(sim.frogs.some(f=>f.body===fixture.getBody()))return -1;terrainAhead=true;return fraction;});if(terrainAhead)return;
  choices.push({slot,angle,distance,x,y});
 });choices.sort((a,b)=>a.angle-b.angle||a.distance-b.distance||a.slot-b.slot);const best=choices[0];return best?{x:best.x,y:best.y,target:best.slot}:{...direction,target:undefined};
}
