# Frog-Out — Chaos Voting design proposal

Status: Overall architecture approved; Milestone A implementation authorized only. Numerical values below are proposed starting points requiring playtests, not approved balance. All 20 supplied names and concepts are retained.

## Source of truth and baseline

The uploaded Full 20-Modifier Design Specification supersedes earlier catalog/conveyor proposals. In particular, an active modifier is never offered, including the expiring oldest modifier. Show EXPIRING separately; do not offer renewal. Previously approved decisions retained: Chaos defaults ON with host toggle; 15-second vote; ordinary first round; visible shuffled tie priority; existing scoring, starting-tagger rotation and match length.

Last verified GitHub main and new Render live revision: `966c7778923560f040b33c18bafd91faf91f7a3b`, at https://frog-out.onrender.com/. Gameplay source is the corrected bounce revision `18bebf5f9f7e19a6765a37c9165bcd41791455da`. Bounce game-feel acceptance remains pending; preserve it during this design. The old service is outside scope.

Inspected baseline values: gravity 26, ground speed 6, acceleration 60, brake 50, air acceleration 10, normal jump 9.5, charged jump 18, tongue range 12, flight 35, retract 45, grapple pull acceleration 48, pull-speed limit 8, take-up 4, minimum rope length .65, frog clearance .2, radius .45, mass 1. Units are existing simulation world units and seconds. Spring launch minimum 12, threshold 14, impact-energy factor .8, maximum 18, cooldown 12 ticks at 60 Hz. Poison advantage and all unmodified defaults remain separate approved baseline factors.

## Voting and Chaos Conveyor

Round results remain available until host selects Next Round. If another round remains and Chaos is enabled: open a 15-second ballot, resolve, show winning card for 1.5 seconds, then enter existing starting-tagger reveal/countdown. First round always has zero modifiers. No voting after final results.

Each connected frozen-roster participant gets one changeable ballot. Count that ballot only if connected at closing. Reconnect restores the same ballot. No-voters abstain. Server assigns each card a visible shuffled tie-priority number before opening; highest vote count wins, then smallest priority number. Zero votes uses that priority too, with an explanatory message. No early closing and no host override. Existing 30-second reservation expiry interrupts the match even during voting; late joining remains prohibited.

After round 1, add one winner for round 2; add winners until three active. Thereafter remove oldest and append winner atomically before the next round. All three remain effective until the previous round ends. During voting show KEEPING: two retained cards and EXPIRING: oldest card. Check candidate compatibility against the retained two, but exclude ALL currently active IDs from the ballot. Expired IDs may return in later ballots, with an appearance cooldown preference. Reset every match/rematch, including physical objects and platform state. Preserve the host toggle in the room.

### Desktop/mobile UX

Lobby: compact Chaos ON/OFF toggle near mode. Host only; locked during match. Change clears Ready with a notice; cosmetics are preserved. One sentence: “Round 1 is normal. Vote between rounds; up to 3 effects rotate.”

Voting: three large selectable cards, effect sentence, icon, selected outline/check, live counts, tie marker, visible countdown. Tap/click selects or changes; keyboard Tab/Enter works. Fixed three-column landscape panel with a compact active/expiring strip; no hover-only information. Keep buttons at least 44 CSS px where feasible. Test low-height Safari landscape without changing accepted viewport/input code. Collapse descriptive extras before shrinking primary controls. Use a scrollable dialog only if genuinely necessary; do not resize the world canvas.

Gameplay: three small screen-space modifier icons and accessible help text, no permanent large panel. Reveal and countdown explain the new effect. Muted and reduced-motion players retain all state information. Normal input is neutral during voting using established lifecycle handling.

## Catalog — numerical prototypes

All effects apply symmetrically to eligible frogs. Frozen bodies are excluded from actuation, displacement and control overrides. A modifier cannot suppress or add a scoring event. Strength ceilings listed here are proposals, not global retunes. Separate cosmetic exaggeration from physical changes.

