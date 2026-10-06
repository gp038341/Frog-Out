import Phaser from 'phaser';
import './mobile.css';
import {TouchControls} from './input/touch';
import {Connection} from './network/client';
import {NETWORK,type Snapshot} from './network/protocol';
import {capture,type FrogState} from './simulation/state';
import {arena,WIDTH,HEIGHT,defaults} from './simulation/config';
const net=new Connection();void net.boot();
const down=new Set<string>();
const touch=new TouchControls(sample);
const keys=new Set(['KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']);
function sample(){if(!net.playing||document.activeElement instanceof HTMLInputElement)return;const x=Number(down.has('KeyD')||down.has('ArrowRight'))-Number(down.has('KeyA')||down.has('ArrowLeft')),y=Number(down.has('KeyS')||down.has('ArrowDown'))-Number(down.has('KeyW')||down.has('ArrowUp'));net.setInput({x:x||touch.input.x,y:y||touch.input.y,held:down.has('Space')||touch.input.held});}
window.addEventListener('keydown',e=>{if(keys.has(e.code)&&net.playing&&!(document.activeElement instanceof HTMLInputElement)){e.preventDefault();down.add(e.code);sample();}});
window.addEventListener('keyup',e=>{if(keys.has(e.code)){e.preventDefault();down.delete(e.code);sample();}});
function clear(){down.clear();touch.reset();sample();}
window.addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
function interpolate(snapshots:Snapshot[],time:number):FrogState[]{
 if(!snapshots.length)return [];
 let a=snapshots[0],b=a;
 for(const s of snapshots){if(s.serverTime<=time)a=s;else{b=s;break;}b=a;}
 const q=b.serverTime>a.serverTime?Math.max(0,Math.min(1,(time-a.serverTime)/(b.serverTime-a.serverTime))):0;
 return a.state.frogs.map((f,i)=>{const g=b.state.frogs[i];return {...f,x:f.x+(g.x-f.x)*q,y:f.y+(g.y-f.y)*q,tongue:f.tongue?{...f.tongue,tip:{...f.tongue.tip}}:undefined};});
}
const recent:{at:number;rtt:number;correction:number;pending:number}[]=[];
function exportDiagnostics(){
 const data={milestone:5,touch:{enabled:touch.enabled,input:touch.input,viewport:{width:innerWidth,height:innerHeight},pointer:matchMedia('(pointer:coarse)').matches,touchPoints:navigator.maxTouchPoints},outbreak:net.outbreak,room:net.room?.roomId,slot:net.slot,lag:net.link.rtt,jitter:net.link.jitter,prediction:net.prediction,physics:defaults,network:NETWORK,samples:recent,server:net.snapshots.at(-1)?.tickMs,corrections:net.predictor.corrections};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='network-playtest-diagnostics.json';a.click();URL.revokeObjectURL(url);
}
document.querySelector('#export')!.addEventListener('click',exportDiagnostics);
document.querySelector('#mobile-export')!.addEventListener('click',exportDiagnostics);
let lastStatus=0;
class Spike extends Phaser.Scene {
 graphics!:Phaser.GameObjects.Graphics;labels:Phaser.GameObjects.Text[]=[];
 rendered:{x:number;y:number}[]=[];
 create(){this.graphics=this.add.graphics();for(let i=0;i<8;i++)this.labels.push(this.add.text(0,0,`P${i+1}`,{fontSize:'14px',color:i?'#ffbd69':'#7bffb5'}).setOrigin(.5,1));}
 update(_time:number,delta:number){
  if(net.lobby?.phase!=='game'){this.graphics.clear();this.labels.forEach(l=>l.setVisible(false));return;}
  const now=Date.now(),nowServer=now+net.offset;
  if(net.prediction&&net.playing&&!net.stale)net.predictor.advance(nowServer);
  const states=interpolate(net.snapshots,nowServer-NETWORK.interpolationMs);
  if(states.length<2){document.querySelector('#status')!.textContent=net.status;return;}
  const predicted=net.prediction&&net.playing&&net.predictor.initialized?capture(net.predictor.sim).frogs:undefined;
  const coupledSlots=new Set<number>();
  if(predicted&&net.slot>=0&&predicted[net.slot]){
   coupledSlots.add(net.slot);let changed=true;
   while(changed){changed=false;predicted.forEach((f,i)=>{predicted.forEach((g,j)=>{if(i===j||(!coupledSlots.has(i)&&!coupledSlots.has(j)))return;const attached=f.tongue?.target&&'frog'in f.tongue.target&&f.tongue.target.frog===j;const near=Math.hypot(f.x-g.x,f.y-g.y)<defaults.frogRadius*2+.3;if(attached||near){if(!coupledSlots.has(i)||!coupledSlots.has(j))changed=true;coupledSlots.add(i);coupledSlots.add(j);}});});}
   for(const i of coupledSlots)states[i]=predicted[i];
  }
  const coupled=coupledSlots.size>1;
  this.labels.forEach((l,i)=>l.setVisible(i<states.length));
  const s=30,g=this.graphics;g.clear();g.fillStyle(0x283544);
  for(const r of arena)g.fillRect((r.x-r.w/2)*s,(r.y-r.h/2)*s,r.w*s,r.h*s);
  states.forEach((f,i)=>{
   // Only reconciliation discontinuities are smoothed; ordinary prediction remains immediate.
   const latest=net.snapshots.at(-1)!;
   const isPredicted=!!predicted&&coupledSlots.has(i);
   let x=f.x,y=f.y;
   const offset=net.predictor.visualOffsets[i]??{x:0,y:0};
   const decay=Math.exp(-Math.min(delta,50)/NETWORK.correctionSmoothMs);
   offset.x*=decay;offset.y*=decay;
   if(isPredicted){x+=offset.x;y+=offset.y;}
   this.rendered[i]={x,y};
   const t=f.tongue;if(t){let tip=t.tip;if(t.phase==='attached'&&t.target&&'frog'in t.target&&t.localAnchor){const p=states[t.target.frog],o=net.predictor.visualOffsets[t.target.frog]??{x:0,y:0};tip={x:p.x+(coupledSlots.has(t.target.frog)?o.x:0)+t.localAnchor.x,y:p.y+(coupledSlots.has(t.target.frog)?o.y:0)+t.localAnchor.y};}
    g.lineStyle(3,0xff7baf);g.lineBetween(x*s,y*s,tip.x*s,tip.y*s);g.fillStyle(0xff7baf);g.fillCircle(tip.x*s,tip.y*s,4);
   }
   const infection=net.outbreak?.players[i];
   g.fillStyle(infection?.state==='infectious'?0xb38cff:infection?.state==='transforming'?0xffdc73:i?0xffbd69:0x7bffb5);g.fillCircle(x*s,y*s,defaults.frogRadius*s);
   if(infection?.state==='infectious'){g.lineStyle(2,0xffffff);g.lineBetween((x-.18)*s,(y-.18)*s,(x+.18)*s,(y+.18)*s);g.lineBetween((x+.18)*s,(y-.18)*s,(x-.18)*s,(y+.18)*s);}
   if(infection?.state==='transforming'||infection?.patientZero){g.lineStyle(2,0xffffff);g.strokeCircle(x*s,y*s,(defaults.frogRadius+.1)*s);if(infection.patientZero)g.strokeCircle(x*s,y*s,(defaults.frogRadius+.18)*s);}
   g.fillStyle(0x111111);g.fillCircle((x+f.facing*.2)*s,(y-.12)*s,3);
   if(f.charging){g.lineStyle(3,0xffffff);g.strokeCircle(x*s,y*s,(defaults.frogRadius+.15+f.charge/defaults.chargeSeconds*.3)*s);}
   this.labels[i].setText(`${net.lobby?.players.find(p=>p.slot===i)?.name??`P${i+1}`}${i===net.slot?' YOU':''}${latest.connected[i]?'':' (offline)'}\n${infection?.patientZero?'PZ · ':''}${infection?.state==='transforming'?'GRACE':infection?.state==='infectious'?'POISON':'HEALTHY'}`).setPosition(x*s,(y-defaults.frogRadius-.15)*s);
  });
  if(now-lastStatus>100){lastStatus=now;const last=net.snapshots.at(-1)!;
   const corrections=[...net.predictor.corrections].sort((a,b)=>a-b),p95=corrections[Math.floor(corrections.length*.95)]??0;
   document.querySelector('#status')!.textContent=`${net.status}${net.stale?' · STATE STALE':''} · room ${net.room?.roomId??'?'} · P${net.slot+1}\nRTT ${net.rtt.toFixed(0)}ms · added RTT ${net.link.rtt}ms ± ${net.link.jitter}ms/leg · prediction ${net.prediction?'ON':'OFF'} · coupled ${coupled}\ntick ${last.state.tick} · ack ${last.ack[net.slot]??0}/${net.seq} · pending ${net.predictor.pending.length} · state age ${Math.max(0,nowServer-last.serverTime).toFixed(0)}ms\ncorrection last ${net.predictor.lastCorrection.toFixed(3)}m / p95 ${p95.toFixed(3)}m · large snaps ${net.predictor.snaps}\nserver tick p95 ${last.tickMs.p95.toFixed(3)}ms / p99 ${last.tickMs.p99.toFixed(3)}ms / max ${last.tickMs.max.toFixed(3)}ms · overruns ${last.overruns}`;
   recent.push({at:now,rtt:net.rtt,correction:net.predictor.lastCorrection,pending:net.predictor.pending.length});if(recent.length>600)recent.shift();
  }
 }
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:WIDTH*30,height:HEIGHT*30,backgroundColor:'#161b22',fps:{smoothStep:false},scale:{expandParent:false,mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Spike});
function resizeGame(){clear();requestAnimationFrame(()=>{game.scale.getParentBounds();game.scale.refresh();});}
new ResizeObserver(()=>requestAnimationFrame(()=>{game.scale.getParentBounds();game.scale.refresh();})).observe(document.getElementById('game')!);
window.addEventListener('resize',resizeGame);window.addEventListener('touch-layout',resizeGame);touch.initialize();
// Deliberately exposed only for automated spike diagnostics.
Object.assign(window,{spikeDebug:net});

