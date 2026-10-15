# Bot B2 — competitive game-mode intelligence playtest candidate

The owner rejected the initial movement feel. See [the B2 movement correction](bot-b2-movement-correction.md) for diagnosis, comparative evidence and the revised candidate. B2 is not approved.

## Approval and scope

The owner approved Bot B1 at `cab49c298b8f8ec33a55d330707040a26f8131b6`.
Preserved branch: `checkpoint/approved-bot-b1-navigation`.
B2 is a playtest candidate, identified by `checkpoint/bot-milestone-b2-playtest`, not an approved milestone.
Canonical existing Free Render service: https://frog-out.onrender.com/.

B1 navigation source is byte-for-byte unchanged. No physics, controls, game rules, scoring, arenas, cosmetics, presentation, networking rates or Chaos tuning changed. No Bot C or difficulty settings.

## Strategy layered over B1

`server/strategy/state.ts` creates a restricted public-state DTO: mode, current role/status, presence, protections, round and time remaining. It excludes human/CPU identity, future starting-role order, opponent inputs and random outcomes. The room caches this view once per simulation tick, and only when a CPU requests input. Human-only rooms follow their existing input path.

`server/strategy/tactics.ts` independently evaluates each CPU at roughly 5 Hz. It reads current body positions/velocities and the shared B1 geometry graph. Estimated travel times include vertical routes, charge/grapple setup costs and reachability. Prediction is bounded; this is not a search of future inputs or a shared team planner.

The only output is a destination supplied to the approved navigator. Updating a destination does not reset a held charge, jump, shot, swing or release plan. All movement still passes through normal x/y/held inputs and authoritative physics.

### Poison Tag

- Poisonous CPUs pursue safe frogs, predict a short interception point and retain a target unless another is substantially better or the current target becomes invalid.
- Transforming CPUs can position for the chase; the existing one-second rule still controls when contact transmits poison.
- Safe CPUs evaluate reachable escape points, separation from poisonous frogs, travel cost, routes crossing a threat, corners and alternative platforms. Short local floor escapes avoid waiting for a cross-arena route to react.
- Actual body contact remains the only way to poison. A tongue never calls the rules engine.

### Freeze Tag

- Freezers pursue eligible unfrozen frogs and avoid protected/frozen targets.
- Runners evade; a reachable frozen teammate can become a rescue goal when the freezer has sufficient separation. Immediate nearby danger cancels the attempt.
- Rescue requires real movement and body contact under the existing rules. A rescued CPU returns to evasion immediately. Frozen CPUs issue neutral input through the existing restriction path.

### Classic Tag

- IT pursues eligible runners. Other CPUs evade the current IT.
- Role transfers invalidate commitments immediately. During the existing transfer-protection window the tagger positions nearby rather than selecting an ineligible target.
- Scoring, contact validation, protection duration and round clock are unchanged.

## AI-only tuning

| Parameter | Value |
|---|---:|
| Regular evaluation | 12–15 ticks (200–250 ms) |
| Major visible role/status change | next CPU input tick |
| Target commitment | 60 ticks (1 second) |
| Substantially better target during commitment | less than 65% of current estimated cost |
| Normal re-selection hysteresis | less than 80% of current cost |
| Immediate threat distance | 3.1 m × caution |
| Rescue target clearance from freezer | 4.2 m × caution, plus travel-time check |
| Motion prediction | nominal 0.28 s; near contact uses current position; bounded personality variation up to ~0.35 s |
| Caution / aggression | independently seeded 0.85–1.15 |
| Occasional second-best target | 7%, only when costs are similar |
| Failed target / destination cooldown | 240 ticks (4 seconds) |
| Escape-goal maximum commitment | 480 ticks (8 seconds), interrupted by danger/status/recovery |

Failed B1 recoveries temporarily suppress that target/destination and encourage repositioning, rather than repeatedly pursuing the identical failed point. These are strategy parameters, not movement boosts.

## Validation

Commands from `frog-network-spike`:

```sh
npm ci
npm test
npm run build
node --import tsx scripts/bot-b2-bench.ts
node --import tsx scripts/bot-b2-network.ts
```

