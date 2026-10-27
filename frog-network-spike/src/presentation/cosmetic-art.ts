import type Phaser from 'phaser';
import {type Appearance,skinFor,patternFor,normalizeAppearance,HATS} from './cosmetics';
import {SVGGraphics} from './svg-graphics';
import {PortraitPen,PORTRAIT_BODY,PORTRAIT_LEFT_FOOT,PORTRAIT_RIGHT_FOOT} from './portrait-geometry';
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
/** Original lobby hat silhouettes, seated above the original round eyes. */
export function paintHat(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,hat:Appearance['hat'],time:number){
 const p=new PortraitPen(g,x,y,r,1,1,20,hat==='mushroom'||hat==='party'?-15:0);
 if(hat==='crown')p.path('M48 22L45 9 55 16 61 4 67 16 77 9 74 22Z',0xffab87,INK,2);
 if(hat==='mushroom'){p.rect(54,27,12,9,3,0xfff7d9,INK);p.path('M37 29Q38 7 60 7Q82 7 83 29Z',0xf37c83,INK,2);p.ellipse(60,29,23,4,0xfff7d9,INK,2);for(const[cx,cy,rr]of[[48,21,4],[62,14,5],[74,22,3.5]])p.ellipse(cx,cy,rr,rr,0xfff7d9);}
 if(hat==='cowboy'){p.rect(46,5,28,13,5,0xdba46b,INK);p.ellipse(60,18,26,3,0xdba46b,INK,2);}
 if(hat==='propeller'){p.path('M41 18Q42 9 60 9Q78 9 79 18Z',0x80cde6,INK,2);p.path('M54 10Q60 8 64 10L68 18H54Z',0xffa397,INK,2);p.rect(40,17,40,4,2,0x95dfb9,INK);p.line([{x:60,y:9},{x:60,y:4}],INK,2);const wobble=Math.sin(time*9);p.ellipse(49,4-wobble,12,2,0xffd67d,INK,2);p.ellipse(71,4+wobble,12,2,0xffd67d,INK,2);p.ellipse(60,4,2.5,2.5,0xf37c83,INK,2);}
 if(hat==='party'){p.path('M45 33L60 7 75 33Z',0xffa7ce,INK,2);p.path('M49 25L66 17 69 22 46 32Z',0x80dce0,INK,2);p.ellipse(60,33,16,3.5,0xffdf7c,INK,2);p.ellipse(60,7,3.5,3.5,0xffdf7c,INK,2);p.ellipse(59,17,2,2,0xffdf7c);}
 if(hat==='flower'){p.line([{x:60,y:31},{x:65,y:21}],0x407d55,2);for(let j=0;j<5;j++)p.ellipse(65+Math.cos(j*Math.PI*2/5)*6,21+Math.sin(j*Math.PI*2/5)*6,4,4,0xfff8d8,INK,2);p.ellipse(65,21,4,4,0xffc868,INK,2);}
 if(hat==='rain'){p.rect(43,3,34,17,7,0xffd66c,INK);p.ellipse(60,20,27,3.5,0xffd66c,INK,2);p.line([{x:44,y:15},{x:76,y:15}],0xb76039,2);}
 if(hat==='sprout'){p.line([{x:60,y:22},{x:60,y:2}],0x317d70,3);p.path('M60 9Q40 10 42 -3Q58 -3 60 9Z',0x8ce7c5,INK,2);p.path('M60 9Q61 -5 77 -4Q80 9 60 9Z',0xc5e96e,INK,2);}
 if(hat==='bow'){p.path('M58 10L40 2Q37 14 40 23L58 16Z',0xff8d91,INK,2);p.path('M62 10L80 2Q83 14 80 23L62 16Z',0xff8d91,INK,2);p.ellipse(60,13,5,5,0xffd66c,INK,2);}
}