const el=(id:string)=>document.getElementById(id)!;
const name=el('name') as HTMLInputElement,code=el('join-code') as HTMLInputElement;
name.value=localStorage.getItem('frog-out-name')??'';code.value=new URLSearchParams(location.search).get('code')??'';
function remember(){localStorage.setItem('frog-out-name',name.value.trim());}
el('create').onclick=()=>{remember();void net.create(name.value);};el('join').onclick=()=>{remember();void net.join(name.value,code.value);};
el('ready').onclick=()=>net.ready(!net.lobby?.players.find(p=>p.id===net.playerId)?.ready);el('start').onclick=()=>net.start();el('leave').onclick=()=>{clear();void net.leave();};
async function copy(text:string){try{await navigator.clipboard.writeText(text);net.notice='Copied.';}catch{net.notice=`Copy this: ${text}`;}}
el('copy-code').onclick=()=>{if(net.lobby)void copy(net.lobby.code);};el('share-link').onclick=()=>{if(net.lobby){const u=new URL(location.href);u.search='';u.searchParams.set('code',net.lobby.code);void copy(u.href);}};
el('next-round').onclick=()=>net.nextRound();el('return-lobby').onclick=()=>net.returnLobby();
let uiSignature='';let previousPhase='';let previousGamePhase='';

