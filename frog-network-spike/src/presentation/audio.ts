/** Original procedural cues; no samples, downloads or licensed music. Opt-in only. */
export type Cue='jump'|'charge'|'fire'|'attach'|'infect'|'count'|'go'|'win'|'ui';
export class GameAudio {
 enabled=false;context?:AudioContext;last=new Map<Cue,number>();
 toggle(){this.enabled=!this.enabled;if(this.enabled){try{this.context??=new AudioContext();void this.context.resume();this.play('ui');}catch{this.enabled=false;}}return this.enabled;}
 play(cue:Cue){
  const now=performance.now();if(!this.enabled||!this.context||this.context.state!=='running'||now-(this.last.get(cue)??-999)<90)return;this.last.set(cue,now);
  const notes:Record<Cue,[number,number,number]>={jump:[220,420,.12],charge:[160,680,.23],fire:[630,180,.1],attach:[380,520,.08],infect:[180,70,.26],count:[420,350,.09],go:[420,840,.19],win:[520,1040,.32],ui:[330,440,.06]};
  const [a,b,length]=notes[cue],t=this.context.currentTime,o=this.context.createOscillator(),g=this.context.createGain();o.type=cue==='infect'?'triangle':'sine';o.frequency.setValueAtTime(a,t);o.frequency.exponentialRampToValueAtTime(b,t+length);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08,t+.009);g.gain.exponentialRampToValueAtTime(.0001,t+length);o.connect(g);g.connect(this.context.destination);o.start(t);o.stop(t+length+.01);o.onended=()=>{o.disconnect();g.disconnect();};
 }
}