| # / stable ID / name | Proposed behavior and tuning | Fun, feedback, implementation risk |
|---|---|---|
| 01 `moon_frogs` Moon Frogs | Gravity ×.75 = 19.5; no jump or air-input change. | Longer swings/escapes; moon badge and float trails. Low–medium: prolonged Poison rounds and height limits. |
| 02 `turbo_toads` Turbo Toads | Ground speed ×1.15 = 6.9; acceleration ×1.20 = 72; no air acceleration, jump or reel boost. Audit current velocity caps so the advertised ground increase actually works; alter only the necessary running cap while active. | Quick chases; dust streaks. Medium: ground/air transition caps and slippery combinations. Horizontal running speed alone does not directly strengthen a flat spring landing: normal impact speed remains the bounce input. |
| 03 `tiny_trouble` Tiny Trouble | Visible and fixture scale ×.75; radius .3375. Keep mass 1 initially by density adjustment. Scale feet/contact tolerances and grapple clearance with body size, not input timing. | Small escapes; recognizable outline, constant readable labels and minimum cosmetic strokes. High: fixture replacement, safe spawns, contact detection, mobile readability. |
| 04 `mega_frogs` Mega Frogs | Visible/fixture scale ×1.25; radius .5625; mass 1 initially. Scale body-relative tolerances. | Crowded comic collisions; large silhouette. High: narrow gaps, spawn overlap, short ropes. Reject unsupported arenas rather than squeeze/teleport every frame. |
| 05 `butterfeet` Butterfeet | Ground acceleration ×.65 = 39; brake ×.30 = 15; ordinary support friction ≤.03 while active. Top speed and air control unchanged. Compose with soap using the stronger slipperiness (minimum multiplier), not multiply penalties. | Skillful sliding; skids and little butter badge. Medium: responsiveness, landing support; mud speed reduction remains. |
| 06 `mega_tongues` Mega Tongues | Range ×1.30 = 15.6; flight/retract speed and aim unchanged. | Longer arcs/interceptions; long-tongue icon. Low–medium: terrain occlusion and prediction. |
| 07 `super_suckers` Super Suckers | Pull acceleration ×1.20 = 57.6; take-up ×1.10 = 4.4; pull-speed limit unchanged at 8. Preserve reciprocal impulse and poison factor; bound effective pull to 1.20× each role's approved pull. | Tug-of-war; tension streaks and scaled approved attach sound. Medium–high: short-rope sticking, double grapples. |
| 08 `magnet_mouths` Magnet Mouths | Once at firing, correct heading by ≤6° toward nearest eligible frog within that cone and existing range. Terrain line-of-sight must be clear; choose angular difference, then distance, then stable slot. No homing after launch or steering; preserve committed trajectory. | More moving catches; brief target sparkle. Medium–high: player clarity, aim agreement, tongues never tag. |
| 09 `quick_licks` Quick Licks | Flight ×1.25 = 43.75; retract ×1.25 = 56.25; any existing recovery interval ×.75. Do not invent a cooldown if none exists. No pull strength change. | Fast anchor changes; sharper existing lick cue. Medium: input edges and attachment/release timing. |
| 10 `windy_weather` Windy Weather | Every 8 s: 1 s warning, 2 s gust, 5 s calm. Alternate left/right; first direction server-seeded and shown. Air acceleration 3 units/s²; grounded .45; bounded horizontal contribution. | Forecastable swing changes; windsock/arrows, quiet rustle. Medium: predictable network schedule and upper speed safety. |
| 11 `bouncy_bombardment` Bouncy Bombardment | Rubber ball radius .65, mass .60, restitution .65; max 2; entry every 7 s with .8 s warning; life 10 s; spawn speed ≤5. No direct tags. Proposed grapple-ineligible initially. | Pinball disruptions; outlined balls/rubber squeaks. High: dynamic object snapshots, correction, contact budget. Balls cannot spawn overlapping frogs. |
| 12 `crumble_time` Crumble Time | Up to 3 explicitly authored optional ordinary platforms; crumble after 1.0 s continuous load, final .4 s visible warning; absent 4 s, .75 s respawn outline. Detach tongues on disappearance. Delay solid respawn until clear. | Bait/route changes; cracks/dust. High: arena tagging, collision removal, support/input recovery. Never floor/ceiling/essential rescue ground or special pads. |
| 13 `tilt_a_frog` Tilt-a-Frog | Up to 2 authored seesaws; ±12° angle, ≤25°/s; restoring/damped response; weight response based on mass and distance from pivot. Proposed target angle = clamp(8° × sum(mass × signed offset/half-length), ±12°). Use bounded physical motor/hinge, not collider teleportation. | Team tipping and diagonal routes; obvious pivots/creaks. High: moving grapple anchors and crusher gaps. Physics test must establish gentle launches; no extra launch impulse. |
| 14 `bumper_frogs` Bumper Frogs | Pair restitution .45, only frog/frog; capture pre-solver approach speed and valid body contact. One separation impulse/event per contact episode; proposed resulting normal separation speed ≤8. Do not amplify separating contacts. | Comic ricochets; stars/boing. High: tag-before-knockback order and multi-body solver consistency. |
| 15 `balloon_bellies` Balloon Bellies | All eligible frogs inflate for 3 s every 10 s, .75 s warning. Visual radius ×1.20; collider stays unchanged initially with a clear solid core. Gravity ×.65; body collision restitution .20, only while inflated. No persistent upward force. | Buoyant intervals; inflation/pop and core markings. High: honest hitbox presentation. Physical enlargement is an alternative needing approval. |
| 16 `swap_hop` Swap Hop | Every 12 s, warn 1.5 s; shuffle connected movable frogs into pairs; odd frog sits out with rotation of exclusion. Swap positions, retain own velocity clamped only to approved limits. Clear participating tongues and charge/buffer state at swap. Require safe clearance for both destinations. Proposed .35 s visible phase shield against incoming AND outgoing body tag/freeze/poison events. | Sudden pursuit changes; paired symbols/rings. High: temporary rule protection requires explicit approval; skip invalid pairs, never force placement. Frozen or bubble-contained frogs excluded. |
| 17 `gravity_flip` Gravity Flip | Alternate 8 s down / 4 s up, 1 s warning before each switch; magnitude remains 26. Jump/flap/ground support operate opposite gravity direction. Clear support caches at reversal, retain momentum/rope. | Ceiling chases; large gravity arrow and whoosh. Very high: underside support, recovery, bounce normals, arena ceiling access. Special surfaces activate only on authored allowed faces. |
| 18 `pogo_panic` Pogo Panic | Each valid ordinary-terrain landing launches opposite support direction at speed 9.5; rearm after separation ≥.06 s, minimum 12-tick interval. Preserve tangential momentum. Normal controller launch in that tick takes precedence. Spring surfaces use their own approved impact formula instead. | Perpetual hopping; foot ring/short boing. Medium–high: jitter, landing buffers, confusing charge behavior. Ground charge naturally difficult; document it. |
| 19 `bubble_trouble` Bubble Trouble | Max 2 bubbles; radius .65; spawn every 8 s, lifetime 8 s. Capture at most one movable frog; 2 s max enclosure; capped rise speed 2.5. Tongues release on capture. Direction steers with .5× ordinary air control; fresh action press pops bubble, without also firing tongue. Body tag contacts remain enabled on original frog collider. | Temporary floating escape; translucent bubble, escape hint/pop. High: mobile action context, networking, freeze priority. Frozen frogs cannot capture; freeze pops current bubble. |
| 20 `flappy_frogs` Flappy Frogs | One airborne flap per landing; Δv upward 3.5, upward-speed ceiling equal to approved charged jump 18. No refresh from tongue release, swaps or bubble pops; valid spring launches may refresh once. Proposed gesture: double-tap action ≤.22 s while airborne; first tap keeps normal tongue behavior, second triggers flap only if not attached. Attached holds/releases retain existing meaning. | Last-second saves; wings/puff. High: single-button ambiguity and accidental flaps. Gesture requires approval; no input architecture rewrite. |

