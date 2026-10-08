import {FREEZE,FreezeRules} from '../src/game/freeze-tag';
import {syncFrozenBodies,stepFrozenBodies} from '../src/game/frozen-bodies';
import {type Client} from '@colyseus/core';
import {randomInt} from 'node:crypto';
import {Vec2} from 'planck';
import {PartyRoom} from './party-room';
import {OutbreakRules,OUTBREAK} from '../src/game/outbreak';
import type {PlayerInfo} from '../src/network/protocol';
import type {Simulation} from '../src/simulation/world';
/** Only real touching frog fixtures count. A tongue joint or raycast is never an infection contact. */
export function frogBodyContacts(sim:Simulation):[number,number][]{
 const slots=new Map(sim.frogs.map((f,i)=>[f.body,i]));const pairs:[number,number][]=[];
 for(let c=sim.world.getContactList();c;c=c.getNext()){if(!c.isTouching()||!c.isEnabled()||c.getFixtureA().isSensor()||c.getFixtureB().isSensor())continue;const a=slots.get(c.getFixtureA().getBody()),b=slots.get(c.getFixtureB().getBody());if(a!==undefined&&b!==undefined&&a!==b)pairs.push([a,b]);}
 return pairs;
}
function patientZeroOrder(count:number){const order=Array.from({length:count},(_,i)=>i);for(let i=count-1;i>0;i--){const j=randomInt(i+1);[order[i],order[j]]=[order[j],order[i]];}return order;}
export class OutbreakRoom extends PartyRoom {
 outbreak?:OutbreakRules|FreezeRules;
 onCreate(){
  super.onCreate();const physicsStep=this.sim.step.bind(this.sim);
  // The approved physics function is called unchanged while playing; lock countdown controls and freeze bodies on results.
  this.sim.step=()=>{const rules=this.outbreak;if(this.phase!=='game'||!rules){physicsStep();return;}if(rules.phase==='playing'){this.sim.frogs.forEach((f,i)=>{f.poisonPullFromTick=rules.records[i]?.infectiousTick??undefined;});if(rules instanceof FreezeRules)stepFrozenBodies(this.sim,rules.frozen,physicsStep);else physicsStep();rules.infect(this.sim.tick,frogBodyContacts(this.sim));if(rules instanceof FreezeRules){syncFrozenBodies(this.sim,rules.frozen);this.frozenSnapshot=rules.frozen;}if(rules.phase!=='playing')this.sim.clearInputs();}else{this.sim.clearInputs();if(rules.phase==='announcement'||rules.phase==='countdown')physicsStep();else this.sim.tick++;rules.advanceClock(this.sim.tick);}};
  this.onMessage('next-round',(client:Client)=>{if(!this.host(client)||this.phase!=='game'||!this.outbreak?.next(this.sim.tick))return;if(this.outbreak.phase==='announcement')this.resetRound();this.publish();});
  this.onMessage('return-lobby',(client:Client)=>{if(this.host(client)&&this.outbreak?.phase==='match-results')this.interrupt('Match complete. Ready up in the lobby to start a new match.');});
  if(process.env.ENABLE_TESTS==='1')this.onMessage('outbreak-test',(_client:Client,data:{positions?:number[][];velocities?:number[][]})=>{
   if(!this.outbreak||!Array.isArray(data?.positions)||data.positions.length!==this.sim.frogs.length)return;
   const tick=this.sim.tick;this.sim.reset();this.sim.tick=tick;this.queues=this.queues.map(()=>[]);this.sim.frogs.forEach((f,i)=>{const p=data.positions![i],v=data.velocities?.[i]??[0,0];f.body.setTransform(Vec2(p[0],p[1]),0);f.body.setLinearVelocity(Vec2(v[0],v[1]));});this.sim.world.step(0);this.resetId++;
  });
 }
 host(client:Client){if(client.sessionId!==this.hostId){client.send('notice','Only the host can continue the match.');return false;}return true;}
 startSession(roster:PlayerInfo[]){const timing=process.env.ENABLE_TESTS==='1'&&process.env.TEST_OUTBREAK_SHORT_COUNTDOWN==='1'?{...OUTBREAK,announcementTicks:6,countdownTicks:12}:OUTBREAK;
  syncFrozenBodies(this.sim);this.frozenSnapshot=undefined;this.outbreak=this.mode==='freeze'?new FreezeRules(patientZeroOrder(roster.length),this.sim.tick,{...FREEZE,announcementTicks:timing.announcementTicks,countdownTicks:timing.countdownTicks}):new OutbreakRules(patientZeroOrder(roster.length),this.sim.tick,timing);super.startSession(roster);this.notice='';this.lobby();
 }
 resetRound(){syncFrozenBodies(this.sim);this.frozenSnapshot=this.outbreak instanceof FreezeRules?this.outbreak.frozen:undefined;const tick=this.sim.tick;this.sim.reset();this.sim.tick=tick;this.queues=this.queues.map(()=>[]);this.resetId++;}
 welcome(client:Client){super.welcome(client);client.send('outbreak',this.outbreak?.view(this.sim.tick)??null);}
 publish(){if(this.phase==='game'&&this.outbreak)this.broadcast('outbreak',this.outbreak.view(this.sim.tick));super.publish();}
 interrupt(message:string){syncFrozenBodies(this.sim);this.frozenSnapshot=undefined;this.outbreak=undefined;this.broadcast('outbreak',null);super.interrupt(message);}
}
