# Chaos C — precise anchors and rotated materials candidate

Parent and pre-change checkpoint: `97de00551741e4aa877963662493f290623adace`, `checkpoint/pre-chaos-c-platform-contact-refinement`.
Public target: https://frog-out.onrender.com/ (existing Free service only).

## Changes

- Real raycast hit points are retained for rotating platforms, as body-local anchors. The former generic dynamic-body center shortcut caused snapping and zero lever arm. Approved frog-to-frog center attachment remains unchanged.
- Contact normals are evaluated relative to the platform's material-bearing top. Authoritative support-point velocity is included for grounded classification, impact energy and rotated spring launch. Springs preserve tangent momentum and set outward velocity relative to the support; normal static springs retain their exact vertical launch behavior. Mud/soap flags restore on departure. Supported frogs can charge, including an upward-moving support. Losing actual contact still stops charge under the existing controller rules.
- Both Tilt and Crumble exclude bottom ground and invisible boundaries, affecting all airborne playable platforms. Crumble fragment rendering explicitly follows synchronized effect state rather than inferring it from floor segments. Existing material-preserving breakup visuals remain.
- Bombardment interval: 420 → 150 ticks (7 → 2.5 seconds). Maximum: 2 → 8. Warning .8 seconds, mass1.6, contact speed floor18, speed cap22, restitution1 and persistence unchanged. A sub-.001 overspeed tolerance is tightened so eight-ball interactions always obey the cap.
- Expiring modifier KEEP ballot renewal remains unchanged. Wind unchanged and still awaiting owner playtest.

## Verification

178 automated tests pass and production build passes. Focused tests fire actual tongues into off-center points above/below terrain, check torque, rotated spring normal/tangent velocity, rotated mud/soap restoration, support/charge, bottom-floor exclusion and persistent eight-ball limit. Source preservation manifest freezes unrelated approved files, including touch/viewport, arenas, modes, sound and scoring.

22 local compiled-server multiplayer scenarios pass: all three modes with 2–8 clients, voting, renewal, ties/abstentions, reconnect, reservation timeout, rematch and disabled Chaos.

28 eight-frog local authoritative simulation stress cases: all four arenas and seven representative modifier sets, 1800 ticks each. Worst p95 .211 ms, p99 .412 ms versus 16.67 ms tick budget. This is local performance, not a measurement of Render CPU or physical devices. No physical iPhone/Android testing claimed for this candidate; their accepted input/viewport source bytes are unchanged.

## Playtest

1. On Tilt, shoot near either end of platforms from above/below. Contact stays on the aimed point as the object rotates; no center snap. Compare off-center torque to a deliberately centered shot.
2. Ride and charge on a supported rotating ordinary platform. Release normally; actual lift-off ends charge as before.
3. Land on angled lilies/sponges/cushions: launches follow their facing normal, while tangential momentum remains. Try mud/soap, leaving and re-entering.
4. Bombardment entries occur every 2.5 seconds after .8-second warnings, until eight persistent balls are present. Check readability and collisions with 4–8 players.
5. Crumble several airborne platforms: artwork breaks apart, regrows safely and loses attached tongues on collapse. Bottom ground always stays intact.
6. Recheck KEEP renewal, normal Round1, all modes, touch two-thumb controls and reconnect. This is a candidate pending owner acceptance, not Milestone C approval.
