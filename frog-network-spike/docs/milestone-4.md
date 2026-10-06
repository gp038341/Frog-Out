# Milestone 4 — Outbreak core acceptance build

## Approved checkpoints

Milestone 1 `363a6073b2ba116cd5673d2ce13d3817622f7927` remains an ancestor. Approved Milestone 2/2.1 is `c4c607be1607a8fd50e2da4eed42b8d69117b350` on `checkpoint/milestone-2-approved`. Approved Milestone 3 is `db9a7f53df0a5baf77bdf12224fee49355212681` on `checkpoint/milestone-3-approved`, recorded in `docs/approved-milestone-3.json` before Outbreak changes.

Simulation config/world/roster, network protocol/predictor, authoritative physics room and approved lobby/reconnect room are unchanged. Byte checks enforce critical approved sources. Client changes gate existing inputs/prediction outside active play and present rules; no tuning or networking constants changed.

## Exact rules

A cryptographically shuffled permutation of the frozen 2–8-player roster selects Patient Zero once per player. Each round resets bodies/actions and infection records, retaining cumulative points. One second of Patient Zero announcement precedes a three-second countdown. Controls lock while neutral physics settles spawn bodies. At GO Patient Zero is immediately infectious, all others healthy, and the simulation-tick timer begins.

After each unchanged 60 Hz physics step, the server collects touching, enabled, nonsensor frog-body contacts. Tongue raycasts and rope joints never count. Every contact uses the infectious set from before the batch, preventing callback-order chains. Newly infected frogs become infectious after 60 ticks (one second). Continuing contact is reevaluated each tick, so poison spreads when grace expires without needing another collision callback.

Points equal the number already infected in earlier ticks. Patient Zero scores zero. Same-tick infections share points and infection placement. Example with four players: Patient Zero 0; two simultaneous infections 1 each; last player 3. Infection-order placements including Patient Zero are 1, 2, 2, 4. Sorting tied rows by roster slot is display ordering only.

A round ends immediately when all frozen roster members are infected, including transforming/offline players. Timer stops, actions clear and bodies freeze on results. The final infection batch shares round victory if multiple players are infected together. Results show infection placement, round points and cumulative totals.

The host selects Next Round; after the final round Final Standings shows cumulative scores. Equal totals share placement with subsequent ranks skipped; tied highest totals share victory. No tiebreak. Return to Lobby / Rematch retains the room/code, resets readiness and unlocks admission. A fresh all-ready host start resets totals and randomizes Patient Zero order. No gameplay time limit.

The inherited 30-second reconnect reservation applies throughout the match. Offline bodies remain physical and infectable during play. Reconnect restores identity, slot, body, infection and totals. Expiry or explicit Leave interrupts the whole match and returns connected players to the lobby; no replacement/adjusted scoring.

## Architecture and visual communication

`src/game/outbreak.ts` is a pure authoritative rules reducer/view. `server/outbreak-room.ts` subclasses approved PartyRoom, delegates active physics unchanged, collects contacts and publishes rules at the existing 30 Hz snapshot rate. Client phase views lock controls, reset prediction at round boundaries and show status/results. No rollback or authority redesign. Infection is never predicted; delivery can delay its display.

Labels supplement color: HEALTHY; GRACE with ring; POISON with X; Patient Zero with PZ label and double ring. Debug exports include rules state without reconnect credentials.

## Validation

