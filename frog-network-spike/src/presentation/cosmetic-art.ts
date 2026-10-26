import type Phaser from 'phaser';
import {type Appearance,skinFor,normalizeAppearance} from './cosmetics';
const INK=0x292431;
/** Tiny vector attachments, in render coordinates only; no collision or input changes. */
export function paintPattern(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,a:Appearance){const s=skinFor(a);g.fillStyle(s.mark,.85);g.lineStyle(Math.max(1,r*.12),s.mark,.85);if(s.pattern==='stripe'){g.lineBetween(x-r*.5,y-r*.12,x+r*.5,y-r*.12);}else if(s.pattern==='chevron'){g.lineBetween(x-r*.4,y-r*.22,x,y+r*.05);g.lineBetween(x,y+r*.05,x+r*.4,y-r*.22);}else for(const side of [-1,1]){const cx=x+side*r*.56,cy=y+r*.13;if(s.pattern==='diamonds')g.fillPoints([{x:cx,y:cy-3},{x:cx+3,y:cy},{x:cx,y:cy+3},{x:cx-3,y:cy}],true);else{g.fillCircle(cx,cy,s.pattern==='spots'?2.5:1.6);if(s.pattern==='freckles')g.fillCircle(x+side*r*.35,y+r*.3,1.3);}}}
export function paintEye(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number,a:Appearance,facing:number,charging:boolean,side:number){g.fillStyle(INK);g.fillCircle(x,y,r*.47);g.fillStyle(0xfffbea);g.fillCircle(x,y,r*.37);g.fillStyle(INK);const radius=a.eyes==='surprised'?r*.25:r*.2;g.fillCircle(x+facing*2,y+(charging?1:-1),radius);g.lineStyle(2,INK);if(a.eyes==='sleepy'){g.fillStyle(skinFor(a).color);g.fillRect(x-r*.36,y-r*.36,r*.72,r*.37);g.lineBetween(x-r*.32,y,x+r*.32,y);}if(a.eyes==='determined')g.lineBetween(x-r*.35,y-r*.27-side*2,x+r*.35,y-r*.27+side*2);if(a.eyes==='mischievous'&&side===1){g.fillStyle(skinFor(a).color);g.fillRect(x-r*.36,y-r*.34,r*.72,r*.3);g.lineBetween(x-r*.3,y-r*.05,x+r*.3,y-r*.12);}if(a.eyes==='cheerful'){g.fillStyle(0xffffff);g.fillCircle(x+facing*2-1,y-2,r*.07);}}
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
 if(hat==='flower'){g.lineStyle(2,0x407d55);g.lineBetween(x,y,x+4,y-9);g.fillStyle(0xfff8d8);for(let j=0;j<5;j++)g.fillCircle(x+4+Math.cos(j*Math.PI*2/5)*4,y-10+Math.sin(j*Math.PI*2/5)*4,3);g.fillStyle(0xffc868);g.fillCircle(x+4,y-10,3);}
}
/** Lightweight lobby portrait, generated from the same catalog; only fixed strings/IDs enter markup. */
export function appearancePreview(value:unknown,openMouth=false){const a=normalizeAppearance(value),s=skinFor(a),color='#'+s.color.toString(16).padStart(6,'0'),mark='#'+s.mark.toString(16).padStart(6,'0');const pattern=s.pattern==='stripe'?`<path d="M37 61h46" stroke="${mark}" stroke-width="5"/>`:s.pattern==='chevron'?`<path d="M40 57l20 14 20-14" fill="none" stroke="${mark}" stroke-width="5"/>`:s.pattern==='diamonds'?`<path d="M35 64l5-5 5 5-5 5zM75 64l5-5 5 5-5 5z" fill="${mark}"/>`:`<g fill="${mark}"><circle cx="37" cy="64" r="${s.pattern==='spots'?5:3}"/><circle cx="83" cy="64" r="${s.pattern==='spots'?5:3}"/><circle cx="46" cy="74" r="3"/><circle cx="74" cy="74" r="3"/></g>`;
// Original expression strokes and pupils; only the upper eyelid receives skin-colored fill.
const upperLid=(cx:number,bottom=40)=>`<path d="M${cx-13.3} ${bottom}V38a13.3 13.3 0 0 1 26.6 0v${bottom-38}Z" fill="${color}"/>`;
const lids=a.eyes==='sleepy'?upperLid(39)+upperLid(81):a.eyes==='mischievous'?`<path d="M68 34a13.3 13.3 0 0 1 25-3L88 31 71 34Z" fill="${color}"/>`:'';
const eyes=a.eyes==='sleepy'?'<path d="M30 40h20m20 0h20" stroke="#142f35" stroke-width="4"/>':`<circle cx="42" cy="39" r="${a.eyes==='surprised'?7:5}"/><circle cx="82" cy="39" r="${a.eyes==='surprised'?7:5}"/>${a.eyes==='determined'?'<path d="M30 29l20 6m20 0 20-6" stroke="#142f35" stroke-width="4"/>':a.eyes==='mischievous'?'<path d="M71 34l17-3" stroke="#142f35" stroke-width="6"/>':''}`;
const hats:Record<Appearance['hat'],string>={
 none:'',crown:'<g transform="translate(0 -2)"><path d="M48 24l-3-13 10 7 6-12 6 12 10-7-3 13z" fill="#ffab87"/></g>',
 mushroom:'<rect x="54" y="27" width="12" height="9" rx="3" fill="#fff7d9"/><path d="M37 29Q38 7 60 7Q82 7 83 29Z" fill="#f37c83"/><ellipse cx="60" cy="29" rx="23" ry="4" fill="#fff7d9"/><g fill="#fff7d9" stroke="none"><circle cx="48" cy="21" r="4"/><circle cx="62" cy="14" r="5"/><circle cx="74" cy="22" r="3.5"/></g>',
 cowboy:'<rect x="46" y="5" width="28" height="13" rx="5" fill="#dba46b"/><ellipse cx="60" cy="18" rx="26" ry="3" fill="#dba46b"/>',
 propeller:'<path d="M41 18Q42 9 60 9Q78 9 79 18Z" fill="#80cde6"/><path d="M54 10Q60 8 64 10L68 18H54Z" fill="#ffa397"/><rect x="40" y="17" width="40" height="4" rx="2" fill="#95dfb9"/><path d="M60 9V4"/><g fill="#ffd67d"><ellipse cx="49" cy="4" rx="12" ry="2"/><ellipse cx="71" cy="4" rx="12" ry="2"/></g><circle cx="60" cy="4" r="2.5" fill="#f37c83"/>',
 party:'<path d="M45 33L60 7l15 26Z" fill="#ffa7ce"/><path d="M49 25l17-8 3 5-23 10Z" fill="#80dce0"/><ellipse cx="60" cy="33" rx="16" ry="3.5" fill="#ffdf7c"/><circle cx="60" cy="7" r="3.5" fill="#ffdf7c"/><circle cx="59" cy="17" r="2" fill="#ffdf7c" stroke="none"/>',
 flower:'<g transform="translate(0 9)"><path d="M60 25l6-13" stroke="#407d55"/><g fill="#fff8d9"><circle cx="65" cy="8" r="5"/><circle cx="73" cy="13" r="5"/><circle cx="64" cy="18" r="5"/><circle cx="58" cy="12" r="5"/></g><circle cx="65" cy="12" r="4" fill="#ffc868"/></g>'};
const mouth=openMouth?'<path d="M46 62Q60 67 74 62Q73 79 60 79Q47 79 46 62Z" fill="#563749" stroke="#292431" stroke-width="2"/><ellipse cx="60" cy="75" rx="9" ry="3" fill="#ee839d"/>':'<path d="M45 62Q59 76 76 61" fill="none" stroke="#292431" stroke-width="3" stroke-linecap="round"/>';
return `<svg viewBox="0 0 120 100" role="img" aria-label="${s.name}, ${a.eyes} eyes, ${HAT_LABEL[a.hat]}"><ellipse cx="60" cy="91" rx="37" ry="4" fill="#292431" opacity=".12"/><g stroke="#292431" stroke-width="3" stroke-linejoin="round"><path d="M28 71Q12 77 15 85L25 87 30 90 43 83M91 71Q109 77 106 85L95 87 90 90 77 83" fill="${color}"/><path d="M22 62Q22 40 42 34Q62 27 81 35Q99 44 99 66Q97 83 78 87H42Q22 84 22 62Z" fill="${color}"/></g><path d="M39 72Q60 62 81 72Q85 86 60 85Q35 86 39 72Z" fill="#fff1ce" opacity=".66"/>${pattern}<path d="M27 62Q27 49 33 45" fill="none" stroke="#fff1ce" stroke-width="2" stroke-linecap="round" opacity=".65"/><g fill="#fffbea" stroke="#292431" stroke-width="3"><circle cx="39" cy="38" r="15"/><circle cx="81" cy="38" r="15"/></g><g fill="#292431">${lids}${eyes}</g><g fill="#d77270" opacity=".5"><ellipse cx="34" cy="59" rx="5" ry="3"/><ellipse cx="86" cy="59" rx="5" ry="3"/></g><g fill="#292431"><circle cx="55" cy="54" r="1.3"/><circle cx="65" cy="54" r="1.3"/></g>${mouth}<g fill="${color}" stroke="#292431" stroke-width="1.5"><circle cx="18" cy="86" r="3"/><circle cx="25" cy="89" r="3"/><circle cx="33" cy="87" r="3"/><circle cx="102" cy="86" r="3"/><circle cx="95" cy="89" r="3"/><circle cx="87" cy="87" r="3"/></g><g stroke="#292431" stroke-width="2" stroke-linejoin="round">${hats[a.hat]}</g></svg>`;}

const HAT_LABEL={none:'no hat',crown:'tiny crown',mushroom:'mushroom cap',cowboy:'cowboy hat',propeller:'propeller beanie',party:'party cone',flower:'daisy bonnet'};
