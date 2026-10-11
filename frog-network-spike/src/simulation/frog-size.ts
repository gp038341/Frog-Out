import {Circle} from 'planck';
import type {Simulation} from './world';
/** Applied outside world.step, between rounds. Preserve body, mass, momentum and identity. */
export function resizeFrogs(sim:Simulation){
 const radius=sim.tuning.frogRadius;
 if(sim.frogs.every(f=>(f.body.getFixtureList()?.getShape() as Circle)?.getRadius()===radius))return;
 for(const f of sim.frogs)sim.detach(f);
 for(const f of sim.frogs){const fixture=f.body.getFixtureList();if(!fixture)continue;
  if((fixture.getShape() as Circle).getRadius()===radius)continue;
  const velocity=f.body.getLinearVelocity().clone();f.body.destroyFixture(fixture);
  f.body.createFixture(Circle(radius),{density:sim.tuning.frogMass/(Math.PI*radius*radius),friction:sim.tuning.friction,restitution:sim.tuning.restitution});
  f.body.setLinearVelocity(velocity);f.body.setAwake(true);
 }
}