/** The approved rounded lobby frog is the source artwork, including its original face. */
export function paintFrogCore(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,value:unknown,options:{sx?:number;sy?:number;feet?:number;online?:boolean;showPattern?:boolean;facing?:number;charging?:boolean;openMouth?:boolean}={}){
 const a=normalizeAppearance(value),color=skinFor(a).color,p=new PortraitPen(g,x,y,r,options.sx??1,options.sy??1),foot=(options.feet??0)/p.scale;
 const left=new PortraitPen(g,x,y,r,options.sx??1,options.sy??1,54,foot),right=new PortraitPen(g,x,y,r,options.sx??1,options.sy??1,54,-foot);
 left.path(PORTRAIT_LEFT_FOOT,color,INK);right.path(PORTRAIT_RIGHT_FOOT,color,INK);
 p.path(PORTRAIT_BODY,options.online===false?0x8caaa3:color,INK);
 p.path('M39 72Q60 62 81 72Q85 86 60 85Q35 86 39 72Z',0xfff1ce,undefined,0,.66);
 if(options.showPattern!==false){const center=p.point(60,60);paintPattern(g,center.x,center.y,r,a);}
 p.path('M27 62Q27 49 33 45',undefined,0xfff1ce,2,.65);
 for(const cx of[39,81])p.ellipse(cx,38,15,15,0xfffbea,INK);
 const gaze=((options.facing??1)-1)*1.5,ey=options.charging?1:0;
 if(a.eyes!=='sleepy')for(const cx of[42,82])p.ellipse(cx+gaze,39+ey,a.eyes==='surprised'?7:5,a.eyes==='surprised'?7:5,INK);
 const upperLid=(cx:number)=>p.path(`M${cx-13.3} 40V38C${cx-13.3} 30.654 ${cx-7.346} 24.7 ${cx} 24.7C${cx+7.346} 24.7 ${cx+13.3} 30.654 ${cx+13.3} 38V40Z`,color);
 if(a.eyes==='sleepy'){upperLid(39);upperLid(81);for(const cx of[40,80])p.line([{x:cx-10,y:40},{x:cx+10,y:40}],0x142f35,4);}
 if(a.eyes==='determined'){p.line([{x:30,y:29},{x:50,y:35}],0x142f35,4);p.line([{x:70,y:35},{x:90,y:29}],0x142f35,4);}
 if(a.eyes==='mischievous'){p.path('M68 34Q67 21 81 24Q91 24 93 31L88 31 71 34Z',color);p.line([{x:71,y:34},{x:88,y:31}],0x142f35,6);}
 if(a.eyes==='wink'){p.ellipse(81,38,13.3,13.3,color);p.line([{x:71,y:40},{x:91,y:38}],INK,3);}
 if(a.eyes==='joyful'){for(const cx of[39,81]){p.ellipse(cx,38,13.3,13.3,color);p.path(`M${cx-9} 41Q${cx} 28 ${cx+9} 41`,undefined,INK,3);}}
 if(a.eyes==='worried'){p.line([{x:29,y:34},{x:48,y:29}],INK,3);p.line([{x:72,y:29},{x:91,y:34}],INK,3);}
 p.ellipse(34,59,5,3,0xd77270,undefined,0,.5);p.ellipse(86,59,5,3,0xd77270,undefined,0,.5);
 p.ellipse(55,54,1.3,1.3,INK);p.ellipse(65,54,1.3,1.3,INK);
 if(options.openMouth){p.path('M46 62Q60 67 74 62Q73 79 60 79Q47 79 46 62Z',0x563749,INK,2);p.ellipse(60,75,9,3,0xee839d);}else p.path('M45 62Q59 76 76 61',undefined,INK,3);
 for(const[cx,cy]of[[18,86],[25,89],[33,87]])left.ellipse(cx,cy,3,3,color,INK,1.5);
 for(const[cx,cy]of[[102,86],[95,89],[87,87]])right.ellipse(cx,cy,3,3,color,INK,1.5);
}
/** Canonical hat base y=20, above the original eyes (top y=23). */
export function hatAnchor(r:number,_hat:Appearance['hat']){return (20-54)*r/38.5;}
export function paintFrogIdentity(g:Phaser.GameObjects.Graphics,value:unknown,openMouth=false){const a=normalizeAppearance(value),r=13.5;paintFrogCore(g,0,0,r,a,{openMouth});paintHat(g,0,hatAnchor(r,a.hat),r,a.hat,0);}
export function appearancePreview(value:unknown,openMouth=false){
 const a=normalizeAppearance(value),g=new SVGGraphics();paintFrogIdentity(g as unknown as Phaser.GameObjects.Graphics,a,openMouth);
 return `<svg viewBox="0 0 120 100" overflow="visible" role="img" aria-label="${skinFor(a).name}, ${patternFor(a).name}, ${a.eyes} eyes, ${HATS.find(h=>h.id===a.hat)!.name.toLowerCase()}"><ellipse cx="60" cy="91" rx="37" ry="4" fill="#292431" opacity=".12"/><g transform="translate(60 54) scale(${38.5/13.5})">${g.markup()}</g></svg>`;
}
