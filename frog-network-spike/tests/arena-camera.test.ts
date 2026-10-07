import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {ArenaCamera,CAMERA} from '../src/presentation/arena-camera';import {m10PreservedSource} from './preserved-source';
const cluster=[{x:17,y:11},{x:23,y:12}];
test('static fallback exactly restores the original frame; invalid points are safe',()=>{
 const c=new ArenaCamera(40,22.5);for(let i=0;i<300;i++)c.update(cluster,1000/60,false);
 assert.ok(c.frame.zoom>1.2);assert.deepEqual(c.update(cluster,16,false,false),{x:20,y:11.25,zoom:1,targetZoom:1,fitZoom:1});
 assert.equal(c.update([{x:NaN,y:0},{x:20,y:Infinity}],16,false).zoom,1);
});
test('clustered frogs gently close in; mobile and desktop respect distinct limits',()=>{
 for(const mobile of[false,true]){const c=new ArenaCamera(40,22.5);for(let i=0;i<20;i++)assert.equal(c.update(cluster,16,mobile).zoom,1);
  for(let i=0;i<600;i++)c.update(cluster,16,mobile);const cap=mobile?CAMERA.mobileMaxZoom:CAMERA.desktopMaxZoom;assert.ok(Math.abs(c.frame.zoom-cap)<.003);assert.ok(c.frame.zoom<=cap);
 }
});
test('2/4/6/8-player moving envelopes stay visible and bounded, including abrupt recovery',()=>{
 for(const count of[2,4,6,8])for(const mobile of[false,true]){
  const c=new ArenaCamera(40,22.5);for(let i=0;i<600;i++){
   const spread=(1-Math.cos(i/65))/2,pts=Array.from({length:count},(_,j)=>({x:1+38*(.5+(j/(count-1)-.5)*spread),y:1+20*(.5+(j%2?1:-1)*spread/2),vx:Math.sin(i/65)*5,vy:0}));
   const f=c.update(pts,16,mobile),hw=20/f.zoom,hh=11.25/f.zoom;assert.ok(f.zoom>=1&&f.zoom<=(mobile?1.18:1.28));assert.ok(f.x-hw>=-1e-8&&f.x+hw<=40+1e-8);assert.ok(f.y-hh>=-1e-8&&f.y+hh<=22.5+1e-8);
   for(const p of pts){assert.ok(p.x>=f.x-hw-1e-8&&p.x<=f.x+hw+1e-8);assert.ok(p.y>=f.y-hh-1e-8&&p.y<=f.y+hh+1e-8);}
  }
  assert.equal(c.update([{x:0,y:0},{x:40,y:22.5}],16,mobile).zoom,1);
 }
});
test('normal motion is damped; tiny clustering jitter does not pump the camera',()=>{
 const c=new ArenaCamera(40,22.5);for(let i=0;i<1200;i++)c.update(cluster,16,false);const initial=c.frame.zoom;
 for(let i=0;i<300;i++){const before={...c.frame};const f=c.update(cluster.map(p=>({...p,x:p.x+Math.sin(i)*.04})),16,false);assert.ok(Math.abs(f.zoom-before.zoom)<.003);assert.ok(Math.abs(f.x-before.x)<.05);}
 assert.ok(Math.abs(c.frame.zoom-initial)<.004);
});
test('M10 preserves physically accepted input/viewport and all gameplay sources exactly',()=>{
 const m=JSON.parse(readFileSync(new URL('../docs/milestone-10-preservation.json',import.meta.url),'utf8'));const hash=(s:string|Buffer)=>createHash('sha256').update(s).digest('hex');
 for(const[p,h]of Object.entries(m.protected))assert.equal(hash(readFileSync(new URL(`../${p}`,import.meta.url))),h,p);
 assert.equal(hash(m10PreservedSource('src/main.ts')),m.files['src/main.ts'].sha256);
});
