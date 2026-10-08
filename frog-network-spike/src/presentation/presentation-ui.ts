import {GameAudio} from './audio';
import {Moments} from './moments';
import type {OutbreakView} from '../game/outbreak';
import './feel.css';
import './poison-tag.css';
/** Decorative children and non-intercepting overlays; existing input, layout and match timing stay untouched. */
export class PresentationUI {
 private moments=new Moments();private toast:HTMLElement;private until=0;private key='';private count=-1;
 constructor(private audio:GameAudio){
  this.toast=document.createElement('aside');this.toast.id='pond-moment';this.toast.setAttribute('aria-live','polite');this.toast.hidden=true;document.querySelector('#game')!.append(this.toast);
  try{const stored=localStorage.getItem('frog-out-volume');if(stored!==null&&Number.isFinite(Number(stored)))audio.setVolume(Number(stored));}catch{}
  // Audio settings live in existing collapsible lobby help, never in the gameplay footer.
  const settings=document.createElement('label');settings.className='pond-audio-settings';settings.textContent='Sound volume ';const volume=document.createElement('input');volume.type='range';volume.min='0';volume.max='100';volume.value=String(Math.round(audio.volume*100));volume.setAttribute('aria-label','Sound volume');settings.append(volume);const output=document.createElement('output');output.textContent=volume.value+'%';settings.append(output);volume.oninput=()=>{audio.setVolume(Number(volume.value)/100);output.textContent=volume.value+'%';};document.querySelector('#lobby-rules')?.append(settings);
  const card=document.createElement('p');card.className='pond-reveal-caption';card.textContent='TINY FROG. BIG DART ENERGY.';document.querySelector('#phase-overlay .reveal-card')?.append(card);
  const end=document.createElement('p');end.id='pond-results-caption';end.className='pond-results-caption';document.querySelector('#winner-message')?.after(end);
  document.addEventListener('click',e=>{const b=(e.target as Element)?.closest?.('button');if(b&&!['sound','fullscreen','touch-toggle','touch-action','input-monitor-toggle','mobile-export'].includes(b.id))audio.play('ui');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.silence();this.toast.hidden=true;}});
 }
 update(view:OutbreakView|undefined,local:number){
  for(const m of this.moments.update(view,local)){this.audio.play(m.cue);if(m.text){this.toast.textContent=m.text;this.toast.dataset.kind=m.cue;this.until=performance.now()+(m.cue==='last'||m.cue==='infect'||m.cue==='transform'?1300:650);}}
  this.toast.hidden=!view||view.phase!=='playing'||performance.now()>this.until||!!document.querySelector('dialog[open]');
  if(!view){this.key='';this.count=-1;document.body.classList.remove('pond-last','pond-victory');return;}
  const key=`${view.round}:${view.phase}`,overlay=document.querySelector('#phase-overlay')!;
  if(key!==this.key){overlay.classList.remove('pond-reveal-arrive');void (overlay as HTMLElement).offsetWidth;if(view.phase==='announcement')overlay.classList.add('pond-reveal-arrive');this.key=key;}
  const count=Math.ceil(view.remainingMs/1000);if(view.phase==='countdown'&&count!==this.count){const number=document.querySelector('#countdown-number')!;number.classList.remove('pond-count-pop');void (number as HTMLElement).offsetWidth;number.classList.add('pond-count-pop');this.count=count;}
  document.body.classList.toggle('pond-last',view.phase==='playing'&&view.mode!=='freeze'&&view.players.filter(p=>p.state==='healthy').length===1);
  document.body.classList.toggle('pond-victory',view.phase==='match-results');
  const caption=document.querySelector('#pond-results-caption')!;caption.textContent=view.phase==='match-results'?(view.matchWinners.length>1?'A SHARED CROWN. A VERY LOUD POND.':'THE POND HAS A NEW LEGEND.'):'HOP WELL. SCORE WELL. CATCH YOUR BREATH.';
 }
}
