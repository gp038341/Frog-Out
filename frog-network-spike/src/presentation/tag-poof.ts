import type Phaser from 'phaser';
/** Shared visual-only poison cloud: bounded work, bright rim, quick transparent fade. */
export const TAG_POOF_MS=650;
export function paintTagPoof(g:Phaser.GameObjects.Graphics,x:number,y:number,remaining:number){
 if(remaining<=0)return;const q=Math.max(0,Math.min(1,1-remaining/TAG_POOF_MS)),alpha=.85*Math.pow(1-q,.8),radius=12+q*29;
 for(let j=0;j<9;j++){const a=j*Math.PI*2/9,size=(9+q*5)*(j%2?.85:1);g.fillStyle(j%2?0xb76cde:0xcf8cf0,alpha);g.lineStyle(2,0xf9dcff,alpha);const cx=x+Math.cos(a)*radius,cy=y+Math.sin(a)*radius;g.fillCircle(cx,cy,size);g.strokeCircle(cx,cy,size);}
}
