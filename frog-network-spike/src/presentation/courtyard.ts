import Phaser from 'phaser';
import {arena,WIDTH,HEIGHT,defaults} from '../simulation/config';
import type {FrogState} from '../simulation/state';
import type {OutbreakView,OutbreakPlayer} from '../game/outbreak';
import {FROG_COLORS} from './identity';
import {GameAudio} from './audio';
const S=30,INK=0x142f35;
type Point={x:number;y:number};
type Pop={x:number;y:number;age:number;life:number;color:number;kind:'jump'|'charge'|'attach'|'infect'|'bump'};
type Before={vy:number;vx:number;grounded:boolean;charging:boolean;tongue?:string;state?:string;x:number;y:number};
/** Presentation consumes render positions only. It never writes a physics body or gameplay input. */
export class Courtyard {
 background:Phaser.GameObjects.Graphics;ink:Phaser.GameObjects.Graphics;effects:Phaser.GameObjects.Graphics;
 labels:Phaser.GameObjects.Text[]=[];previous:Before[]=[];pops:Pop[]=[];reactions=Array(8).fill(0);round=-1;labelSize=0;
 constructor(private scene:Phaser.Scene,private audio:GameAudio){
  this.background=scene.add.graphics().setDepth(0);this.ink=scene.add.graphics().setDepth(1);this.effects=scene.add.graphics().setDepth(2);
  for(let i=0;i<8;i++)this.labels.push(scene.add.text(0,0,'',{fontFamily:'Trebuchet MS, sans-serif',fontSize:'19px',fontStyle:'bold',color:'#fff8d9',stroke:'#142f35',strokeThickness:5,align:'center',lineSpacing:0}).setOrigin(.5,1).setDepth(4));
  this.paintArena();
 }
 paintArena(){const g=this.background;g.clear();g.fillStyle(0x183f48);g.fillRect(0,0,WIDTH*S,HEIGHT*S);
  // Quiet pond colors and foliage sit behind the high-contrast physical surfaces.
  g.fillStyle(0x225862,.6);g.fillEllipse(20*S,21*S,42*S,18*S);g.fillStyle(0x2b6970,.35);g.fillEllipse(20*S,23*S,40*S,10*S);
  for(let i=0;i<14;i++){const x=(i*87+31)%(WIDTH*S),y=75+(i*43)%430;g.fillStyle(0x3a7477,.16);g.fillEllipse(x,y,50+(i%3)*20,12);}
  g.lineStyle(2,0x4f8c83,.14);for(let y=11;y<22;y+=2)g.lineBetween(0,y*S,WIDTH*S,y*S);
  // Silhouettes never mimic a solid ledge.
  for(const x of [26,WIDTH*S-27]){g.lineStyle(9,0x2b605c,.75);g.lineBetween(x,30,x,HEIGHT*S);for(let j=0;j<8;j++){g.fillStyle(0x34726a,.65);g.fillEllipse(x+(j%2?18:-18),55+j*79,46,19);}}
  arena.forEach((r,i)=>{const x=(r.x-r.w/2)*S,y=(r.y-r.h/2)*S,w=r.w*S,h=r.h*S;
   g.fillStyle(INK);g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle(i<4?0x54796a:0x997958);g.fillRect(x,y,w,h);
   g.fillStyle(i<4?0x77a777:0xcba570);g.fillRect(x,y,w,Math.min(5,h));g.lineStyle(2,0x66523f);if(i>=4){g.lineBetween(x+3,y+h-3,x+w-3,y+h-3);for(let bx=x+12;bx<x+w-3;bx+=45){g.lineBetween(bx,y+6,bx+12,y+6);}}
   // Pale moss/grip edge traces the exact top of every platform; underside is also grappleable.
   g.lineStyle(3,0xc8e49a);g.lineBetween(x,y,x+w,y);
   if(i>=4){g.fillStyle(0x6d9d72);for(let bx=x+4;bx<x+w-4;bx+=20)g.fillTriangle(bx,y+1,bx+7,y+1,bx+3,y-3);g.fillStyle(0xeac582);g.fillCircle(x+6,y+h/2,2);g.fillCircle(x+w-6,y+h/2,2);}
  });
  g.fillStyle(0x30564b);for(let i=0;i<26;i++){const x=17+i*46;g.fillEllipse(x,HEIGHT*S-9,23,8);}
 }
 clear(){this.ink.clear();this.effects.clear();this.labels.forEach(l=>l.setVisible(false));this.previous=[];this.pops=[];}
 pop(x:number,y:number,color:number,kind:Pop['kind']){if(this.pops.length<64)this.pops.push({x:x*S,y:y*S,age:0,life:kind==='infect'?650:360,color,kind});}
 render(states:FrogState[],positions:Point[],view:OutbreakView|undefined,connected:boolean[],names:string[],local:number,delta:number){
  if(view?.round!==this.round){this.round=view?.round??-1;this.previous=[];this.pops=[];}
  const g=this.ink;g.clear();this.effects.clear();const time=performance.now()/1000;
  const ratio=this.scene.scale.width/Math.max(1,this.scene.scale.displaySize.width);const labelSize=Math.ceil(Math.min(28,Math.max(18,10*ratio)));
  if(labelSize!==this.labelSize){this.labelSize=labelSize;this.labels.forEach(l=>l.setFontSize(labelSize));}
  // Tongues behind bodies, with a sag only when physical rope length permits slack.
  states.forEach((f,i)=>{const t=f.tongue,p=positions[i];if(!t||!p)return;let tip=t.tip;if(t.phase==='attached'&&t.target&&'frog'in t.target&&t.localAnchor){const target=positions[t.target.frog];if(target)tip={x:target.x+t.localAnchor.x,y:target.y+t.localAnchor.y};}
   const distance=Math.hypot(tip.x-p.x,tip.y-p.y),slack=t.phase==='attached'?Math.min(1.2,Math.max(0,t.length-distance)*.6):0;
   const ax=p.x*S,ay=p.y*S,bx=tip.x*S,by=tip.y*S;const curve=new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(ax,ay),new Phaser.Math.Vector2((ax+bx)/2,(ay+by)/2+slack*S),new Phaser.Math.Vector2(bx,by));const points=curve.getPoints(12);
   g.lineStyle(7,INK);g.strokePoints(points);g.lineStyle(4,0xff9baf);g.strokePoints(points);g.fillStyle(0xffc4ce);g.fillCircle(bx,by,4);g.lineStyle(2,INK);g.strokeCircle(bx,by,4);
   if(t.phase==='attached'&&distance>t.length-.3){g.lineStyle(1.5,0xffd6df,.8);g.strokeCircle(bx,by,7+Math.sin(time*13)*1.2);}
  });
  states.forEach((f,i)=>{
   const p=positions[i];if(!p)return;const infection=view?.players[i],before=this.previous[i],color=FROG_COLORS[i];const state=infection?.state;
   if(before){
    if(before.grounded&&!f.grounded&&f.vy< -5){const charged=before.charging;this.pop(p.x,p.y+.3,charged?0xffe79b:color,charged?'charge':'jump');if(i===local)this.audio.play(charged?'charge':'jump');}
    if(f.tongue?.phase==='flying'&&!before.tongue&&i===local)this.audio.play('fire');
    if(f.tongue?.phase==='attached'&&before.tongue!=='attached'){this.pop(f.tongue.tip.x,f.tongue.tip.y,0xffbbc9,'attach');if(i===local)this.audio.play('attach');}
    if(state==='transforming'&&before.state==='healthy'){this.pop(p.x,p.y,0xe9baff,'infect');this.audio.play('infect');this.reactions[i]=180;}
    // React only to velocity changes in a physical body-contact neighborhood, not ordinary control acceleration.
    const bump=states.some((other,j)=>i!==j&&Math.hypot(other.x-f.x,other.y-f.y)<defaults.frogRadius*2+.15);
    if(bump&&Math.hypot(f.vx-before.vx,f.vy-before.vy)>3.5&&this.reactions[i]<=0){this.reactions[i]=130;this.pop(p.x,p.y,color,'bump');}
   }
   this.reactions[i]=Math.max(0,this.reactions[i]-delta);this.frog(g,p.x*S,p.y*S,f,i,infection,connected[i]!==false,i===local,time);
   const status=connected[i]===false?'OFFLINE':infection?.state==='transforming'?'GRACE · 1s':infection?.state==='infectious'?(infection.patientZero?'☠ ZERO':'☠ POISON'):view?.phase==='playing'&&view.players.filter(v=>v.state==='healthy').length===1?'LAST HEALTHY':'HEALTHY';
   const label=this.labels[i];
   label.setVisible(true).setText(`${i===local?'▾ ':''}${names[i]}\n${status}`).setPosition(p.x*S,Math.max(42,(p.y-defaults.frogRadius-.3)*S)).setColor(connected[i]===false?'#b2c7c2':state==='transforming'?'#ffe5a3':state==='infectious'?'#eccbff':'#fff8d9');
   this.previous[i]={vy:f.vy,vx:f.vx,grounded:f.grounded,charging:f.charging,tongue:f.tongue?.phase,state,x:f.x,y:f.y};
  });
  this.labels.forEach((l,i)=>{if(i>=states.length)l.setVisible(false);});
  this.pops=this.pops.filter(p=>{p.age+=Math.min(delta,50);if(p.age>=p.life)return false;const q=p.age/p.life,e=this.effects;e.lineStyle(2,p.color,1-q);const radius=(p.kind==='infect'?18:8)+q*(p.kind==='infect'?36:22);e.strokeCircle(p.x,p.y,radius);for(let j=0;j<6;j++){const a=j*Math.PI/3;e.fillStyle(p.color,1-q);e.fillCircle(p.x+Math.cos(a)*radius,p.y+Math.sin(a)*radius,2.5*(1-q)+.5);}return true;});
 }
 frog(g:Phaser.GameObjects.Graphics,x:number,y:number,f:FrogState,slot:number,infection:OutbreakPlayer|undefined,online:boolean,local:boolean,time:number){
  const charging=f.charging,q=Math.min(1,f.charge/defaults.chargeSeconds),poison=infection?.state==='infectious',grace=infection?.state==='transforming';
  const squish=charging ? .8-.12*q : this.reactions[slot]>0 ? .84 : 1;
  const sy=f.grounded?squish:Math.min(1.14,1+Math.abs(f.vy)*.006),sx=f.grounded?1+(1-sy)*.6:1/Math.sqrt(sy);
  const bob=f.grounded&&!charging?Math.sin(time*15)*Math.min(1.2,Math.abs(f.vx)*.18):0;const r=defaults.frogRadius*S,bodyColor=FROG_COLORS[slot];y+=bob;
  g.fillStyle(INK,.35);g.fillEllipse(x,y+r*.95,r*2.7,6);
  if(local){g.lineStyle(2,0xfff4ba,.7);g.strokeEllipse(x,y,r*2.6,r*2.5);}
  if(grace){g.lineStyle(3,0xffe09b);const rr=r+7+Math.sin(time*14)*2;for(let j=0;j<4;j++)g.lineBetween(x+Math.cos(time+j*Math.PI/2)*rr,y+Math.sin(time+j*Math.PI/2)*rr,x+Math.cos(time+j*Math.PI/2)*(rr+5),y+Math.sin(time+j*Math.PI/2)*(rr+5));}
  // Distinct poisoned outline + X cheeks + bubble spores; slot body color always survives.
  if(poison){g.lineStyle(3,0xcf9ff5);g.strokeCircle(x,y,r+5);for(let j=0;j<3;j++){const a=time*1.4+j*2.1;g.fillStyle(0xcf9ff5,.7);g.fillCircle(x+Math.cos(a)*(r+8),y+Math.sin(a)*(r+8),2.4);}}
  const feet=charging?0:Math.sin(time*16)*Math.min(3,Math.abs(f.vx)*.6);g.fillStyle(INK);g.fillEllipse(x-r*.78,y+r*.68,r*1.12,10);g.fillEllipse(x+r*.78,y+r*.68,r*1.12,10);g.fillStyle(bodyColor);g.fillEllipse(x-r*.78,y+r*.65+feet,r*.88,6);g.fillEllipse(x+r*.78,y+r*.65-feet,r*.88,6);
  g.fillStyle(INK);g.fillEllipse(x,y,r*2.18*sx,r*2.07*sy);g.fillStyle(online?bodyColor:0x8caaa3);g.fillEllipse(x,y,r*1.93*sx,r*1.81*sy);
  g.fillStyle(0xfff4bc,.48);g.fillEllipse(x,y+r*.34*sy,r*1.13,r*.65*sy);
  for(const side of [-1,1]){const ex=x+side*r*.57*sx,ey=y-r*.67*sy;g.fillStyle(INK);g.fillCircle(ex,ey,r*.47);g.fillStyle(0xfffbea);g.fillCircle(ex,ey,r*.37);g.fillStyle(INK);g.fillCircle(ex+f.facing*2,ey+(charging?1:-1),charging?3:3.4);}
  g.lineStyle(1.8,INK);g.lineBetween(x-r*.34,y+r*.12,x+r*.34,y+r*.12);if(f.tongue){g.fillStyle(INK);g.fillEllipse(x+f.facing*r*.24,y+r*.14,6,5);}
  // Eight permanent non-color markings, including small headband/diamond/stripe variants.
  g.lineStyle(2,INK);g.fillStyle(INK);const mark=slot%8;
  if(mark===0)g.fillTriangle(x-3,y-3,x+3,y-3,x,y-8);
  if(mark===1||mark===3)for(const d of [-1,1]){g.fillCircle(x+d*r*.65,y+2,mark===1?2:1.4);if(mark===3)g.fillCircle(x+d*r*.48,y+5,1.4);}
  if(mark===2)g.lineBetween(x,y-6,x,y-1);
  if(mark===4){g.lineBetween(x-r*.9,y-r*.94,x-r*.25,y-r*.87);g.lineBetween(x+r*.25,y-r*.87,x+r*.9,y-r*.94);}
  if(mark===5)g.strokePoints([{x,y:y-7},{x:x+3,y:y-4},{x,y:y-1},{x:x-3,y:y-4}],true);
  if(mark===6)g.lineBetween(x-r*.78,y-3,x+r*.78,y-3);
  if(mark===7){g.lineBetween(x-3,y-5,x+3,y-1);g.lineBetween(x+3,y-5,x-3,y-1);}
  if(poison){g.lineStyle(2,INK);for(const d of [-1,1]){const cx=x+d*r*.65;g.lineBetween(cx-2,y,cx+2,y+4);g.lineBetween(cx+2,y,cx-2,y+4);}}
  if(infection?.patientZero){g.fillStyle(0xffe487);g.lineStyle(2,INK);const points=[{x:x-7,y:y-r-7},{x:x-7,y:y-r-14},{x:x-3,y:y-r-10},{x,y:y-r-16},{x:x+3,y:y-r-10},{x:x+7,y:y-r-14},{x:x+7,y:y-r-7}];g.fillPoints(points,true);g.strokePoints(points,true);}
  if(charging){g.lineStyle(3,INK);g.strokeCircle(x,y,r+9);g.lineStyle(3,0xffe29c);g.beginPath();g.arc(x,y,r+9,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(.03,q));g.strokePath();}
 }
}
