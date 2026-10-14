import {isCPU,participating} from '../src/game/participants';
import {finishDeparture,noTargetsRemain,tagger,settleAbsent} from './departure-rules';
import {ChaosVoting} from '../src/chaos/voting';
import {applyChaos,validModifiers} from '../src/chaos/registry';
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
export function frogBodyContacts(sim:Simulation,rescue?:{frozen:readonly boolean[];freezer:number}):[number,number][]{
 const slots=new Map(sim.frogs.map((f,i)=>[f.body,i]));const pairs:[number,number][]=[];
 for(let c=sim.world.getContactList();c;c=c.getNext()){if(!c.isTouching()||!c.isEnabled()||c.getFixtureA().isSensor()||c.getFixtureB().isSensor())continue;const a=slots.get(c.getFixtureA().getBody()),b=slots.get(c.getFixtureB().getBody());if(a!==undefined&&b!==undefined&&a!==b)pairs.push([a,b]);}
 return sim.frogChaos.ruleContacts(pairs,rescue);
}
function patientZeroOrder(count:number){const order=Array.from({length:count},(_,i)=>i);for(let i=count-1;i>0;i--){const j=randomInt(i+1);[order[i],order[j]]=[order[j],order[i]];}return order;}
export class OutbreakRoom extends PartyRoom {
 outbreak?:OutbreakRules|FreezeRules|ClassicRules;
 chaos=new ChaosVoting(true,()=>randomInt(1000000)/1000000,process.env.ENABLE_TESTS==='1'&&process.env.TEST_CHAOS_SHORT_VOTE==='1'?600:15000,process.env.ENABLE_TESTS==='1'&&process.env.TEST_CHAOS_SHORT_VOTE==='1'?150:1500);
 connectedIds(){return [...this.players.values()].filter(participating).map(p=>p.id);}
 chaosState(){return this.chaos.view(this.connectedIds());}
 configureChaos(){applyChaos(this.sim,this.chaos.active);this.chaosSnapshot=this.chaos.enabled?{active:[...this.chaos.active],version:this.chaos.version}:undefined;}
 hasFutureRound(){const r=this.outbreak;return !!r&&r.order.slice(r.round+1).some(slot=>participating(this.players.get(this.matchRoster[slot])));}
 advanceRound(){const r=this.outbreak;if(!r)return;if(this.chaosEnabled&&this.hasFutureRound()&&this.chaos.open(Date.now(),this.mode,this.arenaId)){this.sim.clearInputs();this.queues=this.queues.map(()=>[]);this.publish();}else this.continueRound();}
 continueRound(){const r=this.outbreak;if(!r)return;while(r.next(this.sim.tick)&&r.phase==='announcement'){if(participating(this.players.get(this.matchRoster[r.patientZero]))){this.resetRound();break;}r.phase='round-results';}this.sim.clearInputs();this.publish();}
 unavailable(p:PlayerInfo){const r=this.outbreak;if(!r||p.slot<0)return;r.presence.set(p.slot,false,r.stoppedTick??this.sim.tick,r.startedTick!==null);if([...this.players.values()].filter(participating).length<2)return;if(['playing','announcement','countdown'].includes(r.phase)&&(tagger(r)===p.slot||r.phase==='playing'&&noTargetsRemain(r))){const played=r.phase==='playing';finishDeparture(r,this.sim.tick);if(played){this.sim.clearInputs();this.queues=this.queues.map(()=>[]);this.publish();}else this.continueRound();}}
 resumed(p:PlayerInfo){const r=this.outbreak;if(r&&p.slot>=0)r.presence.set(p.slot,true,r.stoppedTick??this.sim.tick,r.startedTick!==null);}

 pauseChanged(elapsed:number){if(this.chaos.phase!=='idle')this.chaos.closesAt+=elapsed;for(const cpu of this.cpus.values())cpu.resume(elapsed);}
 controlledInput(i:number){const id=this.matchRoster[i],cpu=this.cpus.get(id);if(!cpu)return undefined;try{return cpu.input(this.sim.frogs[i],this.sim.tick,this.outbreak?.phase==='playing'&&this.chaos.phase==='idle'&&!this.paused,this.outbreak instanceof FreezeRules&&this.outbreak.frozen[i],this.sim.frogChaos.trapped(this.sim.frogs[i]),this.sim);}catch{return{x:0,y:0,held:false};}}

