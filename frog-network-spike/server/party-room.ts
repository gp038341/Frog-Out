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
 arenaId:ArenaId=DEFAULT_ARENA;
 maxClients=8;code='';phase:'lobby'|'game'='lobby';hostId='';notice='';
 players=new Map<string,PlayerInfo>();matchRoster:string[]=[];
 reservations=new Map<string,{reject:(reason?:unknown)=>void}>();
 reconnectSeconds=30;
 onCreate(){super.onCreate();this.code=makeCode();partyRooms.set(this.code,this);
  this.onMessage('hello',(client:Client)=>{this.welcome(client);this.lobby();});
  this.onMessage('select-arena',(client:Client,id:unknown)=>{if(client.sessionId!==this.hostId){client.send('notice','Only the host can choose the arena.');return;}if(this.phase!=='lobby'){client.send('notice','Choose an arena in the lobby before the match.');return;}if(!isArenaId(id)){client.send('notice','That arena is unavailable. Sunny Pond is selected instead.');id=resolveArenaId(id);}if(id===this.arenaId)return;this.arenaId=resolveArenaId(id);for(const p of this.players.values())p.ready=false;this.notice='Arena changed. Everyone must ready up again.';this.lobby();});
  this.onMessage('ready',(client:Client,ready:unknown)=>{const p=this.players.get(client.sessionId);if(this.phase!=='lobby'||!p||typeof ready!=='boolean')return;p.ready=ready;this.notice='';this.lobby();});
  this.onMessage('start',(client:Client)=>{if(client.sessionId!==this.hostId){client.send('notice','Only the host can start.');return;}const roster=[...this.players.values()];if(this.phase!=='lobby')return;if(roster.length<2||roster.some(p=>!p.connected)){client.send('notice','At least two connected players are required.');return;}if(roster.some(p=>!p.ready)){client.send('notice','Every player must be ready.');return;}this.startSession(roster);});
  if(process.env.ENABLE_TESTS==='1')this.reconnectSeconds=Number(process.env.TEST_RECONNECT_SECONDS??30);
 }
 onAuth(_client:Client,options:{name?:unknown}){if(this.phase!=='lobby')throw new ServerError(4201,'This room is already playing. New players can join in the lobby only.');displayName(options?.name);return true;}
 onJoin(client:Client,options:{name?:unknown}={}){if(this.phase!=='lobby')throw new ServerError(4201,'This room has already started. Join in the lobby only.');const base=displayName(options.name);let name=base,n=2;while([...this.players.values()].some(p=>p.name.toLocaleLowerCase()===name.toLocaleLowerCase()))name=`${base.slice(0,19)} (${n++})`;
  this.players.set(client.sessionId,{id:client.sessionId,name,connected:true,ready:false,slot:-1});if(!this.hostId)this.hostId=client.sessionId;this.notice='';this.welcome(client);this.lobby();
 }
 welcome(client:Client){const p=this.players.get(client.sessionId);if(p)client.send('welcome',{slot:p.slot,seqBase:p.slot>=0?this.received[p.slot]:0,playerId:p.id});}
 lobby(){const state:LobbyState={arenaId:this.arenaId,code:this.code,phase:this.phase,hostId:this.hostId,players:[...this.players.values()].map(p=>({...p})),notice:this.notice,reconnectSeconds:30};this.broadcast('lobby',state);}
 startSession(roster:PlayerInfo[]){setSimulationArena(this.sim,this.arenaId);this.phase='game';this.matchRoster=roster.map(p=>p.id);this.slots.clear();sizeSimulation(this.sim,roster.length);this.sim.reset();this.ack=Array(roster.length).fill(0);this.received=Array(roster.length).fill(0);this.lastInput=Array(roster.length).fill(Date.now());this.queues=Array.from({length:roster.length},()=>[]);roster.forEach((p,i)=>{p.slot=i;this.slots.set(p.id,i);});this.resetId++;this.accumulator=0;this.lastClock=performance.now();void this.lock();this.notice='Placeholder session — Outbreak rules are not implemented.';this.lobby();for(const client of this.clients)this.welcome(client);this.publish();}
 async onLeave(client:Client,consented=false){const p=this.players.get(client.sessionId);if(!p)return;
  if(this.phase==='lobby'){this.removePlayer(p.id);this.lobby();return;}
  p.connected=false;p.ready=false;p.reconnectUntil=Date.now()+this.reconnectSeconds*1000;const i=p.slot;this.sim.setInput(i,{x:0,y:0,held:false});this.sim.cancelAction(this.sim.frogs[i]);this.queues[i]=[];this.slots.delete(p.id);this.lobby();
  // Explicit leave ends the session immediately; accidental drops retain identity for 30 seconds.
  if(consented){this.interrupt(`${p.name} left. Session ended; everyone returned to the lobby.`);return;}
  try{const reservation=this.allowReconnection(client,this.reconnectSeconds);this.reservations.set(p.id,{reject:()=>reservation.reject()});const resumed=await reservation;this.reservations.delete(p.id);if(this.phase!=='game'||!this.players.has(p.id)){resumed.leave();return;}p.connected=true;delete p.reconnectUntil;this.slots.set(p.id,i);this.lastInput[i]=Date.now();this.welcome(resumed);this.lobby();}
  catch{this.reservations.delete(p.id);if(this.phase==='game'&&this.players.has(p.id))this.interrupt(`${p.name} did not reconnect within 30 seconds. Session ended; everyone returned to the lobby.`);}
 }
 removePlayer(id:string){this.players.delete(id);this.slots.delete(id);if(this.hostId===id)this.hostId=[...this.players.values()].find(p=>p.connected)?.id??'';}
 interrupt(message:string){this.phase='lobby';this.notice=message;this.sim.clearInputs();this.slots.clear();this.matchRoster=[];this.queues=this.queues.map(()=>[]);for(const p of [...this.players.values()]){if(!p.connected)this.removePlayer(p.id);else{p.ready=false;p.slot=-1;delete p.reconnectUntil;}}for(const pending of this.reservations.values())pending.reject();this.reservations.clear();this.resetId++;void this.unlock();this.lobby();for(const c of this.clients)this.welcome(c);}
 advance(){if(this.phase==='game')super.advance();else{this.lastClock=performance.now();this.accumulator=0;}}
 publish(){if(this.phase==='game')super.publish();}
 onDispose(){partyRooms.delete(this.code);}
}
