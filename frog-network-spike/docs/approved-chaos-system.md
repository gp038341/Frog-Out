# Approved Frog-Out / complete 20-modifier Chaos Voting system

Owner acceptance: 2026-10-12 (America/Chicago). All20 modifiers, including Sticky Frogs, are implemented and personally approved by the owner.

Approved gameplay revision: `e6f6cafec250d2713d02f61c1f1a05bf8e5c9183`.
Approval checkpoint: `checkpoint/approved-all-20-chaos-modifiers`. The checkpoint includes this documentation-only finalization on top of that exact gameplay revision; no runtime, balance, input, assets or dependency changes.
Canonical deployment: https://frog-out.onrender.com/; Render service `frog-out`, My Workspace, Free. Existing repository/history and earlier checkpoints remain intact. The legacy milestone-2 service stays untouched.

**This is an approval checkpoint, not a feature freeze or submission-preparation milestone.** The owner will request smaller non-gameplay improvements individually. No Milestone F, broad polish, rebrand, new mechanic or submission work is authorized.

## Approved systems

- Three modes: Poison Tag (default), Freeze Tag, Classic Tag.
- Four arenas: Sunny Pond (default), Bubblewash Bathhouse, Canopy Courtyard, Croakwork Toyshop. Conservatory remains retired.
- Lobby cosmetics:10skins/patterns,5eye expressions,6hats plus no-hat; server-synchronized, locally remembered, reconnect/round/rematch persistence. Cosmetics do not alter colliders; mode status remains visually prioritized.
- Static camera; approved movement, charge-jump, reciprocal grappling, momentum surfaces and poison-role pull balance.
- Desktop, Android and physical-iPhone-accepted multitouch/viewport foundations. New modifier acceptance is recorded without inventing device/browser details not supplied by the owner.
- Server-authoritative rules/physics, existing prediction/reconciliation, room codes, ready/host start, frozen roster and30-second reconnect reservation.
- Approved audio palette, poison/IT poofs and notifications, frozen shell, blue YOU labels and purple poison/tagger labels.

## Mode rules and scoring

| Mode | Contacts / ending | Score |
|---|---|---|
| Poison Tag | One starting Poison Dart Frog; body contact spreads poison; new poison has1s transformation before transmitting. All poisoned ends the round; no time limit. |1point/second safe, in tenths; starting tagger0. Last safe frog(s)+2. Same-tick final survivors share the full bonus. |
| Freeze Tag | One freezer; body contact freezes. Unfrozen runners rescue by body contact, with1s protection. No automatic thaw.60s or all runners frozen. With2players, first freeze ends the round. | Runners1point/second unfrozen. Freezer3per freeze, +5clear bonus with3–8players; no2player clear bonus. |
| Classic Tag | One IT role transfers through body contact;1s protection after transfer.60s rounds; at most one transfer/tick, nearest centre then slot breaks exact contact-distance ties. |1point/second not IT, in tenths; no placement bonus. |

Tongue contact never directly triggers any mode contact effect. Everybody starts tagger/freezer once per match in a randomized roster order. Cumulative highest score wins; tied totals share victory. The host advances results/next rounds and final/rematch flow. Mode timers/scoring/grace and modifier state are server-authoritative.

Historical all20 approval used the original abort-on-expiry contract. The owner subsequently authorized the [lobby/player lifecycle phase](lobby-departure.md): absent frogs leave physical play, scoring pauses, same identity reserves30s, and departures no longer end everyone’s room. Tagger/freezer departure advances the round; one remaining returns to the same lobby. No modifier tuning changed.

## Chaos Conveyor / voting

Chaos is ON by default; host can toggle in lobby. Round1 has zero modifiers. Only between rounds, when another remains, use a15s ballot followed by the existing short reveal. Up to3eligible choices; fewer only if eligibility genuinely requires it. One vote per connected player, changeable before closing. Visible tie-priority order resolves ties/no votes; disconnected votes are excluded from current counts and reconnects preserve identity.

Maximum3active modifiers. First3winners accumulate. At capacity, the oldest is displayed as EXPIRING and guaranteed a **KEEP** ballot option when eligible. KEEP renews it as newest; a different winner replaces it. The other2active modifiers are excluded. No duplicate/incompatible activation. Reset only on new match/rematch or interrupted-session cleanup. Baseline-derived configuration avoids permanent mutation.

## Approved catalog — current values supersede historical design proposals

