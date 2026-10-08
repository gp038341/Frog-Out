import {m12PreservedSource} from './preserved-source';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Simulation} from '../src/simulation/world';
import {sizeSimulation} from '../src/simulation/roster';
import {capture,restore} from '../src/simulation/state';
import {Predictor} from '../src/network/predictor';
import {NETWORK} from '../src/network/protocol';
test('approved Milestone 2 movement controller and network tuning remain unchanged',()=>{
 const baseline=JSON.parse(readFileSync(new URL('../docs/approved-milestone-2.json',import.meta.url),'utf8'));
 for(const path of ['src/simulation/world.ts'])assert.equal(createHash('sha256').update(m12PreservedSource(path)).digest('hex'),baseline.sha256[path]);
 assert.deepEqual(NETWORK,{snapshotHz:30,inputHz:30,interpolationMs:65,staleInputMs:350,maxPredictionMs:250,correctionSmoothMs:80,snapDistance:2});
});
for(const count of [2,3,8])test(`${count}-frog authoritative state restores all bodies and controller state`,()=>{
 const s=new Simulation();sizeSimulation(s,count);s.reset();s.setInput(count-1,{x:-1,y:0,held:true});for(let i=0;i<10;i++)s.step();const state=capture(s),other=new Simulation();restore(other,state);assert.deepEqual(capture(other),state);other.step();assert.equal(other.frogs.length,count);
 const predictor=new Predictor();predictor.slot=count-1;const snap={state,serverTime:1000,ack:Array(count).fill(0),connected:Array(count).fill(true),tickMs:{p50:0,p95:0,p99:0,max:0},overruns:0,resetId:1};predictor.reconcile(snap,1000,0);predictor.reconcile(snap,1017,0);assert.equal(predictor.visualOffsets.length,count);assert.ok(Number.isFinite(predictor.lastCorrection));
});
test('changing roster destroys surplus bodies and their tongues without changing two-player spawns',()=>{
 const s=new Simulation();sizeSimulation(s,8);s.reset();assert.equal(new Set(s.frogs.map(f=>f.body.getPosition().x)).size,8);sizeSimulation(s,2);s.reset();assert.deepEqual(s.frogs.map(f=>f.body.getPosition().x),[12,20]);assert.equal(capture(s).frogs.length,2);assert.throws(()=>sizeSimulation(s,9));
});
