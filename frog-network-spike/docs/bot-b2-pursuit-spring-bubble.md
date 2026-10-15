# Bot B2 focused pursuit, spring recovery and bubble escape candidate

Status: deployed playtest candidate, NOT B2 approval. No Bot C or general modifier-aware navigation.

Baseline: `4916ca9e48436afcd9425ca7c2f8c9f8aa3c1727`, preserved at `checkpoint/pre-b2-pursuit-spring-bubble`.
Approved B1 remains `cab49c298b8f8ec33a55d330707040a26f8131b6`, `checkpoint/approved-bot-b1-navigation`.
Candidate checkpoint: `checkpoint/bot-b2-pursuit-spring-bubble-playtest`.
Public service: https://frog-out.onrender.com/ (same Free service; no configuration changes).

## Findings and corrections

### Pursuit
B2 protected active maneuvers so broadly that a moving target could leave the committed interception waypoint behind. A normal navigation recovery also excluded its target for 240 ticks, even though a failed route does not make the frog ineligible. Fixed-destination arrival braking could stop pursuit near a target rather than treating it as body-contact pursuit.

The final correction retains B1's route, charge, tongue, reel, swing, release and stopping logic. A target waypoint displacement above four metres can prompt handoff during an ongoing maneuver; the handoff preserves execution state. Failed routes penalize target selection rather than excluding otherwise eligible frogs. Pursuit bypasses the stationary destination-arrival brake, while retaining ordinary steering/braking. Contact protection, presence, poison/frozen eligibility and body-contact rules are unchanged. No human/CPU-kind preference is read by tactics.

More aggressive continuously refreshed steering variants were rejected during development because they worsened interception or interrupted useful route commitments. The final change is narrower. Pursuit remains imperfect; these tests do not establish that every arena/seed improves.

### Spring loops
A goal on the same spring kept the arrival/charge path centered. Whole-body spatial movement and closest approach to a goal could both be satisfied by vertical oscillation; changed tactical goals could also reset goal-progress accounting. Bouncing itself was not tracked as a repeated landing episode.

Navigation now observes authoritative surface-bounce ticks and the actual nearest spring surface. Three repeat landings on that same body, within six seconds per landing, with less than 1.8m horizontal displacement and no 0.7m goal-distance improvement trigger a temporary lateral escape waypoint outside its edge (3m margin, at most three seconds). It uses the ordinary B1 steering and legal grapple execution; no impulse or position writes. A spring launch also ends a stale charge maneuver. Successful route progress can continue to use springs normally. Springs and all shared physics/material tuning are byte-identical.

### Bubbles
`CPUController.input` explicitly grouped `trapped` with frozen/countdown states and returned neutral input forever. It could never produce any fresh escape press.

A trapped CPU now suspends navigation and emits an initial six-tick release, then four ticks pressed/eight ticks released. Five fresh presses reach the existing authoritative Bubble Trouble handler in 55 simulation steps (about 0.92s). Required press count, press consumption, bubble duration and human behavior are unchanged. After release it emits a neutral action edge and resumes role-aware navigation. Bubble identity, early expiration, freezes, pause/countdown and round reset clear the escape state.

## Reproducible evidence

- `node --import tsx scripts/bot-b2s-bench.ts`: before/current controllers in real Planck physics, 24 scenarios per version, all four arenas/three modes/two and eight frogs; spring and bubble reproductions.
- `docs/results/bot-b2s-fixed-opponents.json`: original runner controllers held fixed while changing only the pursuing CPU. Mean initial body contact 10.89s → 9.28s across eight arena/count cases. Toyshop two-frog 26.48s → 11.95s; some cases unchanged, Sunny Pond eight-frog slower. No claim of universal improvement.
- All-CPU comparison: movement 381.5 → 386.9m/frog-minute (initial hunter measurement); mean initial contact 9.47 → 9.53s. Different runner paths and real interactions matter. This is activity preservation, not evidence of universal faster catches.
- Deliberate same-pad loop: Sunny Pond leaves after 2.80s (previous 12.13s); Bathhouse after 2.93s and Toyshop after 2.87s (both previous versions remained within the pad-edge margin for the full 20s). The old Bathhouse/Toyshop reproduction bounced 22 times. Later visits are permitted.
- Eight trapped CPUs: exactly five presses each, four intervening release edges, escape by 0.92s; zero trapped jump/tongue actions. Previous CPUs: zero presses, no escape in the four-second observation.
- `scripts/bot-b2s-matches.ts`: real round/match lifecycle across modes, arenas, counts and seeds, with real body contacts; modifier safety smoke only.
- `scripts/bot-b2s-network.ts`: compiled-server independent clients, lobby, votes/KEEP, pause/reconnect, host and eight-frog performance.
- Preservation manifest checks current changed source hashes and byte-identical shared gameplay/mobile sources. Historical evidence uses exact prior source snapshots, not rewritten old manifests.

## Limitations and playtest

No new physical-device test is claimed. This does not implement general Chaos-aware AI. Difficult vertical routes, misses, overshoots and imperfect interceptions remain possible. Offline machine timing is not a Render capacity guarantee.

1. Create a room, turn Chaos off, add three CPUs. Test all modes, choosing CPU tagger/freezer rounds. Run/jump across levels and see whether they stay on the chase.
2. Try all four arenas, especially Toyshop diagonal routes and Canopy upper platforms. Watch charge/grapple sequences remain fluid.
3. In Sunny Pond, watch CPUs land repeatedly on lily pads; they should travel off instead of bouncing vertically indefinitely. Repeat with sponges/cushions.
4. Vote Bubble Trouble: watch several captured CPUs tap/shake free, then resume chasing/escaping. Human escape must still require five fresh presses.
5. Try one human/seven CPUs and mixed humans/CPUs, votes/KEEP, refresh/reconnect and rematch. Report arena, mode, modifiers and a short video for persistent stalls.

## Release validation

Final production candidate: 300 tests passed, production build passed (existing large Phaser bundle warning). All 72 real-physics rounds completed within 60s; 129 legitimate Freeze rescues and 206 Classic transfers. Full two-frog matches reached final standings in all three modes. All 20 modifier smoke cases stayed finite; no modifier-specific AI added. Offline eight-frog worst p99 step was 5.04ms against a 16.67ms step budget. Independent-client network results are recorded separately. This is local performance, not a hosting capacity guarantee.

Independent-client validation: all 13 checks passed. Final isolated eight-frog p99 values: Sunny Pond 6.56ms, Bathhouse 4.67ms, Canopy 2.47ms, Toyshop 3.37ms. Three local tick overruns were recorded (max 41.18ms); not zero-spike performance. An earlier stress attempt failed the unchanged p99 <8ms assertion; it was repeated in isolation with timing logged before the assertion. No thresholds or physics were relaxed.
