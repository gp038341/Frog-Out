import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import {createHash} from 'node:crypto';
const requireHash=(s:Buffer)=>createHash('sha256').update(s).digest('hex');
function fixture(original:boolean|'native-before'=false,native=false){
 const elements=new Map<string,any>();const listeners=new Map<string,Function[]>();let failCapture=false,failRelease=false,changed=0;
 function target(){return {contains(node:any){return node===this;},style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(t:string,f:Function){listeners.set(t+this.id,[...(listeners.get(t+this.id)||[]),f]);},setAttribute(){},getBoundingClientRect(){return {left:0,top:0,width:100,height:100};},setPointerCapture(){if(failCapture)throw Error('capture interrupted');},hasPointerCapture(){return true;},releasePointerCapture(){if(failRelease)throw Error('release interrupted');},id:''};}
 const doc={hidden:false,body:target(),activeElement:{blur(){}},getElementById(id:string){if(!elements.has(id)){const e=target();e.id=id;elements.set(id,e);}return elements.get(id);},addEventListener(t:string,f:Function){listeners.set(t+'document',[...(listeners.get(t+'document')||[]),f]);}};
 const win={addEventListener(t:string,f:Function){listeners.set(t+'window',[...(listeners.get(t+'window')||[]),f]);},dispatchEvent(){}};
 if(native)(win as any).ontouchstart=null;
 const source=original==='native-before'?JSON.parse(readFileSync(new URL('../docs/iphone-multitouch-preservation.json',import.meta.url),'utf8')).files['src/input/touch.ts'].changes[0].to:original?execFileSync('git',['show','6de0286:frog-network-spike/src/input/touch.ts'],{encoding:'utf8'}):readFileSync(new URL('../src/input/touch.ts',import.meta.url),'utf8');
 const js=ts.transpile(source.replace(/import type[^;]+;/,'').replace('export function','function').replace('export class','class')+'\nglobalThis.Controls=TouchControls;',{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None});const context:any={document:doc,window:win,location:{search:'?touch=1'},URLSearchParams,matchMedia:()=>({matches:true}),navigator:{maxTouchPoints:5},innerWidth:844,innerHeight:390,Event:class{},Date,Math};runInNewContext(js,context);const control=new context.Controls(()=>changed++,()=>{});control.update(true,true,true,false,false);
 return {control,context,get changed(){return changed;},fail(c:boolean,r=false){failCapture=c;failRelease=r;},fire(t:string,id:number,target='direction-pad'){for(const f of listeners.get(t+target)||[])f({pointerId:id,clientX:85,clientY:50,preventDefault(){}});},docFire(t:string,id:number){for(const f of listeners.get(t+'document')||[])f({pointerId:id,clientX:85,clientY:50,preventDefault(){}});},windowFire(type:string){for(const f of listeners.get(type+'window')||[])f();},native(type:string,changed:number[],active:number[],target='direction-pad'){const make=(id:number)=>({identifier:id,clientX:85,clientY:50,target:elements.get(target)});for(const f of listeners.get(type+'document')||[])f({touches:active.map(make),changedTouches:changed.map(make),preventDefault(){}});},resize(){for(const f of listeners.get('resizewindow')||[])f();}};
}
test('reproduces old orphan owner and capture-exception failure; both recover in correction',()=>{
 const old=fixture(true);old.fire('pointerdown',1);old.fire('pointerdown',2);old.fire('pointerup',2);assert.equal(old.control.input.x,1,'old control ignores fresh down/end after lost old end');
 const oldError=fixture(true);oldError.fail(true);assert.throws(()=>oldError.fire('pointerdown',1));oldError.fail(false);oldError.fire('pointerdown',2);assert.equal(oldError.control.input.x,0,'old capture exception latches owner before publishing input');
 const fixed=fixture();fixed.fire('pointerdown',1);fixed.fire('pointerdown',2);fixed.docFire('pointerup',1);assert.equal(fixed.control.input.x,1);fixed.docFire('pointerup',2);assert.equal(fixed.control.input.x,0);
 fixed.fail(true,true);assert.doesNotThrow(()=>fixed.fire('pointerdown',3));assert.equal(fixed.control.input.x,1);assert.doesNotThrow(()=>fixed.control.reset());assert.equal(fixed.control.input.x,0);assert.ok(fixed.control.events.some((e:any)=>e.event==='capture-error'));
});
test('global cancel independently releases both thumbs; cosmetic landscape resize does not drop held controls',()=>{
 const f=fixture();f.fire('pointerdown',1);f.fire('pointerdown',2,'touch-action');f.resize();assert.equal(f.control.input.x,1);assert.equal(f.control.input.held,true);f.docFire('pointercancel',1);assert.equal(f.control.input.x,0);assert.equal(f.control.input.held,true);f.docFire('pointercancel',2);assert.equal(f.control.input.held,false);
 f.fire('pointerdown',3);f.context.innerHeight=900;f.resize();assert.equal(f.control.input.x,0);
});

