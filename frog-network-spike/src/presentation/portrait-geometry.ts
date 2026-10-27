import type Phaser from 'phaser';
import {SVGGraphics} from './svg-graphics';
// Original approved lobby silhouette, copied verbatim from the pre-options portrait.
export const PORTRAIT_BODY='M22 62Q22 40 42 34Q62 27 81 35Q99 44 99 66Q97 83 78 87H42Q22 84 22 62Z';
export const PORTRAIT_LEFT_FOOT='M28 71Q12 77 15 85L25 87 30 90 43 83';
export const PORTRAIT_RIGHT_FOOT='M91 71Q109 77 106 85L95 87 90 90 77 83';
type Point={x:number;y:number};type Subpath={points:Point[];closed:boolean};const cache=new Map<string,Subpath[]>();
/** Compile fixed catalog paths once; 24 samples/curve remain smooth even in large previews. */
function pointsFor(d:string){const saved=cache.get(d);if(saved)return saved;const tokens=d.match(/[MLQCHVZ]|-?\d*\.?\d+/g)!;const paths:Subpath[]=[];let i=0,cmd='',x=0,y=0,path:Subpath|undefined;const n=()=>Number(tokens[i++]),push=(px:number,py:number)=>{x=px;y=py;path!.points.push({x,y});};while(i<tokens.length){if(/^[A-Z]$/.test(tokens[i]))cmd=tokens[i++];if(cmd==='M'){x=n();y=n();path={points:[{x,y}],closed:false};paths.push(path);cmd='L';}else if(cmd==='L')push(n(),n());else if(cmd==='H')push(n(),y);else if(cmd==='V')push(x,n());else if(cmd==='Q'){const x0=x,y0=y,cx=n(),cy=n(),ex=n(),ey=n();for(let j=1;j<=24;j++){const t=j/24,u=1-t;push(u*u*x0+2*u*t*cx+t*t*ex,u*u*y0+2*u*t*cy+t*t*ey);}}else if(cmd==='C'){const x0=x,y0=y,a=n(),b=n(),c=n(),e=n(),ex=n(),ey=n();for(let j=1;j<=24;j++){const t=j/24,u=1-t;push(u*u*u*x0+3*u*u*t*a+3*u*t*t*c+t*t*t*ex,u*u*u*y0+3*u*u*t*b+3*u*t*t*e+t*t*t*ey);}}else if(cmd==='Z'){path!.closed=true;cmd='';}else throw Error('Unsupported fixed portrait path');}cache.set(d,paths);return paths;}
/** Maps original 120×100 portrait coordinates into the unchanged gameplay radius. */
export class PortraitPen {
 readonly scale:number;
 constructor(private g:Phaser.GameObjects.Graphics,private x:number,private y:number,r:number,private sx=1,private sy=1,private originY=54,private dy=0){this.scale=r/38.5;}
 point(x:number,y:number){return{x:this.x+(x-60)*this.scale*this.sx,y:this.y+(y+this.dy-this.originY)*this.scale*this.sy};}
 path(d:string,fill:number|undefined,stroke:number|undefined=undefined,width=3,alpha=1){const p=this.point(0,0),ax=this.scale*this.sx,ay=this.scale*this.sy;if((this.g as unknown) instanceof SVGGraphics){(this.g as unknown as SVGGraphics).vectorPath(d,p.x,p.y,ax,ay,fill,stroke,width,alpha);return;}for(const sub of pointsFor(d)){const pts=sub.points.map(p=>this.point(p.x,p.y));if(fill!==undefined){this.g.fillStyle(fill,alpha);this.g.fillPoints(pts,true);}if(stroke!==undefined){this.g.lineStyle(width*this.scale,stroke,alpha);this.g.strokePoints(pts,sub.closed);}}}
 ellipse(x:number,y:number,rx:number,ry:number,color:number,stroke?:number,width=3,alpha=1){const p=this.point(x,y);this.g.fillStyle(color,alpha);if(rx===ry&&this.sx===this.sy)this.g.fillCircle(p.x,p.y,rx*this.scale*this.sx);else this.g.fillEllipse(p.x,p.y,rx*2*this.scale*this.sx,ry*2*this.scale*this.sy);if(stroke!==undefined){this.g.lineStyle(width*this.scale,stroke,alpha);if(rx===ry&&this.sx===this.sy)this.g.strokeCircle(p.x,p.y,rx*this.scale*this.sx);else this.g.strokeEllipse(p.x,p.y,rx*2*this.scale*this.sx,ry*2*this.scale*this.sy);}}
 line(points:Point[],color:number,width=3){this.g.lineStyle(width*this.scale,color);this.g.strokePoints(points.map(p=>this.point(p.x,p.y)),false);}
 rect(x:number,y:number,w:number,h:number,r:number,color:number,stroke?:number,width=2){const p=this.point(x,y);this.g.fillStyle(color);this.g.fillRoundedRect(p.x,p.y,w*this.scale*this.sx,h*this.scale*this.sy,r*this.scale);if(stroke!==undefined){this.g.lineStyle(width*this.scale,stroke);this.g.strokeRoundedRect(p.x,p.y,w*this.scale*this.sx,h*this.scale*this.sy,r*this.scale);}}
}
