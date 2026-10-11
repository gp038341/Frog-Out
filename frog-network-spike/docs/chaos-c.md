# Chaos Voting C — arena-wide candidate

Approved B checkpoint: `checkpoint/approved-chaos-voting-b` at `bebe643ea43b80c084ee583212ed0e3f1b359449` (GitHub and Render matched before implementation).

## Effects

- Windy Weather: eight-second cycle, one-second directional warning, two-second gust, five seconds calm. Alternating right/left; airborne acceleration 3 units/s², adding no more horizontal wind impulse when already moving with the gust at 12 units/s. Grounded/frozen frogs excluded; grappling and swinging remain physical.
- Bouncy Bombardment: radius 0.65, mass 0.60, restitution 0.65, at most two balls. Entry every seven seconds, 0.8-second warning, ten-second lifetime; initial velocity (±3, 2), speed capped at 12 before stepping. Occupied entry delays spawn. Balls collide physically but cannot grapple, tag, freeze, rescue or poison. They are removed on expiration/reset.
- Crumble Time: every playable object participates, including all spring/mud/soap surfaces. Landing starts a one-second visible cracking warning; collision disappears for four seconds, then a 0.75-second return outline. Regeneration waits until frogs/balls clear its space. Supporting tongues detach on collapse. Landing rather than continuous standing is intentional so automatic spring bounces cannot make pads immune.
- Tilt-a-Frog: every playable object rocks about its center with physically colliding Planck kinematic rotation. Target is 8° × summed frog mass × normalized signed standing offset, bounded to ±12°, with proportional damping and a 25°/s angular-speed ceiling. No teleporting rotating colliders or extra launch impulses. Kinematic pinned rotation is the conservative implementation instead of freely dynamic motor bodies. Materials remain attached to the same colliders.

## Coverage and synchronization

Every arena solid except its fixed side/ceiling boundary bodies is automatically represented; no platform eligibility whitelist. The 40-unit continuous playable floor becomes eight adjacent five-unit sections only while Crumble or Tilt is active. Each section acts independently. Interior platform polygons, art, surface metadata, friction and positions are cloned exactly. Baseline bodies are retained inactive, not destructively edited. Fixed boundaries and existing non-lethal recovery remain intact. Expiration occurs between rounds followed by the normal reset, restoring authored bodies and safe spawns. No normal arena geometry changes.

Snapshots include platform identity, angle, angular velocity, collapse state/timers, wind schedule, balls and warning. Server gameplay is authoritative; client prediction restores and advances the same runtime layer. Original platform artwork is drawn separately only while needed, at the collider's pivot/angle; scenery, static camera, DOM HUD and touch input remain independent. Countdown does not consume chaos schedules or crumble platforms.

Crumble and Tilt are incompatible because both cover every platform. A rotating, disappearing support with clearance-dependent reappearance would need a separately validated combined lifecycle. Other C combinations remain eligible.

Latest C instruction supersedes prior A/B renewal: all active modifiers, including the expiring oldest, are excluded from the ballot; expiring remains explained separately. Maximum three, 15-second voting, normal Round 1, curated families, deterministic visible tie priority, disconnect handling and rematch reset remain unchanged.

## Evidence and limitations

166 automated tests pass, production build passes. Tests exercise every playable collider in every arena, real landing-triggered crumble and weight-driven tilt, safe restoration, bounds, materials, ball exclusion, snapshot restoration and combinations with Tiny/Mega/Moon/Super. All approved B sources are recoverable through explicit adapter reversals; unchanged files are hash protected, including iPhone touch/viewport and game rules.

22 compiled-server multiplayer scenarios pass across all three modes and 2–8 clients, including forced C combinations, voting, transitions, reconnect and disabled Chaos. 28 eight-frog/all-arena stress runs: maximum p95 0.193 ms, p99 0.869 ms versus 16.67 ms budget. These are local measurements, not Render CPU measurements.

Browser preview automation failed twice with tool timeouts; no new physical iPhone/Android testing is claimed. Exact collision-silhouette/local-coordinate rendering commands are unit-tested; browser rendering and mobile feel require user acceptance testing. Additional platform/object state increases snapshot size. Bounded balls and controlled tilt minimize solver cost; material handling remains the approved shared surface layer. Crumble may intentionally delay regeneration indefinitely while occupied. Frozen frogs stay immobilized by Freeze Tag rather than being carried by platform rotation.

## Playtest

Use Chaos ON, preferably 6–8 players for enough votes. Test each effect on all four arenas; verify every interior surface and floor section cracks/rocks. Try spring launches, mud/soap, tongues on disappearing/rotating supports, wind swings and ball contact. Check Tiny+Crumble, Mega+Balls, Moon+Wind, Super+Tilt. Refresh/reconnect during an effect, finish/rematch and confirm cleanup. Compare Chaos OFF with approved B. Repeat two-thumb landscape play on physical iPhone/Android; inspect silhouette/collider alignment, warning clarity and any corrections near rotating platforms. Do not approve solely from automation.
