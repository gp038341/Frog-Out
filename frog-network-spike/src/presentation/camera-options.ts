import './camera-options.css';
/** A/B control lives in Help; adds no footer space or input interception. */
export class CameraOptions {
 dynamic=new URLSearchParams(location.search).get('camera')!=='static';
 constructor(){
  for(const id of ['help-content','lobby-rules']){
   const parent=document.getElementById(id);if(!parent)continue;
   const section=document.createElement('div');section.className='camera-options';
   const label=document.createElement('strong');label.textContent='Camera prototype';section.append(label);
   for(const [mode,title]of [['dynamic','Dynamic framing'],['static','Original static view']]as const){const b=document.createElement('button');b.type='button';b.dataset.camera=mode;b.textContent=title;b.onclick=()=>{this.dynamic=mode==='dynamic';this.refresh();};section.append(b);}
   const note=document.createElement('small');note.textContent='Local view only. All frogs stay in frame; movement and arena geometry are unchanged.';section.append(note);parent.append(section);
  }
  this.refresh();
 }
 private refresh(){document.querySelectorAll<HTMLButtonElement>('[data-camera]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.camera==='dynamic')===this.dynamic)));}
}
