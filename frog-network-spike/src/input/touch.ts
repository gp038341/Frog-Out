import type {Input} from '../simulation/world';
/** Eight equal angular sectors with a small centre dead zone. Screen-down is +y. */
export function direction(dx:number,dy:number,radius:number):Pick<Input,'x'|'y'>{
 if(Math.hypot(dx,dy)<radius*.2)return {x:0,y:0};
 const sector=Math.round(Math.atan2(dy,dx)/(Math.PI/4));
 return {x:Math.round(Math.cos(sector*Math.PI/4)),y:Math.round(Math.sin(sector*Math.PI/4))};
}
export class TouchControls {
 input:Input={x:0,y:0,held:false};enabled:boolean;active=false;
 readonly events:{time:number;event:string;id:number|null;detail?:string}[]=[];
 diagnostics(){return {active:this.active,directionId:this.directionId,actionId:this.actionId,input:{...this.input},events:this.events.slice()};}
 private record(event:string,id:number|null=null,detail?:string){this.events.push({time:Date.now(),event,id,detail});if(this.events.length>200)this.events.shift();}
 private capture(target:HTMLElement,id:number){try{target.setPointerCapture(id);}catch(e){this.record('capture-error',id,String(e));}}
 private uncapture(target:HTMLElement,id:number|null){try{if(id!==null&&target.hasPointerCapture(id))target.releasePointerCapture(id);}catch(e){this.record('release-error',id,String(e));}}
 private lastUpdate:[boolean,boolean,boolean,boolean,boolean]=[false,false,false,false,false];
 private directionId:number|null=null;private actionId:number|null=null;
 private pad=document.getElementById('direction-pad')!;private action=document.getElementById('touch-action') as HTMLButtonElement;
 private knob=document.getElementById('direction-knob')!;
 constructor(private changed:()=>void,private switched:()=>void){
  const preference=new URLSearchParams(location.search).get('touch');
  this.enabled=preference==='1'||preference!=='0'&&(matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0&&innerWidth<=1100);
  document.getElementById('touch-toggle')!.onclick=()=>{this.enabled=!this.enabled;this.active=false;this.reset(false,'layout-switch');this.switched();(document.activeElement as HTMLElement)?.blur();this.update(...this.lastUpdate);this.layout();};
  document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')this.record('touch-hit',e.pointerId,`${(e.target as HTMLElement)?.id|| (e.target as HTMLElement)?.tagName} @ ${Math.round(e.clientX)},${Math.round(e.clientY)} active=${this.active}`);},true);
  // A fresh down reclaims an orphaned owner; old end events cannot clear the new owner.
  this.pad.addEventListener('pointerdown',e=>{this.record('direction-down',e.pointerId);if(!this.active)return;e.preventDefault();this.releaseDirection(false);this.directionId=e.pointerId;this.capture(this.pad,e.pointerId);this.move(e);});
  this.action.addEventListener('pointerdown',e=>{this.record('action-down',e.pointerId);if(!this.active)return;e.preventDefault();this.releaseAction(false);this.actionId=e.pointerId;this.capture(this.action,e.pointerId);this.input.held=true;this.action.classList.add('pressed');this.changed();});
  // Document capture is also a fallback if native pointer capture is unavailable/throws.
  document.addEventListener('pointermove',e=>{if(e.pointerId===this.directionId){e.preventDefault();this.move(e);}}, {capture:true,passive:false});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,e=>{
   const id=(e as PointerEvent).pointerId;
   if(id===this.directionId){this.record(type,id,'direction');this.releaseDirection();}
   if(id===this.actionId){this.record(type,id,'action');this.releaseAction();}
  },true);
  for(const target of [this.pad,this.action])target.addEventListener('contextmenu',e=>e.preventDefault());
  window.addEventListener('resize',()=>{if(innerHeight>innerWidth)this.reset(true,'portrait-resize');this.layout();});
  window.addEventListener('pagehide',()=>this.reset(true,'pagehide'));
  window.addEventListener('orientationchange',()=>this.reset(true,'orientation'));
  window.addEventListener('blur',()=>this.reset(true,'blur'));document.addEventListener('visibilitychange',()=>{if(document.hidden)this.reset(true,'hidden');});
 }
 private move(e:PointerEvent){const r=this.pad.getBoundingClientRect(),radius=r.width/2,dx=e.clientX-r.left-radius,dy=e.clientY-r.top-r.height/2;
  const q=Math.min(1,radius*.65/(Math.hypot(dx,dy)||1));this.knob.style.transform=`translate(${dx*q}px,${dy*q}px)`;
  const next=direction(dx,dy,radius);if(next.x!==this.input.x||next.y!==this.input.y)this.record('direction-change',e.pointerId,`${next.x},${next.y}`);Object.assign(this.input,next);this.changed();
 }
 private releaseDirection(notify=true){const id=this.directionId;this.directionId=null;this.input.x=0;this.input.y=0;this.knob.style.transform='';this.uncapture(this.pad,id);if(notify)this.changed();}
 private releaseAction(notify=true){const id=this.actionId;this.actionId=null;this.input.held=false;this.action.classList.remove('pressed');this.uncapture(this.action,id);if(notify)this.changed();}
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
