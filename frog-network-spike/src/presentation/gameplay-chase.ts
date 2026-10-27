/** Hop Pursuit — an original Frog-Out cartoon-chase composition.
 * 32 authored bars, 168 BPM, D minor/Dorian; no recordings or external samples.
 * Render once in the music worker. Every note, percussion tail and room reflection
 * wraps on the exact bar clock, so the buffer represents a periodic steady state.
 */
export const GAMEPLAY_MUSIC={title:'Hop Pursuit',bpm:168,bars:32,beatsPerBar:4,sampleRate:22050,targetRms:.105,peakLimit:.72}as const;
type Voice='mallet'|'pluck'|'bass'|'reed'|'brass';
type Note=readonly[beat:number,midi:number,length:number];
// A recognizable syncopated question/answer, rather than randomly selected scale notes.
const A:readonly(readonly Note[])[]=[
 [[0,74,.42],[.75,77,.3],[1.25,81,.45],[2,79,.4],[2.75,77,.3],[3.5,76,.35]],
 [[0,74,.65],[1,69,.3],[1.75,72,.35],[2.5,74,.6],[3.5,77,.3]],
 [[0,79,.45],[.75,81,.25],[1.25,83,.45],[2,81,.4],[2.75,79,.3],[3.5,77,.35]],
 [[0,76,.6],[1,79,.3],[1.75,77,.35],[2.5,76,.4],[3.25,72,.35]],
 [[0,77,.45],[.75,81,.3],[1.5,84,.55],[2.5,81,.4],[3.25,79,.4]],
 [[0,79,.45],[.75,77,.25],[1.25,74,.45],[2,72,.35],[2.75,74,.3],[3.5,77,.35]],
 [[0,76,.5],[.75,79,.3],[1.5,81,.55],[2.5,79,.35],[3.25,76,.35]],
 [[0,73,.6],[1,76,.3],[1.75,79,.35],[2.5,76,.35],[3.25,73,.3],[3.75,76,.2]],
];
const B:readonly(readonly Note[])[]=[
 [[0,81,.7],[1,79,.35],[1.75,77,.5],[2.75,76,.35],[3.5,77,.35]],
 [[0,79,.7],[1,76,.35],[1.75,72,.5],[2.75,74,.35],[3.5,76,.35]],
 [[0,79,.45],[.75,82,.4],[1.5,81,.55],[2.5,79,.4],[3.25,77,.4]],
 [[0,76,.65],[1,73,.35],[1.75,76,.35],[2.5,79,.5],[3.5,81,.3]],
 [[0,82,.65],[1,81,.35],[1.75,77,.5],[2.75,79,.35],[3.5,81,.35]],
 [[0,79,.6],[1,77,.35],[1.75,74,.5],[2.75,72,.35],[3.5,74,.35]],
 [[0,76,.45],[.75,79,.35],[1.5,82,.5],[2.5,81,.35],[3.25,79,.4]],
 [[0,76,.6],[1,73,.35],[1.75,76,.35],[2.5,79,.5],[3.5,73,.3]],
];
const H=[
 {root:38,notes:[62,65,69,76]},{root:38,notes:[62,65,69,72]},
 {root:43,notes:[62,65,69,71]},{root:36,notes:[60,64,67,74]},
 {root:34,notes:[62,65,69,70]},{root:43,notes:[62,65,67,70]},
 {root:45,notes:[62,64,67,69]},{root:45,notes:[61,64,67,69]},
 {root:41,notes:[60,64,65,69]},{root:40,notes:[60,64,67,72]},
 {root:43,notes:[62,65,67,70]},{root:45,notes:[61,64,67,69]},
 {root:34,notes:[62,65,67,70]},{root:43,notes:[62,65,67,70]},
 {root:40,notes:[62,64,67,70]},{root:45,notes:[61,64,67,69]},
];
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
 for(let bar=0;bar<32;bar++){
  const contrast=bar>=16&&bar<24,h=H[contrast?8+bar%8:bar%8],base=bar*4,phrase=(contrast?B:A)[bar%8],returning=bar>=24;
  for(const[b,m,len]of phrase){note(m,base+b,len,contrast?.068:.108,contrast?'reed':'mallet');if(returning&&b===0)note(m-12,base+b,len,.027,'pluck');}
  // The second A phrase answers with a short lower countermelody, leaving lead space.
  if(bar>=8&&bar<16){note(h.notes[2],base+2.25,.35,.043,'mallet');note(h.notes[1],base+3.25,.35,.039,'mallet');}
  for(const [i,b]of[0,.75,1.5,2,2.75,3.5].entries()){const next=H[contrast?8+(bar+1)%8:(bar+1)%8].root,m=i===5&&bar%4===3?next-1:h.root+[0,7,12,0,7,(h.notes[1]-h.root+120)%12][i];note(m,base+b,i%2?.38:.48,.145,'bass');}
  for(let s=0;s<8;s++){if(contrast&&s%2===0)continue;note(h.notes[(s+bar%2)%4],base+s*.5+(s%2?.015:0),.23,contrast?.036:.048,'pluck');}
  if(bar%4===1||bar%4===3)for(const b of[1.75,3.25])for(const m of h.notes.slice(0,3))note(m,base+b,.24,.019,'brass');
  for(const b of[0,1.5,2.75])drum(base+b,'kick',b===0?.18:.13);
  for(const b of[1,3])drum(base+b,'snare',.12);
  for(let s=0;s<8;s++){drum(base+s*.5,'hat',s%2?.05:.035);if(!contrast&&s%2===1)drum(base+s*.5+.25,'hat',.018);}
  if(bar%8===7)for(let s=0;s<4;s++)drum(base+3+s*.25,'tom',.075,150-s*20);
 }
 // Circular early reflections preserve tails across the seam without shortening a bar,
 // fading the end, restarting a timer, or crossfading two copies of the music.
 const out=new Float32Array(n),delays=[Math.round(.5*beat*rate),Math.round(.75*beat*rate),Math.round(1.5*beat*rate)];let energy=0,peak=0;
 for(let i=0;i<n;i++){const x=Math.tanh((dry[i]+dry[(i-delays[0]+n)%n]*.13+dry[(i-delays[1]+n)%n]*.075+dry[(i-delays[2]+n)%n]*.035)*1.2);out[i]=x;energy+=x*x;peak=Math.max(peak,Math.abs(x));}
 const gain=Math.min(GAMEPLAY_MUSIC.targetRms/Math.sqrt(energy/n),GAMEPLAY_MUSIC.peakLimit/peak);
 for(let i=0;i<n;i++)out[i]*=gain;
 return out;
}
