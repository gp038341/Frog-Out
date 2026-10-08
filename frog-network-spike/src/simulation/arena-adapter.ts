import {Box,Polygon,Vec2} from 'planck';
import type {Simulation} from './world';
import {getArena,type ArenaId} from './arenas';
const selected=new WeakMap<Simulation,ArenaId>();
export function simulationArena(sim:Simulation):ArenaId{return selected.get(sim)??'canopy';}
/** Replace static geometry only, between matches or before client state restoration. */
export function setSimulationArena(sim:Simulation,id:ArenaId){
 if(simulationArena(sim)===id)return;
 sim.clearInputs();
 for(let body=sim.world.getBodyList();body;){const next=body.getNext();if(!body.isDynamic())sim.world.destroyBody(body);body=next;}
 for(const r of getArena(id).solids){const b=sim.world.createBody(Vec2(r.x,r.y));if(r.surface)b.setUserData({surface:r.surface});b.createFixture(r.outline?Polygon(r.outline.map(([x,y])=>Vec2(x,y))):Box(r.w/2,r.h/2),{friction:sim.tuning.friction});}
 selected.set(sim,id);
}
