import {DEFAULT_ARENA,type ArenaId} from '../simulation/arenas';
import {setSimulationArena} from '../simulation/arena-adapter';
import {Client,type Room} from 'colyseus.js';
import {DelayLink} from './link';
import {Predictor} from './predictor';
import {NETWORK,type Snapshot,type Command,type LobbyState} from './protocol';
import type {OutbreakView} from '../game/outbreak';
import type {Input} from '../simulation/world';
const cacheKey='frog-out-session';
export class Connection {
 outbreak?:OutbreakView;room?:Room;slot=-1;playerId='';lobby?:LobbyState;status='Choose Create Room or Join Room.';notice='';snapshots:Snapshot[]=[];
 predictor=new Predictor();rtt=0;offset=0;lastReceive=0;seq=0;lastReset=-1;
 link:DelayLink;prediction:boolean;input:Input={x:0,y:0,held:false};bytesIn=0;bytesOut=0;started=Date.now();
 client:Client;http:string;busy=false;reconnecting=false;private generation=0;private reconnectAttempt=0;
 private interval?:ReturnType<typeof setInterval>;private ping?:ReturnType<typeof setInterval>;
 constructor(){const url=new URL(location.href);this.http=url.origin;this.client=new Client((url.port==='5173'?'http://127.0.0.1:2567':url.origin).replace(/^http/,'ws'));const params=url.searchParams;this.link=new DelayLink(Math.max(0,Math.min(500,Number(params.get('lag')??0))),Math.max(0,Math.min(100,Number(params.get('jitter')??0))));this.prediction=params.get('prediction')!=='0';}
 async boot(){try{const saved=JSON.parse(sessionStorage.getItem(cacheKey)??'null');if(saved?.phase==='game'&&typeof saved.token==='string')await this.resume(saved.token);else sessionStorage.removeItem(cacheKey);}catch{sessionStorage.removeItem(cacheKey);this.status='Your previous session ended. Create or join a room.';}}
 async create(name:string){if(this.busy||this.room)return;this.busy=true;this.status='Creating room…';try{this.attach(await this.client.create('frog_party',{name}));}catch(e){this.status=this.error(e);}finally{this.busy=false;}}
 async join(name:string,code:string){if(this.busy||this.room)return;this.busy=true;this.status='Joining room…';try{const normalized=code.trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(normalized))throw Error('Enter a six-character room code.');const response=await fetch(`${this.http}/api/rooms/${encodeURIComponent(normalized)}`);const data=await response.json();if(!response.ok)throw Error(data.error);this.attach(await this.client.joinById(data.roomId,{name}));}catch(e){this.status=this.error(e);}finally{this.busy=false;}}
 error(e:unknown){const message=e instanceof Error?e.message:String(e);return /locked|full|maxClients/i.test(message)?'This room is full or has already started.':message;}
 private save(){if(this.room&&this.lobby)sessionStorage.setItem(cacheKey,JSON.stringify({token:this.room.reconnectionToken,phase:this.lobby.phase,code:this.lobby.code}));}
 private stop(){clearInterval(this.interval);clearInterval(this.ping);this.link.clear();this.input={x:0,y:0,held:false};this.predictor.pending=[];this.predictor.initialized=false;}
 private attach(room:Room){const generation=++this.generation;this.room=room;this.outbreak=undefined;this.status='connected';this.snapshots=[];this.slot=-1;this.seq=0;this.lastReset=-1;this.lastReceive=0;this.predictor.initialized=false;this.predictor.pending=[];this.notice='';
  room.onMessage('welcome',data=>{this.slot=data.slot;this.playerId=data.playerId;this.predictor.slot=data.slot;this.seq=Math.max(this.seq,data.seqBase??0);this.status='connected';});
  room.onMessage('lobby',(state:LobbyState)=>{if(state.phase!==this.lobby?.phase){if(this.lobby?.phase==='lobby'&&state.phase==='game')this.seq=0;this.snapshots=[];this.predictor.initialized=false;this.predictor.pending=[];this.input={x:0,y:0,held:false};this.lastReceive=0;}this.lobby=state;this.notice=state.notice;this.save();});
  room.onMessage('outbreak',(state:OutbreakView|null)=>this.link.schedule('receive',()=>{if(state?.phase!==this.outbreak?.phase||state?.round!==this.outbreak?.round){this.snapshots=[];this.predictor.initialized=false;this.predictor.pending=[];this.input={x:0,y:0,held:false};}this.outbreak=state??undefined;}));
  room.onMessage('notice',(message:string)=>this.notice=message);
  room.onMessage('pong',data=>this.link.schedule('receive',()=>{const now=Date.now();const sample=now-data.at;this.rtt=this.rtt?this.rtt*.8+sample*.2:sample;const measured=data.serverTime-(data.at+now)/2;this.offset=this.offset?this.offset*.8+measured*.2:measured;}));
  room.onMessage('snapshot',(s:Snapshot)=>this.link.schedule('receive',()=>{
   if(this.lobby?.phase!=='game'||s.state.tick<=(this.snapshots.at(-1)?.state.tick??-1))return;
   setSimulationArena(this.predictor.sim,s.arenaId??DEFAULT_ARENA);this.bytesIn+=JSON.stringify(s).length;this.lastReceive=Date.now();if(!this.snapshots.length)this.offset=s.serverTime-Date.now()+this.link.rtt/2;
   if(this.lastReset!==s.resetId){this.predictor.initialized=false;this.lastReset=s.resetId;}
   this.snapshots.push(s);if(this.snapshots.length>90)this.snapshots.shift();if(this.prediction&&this.playing)this.predictor.reconcile(s,Date.now()+this.offset,this.offset);
  }));
  room.onLeave(code=>{if(generation!==this.generation)return;const playing=this.lobby?.phase==='game';const token=room.reconnectionToken;this.stop();this.room=undefined;this.status='Disconnected.';if(playing&&code!==4000){void this.resume(token);}else{this.lobby=undefined;this.slot=-1;sessionStorage.removeItem(cacheKey);this.status='You left the room. Create or join another room.';}});
  room.onError((_code,message)=>this.notice=`Connection error: ${message}`);
  room.send('hello');this.sendPing();this.ping=setInterval(()=>this.sendPing(),1000);this.interval=setInterval(()=>this.sendInput(),1000/NETWORK.inputHz);this.save();
 }
 async resume(token:string){if(this.reconnecting)return;this.reconnecting=true;this.busy=true;const attempt=++this.reconnectAttempt;this.stop();const deadline=Date.now()+30000;try{while(Date.now()<deadline){if(attempt!==this.reconnectAttempt)return;this.status=`Reconnecting… ${Math.max(0,Math.ceil((deadline-Date.now())/1000))}s remaining`;try{const room=await this.client.reconnect(token);if(attempt!==this.reconnectAttempt){await room.leave();return;}this.attach(room);return;}catch{await new Promise(r=>setTimeout(r,1000));}}if(attempt!==this.reconnectAttempt)return;this.lobby=undefined;this.room=undefined;this.slot=-1;sessionStorage.removeItem(cacheKey);this.status='Reconnection window expired or the session ended. Join the room lobby again.';}finally{if(attempt===this.reconnectAttempt){this.reconnecting=false;this.busy=false;}}}
 selectArena(id:ArenaId){if(this.status==='connected')this.room?.send('select-arena',id);}
 ready(value:boolean){if(this.status==='connected')this.room?.send('ready',value);}
 start(){if(this.status==='connected')this.room?.send('start');}
 nextRound(){if(this.status==='connected')this.room?.send('next-round');}
 returnLobby(){if(this.status==='connected')this.room?.send('return-lobby');}
 get playing(){return this.lobby?.phase==='game'&&this.outbreak?.phase==='playing';}
 async leave(){++this.generation;++this.reconnectAttempt;this.reconnecting=false;this.busy=false;this.stop();const room=this.room;this.room=undefined;this.lobby=undefined;this.slot=-1;sessionStorage.removeItem(cacheKey);if(room)await room.leave();this.status='You left the room.';}
 sendPing(){const at=Date.now();this.link.schedule('send',()=>this.room?.send('ping',at));}
 setInput(input:Input){if(input.x===this.input.x&&input.y===this.input.y&&input.held===this.input.held)return;this.input={...input};this.sendInput();}
 sendInput(){if(this.slot<0||this.status!=='connected'||!this.playing)return;const command:Command={seq:++this.seq,at:Date.now(),input:{...this.input}};if(this.prediction)this.predictor.add(command);this.bytesOut+=JSON.stringify(command).length;this.link.schedule('send',()=>this.room?.send('input',command));}
 get stale(){return !this.lastReceive||Date.now()-this.lastReceive>250;}
}
