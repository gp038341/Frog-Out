/** Presentation only: retain diagnostic adapters offscreen and share the live match details with Settings. */
export class MatchChrome {
 private context=document.createElement('section');
 constructor(){
  const controls=document.createElement('div');controls.id='developer-controls';controls.hidden=true;controls.setAttribute('inert','');controls.setAttribute('aria-hidden','true');
  for(const id of ['export','mobile-export','touch-toggle','input-monitor-toggle']){const button=document.getElementById(id);if(button)controls.append(button);}
  document.body.append(controls);
  this.context.id='menu-session-context';this.context.hidden=true;this.context.setAttribute('aria-label','Current match');
  const heading=document.createElement('h3');heading.textContent='Current match';this.context.append(heading);
  for(const id of ['session-code','outbreak-heading']){const detail=document.getElementById(id);if(detail)this.context.append(detail);}
  document.getElementById('menu-note')!.after(this.context);
 }
 update(inMatch:boolean){this.context.hidden=!inMatch;}
}
