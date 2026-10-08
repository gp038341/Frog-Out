import type Phaser from 'phaser';import type {ArenaDefinition} from '../simulation/arenas';
/** Original lightweight pond art. Only the outlined object silhouettes are solid; water/reeds/clouds are scenery. */
export function paintSunnyPond(g:Phaser.GameObjects.Graphics,a:ArenaDefinition){const S=30;g.clear();g.fillStyle(0x8acdd9);g.fillRect(0,0,1200,675);
 g.fillStyle(0xffdf70);g.fillCircle(995,105,48);g.lineStyle(4,0xffdf70,.65);for(let j=0;j<12;j++){const q=j*Math.PI/6;g.lineBetween(995+Math.cos(q)*57,105+Math.sin(q)*57,995+Math.cos(q)*66,105+Math.sin(q)*66);}
 g.fillStyle(0xeaf6df,.65);for(const[x,y]of[[190,115],[590,60],[900,265]]){g.fillEllipse(x,y,140,25);g.fillCircle(x-25,y-10,20);g.fillCircle(x+12,y-15,25);}
 g.fillStyle(0x70baa0,.5);g.fillEllipse(500,670,1400,330);g.fillStyle(0x50b9be,.7);g.fillEllipse(600,675,1100,170);
 g.lineStyle(2,0xc5efe0,.4);for(let i=0;i<16;i++)g.lineBetween(85+i*67,615+(i%3)*11,115+i*67,615+(i%3)*11);
 for(const x of[40,1160]){g.lineStyle(4,0x408668,.65);for(let j=0;j<5;j++){g.lineBetween(x+j*6,645,x+j*6-12,550+j*7);g.fillStyle(0x946d4b,.7);g.fillEllipse(x+j*6-12,550+j*7,8,25);}}
 a.solids.forEach((r,i)=>{const x=r.x*S,y=r.y*S,w=r.w*S,h=r.h*S;
  if(!r.outline){g.fillStyle(i<4?0x7f9d82:0xb48b60);g.fillRect(x-w/2,y-h/2,w,h);g.lineStyle(2,0x204943);g.strokeRect(x-w/2,y-h/2,w,h);return;}
  const pts=r.outline.map(([px,py])=>({x:x+px*S,y:y+py*S}));
  g.fillStyle(r.object==='lily'?0x83ce59:r.object==='rock'?0x94a997:0xc29460);g.lineStyle(3,0x204943);g.fillPoints(pts,true);g.strokePoints(pts,true);
  if(r.object==='lily'){
   g.lineStyle(2,0x3c884c);for(let j=-2;j<=2;j++){g.lineBetween(x,y+3,x+j*21,y-5);}g.fillStyle(0x3c884c);g.fillTriangle(x+10,y-9,x+21,y-9,x+15,y+2);
   g.fillStyle(0xffb2d0);for(let j=0;j<5;j++){const q=j*Math.PI*.4;g.fillEllipse(x+w*.32+Math.cos(q)*5,y-11+Math.sin(q)*4,9,6);}g.fillStyle(0xffe376);g.fillCircle(x+w*.32,y-11,3);
   g.lineStyle(2,0xf4ffb0);for(let j=-1;j<=1;j++){g.lineBetween(x+j*27-5,y-15,x+j*27,y-20);g.lineBetween(x+j*27,y-20,x+j*27+5,y-15);}
  }else if(r.object==='rock'){
   g.lineStyle(2,0xc5d3b5);g.lineBetween(x-w*.27,y+h*.15,x-w*.4,y+h*.04);g.lineBetween(x+w*.22,y+h*.23,x+w*.37,y+h*.09);
   if(r.surface==='mud'){g.fillStyle(0x795447);g.fillRoundedRect(x-w*.4,y-h*.5,w*.8,9,4);g.fillStyle(0x4d3b31);for(let j=-2;j<=2;j++)g.fillEllipse(x+j*w*.13,y-h*.5+5,12,3);}
   else{g.fillStyle(0x6fa86d);g.fillEllipse(x,y-h*.23,w*.6,8);}
  }else{
   g.lineStyle(2,0x805534);g.lineBetween(x-w*.35,y+3,x+w*.3,y+3);g.strokeEllipse(x-w*.39,y+2,10,8);g.strokeEllipse(x+w*.16,y+3,14,7);
   // A tiny non-solid sprig sits beyond the outlined collision branch.
   g.lineStyle(2,0x3c884c);g.lineBetween(x+w*.34,y-7,x+w*.39,y-19);g.fillStyle(0x75bd64);g.fillEllipse(x+w*.39+5,y-18,13,7);
  }
 });
}
