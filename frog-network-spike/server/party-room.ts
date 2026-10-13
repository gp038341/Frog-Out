import {Vec2} from 'planck';
import {reconnectPoint} from './reconnect-placement';
import {isGameMode,type GameMode} from '../src/game/modes';
import {normalizeAppearance,validAppearance} from '../src/presentation/cosmetics';
import {DEFAULT_ARENA,isArenaId,resolveArenaId,type ArenaId} from '../src/simulation/arenas';
import {setSimulationArena} from '../src/simulation/arena-adapter';
import {type Client,ServerError} from '@colyseus/core';
import {randomInt} from 'node:crypto';
import {SpikeRoom} from './room';
import {sizeSimulation} from '../src/simulation/roster';
import type {LobbyState,PlayerInfo} from '../src/network/protocol';
export const partyRooms=new Map<string,PartyRoom>();
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function makeCode(){let code:string;do{code=Array.from({length:6},()=>alphabet[randomInt(alphabet.length)]).join('');}while(partyRooms.has(code));return code;}
function displayName(raw:unknown){if(typeof raw!=='string')throw new ServerError(4200,'Enter a display name.');const name=raw.replace(/[\u0000-\u001f\u007f-\u009f]/g,'').replace(/\s+/g,' ').trim().slice(0,24);if(!name)throw new ServerError(4200,'Enter a display name.');return name;}
export class PartyRoom extends SpikeRoom {
 mode:GameMode='poison';
 arenaId:ArenaId=DEFAULT_ARENA;
 chaosEnabled=true;
 maxClients=8;code='';phase:'lobby'|'game'='lobby';hostId='';notice='';
 players=new Map<string,PlayerInfo>();matchRoster:string[]=[];rosterInfo:PlayerInfo[]=[];
 reservations=new Map<string,{reject:(reason?:unknown)=>void}>();
 reconnectSeconds=30;
 onCreate(){super.onCreate();this.code=makeCode();partyRooms.set(this.code,this);
  this.onMessage('hello',(client:Client)=>{this.welcome(client);this.lobby();});
  this.onMessage('select-arena',(client:Client,id:unknown)=>{if(client.sessionId!==this.hostId){client.send('notice','Only the host can choose the arena.');return;}if(this.phase!=='lobby'){client.send('notice','Choose an arena in the lobby before the match.');return;}if(!isArenaId(id)){client.send('notice','That arena is unavailable. Sunny Pond is selected instead.');id=resolveArenaId(id);}if(id===this.arenaId)return;this.arenaId=resolveArenaId(id);for(const p of this.players.values())p.ready=false;this.notice='Arena changed. Everyone must ready up again.';this.lobby();});
  this.onMessage('appearance',(client:Client,value:unknown)=>{const p=this.players.get(client.sessionId);if(this.phase!=='lobby'||!p)return;if(!validAppearance(value)){client.send('notice','That frog style is unavailable. Please choose a listed style.');return;}p.appearance=normalizeAppearance(value);this.lobby();});
  this.onMessage('select-mode',(client:Client,value:unknown)=>{if(client.sessionId!==this.hostId){client.send('notice','Only the host can choose the mode.');return;}if(this.phase!=='lobby'){client.send('notice','Choose a mode in the lobby before the match.');return;}if(!isGameMode(value)){client.send('notice','That game mode is unavailable.');return;}this.mode=value;this.notice='';this.lobby();});
  this.onMessage('kick',(client:Client,id:unknown)=>{if(this.phase!=='lobby'||client.sessionId!==this.hostId||typeof id!=='string'||id===client.sessionId){client.send('notice','Only the host can remove another player in the lobby.');return;}const target=this.players.get(id);if(!target)return;const peer=this.clients.find(c=>c.sessionId===id);this.reservations.get(id)?.reject();this.reservations.delete(id);this.removePlayer(id);this.announce(`${target.name} was removed from the lobby.`);peer?.send('kicked','The host removed you from the lobby.');void peer?.leave(4003);});
  this.onMessage('ready',(client:Client,ready:unknown)=>{const p=this.players.get(client.sessionId);if(this.phase!=='lobby'||!p||typeof ready!=='boolean')return;p.ready=ready;this.notice='';this.lobby();});
  this.onMessage('start',(client:Client)=>{if(client.sessionId!==this.hostId){client.send('notice','Only the host can start.');return;}const roster=[...this.players.values()].filter(p=>p.connected);if(this.phase!=='lobby')return;if(roster.length<2||roster.some(p=>!p.connected)){client.send('notice','At least two connected players are required.');return;}if(roster.some(p=>!p.ready)){client.send('notice','Every player must be ready.');return;}this.startSession(roster);});
  if(process.env.ENABLE_TESTS==='1')this.reconnectSeconds=Number(process.env.TEST_RECONNECT_SECONDS??30);
 }
 onAuth(_client:Client,options:{name?:unknown}){if(this.phase!=='lobby')throw new ServerError(4201,'This room is already playing. New players can join in the lobby only.');displayName(options?.name);return true;}
 onJoin(client:Client,options:{name?:unknown;appearance?:unknown}={}){if(this.phase!=='lobby')throw new ServerError(4201,'This room has already started. Join in the lobby only.');const base=displayName(options.name);let name=base,n=2;while([...this.players.values()].some(p=>p.name.toLocaleLowerCase()===name.toLocaleLowerCase()))name=`${base.slice(0,19)} (${n++})`;
  this.players.set(client.sessionId,{id:client.sessionId,name,connected:true,ready:false,slot:-1,appearance:normalizeAppearance(options.appearance)});if(!this.hostId)this.hostId=client.sessionId;this.notice='';this.welcome(client);this.lobby();
 }
 welcome(client:Client){const p=this.players.get(client.sessionId);if(p)client.send('welcome',{slot:p.slot,seqBase:p.slot>=0?this.received[p.slot]:0,playerId:p.id});}
 lobby(){const state:LobbyState={chaosEnabled:this.chaosEnabled,mode:this.mode,arenaId:this.arenaId,code:this.code,phase:this.phase,hostId:this.hostId,players:[...this.players.values()].filter(p=>this.phase==='game'||p.connected).map(p=>({...p})),...(this.phase==='game'?{roster:this.rosterInfo.map(p=>({...p,connected:this.players.get(p.id)?.connected??false}))}:{}),notice:this.notice,reconnectSeconds:30};this.broadcast('lobby',state);}
 startSession(roster:PlayerInfo[]){setSimulationArena(this.sim,this.arenaId);this.phase='game';this.matchRoster=roster.map(p=>p.id);this.rosterInfo=roster.map((p,i)=>({...p,slot:i}));this.slots.clear();sizeSimulation(this.sim,roster.length);for(const f of this.sim.frogs)f.body.setActive(true);this.sim.reset();this.ack=Array(roster.length).fill(0);this.received=Array(roster.length).fill(0);this.lastInput=Array(roster.length).fill(Date.now());this.queues=Array.from({length:roster.length},()=>[]);roster.forEach((p,i)=>{p.slot=i;this.slots.set(p.id,i);});this.resetId++;this.accumulator=0;this.lastClock=performance.now();void this.lock();this.notice='Placeholder session — Outbreak rules are not implemented.';this.lobby();for(const client of this.clients)this.welcome(client);this.publish();}
 announce(message:string){this.notice=message;this.lobby();this.clock.setTimeout(()=>{if(this.notice===message){this.notice='';this.lobby();}},6000);}
 unavailable(_p:PlayerInfo){}
 resumed(_p:PlayerInfo){}
 syncPresence(){if(this.phase!=='game')return;this.sim.frogs.forEach((f,i)=>{const p=this.players.get(this.matchRoster[i]);const active=!!p?.connected;if(f.body.isActive()!==active)f.body.setActive(active);});}
 async onLeave(client:Client,consented=false){const p=this.players.get(client.sessionId);if(!p)return;
  p.connected=false;p.ready=false;const i=p.slot;
  if(i>=0&&this.sim.frogs[i]){this.sim.setInput(i,{x:0,y:0,held:false});this.sim.cancelAction(this.sim.frogs[i]);for(const f of this.sim.frogs)if(f.tongue?.target===this.sim.frogs[i].body)this.sim.detach(f);this.sim.frogs[i].body.setLinearVelocity(Vec2(0,0));this.sim.frogs[i].body.setActive(false);this.queues[i]=[];this.slots.delete(p.id);}
  if(this.hostId===p.id)this.transferHost();
  if(!consented)p.reconnectUntil=Date.now()+this.reconnectSeconds*1000;
  if(this.phase==='game')this.unavailable(p);
  if(consented)this.removePlayer(p.id);
  const message=`${p.name} ${consented?'left the room.':'disconnected; their spot is reserved for 30 seconds.'}`;
  if(this.phase==='game'&&[...this.players.values()].filter(q=>q.connected).length<2)this.interrupt(`${message} Waiting in the lobby for another player.`);
  this.announce(message);
  if(consented)return;
  try{const reservation=this.allowReconnection(client,this.reconnectSeconds);this.reservations.set(p.id,{reject:()=>reservation.reject()});const peer=await reservation;this.reservations.delete(p.id);
   if(!this.players.has(p.id)||this.phase==='game'&&p.slot<0){peer.send('notice','That match ended and a new match has started. Join again in the lobby.');this.removePlayer(p.id);void peer.leave(4000);return;}
   if(this.phase==='game'){const point=reconnectPoint(this.sim,p.slot);if(!point){peer.send('notice','No safe reconnect location is available. Join again in the lobby.');this.removePlayer(p.id);void peer.leave(4000);return;}const f=this.sim.frogs[p.slot];this.sim.cancelAction(f);f.body.setTransform(Vec2(point.x,point.y),0);f.body.setLinearVelocity(Vec2(0,0));f.body.setActive(true);f.grounded=false;f.coyote=0;f.suppressSupport=.06;this.slots.set(p.id,p.slot);this.lastInput[p.slot]=Date.now();this.resetId++;}
   p.connected=true;delete p.reconnectUntil;if(!this.hostId)this.hostId=p.id;this.resumed(p);this.welcome(peer);this.announce(`${p.name} reconnected.`);this.publish();
  }catch{this.reservations.delete(p.id);if(this.players.has(p.id)&&!p.connected){this.removePlayer(p.id);this.announce(`${p.name}'s reconnect window expired. The room stays open.`);}}
 }
 transferHost(){this.hostId=[...this.players.values()].find(p=>p.connected)?.id??'';const peer=this.clients.find(c=>c.sessionId===this.hostId);peer?.send('host-changed','You are now the host.');}
 removePlayer(id:string){this.players.delete(id);this.slots.delete(id);if(this.hostId===id)this.transferHost();}
 interrupt(message:string){this.phase='lobby';this.notice=message;this.sim.clearInputs();this.slots.clear();this.matchRoster=[];this.queues=this.queues.map(()=>[]);for(const p of [...this.players.values()]){p.ready=false;p.slot=-1;if(p.connected)delete p.reconnectUntil;}this.rosterInfo=[];this.resetId++;void this.unlock();this.lobby();for(const c of this.clients)this.welcome(c);}
 advance(){if(this.phase==='game')super.advance();else{this.lastClock=performance.now();this.accumulator=0;}}
 publish(){if(this.phase==='game')super.publish();}
 onDispose(){partyRooms.delete(this.code);}
}
