import type {Body} from 'planck';
import type {Simulation,Frog} from '../../src/simulation/world';
import {defaults} from '../../src/simulation/config';
import {SURFACES} from '../../src/simulation/surfaces';
import {MODIFIERS,type ModifierId} from '../../src/chaos/registry';
import type {ArenaChaosState} from '../../src/chaos/arena-chaos';
/** Read-only public observations. Never inspect private RNG, future swap pairs or AI peers' goals. */
const contexts=new WeakMap<Simulation,{ids:readonly ModifierId[];signature:string;tick:number;arena?:ArenaChaosState}>();
export function setChaosContext(sim:Simulation,ids:readonly ModifierId[]){const signature=ids.join('|'),old=contexts.get(sim);if(old?.signature===signature)return;contexts.set(sim,{ids:[...ids],signature,tick:-100});}
export function chaosContext(sim:Simulation){let c=contexts.get(sim);if(!c){c={ids:[],signature:'',tick:-100};contexts.set(sim,c);}if(sim.tick<c.tick||sim.tick-c.tick>=6){c.tick=sim.tick;c.arena=sim.arenaChaos.capture();}return c;}
export function chaosPhysics(sim:Simulation,f:Frog){const t=sim.tuning;return{
 gravity:Math.max(.25,t.gravity*Math.abs(f.body.getGravityScale())),
 // Active reverse steering uses acceleration, not neutral coasting friction.
 steering:Math.max(.1,t.groundAcceleration*(f.slipperySoap?SURFACES.soapAccelerationMultiplier:1)),
 coast:Math.max(.1,t.groundBrake*(f.slipperySoap?SURFACES.soapBrakeMultiplier:1)),
 speed:t.groundSpeed*(f.stickyMud?SURFACES.mudGroundSpeedMultiplier:1),
 pullRatio:t.grapplePullAcceleration/defaults.grapplePullAcceleration,
 lickRatio:t.tongueSpeed/defaults.tongueSpeed,
 slippery:(sim.chaosButterfeet||!!f.slipperySoap)&&chaosContext(sim).ids.length>0,
 active:chaosContext(sim).ids.length>0||sim.stickyFrogs.active||sim.chaosMoon||sim.extremeChaos.gravityActive,
 };}
export function platformView(sim:Simulation,body:Body){if(!(body.getUserData()as any)?.chaosPlatform)return;const p=body.getPosition();return chaosContext(sim).arena?.platforms.find(v=>Math.abs((v.x??v.solid.x)-p.x)<.01&&Math.abs((v.y??v.solid.y)-p.y)<.01);}
export function platformRisk(sim:Simulation,body:Body){if(!body.isActive())return Infinity;const p=platformView(sim,body);return !p?0:p.stage==='absent'||p.stage==='returning'?Infinity:p.stage==='cracking'?2+Math.max(0,60-p.clock)*.16:Math.min(3,Math.abs(p.velocity)*1.4);}
export function hazardCost(sim:Simulation,q:{x:number;y:number}){const a=chaosContext(sim).arena;if(!a)return 0;let risk=0;for(const b of a.balls){const d=Math.hypot(q.x-b.x-b.vx*.18,q.y-b.y-b.vy*.18);risk+=Math.max(0,3-d)*1.3;}if(a.ballWarning&&q.y<4)risk+=Math.max(0,3-Math.abs(q.x-a.ballWarning.x))*2;return risk;}
/** Stable individual tastes plus bounded context weights; randomness still chooses among legal cards. */
export function voteWeights(choices:readonly ModifierId[],active:readonly ModifierId[],salt:number,style:{grapple:number;vertical:number;risk:number},mode?:string){return choices.map(id=>{const m=MODIFIERS.find(m=>m.id===id)!,hash=Math.imul(salt^(MODIFIERS.indexOf(m)+1)*2654435761,2246822519)>>>0;let weight=.65+(hash%1000)/1000;
 if(m.family==='tongue')weight*=style.grapple;if(m.family==='movement'||id==='sticky_frogs'||id==='gravity_flip')weight*=.7+style.vertical*.4;
 if(m.family==='arena'||m.family==='social')weight*=style.risk;
 if(active.includes('mega_tongues')&&id==='super_suckers'||active.includes('super_suckers')&&id==='mega_tongues')weight*=1.25;
 if(mode==='freeze'&&id==='bumper_frogs')weight*=.85;
 // KEEP renews the same effect, evaluated normally with a modest individual novelty preference.
 if(active.includes(id))weight*=.8+(salt%7)*.05;return Math.max(.2,Math.min(3,weight));});}
/** Conservative free-flight rise bound from observed gravity/drag; no world stepping or body writes. */
export function jumpRise(sim:Simulation,speed:number){const f=sim.frogs.find(f=>f.body.isActive()&&!sim.frogChaos.trapped(f)),g=Math.max(.25,sim.tuning.gravity*Math.abs(f?.body.getGravityScale()??1)),drag=sim.chaosMoon?sim.chaosMoonDragY:0;return drag>0?speed/drag-g/(drag*drag)*Math.log1p(drag*speed/g):speed*speed/(2*g);}
