import type {Input} from '../simulation/world';
export type Point={x:number;y:number};
export type CanvasRect={left:number;top:number;width:number;height:number};
/** CSS pixels -> Phaser logical pixels -> camera world pixels -> simulation units.
 * The actual canvas rect excludes FIT letterboxing; backing-store DPR is irrelevant. */
export function mouseWorld(point:Point,rect:CanvasRect,size:{width:number;height:number},camera:(x:number,y:number)=>Point,units=30):Point|undefined{
 if(rect.width<=0||rect.height<=0||![point.x,point.y].every(Number.isFinite))return;
 const p=camera((point.x-rect.left)*size.width/rect.width,(point.y-rect.top)*size.height/rect.height);
 return Number.isFinite(p.x+p.y)?{x:p.x/units,y:p.y/units}:undefined;
}
export function mouseDirection(frog:Point,target:Point){const dx=target.x-frog.x,dy=target.y-frog.y,length=Math.hypot(dx,dy);return length>1e-6&&Number.isFinite(length)?{aimX:dx/length,aimY:dy/length}:undefined;}
/** Mouse-only ownership. Touch controls are neither observed nor captured here. */
export class MouseControls{
 private point?:Point;private owner:number|null=null;held=false;
 constructor(private canvas:HTMLCanvasElement,private allowed:()=>boolean,private world:(point:Point)=>Point|undefined,private frog:()=>Point|undefined,private changed:()=>void){
  canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||!this.allowed())return;e.preventDefault();this.point={x:e.clientX,y:e.clientY};this.owner=e.pointerId;this.held=true;try{canvas.setPointerCapture(e.pointerId);}catch{}this.changed();});
  window.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!this.allowed()||e.target!==canvas&&this.owner!==e.pointerId)return;const next={x:e.clientX,y:e.clientY};if(!this.point||next.x!==this.point.x||next.y!==this.point.y){this.point=next;}if(this.owner===e.pointerId&&!(e.buttons&1))this.reset();});
  window.addEventListener('pointerup',e=>{if(e.pointerType==='mouse'&&e.button===0&&this.owner===e.pointerId)this.reset();});
  window.addEventListener('pointercancel',e=>{if(this.owner===e.pointerId)this.reset();});
  canvas.addEventListener('lostpointercapture',e=>{if(this.owner===e.pointerId)this.reset();});
 }
 get active(){return this.held&&!!this.point;}
 diagnostics(){return{mode:this.active?'mouse':'keyboard',held:this.held,owner:this.owner,cursor:this.point?{...this.point}:undefined,frog:this.frog(),worldCursor:this.point&&this.world(this.point)};}
 reset(){const id=this.owner;this.owner=null;const held=this.held;this.held=false;try{if(id!==null&&this.canvas.hasPointerCapture(id))this.canvas.releasePointerCapture(id);}catch{}if(held)this.changed();}
 compose(base:Input):Input{const input={...base,held:base.held||this.held};if(base.held||!this.active||!this.allowed())return input;const frog=this.frog(),target=this.point&&this.world(this.point),aim=frog&&target&&mouseDirection(frog,target);return aim?{...input,...aim}:input;}
}
