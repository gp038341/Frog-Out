import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {m11PreservedSource} from './preserved-source';
import {poisonRole} from '../src/presentation/poison-identity';
import {OutbreakRules} from '../src/game/outbreak';
test('poison presentation follows authoritative grace without changing rules or granting early tagging',()=>{
 const rules=new OutbreakRules([0,1,2],0,{announcementTicks:1,countdownTicks:1,graceTicks:60});rules.advanceClock(2);
 assert.deepEqual(poisonRole(rules.view(2).players[0].state),{spotted:true,transforming:false,tagging:true});
 assert.deepEqual(poisonRole(rules.view(2).players[1].state),{spotted:false,transforming:false,tagging:false});
 rules.infect(3,[[0,1]]);assert.deepEqual(poisonRole(rules.view(3).players[1].state),{spotted:true,transforming:true,tagging:false});
 rules.infect(62,[[1,2]]);assert.equal(rules.view(62).players[2].state,'healthy');
 rules.infect(63,[[1,2]]);assert.deepEqual(poisonRole(rules.view(63).players[1].state),{spotted:true,transforming:false,tagging:true});
});
test('M11 preserves all gameplay, input, sound and static-camera sources outside exact visual/language edits',()=>{
 const m=JSON.parse(readFileSync(new URL('../docs/milestone-11-preservation.json',import.meta.url),'utf8'));
 for(const [p,h]of Object.entries(m.protected))assert.equal(createHash('sha256').update(readFileSync(new URL(`../${p}`,import.meta.url))).digest('hex'),h,p);
 for(const [p,r]of Object.entries(m.files)as[string,{sha256:string}][])assert.equal(createHash('sha256').update(m11PreservedSource(p)).digest('hex'),r.sha256,p);
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8').replace(/<[^>]+>/g,' ');
 assert.ok(!/patient zero|outbreak|infect|healthy/i.test(html));
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');assert.ok(!main.includes('setZoom(')&&!main.includes('ArenaCamera'));
});
