import {DT} from '../simulation/config';
export const SCORING={pointsPerSecond:1,lastSurvivorBonus:2};
export const OUTBREAK={announcementTicks:60,countdownTicks:180,graceTicks:60};
export type OutbreakPhase='announcement'|'countdown'|'playing'|'round-results'|'match-results';
export type InfectionState='healthy'|'transforming'|'infectious';
export type OutbreakPlayer={slot:number;state:InfectionState;patientZero:boolean;infectedTick:number|null;infectiousTick:number|null;infectionPlace:number|null;roundPoints:number|null;survivalMs:number;survivalPoints:number;placementBonus:number;totalPoints:number;finalPlace:number};
export type OutbreakView={phase:OutbreakPhase;round:number;roundCount:number;patientZero:number;patientZeroOrder:number[];tick:number;elapsedMs:number;remainingMs:number;players:OutbreakPlayer[];roundWinners:number[];matchWinners:number[]};
type Record={infectedTick:number|null;infectiousTick:number|null;infectionPlace:number|null;roundPoints:number|null;placementBonus:number};
const healthy=():Record=>({infectedTick:null,infectiousTick:null,infectionPlace:null,roundPoints:null,placementBonus:0});
/** Pure authoritative rules. Contact pairs are collected from the physical bodies, never tongues. */
export class OutbreakRules {
 phase:OutbreakPhase='announcement';round=0;phaseEndsTick=0;startedTick:number|null=null;stoppedTick:number|null=null;
 records:Record[]=[];totals:number[];roundWinners:number[]=[];
 constructor(readonly order:number[],tick:number,readonly timing=OUTBREAK){
  if(order.length<2||order.length>8||new Set(order).size!==order.length||order.some(i=>!Number.isInteger(i)||i<0||i>=order.length))throw Error('Patient Zero order must be a permutation of 2–8 roster slots');
  this.order=[...order];this.totals=Array(order.length).fill(0);this.beginRound(tick);
 }
 get patientZero(){return this.order[this.round];}
 beginRound(tick:number){this.phase='announcement';this.phaseEndsTick=tick+this.timing.announcementTicks;this.records=this.order.map(healthy);this.startedTick=null;this.stoppedTick=null;this.roundWinners=[];}
 advanceClock(tick:number){
  if(this.phase==='announcement'&&tick>=this.phaseEndsTick){this.phase='countdown';this.phaseEndsTick+=this.timing.countdownTicks;}
  if(this.phase==='countdown'&&tick>=this.phaseEndsTick){this.phase='playing';this.startedTick=tick;this.records[this.patientZero]={infectedTick:tick,infectiousTick:tick,infectionPlace:1,roundPoints:0,placementBonus:0};}
 }
 infect(tick:number,contacts:readonly (readonly [number,number])[]){
  if(this.phase!=='playing')return [];
  // Evaluate every contact against the pre-batch state: callback order cannot create a chain or break ties.
  const infectious=new Set(this.records.flatMap((p,i)=>p.infectiousTick!==null&&tick>=p.infectiousTick?[i]:[]));
  const newlyInfected=new Set<number>();
  for(const [a,b] of contacts){if(!this.records[a]||!this.records[b]||a===b)continue;if(infectious.has(a)&&this.records[b].infectedTick===null)newlyInfected.add(b);if(infectious.has(b)&&this.records[a].infectedTick===null)newlyInfected.add(a);}
  const batch=[...newlyInfected].sort((a,b)=>a-b);if(!batch.length)return batch;
  const before=this.records.filter(p=>p.infectedTick!==null).length;
  const lastBatch=before+batch.length===this.records.length;
  for(const slot of batch){const placementBonus=lastBatch?SCORING.lastSurvivorBonus:0;
   const roundPoints=this.survivalPoints(tick)+placementBonus;
   this.records[slot]={infectedTick:tick,infectiousTick:tick+this.timing.graceTicks,infectionPlace:before+1,roundPoints,placementBonus};
   this.totals[slot]=Math.round(this.totals[slot]*10+roundPoints*10)/10;
  }
  if(this.records.every(p=>p.infectedTick!==null)){this.phase='round-results';this.stoppedTick=tick;this.roundWinners=batch;}
  return batch;
 }
 survivalMs(tick:number){return this.startedTick===null?0:Math.max(0,tick-this.startedTick)*DT*1000;}
 survivalPoints(tick:number){return Math.floor(this.survivalMs(tick)*SCORING.pointsPerSecond/100+1e-9)/10;}
 next(tick:number){if(this.phase!=='round-results')return false;if(this.round+1===this.order.length){this.phase='match-results';return true;}this.round++;this.beginRound(tick);return true;}
 view(tick:number):OutbreakView{
  const highest=Math.max(...this.totals);return {phase:this.phase,round:this.round+1,roundCount:this.order.length,patientZero:this.patientZero,patientZeroOrder:[...this.order],tick,
   elapsedMs:this.startedTick===null?0:Math.max(0,(this.stoppedTick??tick)-this.startedTick)*DT*1000,
   remainingMs:['announcement','countdown'].includes(this.phase)?Math.max(0,this.phaseEndsTick-tick)*DT*1000:0,
   players:this.records.map((p,slot)=>({...p,survivalMs:this.survivalMs(p.infectedTick??this.stoppedTick??tick),survivalPoints:this.survivalPoints(p.infectedTick??this.stoppedTick??tick),slot,state:p.infectedTick===null?'healthy':tick<(p.infectiousTick??tick)?'transforming':'infectious',patientZero:slot===this.patientZero,totalPoints:this.totals[slot],finalPlace:1+this.totals.filter(total=>total>this.totals[slot]).length})),
   roundWinners:[...this.roundWinners],matchWinners:this.phase==='match-results'?this.totals.flatMap((points,i)=>points===highest?[i]:[]):[]};
 }
}
