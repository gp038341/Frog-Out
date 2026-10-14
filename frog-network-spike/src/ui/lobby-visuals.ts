import type {PlayerInfo} from '../network/protocol';
import {appearancePreview} from '../presentation/cosmetic-art';
import {skinFor} from '../presentation/cosmetics';
export function lobbySeats(players:readonly PlayerInfo[]){const connected=players.filter(p=>p.connected).slice(0,8);return Array.from({length:8},(_,i)=>connected[i] as PlayerInfo|undefined);}
export function votersFor(choice:string,votes:Record<string,string>,players:readonly PlayerInfo[]){return players.filter(p=>p.connected&&votes[p.id]===choice);}
export function frogStampColor(player:PlayerInfo){return '#'+skinFor(player.appearance).color.toString(16).padStart(6,'0');}
/** A miniature frog silhouette, rather than a mammal paw-print. */
export const footStamp='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M10 25Q0 20 3 30L1 33l7-1 5 3 4-4h6l4 4 5-3 7 1-2-3q3-10-7-5z"/><ellipse cx="20" cy="22" rx="12" ry="10"/><circle cx="13" cy="12" r="7"/><circle cx="27" cy="12" r="7"/><g fill="#fffbea"><circle cx="13" cy="12" r="3"/><circle cx="27" cy="12" r="3"/></g><path d="M15 23q5 5 10 0" fill="none" stroke="#fffbea" stroke-width="2" stroke-linecap="round"/></svg>';
/** Same appearance catalog/portrait as the editor, with a tongue rooted at its mouth. */
export function homeFrogPreview(value:unknown){const portrait=appearancePreview(value),inner=portrait.slice(portrait.indexOf('>')+1,portrait.lastIndexOf('</svg>'));return `<svg class="hero-frog" viewBox="0 0 220 170" role="img" aria-label="Your customized frog with a curly tongue"><g transform="translate(0 15) scale(1.5)">${inner}</g><path d="M90 116C117 122 159 153 187 126S210 68 191 78" fill="none" stroke="#142f35" stroke-width="12" stroke-linecap="round"/><path d="M90 116C117 122 159 153 187 126S210 68 191 78" fill="none" stroke="#ff9baf" stroke-width="7" stroke-linecap="round"/><path d="M95 117q14 4 24 10" fill="none" stroke="#ffc4cb" stroke-width="2" stroke-linecap="round"/></svg>`;}

export const chaosBadge='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l5 12 13-6-6 13 9 7-15 1-3 15-8-12-12 7 4-14-9-8 15-2z" fill="#ffdc83" stroke="#153e45" stroke-width="3"/><path d="M20 19q14-6 13 5t-15 3q-9-1-7 4" fill="none" stroke="#bd557f" stroke-width="4" stroke-linecap="round"/></svg>';
