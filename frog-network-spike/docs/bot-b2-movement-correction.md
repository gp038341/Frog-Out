# B2 movement regression correction — playtest candidate

Approved B1: `cab49c298b8f8ec33a55d330707040a26f8131b6`, preserved by `checkpoint/approved-bot-b1-navigation`.
Rejected B2 candidate: `d8c05ec2339329f6e0c5dae4ebbc2b067c36cbe9`, also preserved by `checkpoint/pre-b2-movement-correction`.
This correction is not approved until the owner playtests it. No Bot C, difficulty settings, human-physics tuning or modifier adaptation.

## Actual causes

1. **Fixed tactical destinations disabled B1's exploration lifecycle.** B2's first `setDestination` enabled the navigator's fixed-goal mode. Unlike B1 roaming, reaching that goal brakes; recovery and destination timeouts no longer pick another platform automatically.
2. **The escape utility rewarded staying cheaply safe, not active traversal.** Threat-distance reward capped at 16 m while travel cost was strongly penalized. Bots preferred nearby floor points and could converge on the same safe region. There was no meaningful occupancy/visited-destination penalty. A stationary distant tagger reproduced 28.4% stationary time and zero platform transitions.
3. **Goal updates and progress accounting did not agree.** B2 directly overwrote goals without updating goal-distance progress history. Across the measured runs goals changed ~113 times/minute, ~49 while airborne/acting. Progress toward different destinations was compared as if it were one route. A goal coming inside the 0.85 m arrival radius could enter the arrival/braking branch before the charge/tongue logic. This was not a nerf to acceleration or a too-slow physics tick.
4. **Protected-target waiting was a destination beside an ineligible target.** Reaching it could lead to braking rather than continued useful positioning.

Aggregate stationary percentage alone did not capture the whole regression: old B2 was sometimes walking on the floor rather than standing, but traversed less distance and used about half the grapple attachments/platform transitions of B1.

## Correction

- Runners proactively select varied, reachable platform waypoints, accounting for threat routes, usable vertical escapes, crowding, recent visits, corners and failed routes. They advance to another waypoint before reaching the braking radius. Distant threats do not mean stop moving.
- Independent seeded choice among similarly useful routes avoids a shared predictable circuit. Useful upper routes receive sufficient value to employ charge jumps, grapples and swings rather than always choosing a cheap lower-floor point.
- Pursuit, interception, Freeze rescue selection, role changes and protections remain. Hunters keep traversing during protected-target windows or failed-target cooldowns.
- **B1's existing action executor is unchanged.** The navigator has one additive `continueTo` handoff: it changes a tactical waypoint and resets goal-distance accounting without changing mode, launch/hold deadlines, shot time, attachment time, rope, active link, velocity or input mechanics. The spatial progress timer is retained, so moving targets cannot indefinitely mask a blocked frog.
- Tactical goal handoffs are deferred during active traversal unless the frog is approaching its waypoint, a role changes, danger is urgent or recovery is needed. This keeps useful charge/fire/reel/swing/release sequences intact.
- All other production source is protected by `bot-b2r-preservation.json`; no gameplay speeds, jump powers, range, geometry, game rules, controls, arena/modifier tuning, presentation or networking changes.

## Comparable measurements

180 real-physics runs: 60 each for the exact approved B1 controller, rejected B2 controller, and correction. Each uses the same initial poses, roles, arenas, seeds and scripted-human inputs. Four arenas × three modes × 2/8 frogs × two seeds, plus human-tagger, human-runner, mixed and distant-tagger scenarios. Each run observes up to 30 seconds or the ordinary round ending. Rates are normalized per active CPU time and then averaged equally across runs. Frozen, trapped and nonplaying time is excluded. Fixture source provenance is tested.

| Measure | Approved B1 | Rejected B2 | Correction |
|---|---:|---:|---:|
| Distance, m/frog-minute | 388.65 | 317.98 | 395.77 |
| Normal + charged jumps/min | 11.67 | 9.94 | 11.38 |
| Charged jumps/min | 9.99 | 7.67 | 9.97 |
| Tongue attempts/min | 17.63 | 8.71 | 14.94 |
| Successful attachments/min | 17.25 | 8.31 | 14.35 |
| Grounded platform transitions/min | 5.92 | 3.01 | 6.23 |
| Nearly stationary active time | 16.59% | 15.76% | 14.68% |
| Neutral inputs | 4.27% | 4.80% | 5.97% |
| Oscillating-window time | 1.68% | 3.27% | 1.77% |
| Time inside goal braking radius | 0.273% | 3.128% | 0.077% |
| Goal changes/min | 2.10 | 113.29 | 42.47 |
| Goal changes while acting/airborne/min | 1.27 | 49.34 | 17.74 |

