import {ModeUI} from './ui/mode-ui';
import {renderClassicHUD} from './ui/classic-hud';
import {renderFreezeHUD} from './ui/freeze-hud';
import './ui/mode-ui.css';
import {Customization} from './ui/customization';
import {appearancePreview} from './presentation/cosmetic-art';
import {skinFor} from './presentation/cosmetics';
import './ui/customization.css';
import {PresentationUI} from './presentation/presentation-ui';
import {arenaPreview} from './ui/arena-preview';
import {arenaList,DEFAULT_ARENA,getArena,isArenaId} from './simulation/arenas';
import Phaser from 'phaser';
import './mobile.css';
import './presentation/theme.css';
import './ui/player-guide.css';
import {PlayerGuide} from './ui/player-guide';
import {Courtyard} from './presentation/courtyard';
import {GameAudio} from './presentation/audio';
import {cssColor} from './presentation/identity';
import {TouchControls} from './input/touch';
import {Connection} from './network/client';
import {NETWORK,type Snapshot} from './network/protocol';
import {capture,type FrogState} from './simulation/state';
import {arena,WIDTH,HEIGHT,defaults} from './simulation/config';
const audio=new GameAudio();
const net=new Connection();void net.boot();
const down=new Set<string>();
const inputSwitches:{at:number;touch:boolean;phase:string;status:string}[]=[];
const touch=new TouchControls(sample,switchControls,()=>net.playing&&net.status==='connected'&&!document.querySelector('dialog[open]'));
function switchControls(){clear();inputSwitches.push({at:Date.now(),touch:touch.enabled,phase:net.outbreak?.phase??'none',status:net.status});if(inputSwitches.length>50)inputSwitches.shift();}
const keys=new Set(['KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']);
function sample(){if(!net.playing||document.activeElement instanceof HTMLInputElement)return;const x=Number(down.has('KeyD')||down.has('ArrowRight'))-Number(down.has('KeyA')||down.has('ArrowLeft')),y=Number(down.has('KeyS')||down.has('ArrowDown'))-Number(down.has('KeyW')||down.has('ArrowUp'));net.setInput({x:x||touch.input.x,y:y||touch.input.y,held:down.has('Space')||touch.input.held});}
window.addEventListener('keydown',e=>{if(keys.has(e.code)&&net.playing&&!(document.activeElement instanceof HTMLInputElement)){e.preventDefault();if(e.repeat&&!down.has(e.code))return;down.add(e.code);sample();}});
window.addEventListener('keyup',e=>{if(keys.has(e.code)){e.preventDefault();down.delete(e.code);sample();}});
function clear(){down.clear();touch.reset(false);net.setInput({x:0,y:0,held:false});}
window.addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
function interpolate(snapshots:Snapshot[],time:number):FrogState[]{
 if(!snapshots.length)return [];
 let a=snapshots[0],b=a;
 for(const s of snapshots){if(s.serverTime<=time)a=s;else{b=s;break;}b=a;}
 const q=b.serverTime>a.serverTime?Math.max(0,Math.min(1,(time-a.serverTime)/(b.serverTime-a.serverTime))):0;
 return a.state.frogs.map((f,i)=>{const g=b.state.frogs[i];return {...f,x:f.x+(g.x-f.x)*q,y:f.y+(g.y-f.y)*q,tongue:f.tongue?{...f.tongue,tip:{...f.tongue.tip}}:undefined};});
}
const recent:{at:number;rtt:number;correction:number;pending:number;input?:unknown;sequence?:number;ack?:number;tick?:number;authoritativeInput?:unknown;touchActive?:boolean}[]=[];
function viewportDiagnostics(){const v=window.visualViewport,c=document.querySelector('canvas'),font=getComputedStyle(el('phase-message'));const box=(id:string)=>el(id).getBoundingClientRect().toJSON();return {layout:{width:innerWidth,height:innerHeight,scrollX,scrollY},visual:v?{width:v.width,height:v.height,offsetLeft:v.offsetLeft,offsetTop:v.offsetTop,pageLeft:v.pageLeft,pageTop:v.pageTop,scale:v.scale}:null,dpr:devicePixelRatio,orientation:screen.orientation?.type??(innerWidth>innerHeight?'landscape':'portrait'),stage:box('game-stage'),canvas:c?.getBoundingClientRect().toJSON(),canvasBacking:c?{width:c.width,height:c.height}:null,parent:box('game'),session:box('session'),footer:box('session-footer'),text:{fontSize:font.fontSize,lineHeight:font.lineHeight,textSizeAdjust:getComputedStyle(document.documentElement).getPropertyValue('-webkit-text-size-adjust')||getComputedStyle(document.documentElement).getPropertyValue('text-size-adjust')}};}
const viewportEvents:{at:number;reason:string;viewport:unknown}[]=[];
function exportDiagnostics(){
 const data={build:'iphone-reliability-diagnostic-v1',browser:{userAgent:navigator.userAgent,platform:navigator.platform,touchEvents:'ontouchstart' in window,pointerEvents:typeof PointerEvent==='function'},viewport:viewportDiagnostics(),viewportEvents,inputTrace:net.inputTrace,milestone:8,arena:{id:net.lobby?.arenaId??DEFAULT_ARENA,width:WIDTH,height:HEIGHT,solids:getArena(net.lobby?.arenaId??DEFAULT_ARENA).solids},fullscreen:{supported:fullscreenAvailable,active:!!fullscreenActive(),standard:typeof fsRoot.requestFullscreen==='function',standardEnabled:document.fullscreenEnabled,prefixed:typeof fsRoot.webkitRequestFullscreen==='function',prefixedEnabled:fsDocument.webkitFullscreenEnabled},normalizedInput:net.input,inputSwitches,focus:{element:document.activeElement?.tagName,id:document.activeElement?.id,documentFocused:document.hasFocus()},inputPipeline:{status:net.status,playing:net.playing,stale:net.stale,lastReceiveAgeMs:Date.now()-net.lastReceive,sequence:net.seq,ack:net.snapshots.at(-1)?.ack[net.slot],tick:net.snapshots.at(-1)?.state.tick,authoritativeFrog:net.snapshots.at(-1)?.state.frogs[net.slot]},touch:{lifecycle:touch.diagnostics(),enabled:touch.enabled,input:touch.input,viewport:{width:innerWidth,height:innerHeight},pointer:matchMedia('(pointer:coarse)').matches,touchPoints:navigator.maxTouchPoints},outbreak:net.outbreak,room:net.room?.roomId,slot:net.slot,lag:net.link.rtt,jitter:net.link.jitter,prediction:net.prediction,physics:defaults,network:NETWORK,samples:recent,server:net.snapshots.at(-1)?.tickMs,corrections:net.predictor.corrections};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='network-playtest-diagnostics.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
document.querySelector('#export')!.addEventListener('click',exportDiagnostics);
document.querySelector('#mobile-export')!.addEventListener('click',exportDiagnostics);
let lastStatus=0;
class Spike extends Phaser.Scene {
 art!:Courtyard;
 rendered:{x:number;y:number}[]=[];
 create(){this.art=new Courtyard(this,audio);}

 update(_time:number,delta:number){
  if(net.lobby?.phase!=='game'){this.art.clear();return;}
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
  });
  const latest=net.snapshots.at(-1)!;
  this.art.setArena(net.snapshots.at(-1)?.arenaId??net.lobby?.arenaId??DEFAULT_ARENA);
  this.art.appearances=states.map((_,i)=>net.lobby?.players.find(p=>p.slot===i)?.appearance);
  this.art.render(states,this.rendered,net.outbreak,latest.connected,states.map((_,i)=>playerName(i)),net.slot,delta);
  if(now-lastStatus>100){lastStatus=now;const last=net.snapshots.at(-1)!;
   const corrections=[...net.predictor.corrections].sort((a,b)=>a-b),p95=corrections[Math.floor(corrections.length*.95)]??0;
   document.querySelector('#status')!.textContent=`${net.status}${net.stale?' · STATE STALE':''} · room ${net.room?.roomId??'?'} · P${net.slot+1}\nRTT ${net.rtt.toFixed(0)}ms · added RTT ${net.link.rtt}ms ± ${net.link.jitter}ms/leg · prediction ${net.prediction?'ON':'OFF'} · coupled ${coupled}\ntick ${last.state.tick} · ack ${last.ack[net.slot]??0}/${net.seq} · pending ${net.predictor.pending.length} · state age ${Math.max(0,nowServer-last.serverTime).toFixed(0)}ms\ncorrection last ${net.predictor.lastCorrection.toFixed(3)}m / p95 ${p95.toFixed(3)}m · large snaps ${net.predictor.snaps}\nserver tick p95 ${last.tickMs.p95.toFixed(3)}ms / p99 ${last.tickMs.p99.toFixed(3)}ms / max ${last.tickMs.max.toFixed(3)}ms · overruns ${last.overruns}`;
   recent.push({at:now,rtt:net.rtt,correction:net.predictor.lastCorrection,pending:net.predictor.pending.length,input:{...net.input},sequence:net.seq,ack:net.snapshots.at(-1)?.ack[net.slot],tick:net.snapshots.at(-1)?.state.tick,authoritativeInput:net.snapshots.at(-1)?.state.frogs[net.slot]?.input,touchActive:touch.active});if(recent.length>600)recent.shift();
  }
 }
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:WIDTH*30,height:HEIGHT*30,backgroundColor:'#183f48',audio:{noAudio:true},fps:{smoothStep:false},scale:{expandParent:false,mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Spike});
let lastCanvasBounds='',viewportFrame=0,lastUsableViewport='';
function resizeGame(){
 const stage=document.getElementById('game-stage')!,session=document.getElementById('session')!,main=document.querySelector('main')!;
 const active=!session.hidden;document.body.classList.toggle('game-active',active);
 const v=window.visualViewport,width=v?.width??innerWidth,height=v?.height??innerHeight,left=v?.offsetLeft??0,top=v?.offsetTop??0;
 const usable=[width,height,left,top,v?.scale??1].map(x=>Math.round(x*2)/2).join(',');
 // Neutralize synchronously, before a subsequent finger can arrive. A queued render must not erase it.
 if(usable!==lastUsableViewport){const previous=lastUsableViewport;lastUsableViewport=usable;if(active&&previous){clear();window.dispatchEvent(new Event('game-viewport-change'));}}
 for(const [key,value]of Object.entries({'--usable-width':width,'--usable-height':height,'--usable-left':left,'--usable-top':top,'--game-toolbar-height':width<700?64:36}))main.style.setProperty(key,`${value}px`);
 if(viewportFrame)return;viewportFrame=requestAnimationFrame(()=>{
  viewportFrame=0;const vv=window.visualViewport,visibleHeight=vv?.height??innerHeight,visibleTop=vv?.offsetTop??0;
  if(!session.hidden){
   // Touch gameplay uses fixed HUD/footer grid bands. Text metrics never determine the arena parent.
   if(document.body.classList.contains('touch-game'))stage.style.removeProperty('height');
   else {const footerHeight=document.getElementById('session-footer')!.getBoundingClientRect().height;const stageTop=stage.getBoundingClientRect().top-visibleTop;
    stage.style.height=`${Math.max(40,visibleHeight-stageTop-footerHeight-12)}px`;
   }
  }
  const bounds=document.getElementById('game')!.getBoundingClientRect();const signature=`${bounds.x},${bounds.y},${bounds.width},${bounds.height}`;
  if(signature!==lastCanvasBounds){lastCanvasBounds=signature;game.scale.getParentBounds();game.scale.refresh();}
 });}

