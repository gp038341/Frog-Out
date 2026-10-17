import {MUSIC} from './music-score';
export {MUSIC,composePondMusic} from './music-score';
export type MusicStatus='waiting'|'playing'|'paused'|'off'|'unavailable';
export class BackgroundMusic {
 enabled=true;volume:number=MUSIC.defaultVolume;status:MusicStatus='waiting';
 private gestureResume?:Promise<void>;private score?:Promise<Float32Array>;private context?:AudioContext;private gain?:GainNode;private source?:AudioBufferSourceNode;private activated=false;private pageActive=true;private revision=0;private work?:Promise<void>;private listeners=new Set<()=>void>();
 constructor(private createContext=()=>{const C=window.AudioContext||(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!C)throw Error('Web Audio unavailable');return new C();},private storage:Pick<Storage,'getItem'|'setItem'>|undefined=undefined,private hidden=()=>document.hidden,private loadScore=prepareMusicScore){
  try{this.storage??=localStorage;this.enabled=this.storage.getItem('frog-out-music-enabled')!=='false';const raw=this.storage.getItem('frog-out-music-volume'),v=raw===null?NaN:Number(raw);if(Number.isFinite(v))this.volume=Math.max(0,Math.min(1,v));}catch{/* Preferences optional; gameplay never depends on storage. */}this.status=this.enabled?'waiting':'off';
 }
 subscribe(fn:()=>void){this.listeners.add(fn);fn();return()=>this.listeners.delete(fn);}
 private notify(){for(const fn of this.listeners)fn();}
 private save(){try{this.storage?.setItem('frog-out-music-enabled',String(this.enabled));this.storage?.setItem('frog-out-music-volume',String(this.volume));}catch{/* Private/storage-limited browsers remain playable. */}}
 setEnabled(value:boolean){this.enabled=value;this.save();return this.sync();}
 setVolume(value:number){if(!Number.isFinite(value))return Promise.resolve();this.volume=Math.max(0,Math.min(1,value));this.save();return this.sync();}
 unlock(){if(!this.enabled||this.volume===0||this.hidden()||!this.pageActive)return Promise.resolve();if(this.activated&&this.status==='playing'&&this.context?.state==='running')return Promise.resolve();if(this.enabled){this.activated=true;if(this.active())try{this.context??=this.createContext();if(this.context.state!=='running'&&!this.gestureResume){this.gestureResume=this.context.resume();void this.gestureResume.catch(()=>{});}}catch{this.status='unavailable';}}return this.sync();}
 visibilityChanged(){return this.sync();}
 setPageActive(value:boolean){this.pageActive=value;return this.sync();}
 private active(){return this.enabled&&this.volume>0&&this.activated&&!this.hidden()&&this.pageActive;}
 private sync(){
  ++this.revision;
  // Mute is immediate even while a prior resume is pending.
  if(this.gain&&this.context)this.gain.gain.setValueAtTime(this.active()?this.volume:0,this.context.currentTime);
  if(!this.enabled)this.status='off';else if(this.hidden()||!this.pageActive||this.volume===0)this.status='paused';else if(!this.activated)this.status='waiting';this.notify();
  if(this.work)return this.work;
  this.work=Promise.resolve().then(()=>this.reconcile()).finally(()=>{this.work=undefined;});return this.work;
 }
 private async reconcile(){let version:number;do{version=this.revision;try{
   if(this.active()){
    this.context??=this.createContext();const context=this.context;
    const gestureResume=this.gestureResume;this.gestureResume=undefined;await(gestureResume??context.resume());if(version!==this.revision)continue;
    if(context.state!=='running')throw Error('Waiting for browser audio permission');
    if(!this.source){this.score??=this.loadScore().catch(e=>{this.score=undefined;throw e;});const samples=await this.score;if(version!==this.revision)continue;const buffer=context.createBuffer(1,samples.length,MUSIC.sampleRate);buffer.getChannelData(0).set(samples);this.gain=context.createGain();this.gain.gain.value=0;this.gain.connect(context.destination);const source=context.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(this.gain);source.start();this.source=source;this.score=undefined;}
    this.gain!.gain.setTargetAtTime(this.volume,context.currentTime,.025);this.status='playing';
   }else{if(this.context&&this.context.state==='running')await this.context.suspend();this.status=!this.enabled?'off':!this.activated?'waiting':'paused';}
  }catch{this.status='unavailable';if(this.gain&&this.context)this.gain.gain.setValueAtTime(0,this.context.currentTime);}this.notify();}while(version!==this.revision);}
}

/** Generate PCM away from the input/render thread; no external audio request. */
function prepareMusicScore():Promise<Float32Array>{return new Promise((resolve,reject)=>{
 const worker=new Worker(new URL('./music-worker.ts',import.meta.url),{type:'module'});
 const timeout=setTimeout(()=>{worker.terminate();reject(Error('Music generation timed out'));},10000);
 worker.onmessage=(event:MessageEvent<Float32Array>)=>{clearTimeout(timeout);worker.terminate();if(event.data instanceof Float32Array)resolve(event.data);else reject(Error('Invalid music score'));};
 worker.onerror=()=>{clearTimeout(timeout);worker.terminate();reject(Error('Music generation unavailable'));};worker.postMessage('compose');
});}
