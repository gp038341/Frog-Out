import Phaser from 'phaser';
import {Connection} from './network/client';
import {NETWORK,type Snapshot} from './network/protocol';
import {capture,type FrogState} from './simulation/state';
import {arena,WIDTH,HEIGHT,defaults} from './simulation/config';
const net=new Connection();void net.boot();
const down=new Set<string>();
const keys=new Set(['KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']);
function sample(){if(net.lobby?.phase!=='game'||document.activeElement instanceof HTMLInputElement)return;net.setInput({x:Number(down.has('KeyD')||down.has('ArrowRight'))-Number(down.has('KeyA')||down.has('ArrowLeft')),y:Number(down.has('KeyS')||down.has('ArrowDown'))-Number(down.has('KeyW')||down.has('ArrowUp')),held:down.has('Space')});}
window.addEventListener('keydown',e=>{if(keys.has(e.code)&&net.lobby?.phase==='game'&&!(document.activeElement instanceof HTMLInputElement)){e.preventDefault();down.add(e.code);sample();}});
window.addEventListener('keyup',e=>{if(keys.has(e.code)){e.preventDefault();down.delete(e.code);sample();}});
function clear(){down.clear();sample();}
window.addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
function interpolate(snapshots:Snapshot[],time:number):FrogState[]{
 if(!snapshots.length)return [];
 let a=snapshots[0],b=a;
 for(const s of snapshots){if(s.serverTime<=time)a=s;else{b=s;break;}b=a;}
 const q=b.serverTime>a.serverTime?Math.max(0,Math.min(1,(time-a.serverTime)/(b.serverTime-a.serverTime))):0;
 return a.state.frogs.map((f,i)=>{const g=b.state.frogs[i];return {...f,x:f.x+(g.x-f.x)*q,y:f.y+(g.y-f.y)*q,tongue:f.tongue?{...f.tongue,tip:{...f.tongue.tip}}:undefined};});
}
const recent:{at:number;rtt:number;correction:number;pending:number}[]=[];
document.querySelector('#export')!.addEventListener('click',()=>{
 const data={milestone:3,room:net.room?.roomId,slot:net.slot,lag:net.link.rtt,jitter:net.link.jitter,prediction:net.prediction,physics:defaults,network:NETWORK,samples:recent,server:net.snapshots.at(-1)?.tickMs,corrections:net.predictor.corrections};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='network-playtest-diagnostics.json';a.click();URL.revokeObjectURL(url);
});
let lastStatus=0;
class Spike extends Phaser.Scene {
 graphics!:Phaser.GameObjects.Graphics;labels:Phaser.GameObjects.Text[]=[];
 rendered:{x:number;y:number}[]=[];
 create(){this.graphics=this.add.graphics();for(let i=0;i<8;i++)this.labels.push(this.add.text(0,0,`P${i+1}`,{fontSize:'18px',color:i?'#ffbd69':'#7bffb5'}).setOrigin(.5,1));}
 update(_time:number,delta:number){
  if(net.lobby?.phase!=='game'){this.graphics.clear();this.labels.forEach(l=>l.setVisible(false));return;}
  const now=Date.now(),nowServer=now+net.offset;
  if(net.prediction&&!net.stale)net.predictor.advance(nowServer);
  const states=interpolate(net.snapshots,nowServer-NETWORK.interpolationMs);
  if(states.length<2){document.querySelector('#status')!.textContent=net.status;return;}
  const predicted=net.prediction&&net.predictor.initialized?capture(net.predictor.sim).frogs:undefined;
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
   g.fillStyle(i?0xffbd69:0x7bffb5);g.fillCircle(x*s,y*s,defaults.frogRadius*s);
   g.fillStyle(0x111111);g.fillCircle((x+f.facing*.2)*s,(y-.12)*s,3);
   if(f.charging){g.lineStyle(3,0xffffff);g.strokeCircle(x*s,y*s,(defaults.frogRadius+.15+f.charge/defaults.chargeSeconds*.3)*s);}
   this.labels[i].setText(`${net.lobby?.players.find(p=>p.slot===i)?.name??`P${i+1}`}${i===net.slot?' YOU':''}${latest.connected[i]?'':' (offline)'}`).setPosition(x*s,(y-defaults.frogRadius-.15)*s);
  });
  if(now-lastStatus>100){lastStatus=now;const last=net.snapshots.at(-1)!;
   const corrections=[...net.predictor.corrections].sort((a,b)=>a-b),p95=corrections[Math.floor(corrections.length*.95)]??0;
   document.querySelector('#status')!.textContent=`${net.status}${net.stale?' · STATE STALE':''} · room ${net.room?.roomId??'?'} · P${net.slot+1}\nRTT ${net.rtt.toFixed(0)}ms · added RTT ${net.link.rtt}ms ± ${net.link.jitter}ms/leg · prediction ${net.prediction?'ON':'OFF'} · coupled ${coupled}\ntick ${last.state.tick} · ack ${last.ack[net.slot]??0}/${net.seq} · pending ${net.predictor.pending.length} · state age ${Math.max(0,nowServer-last.serverTime).toFixed(0)}ms\ncorrection last ${net.predictor.lastCorrection.toFixed(3)}m / p95 ${p95.toFixed(3)}m · large snaps ${net.predictor.snaps}\nserver tick p95 ${last.tickMs.p95.toFixed(3)}ms / p99 ${last.tickMs.p99.toFixed(3)}ms / max ${last.tickMs.max.toFixed(3)}ms · overruns ${last.overruns}`;
   recent.push({at:now,rtt:net.rtt,correction:net.predictor.lastCorrection,pending:net.predictor.pending.length});if(recent.length>600)recent.shift();
  }
 }
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:WIDTH*30,height:HEIGHT*30,backgroundColor:'#161b22',fps:{smoothStep:false},scale:{expandParent:false,mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Spike});
// Deliberately exposed only for automated spike diagnostics.
Object.assign(window,{spikeDebug:net});

