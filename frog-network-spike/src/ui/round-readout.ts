import type {OutbreakView} from '../game/outbreak';
/** Screen-space round context; never participates in canvas sizing or gameplay state. */
export class RoundReadout{
 private badge=document.createElement('span');private vote=document.createElement('p');
 constructor(){this.badge.id='match-round-readout';this.badge.hidden=true;this.badge.setAttribute('aria-label','Current round');document.getElementById('game-stage')!.append(this.badge);this.vote.id='vote-round-readout';}
 update(view:OutbreakView|undefined,voting:boolean){const active=!!view&&['announcement','countdown','playing'].includes(view.phase)&&!voting;this.badge.hidden=!active;if(view){this.badge.textContent=`Round ${view.round}/${view.roundCount}`;if(view.phase==='round-results')document.getElementById('results-context')!.textContent=`Round ${view.round}/${view.roundCount} complete`;}
  const panel=document.getElementById('chaos-voting');if(voting&&view&&panel){this.vote.textContent=`Round ${view.round}/${view.roundCount} complete`;if(this.vote.parentElement!==panel)panel.prepend(this.vote);this.vote.hidden=false;}else this.vote.hidden=true;
 }
}
