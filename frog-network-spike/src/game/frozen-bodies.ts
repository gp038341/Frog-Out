import {Vec2} from 'planck';
import type {Simulation} from '../simulation/world';
/** Mode-only immobilization. Normal dynamic bodies and tuning are restored on rescue/reset. */
export function syncFrozenBodies(sim:Simulation,frozen:readonly boolean[]=[]){const targets=new Set(sim.frogs.filter((_,i)=>frozen[i]).map(f=>f.body));for(const [i,f]of sim.frogs.entries()){
 if(frozen[i]){sim.cancelAction(f);f.input={x:0,y:0,held:false};f.events=[];f.body.setLinearVelocity(Vec2(0,0));f.body.setAngularVelocity(0);if(f.body.isDynamic())f.body.setType('static');f.body.setUserData({frozenTag:true});f.stickyMud=undefined;f.slipperySoap=undefined;f.surfaceBounceTick=undefined;f.poisonPullFromTick=undefined;}
 else if((f.body.getUserData()as{frozenTag?:boolean}|undefined)?.frozenTag){f.body.setType('dynamic');f.body.setUserData(undefined);f.body.setAwake(true);}
 if(f.tongue?.target&&targets.has(f.tongue.target))sim.detach(f);
 }}
export function stepFrozenBodies(sim:Simulation,frozen:readonly boolean[],step:()=>void){syncFrozenBodies(sim,frozen);step();syncFrozenBodies(sim,frozen);}
