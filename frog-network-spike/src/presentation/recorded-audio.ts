/** Locally served, CC0 recordings. Full provenance and edits: public/audio/credits.json. */
export const RECORDINGS={adventure:'/audio/pond-adventure.mp3',applause:'/audio/audience-applause.mp3'} as const;
export async function decodeRecording(context:BaseAudioContext,url:string){
 const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),12000);
 try{const response=await fetch(url,{signal:abort.signal});if(!response.ok)throw Error('Audio asset unavailable');return await context.decodeAudioData(await response.arrayBuffer());}finally{clearTimeout(timer);}
}
/** One-time mono/resample for the existing music buffer interface; no additional player. */
export function musicSamples(buffer:AudioBuffer,rate:number){
 const length=Math.max(1,Math.round(buffer.duration*rate)),out=new Float32Array(length),channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
 for(let i=0;i<length;i++){const at=i*buffer.sampleRate/rate,left=Math.floor(at),fraction=at-left;for(const c of channels){const a=c[Math.min(left,c.length-1)],b=c[Math.min(left+1,c.length-1)];out[i]+=(a+(b-a)*fraction)/channels.length;}}
 return out;
}
export function roundMusicActive(roomPhase:string|undefined,roundPhase:string|undefined,voting=false){return roomPhase==='game'&&!voting&&['announcement','countdown','playing'].includes(roundPhase??'');}
