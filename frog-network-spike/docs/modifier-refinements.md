# Wind, Pogo and bubble refinement candidate

Approved baseline: `bd5eb27a2779763fda1ef6d7e04786ddb01f7078`, preserved at `checkpoint/approved-mobile-floating-controls`. Both approved floating controls and all earlier checkpoints remain unchanged.

## Exact tuning

- Wind air acceleration 18→10; grounded acceleration 64→24. During an active gust, ordinary grounded running against wind targets 25% of the usual running speed, using the existing acceleration controller. With the gust force and ordinary friction, full counter-wind input measures approximately 1.035 world units/second against the wind (normal running is 6). This applies only to the existing ordinary grounded run branch, not grapples, coupled frog pulls or airborne steering. Same 8-second cycle, 1-second warning, 3-second gust, alternating direction and wind contribution cap16. No global movement constants change.
- Pogo launch speed 14.25→15.25: approximately 14.5% more ideal ballistic height. Immediate contact timing, tangential momentum, bounded delta24, 12-tick cooldown, four-tick separation, rotating normals and special-material priority unchanged.
- Bubble spawn interval 60→48 ticks (1→0.8 seconds, 25% more spawn opportunities). Cap4, free-shell life8 seconds, trapped duration6 seconds, five distinct escape presses, rise/steering and recapture protection unchanged.

Wind now draws 28 lightweight animated streaks across the arena behind frog/status artwork, plus a warning/active direction and countdown label in the game scene. These visuals consume authoritative wind state and do not participate in DOM/canvas sizing. Existing wind sound remains unchanged.

## Measurements and validation

Full suite: 395/395 passing. Production build passes with the existing large-bundle warning. Normal counter-wind running, from rest and from an existing full-speed run, is tested in both directions. A same-seed 2.5-second test previously displaced the frog 0.315 units *with* the wind despite counter-input; the candidate progresses 2.579 units *against* it, settling at 1.035 units/second.

Sunny Pond Pogo apex changes from center y17.262 to y16.703 (smaller y is higher); the first rock top requires center y16.95. Normal steering now lands on that rock. No teleport, custom launch or arena adjustment is used. Bubble cadence/cap, authoritative snapshot determinism, existing press escape and all unrelated-source preservation checks pass.

The real-client Bot C network suite passed all modes/arenas, mixed rooms, CPU voting/KEEP, reconnect/pause/rematch and eight-frog cases. Local stress p99 was 1.41–3.49 ms across four arenas; no overruns in that run. This is local performance evidence, not a Render capacity or physical-device claim. CPU logic and approved mobile input/viewport code are byte-identical.

## Playtest

Refresh the public build. During Wind, run fully against a gust from rest and while already moving; compare ordinary ground and air/grapple routes, and check the streaks/countdown distinguish warning, gust and calm. Use Pogo in Sunny Pond to land on the lower rocks and traverse toward higher routes; confirm timing remains immediate. With Bubble Trouble, check the slightly denser arrivals, four-shell limit, and unchanged five-tap escape. Check three-effect combinations for readability. Stop for owner approval; no further changes are authorized automatically.
