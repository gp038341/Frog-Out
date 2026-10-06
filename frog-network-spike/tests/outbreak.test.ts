import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Vec2} from 'planck';
import {OutbreakRules,OUTBREAK} from '../src/game/outbreak';
import {Simulation} from '../src/simulation/world';
import {frogBodyContacts} from '../server/outbreak-room';
const start=(order=[0,1,2,3])=>{const rules=new OutbreakRules(order,0);rules.advanceClock(60);rules.advanceClock(240);return rules;};
test('approved Milestone 3 authority, physics, prediction, roster and lobby lifecycle sources are unchanged',()=>{
 const baseline=JSON.parse(readFileSync(new URL('../docs/approved-milestone-3.json',import.meta.url),'utf8'));
 for(const path of ['src/simulation/config.ts','src/simulation/world.ts','src/network/protocol.ts','src/network/predictor.ts','server/room.ts','server/party-room.ts','src/simulation/roster.ts'])assert.equal(createHash('sha256').update(readFileSync(new URL(`../${path}`,import.meta.url))).digest('hex'),baseline.sha256[path]);
});
test('announcement, countdown and timer start on authoritative ticks; no pre-start infection',()=>{
 const r=new OutbreakRules([1,0],100);assert.equal(r.phase,'announcement');r.infect(101,[[0,1]]);assert.equal(r.view(101).players[1].state,'healthy');r.advanceClock(159);assert.equal(r.phase,'announcement');r.advanceClock(160);assert.equal(r.phase,'countdown');r.advanceClock(339);assert.equal(r.phase,'countdown');r.advanceClock(340);assert.equal(r.phase,'playing');assert.equal(r.view(340).elapsedMs,0);assert.equal(r.view(340).players[1].state,'infectious');assert.equal(r.view(340).players[1].roundPoints,0);assert.equal(r.view(400).elapsedMs,1000);assert.deepEqual(OUTBREAK,{announcementTicks:60,countdownTicks:180,graceTicks:60});
});
test('real tongue attachment does not infect until the frog bodies touch',()=>{
 const s=new Simulation();s.frogs[0].body.setTransform(Vec2(12,9),0);s.frogs[1].body.setTransform(Vec2(16,9),0);s.setInput(0,{x:1,y:0,held:true});for(let i=0;i<8;i++)s.step();assert.equal(s.frogs[0].tongue?.target,s.frogs[1].body);const r=start([0,1]);r.infect(241,frogBodyContacts(s));assert.equal(r.view(241).players[1].state,'healthy');s.frogs[1].body.setTransform(Vec2(12.7,9),0);s.step();assert.ok(frogBodyContacts(s).length>0);r.infect(242,frogBodyContacts(s));assert.equal(r.view(242).players[1].state,'transforming');assert.equal(r.phase,'round-results');
});
test('infection is permanent; a 60-tick grace interval blocks instant chains and permits ongoing contact after grace',()=>{
 const r=start([0,1,2]);assert.deepEqual(r.infect(241,[[0,1],[1,2]]),[1]);assert.equal(r.view(241).players[1].state,'transforming');assert.equal(r.view(241).players[2].state,'healthy');assert.deepEqual(r.infect(300,[[1,2]]),[]);assert.deepEqual(r.infect(301,[[1,2]]),[2]);assert.equal(r.records[1].roundPoints,0);assert.equal(r.records[2].roundPoints,3);r.infect(302,[[0,1]]);assert.equal(r.totals[1],0);assert.equal(r.phase,'round-results');assert.deepEqual(r.roundWinners,[2]);assert.equal(r.view(999).elapsedMs,r.view(301).elapsedMs);
});
test('same-tick contact order cannot change score or placement, and newly infected frogs cannot infect in that batch',()=>{
 const a=start(),b=start();const contacts:[number,number][]=[[0,1],[1,3],[0,2],[2,1]];a.infect(241,contacts);b.infect(241,contacts.reverse());assert.deepEqual(a.records,b.records);assert.equal(a.records[1].roundPoints,0);assert.equal(a.records[2].roundPoints,0);assert.equal(a.records[1].infectionPlace,2);assert.equal(a.records[2].infectionPlace,2);assert.equal(a.records[3].infectedTick,null);a.infect(301,[[1,3],[2,3]]);assert.equal(a.records[3].roundPoints,3);assert.deepEqual(a.roundWinners,[3]);
});
test('same-tick last survivors share the round victory and earn equal survival score and equal last-survivor bonuses',()=>{
 const r=start([0,1,2]);r.infect(241,[[0,1],[0,2]]);assert.deepEqual(r.roundWinners,[1,2]);assert.equal(r.records[1].roundPoints,2);assert.equal(r.records[2].roundPoints,2);assert.equal(r.records[1].infectionPlace,2);assert.equal(r.records[2].infectionPlace,2);
});
for(const count of [2,3,4,8])test(`${count}-player match rotates Patient Zero exactly once, accumulates scoring and preserves final ties`,()=>{
 const order=Array.from({length:count},(_,i)=>count-1-i),r=new OutbreakRules(order,0);const seen:number[]=[];let tick=0;assert.equal(r.next(1),false);
 for(let round=0;round<count;round++){r.advanceClock(tick+60);r.advanceClock(tick+240);seen.push(r.patientZero);const contacts=order.filter(i=>i!==r.patientZero).map(i=>[r.patientZero,i] as [number,number]);r.infect(tick+241,contacts);assert.equal(r.phase,'round-results');assert.equal(r.view(tick+300).elapsedMs,1000/60);assert.equal(r.records[r.patientZero].roundPoints,0);assert.ok(r.next(tick+300));tick+=300;}
 assert.deepEqual(seen,order);assert.equal(new Set(seen).size,count);assert.equal(r.phase,'match-results');assert.deepEqual(r.totals,Array(count).fill((count-1)*2));assert.deepEqual(r.view(tick).matchWinners,Array.from({length:count},(_,i)=>i));assert.ok(r.view(tick).players.every(p=>p.finalPlace===1));assert.equal(r.next(tick+1),false);
});
test('survival plus last-survivor bonus; final standings use tied competition placements',()=>{
 const r=start();r.infect(241,[[0,1]]);r.infect(242,[[0,2]]);r.infect(243,[[0,3]]);assert.deepEqual(r.records.map(p=>p.roundPoints),[0,0,0,2]);assert.deepEqual(r.records.map(p=>p.infectionPlace),[1,2,3,4]);r.totals=[7,5,5,1];r.phase='match-results';assert.deepEqual(r.view(250).players.map(p=>p.finalPlace),[1,2,2,4]);assert.deepEqual(r.view(250).matchWinners,[0]);
});

