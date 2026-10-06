// Application-layer delay emulator. It preserves WebSocket message ordering.
export class DelayLink {
 private sendDue=0;private receiveDue=0;private timers=new Set<ReturnType<typeof setTimeout>>();
 constructor(public rtt=0,public jitter=0,private random=()=>Math.random()){}
 schedule(direction:'send'|'receive',fn:()=>void){
  if(this.rtt===0&&this.jitter===0){fn();return;}
  const now=performance.now(),delay=Math.max(0,this.rtt/2+(this.random()*2-1)*this.jitter);
  const due=Math.max(now+delay,direction==='send'?this.sendDue:this.receiveDue);
  if(direction==='send')this.sendDue=due;else this.receiveDue=due;
  const timer=setTimeout(()=>{this.timers.delete(timer);fn();},Math.max(0,due-now));this.timers.add(timer);
 }
 clear(){for(const t of this.timers)clearTimeout(t);this.timers.clear();this.sendDue=this.receiveDue=0;}
}
