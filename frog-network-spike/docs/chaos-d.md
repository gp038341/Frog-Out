# Chaos Voting D — frog-to-frog chaos playtest candidate

Approved C: `b31caa9c1916d1647123934da8321de76bbb0469`, checkpoint `checkpoint/approved-chaos-voting-c`. GitHub and existing Free Render `frog-out` were verified on that revision before editing. New candidate checkpoint: `checkpoint/chaos-voting-d-playtest-candidate` (resolve this branch for the deployed D SHA). Public target: https://frog-out.onrender.com/. Old service/config/plan unchanged.

## Four effects and provisional tuning

| Effect | Tuning / rules |
|---|---|
| Bumper Frogs | Frog/frog contact restitution .45. Approaching contacts get one extra mass-aware normal separation impulse per contact episode, target4–8 units/s, ≤6 added velocity per frog/tick across multiple impacts. Separating/resting contacts are not amplified. Tangential momentum retained. Frozen bodies stay immovable. |
| Balloon Bellies | .75 s warning,3 s inflated every10 s. Visible shell scale1.20, real radius/mass unchanged and core ring shown. Gravity×.65, contact restitution.20, maximum with Bumper. .2 s inflation/deflation transitions. Frozen bodies excluded. |
| Swap Hop | Every12 s,1.5 s paired warning. Deterministic seeded shuffle of connected active movable non-contained frogs; rotate odd sit-outs. Skip unsafe pairs. Exchange positions, retain each frog's own velocity up to24 units/s. Release outgoing and incoming tongues, charge and buffers. 21 ticks/.35 s incoming/outgoing harmful-contact protection; no immunity from terrain, balls, bubbles or physics. Freeze rescues remain enabled. |
| Bubble Trouble | At most2 non-solid bubble shells, radius.65, one entry/8 s, life8 s. Capture one dynamic frog, rise2.5 units/s, trap at most2 s. Half air steering. Fresh action press releases and is consumed (no jump/tongue). One-second bubble-only recapture cooldown, top-bound safety release, freeze/reset/expiry cleanup. Normal frog collider remains taggable. |

All values are centralized in `src/chaos/frog-chaos.ts`. No player-facing physics menu. D additions are applied from baseline and snapshot state, not cumulative tuning mutation.

## Architecture and fairness

`FrogChaos` owns the deterministic schedules, pair contacts, bubble objects, contact-protection deadlines and cosmetic effect markers. Existing physics snapshots carry its state for prediction/reconnect; no new transport or rollback system. Server mode rules resolve recorded touching body contacts before extra bumper impulses, preventing a ricochet from erasing a legitimate tag/freeze/rescue. Existing rules/scoring classes are unchanged. The simulation can apply bumper response directly for client prediction; the authoritative room defers it until after rules resolve. Rule protection filters harmful contacts only; physical collisions and Freeze rescues remain.

Balloon per-body gravity avoids changing global gravity or core geometry. Bubbles have no extra solid collider: rubber balls can still collide with the trapped frog's unchanged core, without tagging it. This reduces solver load and retains honest collision silhouettes. Capture never grants tag immunity. Hold already active at capture is not an escape; release and press again.

## Compatibility decisions

No new exclusions among implemented modifiers and no compatibility-matrix cells silently changed. Tiny/Mega remain incompatible; Crumble/Tilt remain incompatible. D pairs marked conditional in the design are tested across all arenas. Gravity Flip/Pogo/Flappy remain unimplemented and unavailable. Preserve original D starting values except the stale gravity floor: Moon was approved at.25, so Moon+Balloon remains.25 rather than raising it to the obsolete.60 or lowering it to.1625. Standalone Balloon uses.65. Bumper/Balloon restitution uses maximum, not addition.

All approved C rotation, exact anchors/torque, rotated material effects, supported charging, eight energetic persistent balls, airborne-only Crumble and strong ground/air wind are byte-preserved. KEEP renewal, ordinary Round1, three-effect conveyor, all modes, arenas, cosmetics, static camera, sounds and iPhone input/viewport remain protected by a source-preservation manifest. Only isolated D hooks are added to simulation/state/rules adapter/rendering and registry.

## Feedback/assets

Original procedural graphics: bumper star ticks, inflated rounded frog/body sheen and solid core, paired swap rings/name hints, teleport rings/short contact-phase marks, translucent bubble shells and pop rings. Compact escape hint on the local frog; remote frogs show BUBBLED. Unique four ballot-card palettes/icons. Existing approved impact/build/attach/miss audio cues are reused under existing voice/cooldown limits. No external art/audio, files, licensing dependencies or paid resources. No camera shake or viewport/input modifications.

## Tests

- 195 tests pass and production build passes, including all previous C/mobile/physics/modes/conveyor/preservation tests.
- D tests: activation/expiry, elastic impulses/episode guard, mode contacts before knockback, freeze rescue, per-body inflation/restitution/core invariance, odd pairing/disconnect/frozen exclusions, safe destinations, exact21-tick protection, bubble capture/fresh-action consumption/cooldown/taggability/freeze/timeout/top/expiry cleanup and snapshot round-trip.
- D combinations tested with2 and8 frogs on each of four arenas: Bumper+Mega/Tiny/Butterfeet, Balloon+Moon/Wind, Swap+MegaTongue/Tilt, Bubble+Bombardment, and Bumper+Balloon+Bubble. Finite bounded motion checked.
- 22 compiled-server scenarios: all three modes,2–8 independent clients, modifier synchronization, complete matches/results/voting/KEEP/rotation, ties/abstentions, reconnect/reservation expiry, rematch and Chaos-disabled baseline.
- Additional timed three-client compiled-server scenario: real12-second swap with warning/protection; actual input transport bubble escape with consumed action; same-frog reconnect with D state.
- 44 eight-frog local simulation benchmarks (all four arenas,11 baseline/D stacks,2400 ticks each): worst p95 .152 ms, p99 .408 ms, versus16.67 ms tick budget. Local measurements are not Render CPU or physical-device certification.

## Limits and acceptance

No physical iPhone/Android test is claimed for D. Existing physically accepted input/viewport source remains unchanged. Tiny floating shells pass through terrain; the trapped frog's collider does not. Unsafe swap pairs are skipped rather than forced. Bubbles time out in2 s to prevent indefinite loss of control. Render Free cold-start risk remains; no plan/config change.

Use4–8 players with Chaos ON for more ballots; choose D effects as they appear. With two players there is only one between-round vote per match, so repeat matches to see different candidates.

1. Confirm normal first round,15-second votes, up to3 effects, and KEEP renewing oldest without duplication.
2. Bumper: collide head-on, chase taggers, rescue in Freeze; contacts must count before ricochet. Try Tiny/Mega, Butterfeet and grappling.
3. Balloon: watch synchronized warning/inflation/deflation, float/bounce, check cosmetics/core/status clarity; combine Moon/Wind.
4. Swap: identify partner before teleport, check retained own momentum and released tongues, brief protection, odd-player sit-out and reconnect. Try Tilt; no terrain clipping.
5. Bubble: hold action before capture, release then press to escape. Escape must not also jump/grapple. Test two-thumb movement+escape, tag contacts and freeze release; ensure timeout/top/expiry release.
6. Recheck approved C, arenas/surfaces, all modes, desktop/touch, reconnect and rematch. Candidate only; stop for owner approval before E/Flappy.