## Compatibility: complete symmetric pair matrix

Legend: Y = proposed compatible subject to general limits; C = conditional, pair-specific acceptance required; X = excluded initially. Diagonal — disallows duplicates. No Y is a claim of tested compatibility. Three-way combinations still require validation; pair safety alone does not prove triple safety.

| # | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 Moon | — | Y | Y | Y | Y | Y | Y | Y | Y | C | Y | Y | Y | Y | C | Y | X | Y | C | C |
| 2 Turbo | Y | — | Y | Y | C | Y | Y | Y | Y | Y | Y | Y | Y | C | Y | Y | Y | C | Y | Y |
| 3 Tiny | Y | Y | — | X | Y | Y | Y | C | Y | Y | Y | Y | C | C | Y | Y | C | Y | C | Y |
| 4 MegaF | Y | Y | X | — | Y | Y | Y | C | Y | Y | Y | C | C | C | Y | Y | C | Y | C | Y |
| 5 Butter | Y | C | Y | Y | — | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | C | Y | Y | Y |
| 6 Tongue | Y | Y | Y | Y | Y | — | C | Y | C | Y | Y | Y | Y | Y | Y | Y | C | Y | Y | Y |
| 7 Suck | Y | Y | Y | Y | Y | C | — | C | Y | Y | C | Y | C | C | C | Y | C | Y | Y | Y |
| 8 Magnet | Y | Y | C | C | Y | Y | C | — | C | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| 9 Quick | Y | Y | Y | Y | Y | C | Y | C | — | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| 10 Wind | C | Y | Y | Y | Y | Y | Y | Y | Y | — | C | Y | Y | Y | C | Y | C | Y | C | Y |
| 11 Balls | Y | Y | Y | Y | Y | Y | C | Y | Y | C | — | C | C | C | Y | Y | Y | Y | C | Y |
| 12 Crumble | Y | Y | Y | C | Y | Y | Y | Y | Y | Y | C | — | C | Y | Y | Y | C | C | Y | Y |
| 13 Tilt | Y | Y | C | C | Y | Y | C | Y | Y | Y | C | C | — | C | Y | Y | X | C | Y | Y |
| 14 Bumper | Y | C | C | C | Y | Y | C | Y | Y | Y | C | Y | C | — | C | Y | Y | Y | C | Y |
| 15 Balloon | C | Y | Y | Y | Y | Y | C | Y | Y | C | Y | Y | Y | C | — | Y | X | Y | C | C |
| 16 Swap | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | — | X | Y | C | C |
| 17 Flip | X | Y | C | C | C | C | C | Y | Y | C | Y | C | X | Y | X | X | — | X | X | X |
| 18 Pogo | Y | C | Y | Y | Y | Y | Y | Y | Y | Y | Y | C | C | Y | Y | Y | X | — | C | C |
| 19 Bubble | C | Y | C | C | Y | Y | Y | Y | Y | C | C | Y | Y | C | C | C | X | C | — | Y |
| 20 Flappy | C | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | C | C | X | C | Y | — |