- Production build/type check and all 43 unit/regression tests passed: immutable baselines, real contact filtering, tongue noninfection, grace, deterministic ties, scoring and final ties.
- Independent WebSocket clients completed 2-, 3-, 4- and 8-player full matches, each player serving once. Real continuing-contact grace, same-tick infections, attached tongue without infection, offline infection and restored score/identity passed. These tests use positioning hooks and shortened 6/12-tick intros; grace remains production 60 ticks.
- Three isolated browser contexts completed a three-round match with production 60/180/60 timing, tied results, final totals and a two-player rematch/shared victory. Fresh rematch explicitly required full countdown. No browser errors.
- All 16 lifecycle checks passed, including actual 30-second reservation expiry (30,020 ms), names, readiness, full/late joins, stale action clearing and lobby recovery.
- Physics/network scenarios passed at 50/100/150 ms added RTT with ±10 ms/leg jitter. Browsers verified charged launch, terrain grapple/release, refresh identity and diagnostics export at these delays; no large snaps or browser errors.
- Eight-client compiled production-server stress ran for 60 seconds, completed three rounds and 2,629 active gameplay ticks. Tick p50/p95/p99: 0.169/0.568/2.012 ms versus a 16.67 ms budget; max 32.237 ms. Two overruns and a 149 ms maximum snapshot gap mean the strict zero-overrun gate FAILED. Earlier development-entrypoint runs also recorded rare stalls (retained as first/second-run reports). Cause is not conclusively isolated; ordinary tick cost is low, but these outliers remain a watch item for eight-player playtesting. The approved scheduler/physics were not altered to hide them. This is local evidence, not a production-host capacity claim.

Reports in `docs/results/`: `outbreak.json`, `outbreak-browser.json`, `lifecycle-milestone-4.json`, `browser-milestone-4.json`, `latency.json`, `stress-milestone-4.json`. Screenshots `outbreak-grace.png` and `outbreak-final.png` show functional UI.

## Public deployment sanity

Revision `3a862125cd51050e411af0340e993819af032114` deployed live on existing Free Render service. `/health` returned milestone 4. Two independent secure-WebSocket clients completed a full two-round match with ordinary movement/body contact, restored the same player during an in-round reconnect, finished 1–1 with shared victory and returned to lobby. Public tick p99 0.482 ms, max 2.633 ms, zero overruns in this short check. Browser UI confirmed code join, Ready/host Start, timer and Patient Zero/healthy labels; screenshot `public-outbreak-20261006.jpg`. No Render error logs were reported during the check.

An additional attempted public eight-client stress run could not establish all clients: the execution-proxy connection encountered a seat-reservation expiry. It was stopped before a capacity measurement; no public eight-player performance result is claimed. Local eight-client full-match tests passed, but local strict zero-overrun stress failed as described above. Reports: `public-milestone-4.json` and `public-eight-client-milestone-4.json`. These automated checks do not approve Milestone 4.

## Known limits

Keyboard gameplay; touch remains a later MVP task. Names/state labels can overlap when frogs converge. Art, sound and arena remain placeholders. Existing out-of-bounds debug recovery remains unchanged. Free Render sleeps/cold-starts; in-memory rooms are lost on restart/deploy. Test-only hooks are disabled in production. Rare eight-client stress stalls remain unresolved; the strict zero-overrun performance check did not pass. No paid resources introduced. Milestone 4 awaits the user's personal playtest.

## Acceptance checklist

1. Create/join with 2–4 separate devices, up to eight if available. All Ready, host Start; confirm familiar lobby and roster lock.
2. Check Patient Zero announcement, three-second countdown, locked controls before GO and count-up timer after GO.
3. Grapple a healthy frog with Patient Zero without body contact: no infection. Touch bodies: infection/points and GRACE immediately, POISON after about one second. Try spreading poison during grace.
4. Chase the last survivor; round continues until everyone infected. Check stopped timer, winners, points and totals. Try simultaneous body contacts for ties.
5. Advance every round; each player must be Patient Zero exactly once. Check cumulative totals and shared final ties. A two-player full match necessarily ends 1–1.
6. Return to lobby, ready and rematch: fresh totals, full countdown, retained room code.
7. Refresh during play: same identity/body/infection/score. Disconnect a healthy player, tag the offline body, reconnect. Separately stay offline more than 30 seconds after server detection: everyone returns to lobby with explanation.
8. Compare normal/charged jumps, horizontal air pace, swings/releases, reciprocal pulling and collisions with approved feel.
9. Download diagnostics from both clients after issues; send files with room, round/roles/actions/time, device/browser/network and optionally recording. Start at natural latency; optionally repeat with `?lag=100&jitter=10`.
