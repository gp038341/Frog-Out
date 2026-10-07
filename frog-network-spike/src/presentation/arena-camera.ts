/** Presentation only. Units are metres; never writes a simulation body. */
export type CameraPoint={x:number;y:number;vx?:number;vy?:number};
export type CameraFrame={x:number;y:number;zoom:number;targetZoom:number;fitZoom:number};
export const CAMERA={minZoom:1,desktopMaxZoom:1.28,mobileMaxZoom:1.18,marginX:3.5,marginTop:3,marginBottom:2,lookAheadSeconds:.1,zoomDeadBand:.035,centerDeadBand:.35,settleSeconds:.45,zoomInSeconds:1.8,zoomOutSeconds:.32,panSeconds:.5};
const clamp=(n:number,lo:number,hi:number)=>Math.min(hi,Math.max(lo,n));
const blend=(a:number,b:number,dt:number,tau:number)=>a+(b-a)*(1-Math.exp(-dt/tau));
export class ArenaCamera {
 frame:CameraFrame;private target=1;private settled=0;
 constructor(readonly width:number,readonly height:number){this.frame={x:width/2,y:height/2,zoom:1,targetZoom:1,fitZoom:1};}
 reset(){this.target=1;this.settled=0;this.frame={x:this.width/2,y:this.height/2,zoom:1,targetZoom:1,fitZoom:1};return this.frame;}
 update(points:readonly CameraPoint[],deltaMs:number,mobile:boolean,dynamic=true):CameraFrame{
  if(!dynamic||points.length<2)return this.reset();
  const valid=points.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));if(valid.length<2)return this.reset();
  const dt=clamp(deltaMs/1000,0,.05),maxZoom=mobile?CAMERA.mobileMaxZoom:CAMERA.desktopMaxZoom;
  const projected=valid.flatMap(p=>[p,{x:p.x+clamp(p.vx??0,-30,30)*CAMERA.lookAheadSeconds,y:p.y+clamp(p.vy??0,-30,30)*CAMERA.lookAheadSeconds}]);
  const left=clamp(Math.min(...projected.map(p=>p.x))-CAMERA.marginX,0,this.width),right=clamp(Math.max(...projected.map(p=>p.x))+CAMERA.marginX,0,this.width);
  const top=clamp(Math.min(...projected.map(p=>p.y))-CAMERA.marginTop,0,this.height),bottom=clamp(Math.max(...projected.map(p=>p.y))+CAMERA.marginBottom,0,this.height);
  const fit=clamp(Math.min(this.width/Math.max(1,right-left),this.height/Math.max(1,bottom-top)),CAMERA.minZoom,maxZoom);
  if(fit<this.target){this.target=fit;this.settled=0;}
  else if(fit-this.target>CAMERA.zoomDeadBand){this.settled+=dt;if(this.settled>=CAMERA.settleSeconds)this.target=fit;}
  else this.settled=0;
  let z=blend(this.frame.zoom,this.target,dt,this.target<this.frame.zoom?CAMERA.zoomOutSeconds:CAMERA.zoomInSeconds);
  // Safety wins over smoothing if recovery or fast separation would crop a frog.
  z=clamp(Math.min(z,fit),CAMERA.minZoom,maxZoom);
  const halfW=this.width/(2*z),halfH=this.height/(2*z);
  const axis=(a:number,mid:number,min:number,max:number,half:number,world:number)=>{
   let c=Math.abs(mid-a)>CAMERA.centerDeadBand?blend(a,mid,dt,CAMERA.panSeconds):a;
   c=clamp(c,Math.max(half,max-half),Math.min(world-half,min+half));return c;
  };
  this.frame={x:axis(this.frame.x,(left+right)/2,left,right,halfW,this.width),y:axis(this.frame.y,(top+bottom)/2,top,bottom,halfH,this.height),zoom:z,targetZoom:this.target,fitZoom:fit};return this.frame;
 }
}
