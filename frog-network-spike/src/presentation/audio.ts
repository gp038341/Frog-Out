/** Original Frog-Out rubbery croaks and pond percussion. No external recordings or music. */
export type Cue='jump'|'charge'|'build'|'fire'|'attach'|'miss'|'tension'|'impact'|'infect'|'transform'|'reveal'|'count'|'go'|'last'|'round'|'win'|'ui';
type Note=[number,number,number,number?];
export const SOUNDS:Record<Cue,{cooldown:number;important?:boolean;type:OscillatorType;notes:Note[]}>= {
 jump:{cooldown:100,type:'sine',notes:[[170,460,.12]]},
 charge:{cooldown:220,type:'triangle',notes:[[95,650,.18],[340,95,.18,.07]]},
 build:{cooldown:330,type:'sine',notes:[[95,190,.10]]},
 fire:{cooldown:110,type:'sine',notes:[[1100,95,.13]]},
 attach:{cooldown:180,type:'triangle',notes:[[680,130,.09],[210,95,.08,.035]]},
 miss:{cooldown:200,type:'sine',notes:[[380,75,.13]]},
 tension:{cooldown:850,type:'sine',notes:[[85,145,.10]]},
 impact:{cooldown:200,type:'triangle',notes:[[170,48,.09]]},
 infect:{cooldown:240,important:true,type:'triangle',notes:[[330,75,.17],[150,65,.22,.085]]},
 transform:{cooldown:350,type:'sine',notes:[[95,185,.17]]},
 reveal:{cooldown:700,important:true,type:'triangle',notes:[[110,70,.20],[190,65,.25,.13]]},
 count:{cooldown:500,important:true,type:'sine',notes:[[600,180,.075]]},
 go:{cooldown:700,important:true,type:'triangle',notes:[[180,600,.12],[420,110,.20,.09]]},
 last:{cooldown:900,important:true,type:'sine',notes:[[280,140,.15],[420,180,.20,.16]]},
 round:{cooldown:800,important:true,type:'sine',notes:[[220,330,.13],[330,440,.14,.11],[440,220,.21,.23]]},
 win:{cooldown:1000,important:true,type:'triangle',notes:[[240,360,.13],[360,540,.14,.13],[540,270,.25,.27]]},
 ui:{cooldown:100,type:'sine',notes:[[550,170,.055]]}
};
/** Harmonic formants give croaks a hollow throat instead of a pure electronic beep.
 * No extra oscillators, buffers, worklets, or continuously running modulation voices. */
const CROAKS=new Set<Cue>(['build','tension','infect','transform','reveal','last','go']);
const RUBBER=new Set<Cue>(['jump','charge','fire','attach','miss','impact','ui']);
export class GameAudio {
 enabled=false;context?:AudioContext;last=new Map<Cue,number>();volume=.55;master?:GainNode;
 voices=new Set<OscillatorNode>();played=0;dropped=0;peakVoices=0;private lastSmall=-999;private compressor?:DynamicsCompressorNode;private croak?:PeriodicWave;private rubber?:PeriodicWave;
 setVolume(value:number){this.volume=Math.max(0,Math.min(1,value));if(this.master&&this.context)this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.02);try{localStorage.setItem('frog-out-volume',String(this.volume));}catch{/* storage is optional */}}
 toggle(){this.enabled=!this.enabled;if(this.enabled){try{this.context??=new AudioContext();if(!this.master){this.master=this.context.createGain();this.compressor=this.context.createDynamicsCompressor();this.compressor.threshold.value=-20;this.compressor.ratio.value=5;this.master.connect(this.compressor);this.compressor.connect(this.context.destination);this.master.gain.value=this.volume;}void this.context.resume().then(()=>{if(this.enabled)this.play('ui');}).catch(()=>{this.enabled=false;});}catch{this.enabled=false;}}else this.silence();return this.enabled;}
 silence(){for(const o of [...this.voices]){try{o.stop();}catch{/* already stopped */}}this.voices.clear();}
 play(cue:Cue,intensity=1){
  const now=performance.now(),spec=SOUNDS[cue],context=this.context;
  if(!this.enabled||document.hidden||!context||context.state!=='running'||!this.master||this.volume===0)return;
  if(now-(this.last.get(cue)??-9999)<spec.cooldown||!spec.important&&now-this.lastSmall<85){this.dropped++;return;}
  // Bounded local synth: at most eight scheduled/active oscillators, no queue or backlog.
  if(this.voices.size+spec.notes.length>8){if(!spec.important){this.dropped++;return;}this.silence();}
  this.last.set(cue,now);if(!spec.important)this.lastSmall=now;this.played++;
  for(const [a,b,length,delay=0]of spec.notes){const t=context.currentTime+delay,o=context.createOscillator(),g=context.createGain();o.type=spec.type;
   const throaty=CROAKS.has(cue),rubbery=RUBBER.has(cue);
   if(context.createPeriodicWave){if(throaty){this.croak??=context.createPeriodicWave(new Float32Array(10),new Float32Array([0,.65,.10,.55,.28,.08,.20,.06,.035,.015]));o.setPeriodicWave(this.croak);}else if(rubbery){this.rubber??=context.createPeriodicWave(new Float32Array(7),new Float32Array([0,1,.24,.16,.075,.035,.015]));o.setPeriodicWave(this.rubber);}}
   // Small pitch wobble and pulsed envelopes: chirrup/croak, not a straight sine sweep.
   const peak=(spec.important?.115:.085)*Math.max(.5,Math.min(1.25,intensity));
   o.frequency.setValueAtTime(a,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.004);
   if(throaty){for(let i=1;i<=6;i++){const f=i/6;o.frequency.exponentialRampToValueAtTime(a*Math.pow(b/a,f)*(i===6?1:i%2?1.11:.93),t+length*f);g.gain.exponentialRampToValueAtTime(i===6?.0001:peak*(i%2?.26:.75)*(1-f*.45),t+length*f);}}
   else{o.frequency.exponentialRampToValueAtTime(Math.sqrt(a*b)*1.18,t+length*.32);o.frequency.exponentialRampToValueAtTime(b,t+length);g.gain.exponentialRampToValueAtTime(peak*.45,t+length*.32);g.gain.exponentialRampToValueAtTime(.0001,t+length);}
   o.connect(g);g.connect(this.master);this.voices.add(o);this.peakVoices=Math.max(this.peakVoices,this.voices.size);o.start(t);o.stop(t+length+.01);o.onended=()=>{this.voices.delete(o);o.disconnect();g.disconnect();};}
 }
}