function viewportChanged(reason:string){viewportEvents.push({at:Date.now(),reason,viewport:viewportDiagnostics()});if(viewportEvents.length>120)viewportEvents.shift();resizeGame();}
new ResizeObserver(resizeGame).observe(document.getElementById('game')!);
window.visualViewport?.addEventListener('resize',()=>viewportChanged('visual-resize'));
window.visualViewport?.addEventListener('scroll',()=>viewportChanged('visual-scroll'));
window.addEventListener('orientationchange',()=>{clear();viewportChanged('orientation');});
// Safari gesture events are cancelled only inside active gameplay; normal page/help accessibility is retained.
for(const event of ['gesturestart','gesturechange'])document.addEventListener(event,e=>{if(document.body.classList.contains('game-active')&&!document.querySelector('dialog[open]')){e.preventDefault();}},{passive:false});
for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,()=>{clear();resizeGame();fullscreenLabel();});
const fullscreenButton=document.getElementById('fullscreen') as HTMLButtonElement;
type FullscreenDocument=Document & {webkitFullscreenEnabled?:boolean;webkitFullscreenElement?:Element;webkitExitFullscreen?:()=>void};
type FullscreenElement=HTMLElement & {webkitRequestFullscreen?:()=>void};
const fsDocument=document as FullscreenDocument,fsRoot=document.documentElement as FullscreenElement;
const fullscreenAvailable=!!(typeof fsRoot.requestFullscreen==='function'&&document.fullscreenEnabled===true||typeof fsRoot.webkitRequestFullscreen==='function'&&fsDocument.webkitFullscreenEnabled===true);
function fullscreenActive(){return document.fullscreenElement||fsDocument.webkitFullscreenElement;}
function fullscreenLabel(){fullscreenButton.textContent=fullscreenActive()?'Exit Fullscreen':'Enter Fullscreen';}
fullscreenButton.hidden=!fullscreenAvailable;
if(!fullscreenAvailable){const hint=document.createElement('small');hint.id='fullscreen-unavailable';hint.textContent='Landscape · browser view';hint.title='Fullscreen is not supported here; normal browser play is supported.';document.getElementById('session-footer')!.append(hint);}
fullscreenButton.onclick=async()=>{try{if(fullscreenActive()){if(document.fullscreenElement&&document.exitFullscreen)await document.exitFullscreen();else fsDocument.webkitExitFullscreen?.();}else if(typeof fsRoot.requestFullscreen==='function'&&document.fullscreenEnabled!==false)await fsRoot.requestFullscreen();else fsRoot.webkitRequestFullscreen?.();fullscreenLabel();resizeGame();}catch{net.notice='Fullscreen is unavailable here. You can continue playing normally.';}};

