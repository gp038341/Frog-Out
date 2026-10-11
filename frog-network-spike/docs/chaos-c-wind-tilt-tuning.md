# Chaos C wind/rotation tuning candidate

Parent: `a395feb328b915c20fc146666047b60b3f74c097`.
Pre-change checkpoint: `checkpoint/pre-chaos-c-wind-tilt-tuning`.
Deployment target: existing Free `frog-out` at https://frog-out.onrender.com/ only.

The owner likes the refined Tilt, Bombardment and Crumble behavior; this pass slightly softens rotation and makes Wind substantial on ground as well as air. No new milestone/content.

| Parameter | Before | Candidate |
|---|---:|---:|
| Tilt angular-speed ceiling | 100°/s | 85°/s |
| Tilt angular damping | .25 | .35 |
| Wind airborne acceleration | 3 units/s² | 18 units/s² |
| Wind grounded acceleration | not applied | 64 units/s² |
| Wind directional speed ceiling | 12 units/s | 16 units/s |
| Gust duration | 2 s | 3 s |
| Warning / total cycle | 1 s / 8 s | unchanged |

Ground force must overcome the existing 50 units/s² neutral ground brake and terrain friction; it is therefore stronger than air force. Steering remains unchanged and opposes the gust. Wind runs after movement controllers and grapple pulls, before authoritative stepping. It stops adding velocity once the directional ceiling is reached; it does not clamp existing carried momentum. Frozen nondynamic bodies, paused/countdown state and inactive/expired modifiers receive no wind impulse.

Unlimited center-hinge rotation, platform mass, exact terrain ray anchors, reciprocal grapple forces and rotated material behavior remain unchanged. Increased damping eases coasting while reduced ceiling softens the fastest turns. Bottom ground remains excluded from both platform modifiers.

Bombardment stays at eight persistent balls, one entry/2.5 seconds, with unchanged mass, speed and energy settings. Crumble breakup/regeneration is untouched. Mobile/iPhone input and viewport, graphics, sound, arenas, core movement, scoring and game modes retain exact source bytes outside the narrow authoritative wind hook and configuration changes.

## Validation

182 automated tests pass; production build passes. Tests demonstrate neutral grounded wind displacement, airborne impulse, forecasts/direction changes, speed ceiling, pause and expiration, softened rotation constraints and historical source preservation. The full existing precise-anchor/rotated-material/eight-ball/Crumble/input suites still pass.

28 local eight-frog simulation cases across all four arenas and seven representative stacks: worst p95 .281 ms, p99 .647 ms, versus 16.67 ms budget. Local timing does not certify Render CPU or physical devices.

Compiled-server multiplayer coverage runs 22 scenarios including all three modes with 2–8 clients, modifier synchronization, voting/renewal, reconnect/timeout and rematches. Physical-device acceptance remains the owner's test; no physical iPhone/Android run claimed.

## Acceptance

Compare platform spin under off-center standing and above/below grapples: still responsive and freely rotating, but less frantic. Ride and charge; test diagonal springs. During wind warning watch direction, then stand still on ground, run against/with gusts, jump and swing. Try Wind + Moon and Wind + Tilt/Bombardment with several frogs, checking useful escape control and recovery. Confirm approved Bombardment/Crumble behavior remains unchanged.
