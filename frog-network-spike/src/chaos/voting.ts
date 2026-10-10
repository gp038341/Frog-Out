import type {GameMode} from '../game/modes';
import {DEFAULT_ARENA,type ArenaId} from '../simulation/arenas';
import {eligibleModifierIds,isModifier,modifier,type ModifierId} from './registry';
export type ChaosView={enabled:boolean;active:ModifierId[];version:number;phase:'idle'|'voting'|'reveal';ballotId:number;choices:ModifierId[];priority:ModifierId[];votes:Record<string,ModifierId>;counts:number[];closesAt:number;winner?:ModifierId;expiring?:ModifierId;notice:string};
/** Server owns this class; clients only receive serializable views. */
export class ChaosVoting{
 active:ModifierId[]=[];version=0;phase:ChaosView['phase']='idle';ballotId=0;choices:ModifierId[]=[];priority:ModifierId[]=[];votes=new Map<string,ModifierId>();closesAt=0;winner?:ModifierId;expiring?:ModifierId;notice='';history:ModifierId[][]=[];
 constructor(public enabled=true,private random=()=>Math.random(),readonly voteMs=15000,readonly revealMs=1500){}
 reset(){this.active=[];this.version++;this.phase='idle';this.choices=[];this.priority=[];this.votes.clear();this.winner=undefined;this.expiring=undefined;this.notice='';}
 open(now:number,mode:GameMode='poison',arena:ArenaId=DEFAULT_ARENA){if(!this.enabled||this.phase!=='idle')return false;
  const remaining=eligibleModifierIds(this.active,mode,arena);this.choices=[];
  while(remaining.length&&this.choices.length<3){const families=new Set(this.choices.map(id=>modifier(id).family));const diverse=remaining.filter(id=>!families.has(modifier(id).family));const pool=diverse.length?diverse:remaining;
   const weights=pool.map(id=>this.history.at(-1)?.includes(id)?.25:this.history.at(-2)?.includes(id)?.5:1);let draw=this.random()*weights.reduce((a,b)=>a+b,0),chosen=pool.at(-1)!;for(let i=0;i<pool.length;i++){draw-=weights[i];if(draw<0){chosen=pool[i];break;}}this.choices.push(chosen);remaining.splice(remaining.indexOf(chosen),1);
  }
  if(!this.choices.length){this.notice='No eligible change. Current modifiers stay active.';return false;}
  this.priority=[...this.choices];for(let i=this.priority.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.priority[i],this.priority[j]]=[this.priority[j],this.priority[i]];}
  this.ballotId++;this.votes.clear();this.winner=undefined;this.expiring=this.active.length===3?this.active[0]:undefined;this.phase='voting';this.closesAt=now+this.voteMs;this.notice=this.choices.length<3?'Kept modifiers are excluded. The expiring modifier can be renewed. Fewer choices this vote.':'';return true;
 }
 vote(player:string,id:unknown,ballot:unknown,connected:readonly string[],now:number){if(this.phase!=='voting'||now>=this.closesAt||ballot!==this.ballotId||!connected.includes(player)||!isModifier(id)||!this.choices.includes(id))return false;this.votes.set(player,id);return true;}
 counts(connected:readonly string[]){return this.choices.map(id=>[...this.votes].filter(([p,v])=>connected.includes(p)&&v===id).length);}
 advance(now:number,connected:readonly string[]):'none'|'resolved'|'ready'{
  if(this.phase==='voting'&&now>=this.closesAt){const counts=this.counts(connected),best=Math.max(...counts);this.winner=this.priority.find(id=>counts[this.choices.indexOf(id)]===best)!;this.notice=best===0?'No votes — visible tie priority chose the winner.':counts.filter(n=>n===best).length>1?'Tie — visible tie priority chose the winner.':'The pond has spoken!';if(this.active.length===3)this.active.shift();this.active.push(this.winner);this.version++;this.history.push(this.choices.filter(id=>id!==this.winner));if(this.history.length>3)this.history.shift();this.phase='reveal';this.closesAt=now+this.revealMs;return 'resolved';}
  if(this.phase==='reveal'&&now>=this.closesAt){this.phase='idle';return 'ready';}return 'none';
 }
 view(connected:readonly string[]):ChaosView{return {enabled:this.enabled,active:[...this.active],version:this.version,phase:this.phase,ballotId:this.ballotId,choices:[...this.choices],priority:[...this.priority],votes:Object.fromEntries(this.votes),counts:this.counts(connected),closesAt:this.closesAt,winner:this.winner,expiring:this.expiring,notice:this.notice};}
}
