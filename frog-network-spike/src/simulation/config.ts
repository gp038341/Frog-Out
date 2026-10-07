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
// Milestone 6 changes arena geometry only; approved tuning above is frozen.
export {arena,WIDTH,HEIGHT} from './arena';