| Modifier | Approved behavior / central tuning |
|---|---|
| Moon Frogs | .25gravity; free-air acceleration .45; horizontal/vertical drag1.5/.6; slow falling cap4.2. Live grapples are not damped. |
| Mega Tongues | Range spans the map diagonal +2, effectively arena-wide. |
| Butterfeet | Ground acceleration .40, braking .025, friction .001. |
| Quick Licks | Tongue flight/retraction1.25×. |
| Turbo Toads | Ground speed1.50×; acceleration1.60×. |
| Tiny Trouble | Physical/render radius .75×; mass preserved. |
| Mega Frogs | Physical/render radius1.35×; mass preserved. |
| Super Suckers | Pull acceleration1.50×, take-up1.30×, pull-speed cap1.25×; approved poison-role advantage remains. |
| Magnet Mouths | One-time24°frog aim assistance and .30s lead, versus ordinary8°/.18s; no homing/range extension. |
| Windy Weather | Strong forecast gusts; airborne acceleration18, grounded64; bounded horizontal wind speed16. |
| Bouncy Bombardment | Up to8persistent rubber balls, spawn cycle2.5s, restitution1, cruise18/safe cap22; no direct tagging. |
| Crumble Time | Airborne platforms crack, collapse and safely regenerate; bottom ground remains intact. |
| Tilt-a-Frog | Airborne platforms rotate fully; actual off-center anchors/weight/torque; rotation cap85°/s, damping .35; materials/charge support retained. Ground stays intact. |
| Bumper Frogs | Strong bounded24separation target, upward kick8, per-contact episode guard; mode contacts register first. |
| Balloon Bellies | Immediate18launch every8s;6s inflation, .65gravity with combined floor .25; visual scale1.20, unchanged collider. |
| Swap Hop |12s interval,1.5s partner warning, persistent clock/poof, safe pairing; .35s bidirectional contact-only protection. |
| Bubble Trouble |4bubbles maximum,1s spawn opportunities,8s shell life,6s capture ceiling,2.5rise;5fresh consumed presses shake/pop;1s recapture guard. |
| Gravity Flip |8s down /4s up,1s warnings; inverted support/jumps and frog artwork. |
| Pogo Panic | Immediate14.25normal launch; approved contact timing unchanged (12tick cooldown,4tick separation); special surfaces retain their own behavior. |
| Sticky Frogs | Actual solid-contact adherence and rotating local anchors. Tangent crawl5, acceleration45, brake55; normal/charged jumps9.5/18; .2s reattachment cooldown. |

**Flappy Frogs is retired and must not be implemented.** Current source constants and dedicated milestone reports remain authoritative for full bounds/corner cases; this table does not authorize retuning.

## Current compatibility and priorities

Hard exclusions are enforced symmetrically by registry, ballot and payload validation:
- Tiny Trouble / Mega Frogs.
- Crumble Time / Tilt-a-Frog.
- Gravity Flip / each of Moon Frogs, Balloon Bellies, Swap Hop, Tilt-a-Frog, Pogo Panic, Bubble Trouble.

All other pairs are eligible; this is not a promise that every possible3-way combination has been physically tested. No pair restrictions changed during finalization. Existing gravity floors, impulse caps, collider-based mode contacts and size clearance rules remain. Platforms preserve their authored material/top-face semantics. Sticky is compatible with Gravity and Tilt separately; the existing Gravity/Tilt exclusion still prevents that triple. Sticky yields to spring/Pogo/balloon launches, freezing/capture, collapse and strong separation. Gravity reversal retains sticky contact/charge. Expiration/reset restores baseline and clears generated bodies/attachments.

See [design history and matrix](chaos-voting-design.md), [Sticky implementation](sticky-frogs.md), [E implementation](chaos-e.md), and A–D reports for targeted stacking tests. This approval record/current registry supersedes older provisional tables or superseded ballot rules.

## Verification and outstanding items

Finalization rerun: **238automated tests passed; production build passed**. No gameplay/balance changes. Historical network/stress evidence remains under `results/`, including22Sticky network scenarios, eight-client adhesion/reversal/reconnect and68stress cases. Public deployment/join/start checks are reported in the handoff; automated/browser checks are not new physical-device testing.

Known outstanding limitations, without fixes or new feature scope:
- Render Free cold starts remain; no paid/always-on change authorized.
- Rooms are in memory and are interrupted by server redeploy/restart.
- Production build retains the existing large JavaScript chunk warning (~2MB before gzip); optimization is optional and carries loading/regression risk.
- Continued small-screen/high-player-count and rare3-way-stack validation is useful; owner platform details for latest modifier acceptance are not assumed.
- Sticky external sharp corners may need jumping/grappling; this is the accepted behavior, not a new blocker.
- No newly confirmed core blocker is identified by the current tests; this is not a guarantee of exhaustive testing.

Potential owner-directed low-risk improvements: concise labels/help hierarchy; result formatting; consistent icon spacing/contrast/focus states; cosmetic preview clarity; restrained feedback text/audio-mix presentation. Touch ownership, viewport/sizing, physics/forces, networking, mode rules, scoring and modifier tuning are protected. No changes in these areas are authorized by this list. Wait for specific owner instructions.
