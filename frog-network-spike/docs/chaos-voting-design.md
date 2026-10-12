# Frog-Out — Chaos Voting design proposal

Status: Milestones A–C approved; Milestone D authorized as a playtest candidate. A–C values below reflect the approved revisions; D values remain adjustable prototypes. The 20-modifier design catalog is retained; only the first 17 catalog concepts are implemented through D. Gravity Flip, Pogo Panic and Flappy Frogs remain unimplemented.

## Source of truth and baseline

The full catalog is the starting design, subject to subsequent owner approvals. The expiring oldest modifier is guaranteed a **KEEP** ballot choice, alongside eligible new modifiers. KEEP renews it as the newest effect; the other retained active modifiers cannot be offered. This approved renewal rule supersedes all historical exclusion statements below. Previously approved decisions retained: Chaos defaults ON with host toggle; 15-second vote; ordinary first round; visible shuffled tie priority; existing scoring, starting-tagger rotation and match length.

Approved Milestone C GitHub/Render baseline: `b31caa9c1916d1647123934da8321de76bbb0469`, checkpoint `checkpoint/approved-chaos-voting-c`, at https://frog-out.onrender.com/. The old service remains outside scope. D adds isolated, server-authoritative interaction state; preserve C, all approved physics, inputs and presentation.

Inspected baseline values: gravity 26, ground speed 6, acceleration 60, brake 50, air acceleration 10, normal jump 9.5, charged jump 18, tongue range 12, flight 35, retract 45, grapple pull acceleration 48, pull-speed limit 8, take-up 4, minimum rope length .65, frog clearance .2, radius .45, mass 1. Units are existing simulation world units and seconds. Spring launch minimum 12, threshold 14, impact-energy factor .8, maximum 18, cooldown 12 ticks at 60 Hz. Poison advantage and all unmodified defaults remain separate approved baseline factors.

## Voting and Chaos Conveyor

Round results remain available until host selects Next Round. If another round remains and Chaos is enabled: open a 15-second ballot, resolve, show winning card for 1.5 seconds, then enter existing starting-tagger reveal/countdown. First round always has zero modifiers. No voting after final results.

Each connected frozen-roster participant gets one changeable ballot. Count that ballot only if connected at closing. Reconnect restores the same ballot. No-voters abstain. Server assigns each card a visible shuffled tie-priority number before opening; highest vote count wins, then smallest priority number. Zero votes uses that priority too, with an explanatory message. No early closing and no host override. Existing 30-second reservation expiry interrupts the match even during voting; late joining remains prohibited.

After round 1, add one winner for round 2; add winners until three active. Thereafter remove oldest and append winner atomically before the next round. All three remain effective until the previous round ends. During voting show KEEPING: two retained cards and EXPIRING: oldest card. Check candidate compatibility against the retained two. Offer the expiring oldest as a guaranteed KEEP choice; exclude the other retained active IDs. A KEEP winner moves the same ID to the end without duplication. Expired IDs may return in later ballots. Reset every match/rematch, including physical objects and platform state. Preserve the host toggle in the room.

### Desktop/mobile UX

Lobby: compact Chaos ON/OFF toggle near mode. Host only; locked during match. Change clears Ready with a notice; cosmetics are preserved. One sentence: “Round 1 is normal. Vote between rounds; up to 3 effects rotate.”

Voting: three large selectable cards, effect sentence, icon, selected outline/check, live counts, tie marker, visible countdown. Tap/click selects or changes; keyboard Tab/Enter works. Fixed three-column landscape panel with a compact active/expiring strip; no hover-only information. Keep buttons at least 44 CSS px where feasible. Test low-height Safari landscape without changing accepted viewport/input code. Collapse descriptive extras before shrinking primary controls. Use a scrollable dialog only if genuinely necessary; do not resize the world canvas.

Gameplay: three small screen-space modifier icons and accessible help text, no permanent large panel. Reveal and countdown explain the new effect. Muted and reduced-motion players retain all state information. Normal input is neutral during voting using established lifecycle handling.

## Catalog — numerical prototypes

All effects apply symmetrically to eligible frogs. Frozen bodies are excluded from actuation, displacement and control overrides. A modifier cannot suppress or add a scoring event. Strength ceilings listed here are proposals, not global retunes. Separate cosmetic exaggeration from physical changes.

