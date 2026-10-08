import type Phaser from 'phaser';import type {ArenaDefinition} from '../simulation/arenas';
/** Original lightweight pond art. Only the outlined rectangles are solid; water/reeds/clouds are scenery. */
export function paintSunnyPond(g:Phaser.GameObjects.Graphics,a:ArenaDefinition){const S=30;g.clear();g.fillStyle(0x8acdd9);g.fillRect(0,0,1200,675);
 g.fillStyle(0xffdf70);g.fillCircle(995,105,48);g.lineStyle(4,0xffdf70,.65);for(let j=0;j<12;j++){const q=j*Math.PI/6;g.lineBetween(995+Math.cos(q)*57,105+Math.sin(q)*57,995+Math.cos(q)*66,105+Math.sin(q)*66);}
 g.fillStyle(0xeaf6df,.65);for(const[x,y]of[[190,115],[590,60],[900,265]]){g.fillEllipse(x,y,140,25);g.fillCircle(x-25,y-10,20);g.fillCircle(x+12,y-15,25);}
 g.fillStyle(0x70baa0,.5);g.fillEllipse(500,670,1400,330);g.fillStyle(0x50b9be,.7);g.fillEllipse(600,675,1100,170);
 g.lineStyle(2,0xc5efe0,.4);for(let i=0;i<16;i++)g.lineBetween(85+i*67,615+(i%3)*11,115+i*67,615+(i%3)*11);
 for(const x of[40,1160]){g.lineStyle(4,0x408668,.65);for(let j=0;j<5;j++){g.lineBetween(x+j*6,645,x+j*6-12,550+j*7);g.fillStyle(0x946d4b,.7);g.fillEllipse(x+j*6-12,550+j*7,8,25);}}
 a.solids.forEach((r,i)=>{const x=(r.x-r.w/2)*S,y=(r.y-r.h/2)*S,w=r.w*S,h=r.h*S,lily=r.surface==='lily',mud=r.surface==='mud';
  g.fillStyle(0x204943);g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle(lily?0x64ad50:mud?0x765249:i<4?0x7f9d82:0xb48b60);g.fillRect(x,y,w,h);
  g.fillStyle(lily?0xa4eb77:mud?0xb08969:i<4?0xc8dca2:0xe8c490);g.fillRect(x,y,w,Math.min(5,h));g.lineStyle(2,0x204943);g.strokeRect(x,y,w,h);
  if(lily){g.lineStyle(2,0x316b44);for(let bx=x+15;bx<x+w;bx+=25){g.lineBetween(bx,y+6,bx+8,y+11);}g.lineStyle(2,0xf4ffb0);for(let bx=x+22;bx<x+w-10;bx+=38){g.lineBetween(bx,y-5,bx+5,y-10);g.lineBetween(bx+5,y-10,bx+10,y-5);}g.fillStyle(0xf8aac6);g.fillCircle(x+w-12,y-5,5);}
  else if(mud){g.fillStyle(0x4e3a35);for(let bx=x+10;bx<x+w-8;bx+=27)g.fillEllipse(bx,y+8,14,5);g.lineStyle(2,0xd9b995);g.lineBetween(x+w/2-8,y+6,x+w/2+8,y+6);}
  else if(i>=4){g.lineStyle(1,0x795a40);for(let bx=x+12;bx<x+w-8;bx+=35)g.lineBetween(bx,y+8,bx+17,y+8);g.strokeEllipse(x+8,y+h/2,9,9);}
 });
}
