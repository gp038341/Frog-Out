import {OutbreakRules} from '../src/game/outbreak';
import {FreezeRules} from '../src/game/freeze-tag';
import {ClassicRules} from '../src/game/classic-tag';
export type MatchRules=OutbreakRules|FreezeRules|ClassicRules;
export function tagger(r:MatchRules){return r instanceof ClassicRules?r.it:r.patientZero;}
/** A departure settles earned points once; no departure bonus or invented winner. */
export function finishDeparture(r:MatchRules,tick:number){
 if(!['playing','announcement','countdown'].includes(r.phase))return;
 if(r instanceof OutbreakRules){for(let i=0;i<r.records.length;i++){const p=r.records[i];if(p.roundPoints===null){p.roundPoints=r.survivalPoints(tick,i);r.totals[i]=Math.round((r.totals[i]+p.roundPoints)*10)/10;}}r.phase='round-results';r.stoppedTick=tick;r.roundWinners=[];}
 else if(r instanceof FreezeRules){r.finish(tick,'departure');r.roundWinners=[];}
 else {r.finish(tick);r.roundWinners=[];}
}
export function noTargetsRemain(r:MatchRules){return r instanceof OutbreakRules?r.records.every((p,i)=>!r.presence.has(i)||p.infectedTick!==null):r instanceof FreezeRules?r.records.every((p,i)=>!r.presence.has(i)||i===r.patientZero||p.frozen):false;}

export function settleAbsent(r:MatchRules,tick:number){if(r instanceof OutbreakRules&&r.phase==='round-results')for(let i=0;i<r.records.length;i++){const p=r.records[i];if(!r.presence.has(i)&&p.roundPoints===null){p.roundPoints=r.survivalPoints(r.stoppedTick??tick,i);r.totals[i]=Math.round((r.totals[i]+p.roundPoints)*10)/10;}}}
