import {BackgroundMusic} from './music';
/** One persistent music player; mirrored settings live in separate, existing dialogs. */
export class MusicUI {
 readonly music:BackgroundMusic;
 constructor(music=new BackgroundMusic()){
  this.music=music;
  for(const [root,id]of [['#game-menu','menu'],['#help-dialog','help']]){
   const panel=document.createElement('fieldset');panel.className='music-settings';panel.dataset.musicControls='';panel.innerHTML=`<legend>Music</legend><div class="music-controls"><button type="button" id="music-${id}-toggle"></button><label for="music-${id}-volume">Music Volume <span class="music-volume-row"><input id="music-${id}-volume" type="range" min="0" max="100" step="1" aria-label="Music Volume"><output></output></span></label></div><small role="status"></small>`;
   const button=panel.querySelector('button')!,slider=panel.querySelector('input')!,output=panel.querySelector('output')!,status=panel.querySelector('small')!;
   button.onclick=()=>{void music.setEnabled(!music.enabled);};slider.oninput=()=>{void music.setVolume(Number(slider.value)/100);};
   music.subscribe(()=>{button.textContent=`Music: ${music.enabled?'On':'Off'}`;button.setAttribute('aria-pressed',String(music.enabled));slider.value=String(Math.round(music.volume*100));output.textContent=slider.value+'%';status.textContent=music.status==='waiting'?'Music starts after your first interaction.':music.status==='unavailable'?'Music unavailable right now — gameplay is unaffected.':music.status==='off'?'Music is off. Sound effects have their own control.':music.status==='paused'?'Music paused.':'Pondside Pandemonium · original Frog-Out soundtrack';});
   document.querySelector(`${root} .dialog-actions`)!.before(panel);
  }
  // Observe trusted gestures only. Never consume, cancel, capture ownership, or change gameplay inputs.
  const gesture=(event:Event)=>{if(event.isTrusted)void music.unlock();};
  document.addEventListener('click',gesture,{passive:true});
  for(const type of ['pointerdown','touchstart','keydown'])document.addEventListener(type,event=>{if((event.target as Element)?.closest?.('[data-music-controls]'))return;if(type==='keydown'&&(event as KeyboardEvent).repeat)return;gesture(event);},{capture:true,passive:true});
  document.addEventListener('visibilitychange',()=>{void music.visibilityChanged();},{passive:true});
  window.addEventListener('pagehide',()=>{void music.setPageActive(false);},{passive:true});
  window.addEventListener('pageshow',()=>{void music.setPageActive(true);},{passive:true});
 }
}
