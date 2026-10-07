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

## Stage 2: original identity and presentation

Geometry checkpoint: `f6fed406e2db307906b41503cfa429bfa4d4ede4` / `checkpoint/milestone-6-geometry`. A 60-second, eight-WebSocket-client production-room stress run completed four rounds: tick p95 0.345 ms, p99 0.672 ms, maximum 10.46 ms, zero 16.67 ms budget overruns. This measures the shared local runner, not Render capacity.

The original Canopy Courtyard treatment uses dark pond foliage behind exact wooden/moss collision rectangles, cream lettering, mint UI actions and pink tongues. Frogs retain eight slot colors and eight small permanent markings; eyes, feet, belly, charge squish, jump stretch and contact reactions are procedural vector drawing. Poison adds X cheeks, an outlined/spore silhouette and explicit POISON text; grace uses animated marks and GRACE text; Patient Zero has a crown and ZERO text. Local frog has a pointer/outline. Names/offline status remain visible. Tongues sag only when rope slack exists and show attachment/tension rings. Effects are capped at 64 short ring/particle bursts. No camera shake, teleports, hit pauses or physics changes.

Home/lobby, ready cards, Patient Zero/countdown overlay, live survival/healthy count, round component table and final winners now share the identity. Intro overlay appears only during the existing frozen announcement/countdown; results enter with a short 220 ms visual animation. Host-driven continuation and authoritative timing are unchanged. Fullscreen, sizing and two-thumb input code remain protected. New exact-block hashes guard normalized inputs, interpolation, prediction coupling, correction smoothing and responsive/fullscreen code inside main.ts, in addition to the protected source files and tuning prefix.

Audio is optional, off by default and enabled only by the Sound button. Original Web Audio oscillator cues cover local jump/charge/tongue/attachment and infection/countdown/go/results/UI. No music, samples or extra service.

An isolated browser test caught/fixed presentation color lookup on unassigned lobby slots (-1). The new browser visual checks show eight distinguishable frogs on desktop and phone; mobile controls do not overlap the canvas. Native iOS/Android visual readability/audio remain personal acceptance checks.

## Final regression evidence and limits

- 53/53 unit tests, including tuning/controller/input/prediction/fullscreen and lifecycle hash guards.
- Independent WebSocket Outbreak matches with 2/3/4/8 clients; Patient Zero rotation, infection/grace, simultaneous ties, survival scoring and offline vulnerability/reconnect.
- 16 lifecycle checks, including actual 30-second expiry (30,013 ms), stale input/tongue clearing, same-frog restoration and lobby return.
- 12 hybrid/compatibility checks: repeated switching in five gameplay states, 5 viewport sizes × both layouts, fullscreen enter/exit and unsupported/rejected cases, orientation and reconnect.
- 15 mobile checks: trusted two-thumb input, four mixed device-size contexts, phone-only complete matches, actual jump/charge/grapples, cancellation, orientation, results and reconnect; no browser runtime errors.
- Desktop browser checks at 50/100/150 ms added RTT with ±10 ms/leg jitter: jump, terrain grapple/release, reconnect and diagnostic export; zero large snaps, correction p95 0.014/0.042/0.127 units in these short runs.
- Production-timed three-browser Outbreak presentation/round/rematch regression; eight-browser visual checks for lobby/reveal/countdown, grace/poison/offline, opt-in audio and unobstructed phone controls.

Limitations: camping/chase pacing and mobile readability require human testing, especially at 8 players and on small phones. Names can overlap in tight clusters. The existing room-wide OOB reset policy is preserved. Eight concurrently rendered headless pages averaged ~30 FPS on the shared runner; this is not a physical-device FPS result. Native Safari/iOS/Android and actual audio quality await user testing; unsupported fullscreen remains optional. No elaborate animation, music, camera shake, extra modes or finished extra arenas were added. The Phaser bundle remains ~446 kB gzip; no dependencies or external assets were added.

Deploy only on the existing Free Render service; no resource or plan changes. The ready revision is recoverable from `checkpoint/milestone-6-acceptance`. Exact deploy/health/public verification is recorded after deployment. Milestone 6 is ready for personal testing, not approved.
