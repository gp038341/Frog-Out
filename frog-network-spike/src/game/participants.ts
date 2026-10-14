import type {PlayerInfo} from '../network/protocol';
export const isCPU=(p:PlayerInfo|undefined)=>p?.kind==='cpu';
export const connectedHuman=(p:PlayerInfo)=>!isCPU(p)&&p.connected;
export const participating=(p:PlayerInfo|undefined)=>!!p&&(isCPU(p)||p.connected);
export const readyParticipant=(p:PlayerInfo)=>isCPU(p)||p.connected&&p.ready;
export function admissionSeat(players:Iterable<PlayerInfo>){const all=[...players],used=new Set(all.map(p=>p.lobbySeat));const empty=Array.from({length:8},(_,i)=>i).find(i=>!used.has(i));if(all.length<8&&empty!==undefined)return{seat:empty};const cpu=all.filter(isCPU).sort((a,b)=>a.cpuOrder!-b.cpuOrder!)[0];return cpu?{seat:cpu.lobbySeat!,replace:cpu.id}:undefined;}
