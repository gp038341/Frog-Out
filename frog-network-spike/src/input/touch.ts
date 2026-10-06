import type {Input} from '../simulation/world';
/** Eight equal angular sectors with a small centre dead zone. Screen-down is +y. */
export function direction(dx:number,dy:number,radius:number):Pick<Input,'x'|'y'>{
 if(Math.hypot(dx,dy)<radius*.2)return {x:0,y:0};
 const sector=Math.round(Math.atan2(dy,dx)/(Math.PI/4));
 return {x:Math.round(Math.cos(sector*Math.PI/4)),y:Math.round(Math.sin(sector*Math.PI/4))};
}
export class TouchControls {
 input:Input={x:0,y:0,held:false};enabled:boolean;active=false;
 private lastUpdate:[boolean,boolean,boolean,boolean,boolean]=[false,false,false,false,false];
 private directionId:number|null=null;private actionId:number|null=null;
 private pad=document.getElementById('direction-pad')!;private action=document.getElementById('touch-action') as HTMLButtonElement;
 private knob=document.getElementById('direction-knob')!;
 constructor(private changed:()=>void,private switched:()=>void){
  const preference=new URLSearchParams(location.search).get('touch');
  this.enabled=preference==='1'||preference!=='0'&&(matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0&&innerWidth<=1100);
  document.getElementById('touch-toggle')!.onclick=()=>{this.enabled=!this.enabled;this.active=false;this.reset(false);this.switched();(document.activeElement as HTMLElement)?.blur();this.update(...this.lastUpdate);this.layout();};
  this.pad.addEventListener('pointerdown',e=>{if(!this.active||this.directionId!==null)return;e.preventDefault();this.directionId=e.pointerId;this.pad.setPointerCapture(e.pointerId);this.move(e);});
  this.pad.addEventListener('pointermove',e=>{if(e.pointerId===this.directionId){e.preventDefault();this.move(e);}});
  this.action.addEventListener('pointerdown',e=>{if(!this.active||this.actionId!==null)return;e.preventDefault();this.actionId=e.pointerId;this.action.setPointerCapture(e.pointerId);this.input.held=true;this.action.classList.add('pressed');this.changed();});
  for(const type of ['pointerup','pointercancel','lostpointercapture']){
   this.pad.addEventListener(type,e=>{if((e as PointerEvent).pointerId!==this.directionId)return;this.releaseDirection();});
   this.action.addEventListener(type,e=>{if((e as PointerEvent).pointerId!==this.actionId)return;this.releaseAction();});
  }
  for(const target of [this.pad,this.action])target.addEventListener('contextmenu',e=>e.preventDefault());
  window.addEventListener('resize',()=>{this.reset();this.layout();});
  window.addEventListener('blur',()=>this.reset());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.reset();});
 }
 private move(e:PointerEvent){const r=this.pad.getBoundingClientRect(),radius=r.width/2,dx=e.clientX-r.left-radius,dy=e.clientY-r.top-r.height/2;
  const q=Math.min(1,radius*.65/(Math.hypot(dx,dy)||1));this.knob.style.transform=`translate(${dx*q}px,${dy*q}px)`;
  Object.assign(this.input,direction(dx,dy,radius));this.changed();
 }
 private releaseDirection(notify=true){const id=this.directionId;this.directionId=null;this.input.x=0;this.input.y=0;this.knob.style.transform='';if(id!==null&&this.pad.hasPointerCapture(id))this.pad.releasePointerCapture(id);if(notify)this.changed();}
 private releaseAction(notify=true){const id=this.actionId;this.actionId=null;this.input.held=false;this.action.classList.remove('pressed');if(id!==null&&this.action.hasPointerCapture(id))this.action.releasePointerCapture(id);if(notify)this.changed();}
 reset(notify=true){this.releaseDirection(false);this.releaseAction(false);if(notify)this.changed();}
 update(active:boolean,session:boolean,grounded:boolean,charging:boolean,attached:boolean){
  this.lastUpdate=[active,session,grounded,charging,attached];
  const portrait=innerHeight>innerWidth;const next=active&&this.enabled&&!portrait;
  if(this.active&&!next)this.reset();this.active=next;
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
