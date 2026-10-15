# Bot B2: independent tactics and active openings — playtest candidate

Baseline: `11b3d797a595f3b84011afd1e3f05f35714fb23e`.
Pre-change checkpoint: `checkpoint/pre-b2-independent-openings`.
Candidate checkpoint: `checkpoint/bot-b2-independent-openings-playtest`.
Approved B1 remains `cab49c298b8f8ec33a55d330707040a26f8131b6` / `checkpoint/approved-bot-b1-navigation`.
Public service: https://frog-out.onrender.com/ . B2 remains NOT approved until the owner's playtest. No Bot C or difficulty modes.

## Diagnosis

- Participants already had separate controllers, seeds and destinations. Production CPU seeds come from `randomInt`; they were not identical. Navigation geometry is a shared read-only cache, not shared goals.
- Each bot used almost the same narrow caution/aggression preferences, route costs and deterministic proximity ranking. In a controlled five-tagger/three-runner opening, all taggers selected the same nearest runner in 20/20 seeded cases.
- Any participant's infection/protection/presence change altered one global signature, forcing every bot to reconsider and clearing every hunter's target commitment. This reinforced synchronized reactions and removed useful individual commitments even when a frog's own role did not change.
- Random decisions also consumed the same per-CPU RNG stream as navigation and votes. Streams were independent between CPUs but coupled between those subsystems inside each CPU.
- There was no universal initial decision delay: the baseline issued its first non-neutral input on the first active simulation tick. However 2.5% of frogs had not made meaningful physical movement at 0.5s/1s in the standard opening sample. Arrival/launch preparation and route selection, rather than a missing start timer, explained that measured inactivity.
- Escape safety judged the ultimate perch, not the first landing/approach. A Bathhouse runner could choose a safe high faucet but initially route through a short central grapple and prepare it near its pursuer. The final candidate evaluates first-leg safety during the opening.

## Changes

Only production file changed: `server/strategy/tactics.ts`.

1. Dedicated, independently mixed tactical RNG and stable frozen preference records. Resetting a round does not change personality. No color/name/CPU order is read. Preferences affect route cost, vertical/risk appetite, destination lane/side, pursuit tie bias, prediction horizon, rescue willingness, commitment and scheduling.
2. Initial goal remains immediate on the first playing tick; no inputs during countdown/frozen/trapped restrictions. Later decisions align to independent per-CPU cadence/phase. Public role/eligibility changes still trigger immediate evaluation; only an actual own-role change clears the role commitment and failed-target history.
3. Target costs include visible competing hunters' positions, velocity toward the runner, relative travel distance, existing commitment and stable preference. No access to peer goals/controllers, opponent inputs or future role order. Multiple hunters may legitimately choose the same target, especially when it is the only eligible target.
4. Escape destinations use varied safe landing lanes, bounded stable utility differences, visible crowding and traversal preferences. Platform-to-platform utility is 5 (formerly 3.5), maintaining active traversal instead of profile-driven floor camping. Failed routes/visits remain penalized.
5. First 150 active ticks (2.5s): include useful local escape routes and check the first B1 route leg, not just the final goal. Penalize a launch toward a nearby threat or a first landing substantially less safe than the endpoint. Per-destination route checks are cached within that decision. No graph rebuild per frame.

### Preference ranges (one balanced default difficulty)

- Vertical preference: 0.45–1.65; grapple route preference: 0.70–1.35.
- Risk and rescue preference: 0.80–1.20; intercept preference: 0.70–1.30.
- Lateral preference: -1 to +1; stable target utility tie bias: ±1 cost unit.
- Target commitment: 48–96 ticks (0.8–1.6s), with existing urgent/ineligible-target exceptions.
- Regular decision cadence: 10–16 ticks; independent phase. Initial decision has no phase delay.
- Existing B1 plan/input execution cadence, action semantics, spring recovery and bubble escape remain byte-identical.

## Measurements and methodology

`bot-b2i-bench.ts`: real Planck openings, all 4 arenas × 3 modes × 2/8 frogs × 2 seeds = 48 scenarios per version, first 3 active seconds. Before fixture is the actual baseline controller/tactics with imports adapted, using the unchanged navigator. Fixed seeds are reproducible. No AI-only pose/velocity changes. Meaningful movement is >0.3m horizontal displacement, upward velocity < -3m/s, or an attached tongue; passive gravity settling is not counted. Startup input and physical movement are measured separately. Null first-motion times are censored at 3s in the aggregate. No round-inactive samples are included.

