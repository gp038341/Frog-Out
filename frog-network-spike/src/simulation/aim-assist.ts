import {Vec2} from 'planck';
import type {Simulation,Frog} from './world';
/** Normal grabs get modest assistance; the modifier widens it, never adds homing. */
export const GRAPPLE_AIM={defaultDegrees:8,magnetDegrees:24,defaultLeadSeconds:.18,magnetLeadSeconds:.30};
const headingError=(a:number,b:number)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
/** One-time, bounded firing correction, with an optional short movement forecast. */
export function assistedDirection(sim:Simulation,source:Frog,direction:{x:number;y:number},degrees:number,maxLeadSeconds=0){
 const p=source.body.getPosition(),heading=Math.atan2(direction.y,direction.x),cone=degrees*Math.PI/180;
 const choices:{slot:number;angle:number;distance:number;x:number;y:number}[]=[];
 const blocked=(point:{x:number;y:number})=>{let hit=false;sim.world.rayCast(p,Vec2(point.x,point.y),(fixture,_point,_normal,fraction)=>{if(sim.frogs.some(f=>f.body===fixture.getBody()))return -1;hit=true;return fraction;});return hit;};
 sim.frogs.forEach((frog,slot)=>{
  if(frog===source||!frog.body.isDynamic())return;
  const target=frog.body.getPosition(),dx=target.x-p.x,dy=target.y-p.y,distance=Math.hypot(dx,dy);
  if(distance<1e-6||distance>sim.tuning.tongueRange)return;
  const angle=Math.abs(headingError(Math.atan2(dy,dx),heading));if(angle>cone+1e-10||blocked(target))return;
  const velocity=frog.body.getLinearVelocity();
  const constrained=frog.tongue?.phase==='attached'||sim.frogs.some(other=>other.tongue?.phase==='attached'&&other.tongue.target===frog.body);
  const gravity=frog.grounded||constrained?0:sim.tuning.gravity;
  let lead=Math.min(maxLeadSeconds,distance/sim.tuning.tongueSpeed),aim={x:target.x,y:target.y};
  // Two bounded forecast iterations account for tongue travel, not future player commands.
  for(let i=0;i<2;i++){aim={x:target.x+velocity.x*lead,y:target.y+velocity.y*lead+.5*gravity*lead*lead};lead=Math.min(maxLeadSeconds,Math.hypot(aim.x-p.x,aim.y-p.y)/sim.tuning.tongueSpeed);}
  const aimDistance=Math.hypot(aim.x-p.x,aim.y-p.y);if(aimDistance>sim.tuning.tongueRange||blocked(aim))return;
  // Do not divert an intentional terrain hit in front of the candidate.
  if(blocked({x:p.x+direction.x*Math.max(distance,aimDistance),y:p.y+direction.y*Math.max(distance,aimDistance)}))return;
  const wanted=headingError(Math.atan2(aim.y-p.y,aim.x-p.x),heading);
  const corrected=heading+Math.max(-cone,Math.min(cone,wanted));
  choices.push({slot,angle,distance,x:Math.cos(corrected),y:Math.sin(corrected)});
 });
 choices.sort((a,b)=>a.angle-b.angle||a.distance-b.distance||a.slot-b.slot);
 const best=choices[0];return best?{x:best.x,y:best.y,target:best.slot}:{...direction,target:undefined};
}
