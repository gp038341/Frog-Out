import type {Connection} from '../network/client';
import type {LobbyState,PlayerInfo} from '../network/protocol';
import {isCPU} from '../game/participants';
import {SKINS,EYES,HATS,normalizeAppearance} from '../presentation/cosmetics';
export function decorateCPUSeat(li:HTMLElement,p:PlayerInfo|undefined,seat:number,lobby:LobbyState,net:Connection){if(lobby.phase!=='lobby'||lobby.hostId!==net.playerId)return;
 if(!p){const add=document.createElement('button');add.className='cpu-slot-action';add.textContent='Add CPU';add.setAttribute('aria-label',`Add CPU to spot ${seat+1}`);add.onclick=()=>net.addCPU(seat);li.append(add);return;}
 if(!isCPU(p))return;li.classList.add('cpu-seat');const remove=document.createElement('button');remove.className='cpu-slot-action';remove.textContent='Remove CPU';remove.onclick=()=>net.removeCPU(p.id);li.append(remove);
 const edit=document.createElement('details');edit.className='cpu-editor';const summary=document.createElement('summary');summary.textContent='Edit CPU frog';edit.append(summary);
 for(const[key,label,options]of [['skin','Color & pattern',SKINS],['eyes','Eye expression',EYES],['hat','Hat',HATS]]as const){const wrap=document.createElement('label');wrap.textContent=label;const select=document.createElement('select');select.setAttribute('aria-label',`${p.name}: ${label}`);for(const option of options){const o=document.createElement('option');o.value=option.id;o.textContent=option.name;select.append(o);}select.value=normalizeAppearance(p.appearance)[key];select.onchange=()=>net.cpuAppearance(p.id,normalizeAppearance({...p.appearance,[key]:select.value}));wrap.append(select);edit.append(wrap);}li.append(edit);
}
