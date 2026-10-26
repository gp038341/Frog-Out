import type Phaser from 'phaser';
import type {ArenaDefinition,Solid} from '../simulation/arenas';
export const PRINT_INK=0x292431,PRINT_CREAM=0xfff1ce;
export const PRINT_PALETTES={
 'sunny-pond':{sky:0x91c5cd,far:0x81b7b0,mid:0x588e82,ground:0x426052,wood:0xc89760,stone:0xb0bd99,accent:0xc3db55},
 bathhouse:{sky:0xb9b0ce,far:0xa69fbd,mid:0x7eaeb6,ground:0x647c8e,wood:0xe1b76d,stone:0xf3dcc1,accent:0xe9bb63},
 canopy:{sky:0x6e9b8f,far:0x5d887a,mid:0x436f61,ground:0x384e43,wood:0xcc9860,stone:0x9fac83,accent:0xc3db55},
 toyshop:{sky:0x8baebf,far:0x789aaa,mid:0x5f8390,ground:0x5d6666,wood:0xe0b476,stone:0xeecc99,accent:0x7dbfa1},
 swingworks:{sky:0x8baebf,far:0x789aaa,mid:0x5f8390,ground:0x5d6666,wood:0xe0b476,stone:0xeecc99,accent:0x7dbfa1},
} as const;
/** Match-only palette. Lobby postcards deliberately retain their approved print colors. */
export const GAME_PALETTES={
 'sunny-pond':{sky:0x9ce2fa,far:0x81d8b0,mid:0x43ad78,ground:0x4a9871,wood:0xe9b474,stone:0xc5dfad,accent:0xc6f152},
 bathhouse:{sky:0xd2c4f5,far:0xb6a5df,mid:0x6bd4db,ground:0x659fb9,wood:0xffd47d,stone:0xffedcf,accent:0xffd45c},
 canopy:{sky:0x9bdbcc,far:0x72c99d,mid:0x3d9e73,ground:0x458869,wood:0xefba76,stone:0xc8dda0,accent:0xc6ed53},
 toyshop:{sky:0xa9d9f0,far:0x8bbfda,mid:0x66a4b8,ground:0x6a9caa,wood:0xffce88,stone:0xffe1ac,accent:0x80e2b3},
 swingworks:{sky:0xa9d9f0,far:0x8bbfda,mid:0x66a4b8,ground:0x6a9caa,wood:0xffce88,stone:0xffe1ac,accent:0x80e2b3},
} as const;
type G=Phaser.GameObjects.Graphics;type Point={x:number;y:number};
const poly=(g:G,p:Point[],fill:number,edge=true)=>{g.fillStyle(fill);g.fillPoints(p,true);if(edge){g.lineStyle(3,PRINT_INK);g.strokePoints(p,true);}};
const leaf=(g:G,x:number,y:number,w:number,h:number,color:number,angle=0)=>{g.save();g.translateCanvas(x,y);g.rotateCanvas(angle);poly(g,[{x:-w/2,y:0},{x:-w*.22,y:-h*.5},{x:w*.12,y:-h*.6},{x:w/2,y:0},{x:w*.12,y:h*.4},{x:-w*.22,y:h*.35}],color,false);g.restore();};
const ellipse=(g:G,x:number,y:number,w:number,h:number,c:number,alpha=1)=>{g.fillStyle(c,alpha);g.fillEllipse(x,y,w,h);};
function background(g:G,a:ArenaDefinition){const c=GAME_PALETTES[a.id];g.fillStyle(c.sky);g.fillRect(0,0,1200,675);
 // Sparse flat-color dots evoke a print plate; background has no collision-colored outlines.
 g.fillStyle(c.far,.35);for(let i=0;i<125;i++){const x=30+(i*137)%1140,y=26+(i*89)%600;g.fillCircle(x,y,i%3?1:1.7);}
 if(a.id==='sunny-pond'){
  ellipse(g,1000,113,126,126,0xffdc68);g.lineStyle(2,c.far,.7);for(let i=0;i<12;i++){const t=i*Math.PI/6;g.lineBetween(1000+Math.cos(t)*73,113+Math.sin(t)*73,1000+Math.cos(t)*81,113+Math.sin(t)*81);}
  for(const[x,y,w]of[[200,100,170],[610,67,210],[906,293,135]]){poly(g,[{x:x-w/2,y:y+8},{x:x-w*.25,y:y-6},{x:x-w*.18,y:y-24},{x:x+w*.1,y:y-18},{x:x+w*.25,y:y-1},{x:x+w/2,y:y+11}],0xeafaff,false);g.lineStyle(2,c.sky,.7);g.lineBetween(x-w*.2,y+7,x+w*.25,y+7);}
  poly(g,[{x:0,y:555},{x:130,y:525},{x:350,y:562},{x:575,y:547},{x:815,y:568},{x:1080,y:536},{x:1200,y:553},{x:1200,y:675},{x:0,y:675}],c.far,false);
  ellipse(g,600,696,1290,218,0x61c8e1);g.lineStyle(2,0xb9d6cb,.6);for(let i=0;i<19;i++){const x=25+i*67,y=603+(i%3)*16;g.lineBetween(x,y,x+30,y);g.lineBetween(x+8,y+5,x+40,y+5);}
  for(const side of[0,1])for(let j=0;j<7;j++){const x=side?1185-j*10:15+j*9,y=578+j%3*16;g.lineStyle(4,c.mid);g.lineBetween(x,650,x+(side?-12:12),y-60);ellipse(g,x+(side?-12:12),y-60,9,29,0xb1ac69);leaf(g,x,620,45,11,c.mid,side?-.8:.8);}
  leaf(g,36,210,155,66,c.far,1.2);leaf(g,1172,344,170,62,c.far,-1.1);
 }else if(a.id==='bathhouse'){
  g.lineStyle(2,0xd8ccdb,.6);for(let x=25;x<1200;x+=90)g.lineBetween(x,0,x,675);for(let y=18;y<675;y+=72)g.lineBetween(0,y,1200,y);
  // Tall arched window, reflected sky and a distant sun. Entire object is quiet scenery.
  g.fillStyle(0xd9f5f2);g.fillRoundedRect(450,34,270,294,{tl:135,tr:135,bl:5,br:5});g.lineStyle(9,c.far);g.strokeRoundedRect(450,34,270,294,{tl:135,tr:135,bl:5,br:5});ellipse(g,586,120,67,67,0xffdf88);g.lineStyle(5,c.far);g.lineBetween(585,35,585,328);g.lineBetween(450,196,720,196);
  g.lineStyle(12,0xa49b9f);g.lineBetween(1045,65,1045,507);g.lineBetween(1045,507,1140,507);g.lineStyle(3,0xcbbfa8);g.lineBetween(1042,68,1042,503);ellipse(g,1045,149,45,12,0xc6b9a2);
  g.fillStyle(0xabb4bd);g.fillRoundedRect(70,360,97,160,8);g.fillStyle(0xd3aba6);g.fillRect(70,360,97,42);g.lineStyle(3,0xb694a1);for(let x=80;x<165;x+=10)g.lineBetween(x,402,x,508);
  ellipse(g,600,712,1340,205,0x6bd8e7);g.lineStyle(2,0xc9d9d0,.65);for(let i=0;i<13;i++){const x=25+i*97,y=615+(i%3)*11;g.strokeEllipse(x,y,37,5);}
  for(const[x,y,r]of[[75,158,23],[1120,340,31],[879,67,16]]){g.lineStyle(2,0xcfd0d6);g.strokeCircle(x,y,r);g.lineBetween(x-r*.6,y-r*.1,x-r*.3,y-r*.6);}
 }else if(a.id==='toyshop'){
  for(let x=38;x<1200;x+=60)for(let y=35;y<610;y+=60){g.fillStyle(c.far);g.fillRect(x,y,3,3);}
  g.fillStyle(0xe0f2e4);g.fillRoundedRect(453,28,280,237,{tl:134,tr:134,bl:0,br:0});ellipse(g,596,108,88,88,0xffdf9a);g.lineStyle(8,c.far);g.strokeRoundedRect(453,28,280,237,{tl:134,tr:134,bl:0,br:0});g.lineBetween(593,31,593,265);g.lineBetween(454,175,732,175);
  g.lineStyle(7,c.mid,.6);g.lineBetween(75,73,322,73);for(const[x,r]of[[115,23],[215,17],[292,27]]){g.lineBetween(x,73,x,115);g.strokeCircle(x,128,r);}
  // Wind-up frog silhouette on the bench, deliberately subdued and behind all solids.
  ellipse(g,1060,590,131,67,c.mid);ellipse(g,1029,557,35,35,c.mid);ellipse(g,1090,557,35,35,c.mid);g.lineStyle(5,c.mid);g.lineBetween(986,587,963,580);g.strokeCircle(953,576,10);g.strokeCircle(948,591,10);g.lineBetween(1100,617,1134,628);
  g.fillStyle(c.far);g.fillRect(0,632,1200,43);g.lineStyle(2,c.mid,.6);for(let x=50;x<1200;x+=100)g.lineBetween(x,633,x-12,675);
 }else{
  ellipse(g,951,123,152,152,0xffe68c);ellipse(g,420,600,1300,400,c.far);ellipse(g,940,670,1300,320,c.mid);
  for(const x of[20,1180]){g.lineStyle(23,c.mid);g.lineBetween(x,0,x,675);for(let i=0;i<8;i++){const y=45+i*76,dir=(i%2?1:-1);leaf(g,x+dir*18,y,170,65,c.far,dir*.6);}}
  // A tiny distant garden cabin gives the courtyard a place, not a diagram.
  g.fillStyle(c.far);g.fillRect(410,247,274,190);poly(g,[{x:380,y:250},{x:545,y:123},{x:710,y:250}],c.far,false);g.lineStyle(6,c.sky,.3);g.strokeRect(458,287,58,70);g.strokeRect(570,287,58,70);
  g.lineStyle(2,c.mid,.6);g.lineBetween(150,60,1060,32);for(let i=0;i<14;i++)leaf(g,160+i*65,59-i*2,31,15,i%2?0xa7db8a:c.mid,.5);
  for(let j=0;j<24;j++){const x=j*52;leaf(g,x,644,47,22,0x81c577,j%2?.5:-.5);ellipse(g,x+11,639,6,6,0xf3c99a);}
 }
}
function inside(x:number,y:number,points:Point[]){let inShape=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)inShape=!inShape;}return inShape;}
export function printedSolid(g:G,r:Solid,index:number,a:ArenaDefinition){const c=GAME_PALETTES[a.id],x=r.x*30,y=r.y*30,w=r.w*30,h=r.h*30;
 const points=r.outline?r.outline.map(([px,py])=>({x:x+px*30,y:y+py*30})):[{x:x-w/2,y:y-h/2},{x:x+w/2,y:y-h/2},{x:x+w/2,y:y+h/2},{x:x-w/2,y:y+h/2}];
 const color=r.object==='lily'?0xc2ed51:r.object==='sponge'?0xffd15c:r.object==='cushion'?0x84e8b0:r.object==='rock'?c.stone:r.object==='faucet'?0xffcf74:r.object==='bucket'?0xffa5a0:r.object==='roof'?0xff886c:r.object==='dish'?0xffebcd:!r.outline&&index<4?c.ground:c.wood;
 poly(g,points,color);g.lineStyle(2,PRINT_CREAM,.7);if(r.outline)g.lineBetween(points[0].x+3,points[0].y+3,points[1].x-3,points[1].y+3);else g.lineBetween(x-w/2+3,y-h/2+3,x+w/2-3,y-h/2+3);
 // Etching is clipped mathematically to each actual silhouette, including angled rulers.
 g.lineStyle(1,PRINT_INK,.18);let count=0;for(let dx=-w/2+7;dx<w/2-4;dx+=13){for(let dy=-h/2+5;dy<h/2-2;dy+=9){if(count++>220)break;if(inside(x+dx,y+dy,points)&&inside(x+dx+4,y+dy+3,points))g.lineBetween(x+dx,y+dy,x+dx+4,y+dy+3);}}
 if(r.object==='lily'||r.object==='cushion'||r.object==='sponge'){
  if(r.object==='lily'){g.lineStyle(2,0x5f853c);for(let j=-2;j<=2;j++)g.lineBetween(x,y+3,x+j*w*.17,y-h*.26);g.fillStyle(PRINT_INK,.45);g.fillTriangle(x+w*.28,y-h*.4,x+w*.36,y-h*.4,x+w*.33,y+2);}
  if(r.object==='sponge'){g.fillStyle(0xad8956);for(let j=-3;j<=3;j++)g.fillEllipse(x+j*w*.12,y+3,6,4);}
  g.lineStyle(2,PRINT_INK,.8);for(let j=-1;j<=1;j++){const cx=x+j*w*.24;g.lineBetween(cx-5,y-1,cx,y-5);g.lineBetween(cx,y-5,cx+5,y-1);}
 }else if(r.object==='rock'){g.lineStyle(2,PRINT_CREAM,.5);g.lineBetween(x-w*.36,y+h*.15,x-w*.16,y+h*.26);g.lineBetween(x+w*.1,y+h*.3,x+w*.33,y+h*.1);}
 else if(r.object==='branch'||a.id==='canopy'&&index>=4){g.lineStyle(1.5,PRINT_INK,.5);g.lineBetween(x-w*.35,y+2,x+w*.3,y+2);g.strokeEllipse(x-w*.23,y+1,15,6);g.strokeEllipse(x+w*.25,y+1,8,4);}
 else if(r.object==='ruler'){g.lineStyle(1.5,PRINT_INK,.6);for(let k=0;k<15;k++){const dx=-w/2+12+k*(w-24)/14,dy=3-dx*.114;g.lineBetween(x+dx,y+dy,x+dx,y+dy+(k%3===0?7:3));}}
 else if(r.object==='spool'){g.lineStyle(1.3,0x9e745b);for(let k=-3;k<=3;k++)g.lineBetween(x-w*.32,y+k*2,x+w*.32,y+k*2);g.fillStyle(0x8baaa8);g.fillEllipse(x-w*.42,y,9,h*.55);g.fillEllipse(x+w*.42,y,9,h*.55);}
 else if(r.object==='roof'){g.lineStyle(2,0x9d554d);for(let j=-3;j<=3;j++)g.lineBetween(x+j*w*.11,y-8,x+j*w*.11+11,y+12);g.fillStyle(PRINT_CREAM);g.fillTriangle(x-17,y+12,x,y-6,x+17,y+12);}
 else if(r.object==='faucet'){g.lineStyle(2,PRINT_CREAM,.65);g.lineBetween(x-w*.36,y-3,x+w*.36,y-3);g.fillStyle(0x9a815c);g.fillCircle(x-w*.38,y+3,3);g.fillCircle(x+w*.38,y+3,3);}
 else if(r.object==='dish'){g.lineStyle(2,0xb49e83);g.lineBetween(x-w*.34,y+4,x+w*.34,y+4);}
 else if(r.object==='block'){g.lineStyle(2,0xb18a61);g.strokeRoundedRect(x-w*.35,y-h*.3,w*.7,h*.6,3);g.fillStyle(PRINT_CREAM);g.fillCircle(x,y,4);}
 if(r.surface==='mud'){g.fillStyle(a.id==='toyshop'?0xed79b2:0x986444);g.fillRoundedRect(x-w*.37,y-h*.4,w*.74,7,3);g.fillStyle(PRINT_INK,.35);for(let j=-2;j<=2;j++)g.fillEllipse(x+j*w*.13,y-h*.4+4,10,2);}
 if(r.surface==='soap'){g.lineStyle(2,0x7ca4b5);for(let j=-2;j<=2;j++){g.lineBetween(x+j*w*.14-7,y+2,x+j*w*.14+6,y+2);g.lineBetween(x+j*w*.14+3,y-1,x+j*w*.14+6,y+2);}g.fillStyle(0xffa4bc);g.fillRoundedRect(x-23,y-h*.35,46,9,4);}
 // The final stroke is always the exact polygon/rectangle, never an invented collision silhouette.
 g.lineStyle(3,PRINT_INK);g.strokePoints(points,true);
}
/** All static, tilting and crumbling surfaces use one geometry-fed print treatment. */
export function paintPrintedArena(g:G,a:ArenaDefinition,options:{background?:boolean;filter?:(index:number)=>boolean}={}){g.clear();if(options.background!==false)background(g,a);a.solids.forEach((r,i)=>{if(!options.filter||options.filter(i))printedSolid(g,r,i,a);});}