### Conditional pair contracts and exclusions

- **Size + aim/bodies/geometry (Tiny/Mega with Magnet, Bumper, bubbles, tilts/crumble/Flip):** assist uses actual collider; fixture/radius and clearance change only between rounds; support tolerances scale; never respawn inside geometry. Size does not shrink labels. Tiny and Mega are mutually exclusive.
- **Moon + Balloon/Flappy/Bubble/Wind:** combined gravity magnitude floor .60× baseline, so Moon+Balloon uses .60 rather than .4875. Show the capped combined effect honestly. Control and reach must remain useful; log Poison round length.
- **Turbo + Butter/Bumper/Pogo:** running target ≤1.15× approved; steering remains nonzero; no impact impulse from raw horizontal speed into flat pads. Test overshoot, stopping and multi-frog collisions.
- **Tongue + Suck/Quick, Suck + Magnet/Bumper/Balloon/Tilt/Balls, Magnet + Quick:** pulling still obeys per-role speed/force caps and reciprocal impulses. Assistance occurs once; moving anchor has stable ID/local attachment coordinate. Balls remain grapple-ineligible unless separately approved. Reject pair if solver/correction benchmarks regress.
- **Wind + Balloon/Bubble/Balls/Flip:** deterministic force schedule, bounded velocities; bubble rise and wind compose without position teleportation. Flip combination needs upside-down arena certification.
- **Balls + Crumble/Tilt/Bumper/Bubble:** bounded body/contact counts; balls may collide with solid bubbles but cannot capture, tag or score. Only frogs load crumble/seesaw gameplay triggers. No ball-driven perpetual launch loop.
- **Crumble + Tilt:** disjoint authored platform sets, never both effects on one fixture. Crumble + Pogo/Flip needs recovery routes and safe respawn testing. Tilt + Bumper/Pogo needs swept clearances and correct normal-based launches.
- **Bumper + Balloon/Bubble:** choose maximum active restitution rather than sum; captured frog's body contacts still count; collision episode guard prevents double impulses.
- **Balloon + Bubble/Flappy:** gravity floor/upward cap; no extra flap recharge. Presentation does not hide original tag collider.
- **Swap + Bubble/Flappy:** contained frogs excluded; flap token travels with identity, not location; no recharge. Swap+Gravity Flip excluded until safe positioning and warning semantics are certified.
- **Pogo + Bubble/Flappy:** capture/landing precedence and tokens must be deterministic; no rearming while merely touching a surface.
- **Gravity Flip exclusions:** Moon, Balloon, Swap, Tilt, Pogo, Bubble and Flappy excluded initially. Other C pairs require upside-down support/arena certification. Preserve these exclusions until explicitly designed and approved, not silently enabled by a developer.

