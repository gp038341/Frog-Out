import {SettingsBack} from './settings-back';
/** One shared settings overlay. The authoritative match never pauses. */
export class PlayerGuide {
 private help=document.getElementById('help-dialog') as HTMLDialogElement;
 private leave=document.getElementById('leave-dialog') as HTMLDialogElement;
 private menu=document.getElementById('game-menu') as HTMLDialogElement;
 private customization=document.getElementById('customization-dialog') as HTMLDialogElement;
 private suspended?:HTMLDialogElement;
 private phase='home';leaveAction?:()=>void;
 private pendingLeave?:()=>void;
 constructor(private clearInputs:()=>void){
  document.getElementById('help')!.onclick=()=>this.toggleSettings();
  for(const id of ['customization-settings','help-settings'])document.getElementById(id)!.onclick=()=>this.toggleSettings();
  document.getElementById('menu-resume')!.onclick=()=>this.closeSettings();
  document.getElementById('menu-help')!.onclick=()=>{this.closeDialog(this.menu);if(this.suspended===this.help)this.suspended=undefined;this.open(this.help);};
  document.getElementById('menu-leave')!.onclick=()=>{this.closeSettings(false);if(this.leaveAction){if(this.phase==='game')this.confirmLeave(this.leaveAction);else this.leaveAction();}};
  document.addEventListener('keydown',e=>{
   if(e.code!=='Escape'||e.repeat)return;
   e.preventDefault();e.stopPropagation();
   if(this.leave.open)this.closeDialog(this.leave);
   else this.toggleSettings();
  },true);
  document.getElementById('help-close')!.onclick=()=>{this.closeDialog(this.help);this.restore();};
  document.getElementById('leave-cancel')!.onclick=()=>this.closeDialog(this.leave);
  document.getElementById('leave-confirm')!.onclick=()=>{const action=this.pendingLeave;this.closeDialog(this.leave);action?.();};
  for(const dialog of [this.help,this.leave,this.menu])dialog.addEventListener('cancel',e=>{e.preventDefault();if(dialog===this.menu)this.closeSettings();else this.closeDialog(dialog);});
  const gameplayKeys=new Set(['KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space']);
  for(const type of ['keydown','keyup'])document.addEventListener(type,e=>{if(this.blocking&&gameplayKeys.has((e as KeyboardEvent).code))e.stopPropagation();},true);
  if(typeof window!=='undefined'&&window.matchMedia('(pointer: coarse)').matches){
   // Install during a real gesture: browsers may skip synthetic pre-interaction entries.
   window.addEventListener('pointerdown',()=>{
    const back=new SettingsBack(window.history,open=>{if(this.leave.open)this.closeDialog(this.leave);if(open&&!this.menu.open)this.toggleSettings();else if(!open&&this.menu.open)this.closeSettings();});
    window.addEventListener('popstate',e=>back.pop(e.state,this.menu.open));
   },{once:true,capture:true,passive:true});
  }
 }
 get blocking(){return this.help.open||this.leave.open||this.menu.open||this.customization.open;}
 private open(dialog:HTMLDialogElement){this.clearInputs();if(!dialog.open)dialog.showModal();}
 private toggleSettings(){
  if(this.menu.open){this.closeSettings();return;}
  if(this.leave.open)return;
  const previous=[this.help,this.customization].find(d=>d.open);
  if(previous){this.suspended=previous;previous.close();}
  this.open(this.menu);
 }
 private restore(){const previous=this.suspended;this.suspended=undefined;if(previous&&(previous!==this.customization||this.phase==='home'))this.open(previous);}
 private closeSettings(restore=true){this.closeDialog(this.menu);if(restore)this.restore();else this.suspended=undefined;}
 // Clear synchronously: queued close events must not erase a fresh gameplay press.
 private closeDialog(dialog:HTMLDialogElement){this.clearInputs();this.pendingLeave=undefined;dialog.close();(document.activeElement as HTMLElement)?.blur();}
 confirmLeave(action:()=>void){this.pendingLeave=action;this.open(this.leave);}
 update(phase:string,playing:boolean){
  this.phase=phase;document.getElementById('help')!.textContent='⚙ Settings';
  document.getElementById('menu-note')!.textContent=playing?'The match keeps running. Your frog stays in play while settings are open.':'Music and sound preferences apply everywhere. Close settings to return to your screen.';
  const menuLeave=document.getElementById('menu-leave')!;menuLeave.hidden=phase==='home';menuLeave.textContent=phase==='lobby'?'Leave Room':'Leave Match';
  const leaveButton=document.getElementById('leave')!,destinationLeave=document.querySelector(phase==='lobby'?'.lobby-primary':'#session-footer')!;
  if(leaveButton.parentElement!==destinationLeave)destinationLeave.append(leaveButton);
  document.getElementById('help-live-note')!.textContent=playing?'The round keeps running while help is open. Your frog stays in play.':'';
  if(phase!=='game'&&this.leave.open)this.closeDialog(this.leave);
 }
 close(){this.suspended=undefined;for(const dialog of [this.help,this.leave,this.menu])if(dialog.open)this.closeDialog(dialog);}
}
