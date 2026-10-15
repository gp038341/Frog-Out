// Approved B2 bbf283ffe5bbc364fcd6cde7468b8352ce0f7d55 comparison fixture; import paths only changed.
import type {Simulation} from '../../src/simulation/world';
import {navigationGraph,nearestSurface,route,standing,clamp,type Point,type Surface} from './bot-c-b2-geometry';
import type {Navigator} from './bot-c-b2-navigator';
import type {TacticalState} from '../../server/strategy/state';
export const TACTICS={decisionTicks:12,commitTicks:60,retargetRatio:.65,dangerDistance:3.1,rescueClearance:4.2,predictionSeconds:.28,failedTargetTicks:240};
export type Preferences={vertical:number;grapple:number;risk:number;rescue:number;side:number;intercept:number;commitTicks:number;cadence:number;phase:number;salt:number};
const mix=(n:number)=>{n=Math.imul(n^(n>>>16),0x21f0aaad);n=Math.imul(n^(n>>>15),0x735a2d97);return(n^(n>>>15))>>>0;};
type Choice={slot:number;cost:number;point:Point};
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
/** Independent utility decisions over public state. Outputs destinations only; B1 owns every action. */
export class Tactics{
 goal?:Point;target?:number;intent:'pursue'|'evade'|'rescue'|'reposition'|'wait'='reposition';
 readonly caution:number;readonly aggression:number;readonly preferences:Readonly<Preferences>;private random:()=>number;private activated=-1;private next=0;private signature='';private committedUntil=0;private goalSince=0;private lastRecovery=0;private failed=new Map<number,number>();private badGoals:{point:Point;until:number}[]=[];private visits=new Map<string,number>();private role='';private committedGoalTick=0;
 stats={decisions:0,targetChanges:0,roleChanges:0,pursuits:0,evades:0,rescues:0,waits:0,fallbacks:0,goalCommits:0,goalDeferrals:0,arrivalAdvances:0};
 constructor(random:()=>number){
  // Dedicated tactical stream: no shared team plan or navigator/vote RNG coupling.
  let seed=mix(Math.floor(random()*4294967296));this.random=()=>{seed=mix(seed+0x9e3779b9);return seed/4294967296;};const r=this.random;
  this.caution=.85+r()*.3;this.aggression=.85+r()*.3;
  this.preferences=Object.freeze({vertical:.45+r()*1.2,grapple:.7+r()*.65,risk:.8+r()*.4,rescue:.8+r()*.4,side:r()*2-1,intercept:.7+r()*.6,commitTicks:48+Math.floor(r()*49),cadence:10+Math.floor(r()*7),phase:Math.floor(r()*13),salt:Math.floor(r()*4294967296)});
 }
 reset(){this.activated=-1;this.next=0;this.signature='';this.target=undefined;this.goal=undefined;this.committedUntil=0;this.goalSince=0;this.lastRecovery=0;this.failed.clear();this.badGoals=[];this.visits.clear();this.role='';this.committedGoalTick=0;this.intent='reposition';}
 suspend(){this.next=0;}
 update(sim:Simulation,index:number,state:TacticalState,nav:Navigator){
  if(state.phase!=='playing'||!state.players[index]?.present||state.players[index].frozen){this.suspend();return;}
  const tick=sim.tick;if(this.activated<0)this.activated=tick;const me=sim.frogs[index],p=me.body.getPosition(),record=state.players[index];
  const signature=[state.mode,state.round,state.tagger,...state.players.map((s,i)=>`${+s.present}${+s.poisoned}${+s.infectious}${+s.frozen}${+(s.protectedUntil>tick||((sim.frogs[i]?.swapProtectedUntil??0)>tick))}`)].join(':');
  const role=state.mode+':'+state.round+':'+(state.mode==='poison'?record.poisoned:index===state.tagger),roleChanged=role!==this.role;this.role=role;const changed=signature!==this.signature;if(!changed&&tick<this.next)return;
  if(changed){this.signature=signature;if(roleChanged){this.committedUntil=0;this.stats.roleChanges++;this.failed.clear();}}
  const cadence=this.preferences.cadence;this.next=tick+1+((this.preferences.phase-tick-1)%cadence+cadence)%cadence;if(this.next-tick<5)this.next+=cadence;this.stats.decisions++;
  const recovered=nav.stats.recoveries>this.lastRecovery;if(recovered){if(this.goal)this.badGoals.push({point:{...this.goal},until:tick+TACTICS.failedTargetTicks});this.badGoals=this.badGoals.filter(g=>g.until>tick).slice(-12);if(this.target!==undefined)this.failed.set(this.target,tick+TACTICS.failedTargetTicks);this.lastRecovery=nav.stats.recoveries;this.committedUntil=0;}
  const graph=navigationGraph(sim),from=nearestSurface(graph.surfaces,p,sim),costs=this.travelCosts(sim,from),travel=(q:Point)=>{const to=nearestSurface(graph.surfaces,q,sim);if(!from||!to)return distance(p,q)/sim.tuning.groundSpeed+2;const cost=costs.get(to.id);return cost===undefined?Infinity:cost+distance(q,standing(to,clamp(q.x,to.left,to.right),sim.tuning.frogRadius))/sim.tuning.groundSpeed+(to===from?Math.abs(q.x-p.x)/sim.tuning.groundSpeed:0);};
  const active=state.players.flatMap((s,i)=>i!==index&&s.present&&sim.frogs[i]?.body.isActive()?[i]:[]),hunter=state.mode==='poison'?record.poisoned:index===state.tagger;
  const threats=active.filter(i=>state.mode==='poison'?state.players[i].poisoned:i===state.tagger),threatDistance=threats.length?Math.min(...threats.map(i=>distance(p,sim.frogs[i].body.getPosition()))):Infinity;
  let goal:Point|undefined;
  if(hunter){const targets=active.filter(i=>state.mode==='poison'?!state.players[i].poisoned:state.mode==='freeze'?!state.players[i].frozen:i!==state.tagger);const choices:Choice[]=targets.flatMap(slot=>{const target=sim.frogs[slot],q=target.body.getPosition();if(state.players[slot].protectedUntil>tick||(target.swapProtectedUntil??0)>tick||(me.swapProtectedUntil??0)>tick)return[];const d=distance(p,q),others=active.filter(i=>i!==slot&&(state.mode==='poison'?state.players[i].poisoned:i===state.tagger));
    // Congestion is inferred from visible positions/velocity, never another CPU's goal.
    const congestion=others.reduce((sum,i)=>{const other=sim.frogs[i],at=other.body.getPosition(),v=other.body.getLinearVelocity(),od=distance(at,q),toward=(q.x-at.x)*v.x+(q.y-at.y)*v.y;return sum+(d>3&&od+1<d?(1-od/Math.max(1,d))*(toward>0?1.8:1.2):0);},0);
    const bias=(mix(this.preferences.salt^Math.imul(slot+1,2654435761))/4294967296-.5)*2;
    const cost=travel(q)+(Math.abs(q.y-p.y)>2?.3/this.preferences.vertical:0)+congestion+bias+((this.failed.get(slot)??0)>tick?8:0);return Number.isFinite(cost)?[{slot,cost,point:{...q}}]:[];}).sort((a,b)=>a.cost-b.cost);
   const selected=this.choose(choices,tick);if(selected){const target=sim.frogs[selected.slot],v=target.body.getLinearVelocity(),near=distance(p,selected.point)<2.2,lead=near?0:Math.min(TACTICS.predictionSeconds,selected.cost*.12)*this.aggression*this.preferences.intercept*( .8+this.random()*.3);goal={x:clamp(selected.point.x+v.x*lead,sim.tuning.frogRadius+.1,40-sim.tuning.frogRadius-.1),y:clamp(selected.point.y+v.y*lead,.7,21)};this.intent='pursue';this.stats.pursuits++;}
   else {this.target=undefined;const retry=targets.length>0&&targets.every(i=>(this.failed.get(i)??0)>tick);this.intent=retry?'reposition':'wait';if(retry){this.stats.fallbacks++;goal=this.escape(sim,p,[],travel,state.remainingMs,true);}else this.stats.waits++;if(!goal)goal=this.escape(sim,p,[],travel,state.remainingMs,roleChanged||recovered);}

  }else{
   const freezer=state.mode==='freeze'?sim.frogs[state.tagger]:undefined;
   const rescue=state.mode==='freeze'&&threatDistance>TACTICS.dangerDistance*this.caution?active.filter(i=>state.players[i].frozen).map(slot=>{const q=sim.frogs[slot].body.getPosition(),enemy=freezer!.body.getPosition(),clear=distance(q,enemy),cost=travel(q),enemyTime=clear/Math.max(1,sim.tuning.groundSpeed);return{slot,cost,point:{...q},clear,enemyTime};}).filter(c=>Number.isFinite(c.cost)&&c.clear>TACTICS.rescueClearance*this.caution/this.preferences.rescue&&(c.cost<c.enemyTime*(.9+this.preferences.rescue*.2)||c.clear>9)).sort((a,b)=>a.cost-b.cost)[0]:undefined;
   if(rescue){this.select(rescue.slot,tick);this.intent='rescue';this.stats.rescues++;goal=rescue.point;}
   else{this.target=undefined;this.intent='evade';this.stats.evades++;goal=this.escape(sim,p,threats,travel,state.remainingMs,roleChanged||recovered);}
  }
  if(goal){const previous=nav.goal,speed=Math.hypot(me.body.getLinearVelocity().x,me.body.getLinearVelocity().y),arriving=!!previous&&distance(p,previous)<Math.max(2.2,speed*.35),busy=!me.grounded||me.jumpPending||me.charging||me.tongue?.phase==='flying'||me.tongue?.phase==='attached',urgent=roleChanged||threatDistance<2.4||recovered,shift=previous?distance(previous,goal):Infinity;
   // Keep B1's launch/shot/reel/release committed. A waypoint can advance before its braking radius.
   if(!previous||(shift>.7&&(!busy||urgent||arriving||this.intent==='pursue'&&shift>4))){nav.continueTo(goal);this.stats.goalCommits++;if(arriving)this.stats.arrivalAdvances++;this.committedGoalTick=tick;}else if(shift>.7)this.stats.goalDeferrals++;
   nav.chase(this.intent==='pursue'?this.target:undefined);this.goal={...(nav.goal??goal)};
  }else this.stats.fallbacks++;
 }
 private select(slot:number,tick:number){if(this.target!==slot){this.stats.targetChanges++;this.target=slot;this.committedUntil=tick+this.preferences.commitTicks;}}
 private choose(choices:Choice[],tick:number){if(!choices.length)return;let best=choices[0],current=choices.find(c=>c.slot===this.target);if(current&&((tick<this.committedUntil&&best.cost>=current.cost*TACTICS.retargetRatio)||best.cost>=current.cost*.8))best=current;else if(choices[1]&&choices[1].cost<best.cost*1.2+.15&&this.random()<.07)best=choices[1];this.select(best.slot,tick);return best;}
 private travelCosts(sim:Simulation,from?:Surface){const graph=navigationGraph(sim),costs=new Map<string,number>(),done=new Set<string>();if(!from)return costs;costs.set(from.id,0);for(let n=0;n<graph.surfaces.length;n++){let current:Surface|undefined;for(const s of graph.surfaces)if(!done.has(s.id)&&costs.has(s.id)&&(!current||costs.get(s.id)!<costs.get(current.id)!))current=s;if(!current)break;done.add(current.id);for(const e of graph.links.get(current.id)??[]){const time=costs.get(current.id)!+e.cost/Math.max(1,sim.tuning.groundSpeed)+(e.kind==='charge'?.6/this.preferences.risk:e.kind==='grapple'?.4/this.preferences.grapple:0);if(time<(costs.get(e.to.id)??Infinity))costs.set(e.to.id,time);}}return costs;}
 private escape(sim:Simulation,p:Point,threats:number[],travel:(p:Point)=>number,remainingMs:number,changed:boolean){
  const graph=navigationGraph(sim),current=nearestSurface(graph.surfaces,p,sim),arrival=2.4,opening=sim.tick-this.activated<150;
  const firstLegs=new Map<string,{launch:Point;land:Point}|undefined>();
  const key=(q:Point)=>Math.round(q.x/2)+':'+Math.round(q.y/2);
  const score=(q:Point)=>{const cost=travel(q);if(!Number.isFinite(cost))return-Infinity;const d=distance(p,q),nearest=threats.length?Math.min(...threats.map(i=>{const f=sim.frogs[i],at=f.body.getPosition(),v=f.body.getLinearVelocity();return distance(q,{x:at.x+v.x*.15,y:at.y+v.y*.15});})):10;
   let crossing=0;for(const i of threats){const t=sim.frogs[i].body.getPosition(),dx=q.x-p.x,dy=q.y-p.y,den=dx*dx+dy*dy,u=den?clamp(((t.x-p.x)*dx+(t.y-p.y)*dy)/den,0,1):0;if(u>.05&&u<.9&&distance(t,{x:p.x+dx*u,y:p.y+dy*u})<2)crossing+=7;}
   const destination=nearestSurface(graph.surfaces,q,sim);let routeRisk=0;if(opening&&current&&destination&&destination!==current&&threats.length){if(!firstLegs.has(destination.id))firstLegs.set(destination.id,route(sim,current,destination,new Map()));const step=firstLegs.get(destination.id),launch=step?.launch;if(step){const firstSafety=Math.min(...threats.map(i=>distance(step.land,sim.frogs[i].body.getPosition())));routeRisk+=Math.max(0,nearest-firstSafety-3)*1.3;}if(launch&&Math.abs(launch.x-p.x)>.7){for(const i of threats){const enemy=sim.frogs[i].body.getPosition();if(distance(launch,enemy)<distance(p,enemy)-.5)routeRisk+=12;}}}
   const traversal=destination&&destination!==current?5:0,vertical=Math.min(6,Math.abs(q.y-p.y))*.3+Math.min(10,Math.max(0,(p.y-q.y)*sim.chaosGravityDirection))*.3,occupied=sim.frogs.filter(f=>distance(f.body.getPosition(),q)<2.5).length*2;
   const directionBias=Math.sign(q.x-p.x)*this.preferences.side*.8+(mix(this.preferences.salt^Math.imul(Math.round(q.x*5)+101*Math.round(q.y*5),2654435761))/4294967296-.5)*3,routeTaste=vertical*(this.preferences.vertical-1)*1.5+(destination?.material==='lily'?this.preferences.risk-.9:0),congestion=sim.frogs.reduce((sum,f)=>{if(f.body.getPosition()===p)return sum;const a=f.body.getPosition();return sum+(distance(a,q)<4?Math.max(0,4-distance(a,q))*.35:0);},0);
   const recent=(this.visits.get(key(q))??-10000)>sim.tick-900?5:0,failed=this.badGoals.some(g=>g.until>sim.tick&&distance(g.point,q)<1.5)?8:0,corner=q.x<2||q.x>38?3:0;
   return Math.min(nearest,24)*this.caution+Math.min(d,12)*.28+traversal+vertical+routeTaste+directionBias-cost*.3-crossing-routeRisk-occupied-congestion-recent-failed-corner;
  };
  const points:Point[]=[];for(const surface of graph.surfaces)for(const fraction of[.12+.09*this.preferences.side,.5+.15*this.preferences.side,.88+.09*this.preferences.side]){const q=standing(surface,surface.left+(surface.right-surface.left)*fraction,sim.tuning.frogRadius);if(q.x>.8&&q.x<39.2&&q.y>.6&&q.y<21.3&&distance(p,q)>3)points.push(q);}
  if(opening&&current)for(const dx of[-6,-4,4,6]){const q=standing(current,clamp(p.x+dx,current.left,current.right),sim.tuning.frogRadius);if(distance(p,q)>3)points.push(q);}
  const ranked=points.map(point=>({point,score:score(point)})).filter(c=>Number.isFinite(c.score)).sort((a,b)=>b.score-a.score);if(!ranked.length)return;
  const approaching=this.goal&&distance(p,this.goal)<Math.max(arrival,4),threatNear=threats.some(i=>distance(p,sim.frogs[i].body.getPosition())<3.1*this.caution);
  if(this.goal&&!changed&&!approaching&&sim.tick-this.goalSince<600&&(!threatNear||score(this.goal)>ranked[0].score-3))return this.goal;
  const pool=ranked.filter(c=>c.score>=ranked[0].score-4).slice(0,5),chosen=pool[Math.floor(this.random()*pool.length)];this.visits.set(key(chosen.point),sim.tick);this.goalSince=sim.tick;return chosen.point;
 }
}
