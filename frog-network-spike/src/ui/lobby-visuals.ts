import type {PlayerInfo} from '../network/protocol';
import {skinFor} from '../presentation/cosmetics';
export function lobbySeats(players:readonly PlayerInfo[]){const connected=players.filter(p=>p.connected).slice(0,8);return Array.from({length:8},(_,i)=>connected[i] as PlayerInfo|undefined);}
export function votersFor(choice:string,votes:Record<string,string>,players:readonly PlayerInfo[]){return players.filter(p=>p.connected&&votes[p.id]===choice);}
export function frogStampColor(player:PlayerInfo){return '#'+skinFor(player.appearance).color.toString(16).padStart(6,'0');}
export const footStamp='<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="26" rx="10" ry="9"/><circle cx="7" cy="16" r="5"/><circle cx="18" cy="9" r="5"/><circle cx="30" cy="12" r="5"/></svg>';
export const chaosBadge='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l5 12 13-6-6 13 9 7-15 1-3 15-8-12-12 7 4-14-9-8 15-2z" fill="#ffdc83" stroke="#153e45" stroke-width="3"/><path d="M20 19q14-6 13 5t-15 3q-9-1-7 4" fill="none" stroke="#bd557f" stroke-width="4" stroke-linecap="round"/></svg>';
