# Chaos Voting B — movement, size and grappling candidate

Approved A checkpoint: `checkpoint/approved-chaos-voting-a`, revision `5b9f3403bff1b49946a8dfa23f48da98d9e87429`. It matched the live `frog-out` Render service before development. This candidate awaits owner playtest; it is not approved B.

## Tuning

All values derive anew from the approved baseline in `src/chaos/registry.ts`; no accumulated multiplication or persistent tuning drift.

| Modifier | Baseline → active |
|---|---|
| Turbo Toads | Ground speed 6 → 6.9; acceleration 60 → 72. Brake, jump, air acceleration and reeling unchanged. With Butterfeet, acceleration is 28.8 and braking 1.25. |
| Tiny Trouble | Render and actual circle radius .45 → .3375 (×.75); mass stays 1 by density adjustment. Body-relative landing probe slop .04 → .03; frog grapple clearance .20 → .15; minimum terrain rope .65 → .4875. |
| Mega Frogs | Render/circle radius .45 → .5625 (×1.25); mass 1. Landing probe slop .05; frog clearance .25; terrain minimum rope .8125. Mutually exclusive with Tiny. |
| Super Suckers | Pull acceleration 48 → 57.6; slack take-up 4 → 4.4; maximum radial closing speed stays 8. Fully poisonous role multiplier stays 1.1, giving 63.36 acceleration. Equal/opposite impulses retained. |
| Magnet Mouths | Maximum correction 6° once at firing, within existing range. Rank by angular error, distance, stable slot. Exclude frozen frogs and blocked terrain lines; preserve an aimed terrain hit ahead of the target. No homing. |

Size changes happen between rounds, with existing round reset/safe floor spawns. Fixtures are replaced on the existing bodies only when radius changes. Velocities and identity survive replacement; constant density adjustment preserves mass. State snapshots carry authoritative radius and clients restore matching fixtures before reconciliation. Body contact rules consume the actual touching fixtures, with no radius shortcut. Names remain screen-readable; cosmetics and ice shells scale with the frog, while Classic status rings remain legible. Arena geometry is unchanged.

Invalid/duplicate/conflicting modifier payloads are sanitized in stable catalog order. Voting uses the same server lifecycle. At capacity the owner-confirmed renewal behavior is retained: oldest gets an eligible RENEW card, choosing it moves it to newest; otherwise it expires. Kept modifiers are excluded and Tiny/Mega conflict filtering evaluates what remains next round. Round 1 and disabled Chaos remain baseline.

Presentation is restrained: distinct colored/icon cards; Turbo dust strokes, Super tension ticks, a brief Magnet target sparkle. Existing audio palette is unchanged. No touch, viewport, orientation, input, arena, sound or mode-rule source changes.

## Tests

- Full suite: 152 tests passed, including all 144 prior regressions and eight B groups.
- Configuration: all 729 ordered triples; activation/expiry; invalid payloads; exact baseline restoration.
- Fixtures/state: radius, mass, body identity, momentum, frozen restoration, snapshot round-trip and actual-size contact in all three modes.
- Arenas: four selectable arenas, 2- and 8-frog deterministic action trajectories, safe spawns and out-of-bounds recovery; prior 2–8 arena tests remain passing.
- Grapples: reciprocal safe/poison role forces, unchanged radial cap, release momentum; cone/range/occlusion/frozen targeting, deterministic selection and committed trajectory.
- Conveyor: every arena/mode across 30 ballot cycles; three choices, renewal, incompatibilities, no duplicates, reset.
- Compiled WebSocket integration: 21 rooms (2–8 clients × three modes), all nine modifiers observed; host/lock/default, round 1, full matches, ties/abstentions, voting reconnect identity, size snapshots, final/rematch reset and Chaos-disabled behavior; one reservation-timeout scenario. See `results/chaos-b-network.json`.
- Local eight-frog stress: all arenas × four representative stacks, 1,680 measured ticks/run. Worst run p95 0.131 ms, p99 0.284 ms versus 16.67 ms budget. This measures local simulation, not Render CPU. See `results/chaos-b-stress.json`.
- Production build passes. Existing Phaser bundle-size warning remains; no additional dependency/assets.
- Protected-source hashes prove accepted desktop/touch/iPhone viewport, arenas, surfaces, mode rules and audio are unchanged. Automated tests are not a new physical iPhone/Android validation.

## Flappy Frogs: recommendation only

Prefer an explicit **F** press on desktop and a distinct **Flap** touch button visible only when that future modifier is active and the flap is available. Keep Space/the existing action button exclusively jump/charge/tongue; do not overload an airborne double tap. A double tap would either fire an unwanted tongue on its first press or delay normal tongue response while waiting for a second, with added iPhone timing ambiguity.

The future control prototype should be separate from the live input implementation and compare reachability/accessibility at small landscape sizes. Test simultaneous movement, held grapple, fresh flap, rapid taps, cancellations, orientation interruptions, reconnect and physical iPhone Safari. Only after approval add one flap per landing (+3.5 vertical velocity, upward limit 18, provisional approved catalog values). Nothing from Flappy is implemented or offered on ballots in B.

## Owner playtest

1. Try each new card across several matches; use larger rooms to reach three active modifiers and a fourth vote. Round 1 should feel unchanged.
2. Turbo: faster grounded chase, normal stopping; then combine with Butterfeet and check steering/overshoot.
3. Tiny/Mega: platform edges, ceilings, spring pads, soap/mud, charged jumps, close body tags/freezes/rescues, both-direction frog grapples. Check cosmetic/status readability on phones. They must never coexist.
4. Super: terrain swing/release, reciprocal two-frog pulls, poison pursuit, short ropes and two simultaneous tongues. Look for speed spikes or sticking.
5. Magnet: near-miss frog aim versus deliberate platform aiming, blocked targets, moving targets. Tongue should stay committed after firing.
6. Renew the oldest card, then replace it on a later vote. Expired size/pull/speed must restore exactly. Reconnect, complete the match and rematch with Chaos off.

Known limitations: provisional B balance; physical mobile readability/feel needs acceptance. No new physical-device testing is claimed. Render Free sleep/cold-start risk remains. No Flappy or later modifier families.
