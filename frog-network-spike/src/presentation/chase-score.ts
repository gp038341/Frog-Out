/** Canopy Chase — original brisk expedition theme. No recordings or external samples.
 * 20 bars at 155 BPM share the exact duration of Reedwater's 16 bars at 124 BPM. */
export function composeChaseMusic(rate:number,length:number){
 const data=new Float32Array(length),beat=60/155;let seed=73019;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
 const note=(midi:number,at:number,duration:number,gain:number,kind:'horn'|'strings'|'bass')=>{const hz=440*2**((midi-69)/12),offset=Math.round(at*rate),count=Math.ceil(duration*rate);for(let i=0;i<count;i++){const t=i/rate,p=2*Math.PI*hz*t,attack=Math.min(1,t/(kind==='horn'?.018:.005)),release=Math.min(1,(duration-t)/.055),wave=kind==='horn'?Math.sin(p)+.36*Math.sin(p*2)+.15*Math.sin(p*3)+.06*Math.sin(p*4):kind==='strings'?Math.sin(p)+.35*Math.sin(p*2.003)*Math.exp(-t*7)+.13*Math.sin(p*3.997)*Math.exp(-t*10):Math.sin(p)+.25*Math.sin(p*2)*Math.exp(-t*6),env=kind==='strings'?Math.exp(-t*9):kind==='bass'?Math.exp(-t*5):.8+.2*Math.exp(-t*5);data[(offset+i)%length]+=wave*attack*Math.max(0,release)*env*gain;}};
 const drum=(at:number,kind:'kick'|'snare'|'hat'|'tom',gain:number)=>{const offset=Math.round(at*rate),duration=kind==='hat'?.06:.22;let low=0;for(let i=0;i<duration*rate;i++){const t=i/rate,n=random();low+=.18*(n-low);const wave=kind==='kick'?Math.sin(2*Math.PI*(51*t+1.5*(1-Math.exp(-t*30)))):kind==='tom'?Math.sin(2*Math.PI*(112*t+1.4*(1-Math.exp(-t*18)))):kind==='hat'?(n-low)*.7:n*.75+.16*Math.sin(t*2*Math.PI*190),env=Math.min(1,t/.002)*Math.exp(-t/(kind==='hat'?.015:kind==='snare'?.04:.065));data[(offset+i)%length]+=wave*env*gain;}};
 const chords=[[38,50,53,57],[46,50,53,58],[41,53,57,60],[48,52,55,60],[38,50,53,57],[43,50,55,58],[46,50,53,58],[45,49,52,57]],themes=[[62,65,69,74,72,69,65,67],[69,72,74,77,76,72,69,65],[65,69,72,74,77,74,72,69],[67,64,67,72,71,67,64,61]];
 for(let bar=0;bar<20;bar++){const c=chords[bar%8],base=bar*4*beat,melody=themes[Math.floor(bar/4)%4];
  // A moving bass line, insistent string ostinato and a broad, answering horn melody.
  for(let step=0;step<16;step++){const at=base+step*.25*beat;note(c[1+step%3]+(step%4===3?12:0),at,.22*beat,.067,'strings');if(step%2===0){const m=melody[(step/2+bar%4)%8];note(m,at,(step%4===0?.82:.40)*beat,.105,'horn');}if(step===0||step===6||step===8||step===14)drum(at,'kick',.16);if(step===4||step===12)drum(at,'snare',.11);if(step%2===0)drum(at,'hat',.025);if(bar%4===3&&step>=12)drum(at,'tom',.085);}
  for(let step=0;step<4;step++){note(c[0]+(step%2?7:0),base+step*beat,.7*beat,.19,'bass');if(step===0||step===2)for(const n of c.slice(1))note(n,base+step*beat,.7*beat,.035,'horn');}
 }
 for(let i=0;i<length;i++)data[i]=Math.tanh(data[i]*1.05)*.85;
 return data;
}