| Metric | Before | Candidate |
|---|---:|---:|
| Mean first meaningful physical movement | 0.265s | 0.249s |
| Mean first non-neutral input | 0.0167s | 0.0192s |
| No meaningful motion by 0.5s | 2.5% | 1.25% |
| No meaningful motion by 1s | 2.5% | 1.25% |
| No meaningful motion by 2s | 0% | 0% |
| Mean distance/frog during opening | 17.01m | 16.68m |
| Standard-opening runner survival at 3s | 100% | 100% |
| Jumps/room during opening | 2.44 | 2.50 |
| Charged jumps/room during opening | 2.44 | 2.50 |
| Tongue attempts/room during opening | 4.31 | 4.38 |
| Near-identical runner waypoints (<0.25m), eight frogs | 10.7% of pairs | 6.5% |
| Coarse runner destination grouping (2m cells) | 11.3% of pairs | 14.3% |
| Same target, controlled multi-hunter sample | 100% of pairs | 64.5% |
| Distinct initial decision deadlines among eight CPUs | 4.0 average | 6.15 average |

The controlled hunter test uses five poisoned frogs and three safe frogs, 20 seeds. It tests legitimate target decisions, not a forced team assignment. Mean distinct chosen targets grows 1.0 → 1.85. The one-eligible-runner control still converges on that runner. This is not a guarantee of uniformly divided pursuit in real matches.

`bot-b2i-crowded.ts`: fixture-only crowded positions, all 4 arenas × 3 modes × 2 seeds, seven CPU runners against a scripted human pursuer using ordinary controls. Safe-at-3s: 81.55% → 82.74%; mean observed survival 2.811 → 2.839s (capped at 3s). This is a modest improvement, not a claim of dramatic survival gains. Production spawn locations are unchanged.

Controlled moving-human pursuit: flat first contact unchanged at 3.42s; raised route first contact slower (4.37 → 5.23s), but time within 2m rises 19.2 → 24.88s with fewer recoveries (10 → 5) and a successful grapple/swing. Individual route tradeoffs remain; no universal interception improvement is claimed.

Broad movement and match results are in the corresponding `docs/results/bot-b2i-*.json` files. Record performance as local measurements, not a Render-capacity guarantee. No physical mobile/iPhone testing is claimed.

## Preservation and validation

- B1 execution, prior spring recovery, bubble five-press behavior, CPU lifecycle/voting, shared physics, rules, networking and mobile/iPhone sources are protected byte-for-byte. Historical preservation checks read exact pre-refinement snapshots; old manifests are not rewritten.
- A historical test requiring every CPU to pick slot 1 was updated to allow either nearby eligible target, since varied legitimate target preference is this task's explicit requirement. Eligibility/contact assertions remain; movement activity thresholds were retained unchanged.
- Full suite: 307 tests pass; production build passes (existing Phaser bundle warning).
- 72 real-physics rounds across modes/arenas/counts/seeds complete; 117 Freeze rescues and 198 Classic transfers. Full two-frog matches reach standings in all modes. All 20 modifier smoke cases stay finite; no modifier-specific AI added.
- Independent-client network suite: 13 checks covering manual CPU controls, capacity/replacement/reservations, solo/mixed games, votes/KEEP, host transfer, pause/reconnect, cleanup, results and rematch.
- Eight-frog compiled-server stress on all arenas: p99 1.07–2.13ms, max 5.78ms, zero overruns in that local run. Previous candidate's stress had occasional spikes; faster local numbers do not prove a hosting upgrade or guaranteed capacity.

## Remaining limitations / manual acceptance

Coarse destination grouping did not improve; nearby routes can still converge when safety or geometry makes a corridor attractive. Personality is subtle, not a set of rigid classes. Interceptions remain imperfect and some are slower. Sample sizes/seeds are bounded; the owner must judge independence and movement feel. No general Chaos-aware planning, difficulty settings or new gameplay.

1. Start eight-frog rooms, Chaos off, on every map. Observe the first five seconds in each mode: no pre-countdown movement, prompt goals, varied useful routes, minimal spawn hesitation.
2. In Poison Tag, let several CPUs become poisoned while at least two runners remain. Watch targets/approach angles and whether existing charge/grapple maneuvers stay fluid. Converging on the last runner is expected.
3. Test Freeze rescues, Classic IT transfers, one human/several CPUs and multiple humans/CPUs. Check that threat reactions remain responsive and bots do not oscillate targets.
4. Revisit lily-pad/sponges/cushions and Bubble Trouble; five-press escapes and lateral spring recovery must remain intact.
5. Test votes/KEEP, refresh/reconnect and rematch. Report mode, arena, modifier list and a short clip for repeated synchronized or passive behavior.

### Broad movement comparison

120 real-physics scenarios (60 per version), all arenas/modes, two/eight frogs and scripted human/mixed/distant-threat cases, 30s observation cap or actual round completion. Per-active-time rates are averaged equally by scenario, excluding freezes/traps/inactive phases. Previous candidate → new candidate: distance 396.47 → 402.96m/frog-minute; stationary 14.37% → 15.06%; charged jumps 9.75 → 8.95/min; tongue attempts 14.85 → 15.24/min; attachments 14.03 → 14.78/min; platform transitions 6.62 → 6.21/min; oscillation-window time 1.50% → 1.39%. Activity is broadly maintained, not uniformly improved. All 25 fixed B1 traversal course times remain exact. The original distant-threat activity guard still passes unchanged.