Stationary means speed below 0.6 m/s (includes legitimate charge anticipation). Neutral means no movement/aim/action held; it can mean useful airborne coasting/release, so it is not treated as synonymous with idle. Oscillation means a two-second active window with over 2 m path length but under 0.6 m net displacement. Grounded transitions count support-surface changes, not mere fly-throughs. All 25 fixed-course destination times exactly match B1. Raw per-run contacts, completion times, arrival/late-arrival diagnostics and outcomes are retained in `results/bot-b2-movement-correction.json`.

In the especially revealing **distant idle tagger** case (same result in all three modes):

| Measure | B1 | Rejected B2 | Correction |
|---|---:|---:|---:|
| Nearly stationary | 17.69% | 28.41% | 10.67% |
| Distance/min | 434.71 | 191.28 | 437.04 |
| Platform transitions/min | 7.33 | 0 | 8.67 |

This restores B1-level distance, charged jumps and platform movement. Attachment frequency is substantially recovered but remains below B1's purely exploratory behavior; tactical routes do not need identical action counts. These metrics support a candidate, not a claim that the human feel test is passed.

## Tests and reproduction

```sh
npm test
npm run build
node --import tsx scripts/bot-movement-bench.ts
node --import tsx scripts/bot-b2r-tactics-bench.ts
node --import tsx scripts/bot-b2r-network.ts
```

The movement report is machine-readable (compact JSON); this document is its human-readable summary. Focused tests protect multiple movement metrics together, distant-threat activity, fixture fidelity, action-state handoffs and spatial stuck detection under continuously moving goals. Existing B1 traversal, tactical role/contact/rescue/protection tests and all historical source-preservation checks remain.

Timing note: the first real-time stress attempt ran concurrently with CPU-heavy offline comparisons and failed its strict local p99 threshold. The final production-entrypoint network performance check is run separately, with the same threshold unchanged. Offline comparison timings are not claimed as Render capacity measurements.

Final validation: **293 tests pass**, production build passes, and all 13 compiled-server lifecycle/multiplayer checks pass. All 25 fixed traversal-course runs retain exactly the B1 completion time. A separate 72-round tactical run finished 71 within 60 seconds; the remaining Poison round finished at 61.03 seconds. It observed 119 rescues and 200 Classic transfers; full two-frog matches reached standings in all modes. All 20 modifier smoke checks passed.

Compiled seven-CPU/one-human room p99 was at most **6.65 ms** (16.67 ms budget). Three isolated local Sunny Pond steps exceeded budget, with a worst 54.7 ms; other arenas had no overruns. This is a remaining timing observation, not a claim of zero spikes or a Render capacity certification. No network rates or simulation rules were changed to mask it.

## Limitations and owner playtest

No new physical Android/iPhone testing is claimed; approved input and viewport code are unchanged. Difficult upper routes and compound Chaos navigation can still be imperfect. No full Chaos-specific AI or new difficulty levels. Heuristic routes may miss, overshoot or make imperfect tactical choices.

1. Turn Chaos off initially. Start with one human and three CPUs on each arena; remain still as tagger briefly. Runners should traverse platforms and use charge/grapples rather than gather on the floor.
2. Chase them. Watch continuous motion, vertical escape and completed grapple/swing/release sequences. Compare with the B1 feel you approved, not only survival duration.
3. Run two- and eight-frog games. Let a CPU hunt you and watch CPU-versus-CPU play. Hunters should use traversal when a target is above/across a gap.
4. Freeze: verify rescue attempts still happen, frozen frogs stay still and rescued frogs resume movement. Classic: check clean IT transfers and grace. Poison: check body-only conversion/grace and scoring.
5. Check voting/KEEP, rematches, reconnect and ordinary desktop/two-thumb mobile play. Then enable Chaos for safety checks only.
6. Report sustained local loops or sluggishness with arena, mode, CPU name and approximate moment. B2 remains unapproved until the owner accepts the feel.