setInterval(()=>{const lobby=net.lobby;const phase=lobby?.phase??'home';if(phase!==previousPhase){if(touch.enabled&&phase==='game'&&document.activeElement instanceof HTMLInputElement)document.activeElement.blur();clear();previousPhase=phase;if(phase==='game')requestAnimationFrame(()=>{game.scale.getParentBounds();game.scale.refresh();});}if(net.status!=='connected')clear();el('home').hidden=!!lobby;el('lobby').hidden=phase!=='lobby';el('session').hidden=phase!=='game'||net.outbreak?.phase==='round-results'||net.outbreak?.phase==='match-results';el('leave').hidden=!lobby;el('connection').textContent=net.status;el('notice').textContent=net.notice;
 (el('create') as HTMLButtonElement).disabled=net.busy;(el('join') as HTMLButtonElement).disabled=net.busy;
 const signature=JSON.stringify([lobby,net.playerId]);if(signature!==uiSignature){uiSignature=signature;el('players').replaceChildren();if(lobby){el('code').textContent=lobby.code;el('session-code').textContent=`Room ${lobby.code}`;for(const p of lobby.players){const li=document.createElement('li');li.textContent=`${p.name}${p.id===lobby.hostId?' · Host':''}${p.id===net.playerId?' · You':''} — ${p.connected?(p.ready?'Ready':'Not ready'):'Disconnected (slot reserved)'}`;el('players').append(li);}const me=lobby.players.find(p=>p.id===net.playerId);el('ready').textContent=me?.ready?'Not Ready':'Ready';el('start').hidden=net.playerId!==lobby.hostId;}}
 el('mobile-export').hidden=!touch.enabled||phase!=='game';
 renderOutbreak();
 const f=net.prediction&&net.playing&&net.predictor.initialized?net.predictor.sim.frogs[net.slot]:net.snapshots.at(-1)?.state.frogs[net.slot];
 touch.update(net.playing&&net.status==='connected',phase==='game'&&!!net.outbreak&&['announcement','countdown','playing'].includes(net.outbreak.phase),f?.grounded??false,f?.charging??false,f?.tongue?.phase==='attached');
 const ready=lobby?.players.every(p=>p.ready&&p.connected)&&lobby.players.length>=2;(el('start') as HTMLButtonElement).disabled=!ready||net.status!=='connected';(el('ready') as HTMLButtonElement).disabled=net.status!=='connected';
},100);

