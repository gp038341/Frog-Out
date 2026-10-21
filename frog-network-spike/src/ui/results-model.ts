import type {OutbreakView} from '../game/outbreak';
import type {LobbyState} from '../network/protocol';
import {normalizeAppearance,type Appearance} from '../presentation/cosmetics';
export const SCORE_COUNT_MS=1350;
export type ResultsFrog={id:string;slot:number;name:string;appearance:Appearance;cpu:boolean;status:string;local:boolean;rank:number;tied:boolean;total:number;previous:number;delta:number;roundWinner:boolean;champion:boolean};
/** Ranks and awards come from the authoritative results. Slot ordering only arranges equal-ranked portraits. */
export function resultsModel(view:OutbreakView,lobby:LobbyState,localId:string){
 const final=view.phase==='match-results';
 const frogs=view.players.map(p=>{const roster=lobby.roster?.find(r=>r.slot===p.slot),current=lobby.players.find(r=>roster?r.id===roster.id:r.slot===p.slot),identity=roster??current;const total=p.totalPoints,delta=p.roundPoints??0;
  return {id:identity?.id??`slot:${p.slot}`,slot:p.slot,name:identity?.name??`Frog ${p.slot+1}`,appearance:normalizeAppearance(identity?.appearance),cpu:identity?.kind==='cpu',status:p.present===false?'Left':identity?.kind==='cpu'?'CPU':current?.connected?'':'Offline',local:identity?.id===localId,rank:p.finalPlace,tied:view.players.some(other=>other.slot!==p.slot&&other.finalPlace===p.finalPlace),total,previous:final?0:Math.round((total-delta)*10)/10,delta,roundWinner:view.roundWinners.includes(p.slot),champion:final&&view.matchWinners.includes(p.slot)} satisfies ResultsFrog;
 }).sort((a,b)=>a.rank-b.rank||a.slot-b.slot);
 const groups=[1,2,3].map(rank=>({rank,frogs:frogs.filter(f=>f.rank===rank)})).filter(g=>g.frogs.length);
 return {final,frogs,groups,tiedPodium:groups.some(g=>g.frogs.length>1)};
}
export function countedScore(from:number,to:number,elapsed:number){if(elapsed>=SCORE_COUNT_MS)return to;const t=Math.max(0,elapsed)/SCORE_COUNT_MS;return Math.round((from+(to-from)*(1-(1-t)**3))*10)/10;}
export const scoreText=(n:number)=>n.toFixed(1);
export function rankText(rank:number,tied=false){return `${rank}${rank===1?'st':rank===2?'nd':rank===3?'rd':'th'}${tied?' · tied':''}`;}
