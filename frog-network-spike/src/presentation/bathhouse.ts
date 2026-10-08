import type Phaser from 'phaser';import type {ArenaDefinition} from '../simulation/arenas';
/** Original bathhouse vector art. Water, plumbing and bubbles are subdued non-solid scenery. */
export function paintBathhouse(g:Phaser.GameObjects.Graphics,a:ArenaDefinition){g.clear();g.fillStyle(0xaeacd2);g.fillRect(0,0,1200,675);
 g.lineStyle(2,0xe1dbea,.35);for(let x=20;x<1200;x+=80)g.lineBetween(x,0,x,675);for(let y=20;y<675;y+=65)g.lineBetween(0,y,1200,y);
 // A scalloped basin, wall plumbing and towels locate the solid objects in a tiny frog spa.
 g.fillStyle(0x77cdd0,.38);g.fillEllipse(600,695,1300,205);g.lineStyle(3,0xe5f6ec,.3);for(let i=0;i<15;i++)g.lineBetween(45+i*80,617+(i%3)*9,85+i*80,617+(i%3)*9);
 g.lineStyle(12,0x9c92b3,.32);g.lineBetween(1018,253,1018,555);g.lineBetween(785,120,785,45);g.lineStyle(4,0xf8e3b3,.25);g.lineBetween(1024,275,1024,548);
 g.fillStyle(0xc8bfd7,.35);g.fillRoundedRect(430,28,210,110,12);g.lineStyle(4,0x8c89aa,.3);g.strokeRoundedRect(430,28,210,110,12);g.fillStyle(0xe1cfbc,.3);g.fillRoundedRect(90,420,85,100,8);g.fillStyle(0xf3aca2,.3);g.fillRoundedRect(91,421,81,35,5);
 g.lineStyle(2,0xeaf9ec,.35);for(const[x,y,r]of[[80,140,16],[1120,480,24],[590,210,12],[930,85,19]]){g.strokeCircle(x,y,r);g.lineBetween(x-r*.4,y-r*.5,x-r*.1,y-r*.7);}
 a.solids.forEach((r,i)=>{const x=r.x*30,y=r.y*30,w=r.w*30,h=r.h*30;if(!r.outline){g.fillStyle(0x60799b);g.fillRect(x-w/2,y-h/2,w,h);g.lineStyle(3,0x334f66);g.strokeRect(x-w/2,y-h/2,w,h);if(i===0){g.lineStyle(2,0xbbd5d9);for(let k=0;k<15;k++)g.lineBetween(k*80,647,k*80,673);}return;}
 const pts=r.outline.map(([px,py])=>({x:x+px*30,y:y+py*30}));g.fillStyle(r.object==='sponge'?0xf3be78:r.object==='faucet'?0xd9b77d:r.object==='bucket'?0xf1a69c:0xd8efdd);g.fillPoints(pts,true);g.lineStyle(3,0x334f66);g.strokePoints(pts,true);
 if(r.object==='sponge'){g.fillStyle(0xcb965b);for(let j=-3;j<=3;j++)g.fillEllipse(x+j*17,y+5,5+(j%2===0?2:0),4);g.lineStyle(2,0xfff2c9);for(let j=-2;j<=2;j++){g.lineBetween(x+j*24-5,y-5,x+j*24,y-11);g.lineBetween(x+j*24,y-11,x+j*24+5,y-5);}}
 else if(r.object==='faucet'){g.lineStyle(2,0xffe8b4);g.lineBetween(x-w*.38,y-4,x+w*.38,y-4);g.fillStyle(0xa68155);g.fillEllipse(x-w*.4,y+3,9,9);g.fillEllipse(x+w*.4,y+3,9,9);g.lineStyle(2,0xa68155);g.lineBetween(x-12,y+2,x+12,y+2);}
 else if(r.object==='bucket'){g.lineStyle(2,0xb86e83);g.lineBetween(x-w*.42,y-8,x+w*.42,y-8);g.lineBetween(x-w*.35,y+5,x+w*.35,y+5);g.fillStyle(0xffd4ad);for(let j=-2;j<=2;j++)g.fillCircle(x+j*23,y,3);}
 else{if(r.surface==='soap'){g.lineStyle(3,0xfff9dd);g.lineBetween(x-w*.35,y-11,x+w*.35,y-11);g.lineStyle(2,0x627aa6);for(let j=-2;j<=2;j++){g.lineBetween(x+j*25-5,y+6,x+j*25+5,y+6);g.lineBetween(x+j*25+2,y+3,x+j*25+5,y+6);}}g.lineStyle(2,0x8cb9b7);g.lineBetween(x-w*.35,y-6,x+w*.35,y-6);g.lineBetween(x-w*.34,y+7,x+w*.34,y+7);g.fillStyle(0xffc6aa);g.fillRoundedRect(x-24,y-7,48,13,5);g.lineStyle(1,0xd7908a);g.strokeRoundedRect(x-24,y-7,48,13,5);g.fillStyle(0xeaf9ec);g.fillCircle(x+30,y-3,3);}
 });
}
