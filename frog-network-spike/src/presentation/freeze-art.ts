import type Phaser from 'phaser';
import type {OutbreakView} from '../game/outbreak';
const INK=0x142f35;
export function paintFreezeState(g:Phaser.GameObjects.Graphics,x:number,y:number,slot:number,view:OutbreakView){const freeze=view.freeze;if(!freeze)return;if(freeze.frozen[slot]){const shell=[{x:x-21,y:y+18},{x:x-23,y:y-13},{x:x-10,y:y-29},{x:x-3,y:y-22},{x:x+6,y:y-32},{x:x+23,y:y-13},{x:x+21,y:y+18},{x:x+10,y:y+24},{x:x-8,y:y+21}];g.fillStyle(0xbbf0ff,.3);g.fillPoints(shell,true);g.lineStyle(3,INK);g.strokePoints(shell,true);g.lineStyle(2,0xd9fcff);g.strokePoints(shell,true);g.lineStyle(2,0xc3f8ff,.8);g.lineBetween(x-15,y-12,x-8,y+12);g.lineBetween(x+17,y-9,x+10,y+13);g.fillStyle(0xcffaff);g.fillTriangle(x-12,y+18,x-6,y+18,x-8,y+28);g.fillTriangle(x+7,y+19,x+13,y+19,x+11,y+30);}
 if(slot===freeze.freezer){g.lineStyle(3,INK);g.strokeCircle(x,y,23);g.lineStyle(2,0x83e4ff);g.strokeCircle(x,y,23);snowflake(g,x,y-31,7);}
 if(freeze.protectedUntil[slot]>view.tick){g.lineStyle(2,0xffe59b);g.strokePoints([{x:x-21,y:y-14},{x,y:y-23},{x:x+21,y:y-14},{x:x+17,y:y+15},{x,y:y+24},{x:x-17,y:y+15}],true);}
}
function snowflake(g:Phaser.GameObjects.Graphics,x:number,y:number,r:number){g.lineStyle(3,INK);for(let j=0;j<3;j++){const a=j*Math.PI/3;g.lineBetween(x-Math.cos(a)*r,y-Math.sin(a)*r,x+Math.cos(a)*r,y+Math.sin(a)*r);}g.lineStyle(1.5,0xd4faff);for(let j=0;j<3;j++){const a=j*Math.PI/3;g.lineBetween(x-Math.cos(a)*r,y-Math.sin(a)*r,x+Math.cos(a)*r,y+Math.sin(a)*r);}}