### Global effect bounds and composition

Compute from baseline, never mutated previous-round settings. Proposed gravity magnitude [.60,1.0]× baseline for catalog reductions; Flip changes sign. Running cap 1.15×; tongue range 1.30×; active pull 1.20× each approved role's baseline; flight/retract 1.25×. Ground traction combines by strongest reduction, preserving soap/mud semantics. Body restitution uses maximum, not addition. Preserve existing global velocity protections; any special impulse (ball/bumper/flap/pogo) has its own bounded contribution. Record exact final effective values so caps are inspectable.

Use stable registry order for composition, independent of conveyor age. Conveyor order affects expiry only. After expiry recompute from baseline and retained effects; destroy expired spawned objects, restore platform state and material overrides during round reset. No remnants survive into normal play. Equal-scale body changes keep baseline mass; forces remain mass-aware. Proposed mass policy is pending approval.

## Mode and arena eligibility

| # | Poison Tag | Freeze Tag | Classic Tag | Arena prerequisite |
|---|---|---|---|---|
| 1 | Supported with tests | Supported with tests | Supported with tests | All four existing arenas, after regression tests |
| 2 | Supported with tests | Supported with tests | Supported with tests | All four existing arenas, after regression tests |
| 3 | Supported with tests | Supported with tests | Supported with tests | Body-size/spawn clearance audit |
| 4 | Supported with tests | Supported with tests | Supported with tests | Expanded-body route/spawn clearance audit |
| 5 | Supported with tests | Supported with tests | Supported with tests | All four existing arenas, after regression tests |
| 6 | Supported with tests | Supported with tests | Supported with tests | All four existing arenas, after regression tests |
| 7 | Supported with tests | Supported with tests | Supported with tests | All four existing arenas, after regression tests |
| 8 | Supported with tests | Supported with tests | Supported with tests | All four existing arenas, after regression tests |
| 9 | Supported with tests | Supported with tests | Supported with tests | All four existing arenas, after regression tests |
| 10 | Supported with tests | Supported with tests | Supported with tests | All four existing arenas, after regression tests |
| 11 | Conditional | Conditional | Conditional | Safe object entry lanes and bounded recovery |
| 12 | Conditional | Conditional | Conditional | At least 2 authored optional crumble platforms |
| 13 | Conditional | Conditional | Conditional | Authored pivot platforms and swept clearance |
| 14 | Conditional | Conditional | Conditional | All four existing arenas, after regression tests |
| 15 | Conditional | Conditional | Conditional | All four existing arenas, after regression tests |
| 16 | Conditional | Conditional | Conditional | All four existing arenas, after regression tests |
| 17 | Conditional | Conditional | Conditional | Certified ceiling routes, gravity-aware recovery |
| 18 | Conditional | Conditional | Conditional | Ordinary support faces + launch headroom |
| 19 | Conditional | Conditional | Conditional | Safe bubble entry lanes + rise headroom |
| 20 | Conditional | Conditional | Conditional | All four existing arenas, after regression tests |

