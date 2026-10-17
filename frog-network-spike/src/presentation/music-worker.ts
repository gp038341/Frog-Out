import {composeSoundtrack,type MusicScore} from './music-score';
const worker=self as unknown as {onmessage:((event:MessageEvent)=>void)|null;postMessage:(data:MusicScore,transfer:Transferable[])=>void};
worker.onmessage=()=>{const score=composeSoundtrack();worker.postMessage(score,[score.lobby.buffer as ArrayBuffer,score.adventure.buffer as ArrayBuffer]);};