| # / stable ID / name | Proposed behavior and tuning | Fun, feedback, implementation risk |
|---|---|---|
| 01 `moon_frogs` Moon Frogs | Gravity ×.25 = 6.5; air acceleration ×.45; horizontal/vertical drag1.5/.6; fall-speed cap4.2, free flight only. | Approved space-float effect; grapple momentum retained. |
| 02 `turbo_toads` Turbo Toads | Ground speed ×1.50 = 9; acceleration ×1.60 = 96; no air/jump/reel buff. | Approved energetic chases; physical spring normal-impact formula unchanged. |
| 03 `tiny_trouble` Tiny Trouble | Visible/fixture scale ×.75; radius .3375; mass1 and scaled clearance. | Approved small-body routes and contact geometry. |
| 04 `mega_frogs` Mega Frogs | Visible/fixture scale ×1.35; radius .6075; mass1 and scaled clearance. | Approved expanded bodies and safe spawns. |
| 05 `butterfeet` Butterfeet | Acceleration ×.40, brake ×.025; contact friction≤.001. Soap combines by strongest reduction. | Approved dramatic slides; mud speed retained. |
| 06 `mega_tongues` Mega Tongues | Range = arena diagonal +2; no obstruction bypass, aim or pulling changes. | Approved map-wide tongue reach. |
| 07 `super_suckers` Super Suckers | Pull acceleration ×1.50, take-up ×1.30, radial pull-speed ceiling ×1.25; preserve poison relative factor and reciprocal impulses. | Approved powerful momentum-building pulls. |
| 08 `magnet_mouths` Magnet Mouths | Approved baseline frog aim cone8°/lead.18 s; Magnet cone24°/lead.30 s. Clear terrain line of sight, committed heading, no range extension. | Approved distinct assistance; actual scaled frog radius. |
| 09 `quick_licks` Quick Licks | Flight/retract speed ×1.25; no invented cooldown. | Approved fast shots; no pulling buff. |
| 10 `windy_weather` Windy Weather | Every8 s: 1 s forecast,3 s gust,4 s calm. Alternate directions. Air acceleration18, ground64; directional contribution ceiling16. Apply after controller; no clamp of carried momentum. | Approved strong ground/air gusts; unchanged frozen-body restrictions. |
| 11 `bouncy_bombardment` Bouncy Bombardment | Radius.65, mass1.6, restitution1, friction0; max8 persistent balls; entry every2.5 s with .8 s warning; contact speed floor18, speed ceiling22. No timed despawn; retained across rounds while active. | Approved energetic pinball; no tags or grapple target. |
| 12 `crumble_time` Crumble Time | ALL airborne playable platforms crack for1 s, collapse4 s, return-outline.75 s, wait for clear space; bottom ground/boundaries excluded. Original-art fragments; tongues detach on disappearance. | Approved material-preserving crumble, safe recovery. |
| 13 `tilt_a_frog` Tilt-a-Frog | ALL airborne platforms; free dynamic center hinges, unlimited full turns; cap85°/s, damping.35, mass2. Exact raycast/local anchors and grapple torque. Bottom ground fixed; rotated materials preserved. | Approved weight/momentum-driven rotation and supported charging. |
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
- **Moon + Balloon/Flappy/Bubble/Wind:** combined gravity floor .25× baseline (the approved Moon value), so Moon+Balloon remains .25 rather than .1625. Standalone Balloon uses .65. This reconciles the obsolete .60 floor with approved Milestone A. Show the capped combined effect honestly. Control and reach must remain useful; log Poison round length.
- **Turbo + Butter/Bumper/Pogo:** running target ≤1.50× baseline; steering remains nonzero; no impact impulse from raw horizontal speed into flat pads. Test overshoot, stopping and multi-frog collisions.
- **Tongue + Suck/Quick, Suck + Magnet/Bumper/Balloon/Tilt/Balls, Magnet + Quick:** pulling still obeys per-role speed/force caps and reciprocal impulses. Assistance occurs once; moving anchor has stable ID/local attachment coordinate. Balls remain grapple-ineligible unless separately approved. Reject pair if solver/correction benchmarks regress.
- **Wind + Balloon/Bubble/Balls/Flip:** deterministic force schedule, bounded velocities; bubble rise and wind compose without position teleportation. Flip combination needs upside-down arena certification.
- **Balls + Crumble/Tilt/Bumper/Bubble:** bounded body/contact counts; balls may collide with solid bubbles but cannot capture, tag or score. Only frogs load crumble/seesaw gameplay triggers. No ball-driven perpetual launch loop.
- **Crumble + Tilt:** mutually incompatible at registry/ballot level; runtime platforms are never both collapsing and rotating. Crumble + Pogo/Flip needs recovery routes and safe respawn testing. Tilt + Bumper/Pogo needs swept clearances and correct normal-based launches.
- **Bumper + Balloon/Bubble:** choose maximum active restitution rather than sum; captured frog's body contacts still count; collision episode guard prevents double impulses.
- **Balloon + Bubble/Flappy:** gravity floor/upward cap; no extra flap recharge. Presentation does not hide original tag collider.
- **Swap + Bubble/Flappy:** contained frogs excluded; flap token travels with identity, not location; no recharge. Swap+Gravity Flip excluded until safe positioning and warning semantics are certified.
- **Pogo + Bubble/Flappy:** capture/landing precedence and tokens must be deterministic; no rearming while merely touching a surface.
- **Gravity Flip exclusions:** Moon, Balloon, Swap, Tilt, Pogo, Bubble and Flappy excluded initially. Other C pairs require upside-down support/arena certification. Preserve these exclusions until explicitly designed and approved, not silently enabled by a developer.