function playerName(slot:number){return net.lobby?.players.find(p=>p.slot===slot)?.name??`P${slot+1}`;}
function ordinal(n:number){const mod=n%100;return `${n}${mod>=11&&mod<=13?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th'}`;}
function clock(ms:number){const cs=Math.floor(ms/10);return `${String(Math.floor(cs/6000)).padStart(2,'0')}:${String(Math.floor(cs/100)%60).padStart(2,'0')}.${String(cs%100).padStart(2,'0')}`;}
let resultsSignature='';
function renderOutbreak(){
 const state=net.lobby?.phase==='game'?net.outbreak:undefined;
 const signature=state?`${state.round}:${state.phase}`:'';if(signature!==previousGamePhase){clear();previousGamePhase=signature;if(state&&['announcement','countdown','playing'].includes(state.phase))requestAnimationFrame(()=>{game.scale.getParentBounds();game.scale.refresh();});}
 const results=state?.phase==='round-results'||state?.phase==='match-results';el('results').hidden=!results;
 if(!state)return;
 el('outbreak-heading').textContent=`Round ${state.round}/${state.roundCount}`;
 el('phase-message').textContent=state.phase==='announcement'?`PATIENT ZERO — ${playerName(state.patientZero)}`:state.phase==='countdown'?`PATIENT ZERO — ${playerName(state.patientZero)} · ${Math.max(1,Math.ceil(state.remainingMs/1000))}…`:state.phase==='playing'?'OUTBREAK — Body contact spreads poison':'';
 el('round-timer').textContent=clock(state.elapsedMs);
 const me=state.players[net.slot];el('infection-feedback').textContent=me?.roundPoints!==null&&me?.roundPoints!==undefined?`${me.patientZero?'PATIENT ZERO':`${ordinal(me.infectionPlace!)} INFECTED`}${state.players.filter(p=>p.infectionPlace===me.infectionPlace).length>1?' (TIED)':''} · +${me.roundPoints}`:'';
 if(!results)return;
 const key=JSON.stringify([state.phase,state.round,state.players.map(p=>[p.infectionPlace,p.roundPoints,p.totalPoints]),state.roundWinners,state.matchWinners,net.lobby?.players.map(p=>[p.id,p.name,p.connected]),net.playerId]);
 if(key!==resultsSignature){resultsSignature=key;const final=state.phase==='match-results';el('results-title').textContent=final?'MATCH COMPLETE':'OUTBREAK COMPLETE!';
  const winners=final?state.matchWinners:state.roundWinners;el('winner-message').textContent=`${winners.length>1?'Shared winners':'Winner'}: ${winners.map(playerName).join(', ')}${final?'':` · ${clock(state.elapsedMs)}`}`;
  const table=el('standings');table.replaceChildren();const header=document.createElement('tr');for(const title of final?['Placement','Player','Total points']:['Infection order','Player','Round points','Total points']){const th=document.createElement('th');th.textContent=title;header.append(th);}table.append(header);
  const rows=[...state.players].sort((a,b)=>final?b.totalPoints-a.totalPoints||a.slot-b.slot:(a.infectionPlace??0)-(b.infectionPlace??0)||a.slot-b.slot);
  for(const p of rows){const tr=document.createElement('tr');const place=final?p.finalPlace:p.infectionPlace!;const tied=state.players.filter(other=>(final?other.finalPlace:other.infectionPlace)===place).length>1;const name=`${playerName(p.slot)}${winners.includes(p.slot)?' — WINNER':''}${net.lobby?.players.find(player=>player.slot===p.slot)?.connected?'':' (offline)'}`;
   for(const text of final?[`${ordinal(place)}${tied?' (tied)':''}`,name,String(p.totalPoints)]:[`${p.patientZero?'Patient Zero':ordinal(place)}${tied?' (tied)':''}`,name,String(p.roundPoints),String(p.totalPoints)]){const td=document.createElement('td');td.textContent=text;tr.append(td);}table.append(tr);}
  const host=net.playerId===net.lobby?.hostId;el('next-round').hidden=final||!host;el('return-lobby').hidden=!final||!host;el('next-round').textContent=state.round===state.roundCount?'Final Standings':'Next Round';el('results-help').textContent=host?(final?'Return to the lobby, ready up, and start a new match.':'Continue when everyone has reviewed the results.'):'Waiting for the host to continue.';
 }
 (el('next-round') as HTMLButtonElement).disabled=net.status!=='connected';(el('return-lobby') as HTMLButtonElement).disabled=net.status!=='connected';
}
