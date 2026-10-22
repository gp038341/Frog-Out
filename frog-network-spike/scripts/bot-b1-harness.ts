/** Real-physics traversal fixtures. Pose setup is test-only; controllers receive only read access. */
import {Simulation} from '../src/simulation/world';
import {Navigator} from '../server/navigation/navigator';
import {Box,Vec2} from 'planck';
export const seeded=(initial:number)=>{let seed=initial;return()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);};
export const courses=[
 {name:'same-platform',platforms:[[20,20,40,1]],start:[4,19],goal:[10,19]},
 {name:'normal-jump',platforms:[[20,20,40,1],[10,18.4,4,.5]],start:[4,19],goal:[10,17.665]},
 {name:'charged-jump',platforms:[[20,20,40,1],[10,15,4,.5]],start:[4,19],goal:[10,14.265]},
 {name:'gap-crossing',platforms:[[6,20,8,1],[15,20,6,1]],start:[7,19],goal:[15,19]},
 {name:'grapple-swing-release',platforms:[[20,20,40,1],[20,10,12,.5]],start:[12,19],goal:[22,12]},
];
export function makeCourse(c= courses[0],seed=123){const sim=new Simulation();sim.frogs[1].body.setActive(false);for(let b=sim.world.getBodyList();b;){const next=b.getNext();if(!sim.frogs.some(f=>f.body===b))sim.world.destroyBody(b);b=next;}for(const[x,y,w,h]of c.platforms)sim.world.createBody(Vec2(x,y)).createFixture(Box(w/2,h/2));sim.frogs[0].body.setTransform(Vec2(c.start[0],c.start[1]),0);const nav=new Navigator(seeded(seed));nav.setDestination({x:c.goal[0],y:c.goal[1]});return{sim,nav};}
export function traverse(sim:Simulation,nav:Navigator,frames=1800,index=0){const goal={...nav.goal!};let best=Infinity,frame=-1;for(let i=0;i<frames;i++){const input=nav.input(sim,index);if(!Number.isFinite(input.x)||!Number.isFinite(input.y)||Math.abs(input.x)>1||Math.abs(input.y)>1)throw Error('Non-normalized AI input');sim.setInput(index,input);sim.step();const p=sim.frogs[index].body.getPosition(),d=Math.hypot(p.x-goal.x,p.y-goal.y);best=Math.min(best,d);if(d<.85){frame=i+1;break;}}return{success:frame>=0,seconds:frame>=0?frame/60:null,closestDistance:best,stats:{...nav.stats}};}
