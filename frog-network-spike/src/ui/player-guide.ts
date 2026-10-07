/** Presentation-only panels. The authoritative match never pauses. */
export class PlayerGuide {
 private help=document.getElementById('help-dialog') as HTMLDialogElement;
 private leave=document.getElementById('leave-dialog') as HTMLDialogElement;
 private pendingLeave?:()=>void;
 constructor(private clearInputs:()=>void){
  const content=document.getElementById('guide-content')!.cloneNode(true) as HTMLElement;
  content.removeAttribute('id');document.getElementById('help-content')!.append(content);
  for(const id of ['help','home-help'])document.getElementById(id)!.onclick=()=>this.open(this.help);
  document.getElementById('help-close')!.onclick=()=>this.closeDialog(this.help);
  document.getElementById('leave-cancel')!.onclick=()=>this.closeDialog(this.leave);
  document.getElementById('leave-confirm')!.onclick=()=>{const action=this.pendingLeave;this.closeDialog(this.leave);action?.();};
  for(const dialog of [this.help,this.leave])dialog.addEventListener('cancel',e=>{e.preventDefault();this.closeDialog(dialog);});
  // Keep keyboard gameplay commands out of modal UI, while native scrolling/buttons still work.
  const gameplayKeys=new Set(['KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']);
  for(const type of ['keydown','keyup'])document.addEventListener(type,e=>{if(this.blocking&&gameplayKeys.has((e as KeyboardEvent).code))e.stopPropagation();},true);
 }
 get blocking(){return this.help.open||this.leave.open;}
 private open(dialog:HTMLDialogElement){this.clearInputs();dialog.showModal();}
 // Clear synchronously: the browser's queued `close` event must not erase a fresh gameplay press.
 private closeDialog(dialog:HTMLDialogElement){this.clearInputs();this.pendingLeave=undefined;dialog.close();(document.activeElement as HTMLElement)?.blur();}
 confirmLeave(action:()=>void){this.pendingLeave=action;this.open(this.leave);}
 update(phase:string,playing:boolean){
  const quick=document.getElementById('quick-guide')!;
  const destination=document.getElementById(phase==='lobby'?'lobby-guide':'home-guide')!;
  if(quick.parentElement!==destination)destination.append(quick);
  quick.hidden=phase==='game';
  document.getElementById('help-live-note')!.textContent=playing?'The round keeps running while help is open. Your frog stays in play.':'';
  if(phase!=='game'&&this.leave.open)this.closeDialog(this.leave);
 }
 close(){for(const dialog of [this.help,this.leave])if(dialog.open)this.closeDialog(dialog);}
}