window.addEventListener('resize',()=>viewportChanged('window-resize'));window.addEventListener('touch-layout',resizeGame);touch.initialize();
// Deliberately exposed only for automated spike diagnostics.
Object.assign(window,{spikeDebug:net});

const el=(id:string)=>document.getElementById(id)!;
const guide=new PlayerGuide(clear);
const presentation=new PresentationUI(audio);
const modeUI=new ModeUI(mode=>net.selectMode(mode));
const customization=new Customization(el('frog-customization'),appearance=>net.setAppearance(appearance));
const arenaCards=arenaList.map(a=>{const b=document.createElement('button');b.type='button';b.className='arena-card';b.dataset.arena=a.id;b.innerHTML=arenaPreview(a);const title=document.createElement('strong');title.textContent=a.name;b.append(title);const desc=document.createElement('small');desc.textContent=a.id==='canopy'?'Balanced garden chases':a.id==='bathhouse'?'Sponge shortcuts & basin swings':a.id==='toyshop'?'Rubber launches & zigzag chases':a.id==='sunny-pond'?'Lily launches & muddy choices':'Vertical swings & launches';b.append(desc);b.onclick=()=>net.selectArena(a.id);el('arena-previews').append(b);return b;});
const arenaSelect=el('arena-select') as HTMLSelectElement;arenaSelect.replaceChildren(...arenaList.map(a=>{const o=document.createElement('option');o.value=a.id;o.textContent=a.name+(a.geometryPreview?' · Geometry Preview':'');return o;}));arenaSelect.onchange=()=>{if(isArenaId(arenaSelect.value))net.selectArena(arenaSelect.value);};
const name=el('name') as HTMLInputElement,code=el('join-code') as HTMLInputElement;
name.value=localStorage.getItem('frog-out-name')??'';code.value=new URLSearchParams(location.search).get('code')??'';
function remember(){localStorage.setItem('frog-out-name',name.value.trim());}
el('create').onclick=()=>{net.notice='';remember();void net.create(name.value);};el('join').onclick=()=>{net.notice='';remember();void net.join(name.value,code.value);};
el('ready').onclick=()=>{audio.play('ui');net.ready(!net.lobby?.players.find(p=>p.id===net.playerId)?.ready);};el('start').onclick=()=>net.start();el('leave').onclick=()=>{const leave=()=>{guide.close();clear();net.notice='';void net.leave();};if(net.lobby?.phase==='game')guide.confirmLeave(leave);else leave();};
async function copy(text:string){try{await navigator.clipboard.writeText(text);net.notice='Copied.';}catch{net.notice=`Copy this: ${text}`;}}
el('copy-code').onclick=()=>{if(net.lobby)void copy(net.lobby.code);};el('share-link').onclick=()=>{if(net.lobby){const u=new URL(location.href);u.search='';u.searchParams.set('code',net.lobby.code);void copy(u.href);}};
el('sound').onclick=()=>{const enabled=audio.toggle();el('sound').textContent=enabled?'Sound: On':'Sound: Off';el('sound').setAttribute('aria-pressed',String(enabled));};
el('next-round').onclick=()=>{audio.play('ui');net.nextRound();};el('return-lobby').onclick=()=>net.returnLobby();
const diagnosticButton=document.createElement('button');diagnosticButton.id='input-monitor-toggle';diagnosticButton.textContent='Input monitor';diagnosticButton.setAttribute('aria-pressed','false');el('session-footer').append(diagnosticButton);
const diagnosticPanel=document.createElement('pre');diagnosticPanel.id='input-monitor';diagnosticPanel.hidden=true;diagnosticPanel.setAttribute('aria-label','Input pipeline diagnostics');document.body.append(diagnosticPanel);
let monitor=new URLSearchParams(location.search).get('diagnostics')==='1';
diagnosticButton.onclick=()=>{monitor=!monitor;diagnosticButton.setAttribute('aria-pressed',String(monitor));diagnosticPanel.hidden=!monitor;};
function updateMonitor(){diagnosticPanel.hidden=!monitor||el('session').hidden;diagnosticButton.hidden=el('session').hidden;if(!monitor)return;const v=window.visualViewport,t=touch.diagnostics(),s=net.snapshots.at(-1),f=s?.state.frogs[net.slot],trace=net.inputTrace,age=(at:number)=>at?`${Date.now()-at}ms`:'never';
 diagnosticPanel.style.top=`${(v?.offsetTop??0)+4}px`;diagnosticPanel.style.left=`${(v?.offsetLeft??0)+6}px`;diagnosticPanel.style.right='auto';diagnosticPanel.style.maxWidth=`${(v?.width??innerWidth)-12}px`;
 diagnosticPanel.textContent=`INPUT MONITOR · ${net.status} · ${net.playing?'PLAY':'PAUSED'}${net.stale?' · STALE':''}\nlayout ${innerWidth}×${innerHeight} visual ${v?.width.toFixed(0)}×${v?.height.toFixed(0)} offset ${v?.offsetLeft.toFixed(0)},${v?.offsetTop.toFixed(0)} zoom ${v?.scale.toFixed(2)}\nDPR ${devicePixelRatio} ${screen.orientation?.type??(innerWidth>innerHeight?'landscape':'portrait')} canvas CSS ${document.querySelector('canvas')?.getBoundingClientRect().width.toFixed(0)}×${document.querySelector('canvas')?.getBoundingClientRect().height.toFixed(0)} backing ${document.querySelector('canvas')?.width}×${document.querySelector('canvas')?.height}\nparent ${el('game').clientWidth}×${el('game').clientHeight} Phaser ${game.scale.gameSize.width}×${game.scale.gameSize.height} HUD ${getComputedStyle(el('phase-message')).fontSize} adjust ${getComputedStyle(document.documentElement).getPropertyValue('-webkit-text-size-adjust')}\nresize ${viewportEvents.at(-1)?.reason??'none'} ${age(viewportEvents.at(-1)?.at??0)}\nbrowser touches ${t.browserTouches.length} [${t.browserTouches.map(p=>p.id).join(',')}] pointers [${t.browserPointerIds.join(',')}]\nowners MOVE=${t.directionId??'-'} ACTION=${t.actionId??'-'} active ${touch.active} raw ${t.input.x},${t.input.y},${+t.input.held}\n${t.lastBrowserEvent}\ncancels ${t.cancelCount}: ${t.lastCancel}\nlocal ${net.input.x},${net.input.y},${+net.input.held} sent #${trace.sentSeq} ${age(trace.sentAt)} open ${trace.transportOpen}\nack #${trace.ack} ${age(trace.ackAt)} snapshot ${age(trace.snapshotAt)} tick ${s?.state.tick} ${age(trace.tickAt)}\nserver ${f?.input.x},${f?.input.y},${+!!f?.input.held} xy ${f?.x.toFixed(2)},${f?.y.toFixed(2)} vel ${f?.vx.toFixed(2)},${f?.vy.toFixed(2)}\n${trace.skip||'sending'} · ${t.events.at(-1)?.event??''}`;
}
let uiSignature='';let previousPhase='';let previousGamePhase='';