“Supported with tests” is a design target, not released support. Freeze Tag adds a mandatory invariant to every row: frozen bodies cannot move/flap/bounce/swap/inflate physically/capture a bubble, have no tongue, and remain rescue-contact eligible. Freezer rescue rules, grace and scores remain unchanged. When frozen, release dynamic attachments and bubble state before locking; no automatic thaw. Poison grace and role advantage remain unchanged. Classic transfer retains its one-per-tick and tag-back protection rules. Tongues/balls/bubbles/wind never directly tag. Collision knockback cannot erase an already detected valid tag contact. Disconnect bodies retain mode eligibility, except Swap excludes offline frogs; reservation expiry aborts normally.

Current arenas: Sunny Pond default, Bubblewash Bathhouse, Canopy Courtyard, Croakwork Toyshop. Existing authored geometry remains immutable as baseline. Crumble/Tilt need additive opt-in metadata and runtime clones of approved selected platforms; never infer eligibility from color/rectangle shape. Require explicit per-arena certification before offering those modifiers. Unsupported choices remain unavailable, not removed from the catalog. Water stays scenery. All maps require testing; no physical-device certification is inferred from emulation.

## Card-selection algorithm

1. Freeze ballot candidates at open. Take implemented, certified registry entries for room mode/arena.
2. Exclude every active ID. For a full conveyor evaluate compatibility against the two survivors; otherwise against all active IDs.
3. Enumerate compatible triples of choices, preferring three families, then two, then one. Choices need not be compatible with each other since only one wins. Do not offer an unavailable implementation.
4. Weight candidate appearance: full weight 1, shown/rejected previous ballot .25, two ballots ago .50, three ago .75. Previously expired modifier weight .50 for first subsequent eligible ballot. Favor less-presented families/IDs within the room, capped so all eligible choices retain nonzero probability. Sample without replacement using server match RNG.
5. Pick fairly within the best family-diversity tier. Shuffle card display/tie priority independently. Keep room-level recent-history counters across rematches, bounded to last 3 ballots; seed each match independently. No accounts/global tracking; fairness across unrelated rooms is statistical, not guaranteed equal appearances.
6. Two eligible: show two cards and explain limited choices. One: show one card, still allow 15-second vote/reveal. Zero: skip ballot, explain no compatible change. At full capacity retain current three; do not expire one without a replacement. With fewer than three retain current set. Never fill slots with invalid/duplicate/no-op modifiers.

Milestone A has only three implemented IDs: first ballot 3, second 2, third 1, then zero. It can test accumulation and zero-choice fallback, but NOT a functioning ongoing conveyor. Recommend adding Quick Licks as a fourth certified modifier before conveyor acceptance, or accepting A as foundation-only and testing rotations in B. Full three-card choice at a three-active cap needs at least SIX mutually eligible implemented IDs. Do not pretend stub catalog entries are playable.

## Server/client architecture

Registry metadata: stable ID, family, title/description, tuning, supported modes, arena capability predicates, excluded/conditional pair IDs, component hooks, revision and limits. UI imports serializable definitions; server chooses eligibility and state. A registry entry has implementation/certification status distinct from design status.

Room state: chaos toggle, ordered active IDs, ballot ID/candidates/priority/deadline, per-player ballots, result, modifier configuration version, deterministic RNG seed/state and event schedule. No new external service/storage. Host authority limited to lobby toggle and existing results advance. Server validates participant, phase, ballot ID, revision and choice; rejects late/stale/spam messages. Reconnect transmits a full current ballot/runtime snapshot, not past effects replayed.

