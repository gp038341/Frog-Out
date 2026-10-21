import type Phaser from 'phaser';
import type {FrogState} from '../simulation/state';
import type {OutbreakView} from '../game/outbreak';
export const SWAP_LOCATOR_TICKS=108; // 1.8 seconds at the existing authoritative 60 Hz.
/** Presentation-only lifetime; repeated snapshots never restart the swap highlight. */
export function locatorReason(f:FrogState|undefined,view:OutbreakView|undefined,online=true){if(!f||f.active===false||!online)return undefined;if(view?.phase==='countdown')return 'countdown';if(view?.phase==='playing'&&f.swapTick!==undefined&&view.tick>=f.swapTick&&view.tick-f.swapTick<SWAP_LOCATOR_TICKS)return 'swap';return undefined;}
/** Short diagonal pointer beside the frog, outside its charge ring and chosen cosmetics. */
export function locatorArrow(x:number,y:number,radius:number,scale=1){const side=x<600?1:-1,s=Math.max(1,Math.min(1.8,scale)),tip={x:x+side*(radius+17),y:y+(y>570?-1:1)*(radius+12)},dy=y>570?-1:1,tail={x:tip.x+side*35*s,y:tip.y+dy*23*s};const length=Math.hypot(tip.x-tail.x,tip.y-tail.y),ux=(tip.x-tail.x)/length,uy=(tip.y-tail.y)/length,nx=-uy,ny=ux,w=6*s,head=16*s;return{tip,tail,points:[{x:tail.x+nx*w,y:tail.y+ny*w},{x:tip.x-ux*head+nx*w,y:tip.y-uy*head+ny*w},{x:tip.x-ux*head+nx*12*s,y:tip.y-uy*head+ny*12*s},tip,{x:tip.x-ux*head-nx*12*s,y:tip.y-uy*head-ny*12*s},{x:tip.x-ux*head-nx*w,y:tip.y-uy*head-ny*w},{x:tail.x-nx*w,y:tail.y-ny*w}],text:{x:Math.max(45,Math.min(1155,tail.x+side*8)),y:Math.max(18,Math.min(652,tail.y+dy*21*s))}};}
export class LocalLocator{
 private ink:Phaser.GameObjects.Graphics;private label:Phaser.GameObjects.Text;
 constructor(scene:Phaser.Scene){this.ink=scene.add.graphics().setDepth(8).setName('local-frog-arrow');this.label=scene.add.text(0,0,'YOU',{fontFamily:'Trebuchet MS, sans-serif',fontSize:'24px',fontStyle:'bold',color:'#b9eaff',stroke:'#142f35',strokeThickness:5}).setOrigin(.5).setDepth(8).setName('local-frog-locator').setVisible(false);}
 clear(){this.ink.clear();this.label.setVisible(false);}
 render(f:FrogState|undefined,p:{x:number;y:number}|undefined,view:OutbreakView|undefined,online:boolean,ratio:number){this.clear();if(!p||!locatorReason(f,view,online))return;const a=locatorArrow(p.x*30,p.y*30,(f!.radius??.45)*30,ratio),g=this.ink;g.fillStyle(0xb9eaff);g.lineStyle(4,0x142f35);g.fillPoints(a.points,true);g.strokePoints(a.points,true);this.label.setPosition(a.text.x,a.text.y).setFontSize(Math.min(34,Math.max(24,18*ratio))).setVisible(true);}
}
