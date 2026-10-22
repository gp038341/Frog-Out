import type {OutbreakView} from '../game/outbreak';
export function isFinalRoundResult(view:OutbreakView|undefined){return !!view&&view.phase==='round-results'&&(view.round>=view.roundCount||!!view.patientZeroOrder?.length&&!view.patientZeroOrder.slice(view.round).some(slot=>view.players.some(p=>p.slot===slot&&p.present!==false)));}
/** Present the already-settled final totals directly; never alter authoritative rules or scores. */
export function finalResultsView(view:OutbreakView|undefined):OutbreakView|undefined{
 if(!view||!isFinalRoundResult(view))return view;
 return {...view,phase:'match-results',matchWinners:view.players.filter(p=>p.finalPlace===1).map(p=>p.slot)};
}
export const PODIUM_STEP_MS=850;
/** Shared champions retain their equal rank; slot order only sequences their portraits. */
export function podiumRevealOrder(frogs:readonly {slot:number;rank:number}[]){return frogs.filter(f=>f.rank<=3).slice().sort((a,b)=>b.rank-a.rank||a.slot-b.slot).map(f=>f.slot);}