- **287 tests pass**, including 11 B2 tests: chase/evade roles, real contact poison, AI frog-grapple without transmission, legitimate movement-driven rescue, frozen restrictions, danger-aborted rescue, Classic protection/role changes, target hysteresis, no body mutations, action-plan preservation, reset/suspension, all-modifier safety and source preservation.
- **Production build passes.** Existing Phaser bundle-size warning remains; client assets are unchanged.
- **72 real-physics rounds**, all three modes, all four arenas, 2/4/8 independent CPU controllers and two seeds. No forced contacts, tag calls or AI physics shortcuts. 70 finished within the 60-second observation cap. The two Poison exceptions finished in extended runs at 65.5 s (4-frog Toyshop) and 113.27 s (2-frog Canopy). Freeze/Classic timeouts are normal rule outcomes, not necessarily tagger wins.
- Observed **177 legitimate rescues** and **270 Classic transfers** across those runs. Poison median observed round duration: **11.1 s**.
- Real two-frog complete matches in all three modes reached final standings, rotated both starting roles and awarded ordinary scores.
- All 20 modifiers, eight controllers: four-second tactical smoke cases, plus automated two-second tests in all three modes. This checks finite/legal operation, not full modifier-aware competence.
- Re-run of unmodified B1 traversal: **25/25** small-course successes and **72/80** full-arena destinations, identical to B1's outcome counts. Reports preserve the original B1 evidence separately.
- Local instrumented eight-controller room-step worst p99: **1.95 ms** against 16.67 ms budget. Worst per-CPU tactical-call p99 across runs: **0.189 ms**. These are local Node/tsx measurements including measurement overhead, not a Render-capacity guarantee.
- Human-only departure/reconnect regression: **16 checks passed**, covering all modes, host transfer, gray offline reservations, scoring/results and stable eight-player slots.
- Independent real WebSocket clients exercise the compiled production entrypoint: manual CPUs, oldest-CPU replacement/concurrent human admissions, protected reservations, all modes, scoring/results/role rotation, CPU votes/KEEP, rematches, mixed humans, host transfer, last-human pause/reconnect/cleanup and seven-CPU+one-human room performance on all four arenas. Worst compiled-server p99: **1.34 ms**, with zero tick overruns in those sessions.

Machine-readable evidence: `results/bot-b2-tactics.json`, `results/bot-b2-network.json`, `results/bot-b2-navigation-regression.json`, `results/bot-b2-human-regression.json`.

## Limitations and manual acceptance

- This is independent heuristic strategy, not perfect pursuit planning. Long chases, conservative rescue refusals, missed interceptions and occasional inefficient routes are intentional/possible. No fairness claim is based on simulated win rates against real people.
- Existing difficult upper B1 routes remain difficult. Full Chaos-specific navigation (Sticky, rotating/crumbling surfaces, gravity changes, bubbles and compound modifiers) remains Bot C. Temporary protections are respected, but unusual combinations may reduce tactical effectiveness.
- Baseline physics/network/input/viewport/art/audio hashes and B1 navigation hashes are preserved. No new physical iPhone or Android test is claimed.

Playtest with Chaos off first:

1. One human + one CPU in each mode: take turns as chaser and runner. Does the CPU notice you, chase meaningfully and use approved B1 movement?
2. One human + three/seven CPUs: watch CPU-versus-CPU play. Targets should follow opportunities, not human identity. Check tags/poison occur only on body contact.
3. Freeze: keep distance from a frozen CPU and watch a CPU teammate attempt a rescue. Approach the rescue route as freezer and check that runners react; frozen frogs must remain still.
4. Classic: verify immediate role reaction and the normal grace window. Poison: verify conversion/grace and additional hunters.
5. Try every arena, especially upper Bubblewash/Toyshop. Report sustained loops with arena, mode, CPU name and approximate time.
6. Finish rounds, vote/KEEP, rematch and reconnect. Check pause if the last human disconnects, retained frog identity and human-only host ownership.
7. Then enable Chaos for safety checks. Check normal desktop and physical two-thumb mobile play; those systems should feel unchanged.

Stop after deployment and await B2 approval. Do not begin Bot C.

## Focused pursuit/spring/bubble playtest candidate

See [the focused B2 correction report](bot-b2-pursuit-spring-bubble.md). B2 remains pending personal approval.

## Independent tactics and opening refinement

See [independent tactics/opening candidate](bot-b2-independent-openings.md). This is a focused B2 playtest candidate; B2 approval and Bot C remain pending.