Lifecycle: results → vote → atomic resolve/configure/reset → reveal/countdown → playing. Existing mode rules retain ownership of points, timers, body-contact effects and wins. Configuration is finalized before client prediction starts. Ballot clock uses server monotonic time; gameplay events use authoritative ticks. Inputs/scores cannot advance during voting. No changes to accepted input normalization, touch ownership, Safari sizing or camera required.

Physics: derive effective config from frozen baseline + role + surfaces + modifiers with explicit precedence/bounds. Constant parameter changes shared by prediction/server. Per-frog state includes body scale, flap availability, balloon phase, bubble ownership, swap immunity deadline and normal direction where applicable. Add only needed snapshot fields, version them and reconcile on authoritative reset/event. Assist prediction may suggest a heading from interpolated frogs, but authoritative heading/target wins; never client-authorized tags.

Dynamic objects: server-owned stable IDs, limited spawn/despawn, transforms/velocities and material flags. Clients interpolate balls/platforms and draw bubbles from authoritative state. Existing prediction must account for visible solid objects where necessary; measure corrections before expanding prediction. Do not duplicate physics engines or preemptively add rollback. Moving terrain anchors use body ID + local attachment coordinates; detach on despawn. Snapshot recovery must work without receiving a prior spawn event.

Contact processing: capture pre-solve collision facts/approach velocity, finish authoritative step, resolve mode contacts from a stable batch, then schedule optional knockback/capture/surface effects with mode-state precedence. Preserve Poison same-tick infection ties. Freeze takes priority over bubble/flap/pogo; rescue follows approved order. Any scheduling change requires exact tag-contact regression tests, especially Bumper. Avoid changing the existing contact pipeline for simple parameter-only modifiers.

Eight-player performance: max 2 balls, 2 bubbles, 2 seesaws, 3 crumble platforms; shared effect particle budget ≤60 transient particles per client, adjustable. Benchmark against current tick time and payload before/after; target p95 simulation work <8 ms and p99 <12 ms of 16.67 ms tick on existing Free instance. These are acceptance targets, not measured results. Detect runaway contacts and solver loops; do not silently disable voted effects midround. Fail certification before release if budget/readability unacceptable.

## Roadmap and tests

A — Toggle, 15-second voting/reveal, authoritative ballots, compatibility/registry, resets, reconnects, Moon/Mega Tongues/Butterfeet. Tests: normal round1, all votes/ties/abstentions, host/nonhost controls, expiry/full conveyor data model, zero-candidate fallback, invalid/stale votes, timeout interruption, disabled mode identical baseline. Real playable rotation pending 4th ID.

B — Turbo, Tiny, Mega Frogs, Super Suckers, Magnet, Quick Licks, Flappy. Recommend Quick Licks first to unlock rotation; gate Flappy behind gesture approval/prototype. Tests: effective config roundtrips, fixture/spawn/rope clearance, heading lock/occlusion, reciprocal pull, action semantics on desktop/touch, no surprise flap. Certify 6 eligible IDs for reliable three-card conveyor.

C — Wind, Balls, Crumble, Tilt. Begin wind, then shared dynamic-object snapshot/anchor lifecycle, balls, crumble, seesaws. Tests: deterministic schedules, safe spawn/regeneration, reconnect mid-event, contact budgets, moving anchors, platform load rules and paths on each map.

D — Bumper, Balloon, Swap, Bubble. Implement Bumper with exact body-tag ordering tests, then Balloon; approve Swap protection and Bubble escape before implementation. Tests: simultaneous contacts, IT transfer/poison ties, frozen bypass prevention, odd/offline pairing, unsafe swap cancellation, bubble scoring/contact/escape semantics.

E — Gravity Flip, Pogo. Recommend Pogo first; Gravity last after inverted support/jump/recovery spike and explicit arena certification. Tests: underside contacts, flipped launch normals, gravity-aware recovery, no contact jitter loops, input buffers, all denied pairs and role lock.

