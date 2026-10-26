/** Original non-pitched hand-clap applause. Layered palm transients, not a melody,
 * with independent timing/strength and a short diffuse room tail; no recordings. */
export const APPLAUSE_SECONDS=2.1;
export function applauseSamples(rate:number){
 const data=new Float32Array(Math.ceil(rate*APPLAUSE_SECONDS));let seed=71839;
 const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
 for(let clap=0;clap<18;clap++){
  const at=.035+clap*.093+noise()*.022,gain=(.57+noise()*.14)*(1-Math.max(0,clap-12)*.075),offset=Math.floor(at*rate);let bass=0,air=0;
  for(let i=0;i<rate*.22;i++){const t=i/rate,n=noise();bass+=.055*(n-bass);air+=.65*(n-bass-air);
   const palm=(delay:number,level:number)=>t>=delay?level*Math.min(1,(t-delay)/.0012)*Math.exp(-(t-delay)/.010):0;
   const envelope=palm(0,1)+palm(.010,.72)+palm(.024,.45)+Math.exp(-t/.055)*.13;
   if(offset+i<data.length)data[offset+i]+=air*envelope*gain;
  }
 }
 for(let i=0;i<data.length;i++)data[i]=Math.tanh(data[i]*1.5)*.9;
 return data;
}
