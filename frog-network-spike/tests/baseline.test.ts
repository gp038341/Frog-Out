import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {capture,restore} from '../src/simulation/state';import {Simulation} from '../src/simulation/world';import {Vec2} from 'planck';
test('approved physics configuration and simulation source remain byte-for-byte unchanged',()=>{
 const baseline=JSON.parse(readFileSync(new URL('../docs/approved-physics-baseline.json',import.meta.url),'utf8'));
 for(const [name,expected] of [['config',baseline.config_sha256],['world',baseline.world_sha256]])assert.equal(createHash('sha256').update(readFileSync(new URL(`../src/simulation/${name}.ts`,import.meta.url))).digest('hex'),expected);
});
test('authoritative state round trip retains charge/action state and active frog grapple',()=>{const s=new Simulation();s.frogs[0].body.setTransform(Vec2(12,9),0);s.frogs[1].body.setTransform(Vec2(16,9),0);s.setInput(0,{x:1,y:0,held:true});for(let i=0;i<8;i++)s.step();const state=capture(s);const other=new Simulation();restore(other,state);assert.deepEqual(capture(other),state);other.step();assert.equal(other.frogs[0].tongue?.target,other.frogs[1].body);});
