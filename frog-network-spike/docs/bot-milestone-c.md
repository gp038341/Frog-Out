# Bot Milestone C — Chaos Modifier Intelligence

Status: implementation candidate for owner playtesting, **not approved**. No Bot D or difficulty changes.

## Approved rollback baseline

The owner approved B2 at `bbf283ffe5bbc364fcd6cde7468b8352ce0f7d55`, verified against the live Render service before implementation. Checkpoint: `checkpoint/approved-bot-b2-game-mode-intelligence`. B1 remains at `checkpoint/approved-bot-b1-navigation` (`cab49c298b8f8ec33a55d330707040a26f8131b6`).

The candidate is committed after this baseline, with a separate `checkpoint/bot-c-chaos-intelligence-playtest` branch. The exact candidate commit is the commit containing this document; the deployment handoff records its SHA. Existing Render service: **https://frog-out.onrender.com/**. No service, plan, source, environment or hosting configuration changes.

## Implementation boundary

This extends the B1 navigator and B2 tactical layer. The CPU receives the authoritative active modifier IDs in its existing input call. A shared, weakly held read-only perception cache samples public platform/ball/wind state at 10 Hz. Inputs still execute at the physics tick. Tactical cadence, independent personalities and ordinary press/release semantics are retained.

CPU code never writes frog transforms, velocities, contacts, tagging, scores, gravity or fixtures. All `src/` and `public/` files are SHA-protected by `bot-c-preservation.json`, including all modifier implementations, arenas, human input, iPhone viewport/multitouch, client rendering, sounds and physics tuning. The room's only change passes its already-existing active list to CPUs. Historical preservation checks retain their original baselines through an explicit new adapter; old manifests are unchanged.

## Coverage of all 20 modifiers

| Modifier | AI adaptation |
|---|---|
| Moon Frogs | Uses effective gravity and actual free-flight drag in conservative jump-rise estimates; anticipates drifting landings and brakes earlier in free flight. Grapple motion remains exempt from that drag just as in the simulation. |
| Mega Tongues | Searches actual extended-range raycasts; flight timeout derives from actual range/speed. Longer reaches remain subject to terrain obstruction. |
| Butterfeet | Plans active reverse steering using actual reduced acceleration instead of confusing neutral coast friction with braking authority. Retains momentum, anticipates landing drift. |
| Quick Licks | Uses actual tongue speed for shot timeout and a proportionately shorter, bounded retry interval. Miss-direction cooldowns still prevent spam. |
| Turbo Toads | Route feasibility, approach speed and stopping distance use effective acceleration/speed; no AI speed boost. |
| Tiny Trouble | Surface margins, stand points, route clearances and grapple distances use the actual reduced collision radius. Activation invalidates stale routes. |
| Mega Frogs | Same actual-radius treatment for larger bodies, with revalidation on modifier changes; no collision exceptions. |
| Super Suckers | Reads actual pull acceleration and adjusts useful hold/release windows so stronger pulls do not remain committed for baseline-length holds. Simulation retains the poison advantage. |
| Magnet Mouths | Candidate frog shots call the same bounded assisted-direction function as real firing, including range, lead and line-of-sight rules. Gives useful frog attachments more consideration. |
| Windy Weather | Reads the visible gust forecast/state; anticipates air drift and attempts a legitimate jump when a grounded upwind approach is being overwhelmed. |
| Bouncy Bombardment | Uses short bounded predictions of visible balls for landing-route risk, lateral avoidance and ordinary jump attempts. Does not perfectly avoid balls. |
| Crumble Time | Costs cracking platforms by visible time remaining, avoids inactive geometry, attempts a timely jump, and releases an anchor before imminent collapse. Regenerated geometry returns through the normal graph. |
| Tilt-a-Frog | Refreshes landings from current transformed polygons and orientations, and invalidates vanished support edges. Actual tongue hit/local anchors and material effects remain simulation-owned. |
| Bumper Frogs | Treats an actual collision impulse as a disrupted maneuver and replans from carried momentum. Does not avoid legitimate body tagging or override contact order. |
| Balloon Bellies | Uses observed inflated gravity scale for flight/release estimates; recognizes the actual pop launch and drops stale grounded charging plans. Core collision radius stays unchanged. |
| Swap Hop | Recognizes the first and subsequent actual swaps, releases stale navigation commitments, replans from the new position and retains existing bidirectional protection filtering. Never reads private future pair selections. |
| Bubble Trouble | Preserves the approved five fresh presses with releases, prioritizes the authoritative trapped state, and resumes tactics after an explicit release frame. |
| Gravity Flip | Rebuilds gravity-relative support/route decisions, reevaluates tactical destinations, and uses ceiling-relative jumping/support and observed gravity direction. |
| Pogo Panic | Recognizes actual landing launches immediately, cancels stale grounded charges and continues airborne steering/grappling toward the tactical goal. |
| Sticky Frogs | Reads the actual support normal/tangent/contact body, crawls with the same eight-direction inputs, deliberately approaches corners, charges/releases jumps away from walls/ceilings, and recovers from unproductive adhesion. Ordinary floor traversal remains B1-based. |

The perception cache sees only public observations, not modifier RNG seeds, future hidden swap pairs, another CPU's goal or a tactical team coordinator. Navigation remains approximate, reactive and imperfect.

## Combined conditions and expiration

Effective tuning and each frog's actual gravity scale are used together. Platform transforms/materials, wind, body size, active grip and real launch events combine rather than selecting a single modifier-specific controller. Sticky attachment takes priority only while the real simulation reports support; bubble escape takes priority while actually trapped; frozen/countdown/results/paused states retain neutral input.

