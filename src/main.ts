import Phaser from 'phaser';
import {Circle} from 'planck';
import {Simulation} from './simulation/world';
import {defaults,arena,DT,WIDTH,HEIGHT} from './simulation/config';
const sim=new Simulation();
let accumulator=0,dropped=0;
const tuning=document.querySelector('#tuning')!;
for(const [key,value] of Object.entries(defaults)){
 const label=document.createElement('label');label.textContent=key+' ';
 const input=document.createElement('input');input.type='number';input.value=String(value);input.step=key.includes('Iterations')?'1':'0.05';input.min=key.includes('Iterations')?'1':'0';
 input.addEventListener('change',()=>{const n=Number(input.value);if(!Number.isFinite(n)||(n<0 || (n===0 && !['airAcceleration','friction','restitution','chargeThreshold','coyoteSeconds','jumpBufferSeconds','grapplePullAcceleration','grappleTakeupSpeed','chargeHorizontalImpulse'].includes(key)))){input.value=String(sim.tuning[key as keyof typeof defaults]);return;}
 const k=key as keyof typeof defaults;sim.tuning[k]=k.includes('Iterations')?Math.max(1,Math.round(n)):n;
 for(const f of sim.frogs){const fixture=f.body.getFixtureList()!;if(k==='friction'){fixture.setFriction(n);for(let e=f.body.getContactList();e;e=e.next)e.contact.resetFriction();}if(k==='restitution'){fixture.setRestitution(n);for(let e=f.body.getContactList();e;e=e.next)e.contact.resetRestitution();}if(k==='frogRadius'||k==='frogMass'){f.body.destroyFixture(fixture);f.body.createFixture(Circle(sim.tuning.frogRadius),{density:sim.tuning.frogMass/(Math.PI*sim.tuning.frogRadius**2),friction:sim.tuning.friction,restitution:sim.tuning.restitution});}}
 if(k==='frogRadius'||k==='frogMass')sim.reset();
 });label.append(input);tuning.append(label);
}
const down=new Set<string>();
const controls=[{left:'KeyA',right:'KeyD',up:'KeyW',down:'KeyS',action:'Space'}, {left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',action:'Enter'}];
const used=new Set(controls.flatMap(c=>Object.values(c)));
function sample(){controls.forEach((c,i)=>sim.setInput(i,{x:Number(down.has(c.right))-Number(down.has(c.left)),y:Number(down.has(c.down))-Number(down.has(c.up)),held:down.has(c.action)}));}
function reset(){down.clear();sim.reset();accumulator=0;}
window.addEventListener('keydown',e=>{if((e.target as HTMLElement).tagName==='INPUT')return;if(used.has(e.code)){e.preventDefault();down.add(e.code);sample();}if(e.code==='KeyR'&&!e.repeat)reset();});
window.addEventListener('keyup',e=>{if(used.has(e.code)){e.preventDefault();down.delete(e.code);sample();}});
window.addEventListener('blur',()=>{down.clear();sim.clearInputs();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){down.clear();sim.clearInputs();accumulator=0;}});
document.querySelector('#reset')!.addEventListener('click',reset);
class Spike extends Phaser.Scene{
 graphics!:Phaser.GameObjects.Graphics;labels:Phaser.GameObjects.Text[]=[];
 create(){this.graphics=this.add.graphics();for(let i=0;i<2;i++)this.labels.push(this.add.text(0,0,`P${i+1}`,{fontSize:'18px',color:i?'#ffbd69':'#7bffb5'}).setOrigin(.5,1));}
 update(_time:number,delta:number){if(document.hidden)return;accumulator+=Math.min(delta/1000,.1);let steps=0;while(accumulator>=DT&&steps<6){sim.step();accumulator-=DT;steps++;}if(accumulator>=DT){dropped++;accumulator=0;}
 const s=30,g=this.graphics;g.clear();g.fillStyle(0x283544);for(const r of arena)g.fillRect((r.x-r.w/2)*s,(r.y-r.h/2)*s,r.w*s,r.h*s);
 for(let i=0;i<2;i++){const f=sim.frogs[i],p=f.body.getPosition(),color=i?0xffbd69:0x7bffb5;
 if(f.tongue){g.lineStyle(3,0xff7baf,1);g.lineBetween(p.x*s,p.y*s,f.tongue.tip.x*s,f.tongue.tip.y*s);g.fillStyle(0xff7baf);g.fillCircle(f.tongue.tip.x*s,f.tongue.tip.y*s,4);}
 g.fillStyle(color);g.fillCircle(p.x*s,p.y*s,sim.tuning.frogRadius*s);g.fillStyle(0x111111);g.fillCircle((p.x+f.facing*.2)*s,(p.y-.12)*s,3);
 if(f.charging){g.lineStyle(3,0xffffff);g.strokeCircle(p.x*s,p.y*s,(sim.tuning.frogRadius+.15+f.charge/sim.tuning.chargeSeconds*.3)*s);}
 this.labels[i].setPosition(p.x*s,(p.y-sim.tuning.frogRadius-.15)*s);
 }
 document.querySelector('#status')!.textContent=sim.frogs.map((f,i)=>{const v=f.body.getLinearVelocity();let rope='';if(f.tongue?.phase==='attached'){const p=f.body.getPosition();const d=Math.hypot(p.x-f.tongue.tip.x,p.y-f.tongue.tip.y);rope=` L=${f.tongue.length.toFixed(2)} d=${d.toFixed(2)} ${d<f.tongue.length-.05?'SLACK':'TAUT'}`;}return `P${i+1}: ${f.grounded?'ground':'air'} v=(${v.x.toFixed(1)},${v.y.toFixed(1)}) charge=${f.charge.toFixed(2)} ${f.charging?'CHARGING':f.jumpPending?'tap/hold':''} ${f.bufferedRelease?'BUFFERED':''} tongue=${f.tongue?.phase??'none'}${rope}`;}).join(' | ')+` | catch-up drops=${dropped}`;
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'game',width:WIDTH*30,height:HEIGHT*30,backgroundColor:'#161b22',fps:{smoothStep:false},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Spike});
