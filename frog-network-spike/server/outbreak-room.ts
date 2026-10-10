import {ChaosVoting} from '../src/chaos/voting';
import {applyChaos} from '../src/chaos/registry';
import {CLASSIC,ClassicRules} from '../src/game/classic-tag';
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
 outbreak?:OutbreakRules|FreezeRules|ClassicRules;
 chaos=new ChaosVoting(true,()=>randomInt(1000000)/1000000,process.env.ENABLE_TESTS==='1'&&process.env.TEST_CHAOS_SHORT_VOTE==='1'?600:15000,process.env.ENABLE_TESTS==='1'&&process.env.TEST_CHAOS_SHORT_VOTE==='1'?150:1500);
 connectedIds(){return [...this.players.values()].filter(p=>p.connected).map(p=>p.id);}
 chaosState(){return this.chaos.view(this.connectedIds());}
 configureChaos(){applyChaos(this.sim,this.chaos.active);this.chaosSnapshot=this.chaos.enabled?{active:[...this.chaos.active],version:this.chaos.version}:undefined;}
 continueRound(){if(this.outbreak?.next(this.sim.tick)&&this.outbreak.phase==='announcement')this.resetRound();this.publish();}
 onCreate(){
  super.onCreate();const physicsStep=this.sim.step.bind(this.sim);
  // The approved physics function is called unchanged while playing; lock countdown controls and freeze bodies on results.
  this.sim.step=()=>{if(this.chaos.phase!=='idle'){this.sim.clearInputs();this.queues=this.queues.map(()=>[]);this.sim.tick++;if(this.chaos.advance(Date.now(),this.connectedIds())==='ready'){this.configureChaos();this.continueRound();}return;}const rules=this.outbreak;if(this.phase!=='game'||!rules){physicsStep();return;}if(rules.phase==='playing'){this.sim.frogs.forEach((f,i)=>{f.poisonPullFromTick=rules.records[i]?.infectiousTick??undefined;});if(rules instanceof FreezeRules)stepFrozenBodies(this.sim,rules.frozen,physicsStep);else physicsStep();if(rules instanceof ClassicRules)rules.infect(this.sim.tick,frogBodyContacts(this.sim),this.sim.frogs.map(f=>f.body.getPosition()));else rules.infect(this.sim.tick,frogBodyContacts(this.sim));if(rules instanceof FreezeRules){syncFrozenBodies(this.sim,rules.frozen);this.frozenSnapshot=rules.frozen;}if(rules.phase!=='playing')this.sim.clearInputs();}else{this.sim.clearInputs();if(rules.phase==='announcement'||rules.phase==='countdown')physicsStep();else this.sim.tick++;rules.advanceClock(this.sim.tick);}};
  this.onMessage('select-chaos',(client:Client,value:unknown)=>{if(client.sessionId!==this.hostId||this.phase!=='lobby'||typeof value!=='boolean')return;if(value===this.chaosEnabled)return;this.chaosEnabled=value;for(const p of this.players.values())p.ready=false;this.notice='Chaos changed. Everyone must ready up again.';this.lobby();});
  this.onMessage('chaos-vote',(client:Client,data:{ballotId?:unknown;id?:unknown})=>{if(this.phase==='game'&&this.chaos.vote(client.sessionId,data?.id,data?.ballotId,this.connectedIds(),Date.now()))this.publish();});
  this.onMessage('next-round',(client:Client)=>{if(!this.host(client)||this.phase!=='game'||this.outbreak?.phase!=='round-results'||this.chaos.phase!=='idle')return;const rules=this.outbreak;if(this.chaosEnabled&&rules.round+1<rules.order.length&&this.chaos.open(Date.now(),this.mode,this.arenaId)){this.sim.clearInputs();this.queues=this.queues.map(()=>[]);this.publish();}else this.continueRound();});
  this.onMessage('return-lobby',(client:Client)=>{if(this.host(client)&&this.outbreak?.phase==='match-results')this.interrupt('Match complete. Ready up in the lobby to start a new match.');});
  if(process.env.ENABLE_TESTS==='1')this.onMessage('outbreak-test',(_client:Client,data:{positions?:number[][];velocities?:number[][]})=>{
   if(!this.outbreak||!Array.isArray(data?.positions)||data.positions.length!==this.sim.frogs.length)return;
   const tick=this.sim.tick;this.sim.reset();this.sim.tick=tick;this.queues=this.queues.map(()=>[]);this.sim.frogs.forEach((f,i)=>{const p=data.positions![i],v=data.velocities?.[i]??[0,0];f.body.setTransform(Vec2(p[0],p[1]),0);f.body.setLinearVelocity(Vec2(v[0],v[1]));});this.sim.world.step(0);this.resetId++;
  });
 }
 host(client:Client){if(client.sessionId!==this.hostId){client.send('notice','Only the host can continue the match.');return false;}return true;}
 startSession(roster:PlayerInfo[]){this.chaos.enabled=this.chaosEnabled;this.chaos.reset();this.configureChaos();const timing=process.env.ENABLE_TESTS==='1'&&process.env.TEST_OUTBREAK_SHORT_COUNTDOWN==='1'?{...OUTBREAK,announcementTicks:6,countdownTicks:12}:OUTBREAK;
  syncFrozenBodies(this.sim);this.frozenSnapshot=undefined;this.outbreak=this.mode==='classic'?new ClassicRules(patientZeroOrder(roster.length),this.sim.tick,{...CLASSIC,roundTicks:process.env.ENABLE_TESTS==='1'&&process.env.TEST_CLASSIC_SHORT_ROUND==='1'?240:CLASSIC.roundTicks,announcementTicks:timing.announcementTicks,countdownTicks:timing.countdownTicks}):this.mode==='freeze'?new FreezeRules(patientZeroOrder(roster.length),this.sim.tick,{...FREEZE,announcementTicks:timing.announcementTicks,countdownTicks:timing.countdownTicks}):new OutbreakRules(patientZeroOrder(roster.length),this.sim.tick,timing);super.startSession(roster);this.configureChaos();this.notice='';this.lobby();
 }
 resetRound(){this.configureChaos();syncFrozenBodies(this.sim);this.frozenSnapshot=this.outbreak instanceof FreezeRules?this.outbreak.frozen:undefined;const tick=this.sim.tick;this.sim.reset();this.sim.tick=tick;this.queues=this.queues.map(()=>[]);this.resetId++;}
 welcome(client:Client){super.welcome(client);client.send('chaos',this.chaosState());client.send('outbreak',this.outbreak?.view(this.sim.tick)??null);}
 publish(){if(this.phase==='game')this.broadcast('chaos',this.chaosState());if(this.phase==='game'&&this.outbreak)this.broadcast('outbreak',this.outbreak.view(this.sim.tick));super.publish();}
 interrupt(message:string){this.chaos.reset();this.configureChaos();this.broadcast('chaos',null);syncFrozenBodies(this.sim);this.frozenSnapshot=undefined;this.outbreak=undefined;this.broadcast('outbreak',null);super.interrupt(message);}
}
