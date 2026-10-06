import Phaser from 'phaser';
import {Connection} from './network/client';
import {NETWORK,type Snapshot} from './network/protocol';
import {capture,type FrogState} from './simulation/state';
import {arena,WIDTH,HEIGHT,defaults} from './simulation/config';
const net=new Connection();void net.connect();
const down=new Set<string>();
const keys=new Set(['KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']);
function sample(){net.setInput({x:Number(down.has('KeyD')||down.has('ArrowRight'))-Number(down.has('KeyA')||down.has('ArrowLeft')),y:Number(down.has('KeyS')||down.has('ArrowDown'))-Number(down.has('KeyW')||down.has('ArrowUp')),held:down.has('Space')});}
window.addEventListener('keydown',e=>{if(keys.has(e.code)){e.preventDefault();down.add(e.code);sample();}});
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
 const data={milestone:2,room:net.room?.roomId,slot:net.slot,lag:net.link.rtt,jitter:net.link.jitter,prediction:net.prediction,physics:defaults,network:NETWORK,samples:recent,server:net.snapshots.at(-1)?.tickMs,corrections:net.predictor.corrections};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='network-playtest-diagnostics.json';a.click();URL.revokeObjectURL(url);
});
let lastStatus=0;
class Spike extends Phaser.Scene {
 graphics!:Phaser.GameObjects.Graphics;labels:Phaser.GameObjects.Text[]=[];
 rendered:{x:number;y:number}[]=[];
 create(){this.graphics=this.add.graphics();for(let i=0;i<2;i++)this.labels.push(this.add.text(0,0,`P${i+1}`,{fontSize:'18px',color:i?'#ffbd69':'#7bffb5'}).setOrigin(.5,1));}
 update(_time:number,delta:number){
  const now=Date.now(),nowServer=now+net.offset;
  if(net.prediction&&!net.stale)net.predictor.advance(nowServer);
  const states=interpolate(net.snapshots,nowServer-NETWORK.interpolationMs);
  if(states.length!==2){document.querySelector('#status')!.textContent=net.status;return;}
  const predicted=net.prediction&&net.predictor.initialized?capture(net.predictor.sim).frogs:undefined;
  let coupled=false;
  if(predicted&&net.slot>=0){const me=predicted[net.slot],other=predicted[1-net.slot];
   coupled=(me.tongue?.target&&'frog'in me.tongue.target)?true:(other.tongue?.target&&'frog'in other.tongue.target)?true:Math.hypot(me.x-other.x,me.y-other.y)<defaults.frogRadius*2+.3;
   states[net.slot]=me;if(coupled)states[1-net.slot]=other;
  }
  const s=30,g=this.graphics;g.clear();g.fillStyle(0x283544);
  for(const r of arena)g.fillRect((r.x-r.w/2)*s,(r.y-r.h/2)*s,r.w*s,r.h*s);
  states.forEach((f,i)=>{
   // Only reconciliation discontinuities are smoothed; ordinary prediction remains immediate.
   const latest=net.snapshots.at(-1)!;
   const isPredicted=!!predicted&&(i===net.slot||coupled);
   let x=f.x,y=f.y;
   const offset=net.predictor.visualOffsets[i];
   const decay=Math.exp(-Math.min(delta,50)/NETWORK.correctionSmoothMs);
   offset.x*=decay;offset.y*=decay;
   if(isPredicted){x+=offset.x;y+=offset.y;}
   this.rendered[i]={x,y};
   const t=f.tongue;if(t){let tip=t.tip;if(t.phase==='attached'&&t.target&&'frog'in t.target&&t.localAnchor){const p=states[t.target.frog],o=net.predictor.visualOffsets[t.target.frog];tip={x:p.x+(coupled?o.x:0)+t.localAnchor.x,y:p.y+(coupled?o.y:0)+t.localAnchor.y};}
    g.lineStyle(3,0xff7baf);g.lineBetween(x*s,y*s,tip.x*s,tip.y*s);g.fillStyle(0xff7baf);g.fillCircle(tip.x*s,tip.y*s,4);
   }
   g.fillStyle(i?0xffbd69:0x7bffb5);g.fillCircle(x*s,y*s,defaults.frogRadius*s);
   g.fillStyle(0x111111);g.fillCircle((x+f.facing*.2)*s,(y-.12)*s,3);
   if(f.charging){g.lineStyle(3,0xffffff);g.strokeCircle(x*s,y*s,(defaults.frogRadius+.15+f.charge/defaults.chargeSeconds*.3)*s);}
   this.labels[i].setText(`P${i+1}${i===net.slot?' YOU':''}${latest.connected[i]?'':' (offline)'}`).setPosition(x*s,(y-defaults.frogRadius-.15)*s);
  });
  if(now-lastStatus>100){lastStatus=now;const last=net.snapshots.at(-1)!;
   const corrections=[...net.predictor.corrections].sort((a,b)=>a-b),p95=corrections[Math.floor(corrections.length*.95)]??0;
   document.querySelector('#status')!.textContent=`${net.status}${net.stale?' · STATE STALE':''} · room ${net.room?.roomId??'?'} · P${net.slot+1}\nRTT ${net.rtt.toFixed(0)}ms · added RTT ${net.link.rtt}ms ± ${net.link.jitter}ms/leg · prediction ${net.prediction?'ON':'OFF'} · coupled ${coupled}\ntick ${last.state.tick} · ack ${last.ack[net.slot]??0}/${net.seq} · pending ${net.predictor.pending.length} · state age ${Math.max(0,nowServer-last.serverTime).toFixed(0)}ms\ncorrection last ${net.predictor.lastCorrection.toFixed(3)}m / p95 ${p95.toFixed(3)}m · large snaps ${net.predictor.snaps}\nserver tick p95 ${last.tickMs.p95.toFixed(3)}ms / p99 ${last.tickMs.p99.toFixed(3)}ms / max ${last.tickMs.max.toFixed(3)}ms · overruns ${last.overruns}`;
   const roomLink=new URL(location.href);roomLink.searchParams.set('room',net.room!.roomId);document.querySelector<HTMLAnchorElement>('#room-link')!.href=roomLink.href;
   recent.push({at:now,rtt:net.rtt,correction:net.predictor.lastCorrection,pending:net.predictor.pending.length});if(recent.length>600)recent.shift();
  }
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:WIDTH*30,height:HEIGHT*30,backgroundColor:'#161b22',fps:{smoothStep:false},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Spike});
// Deliberately exposed only for automated spike diagnostics.
Object.assign(window,{spikeDebug:net});
