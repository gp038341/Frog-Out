import {Circle,Transform,Vec2,testOverlap,type Body} from 'planck';
import {getArena,type ArenaId} from '../src/simulation/arenas';
import type {Simulation} from '../src/simulation/world';
export type Spawn={x:number;y:number;source:number};
/** Authored ordinary-surface seats, not spring launchers. Indices refer to shared collision geometry. */
const ground=Array.from({length:8},(_,i)=>[0,2+36*i/7] as const);
export const SPAWN_SEATS:Record<string,readonly (readonly[number,number])[]>={
 canopy:[...ground,[4,7],[5,33],[6,12],[7,28],[8,20],[9,7],[10,33]],
 'sunny-pond':[...ground,[4,6],[5,34],[8,20],[9,8],[10,32],[11,20],[12,3.8],[13,36.2]],
 bathhouse:[...ground,[4,8],[6,19],[7,6],[8,34],[10,26]],
 toyshop:[...ground,[4,7],[6,15],[7,35],[8,6],[9,24],[11,33]],
};
export function spawnRandom(seed:number){let state=seed>>>0;state=Math.imul(state^(state>>>16),0x45d9f3b);state=Math.imul(state^(state>>>16),0x45d9f3b);state=(state^(state>>>16))>>>0;return()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);}
function terrain(sim:Simulation,b:Body){const data=b.getUserData()as any;return b.isActive()&&!sim.frogs.some(f=>f.body===b)&&!data?.chaosBall&&!data?.chaosBallBoundary;}
/** Validate against actual fixtures after reset/Chaos configuration, including effective frog radius. */
export function spawnCandidates(sim:Simulation,id:ArenaId):Spawn[]{const a=getArena(id),radius=sim.tuning.frogRadius;const dynamicPlatforms=new Set<Body>();for(let b=sim.world.getBodyList();b;b=b.getNext())if(b.isDynamic()&&(b.getUserData()as any)?.chaosPlatform)dynamicPlatforms.add(b);
 const result:Spawn[]=[];for(const[source,x]of SPAWN_SEATS[id]??SPAWN_SEATS.canopy){const solid=a.solids[source];if(!solid)continue;// Weighted rotating perches can tip during countdown; use evenly spread permanent ground seats.
  if(source!==0&&dynamicPlatforms.size)continue;let hit:{y:number;body:Body}|undefined;
  sim.world.rayCast(Vec2(x,solid.y-solid.h/2-1.5),Vec2(x,solid.y+solid.h/2+.1),(fixture,p,n,fraction)=>{const b=fixture.getBody();if(!terrain(sim,b)||fixture.isSensor()||n.y>-.8)return -1;hit={y:p.y,body:b};return fraction;});
  if(!hit)continue;const p={x,y:hit.y-radius-.04,source},transform=Transform(Vec2(p.x,p.y),0);let blocked=false;for(let b=sim.world.getBodyList();b&&!blocked;b=b.getNext()){if(!terrain(sim,b))continue;for(let fixture=b.getFixtureList();fixture;fixture=fixture.getNext())if(!fixture.isSensor()&&testOverlap(Circle(radius+.015),0,fixture.getShape(),0,transform,b.getTransform())){blocked=true;break;}}
  if(!blocked)result.push(p);
 }return result;
}
/** Farthest-point spread then independent seeded seat assignment; never reads tagger/runner roles. */
export function distributedSpawns(sim:Simulation,id:ArenaId,seed:number):Spawn[]{const random=spawnRandom(seed),available=spawnCandidates(sim,id),chosen:Spawn[]=[];if(available.length<sim.frogs.length)throw Error(`Insufficient validated spawn seats: ${id}`);chosen.push(available.splice(Math.floor(random()*available.length),1)[0]);while(chosen.length<sim.frogs.length){let best=-1,score=-1;for(let i=0;i<available.length;i++){const p=available[i],distance=Math.min(...chosen.map(q=>Math.hypot(p.x-q.x,p.y-q.y)));if(distance>score){score=distance;best=i;}}chosen.push(available.splice(best,1)[0]);}for(let i=chosen.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[chosen[i],chosen[j]]=[chosen[j],chosen[i]];}return chosen;}
export function placeRoundSpawns(sim:Simulation,id:ArenaId,seed:number,previous?:readonly Spawn[]){const points=distributedSpawns(sim,id,seed);if(previous?.length===points.length&&points.every((p,i)=>p.x===previous[i].x&&p.y===previous[i].y))points.push(points.shift()!);points.forEach((p,i)=>{const f=sim.frogs[i];sim.cancelAction(f);f.body.setTransform(Vec2(p.x,p.y),0);f.body.setLinearVelocity(Vec2(0,0));f.body.setAngularVelocity(0);f.grounded=false;f.coyote=0;f.suppressSupport=0;});sim.world.step(0);return points;}