test('approved out-of-bounds recovery preserves Outbreak timing and snapshot tick monotonicity',()=>{const s=new Simulation();s.tick=240;s.frogs[0].body.setTransform(Vec2(-10,20),0);s.step();assert.equal(s.tick,241);assert.equal(s.frogs[0].body.getPosition().x,12);const r=start([0,1]);r.infect(s.tick,frogBodyContacts(s));assert.equal(r.view(s.tick).elapsedMs,1000/60);assert.equal(r.records[1].roundPoints,null);});

test('survival is live then locked, only final batch gets modest bonus, same-tick scores equal',()=>{
 const r=start();assert.equal(r.view(540).players[1].survivalPoints,5);assert.equal(r.view(540).players[0].survivalPoints,0);
 r.infect(960,[[0,1]]);assert.equal(r.records[1].roundPoints,12);assert.equal(r.view(1500).players[1].survivalPoints,12);
 r.infect(1740,[[0,2],[0,3]]);assert.deepEqual(r.records.map(p=>p.roundPoints),[0,12,27,27]);
 assert.deepEqual(r.view(1800).players.map(p=>p.placementBonus),[0,0,2,2]);assert.equal(r.view(1800).players[2].survivalMs,25000);
});
test('two-player scores depend on survival duration; exact tenths accumulate without float drift',()=>{
 const r=start([0,1]);r.infect(738,[[0,1]]);assert.equal(r.records[1].roundPoints,10.3);r.next(800);r.advanceClock(860);r.advanceClock(1040);r.infect(1856,[[0,1]]);assert.equal(r.records[0].roundPoints,15.6);r.next(1900);assert.deepEqual(r.view(1900).matchWinners,[0]);
 const a=start([0,1]);assert.equal(a.view(245).players[1].survivalPoints,0);assert.equal(a.view(246).players[1].survivalPoints,.1);assert.equal(a.records[1].roundPoints,null);
});
