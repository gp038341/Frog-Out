import type {OutbreakView} from '../game/outbreak';
import type {Cue} from './audio';
export type Moment={cue:Cue;text?:string};
/** Server-view edges only. No rule writes, timers or gameplay commands. */
export class Moments {
 private roundKey='';private phase='';private count=-1;private healthy=-1;private states:string[]=[];
 reset(){this.roundKey='';this.phase='';this.count=-1;this.healthy=-1;this.states=[];}
 update(view:OutbreakView|undefined,local:number):Moment[]{
  if(!view){this.reset();return [];}
  const events:Moment[]=[],key=`${view.mode??'poison'}:${view.patientZeroOrder.join(',')}:${view.round}`;
  if(key!==this.roundKey){this.roundKey=key;this.phase='';this.count=-1;this.healthy=-1;this.states=[];}
  const freeze=view.mode==='freeze',classic=view.mode==='classic';const healthy=freeze?view.players.filter(p=>p.slot!==view.freeze!.freezer&&!view.freeze!.frozen[p.slot]).length:view.players.filter(p=>p.state==='healthy').length;
  if(view.phase!==this.phase){
   if(view.phase==='announcement')events.push({cue:'reveal'});
   if(view.phase==='playing')events.push({cue:'go',text:classic?'CLASSIC TAG!':freeze?'FREEZE TAG!':'POISON TAG!'});
   if(view.phase==='round-results')events.push({cue:'round'});
   if(view.phase==='match-results')events.push({cue:'win'});
  }
  if(view.phase==='countdown'){const count=Math.max(1,Math.ceil(view.remainingMs/1000));if(this.phase!=='countdown'||count!==this.count)events.push({cue:'count'});this.count=count;}
  if(view.phase==='playing'){
   if(!freeze&&!classic&&healthy===1&&this.healthy!==1)events.push({cue:'last',text:'LAST SAFE FROG!'});
   if(classic&&this.states.length&&this.states[view.classic!.it]!=='it')events.push({cue:'infect',...(view.classic!.it===local?{text:'YOU’RE IT!'}:{})});
   if(freeze){const current=view.freeze!.frozen[local]?'frozen':'runner';if(this.states[local]==='runner'&&current==='frozen')events.push({cue:'infect',text:'YOU’RE FROZEN!'});if(this.states[local]==='frozen'&&current==='runner')events.push({cue:'transform',text:'RESCUED!'});}
   if(!freeze&&!classic&&view.players.some((p,i)=>!p.patientZero&&this.states[i]==='healthy'&&p.state!=='healthy'))events.push({cue:'infect',...(this.states[local]==='healthy'&&view.players[local]?.state!=='healthy'?{text:'YOU’RE POISONED!'}:{})});
   if(!freeze&&!classic&&this.states[local]==='transforming'&&view.players[local]?.state==='infectious')events.push({cue:'transform'});
  }
  this.phase=view.phase;this.healthy=healthy;this.states=view.players.map(p=>classic?(p.slot===view.classic!.it?'it':'runner'):freeze?(view.freeze!.frozen[p.slot]?'frozen':'runner'):p.state);return events;
 }
}
