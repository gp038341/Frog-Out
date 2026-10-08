# Sunny Pond refinement candidate

Parent checkpoint: `aea27f203dcefdc9a88667fc33423b46b5b53ca0` (`checkpoint/milestone-13-sunny-pond-candidate`).

Sunny Pond now uses matching convex collision/art silhouettes: rounded eight-vertex lily leaves, tapered branches/log, and sloped rocky mud perches. No geometry changes to the two previous arenas. Decorative sprigs/flowers remain non-solid; dark outlined silhouettes are solid and grapple-able.

Lily pads automatically launch a frog on top contact, including a resting frog, and launch again on every return landing without a jump input. Upward velocity is still 12 units/s, cooldown 12 ticks (0.2s); the previous 0.8 downward-speed requirement is removed. Buffered jumps still take priority, sides/undersides/tongues do not activate pads, ropes remain physical, and no horizontal impulse is added. Mud still limits controlled ground running to 75% (4.5 units/s) only while supported.

Home/lobby use sky-blue backgrounds, darker pond-blue panels, leafy player cards and mint/yellow Ready states. The earlier pale panels were replaced following playtest feedback. CSS changes are non-gameplay color/background overrides; no input, viewport, orientation, canvas sizing or networking changes.

Original vector art; approved sound palette unchanged. Accepted poison buff unchanged. Human mobile/multiplayer aesthetic and fairness acceptance remains required.

Test: hands-off repeated bounces; both pad edges; mud jump/departure; grapple around shaped objects and while bouncing; two-thumb play; lobby Ready/Start readability; original maps and rematch.
