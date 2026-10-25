/** Reedwater — original Frog-Out theme, in two synchronized arrangements.
 * Modal/minor adventure, warm strings/reeds, restrained percussion; no external samples. */
export type MusicMood='lobby'|'adventure';
export type MusicScore=Record<MusicMood,Float32Array>;
export const MUSIC={title:'Reedwater',bpm:124,bars:16,sampleRate:22050,defaultVolume:.30} as const;
export function composePondMusic(mood:MusicMood='lobby'){
 const rate=MUSIC.sampleRate,beat=60/MUSIC.bpm,length=Math.round(MUSIC.bars*4*beat*rate),data=new Float32Array(length),busy=mood==='adventure';let seed=59287;
 const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
 const note=(midi:number,start:number,duration:number,level:number,kind:'reed'|'string'|'bass'|'pad')=>{const hz=440*2**((midi-69)/12),count=Math.ceil(duration*rate),offset=Math.round(start*rate);for(let i=0;i<count;i++){const t=i/rate,phase=2*Math.PI*hz*t,attack=Math.min(1,t/(kind==='pad'?.18:kind==='reed'?.025:.006)),release=Math.max(0,Math.min(1,(duration-t)/(kind==='pad'?.28:.08)));let wave:number,envelope:number;
  if(kind==='string'){wave=Math.sin(phase)+.3*Math.sin(phase*2.001)*Math.exp(-t*6)+.15*Math.sin(phase*3.997)*Math.exp(-t*12);envelope=Math.exp(-t*5);}
  else if(kind==='reed'){const vibrato=phase+.045*Math.sin(t*2*Math.PI*4.6);wave=Math.sin(vibrato)+.19*Math.sin(vibrato*3)+.055*Math.sin(vibrato*5);envelope=.7+.3*Math.exp(-t*4);}
  else if(kind==='bass'){wave=Math.sin(phase)+.22*Math.sin(phase*2)*Math.exp(-t*4);envelope=Math.exp(-t*3.8);}
  else{wave=Math.sin(phase)+.35*Math.sin(phase*1.002)+.12*Math.sin(phase*2);envelope=1;}
  data[(offset+i)%length]+=wave*attack*release*envelope*level;
 }};
 const drum=(start:number,kind:'kick'|'hat'|'snare'|'tom',level:number)=>{const duration=kind==='hat'?.065:.22,count=Math.ceil(duration*rate),offset=Math.round(start*rate);let last=0;for(let i=0;i<count;i++){const t=i/rate,n=noise(),high=n-last;last=n;const wave=kind==='kick'?Math.sin(2*Math.PI*(48*t+1.6*(1-Math.exp(-t*28)))):kind==='tom'?Math.sin(2*Math.PI*(93*t+.9*(1-Math.exp(-t*20)))):kind==='hat'?high*.65:n*.65+.15*Math.sin(2*Math.PI*180*t);const env=Math.min(1,t/.003)*Math.exp(-t/(kind==='hat'?.018:kind==='snare'?.045:.075));data[(offset+i)%length]+=wave*env*level;}};
 const chords=[[38,53,57,60,64],[38,53,57,60,64],[43,55,59,62,64],[43,55,59,62,64],[46,53,57,62,65],[48,55,60,62,64],[45,55,60,64,67],[45,55,61,64,67],[38,53,57,60,64],[41,53,57,60,64],[43,55,59,62,64],[40,55,58,62,65],[46,53,57,62,65],[43,55,58,62,64],[45,55,61,64,67],[45,55,61,64,67]];
 // Original longer phrases: a descending answer and a minor/dominant turnaround.
 const melody:number[][]=[[69,-1,72,74,-1,72,69,67],[65,-1,-1,64,65,69,-1,-1],[67,-1,71,74,-1,76,74,71],[69,-1,-1,67,64,-1,-1,-1],[65,-1,69,74,-1,77,76,74],[72,-1,-1,69,67,-1,64,-1],[64,-1,67,72,-1,76,72,69],[73,-1,-1,71,69,-1,67,-1],[74,-1,76,77,-1,76,74,72],[69,-1,-1,65,64,65,-1,-1],[67,-1,71,74,-1,76,74,71],[70,-1,74,77,-1,76,74,-1],[69,-1,74,77,-1,76,74,69],[67,-1,-1,70,74,-1,72,-1],[73,-1,76,79,-1,76,73,71],[69,-1,-1,67,64,-1,61,-1]];
 for(let bar=0;bar<MUSIC.bars;bar++){const c=chords[bar],base=bar*4*beat;
  for(const n of c.slice(1,4))note(n,base,4.3*beat,busy?.008:.021,'pad');
  const pattern=busy?[0,2,1,3,0,2,1,3]:[0,-1,2,-1,1,-1,3,-1];
  for(let step=0;step<8;step++){const at=base+step*.5*beat,index=pattern[step];if(index>=0)note(c[1+index],at,.45,busy?.061:.053,'string');const m=melody[bar][step];if(busy&&m>=0)note(m,at,(step===0?.7:.46)*beat,.091,'reed');
   if(busy){drum(at,'hat',step%2?.012:.018);if(step===0||step===3||step===4||step===7)drum(at,'kick',step===3||step===7?.055:.105);if(step===2||step===6)drum(at,'snare',.058);if(bar%4===3&&step>=6)drum(at,'tom',.048);}
   else{if(step===0)drum(at,'kick',.045);if(step===4)drum(at,'snare',.018);if(step%2===1)drum(at,'hat',.008);}
  }
  for(const step of busy?[0,1.5,2,3.5]:[0,2])note(c[0]+(step===1.5||step===3.5?7:0),base+step*beat,(busy?.7:1.3)*beat,busy?.16:.10,'bass');
  if(!busy){note(melody[bar][0]-12,base+.5*beat,1.5*beat,.044,'reed');const answer=[...melody[bar]].reverse().find(n=>n>=0)!;note(answer-12,base+2.5*beat,1.2*beat,.037,'reed');}
 }
 // Tails wrap at the seam; both arrangements share an exact bar clock.
 for(let i=0;i<data.length;i++)data[i]=Math.tanh(data[i]*1.05)*.85;
 return data;
}
export function composeSoundtrack():MusicScore{return{lobby:composePondMusic('lobby'),adventure:composePondMusic('adventure')};}
