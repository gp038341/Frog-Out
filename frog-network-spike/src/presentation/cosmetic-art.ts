import type Phaser from 'phaser';
import {type Appearance,skinFor,patternFor,normalizeAppearance,HATS} from './cosmetics';
import {SVGGraphics} from './svg-graphics';
const INK=0x292431;
/** One pattern painter for both Phaser and the SVG portraits, in body-relative units. */
export function paintPattern(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,a:Appearance){
 const s=skinFor(a),pattern=patternFor(a).id;
 const point=(dx:number,dy:number)=>({x:x+dx*r,y:y+dy*r});
 const poly=(pts:number[][],color=s.mark)=>{g.fillStyle(color,.9);g.fillPoints(pts.map(([dx,dy])=>point(dx,dy)),true);};
 const line=(pts:number[][],width=.12,color:number=s.mark)=>{g.lineStyle(r*width,color,.9);g.strokePoints(pts.map(([dx,dy])=>point(dx,dy)),false);};
 g.fillStyle(s.mark,.9);
 if(pattern==='spots')for(const side of[-1,1])for(const[dx,dy,rr]of[[.7,.06,.17],[.54,.49,.13],[.21,-.34,.095]])g.fillCircle(x+side*r*dx,y+r*dy,r*rr);
 if(pattern==='freckles')for(const side of[-1,1])for(const[dx,dy,rr]of[[.73,.04,.065],[.54,.23,.08],[.77,.4,.07],[.34,.52,.06],[.24,-.35,.06]])g.fillCircle(x+side*r*dx,y+r*dy,r*rr);
 if(pattern==='stripe'){poly([[-.15,-.7],[.15,-.7],[.2,.7],[-.2,.7]]);line([[0,-.64],[0,.65]],.055,0xfffbea);}
 if(pattern==='chevron')for(const yy of[-.24,.07,.38])line([[-.65,yy],[0,yy+.21],[.65,yy]],.12);
 if(pattern==='diamonds')for(const side of[-1,1])for(const yy of[-.12,.36])poly([[side*.55,yy-.15],[side*.7,yy],[side*.55,yy+.15],[side*.4,yy]]);
 if(pattern==='tiger')for(const side of[-1,1])for(const yy of[-.25,.12,.49])poly([[side*.94,yy-.1],[side*.39,yy+.03],[side*.89,yy+.14]]);
 if(pattern==='lightning')for(const side of[-1,1])poly([[side*.64,-.45],[side*.26,.03],[side*.52,.03],[side*.31,.57],[side*.82,-.09],[side*.55,-.09]]);
 if(pattern==='constellation'){line([[-.69,.39],[-.43,.04],[.02,.25],[.52,-.22],[.74,.31]],.045);for(const[dx,dy]of[[-.69,.39],[-.43,.04],[.02,.25],[.52,-.22],[.74,.31]]){g.fillStyle(s.mark);g.fillCircle(x+dx*r,y+dy*r,r*.1);g.fillStyle(0xfffbea);g.fillCircle(x+dx*r,y+dy*r,r*.045);}poly([[-.14,-.42],[-.07,-.3],[.07,-.29],[-.03,-.2],[0,-.06],[-.14,-.13],[-.26,-.06],[-.24,-.2],[-.35,-.29],[-.2,-.3]]);}
 if(pattern==='patches'){poly([[-.85,-.12],[-.58,-.33],[-.29,-.14],[-.35,.19],[-.61,.31],[-.86,.12]]);poly([[.42,.1],[.8,.01],[.9,.32],[.64,.65],[.31,.5],[.24,.28]]);g.fillStyle(s.mark);g.fillEllipse(x+r*.02,y-r*.49,r*.4,r*.2);}
}
export function paintEye(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,a:Appearance,facing:number,charging:boolean,side:number){g.fillStyle(INK);g.fillCircle(x,y,r*.47);g.fillStyle(0xfffbea);g.fillCircle(x,y,r*.37);g.fillStyle(INK);const radius=a.eyes==='surprised'?r*.25:r*.2;g.fillCircle(x+facing*2,y+(charging?1:-1),radius);g.lineStyle(2,INK);if(a.eyes==='sleepy'){g.fillStyle(skinFor(a).color);g.fillRect(x-r*.36,y-r*.36,r*.72,r*.37);g.lineBetween(x-r*.32,y,x+r*.32,y);}if(a.eyes==='determined')g.lineBetween(x-r*.35,y-r*.27-side*2,x+r*.35,y-r*.27+side*2);if(a.eyes==='mischievous'&&side===1){g.fillStyle(skinFor(a).color);g.fillRect(x-r*.36,y-r*.34,r*.72,r*.3);g.lineBetween(x-r*.3,y-r*.05,x+r*.3,y-r*.12);}if(a.eyes==='wink'&&side===1){g.fillStyle(skinFor(a).color);g.fillCircle(x,y,r*.37);g.lineStyle(2,INK);g.lineBetween(x-r*.28,y,x+r*.28,y-r*.04);}
 if(a.eyes==='joyful'){g.fillStyle(skinFor(a).color);g.fillCircle(x,y,r*.37);g.lineStyle(2,INK);g.strokePoints([{x:x-r*.26,y:y+r*.08},{x,y:y-r*.13},{x:x+r*.26,y:y+r*.08}],false);}
 if(a.eyes==='worried'){g.lineStyle(2,INK);g.lineBetween(x-r*.3,y-r*.24+side*1.5,x+r*.3,y-r*.24-side*1.5);}
 if(a.eyes==='cheerful'){g.fillStyle(0xffffff);g.fillCircle(x+facing*2-1,y-2,r*.07);}}