### Global effect bounds and composition

Compute from baseline, never mutated previous-round settings. Current approved gravity reduction is .25× for Moon; Balloon composes to no less than .25×. Approved Turbo running cap1.50×, Mega Tongue map-diagonal range, Super Sucker pull1.50×/take-up1.30×/radial speed1.25×, Quick flight/retract1.25× remain. Ground traction combines by strongest reduction. Body restitution uses maximum, not addition. Special impulses have their own bounds; D must not replace existing C settings.

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

Current arenas: Sunny Pond default, Bubblewash Bathhouse, Canopy Courtyard, Croakwork Toyshop. Authored geometry remains immutable. Tilt/Crumble runtime clones cover every airborne playable platform; bottom ground and invisible boundaries remain fixed. All materials remain; no manual platform whitelist. Water stays scenery. No physical-device certification is inferred from emulation.

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

Eight-player performance: max8 balls,2 bubbles, all airborne platforms for Tilt or Crumble (mutually incompatible); shared effect particle budget ≤60 transient particles per client, adjustable. Benchmark against current tick time and payload before/after; target p95 simulation work <8 ms and p99 <12 ms of 16.67 ms tick on existing Free instance. These are acceptance targets, not measured results. Detect runaway contacts and solver loops; do not silently disable voted effects midround. Fail certification before release if budget/readability unacceptable.

## Roadmap and tests

A — Toggle, 15-second voting/reveal, authoritative ballots, compatibility/registry, resets, reconnects, Moon/Mega Tongues/Butterfeet. Tests: normal round1, all votes/ties/abstentions, host/nonhost controls, expiry/full conveyor data model, zero-candidate fallback, invalid/stale votes, timeout interruption, disabled mode identical baseline. Real playable rotation pending 4th ID.

B — Turbo, Tiny, Mega Frogs, Super Suckers, Magnet, Quick Licks, Flappy. Recommend Quick Licks first to unlock rotation; gate Flappy behind gesture approval/prototype. Tests: effective config roundtrips, fixture/spawn/rope clearance, heading lock/occlusion, reciprocal pull, action semantics on desktop/touch, no surprise flap. Certify 6 eligible IDs for reliable three-card conveyor.

C — Wind, Balls, Crumble, Tilt. Begin wind, then shared dynamic-object snapshot/anchor lifecycle, balls, crumble, seesaws. Tests: deterministic schedules, safe spawn/regeneration, reconnect mid-event, contact budgets, moving anchors, platform load rules and paths on each map.

D — Bumper, Balloon, Swap, Bubble. Implement Bumper with exact body-tag ordering tests, then Balloon; approve Swap protection and Bubble escape before implementation. Tests: simultaneous contacts, IT transfer/poison ties, frozen bypass prevention, odd/offline pairing, unsafe swap cancellation, bubble scoring/contact/escape semantics.