Changing the active set invalidates AI-only route/failed-shot/adhesion commitments. Real forces and cleanup remain in existing modifier code. KEEP is still the ordinary legal expiring card, renewed as newest by unchanged voting code. All existing incompatibilities and maximum-three conveyor rules remain unchanged.

AI-only prototype heuristics: public-state cache 6 ticks; ball lookahead 0.15–0.18s; free-flight steering lookahead 0.18s (0.25 inflated, 0.30 Moon); cracking-support escape threshold 24 ticks and urgent charge release at 12; imminent grapple-anchor release threshold 18 ticks; Sticky progress recovery 150 ticks, ordinary tap 3 ticks or bounded charged hold. These are decision thresholds, not physical tuning changes.

## CPU voting

Each CPU retains one normal validated vote with the same staggered vote window. Stable preferences weight legal card families, modest tongue combinations, current game mode and individual novelty/KEEP preference. Bounded stochastic choice still permits entertaining unexpected votes. No global vote plan, extra weight, timer change, UI edit or eligibility bypass. CPU voting does not inspect human votes to form a bloc.

## Validation and reproduction

- `npm test`: includes `tests/bot-chaos-intelligence.test.ts` with per-modifier real-physics activity/roles, effective combinations, actual aim-assist occlusion, real Sticky wall climb/jump, event recovery, cracking state, five-edge bubble escapes, independent votes/KEEP and source preservation.
- `npm run build`: unchanged production toolchain.
- `node --import tsx scripts/bot-c-validation.ts`: all 20 singles, six pairs and nine triples × four arenas × three modes = 420 deterministic real-physics scenarios, alternating two/eight participants, up to 20s each; outputs `docs/results/bot-c-validation.json`. Short rounds may end earlier; unfinished rounds at the observation limit are not counted as failed matches.
- `node --import tsx scripts/bot-c-comparison.ts`: 168 runs, approved B2 fixtures versus C, four arenas, eight CPUs, 15s; all 20 singles plus modifier-off baseline. Modifier-off trajectories/activity/action statistics must match exactly. Outputs `docs/results/bot-c-comparison.json`.
- `node --import tsx scripts/bot-c-network.ts`: compiled production server, independent Colyseus clients; admission/CPU replacement, human priority, cosmetics, mixed play, mode results, rematches, pause/reconnect/cleanup, CPU voting/KEEP; mixed eight-frog Chaos combinations, all arenas/modes and ordinary human input acknowledgment; local tick-budget stress. Test-only timers/hooks are enabled only in that local process. Outputs `docs/results/bot-c-network.json`.

Results are local automated evidence, not new physical iPhone/Android testing or a production hosting-capacity guarantee. The accepted iPhone/client sources remain exact. Existing Vite large-chunk advisory and Render Free cold-start exposure remain.

## Known limitations / acceptance focus

- This is not a full trajectory solver or perfect hazard avoidance. Fast rotated edges, interacting grapples, tight large-body routes and powerful three-modifier disruptions can still produce misses and recoveries.
- Sticky navigation combines local surface-relative crawling with the existing platform route graph; it does not precompute an exhaustive route graph around every face/corner. Hard routes can require a jump/grapple/replan.
- More distance or input activity is not automatically better tactics. Compare fun, pursuit, evasion, rescues and recoveries in actual play; difficulty/personality tuning is reserved for D.
- Broad samples stop at 20s/round. Bubbles still occupied at sample/round end are recorded separately from observed releases; focused tests require five real presses. Not every possible legal triple has been exhaustively tested.

Manual playtest: add several CPUs, choose each mode and arena, let normal round 1 run, then vote through movement, grapple and platform modifiers. Particularly try Moon+Turbo+Tiny, Butterfeet+Wind, long+strong tongues, Tilt+Sticky, Crumble+Pogo, Gravity+Sticky and Bubble+balls. Watch opening activity, wall/ceiling escape, pursuit after a flip/swap, departure from cracking platforms, five-tap bubble escape, KEEP renewal and expiration. Refresh/reconnect and rematch; compare Chaos OFF to approved B2. Stop for owner approval before D.

## Recorded candidate validation results

- Full suite: **340/340 passed**; production TypeScript/Vite/server build passed. Existing Vite bundle-size advisory remains.
- 420 real-physics scenarios completed their observation windows without AI exceptions or nonfinite bodies. Mean eligible active-input fraction **93.87%**, mean travel **400.17 metres per frog-minute**. 160 rounds naturally ended within the 20s cap; others were still playing. 137 bubble captures and 128 observed releases; remaining captures were still occupied or their round/sample ended. Focused combined-modifier tests require all eight CPUs to escape with exactly five fresh presses.
- Approved B2 comparison, 80 Chaos samples/version: travel **388.99 → 388.69 m/frog-minute**, stationary fraction **11.81% → 11.84%**, jumps **13.55 → 13.99**, charged jumps **12.90 → 13.25**, successful attachments **32.98 → 35.91** per eight-frog/15s sample. These aggregate metrics preserve overall activity; individual modifier results vary. Modifier-OFF behavior is exactly equal in all four controlled arena comparisons.
- Independent-client integration: **14 checks passed**, including eight mixed-human/CPU Chaos triples and all mode/lifecycle/reconnect/KEEP flows. Eight-frog baseline stress p99 **1.05–2.26ms**, mixed Chaos p99 **1.67–3.95ms**, zero reported overruns in these local network sessions. Isolated broad simulation p99 **0.51ms**, with a **27.10ms maximum** during concurrent test processes; this maximum includes local scheduling/GC noise and is not omitted or presented as an on-Render guarantee.

Source evidence: `docs/results/bot-c-validation.json`, `bot-c-comparison.json`, `bot-c-network.json`. Exact scripts and seeds are versioned. No new physical-device tests were performed.