setInterval(()=>{const lobby=net.lobby;const phase=lobby?.phase??'home';if(phase!==previousPhase){if(phase==='game'&&document.activeElement instanceof HTMLInputElement)document.activeElement.blur();clear();previousPhase=phase;if(phase==='game')requestAnimationFrame(()=>{game.scale.getParentBounds();game.scale.refresh();});}if(net.status!=='connected')clear();if(phase==='home'&&previousPhase==='home'&&!lobby&&net.status.startsWith('You left'))net.notice='';guide.update(phase,net.playing);modeUI.update(lobby,net.playerId,net.status==='connected');el('home').hidden=!!lobby;el('lobby').hidden=phase!=='lobby';el('session').hidden=phase!=='game'||net.outbreak?.phase==='round-results'||net.outbreak?.phase==='match-results';el('leave').hidden=!lobby;el('connection').textContent=net.status;el('notice').textContent=net.notice;
 (el('create') as HTMLButtonElement).disabled=net.busy;(el('join') as HTMLButtonElement).disabled=net.busy;
 const signature=JSON.stringify([lobby,net.playerId]);if(signature!==uiSignature){uiSignature=signature;el('players').replaceChildren();if(lobby){el('code').textContent=lobby.code;el('session-code').textContent=`Room ${lobby.code}`;for(const p of lobby.players){const li=document.createElement('li');li.style.setProperty('--frog-color','#'+skinFor(p.appearance).color.toString(16).padStart(6,'0'));li.className=p.ready?'player-card ready':'player-card';const portrait=document.createElement('span');portrait.className='player-portrait';portrait.innerHTML=appearancePreview(p.appearance);const text=document.createElement('span');text.className='player-name';text.textContent=`${p.name}${p.id===lobby.hostId?' · Host':''}${p.id===net.playerId?' · You':''} — ${p.connected?(p.ready?'Ready':'Not ready'):'Disconnected (slot reserved)'}`;li.append(portrait,text);el('players').append(li);}const me=lobby.players.find(p=>p.id===net.playerId);customization.update(me?.appearance,net.status==='connected'&&phase==='lobby');el('ready').textContent=me?.ready?'Not Ready':'Ready';el('ready').setAttribute('aria-pressed',String(!!me?.ready));el('start').hidden=net.playerId!==lobby.hostId;}}
 if(lobby){const selected=getArena(lobby.arenaId);el('lobby-arena-name').textContent=selected.name.toUpperCase();arenaSelect.value=selected.id;for(const card of arenaCards){const chosen=card.dataset.arena===selected.id;card.setAttribute('aria-pressed',String(chosen));card.disabled=phase!=='lobby'||net.playerId!==lobby.hostId||net.status!=='connected';}arenaSelect.disabled=phase!=='lobby'||net.playerId!==lobby.hostId||net.status!=='connected';el('arena-description').textContent=selected.description;el('arena-choice-note').textContent=net.playerId===lobby.hostId?'Changing arenas clears Ready for everyone.':'The host chooses. Arena changes clear everyone’s Ready.';el('session-code').textContent=`Room ${lobby.code} · ${selected.name}`;}
 el('mobile-export').hidden=phase!=='game';
 renderOutbreak();presentation.update(net.lobby?.phase==='game'?net.outbreak:undefined,net.slot);updateMonitor();
 const f=net.prediction&&net.playing&&net.predictor.initialized?net.predictor.sim.frogs[net.slot]:net.snapshots.at(-1)?.state.frogs[net.slot];
 resizeGame();
 touch.update(net.playing&&net.status==='connected'&&!guide.blocking,phase==='game'&&!!net.outbreak&&['announcement','countdown','playing'].includes(net.outbreak.phase),f?.grounded??false,f?.charging??false,f?.tongue?.phase==='attached');
 const ready=lobby?.players.every(p=>p.ready&&p.connected)&&lobby.players.length>=2;(el('start') as HTMLButtonElement).disabled=!ready||net.status!=='connected';(el('ready') as HTMLButtonElement).disabled=net.status!=='connected';
},100);

