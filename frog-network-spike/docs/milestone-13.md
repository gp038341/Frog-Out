# Milestone 13 — Sunny Pond and interactive surfaces prototype

Approved baseline: `2a23a41336291e05f1da12c5101bd668994f2df0`.
Git checkpoint: `checkpoint/approved-milestone-12-balance`.
Approved deployed baseline: Render `dep-db3el1vavr4c739ff060`, same commit, service `frog-out-milestone-2`.
Prototype checkpoint: `checkpoint/milestone-13-sunny-pond-candidate` (its tip records the precise candidate revision).
Public URL: https://frog-out-milestone-2.onrender.com/

## Design

Sunny Pond is a third host-selectable 40 × 22.5 single-screen arena. Canopy Courtyard and Rainbell Conservatory keep their exact geometry/theme/material behavior. Sunny Pond has a familiar ordinary floor, ceiling and boundary walls; two optional low mud perches; two offset lily launch pads; a central interception log; two high side branches; and a high central branch. Most collision surfaces remain ordinary. Open central air favors pad-to-tongue launches, cross-pond swings, interceptions and multiple vertical escape routes. No hiding pockets, lethal water, moving platforms or new mode.

Bright sky, sun, soft clouds/reeds and decorative pond ripples establish a different place. Only outlined rectangular surfaces collide; decorative water is scenery. Green pads have leaf veins, spring chevrons and a flower; mud has dark clods/flecks. Thumbnails derive from the same authoritative rectangles and material metadata. Ready/Start remain above the three-card list, with existing sticky/mobile hierarchy unchanged.

## Exact prototype surface tuning

`src/simulation/surfaces.ts`, exported `SURFACES`:
- `lilyLaunchSpeed: 12` world units/s upward, versus approved normal jump 9.5 and full charged jump 18.
- `lilyMinLandingSpeed: 0.8` downward world units/s. Standing still, side scrapes, underside contacts and tongue intersections do not bounce.
- `lilyCooldownTicks: 12` (0.2 seconds at 60 Hz), per frog. A genuine new downward landing can bounce again after the cooldown; this is not a standing auto-jump timer.
- `mudGroundSpeedMultiplier: 0.75`: controlled ground speed 6 → 4.5, only when physically supported on mud. Takeoff/departure clears it; air acceleration/normal jump/charge/grapple tuning are untouched. Mud is a local running penalty, not a hard clamp on carried/grapple momentum.

Bounce adds only the vertical impulse needed to reach −12 after contact solving. Native contact friction can still reduce lateral landing speed as on any platform; the bounce itself adds no horizontal impulse. Buffered jump release takes priority if the approved controller already launches on the landing tick. Bounces clear grounded/coyote support briefly so the next valid airborne action can fire the tongue; they never detach existing ropes, change rope lengths or bypass physical constraints. Taut ropes can absorb some launch movement. Both poison and safe frogs receive the same surface behavior; the approved poison pull multiplier remains 1.1 with ceiling 8.

## Authority and architecture

Static material metadata is attached only to Sunny Pond bodies. Shared simulation prepares/clears the grounded mud state and resolves top-contact lily arrivals each physics step. The server makes gameplay decisions. Snapshot restoration includes optional mud/bounce event fields so the existing client predictor mirrors the same behavior rather than inventing client-only launches. No input, viewport, camera, room, reconnect, rule or scoring architecture change. Round reset clears transient surface state.

Presentation consumes the authoritative/predicted bounce event stamp to add a brief green launch pop and reuse the approved local charge sound. Mud adds small foot flecks. Approved sounds and mix limits are byte-identical. No external assets or dependencies.

## Validation and limitations

Unit/controller/preservation suite and independent real WebSocket reports are in `docs/results/milestone-13-*.json`. Tests cover true top landings; side/underside/standing rejection; unchanged horizontal bounce impulse; mud departure/jump; eight simultaneous arrivals; state restoration; terrain/frog grapples and release; all three arenas at 2/3/4/8 clients; room/ready/reconnect/rotation/scoring/results/rematch; desktop/phone/tablet presentation and synthetic two-thumb/browser-interruption stress.

Browser phone testing is Chromium emulation, not new physical iPhone/Android certification. Accepted iPhone touch, viewport, normalized input and orientation source files remain exact. Physical-device acceptance and human fairness/fun testing of this new arena remain outstanding. Existing clustered name-label overlap remains possible. World/camera/frog scale are unchanged, so the map improves route variety rather than increasing physical world dimensions.

## Acceptance checklist

Select Sunny Pond in the lobby; everyone sees the same preview/name, map changes clear Ready. Test 2 players and a larger group. Land on both pads, then fire/hold/release tongue toward logs/ceiling/frogs. Try repeated/simultaneous landings and a buffered jump. Take optional mud routes, jump/walk off, and confirm immediate return to ordinary control. Test grappling across mud: pulling/momentum should remain physical, not become sticky or locked. Play full Poison Tag matches, reconnect, rematch and switch back to both original maps. Check desktop and actual two-thumb iPhone/Android play, readability, bounce sound/visual cue and static framing. Report uncontrollable launches, frequent corrections, sticky contact or unavoidable mud chokes.

Stop after deployment for designer acceptance. No further surface types, maps, modes or milestone.
