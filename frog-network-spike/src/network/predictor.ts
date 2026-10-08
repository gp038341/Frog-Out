import {syncFrozenBodies,stepFrozenBodies} from '../game/frozen-bodies';
import {Simulation} from '../simulation/world';
import {restore} from '../simulation/state';
import {DT} from '../simulation/config';
import {NETWORK,type Command,type Snapshot} from './protocol';
export class Predictor {
 frozen:boolean[]=[];
 sim=new Simulation();pending:Command[]=[];time=0;slot=-1;initialized=false;
 visualOffsets=[{x:0,y:0},{x:0,y:0}];
 corrections:number[]=[];snaps=0;lastCorrection=0;
 add(command:Command){this.pending.push(command);if(this.initialized&&this.slot>=0)this.sim.setInput(this.slot,command.input);}
 reconcile(snapshot:Snapshot,nowServer:number,offset:number){
  if(this.slot<0)return;
  if(this.initialized)this.advance(nowServer);
  const prior=this.initialized?this.sim.frogs.map(f=>f.body.getPosition().clone()):undefined;
  this.pending=this.pending.filter(c=>c.seq>snapshot.ack[this.slot]);
  this.frozen=snapshot.frozen??[];syncFrozenBodies(this.sim);restore(this.sim,snapshot.state);syncFrozenBodies(this.sim,this.frozen);this.time=snapshot.serverTime;this.initialized=true;
  // Reapply only unacknowledged commands at their sampled times. Remote inputs are held at latest known values.
  let next=0;
  const limit=Math.min(nowServer,snapshot.serverTime+NETWORK.maxPredictionMs);
  while(this.time+DT*1000<=limit){
   while(next<this.pending.length&&this.pending[next].at+offset<=this.time+DT*1000){this.sim.setInput(this.slot,this.pending[next++].input);}
   if(this.frozen.some(Boolean))stepFrozenBodies(this.sim,this.frozen,()=>this.sim.step());else this.sim.step();this.time+=DT*1000;
  }
  while(next<this.pending.length&&this.pending[next].at+offset<=limit)this.sim.setInput(this.slot,this.pending[next++].input);
  while(this.visualOffsets.length<this.sim.frogs.length)this.visualOffsets.push({x:0,y:0});
  if(prior&&prior.length===this.sim.frogs.length){for(let i=0;i<this.sim.frogs.length;i++){const p=this.sim.frogs[i].body.getPosition();const d=Math.hypot(p.x-prior[i].x,p.y-prior[i].y);if(d>NETWORK.snapDistance)this.visualOffsets[i]={x:0,y:0};else{this.visualOffsets[i].x+=prior[i].x-p.x;this.visualOffsets[i].y+=prior[i].y-p.y;}}const p=this.sim.frogs[this.slot].body.getPosition();this.lastCorrection=Math.hypot(p.x-prior[this.slot].x,p.y-prior[this.slot].y);this.corrections.push(this.lastCorrection);if(this.corrections.length>1000)this.corrections.shift();if(this.lastCorrection>NETWORK.snapDistance)this.snaps++;}
 }
 advance(nowServer:number){if(!this.initialized)return;let n=0;while(this.time+DT*1000<=nowServer&&n<6){if(this.frozen.some(Boolean))stepFrozenBodies(this.sim,this.frozen,()=>this.sim.step());else this.sim.step();this.time+=DT*1000;n++;}}
}
