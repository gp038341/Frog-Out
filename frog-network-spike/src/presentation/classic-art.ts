import type Phaser from 'phaser';
import {paintTagPoof} from './tag-poof';
import type {OutbreakView} from '../game/outbreak';
/** Amber pennant differs from poison markings and freezer snowflakes; cosmetic body stays untouched. */
export function paintClassicState(g:Phaser.GameObjects.Graphics,x:number,y:number,slot:number,view:OutbreakView,puffMs:number){const c=view.classic!;if(c.it===slot){g.lineStyle(4,0x142f35);g.strokeCircle(x,y,24);g.lineStyle(2,0xffc96b);g.strokeCircle(x,y,24);g.fillStyle(0xffc96b);g.fillTriangle(x-9,y-38,x+10,y-38,x,y-27);g.lineStyle(2,0x142f35);g.strokeTriangle(x-9,y-38,x+10,y-38,x,y-27);if(c.protectedUntil>view.tick){g.lineStyle(2,0xfff4d1);g.beginPath();g.arc(x,y,28,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,(c.protectedUntil-view.tick)/60));g.strokePath();}}
 paintTagPoof(g,x,y,puffMs);
}