 onCreate(){
  super.onCreate();this.sim.frogChaos.deferContacts=true;const physicsStep=this.sim.step.bind(this.sim);
  // The approved physics function is called unchanged while playing; lock countdown controls and freeze bodies on results.
  this.sim.step=()=>{this.syncPresence();if(this.chaos.phase!=='idle'){for(const [id,cpu]of this.cpus)cpu.vote(this.chaos,id,this.connectedIds(),Date.now());this.sim.clearInputs();this.queues=this.queues.map(()=>[]);this.sim.tick++;if(this.chaos.advance(Date.now(),this.connectedIds())==='ready'){this.configureChaos();this.continueRound();}return;}const rules=this.outbreak;this.sim.arenaChaos.paused=!!rules&&rules.phase!=='playing';this.sim.frogChaos.paused=this.sim.arenaChaos.paused;this.sim.frogChaos.setConnected([...this.players.values()].filter(p=>participating(p)&&p.slot>=0).map(p=>p.slot));if(this.phase!=='game'||!rules){physicsStep();return;}if(rules.phase==='playing'){this.sim.frogs.forEach((f,i)=>{f.poisonPullFromTick=rules.records[i]?.infectiousTick??undefined;});if(rules instanceof FreezeRules)stepFrozenBodies(this.sim,rules.frozen,physicsStep);else physicsStep();this.syncPresence();if(rules instanceof ClassicRules)rules.infect(this.sim.tick,frogBodyContacts(this.sim),this.sim.frogs.map(f=>f.body.getPosition()));else rules.infect(this.sim.tick,frogBodyContacts(this.sim,rules instanceof FreezeRules?{frozen:rules.frozen,freezer:rules.patientZero}:undefined));settleAbsent(rules,this.sim.tick);this.sim.frogChaos.resolveContacts();if(rules instanceof FreezeRules){syncFrozenBodies(this.sim,rules.frozen);this.frozenSnapshot=rules.frozen;this.sim.frogChaos.after();}if(rules.phase!=='playing')this.sim.clearInputs();}else{this.sim.clearInputs();if(rules.phase==='announcement'||rules.phase==='countdown')physicsStep();else this.sim.tick++;rules.advanceClock(this.sim.tick);}};
  this.onMessage('select-chaos',(client:Client,value:unknown)=>{if(client.sessionId!==this.hostId||this.phase!=='lobby'||typeof value!=='boolean')return;if(value===this.chaosEnabled)return;this.chaosEnabled=value;for(const p of this.players.values())p.ready=isCPU(p);this.notice='Chaos changed. Everyone must ready up again.';this.lobby();});
  this.onMessage('chaos-vote',(client:Client,data:{ballotId?:unknown;id?:unknown})=>{if(this.phase==='game'&&this.chaos.vote(client.sessionId,data?.id,data?.ballotId,this.connectedIds(),Date.now()))this.publish();});
  this.onMessage('next-round',(client:Client)=>{if(!this.host(client)||this.phase!=='game'||this.outbreak?.phase!=='round-results'||this.chaos.phase!=='idle')return;this.advanceRound();});
  this.onMessage('return-lobby',(client:Client)=>{if(this.host(client)&&this.outbreak?.phase==='match-results')this.interrupt('Match complete. Ready up in the lobby to start a new match.');});
  if(process.env.ENABLE_TESTS==='1')this.onMessage('chaos-test',(client:Client,data:{ids?:unknown[]})=>{if(client.sessionId!==this.hostId||!this.outbreak||!Array.isArray(data?.ids))return;this.chaos.active=validModifiers(data.ids);this.chaos.version++;this.configureChaos();this.resetRound();this.publish();});
  if(process.env.ENABLE_TESTS==='1')this.onMessage('outbreak-test',(_client:Client,data:{positions?:number[][];velocities?:number[][]})=>{
   if(!this.outbreak||!Array.isArray(data?.positions)||data.positions.length!==this.sim.frogs.length)return;
   const tick=this.sim.tick;this.sim.reset();this.sim.tick=tick;this.queues=this.queues.map(()=>[]);this.sim.frogs.forEach((f,i)=>{const p=data.positions![i],v=data.velocities?.[i]??[0,0];f.body.setTransform(Vec2(p[0],p[1]),0);f.body.setLinearVelocity(Vec2(v[0],v[1]));});this.sim.world.step(0);this.resetId++;
  });
 }
 host(client:Client){if(client.sessionId!==this.hostId){client.send('notice','Only the host can continue the match.');return false;}return true;}
 startSession(roster:PlayerInfo[]){this.chaos.enabled=this.chaosEnabled;this.chaos.reset();this.configureChaos();const timing=process.env.ENABLE_TESTS==='1'&&process.env.TEST_OUTBREAK_SHORT_COUNTDOWN==='1'?{...OUTBREAK,announcementTicks:6,countdownTicks:12}:OUTBREAK;
  syncFrozenBodies(this.sim);this.frozenSnapshot=undefined;this.outbreak=this.mode==='classic'?new ClassicRules(patientZeroOrder(roster.length),this.sim.tick,{...CLASSIC,roundTicks:process.env.ENABLE_TESTS==='1'&&process.env.TEST_CLASSIC_SHORT_ROUND==='1'?240:CLASSIC.roundTicks,announcementTicks:timing.announcementTicks,countdownTicks:timing.countdownTicks}):this.mode==='freeze'?new FreezeRules(patientZeroOrder(roster.length),this.sim.tick,{...FREEZE,announcementTicks:timing.announcementTicks,countdownTicks:timing.countdownTicks}):new OutbreakRules(patientZeroOrder(roster.length),this.sim.tick,timing);super.startSession(roster);this.configureChaos();this.notice='';this.lobby();
 }
 resetRound(){this.configureChaos();syncFrozenBodies(this.sim);this.frozenSnapshot=this.outbreak instanceof FreezeRules?this.outbreak.frozen:undefined;const tick=this.sim.tick;this.sim.reset();this.sim.tick=tick;this.queues=this.queues.map(()=>[]);for(const cpu of this.cpus.values())cpu.reset();this.syncPresence();this.resetId++;}
 welcome(client:Client){super.welcome(client);client.send('chaos',this.chaosState());client.send('outbreak',this.outbreak?.view(this.sim.tick)??null);}
 publish(){if(this.phase==='game')this.broadcast('chaos',this.chaosState());if(this.phase==='game'&&this.outbreak)this.broadcast('outbreak',this.outbreak.view(this.sim.tick));super.publish();}
 interrupt(message:string){for(const cpu of this.cpus.values())cpu.reset();this.chaos.reset();this.configureChaos();this.broadcast('chaos',null);syncFrozenBodies(this.sim);this.frozenSnapshot=undefined;this.outbreak=undefined;this.broadcast('outbreak',null);super.interrupt(message);}
}
