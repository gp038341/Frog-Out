import type {FrogState} from '../simulation/state';
import type {ArenaChaosState} from '../chaos/arena-chaos';
import type {OutbreakView} from '../game/outbreak';
import type {Cue,GameAudio} from './audio';
/** Presentation-only snapshot edges. No timers, inputs, physics writes or invented hit confirmation. */
export class ChaosSounds {
 private key='';private previous:FrogState[]=[];private arena?:ArenaChaosState;private seen=new Set<string>();private windAt=-Infinity;
 constructor(private audio:Pick<GameAudio,'play'|'silence'>){}
 reset(){this.previous=[];this.arena=undefined;this.seen.clear();this.windAt=-Infinity;this.audio.silence('wind');}
 update(states:readonly FrogState[],arena:ArenaChaosState|undefined,view:OutbreakView|undefined,local:number,modifiers:readonly string[],now=performance.now()){
  const key=view?`${view.mode??'poison'}:${view.patientZeroOrder.join(',')}:${view.round}`:'';
  if(key!==this.key){this.reset();this.key=key;}
  if(view?.phase!=='playing'){this.reset();return;}
  const batch=new Map<Cue,number>(),me=states[local],gain=(f:FrogState,i:number)=>i===local?1:me&&Math.hypot(me.x-f.x,me.y-f.y)<9?.35:0;
  const emit=(cue:Cue,level:number)=>{if(level>0)batch.set(cue,Math.max(level,batch.get(cue)??0));};
  const edge=(i:number,name:string,value:number|undefined,old:number|undefined)=>{if(value===undefined||value===old)return false;const id=`${i}:${name}:${value}`;if(this.seen.has(id))return false;this.seen.add(id);if(this.seen.size>1024)this.seen.delete(this.seen.values().next().value!);return true;};
  states.forEach((f,i)=>{const before=this.previous[i];if(!before){for(const [name,value]of [['sticky',f.stickyAttachTick],['pogo',f.pogoTick],['balloon',f.balloonPopTick],['bumper',f.bumperTick],['swap',f.swapTick],['bubble-out',f.bubbleEscapeTick],['gravity',f.gravityFlipTick],['magnet',f.aimAssistTick]])if(value!==undefined)this.seen.add(`${i}:${name}:${value}`);return;}if(f.active===false)return;const level=gain(f,i);
   if(edge(i,'sticky',f.stickyAttachTick,before.stickyAttachTick))emit('sticky',level*.8);
   if(edge(i,'pogo',f.pogoTick,before.pogoTick))emit('boing',level);
   if(edge(i,'balloon',f.balloonPopTick,before.balloonPopTick))emit('boing',Math.max(.65,level)*+(i===local||level>0));
   if(edge(i,'bumper',f.bumperTick,before.bumperTick))emit('boing',level);
   if(edge(i,'swap',f.swapTick,before.swapTick))emit('teleport',level);
   if(edge(i,'bubble-out',f.bubbleEscapeTick,before.bubbleEscapeTick))emit('bubble_pop',level);
   if(f.bubbleId!==undefined&&before.bubbleId===undefined)emit('bubble_in',level*.65);
   if(f.bubbleId!==undefined&&edge(i,'bubble-tap',f.bubblePressTick,before.bubblePressTick)&&i===local)emit('bubble_tap',.4);
   if(f.swapPartner!==undefined&&before.swapPartner===undefined&&i===local)emit('swap_warn',.6);
   if(f.gravityWarningSeconds!==undefined&&f.gravityWarningSeconds!==before.gravityWarningSeconds&&i===local)emit('count',1);
   if(edge(i,'gravity',f.gravityFlipTick,before.gravityFlipTick)&&i===local)emit('go',1);
   if(modifiers.includes('magnet_mouths')&&f.aimAssistTick!==undefined&&f.aimAssistTarget!==undefined&&f.tongue){const target=states[f.aimAssistTarget],t=f.tongue,near=target&&Math.hypot(t.tip.x-target.x,t.tip.y-target.y)<(target.radius??.45)+2,attached=t.phase==='attached'&&t.target&&'frog'in t.target;if((t.phase==='flying'&&near||attached)&&edge(i,'magnet',f.aimAssistTick,undefined))emit('magnet',level*.8);}
  });
  // One dry crack per visible platform warning; coalesce simultaneous cracks.
  if(this.arena&&arena)for(const p of arena.platforms){const before=this.arena.platforms.find(q=>q.id===p.id);if(before&&p.stage==='cracking'&&before.stage!=='cracking')emit('crack',.5);}
  // Only substantial, nearby direction reversals; not every ball contact or natural apex.
  if(this.arena&&arena&&me)for(const b of arena.balls){const old=this.arena.balls.find(q=>q.id===b.id);if(old&&Math.hypot(me.x-b.x,me.y-b.y)<8&&(old.vy>5&&b.vy< -5||old.vx*b.vx<0&&Math.abs(old.vx-b.vx)>12))emit('ball_thump',.3);}
  // A soft, finite noise burst forms the gust bed; never competes for the local action cooldown.
  if(arena?.wind.stage==='gust'){if(now-this.windAt>=500){this.windAt=now;emit('wind',.65);}}else{this.audio.silence('wind');this.windAt=-Infinity;}
  // Local/strongest event wins within each family instead of eight identical simultaneous voices.
  const priority:Partial<Record<Cue,number>>={go:0,count:1,bubble_pop:2,teleport:3,magnet:4,boing:5,sticky:6,swap_warn:7,crack:8,ball_thump:9,bubble_in:10,bubble_tap:11,wind:12};
  for(const [cue,intensity]of [...batch].sort((a,b)=>(priority[a[0]]??20)-(priority[b[0]]??20)))this.audio.play(cue,intensity);
  this.previous=states.map(f=>({...f,tongue:f.tongue?{...f.tongue,tip:{...f.tongue.tip}}:undefined}));this.arena=arena;
 }
}
