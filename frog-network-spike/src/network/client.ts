import {isFinalRoundResult} from '../presentation/final-results';
import {applyChaos} from '../chaos/registry';
import type {ChaosView} from '../chaos/voting';
import type {GameMode} from '../game/modes';
import {loadAppearance,type Appearance} from '../presentation/cosmetics';
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
 readonly inputTrace={attemptAt:0,sentAt:0,sentSeq:0,ackAt:0,ack:0,snapshotAt:0,tickAt:0,tick:0,skip:'',transportOpen:false};
 chaos?:ChaosView;outbreak?:OutbreakView;room?:Room;slot=-1;playerId='';lobby?:LobbyState;status='Choose Create Room or Join Room.';notice='';snapshots:Snapshot[]=[];
 predictor=new Predictor();rtt=0;offset=0;lastReceive=0;seq=0;lastReset=-1;
 link:DelayLink;prediction:boolean;input:Input={x:0,y:0,held:false};bytesIn=0;bytesOut=0;started=Date.now();
 client:Client;http:string;busy=false;reconnecting=false;private generation=0;private reconnectAttempt=0;private hostNoticeUntil=0;
 private interval?:ReturnType<typeof setInterval>;private ping?:ReturnType<typeof setInterval>;
 constructor(){const url=new URL(location.href);this.http=url.origin;this.client=new Client((url.port==='5173'?'http://127.0.0.1:2567':url.origin).replace(/^http/,'ws'));const params=url.searchParams;this.link=new DelayLink(Math.max(0,Math.min(500,Number(params.get('lag')??0))),Math.max(0,Math.min(100,Number(params.get('jitter')??0))));this.prediction=params.get('prediction')!=='0';}
 async boot(){try{const saved=JSON.parse(sessionStorage.getItem(cacheKey)??'null');if((saved?.phase==='game'||saved?.phase==='lobby')&&typeof saved.token==='string')await this.resume(saved.token,typeof saved.resumeUntil==='number'?saved.resumeUntil:undefined);else sessionStorage.removeItem(cacheKey);}catch{sessionStorage.removeItem(cacheKey);this.status='Your previous session ended. Create or join a room.';}}
 async create(name:string){if(this.busy||this.room)return;this.cancelResume();this.busy=true;this.status='Creating room…';try{this.attach(await this.client.create('frog_party',{name,appearance:loadAppearance()}));}catch(e){this.status=this.error(e);}finally{this.busy=false;}}
 async join(name:string,code:string){if(this.busy||this.room)return;this.cancelResume();this.busy=true;this.status='Joining room…';try{const normalized=code.trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(normalized))throw Error('Enter a six-character room code.');const response=await fetch(`${this.http}/api/rooms/${encodeURIComponent(normalized)}`);const data=await response.json();if(!response.ok)throw Error(data.error);this.attach(await this.client.joinById(data.roomId,{name,appearance:loadAppearance()}));}catch(e){this.status=this.error(e);}finally{this.busy=false;}}
 error(e:unknown){const message=e instanceof Error?e.message:String(e);return /locked|full|maxClients/i.test(message)?'This room is full or has already started.':message;}
 private save(){if(this.room&&this.lobby)sessionStorage.setItem(cacheKey,JSON.stringify({token:this.room.reconnectionToken,phase:this.lobby.phase,code:this.lobby.code}));}
 private stop(){clearInterval(this.interval);clearInterval(this.ping);this.link.clear();this.input={x:0,y:0,held:false};this.predictor.pending=[];this.predictor.initialized=false;}
 private attach(room:Room){const generation=++this.generation;const current=()=>generation===this.generation&&this.room===room;const listen=(type:string,handler:(data:any)=>void)=>room.onMessage(type,data=>{if(current())handler(data);});let kicked=false;this.room=room;this.chaos=undefined;this.outbreak=undefined;this.status='connected';this.snapshots=[];this.slot=-1;this.seq=0;this.lastReset=-1;this.lastReceive=0;this.predictor.initialized=false;this.predictor.pending=[];this.notice='';this.hostNoticeUntil=0;
  listen('welcome',data=>{this.slot=data.slot;this.playerId=data.playerId;this.predictor.slot=data.slot;this.seq=Math.max(this.seq,data.seqBase??0);this.status='connected';});
  listen('lobby',(state:LobbyState)=>{if(this.lobby?.players.find(p=>p.id===this.playerId)?.ready&&!state.players.find(p=>p.id===this.playerId)?.ready)this.lifecycle('ready-reset');if(state.phase!==this.lobby?.phase){if(this.lobby?.phase==='lobby'&&state.phase==='game')this.seq=0;this.snapshots=[];this.predictor.initialized=false;this.predictor.pending=[];this.input={x:0,y:0,held:false};this.lastReceive=0;}this.lobby=state;this.status='connected';this.notice=state.notice;this.save();});
  listen('outbreak',(state:OutbreakView|null)=>this.link.schedule('receive',()=>{if(!current())return;if(state?.phase!==this.outbreak?.phase||state?.round!==this.outbreak?.round){this.snapshots=[];this.predictor.initialized=false;this.predictor.pending=[];this.input={x:0,y:0,held:false};}this.outbreak=state??undefined;}));
  listen('chaos',(state:ChaosView|null)=>this.link.schedule('receive',()=>{if(!current())return;this.chaos=state??undefined;}));
  listen('kicked',(message:string)=>{kicked=true;this.endSession(message);this.notice=message;});
  listen('notice',(message:string)=>this.notice=message);
  listen('host-changed',()=>{this.hostNoticeUntil=Date.now()+8000;});
  listen('pong',data=>this.link.schedule('receive',()=>{if(!current())return;const now=Date.now();const sample=now-data.at;this.rtt=this.rtt?this.rtt*.8+sample*.2:sample;const measured=data.serverTime-(data.at+now)/2;this.offset=this.offset?this.offset*.8+measured*.2:measured;}));
  listen('snapshot',(s:Snapshot)=>this.link.schedule('receive',()=>{if(!current())return;
   if(this.lobby?.phase!=='game'||s.state.tick<=(this.snapshots.at(-1)?.state.tick??-1))return;
   setSimulationArena(this.predictor.sim,s.arenaId??DEFAULT_ARENA);applyChaos(this.predictor.sim,s.chaos?.active??[]);this.bytesIn+=JSON.stringify(s).length;this.lastReceive=Date.now();this.inputTrace.snapshotAt=this.lastReceive;const ack=s.ack[this.slot]??0;if(ack!==this.inputTrace.ack){this.inputTrace.ack=ack;this.inputTrace.ackAt=this.lastReceive;}if(s.state.tick!==this.inputTrace.tick){this.inputTrace.tick=s.state.tick;this.inputTrace.tickAt=this.lastReceive;}if(!this.snapshots.length)this.offset=s.serverTime-Date.now()+this.link.rtt/2;
   if(this.lastReset!==s.resetId){this.predictor.initialized=false;this.lastReset=s.resetId;}
   this.snapshots.push(s);if(this.snapshots.length>90)this.snapshots.shift();if(this.prediction&&this.playing)this.predictor.reconcile(s,Date.now()+this.offset,this.offset);
  }));
  room.onLeave(code=>{if(!current())return;const token=room.reconnectionToken;this.lifecycle('closed',code);++this.generation;this.stop();this.room=undefined;this.hostNoticeUntil=0;this.status='Disconnected.';if(code!==4000&&code!==4003&&!kicked){const resumeUntil=Date.now()+30000;sessionStorage.setItem(cacheKey,JSON.stringify({token,phase:this.lobby?.phase,resumeUntil}));void this.resume(token,resumeUntil);}else this.endSession(code===4003||kicked?'The host removed you from the lobby.':'This room connection ended. Create or join another room.');});
  room.onError((code,message)=>{if(!current())return;this.lifecycle('error',code);this.notice=`Connection error: ${message}`;});
  room.send('hello');this.sendPing();this.ping=setInterval(()=>this.sendPing(),1000);this.interval=setInterval(()=>this.sendInput(),1000/NETWORK.inputHz);this.save();this.lifecycle('attached');
 }
 private cancelResume(){if(!this.reconnecting)return;++this.reconnectAttempt;this.reconnecting=false;this.busy=false;this.stop();sessionStorage.removeItem(cacheKey);}
 /** Only the active room may change UI/session state. A closed room must not resurrect a frozen game. */
 private endSession(message:string){++this.generation;++this.reconnectAttempt;this.stop();this.reconnecting=false;this.busy=false;this.hostNoticeUntil=0;this.room=undefined;this.lobby=undefined;this.outbreak=undefined;this.chaos=undefined;this.snapshots=[];this.slot=-1;this.playerId='';this.lastReceive=0;sessionStorage.removeItem(cacheKey);this.notice='';this.status=message;this.lifecycle('ended');}
 private expiredResume(){this.endSession('Your previous session ended. Create or join a room.');}
 readonly lifecycleTrace:{at:number;event:string;code?:number;phase?:string;open:boolean}[]=[];
 private lifecycle(event:string,code?:number){this.lifecycleTrace.push({at:Date.now(),event,code,phase:this.lobby?.phase,open:!!this.room?.connection.isOpen});if(this.lifecycleTrace.length>32)this.lifecycleTrace.shift();}
 get connected(){return !!this.room?.connection.isOpen&&!this.reconnecting;}
 get canReady(){return this.connected&&this.lobby?.phase==='lobby'&&this.lobby.players.some(p=>p.id===this.playerId&&p.connected&&p.kind!=='cpu');}

 async resume(token:string,resumeUntil=Date.now()+30000){if(this.reconnecting)return;if(resumeUntil<=Date.now()){this.expiredResume();return;}this.reconnecting=true;this.busy=!!this.lobby;const attempt=++this.reconnectAttempt;this.stop();try{while(Date.now()<resumeUntil){if(attempt!==this.reconnectAttempt)return;this.status=`Reconnecting… ${Math.max(0,Math.ceil((resumeUntil-Date.now())/1000))}s remaining`;try{const room=await this.client.reconnect(token);if(attempt!==this.reconnectAttempt){await room.leave();return;}this.attach(room);return;}catch(e){if(attempt!==this.reconnectAttempt)return;const error=e as {code?:number;message?:string};if(error.code===4212||error.code===4214||/reconnection token.*(?:invalid|expired)|seat reservation expired|already consumed|room .*?(?:disposed|not found)/i.test(error.message??''))break;await new Promise(r=>setTimeout(r,1000));}}if(attempt===this.reconnectAttempt)this.expiredResume();}finally{if(attempt===this.reconnectAttempt){this.reconnecting=false;this.busy=false;}}}

 setAppearance(appearance:Appearance){if(this.status==='connected'&&this.lobby?.phase==='lobby')this.room?.send('appearance',appearance);}
 addCPU(seat:number){this.room?.send('add-cpu',seat);}
 removeCPU(id:string){this.room?.send('remove-cpu',id);}
 cpuAppearance(id:string,appearance:Appearance){this.room?.send('cpu-appearance',{id,appearance});}
 kick(id:string){if(this.status==='connected'&&this.lobby?.phase==='lobby'&&this.lobby.hostId===this.playerId)this.room?.send('kick',id);}
 selectMode(mode:GameMode){if(this.status==='connected')this.room?.send('select-mode',mode);}
 selectArena(id:ArenaId){if(this.status==='connected')this.room?.send('select-arena',id);}
 ready(value:boolean){if(this.canReady)this.room?.send('ready',value);}
 start(){if(this.status==='connected')this.room?.send('start');}
 nextRound(){if(this.status==='connected')this.room?.send('next-round');}
 returnLobby(){if(this.status!=='connected')return;const state=this.outbreak;if(isFinalRoundResult(state))this.room?.send('next-round');this.room?.send('return-lobby');}
 get playing(){return this.connected&&this.lobby?.phase==='game'&&this.outbreak?.phase==='playing'&&(!this.chaos||this.chaos.phase==='idle');}
 get hostNotice(){return Date.now()<this.hostNoticeUntil?'You are now the host.':'';}
 async leave(){const room=this.room;this.endSession('You left the room.');if(room)await room.leave();}
 sendPing(){const at=Date.now();this.link.schedule('send',()=>this.room?.send('ping',at));}
 setInput(input:Input,immediate=true){if(input.x===this.input.x&&input.y===this.input.y&&input.held===this.input.held&&input.aimX===this.input.aimX&&input.aimY===this.input.aimY)return;this.input={...input};if(immediate)this.sendInput();}
 sendInput(){this.inputTrace.attemptAt=Date.now();this.inputTrace.transportOpen=!!this.room?.connection.isOpen;if(this.slot<0||this.status!=='connected'||!this.playing){this.inputTrace.skip=this.slot<0?'no-slot':this.status!=='connected'?'disconnected':'round-not-playing';return;}this.inputTrace.skip='';const command:Command={seq:++this.seq,at:Date.now(),input:{...this.input}};if(this.prediction)this.predictor.add(command);this.bytesOut+=JSON.stringify(command).length;this.link.schedule('send',()=>{if(this.room?.connection.isOpen){this.inputTrace.sentAt=Date.now();this.inputTrace.sentSeq=command.seq;this.room.send('input',command);}else this.inputTrace.skip='transport-closed';});}
 get stale(){return !this.lastReceive||Date.now()-this.lastReceive>250;}
}
