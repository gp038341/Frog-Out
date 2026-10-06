import {Circle,Vec2} from 'planck';
import {SpikeRoom} from './room';
export class StressRoom extends SpikeRoom {
 maxClients=8;
 onCreate(){
  const t=this.sim.tuning;
  for(let i=2;i<8;i++){
   const body=this.sim.world.createDynamicBody({position:Vec2(2+i*3.5,16),fixedRotation:true,bullet:true});
   body.createFixture(Circle(t.frogRadius),{density:t.frogMass/(Math.PI*t.frogRadius**2),friction:t.friction,restitution:t.restitution});
   this.sim.frogs.push({...this.sim.frogs[0],body,input:{x:0,y:0,held:false},events:[],pressDirection:{x:0,y:0,held:false}});
  }
  this.sim.frogs.forEach((f,i)=>f.body.setTransform(Vec2(2+i*3.5,16),0));
  this.ack=Array(8).fill(0);this.received=Array(8).fill(0);this.lastInput=Array(8).fill(0);this.queues=Array.from({length:8},()=>[]);
  super.onCreate();
 }
}
