import {composePondMusic} from './music-score';
const worker=self as unknown as {onmessage:((event:MessageEvent)=>void)|null;postMessage:(data:Float32Array,transfer:Transferable[])=>void};
worker.onmessage=()=>{const samples=composePondMusic();worker.postMessage(samples,[samples.buffer as ArrayBuffer]);};
