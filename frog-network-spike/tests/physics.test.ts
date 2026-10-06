import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Vec2} from 'planck';
import {Simulation} from '../src/simulation/world';
const steps=(s:Simulation,n:number)=>{for(let i=0;i<n;i++)s.step();};
const input=(s:Simulation,i:number,x=0,y=0,held=false)=>s.setInput(i,{x,y,held});
test('ground contact, basic jump, charge launch and directional boost',()=>{
 const jump=(n:number,x:number)=>{const s=new Simulation();steps(s,90);assert.equal(s.frogs[0].grounded,true);input(s,0,x,0,true);steps(s,n);input(s,0,x,0,false);s.step();return s.frogs[0].body.getLinearVelocity();};
 const tap=jump(1,0),charged=jump(60,1);assert.ok(tap.y < -8);assert.ok(charged.y < tap.y-5);assert.ok(charged.x > 7);
});
test('a tap queued between steps is not lost; held action never repeats',()=>{const s=new Simulation();steps(s,90);input(s,0,0,0,true);input(s,0,0,0,false);s.step();assert.ok(s.frogs[0].body.getLinearVelocity().y < -8);assert.equal(s.frogs[0].tongue,undefined);});
test('eight committed shot directions and facing fallback',()=>{for(const [x,y] of [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]){const s=new Simulation();const f=s.frogs[0];f.body.setTransform(Vec2(12,9),0);input(s,0,x,y,true);s.step();assert.ok(f.tongue);const d={...f.tongue!.direction};assert.ok(Math.abs(Math.hypot(d.x,d.y)-1)<1e-9);input(s,0,-x,-y,true);s.step();assert.deepEqual(f.tongue!.direction,d);}const s=new Simulation();s.frogs[0].body.setTransform(Vec2(12,9),0);input(s,0,0,0,true);s.step();assert.equal(s.frogs[0].tongue!.direction.x,1);});
test('terrain rope is unilateral, bounds extension, and release preserves velocity',()=>{
 const s=new Simulation();const f=s.frogs[0];f.body.setTransform(Vec2(16,11),0);input(s,0,0,-1,true);steps(s,9);assert.equal(f.tongue?.phase,'attached');const tongue=f.tongue!,L=tongue.length;
 const anchor=tongue.target!.getWorldPoint(Vec2(tongue.localAnchor!.x,tongue.localAnchor!.y));f.body.setTransform(Vec2(anchor.x,anchor.y+L*.5),0);f.body.setLinearVelocity(Vec2(0,0));s.step();assert.ok(Vec2.distance(f.body.getPosition(),anchor)<L*.7,'rope must allow slack');
 input(s,0,1,0,true);let maximum=0;for(let i=0;i<600;i++){s.step();maximum=Math.max(maximum,Vec2.distance(f.body.getPosition(),anchor));assert.ok(Number.isFinite(f.body.getPosition().x));}assert.ok(maximum<=L+.08,`extension ${maximum-L}`);
 const v=f.body.getLinearVelocity().clone();s.detach(f);assert.deepEqual(f.body.getLinearVelocity(),v);assert.equal(f.tongue,undefined);
});
test('frog attachment moves both bodies and keeps collisions enabled',()=>{const s=new Simulation();const [a,b]=s.frogs;a.body.setTransform(Vec2(12,9),0);b.body.setTransform(Vec2(15,9),0);input(s,0,1,0,true);steps(s,6);assert.equal(a.tongue?.phase,'attached');assert.equal(a.tongue?.target,b.body);assert.equal(a.tongue?.joint?.getCollideConnected(),true);a.body.setLinearVelocity(Vec2(-8,0));steps(s,20);assert.ok(b.body.getLinearVelocity().x < -1);});
test('body collisions prevent overlap and transfer momentum',()=>{const s=new Simulation();const [a,b]=s.frogs;a.body.setTransform(Vec2(12,9),0);b.body.setTransform(Vec2(13,9),0);a.body.setLinearVelocity(Vec2(8,0));steps(s,5);assert.ok(b.body.getLinearVelocity().x>1);assert.ok(Vec2.distance(a.body.getPosition(),b.body.getPosition())>s.tuning.frogRadius*1.9);});
test('range miss retracts; focus loss clears all actions and attachments',()=>{const s=new Simulation({...new Simulation().tuning,tongueRange:1});s.frogs[0].body.setTransform(Vec2(12,9),0);input(s,0,1,0,true);steps(s,20);assert.equal(s.frogs[0].tongue,undefined);s.clearInputs();assert.equal(s.frogs[0].held,false);assert.equal(s.frogs[0].input.x,0);});
test('air control adds acceleration without erasing carried momentum',()=>{const s=new Simulation();const f=s.frogs[0];f.body.setTransform(Vec2(12,9),0);f.body.setLinearVelocity(Vec2(10,-2));input(s,0,1,0,false);s.step();assert.ok(f.body.getLinearVelocity().x>10);input(s,0,0,0,false);const v=f.body.getLinearVelocity().x;s.step();assert.equal(f.body.getLinearVelocity().x,v);});
test('all taps below charge threshold have exactly the same launch speed',()=>{
 const tap=(n:number)=>{const s=new Simulation();steps(s,90);input(s,0,0,0,true);steps(s,n);assert.equal(s.frogs[0].charging,false);input(s,0,0,0,false);s.step();return s.frogs[0].body.getLinearVelocity().y;};
 assert.ok(Math.abs(tap(1)-tap(7))<1e-8);
});
test('deliberate hold crosses charge threshold and full charge produces stronger launch',()=>{
 const s=new Simulation();steps(s,90);input(s,0,0,0,true);steps(s,8);assert.equal(s.frogs[0].charging,false);steps(s,2);assert.equal(s.frogs[0].charging,true);steps(s,50);assert.equal(s.frogs[0].charge,s.tuning.chargeSeconds);input(s,0,0,0,false);s.step();assert.ok(s.frogs[0].body.getLinearVelocity().y < -16);
});
test('tap immediately before landing buffers once and launches on the contact step',()=>{
 const s=new Simulation();const f=s.frogs[0];f.body.setTransform(Vec2(12,16.4),0);f.body.setLinearVelocity(Vec2(0,4));input(s,0,0,0,true);input(s,0,0,0,false);
 let jumped=false;for(let i=0;i<6;i++){s.step();assert.equal(f.tongue,undefined);if(f.body.getLinearVelocity().y < -9){jumped=true;assert.equal(f.bufferedRelease,undefined);break;}}assert.ok(jumped);steps(s,4);assert.ok(f.body.getLinearVelocity().y<0);assert.equal(f.jumpPending,false);
});
test('held prelanding press begins charge on ground, not an automatic jump/tongue',()=>{
 const s=new Simulation();const f=s.frogs[0];f.body.setTransform(Vec2(12,16.4),0);f.body.setLinearVelocity(Vec2(0,4));input(s,0,0,0,true);steps(s,14);assert.equal(f.grounded,true);assert.equal(f.charging,true);assert.equal(f.tongue,undefined);input(s,0,0,0,false);s.step();assert.ok(f.body.getLinearVelocity().y < -9);
});
test('landing permits immediate next tap; old support does not allow a second airborne jump',()=>{
 const s=new Simulation();steps(s,90);input(s,0,0,0,true);input(s,0,0,0,false);s.step();input(s,0,0,-1,true);s.step();assert.equal(s.frogs[0].jumpPending,false);assert.ok(s.frogs[0].tongue);input(s,0,0,0,false);s.step();let landed=false;for(let i=0;i<180;i++){s.step();if(s.frogs[0].grounded){landed=true;break;}}assert.ok(landed);input(s,0,0,0,true);input(s,0,0,0,false);s.step();assert.ok(s.frogs[0].body.getLinearVelocity().y < -9);
});
test('terrain grapple pulls from rest and takes up slack; radial ceiling never clamps tangential momentum',()=>{
 const s=new Simulation();const f=s.frogs[0];f.body.setTransform(Vec2(16,11),0);input(s,0,0,-1,true);steps(s,9);assert.equal(f.tongue?.phase,'attached');const L=f.tongue!.length;f.body.setLinearVelocity(Vec2(0,0));steps(s,12);assert.ok(f.body.getLinearVelocity().y < -3);assert.ok(f.tongue!.length < L);const p=f.body.getPosition();const a=f.tongue!.tip;const dx=a.x-p.x,dy=a.y-p.y,d=Math.hypot(dx,dy);f.body.setLinearVelocity(Vec2(-dy/d*12,dx/d*12));const before=f.body.getLinearVelocity().clone();s.pullGrapple(f);const after=f.body.getLinearVelocity();assert.ok(Math.abs((after.x-before.x)*(-dy/d)+(after.y-before.y)*(dx/d))<1e-8);
});
test('active two-frog pull preserves horizontal system momentum and reduces separation from rest',()=>{
 const s=new Simulation();const [a,b]=s.frogs;a.body.setTransform(Vec2(12,9),0);b.body.setTransform(Vec2(16,9),0);input(s,0,1,0,true);steps(s,8);assert.equal(a.tongue?.target,b.body);input(s,0,0,0,true);a.body.setLinearVelocity(Vec2(0,0));b.body.setLinearVelocity(Vec2(0,0));const distance=Vec2.distance(a.body.getPosition(),b.body.getPosition());s.pullGrapple(a);assert.ok(a.body.getLinearVelocity().x>0);assert.ok(b.body.getLinearVelocity().x<0);assert.ok(Math.abs(a.body.getMass()*a.body.getLinearVelocity().x+b.body.getMass()*b.body.getLinearVelocity().x)<1e-8);steps(s,8);assert.ok(Vec2.distance(a.body.getPosition(),b.body.getPosition())<distance-.2);
});
test('coyote tap succeeds just after losing support and expires promptly',()=>{
 const s=new Simulation();steps(s,90);const f=s.frogs[0];f.body.setTransform(Vec2(12,14),0);steps(s,2);assert.equal(f.grounded,false);assert.ok(f.coyote>0);input(s,0,0,0,true);input(s,0,0,0,false);s.step();assert.ok(f.body.getLinearVelocity().y < -9);
 const expired=new Simulation();steps(expired,90);expired.frogs[0].body.setTransform(Vec2(12,14),0);steps(expired,6);input(expired,0,0,-1,true);expired.step();assert.equal(expired.frogs[0].jumpPending,false);assert.ok(expired.frogs[0].tongue);
});
test('two-frog grapple remains finite and bounded through repeated pulls and collisions',()=>{
 const s=new Simulation();let resets=0;const reset=s.reset.bind(s);s.reset=()=>{resets++;reset();};const [a,b]=s.frogs;a.body.setTransform(Vec2(12,9),0);b.body.setTransform(Vec2(16,9),0);input(s,0,1,0,true);steps(s,8);assert.ok(a.tongue?.joint);input(s,0,0,0,true);
 for(let i=0;i<3600;i++){s.step();for(const f of s.frogs){const p=f.body.getPosition(),v=f.body.getLinearVelocity();assert.ok(Number.isFinite(p.x+p.y+v.x+v.y));assert.ok(Math.hypot(v.x,v.y)<80);}assert.equal(a.tongue?.phase,'attached');}assert.equal(resets,0);
});
