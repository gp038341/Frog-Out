import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
function fixture(original=false){
 const elements=new Map<string,any>();const listeners=new Map<string,Function[]>();let failCapture=false,failRelease=false,changed=0;
 function target(){return {style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(t:string,f:Function){listeners.set(t+this.id,[...(listeners.get(t+this.id)||[]),f]);},setAttribute(){},getBoundingClientRect(){return {left:0,top:0,width:100,height:100};},setPointerCapture(){if(failCapture)throw Error('capture interrupted');},hasPointerCapture(){return true;},releasePointerCapture(){if(failRelease)throw Error('release interrupted');},id:''};}
 const doc={hidden:false,body:target(),activeElement:{blur(){}},getElementById(id:string){if(!elements.has(id)){const e=target();e.id=id;elements.set(id,e);}return elements.get(id);},addEventListener(t:string,f:Function){listeners.set(t+'document',[...(listeners.get(t+'document')||[]),f]);}};
 const win={addEventListener(t:string,f:Function){listeners.set(t+'window',[...(listeners.get(t+'window')||[]),f]);},dispatchEvent(){}};
 const source=original?execFileSync('git',['show','6de0286:frog-network-spike/src/input/touch.ts'],{encoding:'utf8'}):readFileSync(new URL('../src/input/touch.ts',import.meta.url),'utf8');
 const js=ts.transpile(source.replace(/import type[^;]+;/,'').replace('export function','function').replace('export class','class')+'\nglobalThis.Controls=TouchControls;',{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None});const context:any={document:doc,window:win,location:{search:'?touch=1'},URLSearchParams,matchMedia:()=>({matches:true}),navigator:{maxTouchPoints:5},innerWidth:844,innerHeight:390,Event:class{},Date,Math};runInNewContext(js,context);const control=new context.Controls(()=>changed++,()=>{});control.update(true,true,true,false,false);
 return {control,context,get changed(){return changed;},fail(c:boolean,r=false){failCapture=c;failRelease=r;},fire(t:string,id:number,target='direction-pad'){for(const f of listeners.get(t+target)||[])f({pointerId:id,clientX:85,clientY:50,preventDefault(){}});},docFire(t:string,id:number){for(const f of listeners.get(t+'document')||[])f({pointerId:id,clientX:85,clientY:50,preventDefault(){}});},resize(){for(const f of listeners.get('resizewindow')||[])f();}};
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
