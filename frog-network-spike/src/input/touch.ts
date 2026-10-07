import type {Input} from '../simulation/world';
/** Eight equal angular sectors with a small centre dead zone. Screen-down is +y. */
export function direction(dx:number,dy:number,radius:number):Pick<Input,'x'|'y'>{
 if(Math.hypot(dx,dy)<radius*.2)return {x:0,y:0};
 const sector=Math.round(Math.atan2(dy,dx)/(Math.PI/4));
 return {x:Math.round(Math.cos(sector*Math.PI/4)),y:Math.round(Math.sin(sector*Math.PI/4))};
}
export class TouchControls {
 input:Input={x:0,y:0,held:false};enabled:boolean;active=false;
 private lastNativeAt=0;private lastPointerAt=0;private lastPoint:{x:number;y:number;at:number}|null=null;private nativeTouch='ontouchstart' in window;private directionSource:'touch'|'pointer'='pointer';private actionSource:'touch'|'pointer'='pointer';private nativeIds:number[]=[];
 private observedPointers=new Set<number>();private browserTouches:{id:number;target:string;x:number;y:number}[]=[];private lastBrowserEvent='none';private cancelCount=0;private lastCancel='none';private lastBrowserSample=0;
 readonly events:{time:number;event:string;id:number|null;detail?:string}[]=[];
 diagnostics(){return {browserTouches:this.browserTouches.slice(),browserPointerIds:Array.from(this.observedPointers),lastBrowserEvent:this.lastBrowserEvent,cancelCount:this.cancelCount,lastCancel:this.lastCancel,lastNativeAt:this.lastNativeAt,lastPointerAt:this.lastPointerAt,lastPoint:this.lastPoint,nativeTouch:this.nativeTouch,nativeIds:this.nativeIds.slice(),directionSource:this.directionSource,actionSource:this.actionSource,active:this.active,directionId:this.directionId,actionId:this.actionId,input:{...this.input},events:this.events.slice()};}
 private record(event:string,id:number|null=null,detail?:string){if(event.startsWith('native-'))this.lastNativeAt=Date.now();else if(event.includes('down')||event.startsWith('pointer'))this.lastPointerAt=Date.now();this.events.push({time:Date.now(),event,id,detail});if(this.events.length>200)this.events.shift();}
 private capture(target:HTMLElement,id:number){try{target.setPointerCapture(id);}catch(e){this.record('capture-error',id,String(e));}}
 private uncapture(target:HTMLElement,id:number|null){try{if(id!==null&&target.hasPointerCapture(id))target.releasePointerCapture(id);}catch(e){this.record('release-error',id,String(e));}}
 private lastUpdate:[boolean,boolean,boolean,boolean,boolean]=[false,false,false,false,false];
 private directionId:number|null=null;private actionId:number|null=null;
 private pad=document.getElementById('direction-pad')!;private action=document.getElementById('touch-action') as HTMLButtonElement;
 private knob=document.getElementById('direction-knob')!;
 constructor(private changed:()=>void,private switched:()=>void,private canPlay?:()=>boolean){
  const preference=new URLSearchParams(location.search).get('touch');
  this.enabled=preference==='1'||preference!=='0'&&(matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0&&innerWidth<=1100);
  document.getElementById('touch-toggle')!.onclick=()=>{this.enabled=!this.enabled;this.active=false;this.reset(false,'layout-switch');this.switched();(document.activeElement as HTMLElement)?.blur();this.update(...this.lastUpdate);this.layout();};
  document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')this.record('touch-hit',e.pointerId,`${(e.target as HTMLElement)?.id|| (e.target as HTMLElement)?.tagName} @ ${Math.round(e.clientX)},${Math.round(e.clientY)} active=${this.active}`);},true);
  // Diagnostic-only browser inventory: observes every finger before control handlers, regardless of target.
  for(const type of ['touchstart','touchmove','touchend','touchcancel'] as const)document.addEventListener(type,e=>{
   this.browserTouches=Array.from(e.touches,t=>({id:t.identifier,target:(t.target as HTMLElement)?.id||'child',x:Math.round(t.clientX),y:Math.round(t.clientY)}));
   this.lastBrowserEvent=`${type} touches=${e.touches.length} changed=${Array.from(e.changedTouches,t=>t.identifier).join(',')} target=${(e.target as HTMLElement)?.id||'child'} cancelable=${e.cancelable} prevented=${e.defaultPrevented}`;
   if(type==='touchcancel'){this.cancelCount++;this.lastCancel=this.lastBrowserEvent;}
   if(type!=='touchmove'||Date.now()-this.lastBrowserSample>250){this.record('browser-event',null,this.lastBrowserEvent);this.lastBrowserSample=Date.now();}
  },{capture:true,passive:true});
  for(const type of ['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture'] as const)document.addEventListener(type,e=>{
   if(type==='pointerdown')this.observedPointers.add(e.pointerId);if(type==='pointerup'||type==='pointercancel')this.observedPointers.delete(e.pointerId);
   if(type==='pointercancel'){this.cancelCount++;this.lastCancel=`${type} id=${e.pointerId}`;}
   if(type!=='pointermove')this.record('browser-pointer',e.pointerId,`${type} ${e.pointerType} primary=${e.isPrimary} target=${(e.target as HTMLElement)?.id||'child'}`);
  },{capture:true,passive:true});
  for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,e=>{this.lastBrowserEvent=`${type} cancelable=${e.cancelable} prevented=${e.defaultPrevented}`;this.record('browser-gesture',null,this.lastBrowserEvent);},{capture:true,passive:true});
  // A fresh down reclaims an orphaned owner; old end events cannot clear the new owner.
  this.pad.addEventListener('pointerdown',e=>{if(this.nativeTouch&&e.pointerType==='touch')return;this.directionSource='pointer';this.record('direction-down',e.pointerId);if(!this.acceptFreshTouch())return;e.preventDefault();this.releaseDirection(false);this.directionId=e.pointerId;this.capture(this.pad,e.pointerId);this.move(e);});
  this.action.addEventListener('pointerdown',e=>{if(this.nativeTouch&&e.pointerType==='touch')return;this.actionSource='pointer';this.record('action-down',e.pointerId);if(!this.acceptFreshTouch())return;e.preventDefault();this.releaseAction(false);this.actionId=e.pointerId;this.capture(this.action,e.pointerId);this.input.held=true;this.action.classList.add('pressed');this.changed();});
  // Document capture is also a fallback if native pointer capture is unavailable/throws.
  document.addEventListener('pointermove',e=>{if(this.directionSource==='pointer'&&e.pointerId===this.directionId){e.preventDefault();this.move(e);}}, {capture:true,passive:false});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,e=>{
   const id=(e as PointerEvent).pointerId;
   if(this.directionSource==='pointer'&&id===this.directionId){if(type==='lostpointercapture'&&this.pad.hasPointerCapture(id))return;this.record(type,id,'direction');this.releaseDirection();}
   if(this.actionSource==='pointer'&&id===this.actionId){if(type==='lostpointercapture'&&this.action.hasPointerCapture(id))return;this.record(type,id,'action');this.releaseAction();}
  },true);
  // One input stream owns fingers. Native Touch identifiers are stable across capture/gesture interruptions.
  // Pointer events remain the mouse/pen fallback; never double-publish a native finger.
  document.addEventListener('touchstart',e=>{
   this.nativeIds=Array.from(e.touches,t=>t.identifier);this.record('native-start',null,this.nativeDetail(e));
   if(!this.nativeTouch||!this.acceptFreshTouch())return;
   for(const t of Array.from(e.changedTouches)){const target=t.target as Node;
    if(this.pad.contains(target)){e.preventDefault();this.releaseDirection(false);this.directionSource='touch';this.directionId=t.identifier;this.move(t);}
    else if(this.action.contains(target)){e.preventDefault();this.releaseAction(false);this.actionSource='touch';this.actionId=t.identifier;this.input.held=true;this.action.classList.add('pressed');this.changed();}
   }
  },{capture:true,passive:false});
  document.addEventListener('touchmove',e=>{
   this.lastNativeAt=Date.now();this.nativeIds=Array.from(e.touches,t=>t.identifier);if(!this.nativeTouch)return;
   for(const t of Array.from(e.changedTouches)){if(this.directionSource==='touch'&&t.identifier===this.directionId){e.preventDefault();this.move(t);}if(this.actionSource==='touch'&&t.identifier===this.actionId)e.preventDefault();}
  },{capture:true,passive:false});
  // End/cancel belongs to changed identifiers, not every owner on the page.
  // A cancellation of one thumb must never erase the other thumb's held input.
  for(const type of ['touchend','touchcancel'] as const)document.addEventListener(type,e=>{
   this.nativeIds=Array.from(e.touches,t=>t.identifier);this.record(type==='touchend'?'native-end':'native-cancel',null,this.nativeDetail(e));if(!this.nativeTouch)return;
   let changed=false;
   for(const t of Array.from(e.changedTouches)){
    if(this.directionSource==='touch'&&t.identifier===this.directionId){this.releaseDirection(false);changed=true;}
    if(this.actionSource==='touch'&&t.identifier===this.actionId){this.releaseAction(false);changed=true;}
   }
   if(changed)this.changed();
  },true);
  window.addEventListener('game-viewport-change',()=>this.reset(true,'viewport-layout-change'));
  for(const target of [this.pad,this.action])target.addEventListener('contextmenu',e=>e.preventDefault());
  window.addEventListener('resize',()=>{if(innerHeight>innerWidth)this.reset(true,'portrait-resize');this.update(...this.lastUpdate);this.layout();});
  window.addEventListener('pagehide',()=>this.reset(true,'pagehide'));
  window.addEventListener('orientationchange',()=>this.reset(true,'orientation'));
  window.addEventListener('blur',()=>this.reset(true,'blur'));document.addEventListener('visibilitychange',()=>{if(document.hidden)this.reset(true,'hidden');});
 }
 private nativeDetail(e:TouchEvent){return `active=${Array.from(e.touches,t=>t.identifier).join(',')} changed=${Array.from(e.changedTouches,t=>`${t.identifier}@${(t.target as HTMLElement)?.id||'child'}`).join(',')} cancelable=${e.cancelable}`;}
 private acceptFreshTouch(){const active=(this.canPlay?.()??this.lastUpdate[0])&&this.enabled&&innerWidth>=innerHeight;this.active=active;this.action.disabled=!active;this.pad.setAttribute('aria-disabled',String(!active));return active;}
 private move(e:{clientX:number;clientY:number;pointerId?:number;identifier?:number}){this.lastPoint={x:e.clientX,y:e.clientY,at:Date.now()};const r=this.pad.getBoundingClientRect(),radius=r.width/2,dx=e.clientX-r.left-radius,dy=e.clientY-r.top-r.height/2;
  const q=Math.min(1,radius*.65/(Math.hypot(dx,dy)||1));this.knob.style.transform=`translate(${dx*q}px,${dy*q}px)`;
  const next=direction(dx,dy,radius);if(next.x!==this.input.x||next.y!==this.input.y)this.record('direction-change',e.pointerId??e.identifier??null,`${next.x},${next.y}`);Object.assign(this.input,next);this.changed();
 }
 private releaseDirection(notify=true){const id=this.directionId;this.directionId=null;this.input.x=0;this.input.y=0;this.knob.style.transform='';if(this.directionSource==='pointer')this.uncapture(this.pad,id);if(notify)this.changed();}
 private releaseAction(notify=true){const id=this.actionId;this.actionId=null;this.input.held=false;this.action.classList.remove('pressed');if(this.actionSource==='pointer')this.uncapture(this.action,id);if(notify)this.changed();}
 reset(notify=true,reason='explicit'){this.record('reset',null,reason);this.releaseDirection(false);this.releaseAction(false);if(notify)this.changed();}
 update(active:boolean,session:boolean,grounded:boolean,charging:boolean,attached:boolean){
  this.lastUpdate=[active,session,grounded,charging,attached];
  const portrait=innerHeight>innerWidth;const next=active&&this.enabled&&!portrait;
  if(this.active&&!next)this.reset(true,portrait?'portrait':'inactive');this.active=next;
  document.body.classList.toggle('touch-game',this.enabled&&session);
  document.getElementById('rotate-prompt')!.hidden=!(this.enabled&&session&&portrait);
  document.getElementById('touch-controls-left')!.hidden=!this.enabled;
  document.getElementById('touch-controls-right')!.hidden=!this.enabled;
  this.action.disabled=!next;this.pad.setAttribute('aria-disabled',String(!next));
  this.action.textContent=attached?'HOLD / RELEASE':charging?'CHARGE':grounded?'JUMP':'TONGUE';
  document.getElementById('touch-toggle')!.textContent=this.enabled?'Use keyboard layout':'Use touch controls';
 }
 private layout(){document.body.classList.toggle('touch-enabled',this.enabled);window.dispatchEvent(new Event('touch-layout'));}
 initialize(){this.update(...this.lastUpdate);this.layout();}
}
