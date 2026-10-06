import {Client,type Room} from 'colyseus.js';
import {DelayLink} from './link';
import {Predictor} from './predictor';
import {NETWORK,type Snapshot,type Command} from './protocol';
import type {Input} from '../simulation/world';
export class Connection {
 room?:Room; slot=-1;status='connecting';snapshots:Snapshot[]=[];
 predictor=new Predictor();rtt=0;offset=0;lastReceive=0;seq=0;lastReset=-1;
 link:DelayLink;prediction:boolean;input:Input={x:0,y:0,held:false};bytesIn=0;bytesOut=0;started=Date.now();
 private interval?:ReturnType<typeof setInterval>;private ping?:ReturnType<typeof setInterval>;
 constructor(){const params=new URLSearchParams(location.search);this.link=new DelayLink(Math.max(0,Math.min(500,Number(params.get('lag')??0))),Math.max(0,Math.min(100,Number(params.get('jitter')??0))));this.prediction=params.get('prediction')!=='0';}
 async connect(){
  const url=new URL(location.href);const endpoint=url.port==='5173'?'ws://127.0.0.1:2567':`${url.protocol==='https:'?'wss':'ws'}://${url.host}`;
  const client=new Client(endpoint);const roomId=new URLSearchParams(location.search).get('room');
  try{
   const room=roomId?await client.joinById(roomId):await client.joinOrCreate('physics_spike');this.room=room;
   room.onMessage('welcome',data=>{this.slot=data.slot;this.predictor.slot=data.slot;this.status='connected';});
   room.onMessage('pong',data=>this.link.schedule('receive',()=>{const now=Date.now();const sample=now-data.at;this.rtt=this.rtt?this.rtt*.8+sample*.2:sample;const measured=data.serverTime-(data.at+now)/2;this.offset=this.offset?this.offset*.8+measured*.2:measured;}));
   room.onMessage('snapshot',(s:Snapshot)=>this.link.schedule('receive',()=>{
    if(s.state.tick<=(this.snapshots.at(-1)?.state.tick??-1))return;
    this.bytesIn+=JSON.stringify(s).length;this.lastReceive=Date.now();
    if(!this.snapshots.length)this.offset=s.serverTime-Date.now()+this.link.rtt/2;
    if(this.lastReset!==s.resetId){this.predictor.initialized=false;this.lastReset=s.resetId;}
    this.snapshots.push(s);if(this.snapshots.length>90)this.snapshots.shift();
    if(this.prediction)this.predictor.reconcile(s,Date.now()+this.offset,this.offset);
   }));
   room.onLeave(()=>{this.status='disconnected — refresh to join again';this.input={x:0,y:0,held:false};this.link.clear();clearInterval(this.interval);clearInterval(this.ping);this.predictor.pending=[];});
   room.onError((_code,message)=>this.status=`connection error: ${message}`);
   room.send('hello');this.sendPing();this.ping=setInterval(()=>this.sendPing(),1000);
   this.interval=setInterval(()=>this.sendInput(),1000/NETWORK.inputHz);
  }catch(e){this.status=`connection failed: ${String(e)}`;}
 }
 sendPing(){const at=Date.now();this.link.schedule('send',()=>this.room?.send('ping',at));}
 setInput(input:Input){if(input.x===this.input.x&&input.y===this.input.y&&input.held===this.input.held)return;this.input={...input};this.sendInput();}
 sendInput(){if(this.slot<0||this.status!=='connected')return;const command:Command={seq:++this.seq,at:Date.now(),input:{...this.input}};
  if(this.prediction)this.predictor.add(command);
  this.bytesOut+=JSON.stringify(command).length;
  this.link.schedule('send',()=>this.room?.send('input',command));
 }
 get stale(){return !this.lastReceive||Date.now()-this.lastReceive>250;}
}