E — Gravity Flip, Pogo. Recommend Pogo first; Gravity last after inverted support/jump/recovery spike and explicit arena certification. Tests: underside contacts, flipped launch normals, gravity-aware recovery, no contact jitter loops, input buffers, all denied pairs and role lock.

Every stage: full existing tests/build, all three modes and four arenas, 2/4/6/8 clients, latency 50/100/150 ms with jitter where supported, reconnect/deadline/multiple rounds/rematch, effective baseline restoration and preserved poison advantage. Add registry schema + complete pair eligibility tests; enumerate allowed triples and verify bounds/restoration, then targeted runtime tests for highest-risk triples. Compare packet size/tick cost and client corrections. Desktop, Android-style touch, hybrid and WebKit browser tests, landscape layouts. Physical iPhone/Android acceptance remains a separate gate for new action semantics; preserve accepted viewport/multitouch files byte-for-byte wherever possible. Automated tests do not replace physical testing.

Each stage gets a separate checkpoint and playtest deployment ONLY after explicit implementation authorization. Use existing Free frog-out service only. Never modify old service. A false toggle must restore current approved gameplay without Chaos runtime allocation or altered contact rules.

## Decisions awaiting approval

1. RESOLVED: KEEP renewal is approved and implemented; the expiring modifier is offered.
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

## Milestone B implementation clarification — 2026-10-11
The owner confirmed **keep the approved A renewal behavior**, superseding the B prompt's conflicting expiring-exclusion sentence. At capacity, the expiring modifier remains separately explained and is guaranteed a ballot slot when eligible; winning renews it as newest. The other two cards exclude kept/incompatible modifiers. There are now nine implemented modifiers, not Flappy Frogs. B uses the catalog's .75/1.25 physical scales, constant mass, 1.15/1.20 Turbo factors, 1.20/1.10 Super factors with unchanged closing-speed limit, and one-time 6° aim cone. Approved A refinement values remain unchanged.

## Chaos B player-feedback tuning override

See `chaos-b-refinement.md`: Turbo now uses 1.50 ground-speed and 1.60 ground-acceleration multipliers. Normal grabs use an 8° half-cone with up to 0.18 seconds of bounded target lead; Magnet Mouths uses 24° and 0.30 seconds. These replace earlier B starting values. Trajectory remains committed, range/hitboxes/pulling unchanged. All other B parameters remain unchanged and Mega Frogs/Super Suckers still await personal playtest approval.

### Authorized Super Suckers / Mega follow-up

Super Suckers: 1.50× pull acceleration, 1.30× slack take-up, 1.25× inward closing-speed ceiling (72 / 5.2 / 10). Mega Frogs: 1.35× size (radius 0.6075). See `chaos-b-pull-size-refinement.md`; previous values remain recoverable through its checkpoint. Other tuning unchanged.

## Milestone C authoritative override — arena-wide chaos

Approved B: `bebe643ea43b80c084ee583212ed0e3f1b359449`, checkpoint `checkpoint/approved-chaos-voting-b`.

Crumble Time and Tilt-a-Frog apply to **every playable platform** in all four arenas, including special materials and the entire playable floor (eight independent runtime sections). Earlier handpicked/optional platform limits and floor exclusions are superseded; fixed invisible boundary/recovery systems remain unchanged. Crumble/Tilt are incompatible. Crumble landing initiates a one-second warning so springy surfaces participate. Tilt uses bounded pinned kinematic rotation rather than freely dynamic hinges; angle/speed limits preserved.

Historical initial C exclusion was rejected: current approved C guarantees expiring KEEP renewal and excludes only the retained active modifiers. No duplicate activation. Other approved conveyor, baseline and input behavior remains intact. Full tuning, architecture and validation: `chaos-c.md`. Flappy and Milestone D remain unimplemented.

## Latest C playtest refinement override

