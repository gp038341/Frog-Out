/** Original Frog-Out synthesized pond percussion. No external recordings or music. */
export type Cue='jump'|'charge'|'build'|'fire'|'attach'|'miss'|'tension'|'impact'|'infect'|'transform'|'reveal'|'count'|'go'|'last'|'round'|'win'|'ui';
type Note=[number,number,number,number?];
export const SOUNDS:Record<Cue,{cooldown:number;important?:boolean;type:OscillatorType;notes:Note[]}>= {
 jump:{cooldown:100,type:'sine',notes:[[190,380,.11]]},
 charge:{cooldown:220,type:'triangle',notes:[[110,480,.19],[420,640,.13,.06]]},
 build:{cooldown:330,type:'sine',notes:[[150,220,.08]]},
 fire:{cooldown:110,type:'sine',notes:[[740,170,.1]]},
 attach:{cooldown:180,type:'triangle',notes:[[310,440,.07],[560,620,.08,.055]]},
 miss:{cooldown:200,type:'sine',notes:[[230,115,.09]]},
 tension:{cooldown:850,type:'sine',notes:[[125,150,.08]]},
 impact:{cooldown:200,type:'triangle',notes:[[130,65,.07]]},
 infect:{cooldown:240,important:true,type:'triangle',notes:[[260,100,.14],[170,65,.18,.10]]},
 transform:{cooldown:350,type:'sine',notes:[[110,210,.13]]},
 reveal:{cooldown:700,important:true,type:'triangle',notes:[[130,95,.17],[220,120,.22,.15]]},
 count:{cooldown:500,important:true,type:'sine',notes:[[420,350,.09]]},
 go:{cooldown:700,important:true,type:'triangle',notes:[[260,520,.12],[520,780,.17,.10]]},
 last:{cooldown:900,important:true,type:'sine',notes:[[440,440,.11],[660,660,.14,.12]]},
 round:{cooldown:800,important:true,type:'sine',notes:[[330,440,.12],[440,550,.14,.11],[550,660,.17,.23]]},
 win:{cooldown:1000,important:true,type:'triangle',notes:[[330,440,.13],[440,660,.14,.13],[660,880,.22,.27]]},
 ui:{cooldown:100,type:'sine',notes:[[300,430,.045]]}
};
export class GameAudio {
 enabled=false;context?:AudioContext;last=new Map<Cue,number>();volume=.55;master?:GainNode;
 voices=new Set<OscillatorNode>();played=0;dropped=0;peakVoices=0;private lastSmall=-999;private compressor?:DynamicsCompressorNode;
 setVolume(value:number){this.volume=Math.max(0,Math.min(1,value));if(this.master&&this.context)this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.02);try{localStorage.setItem('frog-out-volume',String(this.volume));}catch{/* storage is optional */}}
 toggle(){this.enabled=!this.enabled;if(this.enabled){try{this.context??=new AudioContext();if(!this.master){this.master=this.context.createGain();this.compressor=this.context.createDynamicsCompressor();this.compressor.threshold.value=-20;this.compressor.ratio.value=5;this.master.connect(this.compressor);this.compressor.connect(this.context.destination);this.master.gain.value=this.volume;}void this.context.resume().then(()=>{if(this.enabled)this.play('ui');}).catch(()=>{this.enabled=false;});}catch{this.enabled=false;}}else this.silence();return this.enabled;}
 silence(){for(const o of [...this.voices]){try{o.stop();}catch{/* already stopped */}}this.voices.clear();}
 play(cue:Cue){
  const now=performance.now(),spec=SOUNDS[cue],context=this.context;
  if(!this.enabled||document.hidden||!context||context.state!=='running'||!this.master||this.volume===0)return;
  if(now-(this.last.get(cue)??-9999)<spec.cooldown||!spec.important&&now-this.lastSmall<85){this.dropped++;return;}
  // Bounded local synth: at most eight scheduled/active oscillators, no queue or backlog.
  if(this.voices.size+spec.notes.length>8){if(!spec.important){this.dropped++;return;}this.silence();}
  this.last.set(cue,now);if(!spec.important)this.lastSmall=now;this.played++;
  for(const [a,b,length,delay=0]of spec.notes){const t=context.currentTime+delay,o=context.createOscillator(),g=context.createGain();o.type=spec.type;o.frequency.setValueAtTime(a,t);o.frequency.exponentialRampToValueAtTime(b,t+length);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(spec.important?.09:.06,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+length);o.connect(g);g.connect(this.master);this.voices.add(o);this.peakVoices=Math.max(this.peakVoices,this.voices.size);o.start(t);o.stop(t+length+.01);o.onended=()=>{this.voices.delete(o);o.disconnect();g.disconnect();};}
 }
}
