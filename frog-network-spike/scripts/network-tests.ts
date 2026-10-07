import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {Client,type Room} from 'colyseus.js';
import {DelayLink} from '../src/network/link';
import {Predictor} from '../src/network/predictor';
import {NETWORK,type Snapshot,type Command} from '../src/network/protocol';
import type {Input} from '../src/simulation/world';
import {defaults} from '../src/simulation/config';
import {summary} from '../server/metrics';
const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const endpoint=process.env.TEST_URL??'ws://127.0.0.1:2667';
const server=process.env.TEST_URL?undefined:spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,HOST:'127.0.0.1',PORT:'2667',ENABLE_TESTS:'1'},stdio:['ignore','pipe','pipe']});
server?.stderr.on('data',x=>process.stderr.write(x));
class TestPeer {
 room!:Room;link:DelayLink;predictor=new Predictor();seq=0;input:Input={x:0,y:0,held:false};slot=-1;offset=0;rtts:number[]=[];
 acks:number[]=[];localLatency:number[]=[];pendingAck=new Map<number,number>();last?:Snapshot;lastReset=-1;states=0;lastReceive=0;interval?:ReturnType<typeof setInterval>;timer?:ReturnType<typeof setInterval>;
 mutualPullSnapshots=0;collisionSnapshots=0;chargedLaunchObserved=false;maxChargeObserved=0;minChargeVy=0;
 phase='warmup';corrections:Record<string,number[]>={};modes=new Set<string>();
 constructor(rtt:number,jitter:number){let seed=42;this.link=new DelayLink(rtt,jitter,()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;});}
 async connect(roomId?:string){const c=new Client(endpoint);this.room=roomId?await c.joinById(roomId):await c.joinOrCreate('physics_spike');
  this.room.onMessage('welcome',x=>{this.slot=x.slot;this.predictor.slot=x.slot;});
  this.room.onMessage('pong',x=>this.link.schedule('receive',()=>{const now=Date.now();this.rtts.push(now-x.at);this.offset=x.serverTime-(x.at+now)/2;}));
  this.room.onMessage('snapshot',(s:Snapshot)=>this.link.schedule('receive',()=>{
   if(s.state.tick<=(this.last?.state.tick??-1))return;this.last=s;this.states++;this.lastReceive=Date.now();
   if(this.slot<0)return;
   if(this.lastReset!==s.resetId){this.predictor.initialized=false;this.lastReset=s.resetId;}
   this.predictor.reconcile(s,Date.now()+this.offset,this.offset);
   if(this.phase!=='warmup')(this.corrections[this.phase]??=[]).push(this.predictor.lastCorrection);
   for(const [seq,at] of this.pendingAck){if(seq<=s.ack[this.slot]){this.acks.push(Date.now()-at);this.pendingAck.delete(seq);}}
   const [a,b]=s.state.frogs;
   if(a.tongue?.phase==='attached'&&b.tongue?.phase==='attached'&&a.tongue.target&&'frog'in a.tongue.target&&b.tongue.target&&'frog'in b.tongue.target)this.mutualPullSnapshots++;
   if(Math.hypot(a.x-b.x,a.y-b.y)<.93)this.collisionSnapshots++;
   if(this.phase==='charge'){
    this.maxChargeObserved=Math.max(this.maxChargeObserved,a.charge);this.minChargeVy=Math.min(this.minChargeVy,a.vy);
    // A 30 Hz snapshot can arrive several gravity steps after the 60 Hz launch.
    // Require full authoritative charge, then account for two snapshot periods.
    if(this.maxChargeObserved>=defaults.chargeSeconds-1e-6&&a.vy<-(defaults.chargedJumpImpulse-defaults.gravity*2/NETWORK.snapshotHz))this.chargedLaunchObserved=true;
   }
   for(const f of s.state.frogs)if(f.tongue)this.modes.add(f.tongue.phase==='attached'?(f.tongue.target&&'frog'in f.tongue.target?'frog-attachment':'terrain-attachment'):f.tongue.phase);
  }));
  this.room.send('hello');this.offset=-this.link.rtt/2;
  this.timer=setInterval(()=>{if(this.predictor.initialized)this.predictor.advance(Date.now()+this.offset);},4);
  this.interval=setInterval(()=>this.send(false),1000/30);
  this.ping();
 }
 ping(){const at=Date.now();this.link.schedule('send',()=>this.room.send('ping',at));}
 set(input:Input){this.input=input;this.send(true);}
 send(measure:boolean){if(this.slot<0)return;const c:Command={seq:++this.seq,at:Date.now(),input:{...this.input}};
  this.predictor.add(c);if(measure)this.pendingAck.set(c.seq,c.at);
  const tick=this.predictor.sim.tick;
  if(measure){const start=c.at;const timer=setInterval(()=>{if(this.predictor.sim.tick!==tick){this.localLatency.push(Date.now()-start);clearInterval(timer);}},1);setTimeout(()=>clearInterval(timer),250);}
  this.link.schedule('send',()=>this.room.send('input',c));
 }
 async stop(){clearInterval(this.interval);clearInterval(this.timer);this.link.clear();await this.room.leave();}
}
const results:any[]=[];
try {
 if(server){let ready='';await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('server startup timeout')),10000);server.stdout!.on('data',x=>{ready+=x;if(ready.includes('listening')){clearTimeout(timer);resolve();}});server.once('exit',code=>reject(Error(`server exited ${code}`)));});}
 for(const rtt of [50,100,150]){
  const a=new TestPeer(rtt,10),b=new TestPeer(rtt,10);await a.connect();await b.connect(a.room.roomId);await wait(600);a.ping();b.ping();await wait(400);
  const neutral:Input={x:0,y:0,held:false};
  const scenario=async(name:string)=>{a.set(neutral);b.set(neutral);await wait(rtt+80);a.room.send('scenario',name);await wait(rtt+100);a.phase=name;b.phase=name;};
  await scenario('charge');
  // The historical fixture starts above the M6 floor. Wait for actual support,
  // otherwise the action correctly fires an airborne tongue instead of charging.
  const groundedDeadline=Date.now()+3000;
  while(!a.last?.state.frogs.every(f=>f.grounded)){if(Date.now()>groundedDeadline)throw Error('charge fixture did not land');await wait(20);}
  a.set({x:1,y:0,held:true});await wait(1100);a.set({x:1,y:0,held:false});await wait(750);a.ping();
  await scenario('terrain');a.set({x:0,y:-1,held:true});await wait(600);a.set({x:1,y:0,held:true});await wait(600);a.set(neutral);await wait(300);
  await scenario('frogs');a.set({x:1,y:0,held:true});b.set({x:-1,y:0,held:true});await wait(800);a.set({x:-1,y:0,held:true});b.set({x:1,y:0,held:true});await wait(800);a.set(neutral);b.set(neutral);await wait(200);a.ping();
  await scenario('collision');a.set({x:1,y:0,held:false});b.set({x:-1,y:0,held:false});await wait(1000);
  await scenario('landing');a.set({x:0,y:0,held:true});await wait(25);a.set(neutral);await wait(500);
  const phases=Object.fromEntries(Object.entries(a.corrections).map(([name,v])=>[name,summary(v)]));
  const result={addedRtt:rtt,jitterPerLeg:10,measuredRtt:summary(a.rtts),authoritativeAcknowledgementMs:summary(a.acks),localPredictedStepMs:summary(a.localLatency),correctionsMetres:phases,largeSnaps:a.predictor.snaps,tickMs:a.last?.tickMs,overruns:a.last?.overruns,observedTongues:[...a.modes],snapshots:a.states,mutualPullSnapshots:a.mutualPullSnapshots,collisionSnapshots:a.collisionSnapshots,chargedLaunchObserved:a.chargedLaunchObserved,maxChargeObserved:a.maxChargeObserved,minChargeVy:a.minChargeVy};
  results.push(result);console.log(JSON.stringify(result));if(a.states<100)throw Error('insufficient snapshot traffic');if(!a.mutualPullSnapshots||!a.collisionSnapshots||!a.chargedLaunchObserved)throw Error('mutual pull, collision or charged jump not observed');if(!a.modes.has('frog-attachment')||!a.modes.has('terrain-attachment'))throw Error('grapple scenarios did not execute');await a.stop();await b.stop();
 }
 mkdirSync('docs/results',{recursive:true});writeFileSync('docs/results/latency.json',JSON.stringify({environment:'Local loopback WebSockets plus ordered application-layer delay, two independent Colyseus clients; not deployed WAN or human playtest',results},null,2));
}finally{server?.kill();}