export function paintHat(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,hat:Appearance['hat'],time:number){
 if(hat==='none')return;g.lineStyle(2,INK);
 const polygon=(points:{x:number;y:number}[],color:number)=>{g.fillStyle(color);g.fillPoints(points,true);g.strokePoints(points,true);};
 if(hat==='crown')polygon([{x:x-7,y},{x:x-8,y:y-8},{x:x-3,y:y-4},{x,y:y-10},{x:x+3,y:y-4},{x:x+8,y:y-8},{x:x+7,y}],0xffab87);
 if(hat==='party'){
  polygon([{x:x-10,y},{x,y:y-25},{x:x+10,y}],0xffa7ce);
  polygon([{x:x-7,y:y-7},{x:x+4,y:y-15},{x:x+6,y:y-10},{x:x-9,y:y-2}],0x80dce0);
  g.fillStyle(0xffdf7c);g.fillCircle(x,y-25,3);g.fillCircle(x-1,y-17,1.7);
  g.fillStyle(0xffdf7c);g.fillEllipse(x,y,21,5);g.strokeEllipse(x,y,21,5);
 }
 if(hat==='cowboy'){g.fillStyle(0xdba46b);g.fillRoundedRect(x-9,y-10,18,10,4);g.strokeRoundedRect(x-9,y-10,18,10,4);g.fillEllipse(x,y,30,6);g.strokeEllipse(x,y,30,6);}
 if(hat==='mushroom'){
  g.fillStyle(0xfff7d9);g.fillRoundedRect(x-5,y-6,10,8,3);g.strokeRoundedRect(x-5,y-6,10,8,3);
  const dome=Array.from({length:17},(_,i)=>({x:x-15*Math.cos(i*Math.PI/16),y:y-3-15*Math.sin(i*Math.PI/16)}));polygon(dome,0xf37c83);
  g.fillStyle(0xfff7d9);g.fillEllipse(x,y-3,30,5);g.strokeEllipse(x,y-3,30,5);
  for(const [dx,dy,size]of[[-7,-10,3],[3,-14,3.5],[9,-8,2.5]])g.fillCircle(x+dx,y+dy,size);
 }
 if(hat==='propeller'){
  polygon([{x:x-12,y:y-1},{x:x-10,y:y-8},{x:x-5,y:y-12},{x:x+5,y:y-12},{x:x+10,y:y-8},{x:x+12,y:y-1}],0x80cde6);
  polygon([{x:x-5,y:y-12},{x:x+2,y:y-13},{x:x+5,y:y-1},{x:x-4,y:y-1}],0xffa397);
  g.fillStyle(0x95dfb9);g.fillRoundedRect(x-13,y-2,26,5,2);g.strokeRoundedRect(x-13,y-2,26,5,2);
  g.lineStyle(2,INK);g.lineBetween(x,y-13,x,y-20);
  const wobble=Math.sin(time*9)*1.3;g.fillStyle(0xffd67d);g.fillEllipse(x-7,y-20-wobble,15,5);g.strokeEllipse(x-7,y-20-wobble,15,5);g.fillEllipse(x+7,y-20+wobble,15,5);g.strokeEllipse(x+7,y-20+wobble,15,5);g.fillStyle(0xf37c83);g.fillCircle(x,y-20,2.5);
 }
 if(hat==='rain'){g.fillStyle(0xffd66c);g.fillRoundedRect(x-11,y-12,22,13,6);g.strokeRoundedRect(x-11,y-12,22,13,6);g.fillEllipse(x,y,32,6);g.strokeEllipse(x,y,32,6);g.lineStyle(2,0xb76039);g.lineBetween(x-10,y-3,x+10,y-3);}
 if(hat==='sprout'){g.lineStyle(2.5,0x317d70);g.lineBetween(x,y+1,x,y-14);polygon([{x,y:y-10},{x:x-12,y:y-17},{x:x-13,y:y-8},{x:x-7,y:y-5}],0x8ce7c5);polygon([{x,y:y-10},{x:x+11,y:y-20},{x:x+14,y:y-12},{x:x+8,y:y-6}],0xc5e96e);}
 if(hat==='bow'){polygon([{x:x-2,y:y-6},{x:x-14,y:y-13},{x:x-14,y:y+1},{x:x-2,y:y-3}],0xff8d91);polygon([{x:x+2,y:y-6},{x:x+14,y:y-13},{x:x+14,y:y+1},{x:x+2,y:y-3}],0xff8d91);g.fillStyle(0xffd66c);g.fillCircle(x,y-5,4);g.strokeCircle(x,y-5,4);}
 if(hat==='flower'){g.lineStyle(2,0x407d55);g.lineBetween(x,y,x+4,y-9);g.lineStyle(1.5,INK);g.fillStyle(0xfff8d8);for(let j=0;j<5;j++){const px=x+4+Math.cos(j*Math.PI*2/5)*4,py=y-10+Math.sin(j*Math.PI*2/5)*4;g.fillCircle(px,py,3);g.strokeCircle(px,py,3);}g.fillStyle(0xffc868);g.fillCircle(x+4,y-10,3);g.strokeCircle(x+4,y-10,3);}
}

