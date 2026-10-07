import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Vec2} from 'planck';
import {Simulation} from '../src/simulation/world';
import {sizeSimulation} from '../src/simulation/roster';
import {arena,WIDTH,HEIGHT,FLOOR_TOP,spawnPoint} from '../src/simulation/arena';
import {defaults} from '../src/simulation/config';
const hash=(s:string|Buffer)=>createHash('sha256').update(s).digest('hex');
test('M6 preserves approved M5 controllers, tuning, network, input, lifecycle and Outbreak rules',()=>{
 const b=JSON.parse(readFileSync(new URL('../docs/approved-milestone-5.json',import.meta.url),'utf8'));
 for(const path of ['src/simulation/world.ts','src/simulation/state.ts','src/network/protocol.ts','src/network/predictor.ts','src/network/client.ts','server/room.ts','server/party-room.ts','server/outbreak-room.ts','src/game/outbreak.ts','src/input/touch.ts'])assert.equal(hash(readFileSync(new URL(`../${path}`,import.meta.url))),b.sha256[path],path);
 const config=readFileSync(new URL('../src/simulation/config.ts',import.meta.url),'utf8');assert.equal(hash(config.split('// Milestone 6')[0]),b.tuningPrefixSha256);
});
test('courtyard adds 56% area, preserves single-screen ratio and clear ground corridor',()=>{
 assert.equal(WIDTH/HEIGHT,32/18);assert.equal(WIDTH*HEIGHT/(32*18),1.5625);
 for(let x=1;x<WIDTH-1;x+=.25)assert.ok(!arena.slice(4).some(r=>Math.abs(x-r.x)<r.w/2&&r.y+r.h/2>FLOOR_TOP-2),'ground route blocked');
 // Side launches and middle-to-high route remain within a full charge height; ceilings/platforms stay in tongue range.
 const height=defaults.chargedJumpImpulse**2/(2*defaults.gravity);
 for(const gap of [FLOOR_TOP-(16-.25),16-11.5,11.5-7,7-5])assert.ok(gap<height);
 assert.ok(11.5-.5<defaults.tongueRange);
});
for(const count of [2,3,4,8])test(`${count}-frog courtyard spawn, stress and recovery are safe`,()=>{
 const sim=new Simulation();sizeSimulation(sim,count);sim.reset();let resets=0;const reset=sim.reset.bind(sim);sim.reset=()=>{resets++;reset();};
 for(let i=0;i<count;i++){const p=spawnPoint(i,count);assert.equal(sim.frogs[i].body.getPosition().x,p.x);assert.ok(p.y<FLOOR_TOP-defaults.frogRadius);}
 for(let n=0;n<180;n++)sim.step();assert.ok(sim.frogs.every(f=>f.grounded));
 for(let n=0;n<1800;n++){sim.frogs.forEach((f,i)=>{const phase=(n+i*61)%240;sim.setInput(i,{x:phase<120?1:-1,y:phase<120?-1:0,held:phase<60||phase>=100&&phase<140});});sim.step();for(const f of sim.frogs){const p=f.body.getPosition(),v=f.body.getLinearVelocity();assert.ok(Number.isFinite(p.x+p.y+v.x+v.y));assert.ok(Math.hypot(v.x,v.y)<80);}}
 assert.equal(resets,0);sim.clearInputs();sim.frogs[0].body.setTransform(Vec2(WIDTH+6,HEIGHT),0);sim.step();assert.equal(resets,1);assert.ok(sim.frogs.every(f=>f.body.getPosition().y===FLOOR_TOP-1));
});