function playerName(slot:number){return net.lobby?.players.find(p=>p.slot===slot)?.name??`P${slot+1}`;}
function points(n:number){return n.toFixed(1);}
function ordinal(n:number){const mod=n%100;return `${n}${mod>=11&&mod<=13?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th'}`;}
function clock(ms:number){const cs=Math.floor(ms/10);return `${String(Math.floor(cs/6000)).padStart(2,'0')}:${String(Math.floor(cs/100)%60).padStart(2,'0')}.${String(cs%100).padStart(2,'0')}`;}
let resultsSignature='';let lastCue='';let previousResult='';
function renderOutbreak(){
 const state=net.lobby?.phase==='game'?net.outbreak:undefined;
 const signature=state?`${state.round}:${state.phase}`:'';if(signature!==previousGamePhase){clear();previousGamePhase=signature;if(state&&['announcement','countdown','playing'].includes(state.phase))requestAnimationFrame(()=>{game.scale.getParentBounds();game.scale.refresh();});}
 const results=state?.phase==='round-results'||state?.phase==='match-results';el('results').hidden=!results;
 if(!state){el('phase-overlay').hidden=true;return;}

 if(state.mode==='classic'){renderClassicHUD(state,net.slot,playerName,net.playerId===net.lobby?.hostId,net.status==='connected');return;}
 if(state.mode==='freeze'){renderFreezeHUD(state,net.slot,playerName,net.playerId===net.lobby?.hostId,net.status==='connected');return;}
 const count=Math.max(1,Math.ceil(state.remainingMs/1000));
 document.body.dataset.outbreakPhase=state.phase;
 const intro=state.phase==='announcement'||state.phase==='countdown';el('phase-overlay').hidden=!intro;el('phase-overlay').dataset.phase=state.phase;el('reveal-name').textContent=playerName(state.patientZero);el('countdown-number').textContent=state.phase==='countdown'?String(count):'◆';
 const healthy=state.players.filter(p=>p.state==='healthy').length;el('healthy-count').textContent=state.phase==='playing'?`${healthy} SAFE / ${state.players.length}`:'';
 if(results&&previousResult!==signature){previousResult=signature;el('results').classList.remove('arrive');void el('results').offsetWidth;el('results').classList.add('arrive');}
 el('outbreak-heading').textContent=`Round ${state.round}/${state.roundCount}`;
 el('phase-message').textContent=state.phase==='announcement'?`POISON DART FROG — ${playerName(state.patientZero)}`:state.phase==='countdown'?`POISON DART FROG — ${playerName(state.patientZero)} · ${Math.max(1,Math.ceil(state.remainingMs/1000))}…`:state.phase==='playing'?'POISON TAG — Body contact spreads poison':'';
 el('round-timer').textContent=clock(state.elapsedMs);
 const me=state.players[net.slot];el('live-score').textContent=me?(me.state==='healthy'?`SURVIVING · ${points(me.survivalPoints)} pts`:me.state==='transforming'?'TRANSFORMING · NO TAG YET':`POISON FROG · ${points(me.roundPoints??0)} pts locked`):'';el('infection-feedback').textContent=me?.roundPoints!==null&&me?.roundPoints!==undefined?`${me.patientZero?'POISON DART FROG':`${ordinal(me.infectionPlace!)} POISONED`}${state.players.filter(p=>p.infectionPlace===me.infectionPlace).length>1?' (TIED)':''} · +${points(me.roundPoints)} (${points(me.survivalPoints)} survival + ${points(me.placementBonus)} bonus)`:'';
 if(!results)return;
 const key=JSON.stringify([state.phase,state.round,state.players.map(p=>[p.infectionPlace,p.roundPoints,p.totalPoints]),state.roundWinners,state.matchWinners,net.lobby?.players.map(p=>[p.id,p.name,p.connected]),net.playerId]);
 if(key!==resultsSignature){resultsSignature=key;const final=state.phase==='match-results';el('results-context').textContent=final?`${state.roundCount} rounds played · Everyone was the Poison Dart Frog once`:`Round ${state.round} of ${state.roundCount}`;el('results-title').textContent=final?'MATCH COMPLETE':'POISON TAG COMPLETE!';
  const winners=final?state.matchWinners:state.roundWinners;el('winner-message').textContent=`${winners.length>1?'Shared winners':'Winner'}: ${winners.map(playerName).join(', ')}${final?'':` · ${clock(state.elapsedMs)}`}`;
  const table=el('standings');table.replaceChildren();const header=document.createElement('tr');for(const title of final?['Placement','Player','Total points']:['Poison order','Player','Survival','Bonus','Round score','Total points']){const th=document.createElement('th');th.textContent=title;header.append(th);}table.append(header);
  const rows=[...state.players].sort((a,b)=>final?b.totalPoints-a.totalPoints||a.slot-b.slot:(a.infectionPlace??0)-(b.infectionPlace??0)||a.slot-b.slot);
  for(const p of rows){const tr=document.createElement('tr');tr.style.setProperty('--frog-color',cssColor(p.slot));if(winners.includes(p.slot))tr.classList.add('winner-row');const place=final?p.finalPlace:p.infectionPlace!;const tied=state.players.filter(other=>(final?other.finalPlace:other.infectionPlace)===place).length>1;const name=`${playerName(p.slot)}${winners.includes(p.slot)?' — WINNER':''}${net.lobby?.players.find(player=>player.slot===p.slot)?.connected?'':' (offline)'}`;
   for(const text of final?[`${ordinal(place)}${tied?' (tied)':''}`,name,points(p.totalPoints)]:[`${p.patientZero?'Poison Dart Frog':ordinal(place)}${tied?' (tied)':''}`,name,points(p.survivalPoints),points(p.placementBonus),points(p.roundPoints!),points(p.totalPoints)]){const td=document.createElement('td');td.textContent=text;tr.append(td);}table.append(tr);}
  const host=net.playerId===net.lobby?.hostId;el('next-round').hidden=final||!host;el('return-lobby').hidden=!final||!host;el('next-round').textContent=state.round===state.roundCount?'Final Standings':'Next Round';el('results-help').textContent=host?(final?'Return to the lobby, ready up, and start a new match.':'Continue when everyone has reviewed the results.'):'Waiting for the host to continue.';
 }
 (el('next-round') as HTMLButtonElement).disabled=net.status!=='connected';(el('return-lobby') as HTMLButtonElement).disabled=net.status!=='connected';
}
