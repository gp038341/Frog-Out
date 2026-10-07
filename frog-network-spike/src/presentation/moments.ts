import type {OutbreakView} from '../game/outbreak';
import type {Cue} from './audio';
export type Moment={cue:Cue;text?:string};
/** Server-view edges only. No rule writes, timers or gameplay commands. */
export class Moments {
 private roundKey='';private phase='';private count=-1;private healthy=-1;private states:string[]=[];
 reset(){this.roundKey='';this.phase='';this.count=-1;this.healthy=-1;this.states=[];}
 update(view:OutbreakView|undefined,local:number):Moment[]{
  if(!view){this.reset();return [];}
  const events:Moment[]=[],key=`${view.patientZeroOrder.join(',')}:${view.round}`;
  if(key!==this.roundKey){this.roundKey=key;this.phase='';this.count=-1;this.healthy=-1;this.states=[];}
  const healthy=view.players.filter(p=>p.state==='healthy').length;
  if(view.phase!==this.phase){
   if(view.phase==='announcement')events.push({cue:'reveal'});
   if(view.phase==='playing')events.push({cue:'go',text:'OUTBREAK!'});
   if(view.phase==='round-results')events.push({cue:'round'});
   if(view.phase==='match-results')events.push({cue:'win'});
  }
  if(view.phase==='countdown'){const count=Math.max(1,Math.ceil(view.remainingMs/1000));if(this.phase!=='countdown'||count!==this.count)events.push({cue:'count'});this.count=count;}
  if(view.phase==='playing'){
   if(healthy===1&&this.healthy!==1)events.push({cue:'last',text:'LAST FROG STANDING!'});
   if(view.players.some((p,i)=>!p.patientZero&&this.states[i]==='healthy'&&p.state!=='healthy'))events.push({cue:'infect'});
   if(this.states[local]==='transforming'&&view.players[local]?.state==='infectious')events.push({cue:'transform'});
  }
  this.phase=view.phase;this.healthy=healthy;this.states=view.players.map(p=>p.state);return events;
 }
}
