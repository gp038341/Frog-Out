import {spawn} from 'node:child_process';import {writeFileSync,mkdirSync} from 'node:fs';
import {Client,type Room} from 'colyseus.js';import type {Snapshot} from '../src/network/protocol';import {summary} from '../server/metrics';
const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const server=spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,HOST:'127.0.0.1',PORT:'2767'},stdio:['ignore','pipe','pipe']});server.stderr.on('data',x=>process.stderr.write(x));
const rooms:Room[]=[];const intervals:ReturnType<typeof setInterval>[]=[];const durations:number[]=[];let last:Snapshot|undefined;let messages=0,bytes=0,attached=0,lastTick=0,lastAt=0;let start=0;
try{
 let ready='';await new Promise<void>((resolve,reject)=>{const t=setTimeout(()=>reject(Error('server timeout')),10000);server.stdout!.on('data',x=>{ready+=x;if(ready.includes('listening')){clearTimeout(t);resolve();}});server.once('exit',x=>reject(Error(`server exit ${x}`)));});
 const c=new Client('ws://127.0.0.1:2767');for(let i=0;i<8;i++){const r=i?await c.joinById(rooms[0].roomId,{name:`Bot ${i+1}`}):await c.create('frog_party',{name:'Bot 1'});rooms.push(r);r.onMessage('lobby',()=>{});r.onMessage('notice',()=>{});r.onMessage('welcome',()=>{});r.onMessage('pong',()=>{});r.onMessage('snapshot',(s:Snapshot)=>{messages++;bytes+=JSON.stringify(s).length;if(i===0){last=s;attached+=s.state.frogs.filter(f=>f.tongue?.phase==='attached').length;if(lastAt){durations.push(Date.now()-lastAt);}lastAt=Date.now();lastTick=s.state.tick;}});r.send('hello');
  let seq=0,n=0;intervals.push(setInterval(()=>{n++;const phase=n%150;let held=phase<28||phase>=38&&phase<115;const x=i%2? -1:1;const y=phase>=38&&phase<115?-1:0;r.send('input',{seq:++seq,at:Date.now(),input:{x:n%240<120?x:-x,y,held}});},1000/30));
 }
 for(const r of rooms)r.send('ready',true);await wait(100);rooms[0].send('start');await wait(100);start=Date.now();await wait(Number(process.env.STRESS_SECONDS??60)*1000);const elapsed=Date.now()-start;
 if(!last||last.state.frogs.length!==8)throw Error('not an eight-body simulation');
 const result={environment:'One local production PartyRoom started through lobby/ready, eight-body Colyseus room, eight real loopback WebSocket clients, 30 input updates/client/sec, jumping/grappling/colliding bots; not a production-host capacity claim',seconds:elapsed/1000,clients:8,physicsBodies:last.state.frogs.length,tick:lastTick,effectivePhysicsHz:lastTick/(elapsed/1000),tickMs:last.tickMs,overruns:last.overruns,receivedSnapshotMessages:messages,snapshotGapMs:summary(durations),payloadBytesReceivedAllClients:bytes,attachedObservations:attached};
 mkdirSync('docs/results',{recursive:true});writeFileSync('docs/results/stress.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(last.overruns>0||last.tickMs.p99>8)throw Error('tick budget acceptance failed');
}finally{for(const i of intervals)clearInterval(i);for(const r of rooms)await r.leave();server.kill();}
