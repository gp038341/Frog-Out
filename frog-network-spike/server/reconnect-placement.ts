import {Circle,Transform,Vec2,testOverlap} from 'planck';
import {spawnPoint,WIDTH,HEIGHT} from '../src/simulation/arena';
import type {Simulation} from '../src/simulation/world';
/** Restore an existing body at a clear authored floor spawn, or a deterministic clear fallback. */
export function reconnectPoint(sim:Simulation,slot:number){const f=sim.frogs[slot],radius=sim.tuning.frogRadius,candidates=[spawnPoint(slot,sim.frogs.length)];for(let y=HEIGHT-2;y>=1.5;y-=1.5)for(let x=1.5;x<WIDTH-1;x+=1.5)candidates.push({x,y});for(const p of candidates){const transform=Transform(Vec2(p.x,p.y),0);let blocked=false;for(let b=sim.world.getBodyList();b&&!blocked;b=b.getNext()){if(b===f.body||!b.isActive())continue;for(let fix=b.getFixtureList();fix;fix=fix.getNext())if(!fix.isSensor()&&testOverlap(Circle(radius+.04),0,fix.getShape(),0,transform,b.getTransform())){blocked=true;break;}}if(!blocked)return p;}return undefined;}
