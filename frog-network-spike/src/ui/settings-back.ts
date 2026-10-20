/** Two protective Back steps per document visit, never an endlessly rearmed trap. */
export class SettingsBack {
 private key='frogOutSettingsBack';
 constructor(private history:Pick<History,'state'|'pushState'|'replaceState'>,private changed:(open:boolean)=>void){
  if(this.step(history.state)!==undefined)return;
  const state=history.state&&typeof history.state==='object'?history.state:{};
  // Keep the actual entry intact; two same-URL entries protect an accidental Back.
  try{
   history.replaceState({...state,[this.key]:0},'');
   history.pushState({...state,[this.key]:1},'');
   history.pushState({...state,[this.key]:2},'');
  }catch{/* Restricted/embedded browsers still have the visible Settings button. */}
 }
 private step(state:any){return state?.[this.key] as number|undefined;}
 pop(state:any,open:boolean){
  const step=this.step(state);
  if(step===1)this.changed(!open);
  else this.changed(false);
 }
}
