/** Presentation-only panels. The authoritative match never pauses. */
export class PlayerGuide {
 private help=document.getElementById('help-dialog') as HTMLDialogElement;
 private leave=document.getElementById('leave-dialog') as HTMLDialogElement;
 private menu=document.getElementById('game-menu') as HTMLDialogElement;
 private phase='home';leaveAction?:()=>void;
 private pendingLeave?:()=>void;
 constructor(private clearInputs:()=>void){
  document.getElementById('help')!.onclick=()=>this.open(this.phase==='game'?this.menu:this.help);
  document.getElementById('menu-resume')!.onclick=()=>this.closeDialog(this.menu);
  document.getElementById('menu-help')!.onclick=()=>{this.closeDialog(this.menu);this.open(this.help);};
  document.getElementById('menu-leave')!.onclick=()=>{this.closeDialog(this.menu);if(this.leaveAction)this.confirmLeave(this.leaveAction);};
  document.addEventListener('keydown',e=>{if(e.code==='Escape'&&this.phase==='game'&&!this.blocking&&!e.repeat){e.preventDefault();e.stopPropagation();this.open(this.menu);}},true);
  document.getElementById('help-close')!.onclick=()=>this.closeDialog(this.help);
  document.getElementById('leave-cancel')!.onclick=()=>this.closeDialog(this.leave);
  document.getElementById('leave-confirm')!.onclick=()=>{const action=this.pendingLeave;this.closeDialog(this.leave);action?.();};
  for(const dialog of [this.help,this.leave,this.menu])dialog.addEventListener('cancel',e=>{e.preventDefault();this.closeDialog(dialog);});
  // Keep keyboard gameplay commands out of modal UI, while native scrolling/buttons still work.
  const gameplayKeys=new Set(['KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']);
  for(const type of ['keydown','keyup'])document.addEventListener(type,e=>{if(this.blocking&&gameplayKeys.has((e as KeyboardEvent).code))e.stopPropagation();},true);
 }
 get blocking(){return this.help.open||this.leave.open||this.menu.open;}
 private open(dialog:HTMLDialogElement){this.clearInputs();dialog.showModal();}
 // Clear synchronously: the browser's queued `close` event must not erase a fresh gameplay press.
 private closeDialog(dialog:HTMLDialogElement){this.clearInputs();this.pendingLeave=undefined;dialog.close();(document.activeElement as HTMLElement)?.blur();}
 confirmLeave(action:()=>void){this.pendingLeave=action;this.open(this.leave);}
 update(phase:string,playing:boolean){
  this.phase=phase;document.getElementById('help')!.textContent=phase==='game'?'Menu · Esc':'How to Play';
  const leaveButton=document.getElementById('leave')!,destinationLeave=document.querySelector(phase==='lobby'?'.lobby-primary':'#session-footer')!;
  if(leaveButton.parentElement!==destinationLeave)destinationLeave.append(leaveButton);
  document.getElementById('help-live-note')!.textContent=playing?'The round keeps running while help is open. Your frog stays in play.':'';
  if(phase!=='game'&&this.leave.open)this.closeDialog(this.leave);
  if(phase!=='game'&&this.menu.open)this.closeDialog(this.menu);
 }
 close(){for(const dialog of [this.help,this.leave,this.menu])if(dialog.open)this.closeDialog(dialog);}
}
