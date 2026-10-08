import {simulationArena} from '../src/simulation/arena-adapter';
import {Room, type Client} from '@colyseus/core';
import {Vec2} from 'planck';
import {performance} from 'node:perf_hooks';
import {Simulation, type Input} from '../src/simulation/world';
import {capture} from '../src/simulation/state';
import {DT} from '../src/simulation/config';
import {NETWORK, type Command, type Snapshot} from '../src/network/protocol';
import {summary} from './metrics';
const neutral=():Input=>({x:0,y:0,held:false});
export class SpikeRoom extends Room {
 frozenSnapshot?:boolean[];
 maxClients=2;
 sim=new Simulation();
 slots=new Map<string,number>(); ack=[0,0]; queues:Command[][]=[[],[]];
 lastInput=[0,0]; times:number[]=[]; overruns=0; resetId=0; received=[0,0]; drops=0;
 lastClock=performance.now(); accumulator=0;
 onCreate(){
  if(process.env.ENABLE_TESTS==='1')this.onMessage('scenario',(_client:Client,name:string)=>{
   this.sim.reset();this.queues=this.queues.map(()=>[]);this.resetId++;
   const positions:Record<string,number[][]>={charge:[[12,16],[20,16]],terrain:[[16,11],[24,10]],frogs:[[12,9],[14,9]],collision:[[13,16],[17,16]],landing:[[12,16.4],[20,16.4]]};
   const p=positions[name];if(!p)return;
   this.sim.frogs.forEach((f,i)=>{f.body.setTransform(Vec2(p[i][0],p[i][1]),0);if(name==='landing')f.body.setLinearVelocity(Vec2(0,4));if(name==='frogs')f.body.setLinearVelocity(Vec2(0,-8));});
  });
  this.onMessage('hello',(client:Client)=>client.send('welcome',{slot:this.slots.get(client.sessionId),network:NETWORK}));
  this.onMessage('input',(client:Client,raw:Command)=>{
   const i=this.slots.get(client.sessionId);if(i===undefined||!raw||!Number.isSafeInteger(raw.seq)||raw.seq<=this.received[i]||raw.seq>this.received[i]+10000)return;
   const input=raw.input;if(!input||![input.x,input.y].every(x=>Number.isInteger(x)&&Math.abs(x)<=1)||typeof input.held!=='boolean')return;
   if(this.queues[i].length>=120){this.drops++;return;}
   this.received[i]=raw.seq;this.lastInput[i]=Date.now();
   this.queues[i].push({seq:raw.seq,at:0,input:{x:input.x,y:input.y,held:input.held}});
  });
  this.onMessage('ping',(client:Client,at:number)=>{if(Number.isFinite(at))client.send('pong',{at,serverTime:Date.now()});});
  this.setPatchRate(null);
  this.setSimulationInterval(()=>this.advance(),4);
  this.clock.setInterval(()=>this.publish(),1000/NETWORK.snapshotHz);
 }
 onJoin(client:Client){const used=new Set(this.slots.values());const i=Array.from({length:this.maxClients},(_,i)=>i).find(i=>!used.has(i))!;this.slots.set(client.sessionId,i);
  this.ack[i]=0;this.received[i]=0;this.queues[i]=[];this.lastInput[i]=Date.now();
  
 }
 onLeave(client:Client){const i=this.slots.get(client.sessionId);if(i!==undefined){this.sim.setInput(i,neutral());this.sim.cancelAction(this.sim.frogs[i]);this.queues[i]=[];this.slots.delete(client.sessionId);} }
 advance(){const now=performance.now();this.accumulator+=Math.min(250,now-this.lastClock);this.lastClock=now;let steps=0;
  while(this.accumulator>=DT*1000&&steps<6){const start=performance.now();
   for(let i=0;i<this.sim.frogs.length;i++){
    if(Date.now()-this.lastInput[i]>NETWORK.staleInputMs){this.queues[i]=[];this.sim.setInput(i,neutral());this.sim.cancelAction(this.sim.frogs[i]);}
    for(const c of this.queues[i]){this.sim.setInput(i,c.input);this.ack[i]=c.seq;}this.queues[i]=[];
   }
   this.sim.step();const ms=performance.now()-start;this.times.push(ms);if(this.times.length>3600)this.times.shift();if(ms>DT*1000)this.overruns++;
   this.accumulator-=DT*1000;steps++;
  }
  if(this.accumulator>=DT*1000){this.overruns++;this.accumulator=0;}
 }
 publish(){const snapshot:Snapshot={arenaId:simulationArena(this.sim),state:capture(this.sim),serverTime:Date.now()-this.accumulator,ack:[...this.ack],connected:[...Array(this.sim.frogs.length)].map((_,i)=>[...this.slots.values()].includes(i)),tickMs:summary(this.times),overruns:this.overruns,resetId:this.resetId};if(this.frozenSnapshot)snapshot.frozen=[...this.frozenSnapshot];this.broadcast('snapshot',snapshot);}
}
