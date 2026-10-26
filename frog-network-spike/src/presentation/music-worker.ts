import {composePondMusic,type MusicScore} from './music-score';
const worker=self as unknown as {onmessage:((event:MessageEvent)=>void)|null;postMessage:(data:MusicScore,transfer:Transferable[])=>void};
worker.onmessage=()=>{const score:MusicScore={lobby:composePondMusic('lobby'),adventure:new Float32Array(1)};worker.postMessage(score,[score.lobby.buffer as ArrayBuffer,score.adventure.buffer as ArrayBuffer]);};
