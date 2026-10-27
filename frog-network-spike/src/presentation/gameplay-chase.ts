/** Hop Pursuit — an original Frog-Out cartoon-chase composition.
 * 32 authored bars, 168 BPM, D minor/Dorian; no recordings or external samples.
 * Render once in the music worker. Every note, percussion tail and room reflection
 * wraps on the exact bar clock, so the buffer represents a periodic steady state.
 */
export const GAMEPLAY_MUSIC={title:'Hop Pursuit',bpm:168,bars:32,beatsPerBar:4,sampleRate:22050,targetRms:.105,peakLimit:.72}as const;
type Voice='mallet'|'pluck'|'bass'|'reed'|'brass';
type Note=readonly[beat:number,midi:number,length:number];
// One repeatable four-count groove. No off-grid kick substitutions or mid-song style switch.
export const CHASE_GROOVE={kick:[0,2],snare:[1,3],hat:[0,.5,1,1.5,2,2.5,3,3.5],bass:[0,.5,1.5,2,2.5,3.5]}as const;
const phrase=(notes:readonly number[]):readonly Note[]=>notes.map((m,i)=>[[0,.5,1,2,2.5,3][i],m,i===2||i===5?.78:.4]as const);
const A:readonly(readonly Note[])[]=[
 phrase([74,77,81,79,77,76]),phrase([74,77,81,84,81,77]),
 phrase([79,81,83,81,79,77]),phrase([76,79,84,83,79,76]),
 phrase([77,81,82,81,77,74]),phrase([79,77,74,77,79,81]),
 phrase([76,79,81,79,76,74]),
 [[0,73,.4],[.5,76,.4],[1,79,.78],[2,81,.4],[2.5,76,.4],[3,73,.5]],
];
// Same eight-bar progression on every pass; small phrase endings provide continuity/variation.
const H=[
 {root:38,notes:[62,65,69,76]},{root:38,notes:[62,65,69,72]},
 {root:43,notes:[62,65,69,71]},{root:36,notes:[60,64,67,74]},
 {root:34,notes:[62,65,69,70]},{root:43,notes:[62,65,67,70]},
 {root:45,notes:[62,64,67,69]},{root:45,notes:[61,64,67,69]},
];
export function gameplayPhrase(bar:number):readonly Note[]{const i=bar%8,a=A[i];return Math.floor(bar/8)%2===1&&(i===1||i===5)?a.map(([b,m,len],j)=>[b,j===a.length-1?m-(i===1?1:2):m,len]as const):a;}
export function composeGameplayMusic(rate:number=GAMEPLAY_MUSIC.sampleRate):Float32Array{
 const beat=60/GAMEPLAY_MUSIC.bpm,n=Math.round(GAMEPLAY_MUSIC.bars*4*beat*rate),dry=new Float32Array(n);let seed=0x46524f47;
 const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
 const note=(midi:number,at:number,beats:number,level:number,voice:Voice)=>{
  const duration=beats*beat+(voice==='mallet'?.16:voice==='pluck'?.09:.055),offset=Math.round(at*beat*rate),count=Math.ceil(duration*rate),hz=440*2**((midi-69)/12),attack=voice==='reed'||voice==='brass'?.014:.003;
  for(let i=0;i<count;i++){const t=i/rate,p=2*Math.PI*hz*t,fade=Math.sin(Math.min(1,t/attack)*Math.PI/2)**2*Math.sin(Math.min(1,(duration-t)/.045)*Math.PI/2)**2;let wave=0;
   if(voice==='mallet')wave=Math.sin(p)*Math.exp(-t*7)+.24*Math.sin(p*3.99)*Math.exp(-t*20)+.09*Math.sin(p*6.78)*Math.exp(-t*35);
   else if(voice==='pluck')wave=(Math.sin(p)+.3*Math.sin(p*2)*Math.exp(-t*14)+.12*Math.sin(p*3)*Math.exp(-t*22))*Math.exp(-t*11);
   else if(voice==='bass')wave=(Math.sin(p)+.28*Math.sin(p*2)*Math.exp(-t*8)+.07*Math.sin(p*3)*Math.exp(-t*15))*Math.exp(-t*5);
   else if(voice==='reed')wave=(Math.sin(p+.012*Math.sin(t*29))+.16*Math.sin(p*3)+.035*Math.sin(p*5))*(.72+.28*Math.exp(-t*10));
   else wave=(Math.sin(p)+.28*Math.sin(p*2)+.11*Math.sin(p*3))*(.55+.45*Math.exp(-t*16));
   dry[(offset+i)%n]+=wave*fade*level;
  }
 };
 const drum=(at:number,kind:'kick'|'snare'|'hat'|'tom',level:number,pitch=105)=>{
  const duration=kind==='hat'?.075:kind==='snare'?.16:.22,offset=Math.round(at*beat*rate);let low=0,last=0;
  for(let i=0;i<duration*rate;i++){const t=i/rate,random=noise();low+=.24*(random-low);const band=low-last;last=low;const wave=kind==='kick'?Math.sin(2*Math.PI*(49*t+1.15*(1-Math.exp(-t*35)))):kind==='tom'?Math.sin(2*Math.PI*(pitch*t+.8*(1-Math.exp(-t*24)))):kind==='hat'?band*1.3:low*.85+.14*Math.sin(2*Math.PI*185*t);const env=Math.min(1,t/.002)*Math.min(1,(duration-t)/.018)*Math.exp(-t/(kind==='hat'?.018:kind==='snare'?.035:.06));dry[(offset+i)%n]+=wave*env*level;}
 };
 for(let bar=0;bar<GAMEPLAY_MUSIC.bars;bar++){
  const h=H[bar%8],base=bar*4;
  // One blended lead throughout; changing sections never replaces the lead instrument.
  for(const[b,m,len]of gameplayPhrase(bar)){note(m,base+b,len,.095,'mallet');note(m,base+b,len,.023,'reed');}
  for(const[i,b]of CHASE_GROOVE.bass.entries())note(h.root+[0,12,7,0,(h.notes[1]-h.root+120)%12,7][i],base+b,.4,.15,'bass');
  for(let step=0;step<8;step++)note(h.notes[[0,2,1,3,0,2,1,3][step]],base+step*.5,.23,.036,'pluck');
  for(const b of CHASE_GROOVE.kick)drum(base+b,'kick',.18);
  for(const b of CHASE_GROOVE.snare)drum(base+b,'snare',.12);
  for(const[i,b]of CHASE_GROOVE.hat.entries())drum(base+b,'hat',i%2?.035:.043);
 }
 // Circular early reflections preserve tails across the seam without shortening a bar,
 // fading the end, restarting a timer, or crossfading two copies of the music.
 const out=new Float32Array(n),delays=[Math.round(.5*beat*rate),Math.round(.75*beat*rate),Math.round(1.5*beat*rate)];let energy=0,peak=0;
 for(let i=0;i<n;i++){const x=Math.tanh((dry[i]+dry[(i-delays[0]+n)%n]*.13+dry[(i-delays[1]+n)%n]*.075+dry[(i-delays[2]+n)%n]*.035)*1.2);out[i]=x;energy+=x*x;peak=Math.max(peak,Math.abs(x));}
 const gain=Math.min(GAMEPLAY_MUSIC.targetRms/Math.sqrt(energy/n),GAMEPLAY_MUSIC.peakLimit/peak);
 for(let i=0;i<n;i++)out[i]*=gain;
 return out;
}
