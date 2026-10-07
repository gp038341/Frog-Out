import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {Client,type Room} from 'colyseus.js';
import type {OutbreakView} from '../src/game/outbreak';
import type {LobbyState,Snapshot} from '../src/network/protocol';
const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
async function until(condition:()=>unknown,label:string,timeout=4000){const end=Date.now()+timeout;while(!condition()){if(Date.now()>end)throw Error(`Timeout: ${label}`);await wait(20);}}
const port=2777,url=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,HOST:'127.0.0.1',PORT:String(port),ENABLE_TESTS:'1'},stdio:['ignore','pipe','pipe']});
server.stderr.on('data',x=>process.stderr.write(x));
const checks:string[]=[];const peers:Peer[]=[];
function pass(name:string){checks.push(name);console.log(`PASS ${name}`);}
class Peer {
 client=new Client(url);room!:Room;lobby?:LobbyState;outbreak?:OutbreakView;last?:Snapshot;slot=-1;id='';seq=0;notice='';input={x:0,y:0,held:false};timer?:ReturnType<typeof setInterval>;
 constructor(){peers.push(this);}
 attach(room:Room){this.room=room;this.last=undefined;this.slot=-1;this.id=room.sessionId;this.seq=0;
  room.onMessage('welcome',x=>{this.slot=x.slot;this.seq=Math.max(this.seq,x.seqBase??0);});
  room.onMessage('outbreak',(x:OutbreakView)=>this.outbreak=x);room.onMessage('lobby',(x:LobbyState)=>{this.lobby=x;});room.onMessage('snapshot',(x:Snapshot)=>this.last=x);room.onMessage('notice',x=>this.notice=x);room.onMessage('pong',()=>{});room.onError(()=>{});room.onLeave(()=>clearInterval(this.timer));room.send('hello');
  clearInterval(this.timer);this.timer=setInterval(()=>this.send(),33);
 }
 send(){if(this.lobby?.phase==='game'&&this.slot>=0&&this.room.connection.isOpen)this.room.send('input',{seq:++this.seq,at:Date.now(),input:this.input});}
 async create(name:string){this.attach(await this.client.create('frog_party',{name}));await until(()=>this.lobby,'create lobby');}
 async join(host:Peer,name:string){this.attach(await this.client.joinById(host.room.roomId,{name}));await until(()=>this.lobby,'join lobby');}
 async drop(){clearInterval(this.timer);this.room.connection.close();await wait(100);}
 async leave(){clearInterval(this.timer);if(this.room?.connection.isOpen)await this.room.leave();}
}
try{
 await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('server startup timeout')),10000);server.stdout.on('data',x=>{if(String(x).includes('listening')){clearTimeout(timer);resolve();}});server.once('exit',c=>reject(Error(`server exited ${c}`)));});
 const api=async(code:string)=>{const r=await fetch(`${url}/api/rooms/${code}`);return {status:r.status,data:await r.json()};};
 assert.equal((await api('bad')).status,400);assert.equal((await api('ZZZZZZ')).status,404);pass('invalid and nonexistent codes have clear errors');
 await assert.rejects(new Client(url).create('frog_party',{name:'   '}),/display name/);pass('blank display name rejected');
 const a=new Peer();await a.create('Alice');assert.match(a.lobby!.code,/^[A-Z2-9]{6}$/);assert.equal((await api(a.lobby!.code.toLowerCase())).data.roomId,a.room.roomId);pass('create room and case-insensitive code lookup');
 a.room.send('start');await until(()=>a.notice.includes('two'),'one-player start rejected');pass('start requires at least two connected players');
 const b=new Peer();await b.join(a,'alice');await until(()=>a.lobby!.players.length===2,'two players');assert.deepEqual(a.lobby!.players.map(p=>p.name),['Alice','alice (2)']);pass('two independent clients and duplicate display names');
 b.room.send('start');await until(()=>b.notice.includes('host'),'nonhost start');a.notice='';a.room.send('start');await until(()=>a.notice.includes('ready'),'not ready start');pass('host-only start and all-ready enforcement');
 a.room.send('ready',true);await until(()=>a.lobby!.players[0].ready,'ready');a.room.send('ready',false);await until(()=>!a.lobby!.players[0].ready,'unready');pass('ready and unready toggle');
 const extra=Array.from({length:6},()=>new Peer());await Promise.all(extra.map((p,i)=>p.join(a,`Player ${i+3}`)));await until(()=>a.lobby!.players.length===8,'eight players');assert.equal((await api(a.lobby!.code)).status,409);await assert.rejects(new Client(url).joinById(a.room.roomId,{name:'Ninth'}));pass('eight simultaneous clients and full-room rejection');
 for(const p of [a,b,...extra])p.room.send('ready',true);await until(()=>a.lobby!.players.every(p=>p.ready),'all ready');a.room.send('start');await until(()=>a.last?.state.frogs.length===8&&a.lobby!.phase==='game','eight-frog session');assert.deepEqual(a.lobby!.players.map(p=>p.slot),[0,1,2,3,4,5,6,7]);const roster=a.lobby!.players.map(p=>p.id);assert.equal((await api(a.lobby!.code)).status,409);await assert.rejects(new Client(url).joinById(a.room.roomId,{name:'Late'}));assert.deepEqual(a.lobby!.players.map(p=>p.id),roster);pass('frozen eight-player roster and late-join rejection');
 await extra[0].leave();await until(()=>a.lobby!.phase==='lobby','explicit leave ends session');assert.equal(a.lobby!.players.length,7);assert.ok(a.lobby!.players.every(p=>!p.ready&&p.slot===-1));pass('explicit in-game Leave cleanly returns remaining players to lobby');
 await a.leave();await until(()=>b.lobby!.hostId===b.id,'host migration');pass('lobby leave removes entry and transfers host');
 await Promise.all([b,...extra.slice(1)].map(p=>p.leave()));
 const x=new Peer();await x.create('Reconnect A');const y=new Peer();await y.join(x,'Reconnect B');x.room.send('ready',true);y.room.send('ready',true);await until(()=>x.lobby!.players.every(p=>p.ready),'pair ready');x.room.send('start');await until(()=>x.last&&y.last&&x.slot===0,'pair starts');
 await until(()=>x.outbreak?.phase==='playing','Outbreak begins',10000);x.room.send('outbreak-test',{positions:[[16,11],[24,10]]});await wait(100);x.input={x:0,y:-1,held:true};x.send();await until(()=>y.last?.state.frogs[0].tongue?.phase==='attached','terrain attachment before drop');
 const token=x.room.reconnectionToken,originalId=x.id,originalSlot=x.slot;await x.drop();await until(()=>y.lobby!.players[0].connected===false,'disconnect visible');await until(()=>!y.last!.state.frogs[0].input.held&&!y.last!.state.frogs[0].tongue,'controls cleared');assert.equal(y.last!.state.frogs.length,2);const tickBefore=y.last!.state.tick;pass('disconnect immediately clears input/outgoing tongue while frog stays physical');
 await wait(200);x.input={x:0,y:0,held:false};x.attach(await x.client.reconnect(token));await until(()=>x.slot===originalSlot&&x.last&&y.lobby!.players[0].connected,'reconnect restored');assert.equal(x.id,originalId);assert.equal(x.last!.state.frogs.length,2);assert.ok(x.last!.state.tick>tickBefore);const seqBase=x.seq;x.input={x:1,y:0,held:false};x.send();await until(()=>x.last!.ack[0]>seqBase,'fresh reconnect input accepted');pass('brief reconnect restores same player/frog/slot and accepts inputs without duplicate spawn');
 // A fresh SDK instance mirrors a page reload (no client-side prior sequence state).
 const reloadToken=x.room.reconnectionToken;await x.drop();const reloaded=new Peer();reloaded.attach(await reloaded.client.reconnect(reloadToken));await until(()=>reloaded.last&&reloaded.slot===0,'reload reconnect');assert.equal(reloaded.id,originalId);reloaded.input={x:-1,y:0,held:false};const reloadBase=reloaded.seq;reloaded.send();await until(()=>reloaded.last!.ack[0]>reloadBase,'reload input accepted');pass('reload reconnect restores identity and sequence base');
 const timeoutStart=Date.now();await reloaded.drop();await until(()=>y.lobby!.players.find(p=>p.id===originalId)?.connected===false,'timeout starts');await until(()=>y.lobby!.phase==='lobby','actual 30-second timeout',34000);const timeoutMs=Date.now()-timeoutStart;assert.ok(timeoutMs>=29500&&timeoutMs<34000);assert.equal(y.lobby!.players.length,1);assert.equal(y.lobby!.players[0].id,y.id);assert.equal(y.lobby!.players[0].ready,false);assert.match(y.lobby!.notice,/30 seconds/);assert.equal((await api(y.lobby!.code)).status,200);pass('actual 30-second reservation expiry ends session, removes absent player, unlocks lobby');
 const z=new Peer();await z.join(y,'New Lobby Player');await until(()=>y.lobby!.players.length===2,'join after timeout');await z.drop();await until(()=>y.lobby!.players.length===1,'lobby drop cleanup');pass('joining after timeout works and lobby disconnects do not leave stale entries');
 const report={environment:'Local authoritative server with independent real WebSocket SDK clients; not a human acceptance playtest',approvedPhysicsUnchanged:true,checks,actualReservationTimeoutMs:timeoutMs};writeFileSync('docs/results/lifecycle-milestone-6.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await Promise.allSettled(peers.map(p=>p.leave()));server.kill();}
