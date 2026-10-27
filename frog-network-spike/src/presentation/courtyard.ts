import {paintPrintedArena,PRINT_INK} from './printed-arena';
import {LocalLocator} from './local-locator';
import {ChaosSounds} from './chaos-sounds';
import {paintFrogChaos} from './frog-chaos-art';
import type {ArenaChaosState} from '../chaos/arena-chaos';
import {ARENA_CHAOS} from '../chaos/arena-chaos';
import {paintClassicState} from './classic-art';
import {paintFreezeState} from './freeze-art';
import {appearanceLayers,type Appearance} from './cosmetics';
import {paintFrogCore,hatAnchor,paintHat} from './cosmetic-art';
import {paintBathhouse} from './bathhouse';
import {paintToyshop} from './toyshop';
import {paintSunnyPond} from './sunny-pond';
import {Feel} from './feel';
import {DEFAULT_ARENA,getArena,type ArenaId} from '../simulation/arenas';
import Phaser from 'phaser';
import {arena,WIDTH,HEIGHT,defaults} from '../simulation/config';
import type {FrogState} from '../simulation/state';
import type {OutbreakView,OutbreakPlayer} from '../game/outbreak';
import {FROG_COLORS} from './identity';
import {POISON_ACCENTS,poisonRole} from './poison-identity';
import {TAG_POOF_MS,paintTagPoof} from './tag-poof';
import {GameAudio} from './audio';
const S=30,INK=PRINT_INK;
type Point={x:number;y:number};
type Pop={x:number;y:number;age:number;life:number;color:number;kind:'jump'|'charge'|'attach'|'infect'|'bump'|'swap';strength?:number};
type Before={stickyAttachTick?:number;stickyReleaseTick?:number;pogoTick?:number;gravityFlipTick?:number;gravityWarningSeconds?:number;balloonPopTick?:number;balloonBounceTick?:number;bubblePressTick?:number;bubbleId?:number;bumperTick?:number;balloonInflated?:boolean;swapTick?:number;bubbleEscapeTick?:number;surfaceBounceTick?:number;vy:number;vx:number;grounded:boolean;charging:boolean;tongue?:string;state?:string;x:number;y:number};
/** Presentation consumes render positions only. It never writes a physics body or gameplay input. */
export class Courtyard {
 private chaosSounds:ChaosSounds;private soundArena?:ArenaChaosState;
 private tagPuffs:number[]=[];
 private locator:LocalLocator;
 appearances:(Appearance|undefined)[]=[];
 reserved:boolean[]=[];
 feel:Feel;
 arenaId:ArenaId=DEFAULT_ARENA;
 background:Phaser.GameObjects.Graphics;ink:Phaser.GameObjects.Graphics;effects:Phaser.GameObjects.Graphics;
 labels:Phaser.GameObjects.Text[]=[];previous:Before[]=[];pops:Pop[]=[];reactions=Array(8).fill(0);round=-1;labelSize=0;
 constructor(private scene:Phaser.Scene,private audio:GameAudio){
  this.chaosSounds=new ChaosSounds(audio);this.locator=new LocalLocator(scene);
  this.background=scene.add.graphics().setDepth(0);this.ink=scene.add.graphics().setDepth(1);this.effects=scene.add.graphics().setDepth(2);
  for(let i=0;i<8;i++)this.labels.push(scene.add.text(0,0,'',{fontFamily:'Arial, sans-serif',fontSize:'19px',fontStyle:'bold',color:'#fff8d9',stroke:'#292431',strokeThickness:4,align:'center',lineSpacing:0}).setOrigin(.5,1).setDepth(4));
  this.chaosInk=scene.add.graphics().setDepth(1.5);
  this.windLabel=scene.add.text(WIDTH*S/2,14,'',{fontFamily:'Arial, sans-serif',fontSize:'16px',fontStyle:'bold',color:'#d9faff',stroke:'#142f35',strokeThickness:4}).setOrigin(.5,0).setDepth(4).setVisible(false);
  this.feel=new Feel(scene,audio);
  this.paintArena();
 }
 private windLabel:Phaser.GameObjects.Text;chaosInk:Phaser.GameObjects.Graphics;platformInk=new Map<number,Phaser.GameObjects.Graphics>();platformBits=new Map<number,{ink:Phaser.GameObjects.Graphics;mask:Phaser.GameObjects.Graphics}[]>();private chaosLayout='';
 setArena(id:ArenaId){if(this.arenaId!==id){this.arenaId=id;this.paintArena();this.clear();}}
 paintArena(g:Phaser.GameObjects.Graphics=this.background,options:{background?:boolean;filter?:(index:number)=>boolean}={},definition=getArena(this.arenaId)){paintPrintedArena(g,definition,options);}