The owner supersedes prior C decisions: Tilt affects **all airborne platforms only**, never the bottom floor; unlimited free center-hinge rotation responds to actual weight and grapple torque, capped at 100°/s. Crumble still covers all playable platforms/floor sections with material-preserving breakup visuals. Bombardment uses mass 1.6, restitution 1, friction 0, entry (±12,14), speed ceiling 22 and contact-energy floor 18; maximum two balls, no timed despawn, persistent while retained across rounds. The expiring modifier is once again guaranteed a KEEP ballot option, renewing as newest without duplicates. See `chaos-c-refinement.md` for behavior, safety and validation. Wind unchanged; owner has not tested it. This is a candidate, not C approval.


## Current C contact/material refinement — October 11, 2026

This supersedes conflicting historical C statements above: **both Crumble Time and Tilt-a-Frog affect airborne playable platforms only; the bottom playable ground is unchanged**. Rotating terrain tongue anchors retain the exact raycast hit in body-local coordinates (frog-to-frog anchors retain their approved center behavior). Rotated material tops use contact normals and support-point velocity: springs launch along their current outward normal while preserving tangent velocity, mud/soap keep localized effects, and supported frogs can charge on rotating platforms. Bombardment enters every 150 ticks (2.5 s), keeps its 48-tick (.8 s) warning, and supports up to eight persistent balls. Other ball energy/mass/speed settings remain unchanged. Crumble artwork breakup remains, now explicitly synchronized without relying on floor segmentation. Expiring modifier KEEP voting remains unchanged. Wind remains awaiting owner playtest. This refinement is a playtest candidate, not Milestone C approval.

## Current C wind/rotation tuning — October 11, 2026

Owner feedback requests slightly gentler Tilt and substantial Wind on ground and air. Tilt speed ceiling 100→85°/s, damping .25→.35; full turns and precise aimed grapple anchors remain. Wind air acceleration3→18, grounded acceleration64, directional speed ceiling12→16, gust120→180 ticks; one-second forecast/eight-second cycle unchanged. Apply authoritative wind after player controllers so ground braking does not erase it; frozen nondynamic frogs/paused rounds excluded. Bombardment and Crumble remain exactly at the preceding accepted behavior. See `chaos-c-wind-tilt-tuning.md`. Candidate pending owner playtest.


## Milestone D current implementation contract

C is approved at `b31caa9c1916d1647123934da8321de76bbb0469`. Older milestone records below/above are historical where they differ from the current table and contracts. KEEP renewal is unchanged. Compatibility matrix entries for implemented D pairs remain conditional-compatible; targeted tests cover them, and no new pair exclusion is introduced. Gravity Flip/Pogo/Flappy are not implemented or offered.

- **Bumper:** pre-solve restitution.45 only for frog/frog, contact episode guard, normal separation target4–8 and per-frog added-velocity budget6/tick. Valid pre-solve contacts join the authoritative rules batch before extra impulse. Preserve mass and tangential momentum. Frozen bodies stay immovable.
- **Balloon:** .75 s warning then3 s inflation every10 s; visual scale1.20, real collider/mass unchanged and solid-core ring visible. Per-body gravity.65 (combined floor.25); restitution.20 while inflated, maximum with Bumper. Deflate over.2 s; all overrides restore.
- **Swap:** 12 s interval,1.5 s paired warning; deterministic seeded pairing, rotating odd-player sit-out. Only connected, active, movable, non-contained frogs. Skip unsafe pairs; do not force destination. Release outgoing/incoming tongues, charge and buffers. Preserve own velocity up to provisional24 speed bound.21 ticks/.35 s bidirectional protection filters incoming/outgoing harmful frog-body tags only; Freeze rescues, terrain, rubber balls, bubble captures and physical collisions remain enabled.
- **Bubble:** max2 non-solid floating shells, radius.65, one entry/8 s, life8 s, trap≤2 s, rise2.5. Frog keeps its core collider and can still tag/be tagged; direction gives half normal air acceleration. Fresh action pops and is consumed; one-second recapture protection affects bubbles only, not game-mode tagging. Frozen frogs cannot capture; newly frozen occupants release. Release near top, at timeout, round reset or expiry. Shells do not add another solid collider; rubber balls act on the contained frog's real body.

Server authoritative interaction state is included in existing snapshots for prediction, reconnects and rendering. Input architecture and approved iPhone code are unchanged. Normal Round1, all modes/scoring, three-effect conveyor, expiration and rematches retain existing behavior.