Every stage: full existing tests/build, all three modes and four arenas, 2/4/6/8 clients, latency 50/100/150 ms with jitter where supported, reconnect/deadline/multiple rounds/rematch, effective baseline restoration and preserved poison advantage. Add registry schema + complete pair eligibility tests; enumerate allowed triples and verify bounds/restoration, then targeted runtime tests for highest-risk triples. Compare packet size/tick cost and client corrections. Desktop, Android-style touch, hybrid and WebKit browser tests, landscape layouts. Physical iPhone/Android acceptance remains a separate gate for new action semantics; preserve accepted viewport/multitouch files byte-for-byte wherever possible. Automated tests do not replace physical testing.

Each stage gets a separate checkpoint and playtest deployment ONLY after explicit implementation authorization. Use existing Free frog-out service only. Never modify old service. A false toggle must restore current approved gameplay without Chaos runtime allocation or altered contact rules.

## Decisions awaiting approval

1. Confirm newest spec intentionally removes the earlier expiring-card renewal option (recommended interpretation: yes).
2. Approve numbers as prototype starting points, including .75 gravity and body scales .75/1.25; all subject to per-stage acceptance.
3. Choose foundation-only A versus moving Quick Licks into A; six certified eligible entries needed for full ballot variety at cap.
4. Approve constant mass during size modifiers and Balloon visual-only expansion with truthful core indicator; otherwise physical expansion raises risk.
5. Approve Flappy double-tap gesture or choose a separate compact action. Current one-button semantics leave no unambiguous spare press. Do not silently consume ordinary tongue presses.
6. Approve Swap .35 s bidirectional contact protection; this is a temporary explicit mode-rule exception necessary for fair teleports. If declined, design a safe alternative before implementation.
7. Approve Bubble fresh-action pop, 2 s maximum enclosure, control steering and no immunity; frozen/Swap exclusions.
8. Approve ball grapple-ineligibility, bounds and all conditional/excluded pair policies initially.
9. Approve Pogo landing priority/charge consequence and Gravity-dependent jump/support/recovery semantics.
10. Approve reduced-card/zero-choice fallback and room-local history policy.

No implementation or deployment is included in this document. No modifier has been removed; higher-risk entries remain designed and gated.

## Milestone A approval — 2026-10-10
Round 1 normal; Chaos ON by default with host toggle; 15-second authoritative votes. Maximum three modifiers with oldest replacement, expiring shown separately and excluded from ballot. A includes Moon Frogs, Mega Tongues, Butterfeet, Quick Licks; gracefully allow fewer cards. Numerical values provisional/centralized. Flappy gesture remains unapproved pending control prototype. Swap .35-second bidirectional contact-only protection approved provisionally; Balloon visual inflation/unchanged collider approved; Bubble fresh press escape consumes input and grants no immunity. No B–E implementation authorized. Pre-A checkpoint `checkpoint/pre-chaos-milestone-a` at `966c7778923560f040b33c18bafd91faf91f7a3b`. Old Render service remains untouched.

## Owner playtest refinement — 2026-10-10
Supersedes earlier A tuning and expiring-ballot exclusion. Moon gravity is ×0.25 (6.5), free-flight air acceleration ×0.45 (4.5), horizontal drag 1.5/s, vertical drag .6/s, maximum downward speed 4.2. Air resistance excludes frogs attached to terrain and either end of frog-to-frog grapples; lower gravity remains active. Butterfeet acceleration ×.40 (24), braking ×.025 (1.25), friction cap .001. Mega Tongues reach covers the full 40×22.5 arena diagonal plus 2 units (47.8939); no infinite ray or change to boundaries. Quick Licks unchanged. At capacity, expiring modifier appears with RENEW on the ballot; choosing it moves it to newest without duplication. Ballots become 3→2→1→2 with this limited catalog. Distinct moon-purple, tongue-pink, butter-gold and lightning-teal cards retain names/icons and checked state. Normal baseline, input and viewport systems unchanged. Physical acceptance pending.
