import type {Simulation} from '../../src/simulation/world';
import {navigationGraph,nearestSurface,standing,clamp,type Point,type Surface} from '../../server/navigation/geometry';
import type {Navigator} from '../../server/navigation/navigator';
import type {TacticalState} from '../../server/strategy/state';
export const TACTICS={decisionTicks:12,commitTicks:60,retargetRatio:.65,dangerDistance:3.1,rescueClearance:4.2,predictionSeconds:.28,failedTargetTicks:240};
type Choice={slot:number;cost:number;point:Point};
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
/** Independent utility decisions over public state. Outputs destinations only; B1 owns every action. */
export class Tactics{
 goal?:Point;target?:number;intent:'pursue'|'evade'|'rescue'|'reposition'|'wait'='reposition';
 readonly caution:number;readonly aggression:number;private next=0;private signature='';private committedUntil=0;private goalSince=0;private lastRecovery=0;private failed=new Map<number,number>();private badGoals:{point:Point;until:number}[]=[];
 stats={decisions:0,targetChanges:0,roleChanges:0,pursuits:0,evades:0,rescues:0,waits:0,fallbacks:0};
 constructor(private random:()=>number){this.caution=.85+random()*.3;this.aggression=.85+random()*.3;}
 reset(){this.next=0;this.signature='';this.target=undefined;this.goal=undefined;this.committedUntil=0;this.goalSince=0;this.lastRecovery=0;this.failed.clear();this.badGoals=[];this.intent='reposition';}
 suspend(){this.next=0;}
 update(sim:Simulation,index:number,state:TacticalState,nav:Navigator){
  if(state.phase!=='playing'||!state.players[index]?.present||state.players[index].frozen){this.suspend();return;}
  const tick=sim.tick,me=sim.frogs[index],p=me.body.getPosition(),record=state.players[index];
  const signature=[state.mode,state.round,state.tagger,...state.players.map((s,i)=>`${+s.present}${+s.poisoned}${+s.infectious}${+s.frozen}${+(s.protectedUntil>tick||((sim.frogs[i]?.swapProtectedUntil??0)>tick))}`)].join(':');
  const changed=signature!==this.signature;if(!changed&&tick<this.next)return;
  if(changed){this.signature=signature;this.committedUntil=0;this.stats.roleChanges++;this.failed.clear();}
  this.next=tick+TACTICS.decisionTicks+Math.floor(this.random()*4);this.stats.decisions++;
  const recovered=nav.stats.recoveries>this.lastRecovery;if(recovered){if(this.goal)this.badGoals.push({point:{...this.goal},until:tick+TACTICS.failedTargetTicks});this.badGoals=this.badGoals.filter(g=>g.until>tick).slice(-12);if(this.target!==undefined)this.failed.set(this.target,tick+TACTICS.failedTargetTicks);this.lastRecovery=nav.stats.recoveries;this.committedUntil=0;}
  const graph=navigationGraph(sim),from=nearestSurface(graph.surfaces,p,sim),costs=this.travelCosts(sim,from),travel=(q:Point)=>{const to=nearestSurface(graph.surfaces,q,sim);if(!from||!to)return distance(p,q)/sim.tuning.groundSpeed+2;const cost=costs.get(to.id);return cost===undefined?Infinity:cost+distance(q,standing(to,clamp(q.x,to.left,to.right),sim.tuning.frogRadius))/sim.tuning.groundSpeed+(to===from?Math.abs(q.x-p.x)/sim.tuning.groundSpeed:0);};
  const active=state.players.flatMap((s,i)=>i!==index&&s.present&&sim.frogs[i]?.body.isActive()?[i]:[]),hunter=state.mode==='poison'?record.poisoned:index===state.tagger;
  const threats=active.filter(i=>state.mode==='poison'?state.players[i].poisoned:i===state.tagger),threatDistance=threats.length?Math.min(...threats.map(i=>distance(p,sim.frogs[i].body.getPosition()))):Infinity;
  let goal:Point|undefined;
  if(hunter){const targets=active.filter(i=>state.mode==='poison'?!state.players[i].poisoned:state.mode==='freeze'?!state.players[i].frozen:i!==state.tagger);const choices:Choice[]=targets.flatMap(slot=>{const target=sim.frogs[slot],q=target.body.getPosition();if((this.failed.get(slot)??0)>tick||state.players[slot].protectedUntil>tick||(target.swapProtectedUntil??0)>tick||(me.swapProtectedUntil??0)>tick)return[];const cost=travel(q)+(Math.abs(q.y-p.y)>2?.3:0)+((this.failed.get(slot)??0)>tick?8:0);return Number.isFinite(cost)?[{slot,cost,point:{...q}}]:[];}).sort((a,b)=>a.cost-b.cost);
   const selected=this.choose(choices,tick);if(selected){const target=sim.frogs[selected.slot],v=target.body.getLinearVelocity(),near=distance(p,selected.point)<2.2,lead=near?0:Math.min(TACTICS.predictionSeconds,selected.cost*.12)*this.aggression*( .8+this.random()*.3);goal={x:clamp(selected.point.x+v.x*lead,sim.tuning.frogRadius+.1,40-sim.tuning.frogRadius-.1),y:clamp(selected.point.y+v.y*lead,.7,21)};this.intent='pursue';this.stats.pursuits++;}
   else {this.target=undefined;const retry=targets.length>0&&targets.every(i=>(this.failed.get(i)??0)>tick);this.intent=retry?'reposition':'wait';if(retry){this.stats.fallbacks++;goal=this.escape(sim,p,[],travel,state.remainingMs,true);}else this.stats.waits++;const slot=targets.sort((a,b)=>distance(p,sim.frogs[a].body.getPosition())-distance(p,sim.frogs[b].body.getPosition()))[0];if(slot!==undefined&&!goal){const q=sim.frogs[slot].body.getPosition(),d=distance(p,q)||1;goal={x:clamp(q.x+(p.x-q.x)/d*2,1,39),y:clamp(q.y+(p.y-q.y)/d*2,1,21)};}}
  }else{
   const freezer=state.mode==='freeze'?sim.frogs[state.tagger]:undefined;
   const rescue=state.mode==='freeze'&&threatDistance>TACTICS.dangerDistance*this.caution?active.filter(i=>state.players[i].frozen).map(slot=>{const q=sim.frogs[slot].body.getPosition(),enemy=freezer!.body.getPosition(),clear=distance(q,enemy),cost=travel(q),enemyTime=clear/Math.max(1,sim.tuning.groundSpeed);return{slot,cost,point:{...q},clear,enemyTime};}).filter(c=>Number.isFinite(c.cost)&&c.clear>TACTICS.rescueClearance*this.caution&&(c.cost<c.enemyTime*1.1||c.clear>9)).sort((a,b)=>a.cost-b.cost)[0]:undefined;
   if(rescue){this.select(rescue.slot,tick);this.intent='rescue';this.stats.rescues++;goal=rescue.point;}
   else{this.target=undefined;this.intent='evade';this.stats.evades++;goal=this.escape(sim,p,threats,travel,state.remainingMs,changed||recovered);}
  }
  if(goal){if(!nav.goal)nav.setDestination(goal);else nav.goal={...goal};this.goal={...goal};}else this.stats.fallbacks++;
 }
 private select(slot:number,tick:number){if(this.target!==slot){this.stats.targetChanges++;this.target=slot;this.committedUntil=tick+TACTICS.commitTicks;}}
 private choose(choices:Choice[],tick:number){if(!choices.length)return;let best=choices[0],current=choices.find(c=>c.slot===this.target);if(current&&((tick<this.committedUntil&&best.cost>=current.cost*TACTICS.retargetRatio)||best.cost>=current.cost*.8))best=current;else if(choices[1]&&choices[1].cost<best.cost*1.2+.15&&this.random()<.07)best=choices[1];this.select(best.slot,tick);return best;}
 private travelCosts(sim:Simulation,from?:Surface){const graph=navigationGraph(sim),costs=new Map<string,number>(),done=new Set<string>();if(!from)return costs;costs.set(from.id,0);for(let n=0;n<graph.surfaces.length;n++){let current:Surface|undefined;for(const s of graph.surfaces)if(!done.has(s.id)&&costs.has(s.id)&&(!current||costs.get(s.id)!<costs.get(current.id)!))current=s;if(!current)break;done.add(current.id);for(const e of graph.links.get(current.id)??[]){const time=costs.get(current.id)!+e.cost/Math.max(1,sim.tuning.groundSpeed)+(e.kind==='charge'?.6:e.kind==='grapple'?.4:0);if(time<(costs.get(e.to.id)??Infinity))costs.set(e.to.id,time);}}return costs;}
 private escape(sim:Simulation,p:Point,threats:number[],travel:(p:Point)=>number,remainingMs:number,changed:boolean){const graph=navigationGraph(sim),points:Point[]=[];for(const s of graph.surfaces){for(const x of[s.left+.1,(s.left+s.right)/2,s.right-.1]){const q=standing(s,x,sim.tuning.frogRadius);if(q.x>.8&&q.x<39.2&&q.y>.6&&q.y<21.3)points.push(q);}}
  // Short local escapes on a broad floor avoid traversing the entire stage before reacting.
  const surface=nearestSurface(graph.surfaces,p,sim);if(surface)for(const dx of[-7,-3,3,7])points.push(standing(surface,clamp(p.x+dx,surface.left,surface.right),sim.tuning.frogRadius));
  const score=(q:Point)=>{const cost=travel(q);if(!Number.isFinite(cost))return-Infinity;const failedGoal=this.badGoals.some(g=>g.until>sim.tick&&distance(g.point,q)<1.5)?6:0;const nearest=threats.length?Math.min(...threats.map(i=>{const f=sim.frogs[i],at=f.body.getPosition(),v=f.body.getLinearVelocity();return distance(q,{x:at.x+v.x*.15,y:at.y+v.y*.15});})):8;const corner=q.x<2||q.x>38?2:0,close=distance(p,q)<1.5?1.5:0,late=remainingMs>0&&remainingMs<10000?1.3:1;let crossing=0;for(const i of threats){const t=sim.frogs[i].body.getPosition(),dx=q.x-p.x,dy=q.y-p.y,den=dx*dx+dy*dy,u=den?clamp(((t.x-p.x)*dx+(t.y-p.y)*dy)/den,0,1):0;if(u>.05&&u<.9&&distance(t,{x:p.x+dx*u,y:p.y+dy*u})<2)crossing+=5;}return Math.min(nearest,16)*this.caution-cost*.75*late-corner-close-crossing-failedGoal;};
  const ranked=points.map(point=>({point,score:score(point)})).filter(c=>Number.isFinite(c.score)).sort((a,b)=>b.score-a.score);if(!ranked.length)return;let best=ranked[0];if(this.goal&&!changed&&sim.tick-this.goalSince<480&&distance(p,this.goal)>.85&&score(this.goal)>best.score-1.8)return this.goal;
  if(ranked[1]&&ranked[1].score>best.score-1&&this.random()<.1)best=ranked[1];this.goalSince=sim.tick;return best.point;
 }
}