/** Neutral identity is drawn identically in the editor, lobby, results and arena.
 * Squash, gait, gravity orientation and role effects remain owned by the game renderer. */
export function paintFrogCore(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,value:unknown,options:{sx?:number;sy?:number;feet?:number;online?:boolean;showPattern?:boolean;facing?:number;charging?:boolean;openMouth?:boolean}={}){
 const a=normalizeAppearance(value),bodyColor=skinFor(a).color,sx=options.sx??1,sy=options.sy??1;
  const feet=options.feet??0;g.fillStyle(INK);g.fillEllipse(x-r*.78,y+r*.68,r*1.12,10);g.fillEllipse(x+r*.78,y+r*.68,r*1.12,10);g.fillStyle(bodyColor);g.fillEllipse(x-r*.78,y+r*.65+feet,r*.88,6);g.fillEllipse(x+r*.78,y+r*.65-feet,r*.88,6);
  const bean=[[-.77,-.63],[-.34,-.89],[.35,-.87],[.8,-.6],[1,.02],[.9,.51],[.49,.84],[-.43,.84],[-.91,.53],[-1,.06]].map(([dx,dy])=>({x:x+dx*r*sx,y:y+dy*r*sy}));
  g.fillStyle(options.online===false?0x8caaa3:bodyColor);g.fillPoints(bean,true);g.lineStyle(2.5,INK);g.strokePoints(bean,true);
  g.fillStyle(0xffffff,.28);g.fillEllipse(x,y+r*.43*sy,r*1.26,r*.63*sy);
  g.lineStyle(1,0xffffff,.85);g.lineBetween(x-r*.84*sx,y+r*.08,x-r*.72*sx,y-r*.25);
  // Three splayed suction toes, a common silhouette in portraits and gameplay.
  for(const side of[-1,1])for(let toe=0;toe<3;toe++){g.fillStyle(INK);g.fillCircle(x+side*(r*.62+toe*2.8),y+r*.78+(toe%2)*1.5,2.6);g.fillStyle(bodyColor);g.fillCircle(x+side*(r*.62+toe*2.8),y+r*.78+(toe%2)*1.5,1.4);}
  if(options.showPattern!==false)paintPattern(g,x,y,r,a);
  for(const side of [-1,1])paintEye(g,x+side*r*.57*sx,y-r*.67*sy,r,a,options.facing??1,!!options.charging,side);
  g.fillStyle(0xd77270,.45);g.fillEllipse(x-r*.64,y+r*.12,5,3);g.fillEllipse(x+r*.64,y+r*.12,5,3);
  g.lineStyle(1.8,INK);g.strokePoints([{x:x-r*.36,y:y+r*.08},{x:x-r*.18,y:y+r*.24},{x:x+r*.15,y:y+r*.25},{x:x+r*.4,y:y+r*.06}],false);if(options.openMouth){g.fillStyle(INK);g.fillEllipse(x+(options.facing??1)*r*.24,y+r*.14,6,5);}
  g.fillStyle(INK);g.fillCircle(x-r*.14,y-r*.13,1);g.fillCircle(x+r*.14,y-r*.13,1);
}
/** Match the existing gameplay anchor; never seat a hat over the eyes in a portrait. */
export function hatAnchor(r:number,hat:Appearance['hat']){return -r*1.14-(['crown','cowboy','propeller'].includes(hat)?3:1);}
export function paintFrogIdentity(g:Phaser.GameObjects.Graphics,value:unknown,openMouth=false){const a=normalizeAppearance(value),r=13.5;paintFrogCore(g,0,0,r,a,{openMouth});paintHat(g,0,hatAnchor(r,a.hat),r,a.hat,0);}
export function appearancePreview(value:unknown,openMouth=false){
 const a=normalizeAppearance(value),g=new SVGGraphics();paintFrogIdentity(g as unknown as Phaser.GameObjects.Graphics,a,openMouth);
 return `<svg viewBox="0 0 120 100" role="img" aria-label="${skinFor(a).name}, ${patternFor(a).name}, ${a.eyes} eyes, ${HATS.find(h=>h.id===a.hat)!.name.toLowerCase()}"><g transform="translate(60 72) scale(1.6)">${g.markup()}</g></svg>`;
}
