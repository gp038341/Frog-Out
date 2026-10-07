import {Circle,Vec2} from 'planck';
import {Simulation} from './world';
import {spawnPoint} from './arena';
const multiReset=new WeakSet<Simulation>();
/** Room-size adapter. Milestone 6 uses safe floor spawns for the expanded arena. */
export function sizeSimulation(sim:Simulation,count:number){
 if(count<2||count>8)throw Error('Physics roster must contain 2–8 frogs');
 if(sim.frogs.length!==count){for(const f of sim.frogs)sim.detach(f);}
 while(sim.frogs.length>count){const f=sim.frogs.pop()!;sim.world.destroyBody(f.body);}
 const t=sim.tuning;
 while(sim.frogs.length<count){const body=sim.world.createDynamicBody({position:Vec2(16,16),fixedRotation:true,bullet:true});body.createFixture(Circle(t.frogRadius),{density:t.frogMass/(Math.PI*t.frogRadius**2),friction:t.friction,restitution:t.restitution});const template=new Simulation(t);const f=template.frogs[0];sim.frogs.push({...f,body,input:{x:0,y:0,held:false},events:[],pressDirection:{x:0,y:0,held:false}});}
 if(!multiReset.has(sim)){const original=sim.reset.bind(sim);sim.reset=()=>{original();sim.frogs.forEach((f,i)=>{const p=spawnPoint(i,sim.frogs.length);f.body.setTransform(Vec2(p.x,p.y),0);});};multiReset.add(sim);}
}
