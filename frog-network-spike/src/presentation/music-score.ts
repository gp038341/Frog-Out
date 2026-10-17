/** Pondside Pandemonium — original Frog-Out composition and procedural instruments.
 * 16 bars, C-major / A-minor, 116 BPM. No samples, third-party music or services. */
export const MUSIC={title:'Pondside Pandemonium',bpm:116,bars:16,sampleRate:22050,defaultVolume:.30} as const;
export function composePondMusic(){
 const rate=MUSIC.sampleRate,beat=60/MUSIC.bpm,length=Math.round(16*4*beat*rate),data=new Float32Array(length);let seed=6741;
 const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
 const note=(midi:number,start:number,duration:number,level:number,kind:'mallet'|'bass'|'chord'|'wood')=>{const hz=440*2**((midi-69)/12),count=Math.ceil(duration*rate),offset=Math.round(start*rate);for(let i=0;i<count;i++){const t=i/rate,phase=2*Math.PI*hz*t,attack=Math.min(1,t/.005),release=Math.min(1,(duration-t)/.035),decay=Math.exp(-t/(kind==='bass'?.22:kind==='chord'?.16:.12));const wave=kind==='wood'?Math.sin(phase)*Math.exp(-t*40)+.23*Math.sin(phase*2.7)*Math.exp(-t*70):kind==='bass'?Math.sin(phase)+.15*Math.sin(phase*2):Math.sin(phase)+.22*Math.sin(phase*2.003)+.08*Math.sin(phase*3.98);data[(offset+i)%length]+=wave*attack*Math.max(0,release)*decay*level;}};
 const drum=(start:number,kind:'kick'|'hat'|'clap',accent=1)=>{const duration=kind==='hat'?.045:.14,count=Math.ceil(duration*rate),offset=Math.round(start*rate);for(let i=0;i<count;i++){const t=i/rate,envelope=Math.min(1,t/.002)*Math.exp(-t/(kind==='hat'?.012:.035)),wave=kind==='kick'?Math.sin(2*Math.PI*(48*t+1.8*(1-Math.exp(-t*35)))):noise()*(kind==='clap'?.6:1);data[(offset+i)%length]+=wave*envelope*(kind==='kick'?.18:kind==='clap'?.055:.025)*accent;}};
 // Original call-and-response melody. Half-beat syncopations keep the loop buoyant.
 const melody:number[][]=[
 [76,-1,79,81,-1,79,76,74],[72,-1,76,-1,79,76,74,-1],
 [77,-1,81,79,-1,77,76,74],[74,-1,79,-1,83,81,79,-1],
 [76,79,-1,84,-1,81,79,76],[72,-1,76,79,-1,76,74,-1],
 [77,81,-1,84,81,-1,79,77],[79,-1,83,81,79,-1,74,-1],
 [81,-1,84,86,-1,84,81,79],[79,76,-1,72,-1,76,79,-1],
 [81,-1,84,81,79,-1,77,76],[74,77,-1,81,-1,79,77,-1],
 [76,-1,79,84,-1,79,76,74],[77,-1,81,84,81,-1,79,77],
 [79,83,-1,86,-1,83,81,79],[74,-1,79,-1,76,-1,74,-1]
 ];
 const chords=[[48,52,55,57],[45,48,52,55],[41,45,48,50],[43,47,50,52],[48,52,55,57],[45,48,52,55],[41,45,48,50],[43,47,50,52],[45,48,52,55],[48,52,55,57],[41,45,48,50],[38,41,45,48],[48,52,55,57],[41,45,48,50],[43,47,50,52],[43,47,50,52]];
 for(let bar=0;bar<16;bar++){const chord=chords[bar],base=bar*4*beat;for(let step=0;step<8;step++){const time=base+(step*.5+(step%2?.025:0))*beat,m=melody[bar][step];if(m>=0)note(m,time,.27,step%2?.15:.20,'mallet');drum(time,'hat',step%2?.65:1);if(step===0||step===4||step===7)drum(time,'kick',step===7?.6:1);if(step===2||step===6)drum(time,'clap');if(step===1||step===3||step===5||step===7)for(const n of chord.slice(1))note(n+12,time,.18,.031,'chord');}
  for(const [step,m]of [[0,chord[0]],[1.5,chord[0]+12],[2,chord[0]+7],[3.5,chord[0]+12]])note(m,base+step*beat,.32,.19,'bass');if(bar%2===1)note(68,base+3.75*beat,.07,.035,'wood');
 }
 // Wrap note tails into the beginning: the buffer seam is part of the composition, not a silence gap.
 for(let i=0;i<data.length;i++)data[i]=Math.tanh(data[i]*1.1)*.8;
 return data;
}
