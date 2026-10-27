import {Vec2,type Body,type Contact} from 'planck';
/** Surface orientation and point velocity are authoritative body properties. */
export function platformContact(c:Contact,frog:Body){
 if(!c.isTouching()||!c.isEnabled()||c.getFixtureA().isSensor()||c.getFixtureB().isSensor())return;
 const a=c.getFixtureA().getBody(),b=c.getFixtureB().getBody();if(a!==frog&&b!==frog)return;
 const body=a===frog?b:a,m=c.getWorldManifold(null);if(!m)return;
 const sign=a===frog?-1:1,out=Vec2(m.normal.x*sign,m.normal.y*sign),rotating=!!(body.getUserData()as{chaosPlatform?:boolean}|undefined)?.chaosPlatform||!!(body.getUserData()as{arenaMoving?:boolean}|undefined)?.arenaMoving;
 const up=body.getWorldVector(Vec2(0,-1));
 return {body,out,rotating,top:rotating?Vec2.dot(out,up)>.5:out.y<-.5,point:m.points[0]??frog.getWorldCenter()};
}