 renderChaos(state:ArenaChaosState|undefined){this.soundArena=state;const g=this.chaosInk;g.clear();const layout=state?.platforms.length?this.arenaId+':'+(state.crumbling?'crumble':'tilt')+':'+state.platforms.map(p=>p.id).join(','):'';
  if(layout!==this.chaosLayout){for(const ink of this.platformInk.values())ink.destroy();this.platformInk.clear();for(const bits of this.platformBits.values())for(const b of bits){b.ink.clearMask(true);b.ink.destroy();b.mask.destroy();}this.platformBits.clear();this.chaosLayout=layout;
   if(layout&&state){const covered=new Set(state.platforms.map(p=>p.source));this.paintArena(this.background,{filter:i=>!covered.has(i)});for(const p of state.platforms){const ink=this.scene.add.graphics().setDepth(1);const a=getArena(this.arenaId),solids=a.solids.map(r=>({...r,x:r.x-p.solid.x,y:r.y-p.solid.y}));solids[p.source]={...p.solid,x:0,y:0};this.paintArena(ink,{background:false,filter:i=>i===p.source},{...a,solids});this.platformInk.set(p.id,ink);if(state.crumbling){const bits=[];for(let j=0;j<4;j++){const part=this.scene.add.graphics().setDepth(1);this.paintArena(part,{background:false,filter:i=>i===p.source},{...a,solids});const mask=this.scene.add.graphics().setVisible(false);mask.fillStyle(0xffffff);mask.fillRect(-p.solid.w*S/2+j*p.solid.w*S/4,-p.solid.h*S/2-32,p.solid.w*S/4,p.solid.h*S+64);part.setMask(mask.createGeometryMask());bits.push({ink:part,mask});}this.platformBits.set(p.id,bits);}}}else this.paintArena();
  }
  // Bubbles have no solid shell: their captured frog keeps its real collision core.
  for(const p of state?.platforms??[]){const ink=this.platformInk.get(p.id);if(!ink)continue;ink.setPosition((p.x??p.solid.x)*S,(p.y??p.solid.y)*S).setRotation(p.angle).setVisible(p.stage==='solid').setAlpha(1);
   const bits=this.platformBits.get(p.id)??[],breaking=p.stage==='cracking',fallen=p.stage==='absent',elapsed=fallen?(ARENA_CHAOS.crumbleAbsent-p.clock)/60:0,progress=breaking?1-p.clock/ARENA_CHAOS.crumbleLoad:0;
   bits.forEach((b,j)=>{const visible=breaking||fallen&&elapsed<.6,side=j-1.5,dx=breaking?side*progress*2:side*elapsed*34,dy=breaking?Math.abs(side)*progress*2:elapsed*elapsed*230;const x=(p.x??p.solid.x)*S+dx,y=(p.y??p.solid.y)*S+dy,rotation=p.angle+(fallen?side*elapsed*.5:0);b.ink.setPosition(x,y).setRotation(rotation).setAlpha(fallen?Math.max(0,1-elapsed/.6):1).setVisible(visible);b.mask.setPosition(x,y).setRotation(rotation);});
   if(p.stage==='returning'){g.save();g.translateCanvas((p.x??p.solid.x)*S,(p.y??p.solid.y)*S);g.lineStyle(2,0xa6f4e7,.6);g.strokeRect(-p.solid.w*S/2,-p.solid.h*S/2,p.solid.w*S,p.solid.h*S);g.restore();}
  }
  for(const b of state?.balls??[]){const r=ARENA_CHAOS.ballRadius*S;g.fillStyle(0xef9b87);g.fillCircle(b.x*S,b.y*S,r);g.lineStyle(3,INK);g.strokeCircle(b.x*S,b.y*S,r);g.lineStyle(3,0xffedd0);g.strokeCircle(b.x*S,b.y*S,r*.65);}
  if(state?.ballWarning){g.lineStyle(3,0xffdc88);g.strokeCircle(state.ballWarning.x*S,42,24);g.lineBetween(state.ballWarning.x*S,14,state.ballWarning.x*S,38);g.lineBetween(state.ballWarning.x*S-6,31,state.ballWarning.x*S,38);g.lineBetween(state.ballWarning.x*S+6,31,state.ballWarning.x*S,38);}
  const wind=state?.wind,visible=!!wind?.direction&&wind.stage!=='calm';this.windLabel.setVisible(visible);
  if(visible&&wind){const d=wind.direction,gusting=wind.stage==='gust',arrow=d>0?'→':'←';this.windLabel.setText(gusting?`GUSTING ${d>0?'RIGHT':'LEFT'} ${arrow} · ${Math.ceil(wind.remaining/60)}s`:`WIND ${arrow} IN ${Math.ceil(wind.remaining/60)}s`);
   g.lineStyle(gusting?2.5:2,0xd9faff,gusting?.38:.45);
   if(gusting){const width=WIDTH*S,height=HEIGHT*S,time=this.scene.time.now*.32;for(let i=0;i<28;i++){const x=((i*113+d*time)%width+width)%width,y=80+(i*83)%(height-150),length=32+i%4*9;g.lineBetween(x-d*length,y,x,y);g.lineBetween(x,y,x+d*14,y-4);g.lineBetween(x+d*14,y-4,x+d*24,y-2);}}
   else for(let i=0;i<8;i++){const x=90+i*140,y=55+(i%3)*16;g.lineBetween(x-d*25,y,x+d*25,y);g.lineBetween(x+d*25,y,x+d*14,y-5);g.lineBetween(x+d*25,y,x+d*14,y+5);}
  }
 }
 clear(){this.locator.clear();this.windLabel.setVisible(false);this.chaosSounds.reset();this.tagPuffs=[];this.feel.clear();this.ink.clear();this.effects.clear();this.labels.forEach(l=>l.setVisible(false));this.previous=[];this.pops=[];}
 pop(x:number,y:number,color:number,kind:Pop['kind'],strength=0){if(this.pops.length<64)this.pops.push({x:x*S,y:y*S,age:0,life:kind==='infect'?650:kind==='swap'?450:360,color,kind,strength});}
 render(states:FrogState[],positions:Point[],view:OutbreakView|undefined,connected:boolean[],names:string[],local:number,delta:number,modifiers:readonly string[]=[]){
  this.chaosSounds.update(states,this.soundArena,view,local,modifiers);
  if(view?.round!==this.round){this.round=view?.round??-1;this.previous=[];this.pops=[];}
  const g=this.ink;g.clear();this.effects.clear();const time=performance.now()/1000;
  const ratio=this.scene.scale.width/Math.max(1,this.scene.scale.displaySize.width);const labelSize=Math.ceil(Math.min(28,Math.max(15,10*ratio)));
  if(labelSize!==this.labelSize){this.labelSize=labelSize;this.labels.forEach(l=>l.setFontSize(labelSize));}
  for(const b of states[0]?.chaosBubbles??[]){if(b.slot!==undefined)continue;const x=b.x*S,y=b.y*S;g.fillStyle(0xc8f8ff,.10);g.fillCircle(x,y,20);g.lineStyle(2,INK,.7);g.strokeCircle(x,y,21);g.lineStyle(2,0xc9f7ff);g.strokeCircle(x,y,20);g.fillStyle(0xffffff,.8);g.fillEllipse(x-8,y-8,4,7);}
  // Tongues behind bodies, with a sag only when physical rope length permits slack.
  states.forEach((f,i)=>{const t=f.tongue,p=positions[i];if(f.active===false||!t||!p)return;let tip=t.tip;if(t.phase==='attached'&&t.target&&'frog'in t.target&&t.localAnchor){const target=positions[t.target.frog];if(target)tip={x:target.x+t.localAnchor.x,y:target.y+t.localAnchor.y};}
   const distance=Math.hypot(tip.x-p.x,tip.y-p.y),slack=t.phase==='attached'?Math.min(1.2,Math.max(0,t.length-distance)*.6):0;
   const ax=p.x*S,ay=p.y*S,bx=tip.x*S,by=tip.y*S;const curve=new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(ax,ay),new Phaser.Math.Vector2((ax+bx)/2,(ay+by)/2+slack*S),new Phaser.Math.Vector2(bx,by));const points=curve.getPoints(12);
   g.lineStyle(7,INK);g.strokePoints(points);g.lineStyle(4,0xff9baf);g.strokePoints(points);g.fillStyle(0xffc4ce);g.fillCircle(bx,by,4);g.lineStyle(2,INK);g.strokeCircle(bx,by,4);
   if(f.chaosSuperSuckers&&t.phase==='attached'&&distance>t.length-.3){g.lineStyle(2,0xffd1ef,.7);for(const q of [.35,.55,.75]){const cx=ax+(bx-ax)*q,cy=ay+(by-ay)*q;g.lineBetween(cx-3,cy-5,cx+3,cy+5);}}
   if(t.phase==='attached'&&distance>t.length-.3){g.lineStyle(1.5,0xffd6df,.8);g.strokeCircle(bx,by,7+Math.sin(time*13)*1.2);}
  });
  states.forEach((f,i)=>{
   const p=positions[i];if(f.active===false&&!this.reserved[i]){this.labels[i]?.setVisible(false);this.previous[i]=undefined as any;return;}if(!p)return;const infection=view?.mode==='freeze'||view?.mode==='classic'?undefined:view?.players[i],before=this.previous[i],color=FROG_COLORS[i];const state=infection?.state;
   if(before){
    if(view?.phase==='playing'&&f.stickyAttachTick!==undefined&&f.stickyAttachTick!==before.stickyAttachTick){this.pop(p.x,p.y,0xc3fbb4,'attach');}
    if(view?.phase==='playing'&&f.stickyReleaseTick!==undefined&&f.stickyReleaseTick!==before.stickyReleaseTick){this.pop(p.x,p.y,0xc3fbb4,'jump');}
    if(view?.phase==='playing'&&f.pogoTick!==undefined&&f.pogoTick!==before.pogoTick){this.pop(p.x,p.y+.3,0xffb9e3,'jump',.6);this.reactions[i]=140;}
    if(view?.phase==='playing'&&f.gravityFlipTick!==undefined&&f.gravityFlipTick!==before.gravityFlipTick){this.pop(p.x,p.y,0xd5c7ff,'swap');}
    if(f.balloonPopTick!==undefined&&f.balloonPopTick!==before.balloonPopTick){this.pop(p.x,p.y,0xffd4ed,'charge',1);this.reactions[i]=200;}
    if(f.balloonBounceTick!==undefined&&f.balloonBounceTick!==before.balloonBounceTick){this.pop(p.x,p.y+.3,0xffe49c,'charge',.6);this.reactions[i]=130;if(i===local)this.audio.play('charge');}
    if(f.bumperTick!==undefined&&f.bumperTick!==before.bumperTick){this.reactions[i]=150;this.pop(p.x,p.y,0xffd38f,'bump');}
    if(f.balloonInflated!==before.balloonInflated&&f.balloonPopTick===before.balloonPopTick&&i===local)this.audio.play(f.balloonInflated?'build':'miss');
    if(f.swapTick!==undefined&&f.swapTick!==before.swapTick){this.pop(before.x,before.y,0xc5efff,'swap');this.pop(p.x,p.y,0xc5efff,'swap');}
    if(f.surfaceBounceTick!==undefined&&f.surfaceBounceTick!==before.surfaceBounceTick){const strength=f.surfaceBounceStrength??0;this.pop(p.x,p.y+.3,0xa2ee6e,'charge',strength);this.reactions[i]=100+strength*80;if(i===local)this.audio.play('charge',1+strength*.25);}
    if(before.grounded&&!f.grounded&&f.vy< -5&&f.surfaceBounceTick===before.surfaceBounceTick){const charged=before.charging;this.pop(p.x,p.y+.3,charged?0xffe79b:color,charged?'charge':'jump');if(i===local&&f.pogoTick===before.pogoTick&&f.balloonPopTick===before.balloonPopTick&&f.bumperTick===before.bumperTick)this.audio.play(charged?'charge':'jump');}
    if(f.tongue?.phase==='flying'&&!before.tongue&&i===local)this.audio.play('fire');
    if(f.tongue?.phase==='attached'&&before.tongue!=='attached'){this.pop(f.tongue.tip.x,f.tongue.tip.y,0xffbbc9,'attach');if(i===local)this.audio.play('attach');}
    if(state==='transforming'&&before.state==='healthy'){this.pop(p.x,p.y,POISON_ACCENTS[i],'infect');this.reactions[i]=180;this.tagPuffs[i]=TAG_POOF_MS;}
    // React only to velocity changes in a physical body-contact neighborhood, not ordinary control acceleration.
    const bump=states.some((other,j)=>i!==j&&Math.hypot(other.x-f.x,other.y-f.y)<(f.radius??defaults.frogRadius)+(other.radius??defaults.frogRadius)+.15);
    if(bump&&Math.hypot(f.vx-before.vx,f.vy-before.vy)>3.5&&this.reactions[i]<=0){this.reactions[i]=130;this.pop(p.x,p.y,color,'bump');}
   }
   if(f.chaosTurbo&&f.grounded&&Math.abs(f.vx)>4){g.lineStyle(2,0xffdb91,.6);g.lineBetween(p.x*S-f.facing*18,p.y*S+10,p.x*S-f.facing*27,p.y*S+10);}
   if(f.aimAssistTick!==undefined&&f.aimAssistTarget!==undefined&&(view?.tick??0)-f.aimAssistTick<12){const target=positions[f.aimAssistTarget];if(target){g.lineStyle(2,0xa6fff2);const tx=target.x*S,ty=target.y*S;g.lineBetween(tx-8,ty,tx+8,ty);g.lineBetween(tx,ty-8,tx,ty+8);}}
   this.reactions[i]=Math.max(0,this.reactions[i]-delta);this.frog(g,p.x*S,p.y*S,f,i,infection,connected[i]!==false,i===local,time);
   if(view?.mode==='classic'){const isIt=i===view.classic!.it;if(before?.state&&before.state!==(isIt?'it':'runner')&&isIt)this.tagPuffs[i]=TAG_POOF_MS;this.tagPuffs[i]=Math.max(0,(this.tagPuffs[i]??0)-delta);paintClassicState(g,p.x*S,p.y*S,i,view,this.tagPuffs[i]);}
   if(view?.mode!=='classic'&&view?.mode!=='freeze'){this.tagPuffs[i]=Math.max(0,(this.tagPuffs[i]??0)-delta);paintTagPoof(g,p.x*S,p.y*S,this.tagPuffs[i]);}
   if(view?.mode==='freeze'){const frozen=view.freeze!.frozen[i];g.save();g.translateCanvas(p.x*S,p.y*S);g.scaleCanvas((f.radius??defaults.frogRadius)/defaults.frogRadius,(f.radius??defaults.frogRadius)/defaults.frogRadius);paintFreezeState(g,0,0,i,view);g.restore();if(before?.state&&before.state!==(frozen?'frozen':'runner')){this.pop(p.x,p.y,0xb3f0ff,'attach');}}
   if(f.stickyMud){g.fillStyle(0x795343,.8);for(const dx of [-8,8])g.fillEllipse(p.x*S+dx,p.y*S+12,12,5);}
   const status=connected[i]===false?'OFFLINE':view?.mode==='classic'?(i===view.classic!.it?'▲ IT':'NOT IT'):view?.mode==='freeze'?(i===view.freeze!.freezer?'❄ FREEZER':view.freeze!.frozen[i]?'❄ FROZEN':view.freeze!.protectedUntil[i]>view.tick?'◇ PROTECTED':'RUNNER'):infection?.state==='transforming'?'CHANGING · 1s':infection?.state==='infectious'?(infection.patientZero?'◆ DART FROG':'◆ POISON FROG'):view?.phase==='playing'&&view.players.filter(v=>v.present!==false&&v.state==='healthy').length===1?'LAST SAFE':'SAFE';
   paintFrogChaos(g,p.x*S,p.y*S,f,view?.tick??0,i);
   const chaosStatus=f.bubbleId!==undefined?(i===local?'○ TAP ACTION TO POP':'○ BUBBLED'):f.swapPartner!==undefined?`⇄ ${names[f.swapPartner]??'SWAP PARTNER'}`:f.balloonWarning?'◍ PUFFING UP…':undefined;
   const label=this.labels[i];
   label.setBackgroundColor('transparent').setPadding(0,0).setVisible(true).setText(`${i===local?'▼ YOU · ':''}${names[i]}${['SAFE','NOT IT','RUNNER'].includes(status)?'':'\n'+status}${chaosStatus?` · ${chaosStatus}`:''}`).setPosition(Phaser.Math.Clamp(p.x*S,label.width/2+4,WIDTH*S-label.width/2-4),Math.max(42,(p.y-(f.radius??defaults.frogRadius)-.3)*S)).setColor(i===local?'#b9eaff':connected[i]===false?'#b2c7c2':state==='transforming'||state==='infectious'||view?.mode==='classic'&&i===view.classic!.it||view?.mode==='freeze'&&i===view.freeze!.freezer?'#d5a2ff':'#fff8d9');
   this.previous[i]={stickyAttachTick:f.stickyAttachTick,stickyReleaseTick:f.stickyReleaseTick,pogoTick:f.pogoTick,gravityFlipTick:f.gravityFlipTick,gravityWarningSeconds:f.gravityWarningSeconds,balloonPopTick:f.balloonPopTick,balloonBounceTick:f.balloonBounceTick,bubblePressTick:f.bubblePressTick,bubbleId:f.bubbleId,bumperTick:f.bumperTick,balloonInflated:f.balloonInflated,swapTick:f.swapTick,bubbleEscapeTick:f.bubbleEscapeTick,surfaceBounceTick:f.surfaceBounceTick,vy:f.vy,vx:f.vx,grounded:f.grounded,charging:f.charging,tongue:f.tongue?.phase,state:view?.mode==='classic'?(i===view.classic!.it?'it':'runner'):view?.mode==='freeze'?(view.freeze!.frozen[i]?'frozen':'runner'):state,x:f.x,y:f.y};
  });
  this.labels.forEach((l,i)=>{if(i>=states.length)l.setVisible(false);});
  this.feel.render(states,positions,view?.mode==='freeze'||view?.mode==='classic'?undefined:view,local,delta);
  this.locator.render(states[local],positions[local],view,connected[local]!==false,ratio);
  this.pops=this.pops.filter(p=>{p.age+=Math.min(delta,50);if(p.age>=p.life)return false;const q=p.age/p.life,e=this.effects;if(p.kind==='swap'){for(let j=0;j<7;j++){const a=j*Math.PI*2/7,spread=7+q*30;e.fillStyle(p.color,.55*(1-q));e.fillCircle(p.x+Math.cos(a)*spread,p.y+Math.sin(a)*spread,Math.max(1,11*(1-q)));}return true;}e.lineStyle(2,p.color,1-q);const radius=((p.kind==='infect'?18:8)+q*(p.kind==='infect'?36:22))*(1+(p.strength??0)*.35);e.strokeCircle(p.x,p.y,radius);for(let j=0;j<6;j++){const a=j*Math.PI/3;e.fillStyle(p.color,1-q);e.fillCircle(p.x+Math.cos(a)*radius,p.y+Math.sin(a)*radius,2.5*(1-q)+.5);}return true;});
 }
 frog(g:Phaser.GameObjects.Graphics,x:number,y:number,f:FrogState,slot:number,infection:OutbreakPlayer|undefined,online:boolean,local:boolean,time:number){
  const size=(f.radius??defaults.frogRadius)/defaults.frogRadius;g.save();g.translateCanvas(x,y);if(f.stickyNormal)g.rotateCanvas(Math.atan2(f.stickyNormal.x,-f.stickyNormal.y));else if(f.gravityDirection===-1)g.scaleCanvas(1,-1);g.scaleCanvas(size*(f.balloonScale??1),size*(f.balloonScale??1));x=0;y=0;
  const charging=f.charging,q=Math.min(1,f.charge/defaults.chargeSeconds),role=poisonRole(infection?.state),poison=role.tagging,grace=role.transforming,accent=POISON_ACCENTS[slot%8];
  const squish=charging ? .8-.12*q : this.reactions[slot]>0 ? .84 : 1;
  const sy=f.balloonInflated?1:f.grounded?squish:Math.min(1.14,1+Math.abs(f.vy)*.006),sx=f.grounded?1+(1-sy)*.6:1/Math.sqrt(sy);
  const bob=f.grounded&&!charging?Math.sin(time*15)*Math.min(1.2,Math.abs(f.vx)*.18):0;const r=defaults.frogRadius*S,layers=appearanceLayers(this.appearances[slot],infection?.state,!!infection?.patientZero),bodyColor=layers.skin.color;y+=bob;
  g.fillStyle(INK,.35);g.fillEllipse(x,y+r*.95,r*2.7,6);
  if(local){g.lineStyle(2,0xfff4ba,.7);g.strokeEllipse(x,y,r*2.6,r*2.5);}
  if(grace){g.lineStyle(3,0xffe09b);const rr=r+7+Math.sin(time*14)*2;for(let j=0;j<4;j++)g.lineBetween(x+Math.cos(time+j*Math.PI/2)*rr,y+Math.sin(time+j*Math.PI/2)*rr,x+Math.cos(time+j*Math.PI/2)*(rr+5),y+Math.sin(time+j*Math.PI/2)*(rr+5));}
  // Dart-frog outline and diamond motes; permanent slot color/mark remains visible.
  if(poison){g.lineStyle(3,accent);g.strokeCircle(x,y,r+5);for(let j=0;j<3;j++){const a=time*1.4+j*2.1,cx=x+Math.cos(a)*(r+8),cy=y+Math.sin(a)*(r+8);g.fillStyle(accent,.7);g.fillTriangle(cx,cy-3,cx-2.5,cy+2,cx+2.5,cy+2);}}
  if(f.stickyNormal){g.lineStyle(2,0xb6faaa);for(const side of[-1,1])g.strokeEllipse(x+side*r*.78,y+r*.8,r*.9,5);}
  paintFrogCore(g,x,y,r,layers.appearance,{sx,sy,feet:charging?0:Math.sin(time*16)*Math.min(3,Math.abs(f.vx)*.6),online,showPattern:layers.showPattern,facing:f.facing,charging,openMouth:!!f.tongue});
  // Black dart-frog flank spots with bright rims appear immediately during transformation.
  // Kept below eyes/forehead so every permanent player mark remains readable.
  if(role.spotted){for(const side of [-1,1])for(const [px,py,rr]of [[.73,.12,.16],[.56,.58,.19]]){const cx=x+side*r*px*sx,cy=y+r*py*sy;g.fillStyle(INK);g.fillEllipse(cx,cy,r*rr*2,r*rr*2.35);g.lineStyle(1,accent,grace ? .6 : 1);g.strokeEllipse(cx,cy,r*rr*2,r*rr*2.35);}}
  paintHat(g,x,y+hatAnchor(r,layers.hat),r,layers.hat,time);
  if(infection?.patientZero){g.fillStyle(0xffe487);g.lineStyle(2,INK);const points=[{x:x-7,y:y-r-7},{x:x-7,y:y-r-14},{x:x-3,y:y-r-10},{x,y:y-r-16},{x:x+3,y:y-r-10},{x:x+7,y:y-r-14},{x:x+7,y:y-r-7}];g.fillPoints(points,true);g.strokePoints(points,true);}
  if(charging){g.lineStyle(3,INK);g.strokeCircle(x,y,r+9);g.lineStyle(3,0xffe29c);g.beginPath();g.arc(x,y,r+9,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(.03,q));g.strokePath();}
  g.restore();
 }
}
