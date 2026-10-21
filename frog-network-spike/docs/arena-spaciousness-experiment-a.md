# Arena Spaciousness Experiment A — physical playtest candidate

Approved baseline: `e9e9138e23294aaf1b54773bd0208b87c415fea1`.
Preserved checkpoint: `checkpoint/pre-arena-spaciousness-experiment-a`.
Previous approval checkpoint remains `checkpoint/approved-results-pacing-and-final-reveal`.
Public service remains https://frog-out.onrender.com/ . No changes to hosting configuration or the old service.

## Distributed starts

Previously, every match/round used floor-only starts: two frogs at x=12 and x=20, or 2..38 spread across the floor for larger rosters. The shared simulation reset, recovery, and reconnection placement APIs remain unchanged. The room now applies a server-only initial/next-round placement adapter after reset, before publishing the first state.

Validated authored seat pools combine eight evenly spaced floor positions with these ordinary elevated seats:

| Arena | Elevated seats |
| --- | --- |
| Sunny Pond | Both mud rocks, central branch, both upper branches, upper rock, both new middle branches |
| Bubblewash Bathhouse | Lower dish, soap dish, bucket ledge, both ordinary faucet ledges |
| Canopy Courtyard | Both lower platforms, both middle platforms, central beam, both upper side platforms |
| Croakwork Toyshop | Wooden block, ruler, both spools, roof, upper paint block |

Spring surfaces are deliberately not initial seats: their approved automatic bounce must not launch frogs during countdown. Tilt-a-Frog rounds use the eight permanent ground seats because weighted floating perches can rotate during countdown. They remain evenly spread and independently assigned. Other supported modifiers retain elevated seats where actual geometry clearance permits them.

For each round: hash a per-room seed, choose an initial seat, greedily maximize distance from already chosen seats, then independently shuffle player-to-seat assignment. Selection never reads roles, cosmetics, or human/CPU identity. If a full assignment happens to repeat, rotate the assignment one seat. Real Planck raycasts and shape-overlap tests validate current terrain and effective frog radius. Spawns leave a small 0.04m settling gap. No active-match teleport, velocity advantage, input change, or gameplay tuning is introduced.

Across 24 deterministic seeds per arena/count, two-player minimum separation rose from 8m to at least 20.7m in the sampled normal starts. Sunny Pond eight-player minimum rose from 5.14m to 6.38m; mean 6.48m. This is Euclidean separation, not a promise of equal route travel time. Two-player samples produced 14–17 distinct assignments per arena; controlled variation does not guarantee every individual seat changes every round.

## Sunny Pond geometry

Only two ordinary branches were appended; all original solid definitions and indices are unchanged. No platform was moved, resized, removed, or given a new material. The other three arenas are byte-for-byte unchanged within the shared arena definition.

| Addition | Center (m) | Bounding size (m) | Purpose |
| --- | --- | --- | --- |
| Left middle branch | (3.8, 12.8) | 4 × 0.7 | Rock-to-upper-branch stepping route and off-center grapple option |
| Right middle branch | (36.2, 12.2) | 4 × 0.7 | Offset interception/escape route between lower rock and upper branch |

Both use existing convex branch silhouettes, ordinary material, and existing Sunny Pond rendering. Shared lobby previews automatically reflect the exact geometry. The central swing space remains open. Existing world bounds, static camera, frog size, jumps, grapples, spring/mud/soap behavior and Chaos tuning are unchanged.

Comparison: [before/after layout](results/spaciousness-a-comparison.svg).

## Navigation and measured comparison

No bot intelligence or navigation source changed. The existing graph automatically reads both new fixtures. Thirty real-physics trials (five seeds × two sides × inbound/outbound/ground approach) all reached their target using ordinary controller inputs. Arrival uses the existing 0.85m goal radius; it does not prove every arrival is a retained landing.

144 matched simulations compare baseline geometry/floor starts with experimental geometry/distributed starts: all four arenas, all three modes, 2/4/8 frogs, two seeds, maximum 20 seconds. Mean visited 5m map cells rose from 24.89 to 29.22 (about 17%). Active-input fraction was 93.3% vs 87.6%; 23 vs 15 rounds ended within the sample horizon. Wider openings can lengthen chases and cause different charge/route decisions. These are exploratory CPU samples, not human balance proof, and increased coverage partly reflects wider initial placement. Full records include jumps, charges, grapples, per-case timing and starting positions.

Two historical AI benchmarks depend on the exact approved pre-experiment Pond course. Their original thresholds are retained and run against that fixed course through a test-only fixture; separate tests and the above comparisons exercise the new geometry. This avoids changing AI or relaxing old controller regression thresholds to suit a new map.

## Verification and limits

- Full automated suite and production build; source-byte checks preserve all unrelated runtime files.
- Spawn clearance, body separation, stable five-second countdown settlement, deterministic seeds, variation, and repeat avoidance for 2–8 frogs on every arena.
- Gravity Flip, Crumble, Tilt, Pogo, Wind, Bubble, Sticky, size interactions, and restored client snapshots.
- All 20 modifiers plus five representative triples across all four arenas: 100 eight-frog simulations with actual mode rules, valid inputs and no AI errors.
- 36 compiled-server match starts and next-round transitions: every arena × mode × 2/4/8 frogs, alternating human-only and mixed configurations; ordinary body-contact/scoring rules and consistent client snapshots.
- Real browser desktop/iPhone-sized landscape checks with two humans and six CPUs on every map; before/after vector comparison and local screenshots.
- Existing multiplayer/reconnect/KEEP/stress suite rerun. Dedicated eight-frog stress p99 was at most 3.45ms across all four arenas, with no overruns. One mixed-Chaos Canopy sample recorded a single 37.3ms tick (p99 9.15ms); retained in the report rather than claimed resolved. These are local measurements, not Render capacity guarantees.

Physical iPhone/Android playtesting has not been performed for this candidate. Approved input/viewport source remains untouched. Check feel and fairness at two players as well as eight: longer opening chases, upper-perch camping, crowding, new branch routes and spring-loop recovery. Render Free cold starts and real hosted concurrency remain pre-existing limitations, not resolved by these local checks.

## Reversal

Use a normal revert of the experiment commit if rejected. The pre-experiment checkpoint preserves the full approved build and history. The runtime difference consists of the two appended Pond branches plus a server-only round-placement helper and its two room hooks; there are no persistent gameplay settings or data migrations. Do not reset or force-push.
