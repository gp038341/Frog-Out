# Milestone 6: Arena, visual identity and presentation

## Approved starting point

Milestone 5 was personally approved on 2026-10-07. The approved deployed revision is `960a969664c3d24c0f9b0e542b84e572b280ec15`, recoverable from `checkpoint/milestone-5-approved`. Render deployment: `dep-db2nenrtqb8s73e50qbg`; public URL: https://frog-out-milestone-2.onrender.com/. The already-pushed `73a4c179ee26abfd924ad5ed65daf301e14a4805` adds public verification evidence only.

`approved-milestone-5.json` records protected source hashes. Preserve approved tuning, simulation controllers, reciprocal grapple, authority/prediction, lobby/reconnect, infection, rotation and survival scoring. Geometry and presentation changes are specifically authorized for this milestone; any geometry-dependent spawn/test changes must be documented.

## Stages

1. Arena geometry and traversal tests; save a geometry checkpoint before decoration.
2. Original frog/environment identity and non-color state readability.
3. Restrained feedback, functional HUD/results, short visual transitions and lightweight optional audio.
4. Desktop/touch/mixed-device regressions and existing Free Render deployment.

No other modes, accounts, progression, hazards, additional finished arenas or gameplay retuning. Milestone 6 requires the user's personal acceptance; automated tests cannot approve it.

## Stage 1: geometry

Canopy Courtyard is 40 × 22.5 simulation units (same 16:9 ratio), up from 32 × 18: 25% wider/taller and 56.25% more area. Seven thin interior ledges form staggered lower/middle/high routes. A continuous ground lane allows chases below the elevated swing beam; exposed platform ends offer exits on both sides. Side launches are 5.75 units above the floor, inside the unchanged fully charged jump height (~6.23 units). No new collision types or hazards. Every visible solid uses the same rectangle as the physics fixture.

Approved tuning/DT prefix, world/controller source, network protocol/prediction/client, server/lobby/reconnect/Outbreak rules and touch source remain byte-for-byte unchanged. The only simulation changes are the authorized geometry export and geometry-dependent reset spawns in the existing roster adapter (same two-player x positions; floor y becomes 20.5; larger rosters spread across the new floor). Recovery still resets the room's frogs as in the approved implementation; no new death or infection rule.

Historical config/roster whole-file assertions now defer to explicit M6 geometry exceptions plus a new tuning-prefix/protected-source hash test. Historical baseline JSON and archived M1 source remain intact. Existing tests that arranged frogs at the old floor/ledge now use new geometry coordinates; assertions and gameplay semantics are retained. A horizontal grapple transfer test was moved to open air to avoid the new middle ledge affecting its measurement.

Geometry checks: 53/53 unit tests; finite 30-second movement/jump/grapple simulations for 2/3/4/8 bodies; non-overlapping floor spawns and OOB recovery; unchanged tuning and protected systems; reachable vertical tiers and open ground lane. Independent 2/3/4/8-client WebSocket matches pass Patient Zero rotation, grace, same-tick ties, survival scoring, reconnect and tongue-not-infection checks (`results/outbreak-milestone-6.json`). Camping/chase quality remains a human acceptance question.
