# Milestone 1 — active grapple and responsiveness tuning pass

## Every changed or added physics parameter

| Parameter | Previous | Revised | Units / purpose |
|---|---:|---:|---|
| gravity | 22 | 26 | m/s²; less floaty |
| groundSpeed | 7 | 6 | m/s; lower running pace |
| groundAcceleration | 45 | 60 | m/s²; quicker response |
| groundBrake | 35 | 50 | m/s²; quicker stops |
| airAcceleration | 12 | 10 | m/s²; gentler steering without momentum clamping |
| jumpImpulse | 9 | 9.5 | Mass-scaled target upward launch speed, m/s |
| chargedJumpImpulse | 16 | 18 | Maximum target upward launch speed, m/s |
| chargeHorizontalImpulse | 5 | 4 | Maximum directional charge-launch boost, m/s |
| chargeThreshold | None | 0.14 | Seconds before deliberate hold becomes charging |
| jumpBufferSeconds | None | 0.10 | Seconds for near-landing input reservation/released-tap buffer |
| coyoteSeconds | None | 0.06 | Seconds of jump eligibility after losing support |
| grapplePullAcceleration | 0 (passive) | 48 | Relative inward acceleration, m/s² |
| grappleMaxPullSpeed | None | 8 | m/s relative closing speed above which added pull stops |
| grappleTakeupSpeed | 0 | 4 | m/s maximum takeup of existing slack |
| grappleMinLength | None | 0.65 | m; pull standoff and takeup floor, at least radius + 0.05 |

Unchanged: chargeSeconds 0.8, tongueRange 12, tongueSpeed 35, tongueRetractSpeed 45, frogRadius 0.45, frogMass 1, friction 0.15, restitution 0.05, velocityIterations 10, positionIterations 6, fixed physics rate 60 Hz. Damping remains zero; ground braking provides stopping without continuously draining swing momentum.

## Behavior changes

The active grapple applies mass-aware radial impulses. Dynamic targets receive equal and opposite impulses; static terrain stays fixed. Existing tangential velocity is untouched. Pull stops adding inward speed above the configured relative closing-speed ceiling, which is not a global velocity cap. Slower pull may be needed after playtesting.

The maximum-length constraint stays unilateral. It takes up slack only as the frog physically moves closer, capped by grappleTakeupSpeed. It never forcibly shortens a taut rope, teleports a body, or assigns a constant travel velocity. A small standoff prevents endless inward pushing directly against an anchor. Releasing destroys the joint and stops active pull without changing velocity.

Short taps below 0.14 seconds now have identical normal-jump strength. Charge starts only after that threshold; full charge takes another 0.8 seconds (0.94 seconds total hold). No launch occurs before release. Full-charge vertical launch speed is about 1.9 times normal launch speed, plus a directional boost.

Launching establishes predictable upward velocity instead of stacking an impulse onto downward landing velocity. Horizontal momentum is preserved. A 0.06-second support suppression after launch plus upward-velocity filtering prevents stale contact data from authorizing another grounded jump. Coyote time is reset by launch.

A downward surface probe recognizes descending frogs approximately 0.1 seconds from landing. A new action press there reserves a jump rather than firing a tongue. If released before landing, the tap launches on the contact step. If held through landing, it becomes a grounded charge attempt. If a held reserved press misses the landing window, it fires a tongue in its original sampled direction. Outside that small window, airborne presses fire normally. An existing tongue excludes the landing reservation.

Input edges are still queued independently of physics frames. Phaser's delta smoothing is disabled for the fixed-step accumulator. There is no animation delay, client prediction, render interpolation, or network delay in this spike. Physics can add up to roughly one 60-Hz step of input scheduling delay; subjective timing still needs human playtesting.

## Necessary one-button tradeoff

Immediate jump on button-down and grounded hold-to-charge cannot both start from the same ambiguous press without another gesture or undoing the first jump. This pass preserves the approved single-button model: quick tap launches on release with no extra wait; deliberate hold charges before release. A prelanding held press also charges rather than auto-jumping. Test whether that distinction meets your expectations before committing to later milestones.

## Retest in priority order

1. Jump, shoot up at the center platform underside, then hold without steering. From little momentum, does it actively lift you toward the anchor?
2. Shoot diagonally and steer sideways while held. Does the inward pull still allow useful arcs? Release near the bottom or side of an arc and check that momentum carries you away.
3. Shoot another frog. Start both near rest, then steer them apart. Do both respond, collide, and remain stable? Does the pull feel too strong or too weak?
4. Compare quick taps of different lengths below 0.14 seconds. They should have the same launch strength. Compare holds of 0.3, 0.6, and 0.94 seconds; the charge indicator appears only after the threshold.
5. While falling just above the floor, tap/release action before landing. It should bounce into a normal jump on contact without an intervening tongue shot. Then hold through landing and release to charge-launch.
6. Tap immediately after landing, and near a platform edge. Check for ignored inputs or unwanted extra jumps.
7. Fire a downward tongue while very close to landing. The small jump-reservation window is an intentional ambiguity: decide whether it feels helpful or too intrusive.
8. Run/reverse/stop. Lower top speed should coexist with quicker acceleration and braking. Evaluate heavier falling and reduced air steering separately.

## Verification

Type check / production build passed. All 17 automated physics cases passed, including a 60-second simulated two-frog grapple stress test without safety resets or non-finite state. Browser visual verification remains uncompleted because the available environment lacks a usable Chromium installation; it failed to download during the previous pass. These numerical checks do not establish subjective game feel.

Only Milestone 1 was changed. No networking, infection, scoring, lobby, mobile controls, presentation polish, art or audio was added.
