import Phaser from 'phaser';
import {GameAudio} from './audio';
import type {FrogState} from '../simulation/state';
import type {OutbreakView} from '../game/outbreak';
import {defaults} from '../simulation/config';
import {FROG_COLORS} from './identity';
type Point={x:number;y:number};
type Spark={x:number;y:number;age:number;life:number;color:number;kind:'launch'|'fire'|'attach'|'impact'|'infection'|'ready'};
/** Bounded decorative graphics, local action sound and authoritative infection reactions only. */
export class Feel {
 graphics:Phaser.GameObjects.Graphics;private before:FrogState[]=[];private infection:string[]=[];private sparks:Spark[]=[];private round='';private pulse=0;private chargeTier=-1;
 constructor(scene:Phaser.Scene,private audio:GameAudio){this.graphics=scene.add.graphics().setDepth(3);}
 clear(){this.before=[];this.infection=[];this.sparks=[];this.graphics.clear();this.round='';this.chargeTier=-1;}
 private burst(x:number,y:number,color:number,kind:Spark['kind']){if(this.sparks.length<24)this.sparks.push({x:x*30,y:y*30,color,kind,age:0,life:kind==='infection'?480:220});}
 render(states:FrogState[],positions:Point[],view:OutbreakView|undefined,local:number,delta:number){
  const key=view?`${view.patientZeroOrder.join(',')}:${view.round}`:'';if(key!==this.round){this.clear();this.round=key;}
  const g=this.graphics;g.clear();this.pulse+=Math.min(delta,50)/1000;const healthy=view?.players.filter(p=>p.state==='healthy').length;
  states.forEach((f,i)=>{const p=positions[i],old=this.before[i],state=view?.players[i]?.state;if(!p)return;const r=defaults.frogRadius*30;
   if(old){
    if(old.grounded&&!f.grounded&&f.vy<-5){this.burst(p.x,p.y+.4,old.charging?0xffe4a1:FROG_COLORS[i],'launch');}
    if(f.tongue?.phase==='flying'&&!old.tongue)this.burst(p.x,p.y,0xffbacb,'fire');
    if(f.tongue?.phase==='attached'&&old.tongue?.phase!=='attached')this.burst(f.tongue.tip.x,f.tongue.tip.y,0xffdfbc,'attach');
    if(i===local&&f.tongue?.phase==='retracting'&&old.tongue?.phase==='flying')this.audio.play('miss');
    if(i===local&&f.grounded&&!old.grounded&&Math.abs(old.vy)>5)this.audio.play('impact');
    if(i===local&&states.some((o,j)=>j!==i&&Math.hypot(o.x-f.x,o.y-f.y)<defaults.frogRadius*2+.15)&&Math.hypot(f.vx-old.vx,f.vy-old.vy)>3.5){this.burst(p.x,p.y,FROG_COLORS[i],'impact');this.audio.play('impact');}
    if(this.infection[i]==='healthy'&&state==='transforming')this.burst(p.x,p.y,0xe8b8fa,'infection');
    if(this.infection[i]==='transforming'&&state==='infectious')this.burst(p.x,p.y,0xe8b8fa,'ready');
   }
   if(f.charging){const q=Math.min(1,f.charge/defaults.chargeSeconds),x=p.x*30,y=p.y*30;g.lineStyle(1.5,0xffe4a1,.5+.4*q);for(const side of[-1,1])g.lineBetween(x+side*(r+8),y+3,x+side*(r+12+q*5),y+3-Math.sin(this.pulse*18)*2);if(i===local){const tier=Math.floor(q*3);if(tier!==this.chargeTier){this.audio.play('build');this.chargeTier=tier;}}}
   if(i===local&&!f.charging)this.chargeTier=-1;
   if(f.tongue?.phase==='attached'){const t=f.tongue,tip=t.tip,d=Math.hypot(tip.x-p.x,tip.y-p.y);if(d>t.length-.3){const x=(p.x+tip.x)*15,y=(p.y+tip.y)*15;g.lineStyle(1.5,0xffe4a1,.7);g.lineBetween(x-5,y-5,x-1,y-1);g.lineBetween(x+1,y+1,x+5,y+5);if(i===local)this.audio.play('tension');}}
   if(view?.phase==='playing'&&healthy===1&&state==='healthy'){g.lineStyle(2,0xffe79b,.8);const x=p.x*30,y=p.y*30-r-10;g.strokePoints([{x:x-5,y:y-3},{x,y:y+1},{x:x+5,y:y-3}]);}
   if(state==='transforming'){const player=view!.players[i],remaining=Math.max(0,(player.infectiousTick??view!.tick)-view!.tick)/60;g.lineStyle(2,0xffe09b,.9);g.beginPath();g.arc(p.x*30,p.y*30,r+11,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,remaining));g.strokePath();}
   this.infection[i]=state??'';
  });
  this.sparks=this.sparks.filter(s=>{s.age+=Math.min(delta,50);if(s.age>=s.life)return false;const q=s.age/s.life;if(s.kind==='infection'){g.fillStyle(s.color,.4*(1-q));for(let j=0;j<6;j++){const a=j*Math.PI/3;g.fillCircle(s.x+Math.cos(a)*(6+q*18),s.y+Math.sin(a)*(6+q*18),5+q*4);} }g.lineStyle(2,s.color,1-q);for(let j=0;j<4;j++){const a=j*Math.PI/2+.35,near=8+q*14,far=near+(1-q)*6;g.lineBetween(s.x+Math.cos(a)*near,s.y+Math.sin(a)*near,s.x+Math.cos(a)*far,s.y+Math.sin(a)*far);}return true;});
  this.before=states.map(f=>({...f,tongue:f.tongue?{...f.tongue}:undefined}));
 }
}