test('native finger stream preserves both thumbs outside controls and ignores pointer capture failures',()=>{
 const f=fixture(false,true);f.fail(true,true);f.native('touchstart',[41],[41]);f.native('touchstart',[72],[41,72],'touch-action');assert.equal(f.control.input.x,1);assert.equal(f.control.input.held,true);
 f.native('touchmove',[41],[41,72]);f.docFire('lostpointercapture',41);assert.equal(f.control.input.x,1);assert.equal(f.control.input.held,true);
 f.native('touchend',[41],[72]);assert.equal(f.control.input.x,0);assert.equal(f.control.input.held,true);f.native('touchend',[72],[]);assert.equal(f.control.input.held,false);
});
test('native cancel, missing end, viewport relocation and visibility interruptions recover on the next fresh finger',()=>{
 const f=fixture(false,true);for(const type of ['game-viewport-change','blur','orientationchange','pagehide']){f.native('touchstart',[11],[11]);f.native('touchstart',[22],[11,22],'touch-action');f.windowFire(type);assert.equal(f.control.input.x,0);assert.equal(f.control.input.held,false);f.native('touchstart',[33],[33]);assert.equal(f.control.input.x,1);f.native('touchcancel',[33],[]);assert.equal(f.control.input.x,0);}
 f.native('touchstart',[9],[9],'touch-action');f.native('touchstart',[10],[10]);assert.equal(f.control.input.held,true,'a new direction finger cannot discard an independently held action');f.native('touchstart',[12],[10,12],'touch-action');f.native('touchend',[9],[10,12]);assert.equal(f.control.input.held,true,'late old end cannot erase replacement owner');f.native('touchend',[12],[10]);assert.equal(f.control.input.x,1);f.native('touchend',[10],[]);assert.equal(f.control.input.x,0);
});

test('native two-thumb ownership survives either order, either release and one-finger cancellation',()=>{
 for(const first of ['direction-pad','touch-action']){
  const f=fixture(false,true),other=first==='direction-pad'?'touch-action':'direction-pad';f.native('touchstart',[11],[11],first);f.native('touchstart',[22],[11,22],other);assert.equal(f.control.input.x,1);assert.equal(f.control.input.held,true);
  f.native('touchend',[22],[11],other);assert.equal(f.control.input.x,first==='direction-pad'?1:0);assert.equal(f.control.input.held,first==='touch-action');f.native('touchend',[11],[],first);assert.equal(f.control.input.x,0);assert.equal(f.control.input.held,false);
 }
 for(const cancel of [11,22]){const f=fixture(false,true);f.native('touchstart',[11],[11]);f.native('touchstart',[22],[11,22],'touch-action');f.native('touchcancel',[cancel],cancel===11?[22]:[11]);assert.equal(f.control.input.x,cancel===11?0:1);assert.equal(f.control.input.held,cancel===22?false:true);f.native('touchstart',[33],cancel===11?[22,33]:[11,33],cancel===11?'direction-pad':'touch-action');assert.equal(f.control.input.x,1);assert.equal(f.control.input.held,true);}
});
test('continuous movement survives rapid action taps and unrelated end/cancel events',()=>{
 const f=fixture(false,true);f.native('touchstart',[1],[1]);for(let id=2;id<102;id++){f.native('touchstart',[id],[1,id],'touch-action');assert.equal(f.control.input.x,1);assert.equal(f.control.input.held,true);f.native('touchmove',[1],[1,id]);assert.equal(f.control.input.held,true);f.native('touchend',[id],[1],'touch-action');assert.equal(f.control.input.x,1);assert.equal(f.control.input.held,false);}f.native('touchcancel',[999],[1]);assert.equal(f.control.input.x,1);f.native('touchend',[1],[]);assert.equal(f.control.input.x,0);
});
test('only the intended native touch adapter differs from sound-approved baseline',()=>{const m=JSON.parse(readFileSync(new URL('../docs/iphone-multitouch-preservation.json',import.meta.url),'utf8'));for(const[path,hash]of Object.entries(m.protected))assert.equal(requireHash(readFileSync(new URL(`../${path}`,import.meta.url))),hash,path);});

test('reproduces pre-fix native one-thumb cancellation clearing the other active control',()=>{const before=fixture('native-before',true);before.native('touchstart',[11],[11]);before.native('touchstart',[22],[11,22],'touch-action');assert.equal(before.control.input.x,1);assert.equal(before.control.input.held,true);before.native('touchcancel',[22],[11]);assert.equal(before.control.input.x,0,'baseline incorrectly cleared the uncanceled movement thumb');assert.equal(before.control.input.held,false);const after=fixture(false,true);after.native('touchstart',[11],[11]);after.native('touchstart',[22],[11,22],'touch-action');after.native('touchcancel',[22],[11]);assert.equal(after.control.input.x,1);assert.equal(after.control.input.held,false);});
