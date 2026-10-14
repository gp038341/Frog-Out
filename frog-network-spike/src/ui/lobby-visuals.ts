import {participating} from '../game/participants';
import type {PlayerInfo} from '../network/protocol';
import {appearancePreview} from '../presentation/cosmetic-art';
import {skinFor} from '../presentation/cosmetics';
export function lobbySeats(players:readonly PlayerInfo[],reserved:readonly PlayerInfo[]=[]){const visible=[...players,...reserved].filter(p=>participating(p)||p.reconnectUntil);return Array.from({length:8},(_,i)=>visible.find(p=>p.lobbySeat===i)??visible.filter(p=>p.lobbySeat===undefined)[i]);}
export function votersFor(choice:string,votes:Record<string,string>,players:readonly PlayerInfo[]){return players.filter(p=>participating(p)&&votes[p.id]===choice);}
export function frogStampColor(player:PlayerInfo){return '#'+skinFor(player.appearance).color.toString(16).padStart(6,'0');}
/** Five splayed toe pads joined by pointed webbing: a frog's hind-foot print. */
export const footStamp='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M16 35L8 21 3 17l9 2-1-12 8 12L22 3l4 16L35 9l-4 16 6-3-10 13Q21 39 16 35Z"/><g><circle cx="3" cy="17" r="2.6"/><circle cx="11" cy="7" r="2.6"/><circle cx="22" cy="3.5" r="2.7"/><circle cx="35" cy="9" r="2.6"/><circle cx="37" cy="22" r="2.3"/></g></svg>';
/** Same appearance catalog/portrait as the editor, with a tongue rooted at its mouth. */
export function homeFrogPreview(value:unknown){const portrait=appearancePreview(value),inner=portrait.slice(portrait.indexOf('>')+1,portrait.lastIndexOf('</svg>')).replace('<path d="M48 63q12 10 24 0" fill="none" stroke="#142f35" stroke-width="3"/>','<path d="M46 62Q60 67 74 62Q73 79 60 79Q47 79 46 62Z" fill="#563749" stroke="#142f35" stroke-width="2"/><ellipse cx="60" cy="75" rx="9" ry="3" fill="#ee839d"/>');return `<svg class="hero-frog" viewBox="0 0 220 170" role="img" aria-label="Your customized frog with an open mouth and curly tongue"><g transform="translate(0 15) scale(1.5)">${inner}</g><path d="M90 125C117 131 159 153 187 126S210 68 191 78" fill="none" stroke="#142f35" stroke-width="12" stroke-linecap="round"/><path d="M90 125C117 131 159 153 187 126S210 68 191 78" fill="none" stroke="#ff9baf" stroke-width="7" stroke-linecap="round"/><path d="M95 126q14 4 24 10" fill="none" stroke="#ffc4cb" stroke-width="2" stroke-linecap="round"/></svg>`;}

export const chaosBadge='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l5 12 13-6-6 13 9 7-15 1-3 15-8-12-12 7 4-14-9-8 15-2z" fill="#ffdc83" stroke="#153e45" stroke-width="3"/><path d="M20 19q14-6 13 5t-15 3q-9-1-7 4" fill="none" stroke="#bd557f" stroke-width="4" stroke-linecap="round"/></svg>';
