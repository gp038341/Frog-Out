/** Stable roster slots; absence pauses score without changing identity or mode status. */
export class RoundPresence {
 present:boolean[]=[];private pausedTicks:number[]=[];private since:(number|null)[]=[];
 reset(count:number){this.present=Array.from({length:count},(_,i)=>this.present[i]??true);this.pausedTicks=Array(count).fill(0);this.since=Array(count).fill(null);}
 start(tick:number){this.since=this.present.map(p=>p?null:tick);}
 has(slot:number){return this.present[slot]!==false;}
 set(slot:number,value:boolean,tick:number,started:boolean){if(this.has(slot)===value)return;if(started){if(value){this.pausedTicks[slot]=(this.pausedTicks[slot]??0)+Math.max(0,tick-(this.since[slot]??tick));this.since[slot]=null;}else this.since[slot]=tick;}this.present[slot]=value;}
 paused(slot:number,tick:number){return (this.pausedTicks[slot]??0)+(this.since[slot]===null||this.since[slot]===undefined?0:Math.max(0,tick-this.since[slot]!));}
}