const el=(id:string)=>document.getElementById(id)!;
const name=el('name') as HTMLInputElement,code=el('join-code') as HTMLInputElement;
name.value=localStorage.getItem('frog-out-name')??'';code.value=new URLSearchParams(location.search).get('code')??'';
function remember(){localStorage.setItem('frog-out-name',name.value.trim());}
el('create').onclick=()=>{remember();void net.create(name.value);};el('join').onclick=()=>{remember();void net.join(name.value,code.value);};
el('ready').onclick=()=>net.ready(!net.lobby?.players.find(p=>p.id===net.playerId)?.ready);el('start').onclick=()=>net.start();el('leave').onclick=()=>{down.clear();void net.leave();};
async function copy(text:string){try{await navigator.clipboard.writeText(text);net.notice='Copied.';}catch{net.notice=`Copy this: ${text}`;}}
el('copy-code').onclick=()=>{if(net.lobby)void copy(net.lobby.code);};el('share-link').onclick=()=>{if(net.lobby){const u=new URL(location.href);u.search='';u.searchParams.set('code',net.lobby.code);void copy(u.href);}};
let uiSignature='';let previousPhase='';
setInterval(()=>{const lobby=net.lobby;const phase=lobby?.phase??'home';if(phase!==previousPhase){down.clear();previousPhase=phase;if(phase==='game')requestAnimationFrame(()=>{game.scale.getParentBounds();game.scale.refresh();});}if(net.status!=='connected')down.clear();el('home').hidden=!!lobby;el('lobby').hidden=phase!=='lobby';el('session').hidden=phase!=='game';el('leave').hidden=!lobby;el('connection').textContent=net.status;el('notice').textContent=net.notice;
 (el('create') as HTMLButtonElement).disabled=net.busy;(el('join') as HTMLButtonElement).disabled=net.busy;
 const signature=JSON.stringify([lobby,net.playerId]);if(signature!==uiSignature){uiSignature=signature;el('players').replaceChildren();if(lobby){el('code').textContent=lobby.code;el('session-code').textContent=`Room ${lobby.code}`;for(const p of lobby.players){const li=document.createElement('li');li.textContent=`${p.name}${p.id===lobby.hostId?' · Host':''}${p.id===net.playerId?' · You':''} — ${p.connected?(p.ready?'Ready':'Not ready'):'Disconnected (slot reserved)'}`;el('players').append(li);}const me=lobby.players.find(p=>p.id===net.playerId);el('ready').textContent=me?.ready?'Not Ready':'Ready';el('start').hidden=net.playerId!==lobby.hostId;}}
 const ready=lobby?.players.every(p=>p.ready&&p.connected)&&lobby.players.length>=2;(el('start') as HTMLButtonElement).disabled=!ready||net.status!=='connected';(el('ready') as HTMLButtonElement).disabled=net.status!=='connected';
},100);
