# Chaos Voting E — Extreme physics playtest candidate

Approved D: `233456c81a7b5bef8529c73617014326119d6ec4`, checkpoint `checkpoint/approved-chaos-voting-d`. GitHub main, local index/working content and Render were verified before editing. The local historical HEAD is not pushed wholesale; changes are appended through the existing GitHub tree/commit/ref workflow with an expected-parent check. No force push or history replacement.

## Implemented

Gravity Flip and Pogo Panic were approved at e8237382843cc80737882e3fd67a3c37f2f0b5a3. Sticky Frogs now replaces the abandoned extra-flap concept as modifier20; see `sticky-frogs.md`. Round1 normal, 15s votes, maximum3 active, oldest expiry and guaranteed eligible KEEP renewal are unchanged. Poison Tag, Freeze Tag and Classic Tag rules/scoring, four arenas, Sunny Pond default, cosmetics, audio palette, static camera, input and iPhone viewport remain unchanged.

### Gravity Flip
`EXTREME_CHAOS` in `src/chaos/extreme-chaos.ts`: `downTicks=480` (8s), `upTicks=240` (4s), `warningTicks=60` (1s). Repeat continuously while playing. Gravity magnitude stays26. Only frog gravity scales reverse; rubber balls and other bodies retain ordinary gravity. A persistent screen-space arrow/countdown turns amber and pulses at the warning; original countdown/start sounds are reused, one local mix rather than eight concurrent cues.

Ceiling-facing contacts support running, tap jumps, charged jumps, coyote time and a ceiling-facing landing buffer. Horizontal movement and aim remain screen based. Jump vertical velocity mirrors gravity direction with unchanged normal9.5/charged18 values. On reversal clear only support/charge/buffer caches, retaining input ownership, velocity, tongue and reciprocal pulling. No camera or character geometry changes. Special material effects stay on authored top faces, not newly activated undersides. Upper out-of-bounds recovery uses the existing safe reset philosophy. Expiry restores ordinary gravity/support; reset starts the next round normally.

### Pogo Panic
`pogoSpeed=14.25`, `pogoMaxDelta=24` m/s added normal velocity bound, `pogoCooldownTicks=12` (.2s), `pogoSeparationTicks=4` (~.067s). Ordinary solid support contact immediately launches along its outward normal. Moving/tilted platform point velocity is included; tangential momentum is retained. A single continuous contact cannot retrigger: contact must genuinely separate for four simulation steps. Cooldown adds a second jitter guard, not a delayed landing response. Normal controller launches in the tick have precedence. Tongues are not detached by Pogo.

Only ordinary surfaces participate. Lily pads/rubber cushions/sponges keep the approved impact bounce. Mud/paint and soap retain their localized behavior and provide surfaces where deliberate ground charging remains possible. Frog bodies, balls, sensors and invisible ball-only boundaries are not pogo surfaces. Ordinary-floor charging is naturally difficult because automatic launch wins that landing; this is the approved design tradeoff, not a movement retune. Frozen or bubble-contained frogs do not receive Pogo impulses. Feedback is a short foot burst and existing rubbery jump cue.

## Architecture / exclusions
One isolated snapshot-able `ExtremeChaos` module runs before/after the unchanged core step. Small guarded world adapters invert support/raycast/jump direction only when Gravity is active. Effective baseline tuning is never mutated. Snapshot metadata includes clock, direction, contact/rearm state and authoritative paused state so prediction cannot auto-bounce during countdown. Reconnection restores the same schedule. Server mode/contact pipeline and network transport/predictor code are untouched.

Gravity exclusions from the approved matrix remain: Moon, Balloon, Swap, Tilt, Pogo, Bubble (the abandoned extra-flap concept is not implemented). Gravity+Bubble was explicitly tested as a rejected pair, not enabled. Ballots and payload validation reject both directions. Moon+Gravity remains excluded even when order is reversed. Replacing an expiring incompatible effect is allowed when it will no longer coexist. Crumble/Tilt and Tiny/Mega exclusions remain. Pogo+Butterfeet/Turbo/Tilt/Bombardment and Gravity+Mega Tongues/Super Suckers/Wind are tested. No compatibility matrix is silently broadened.

## Validation
- Full suite:221 passing tests and production build.
- E focused coverage: gravity timing/expiry, all-arena ceiling tap/full charge/buffering, grapples across signs, frozen safety, pogo normals/tangent/bounds/separation, special-surface priority, contact rules/rescue in all modes, ballot filtering/KEEP, paused prediction, snapshot/restoration/recovery, 2/8 frogs and all maps/stacks.
-22 compiled-server lifecycle/network scenarios:2–8 clients per mode, round1, votes/ties/non-voters, selected arenas, active E synchronization/expiry, reconnect, disconnect timeout, cumulative round flow and rematch/Chaos-off reset. See `results/chaos-e-network.json`.
- Eight independent clients with actual8/4s timing: warning, first and second inversion, ceiling charge and downward release, grapples across reversal, same identity/schedule on reconnect, Pogo stack sync and cleanup. See `results/chaos-e-timed-network.json`. Server p95≤.91ms, p99≤4.30ms, max10.24ms in that local run against16.67ms.
-44 eight-frog simulation microbenchmarks: all four maps, baseline and E combinations,2400ticks each. Max p95 .76ms/p99 3.73ms while other tests ran concurrently. This is local measurement, not a claim about Render CPU or physical mobile performance.
- Exact reverse adapters/hash checks preserve approved D plus all older approved baselines. Input, viewport, main, network predictor, D/C modules, material system, arenas, mode rules, audio and constants are byte protected.

Physical iPhone/Android playtesting of E has not occurred. Their accepted input/layout implementation is unchanged; browser/device acceptance of these new physics/presentation effects remains pending. Free Render cold starts remain. No paid resources or new dependencies/assets.

## Multiplayer acceptance playtest
1. Create a room with Chaos ON; verify normal Round1 and all modes/arena choices unchanged.
2. Vote Gravity: check one-second warning is obvious muted/unmuted,8s down/4s up repeats, ceilings/undersides support running and tap/full charge jumps, aim remains intuitive, grapple holds/releases naturally through switches. Check recovery/next-round/expiry.
3. Vote Pogo: gentle landings immediately hop, lateral velocity carries, rotating supports launch along their face, contacts do not jitter/retrigger, spring/mud/soap retain behavior and charges on special surfaces work. Try tongue holds and Butterfeet/Turbo/Tilt/Balls stacks.
4. Repeat with2 and6–8 players, Poison/Freeze/Classic; ensure tags/freezes/rescues/scores remain fair and frozen frogs stay frozen.
5. Refresh during either effect; confirm own identity, clock/direction/active effects remain synchronized. Return/rematch and check Round1 normal; verify KEEP renewal and denied pairs.
6. On phones verify warning banner/labels do not obscure touch controls or charge cues and simultaneous two-thumb input remains reliable. Report any corrections, ceiling-stuck states or overly disruptive hops.

Stop after deployment; Sticky acceptance requires user playtesting; Gravity Flip/Pogo are now approved.

## Playtest refinement
Pogo launch speed increases from9.5 to14.25 (1.5×), yielding approximately2.25× ordinary ballistic height under the same gravity. Contact timing, separation, cooldown, tangent momentum and bounds remain unchanged. Gravity-reversed frog artwork and attached cosmetics flip vertically around their body centers; names and HUD stay upright, horizontal facing/aim stays intuitive, collision geometry stays unchanged. Input, viewport, camera and other mechanics are untouched. Physical-device acceptance remains for the user.
