# Milestone 2.1 — focused physics correction; acceptance pending

Approved Milestone 1 remains unchanged at the repository root and in history. Its original JSON/hash baseline is preserved. Frozen copies in approved-physics-config.ts and approved-physics-world.ts are hash-verified. Active simulation changes are explicitly tracked in physics-revision-2.1.json; this is an authorized revision, not a new approved baseline.

## Changes

| Parameter | Before | After |
|---|---:|---:|
| chargedJumpImpulse (target upward m/s) | 18 | 17 |
| chargeHorizontalImpulse (maximum boost m/s) | 4 | 3.5 |
| frogGrappleClearance (new center-spacing clearance m) | absent | 0.2 |

All other tuning constants remain unchanged. No air speed cap or damping was added; air acceleration and carried momentum remain unchanged. Normal jump, charge timing, gravity and ordinary ground controls remain unchanged.

Previously neutral ground braking canceled incoming pull; solver/controller ordering biased the result. Dynamic grapples now apply reciprocal mass-aware impulses after every movement controller. Both grounded participants skip neutral braking during a frog grapple; directional ground steering adds velocity only up to the existing run-speed target, preserving externally carried momentum. Static terrain grapple behavior and tuning remain unchanged.

Frog attachments now join body centers. A center-distance floor of two radii plus 0.2 m (1.1 m at default radii) prevents the shrinking rope from fighting body collisions. Pull stops at this separation while slack and tangential motion remain allowed. The tongue stays attached until release. This does not add automatic detach or new controls.

## Verification and limits

Regression tests cover reciprocal grounded/airborne pulling, pair movement after convergence, mixed grounded/airborne interaction, opposite momentum, charged-launch momentum while attached, ledge geometry, repeated attach/release, finite velocities, release momentum, all original physics scenarios, state restore and baseline hashes. Network harness repeats 50/100/150 ms added RTT with jitter. Automated tests do not establish subjective game feel or replace two-device acceptance.

Retest charge launch and terrain swing/release first. Then compare one-way pulls with both neutral, moving and resisting; swap grapplers. Try ledges, mutual attachment, close-contact steering and release. Both players should visibly respond. Terrain constraints and different momentum can naturally produce asymmetric motion. Export diagnostics from both clients immediately after problems.

No networking architecture, infection, scoring, lobby, audio or art changes. Deploy only to existing Render Free service. Milestone 2 remains unapproved; no Milestone 3.
