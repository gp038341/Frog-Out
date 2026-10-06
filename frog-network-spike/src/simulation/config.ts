export const defaults = {
 gravity: 26, groundSpeed: 6, groundAcceleration: 60, groundBrake: 50,
 airAcceleration: 10, jumpImpulse: 9.5, chargedJumpImpulse: 18,
 chargeThreshold: 0.14, chargeSeconds: 0.8, chargeHorizontalImpulse: 2,
 jumpBufferSeconds: 0.1, coyoteSeconds: 0.06,
 grapplePullAcceleration: 48, grappleMaxPullSpeed: 8,
 grappleTakeupSpeed: 4, grappleMinLength: 0.65, frogGrappleClearance: 0.2,
 tongueRange: 12, tongueSpeed: 35, tongueRetractSpeed: 45,
 frogRadius: 0.45, frogMass: 1, friction: 0.15, restitution: 0.05,
 velocityIterations: 10, positionIterations: 6,
};
export type Tuning = typeof defaults;
export const DT = 1 / 60;
export const WIDTH = 32, HEIGHT = 18;
export const arena = [
 {x:16,y:17.5,w:32,h:1}, {x:0.25,y:9,w:0.5,h:18},
 {x:31.75,y:9,w:0.5,h:18}, {x:16,y:0.25,w:32,h:0.5},
 {x:7,y:12,w:6,h:0.5}, {x:23,y:12,w:6,h:0.5},
 {x:16,y:7,w:7,h:0.5}, {x:7,y:5,w:3,h:0.5},
 {x:25,y:4,w:3,h:0.5},
];
