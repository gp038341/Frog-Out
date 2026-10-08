import type Phaser from 'phaser';import type {ArenaDefinition} from '../simulation/arenas';
/** Original vector workshop; outlined foreground polygons exactly match Planck fixtures. */
export function paintToyshop(g:Phaser.GameObjects.Graphics,a:ArenaDefinition){g.clear();g.fillStyle(0x779cac);g.fillRect(0,0,1200,675);
 // Quiet pegboard and oversized workbench objects sit behind the playing field.
 g.fillStyle(0x628996,.35);for(let x=60;x<1200;x+=70)for(let y=60;y<600;y+=70)g.fillCircle(x,y,3);
 g.fillStyle(0xffd7a3,.25);g.fillRoundedRect(445,30,285,125,15);g.lineStyle(7,0xd6bb99,.35);g.strokeRoundedRect(445,30,285,125,15);
 g.lineStyle(5,0x4a7080,.35);g.lineBetween(80,70,340,70);for(const x of[115,210,300]){g.lineBetween(x,70,x,115);g.strokeCircle(x,133,17);}
 g.fillStyle(0x496e7c,.35);g.fillRoundedRect(960,545,140,80,12);g.fillStyle(0x9bd4bb,.3);g.fillCircle(1000,560,25);g.fillCircle(1060,560,25);g.lineStyle(3,0x496e7c,.4);g.lineBetween(975,590,1080,590);
 a.solids.forEach((r,i)=>{const x=r.x*30,y=r.y*30,w=r.w*30,h=r.h*30;if(!r.outline){g.fillStyle(0x456675);g.fillRect(x-w/2,y-h/2,w,h);g.lineStyle(3,0x243e4a);g.strokeRect(x-w/2,y-h/2,w,h);if(i===0){g.lineStyle(2,0x93adab);for(let k=0;k<12;k++)g.lineBetween(k*100+12,652,k*100+80,652);}return;}
 const pts=r.outline.map(([px,py])=>({x:x+px*30,y:y+py*30}));const color=r.object==='cushion'?0x9dddc6:r.object==='roof'?0xe98073:r.object==='spool'?0xe9cfac:r.object==='ruler'?0xf5d98c:i%2?0xeaa18c:0xedbd83;g.fillStyle(color);g.fillPoints(pts,true);g.lineStyle(3,0x243e4a);g.strokePoints(pts,true);
 if(r.object==='cushion'){g.lineStyle(2,0x3e8274);for(let j=-2;j<=2;j++){g.lineBetween(x+j*23-6,y+3,x+j*23,y-3);g.lineBetween(x+j*23,y-3,x+j*23+6,y+3);}g.lineStyle(2,0xe8ffde);g.lineBetween(x-w*.34,y-5,x+w*.34,y-5);}
 else if(r.object==='ruler'){g.lineStyle(2,0x6e6c47);for(let k=0;k<18;k++){const px=x-w/2+10+k*11,py=y+3-(px-x)*.114;g.lineBetween(px,py,px,py+(k%3===0?9:5));}}
 else if(r.object==='spool'){g.lineStyle(2,0xb57f67);for(let k=-3;k<=3;k++)g.lineBetween(x-w*.34,y+k*2,x+w*.34,y+k*2);g.fillStyle(0x8faaa8);g.fillEllipse(x-w*.39,y+2,9,12);g.fillEllipse(x+w*.39,y+2,9,12);}
 else if(r.object==='roof'){g.lineStyle(2,0xb85c5a);for(let k=-2;k<=2;k++)g.lineBetween(x+k*28,y-10,x+k*28+15,y+14);g.fillStyle(0xffddb0);g.fillTriangle(x-23,y+13,x,y-11,x+23,y+13);g.lineStyle(2,0x243e4a);g.strokeTriangle(x-23,y+13,x,y-11,x+23,y+13);}
 else{g.lineStyle(2,0xb47e62);g.strokeRoundedRect(x-w*.38,y-h*.28,w*.76,h*.56,4);g.fillStyle(0xffe7b1);g.fillCircle(x,y,5);}
 if(r.surface==='mud'){g.fillStyle(0xc95c82);g.fillRoundedRect(x-w*.39,y-h/2+1,w*.78,8,3);g.lineStyle(2,0x772e58);for(let k=-2;k<=2;k++)g.strokeEllipse(x+k*w*.14,y-h/2+5,10,3);}
 });
}
