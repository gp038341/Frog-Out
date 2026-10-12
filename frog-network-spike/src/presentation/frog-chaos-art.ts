import type Phaser from 'phaser';import type {FrogState} from '../simulation/state';import {defaults} from '../simulation/config';
/** Screen readability: core/status remains visible under thin, bounded decoration. */
export function paintFrogChaos(g:Phaser.GameObjects.Graphics,x:number,y:number,f:FrogState,tick:number,slot=0){const r=(f.radius??defaults.frogRadius)*30;
 if(f.balloonWarning){g.lineStyle(2,0xffd591,.7);for(const d of[-1,1])g.lineBetween(x+d*(r+6),y+4,x+d*(r+10),y-3);}
 if((f.balloonScale??1)>1.01){g.lineStyle(1.5,0xfff6d3,.65);g.strokeCircle(x,y,r);g.fillStyle(0xffffff,.55);g.fillEllipse(x-r*.55,y-r*.55,4,7);g.lineStyle(1.5,0xffdfad,.75);g.strokePoints([{x:x-3,y:y+r*1.2},{x:x+3,y:y+r*1.2},{x,y:y+r*1.2+5}],true);}
 if(f.swapPartner!==undefined){const hue=[0xffd59f,0xadebe8,0xdbbdff,0xffa9bf][Math.min(f.swapPartner,slot)%4]??0xffd59f;g.lineStyle(2,hue,.85);g.strokeCircle(x,y,r+7+Math.sin(tick*.18)*2);g.lineBetween(x-r-12,y,x-r-5,y-4);g.lineBetween(x+r+5,y+4,x+r+12,y);}
 if(f.swapProtectedUntil!==undefined&&tick<f.swapProtectedUntil){g.lineStyle(2,0xffedb8,.9);for(let i=0;i<4;i++){const a=i*Math.PI/2+tick*.15;g.strokePoints([{x:x+Math.cos(a)*(r+8),y:y+Math.sin(a)*(r+8)},{x:x+Math.cos(a+.25)*(r+11),y:y+Math.sin(a+.25)*(r+11)}]);}}
 if(f.swapTick!==undefined&&tick-f.swapTick<24){const q=(tick-f.swapTick)/24;g.lineStyle(2,0xc9eeff,1-q);g.strokeEllipse(x,y,(r*2+q*25),(r*2+q*40));}
 if(f.bumperTick!==undefined&&tick-f.bumperTick<18){const q=(tick-f.bumperTick)/18;g.lineStyle(2,0xffe090,1-q);for(let i=0;i<6;i++){const a=i*Math.PI/3,near=r+3+q*10;g.lineBetween(x+Math.cos(a)*near,y+Math.sin(a)*near,x+Math.cos(a)*(near+5),y+Math.sin(a)*(near+5));}}
 if(f.bubbleId!==undefined){const shake=Math.min(4,Math.max(0,f.bubbleEscapePresses??0))*.85,bx=x+Math.sin(tick*2.3+slot)*shake,by=y+Math.cos(tick*1.9+slot)*shake*.6;g.fillStyle(0xc8f8ff,.12);g.fillCircle(bx,by,Math.max(22,r+7));g.lineStyle(2,0x142f35,.8);g.strokeCircle(bx,by,Math.max(23,r+8));g.lineStyle(2,0xc9f7ff);g.strokeCircle(bx,by,Math.max(22,r+7));g.fillStyle(0xffffff,.8);g.fillEllipse(bx-9,by-10,5,8);}
 if(f.balloonPopTick!==undefined&&tick-f.balloonPopTick<24){const q=(tick-f.balloonPopTick)/24;g.lineStyle(3,0xffe0f3,1-q);g.strokeCircle(x,y,r+8+q*30);}
 if(f.bubbleEscapeTick!==undefined&&tick-f.bubbleEscapeTick<18){const q=(tick-f.bubbleEscapeTick)/18;g.lineStyle(1.5,0xceffff,1-q);for(let j=0;j<5;j++){const a=j*Math.PI*.4;g.strokeCircle(x+Math.cos(a)*(r+q*14),y+Math.sin(a)*(r+q*14),2+q*2);}}
}
