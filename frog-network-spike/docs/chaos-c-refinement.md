# Chaos C rotation, bombardment and crumble refinement — candidate

Recovery checkpoint: `checkpoint/pre-chaos-c-rotation-bounce-refinement` at `1a639afe5ea6802b7055d81e5754c9ef12a9cf28`. C has not been approved. Windy Weather is unchanged and awaits the owner's playtest.

## Latest owner decisions

- Tilt affects every airborne platform, **not the bottom floor**. Crumble continues covering the entire playable environment, including floor sections.
- Platforms can turn completely around and respond to standing weight and actual attached-grapple forces/momentum, from above or below.
- Balls should be fast, energetic, persistent and deliver stronger physical knockback.
- Crumbling should break apart the original platform artwork rather than adding yellow lines then hiding it abruptly.
- The oldest/expiring modifier must be offered for renewal. This supersedes C's previous ballot exclusion.

## Tuning

| Parameter | Previous C | Candidate |
|---|---:|---:|
| Tilt angle bounds | ±12° | unlimited full rotation |
| Tilt speed ceiling | 25°/s | 100°/s |
| Tilt platform model | commanded kinematic rocker | dynamic body on a free center hinge |
| Tilt mass | kinematic | 2 frog-mass units |
| Tilt angular damping | restoring controller | 0.25/s drag |
| Ball mass | 0.60 | 1.60 |
| Ball restitution | 0.65 | 1.00 |
| Ball friction | 0.12 | 0 |
| Ball entry velocity | ±3, +2 | ±12, +14 |
| Ball speed ceiling | 12 | 22 |
| Post-contact energy floor | none | 18 speed units |
| Ball lifetime | 10 seconds | no timeout |
| Maximum balls | 2 | 2 |
| Ball radius | 0.65 | 0.65 |

Gravity still produces an arc and slows upward travel; post-contact speed restoration replenishes energy lost during impacts rather than applying constant upward thrust. A completely stalled contacted ball receives a bounded recovery bounce. Additional knockback comes from the heavier, faster physical body, not tagging changes or arbitrary frog impulses. Persistent balls survive round resets and retained-modifier changes with the same IDs. They disappear only when Bombardment expires, the match resets, or the room ends. On round/configuration transitions, a retained ball is moved to a clear entry point only if restored terrain would overlap it. Balls pause collision during announcements/countdown. A ball-only lower boundary prevents escape through crumbled floor sections without adding a frog floor or affecting frog recovery. Full capacity suppresses further entry warnings.

Dynamic platforms use real contact weight and rope forces. Tongue reaction impulses act at the anchor point, use rotational effective mass and anchor velocity, and can turn the hinge from either side. Frog-to-frog reciprocal pulling is unchanged. Snapshot terrain targets include rotating bodies and preserve positions/velocities/angles. Spring/mud/soap support accepts only the newly rotating terrain in addition to existing static terrain; balls remain excluded. Grounding accounts for upward-moving support velocity only on these platforms. All normal movement/grapple constants are unchanged.

Crumble keeps its existing one-second warning, four-second absence, 0.75-second clear-only return and safe detach behavior. The original vector artwork separates into four masked pieces, spreads during the warning, and tumbles/fades for 0.6 seconds after collapse. Debris is cosmetic; it adds no physics objects or tags. Visual cost is bounded to four fragments per platform, only while breaking; controls, viewport, camera and HUD layout are unchanged.

Renewing the guaranteed KEEP card shifts the oldest effect to newest with no duplicate. The other two cards exclude kept effects and incompatibilities. Crumble/Tilt remain incompatible. Wind timing/strength are unchanged, not physically approved by this refinement.

## Validation / acceptance

172 automated tests and production build pass. Tests include full revolution, floor preservation in every arena, reciprocal torque from above/below, rotating-anchor restoration, energetic ball knockback, speed bounds, persistent ball IDs across resets, all previous modes/materials/cosmetics and exact recovery of prior source. Network/stress reports: `results/chaos-c-refinement-network.json`, `results/chaos-c-refinement-stress.json`. 28 eight-frog/all-arena stress runs: worst p95 0.228 ms, p99 2.793 ms versus a 16.67 ms budget. All 22 compiled-server multiplayer scenarios pass. Measurements are local, not Render CPU or physical-device measurements.

Browser preview tooling was previously unavailable; no new physical desktop/Android/iPhone testing is claimed. The iPhone input/viewport sources remain hash protected. Validate animation/masks, full rotations and faster-ball readability on actual devices. Frozen frogs remain immobilized according to existing Freeze Tag rules.

Playtest: weight near each end, charged landings, above/below off-center grapples, grapple-release momentum, spring/soap/mud on rotating objects, permanent bottom floor, persistent faster balls and stronger collisions, original-material crumble fragments, expiring KEEP renewal, reconnect and rematch cleanup. Wind remains a separate untested player-acceptance item.
