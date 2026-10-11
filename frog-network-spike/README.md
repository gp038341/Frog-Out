# Frog-Out — current game

**[Play online](https://frog-out.onrender.com/)** · 2–8 players · Four selectable arenas · Poison Tag + Freeze Tag + Classic Tag.

No player account, installation or special player-specific URL. Enter a display name, create/join by six-character code, use Copy Code/Copy Join Link. All connected players ready up; the host starts with at least two players. The match roster then freezes. Controls & Rules appears before play; How to Play stays available. The round continues while Help is open, with held inputs cleared; use fresh inputs after closing.

## Controls

| Action | Desktop | Touch in landscape |
|---|---|---|
| Move / eight-direction aim | WASD / arrow keys | Left pad |
| Grounded normal jump | Tap/release Space | Tap/release right JUMP button |
| Charged launch | Hold grounded; release Space | Hold JUMP; release to launch |
| Fire tongue in air | Press Space | Press TONGUE |
| Maintain attachment / pull | Keep Space held | Keep action held |
| Detach with momentum | Release Space | Release action |

Without aim input, the shot follows the frog's facing direction; fired direction stays committed. Terrain and frog grapples actively pull. Both attached frogs remain physical and receive reciprocal forces. Touch uses the same normalized commands/physics as keyboard. Input layouts can switch during play. Fullscreen is optional where available; unsupported/rejected requests preserve ordinary play. Portrait touch gameplay prompts rotation without losing the session.

## Poison Tag / scoring

Everyone in the frozen roster is Poison Dart Frog exactly once in randomized order. Each round has a named reveal, three-second countdown, Poison Tag, results and host continuation.

- Poison Dart Frog starts able to tag; others are safe. **Body contact alone spreads poison. Tongues never directly infect.**
- Newly poisoned frogs remain controllable with **one second of grace** before spreading poison; then help hunt.
- Infection lasts the round. It ends only when everyone is poisoned. The server count-up timer starts after countdown and stops at final poison; no time limit.
- Healthy survival earns **1 point/second**, credited in complete tenths of a second, and stops on poison. Poison Dart Frog earns zero.
- Last safe frog(s) receive **+2 points**. Same-tick poisons share placement; tied final survivors each get the full bonus.
- Round Score = Survival + Bonus. Match totals accumulate; equal top totals share victory without a tiebreaker.
- Host advances results/final standings. Return to Lobby / Rematch retains the room and resets readiness.

Text/markings/effects supplement poison colors. Non-lethal out-of-bounds recovery does not directly infect or change scoring; the existing emergency fallback resets all frogs and has not been redesigned.

## Freeze Tag / scoring

Host selects the mode in the lobby; Poison Tag remains the default. Mode changes retain Ready states and cosmetics. Selection locks at match start.

- One freezer per round, randomized rotation; everybody starts freezer once per match.
- Body contact freezes runners. Only an unfrozen runner can rescue a frozen teammate by body contact. Tongues do neither. **No automatic thaw.**
- Frozen frogs remain solid, pinned in ice; no movement, jump, grapple or surface-driven escape. Incoming/outgoing tongues detach. Rescue restores normal physics with one second of freeze protection.
- Active round: 60 seconds, or until every runner freezes. **Two players: first freeze ends the round; no rescue and no clear bonus.**
- Runners earn 1 point/second unfrozen, paused while frozen. Freezer earns 3 per successful freeze, plus 5 for clearing all runners with 3–8 players.
- All-frozen round: freezer wins. Timeout: remaining unfrozen runners share the escape victory. Highest cumulative points wins the match; ties share victory.
- Freeze resolves before rescue in each authoritative tick; a newly frozen runner cannot rescue that tick. Results show survival, freeze points, clear bonus and totals.

## Classic Tag / scoring

- One frog is IT. Body contact transfers IT; tongues never tag. New IT cannot tag for one second, including continued contact until grace expires.
- 60-second rounds for all 2–8-player rooms. Everyone starts IT exactly once in a randomized match order.
- Earn 1 point/second not IT (complete tenths). No placement bonus. Round winners have the highest round score; cumulative highest totals win the match; ties share victory.
- One transfer per authoritative tick. Multiple contacts choose nearest body centre, then roster slot for an exact distance tie, never physics callback order.
- Amber pennant/IT label retains cosmetics, distinct from poison patterns or ice. Transfer produces a purple poison poof and compact YOU’RE IT notice using the approved audio palette.
- Existing host-led results/next/final/rematch and 30-second reconnect apply; disconnected bodies can still transfer IT and accrue score under their current role. Expiry interrupts the whole match.

## Connection lifecycle

During a match, accidental disconnects reserve the same player/frog for up to **30 seconds after server detection**. Inputs/outgoing tongue clear; the body remains in the simulation and can be poisoned/frozen or rescued under the selected mode rules. Automatic reconnect or refresh of the **same tab** restores current state within the reservation. A new tab does not reliably retain identity. Expiry interrupts the match, returns connected players to the lobby and resets readiness.

Lobby disconnects remove entries; host responsibility transfers if needed. Explicit Leave during a match ends it for everyone immediately and now asks for confirmation, for both host and non-host. Lobby Leave does not end the room for others. Rooms are in memory: restart/redeploy loses them.

## Local development

Node.js 22+, from this directory:

```sh
npm ci
npm run build
npm start
```

Open http://127.0.0.1:2567/ in independent tabs/profiles. For frontend development, run `npm run dev:server` and `npm run dev` in separate terminals and use http://127.0.0.1:5173/. Vite proxies room lookup/matchmaking to the server. `npm run preview` alone does not start multiplayer.

## Architecture / deployment

TypeScript, Phaser 3 presentation, shared Planck 1.4.2 physics. One Node/Express + Colyseus server owns membership, input acceptance, **60 Hz physics**, poison/scoring and **30 Hz snapshots**. Clients send normalized direction/action at 30 Hz plus immediate changes, with the approved prediction/reconciliation and interpolation. HTTP and secure WebSockets share the same public host.

Existing Render `frog-out-milestone-2`: one **Free** instance, auto-deploy off; no paid resource, migration or plan change. Build/start from repository root:

```sh
cd frog-network-spike && npm ci && npm run build
cd frog-network-spike && npm start
```

Server binds `0.0.0.0:$PORT`. Node 22+ required; no accounts/database/API credentials are needed. `/health` reports process health, not full-match correctness. [Hosting/demo assessment](docs/hosting-demo-readiness.md) explains Free limitations and the optional always-on trade-off; it does not authorize billing.

## Regression tests / diagnostics

```sh
npm test
npm run test:onboarding
npm run test:lifecycle
npm run test:outbreak
npm run test:outbreak-browser
npm run test:browser
npm run test:mobile-recovery
node scripts/mobile-unsupported-browser.cjs
npm run stress
```

Browser suites run against isolated local Chromium; run browser suites sequentially. Test-only arrangements require `ENABLE_TESTS=1`; short intros additionally require `TEST_OUTBREAK_SHORT_COUNTDOWN=1`. Production does not enable these hooks. Long recovery tests normally run five repeated-touch minutes plus two uninterrupted minutes. Emulation/fault injection is not physical Safari/Android certification.

Diagnostics exports input/acknowledgements, authoritative state, touch lifecycle, RTT/corrections and server timing without reconnect tokens. Send affected-client files, browser/device, approximate time/actions and optionally a recording. Do not publish credentials/reconnect tokens. Optional test URLs `?lag=50&jitter=10`, `?lag=100&jitter=10`, `?lag=150&jitter=10` add latency to the real network; omit for ordinary play.

## Baselines / known limitations

Approved earlier milestones remain recoverable in Git. M6 release candidate: `6b85ff332bb12ffd539f7392a742f966ae9542bb` / `checkpoint/milestone-6-release-candidate`. [M7 preservation record](docs/milestone-7-preservation.json) locks physics/tuning, graphics, geometry, networking/rules, touch recovery and responsive/fullscreen source. Approved Milestone 15: `f894102e9bb7f69406de278f94542d92f8154d0c`, checkpoint `checkpoint/approved-milestone-15-frog-customization`. Freeze Tag is approved at `aadecb3f3258c4535bb29fe8bf9b02cb6d49cbb6`, checkpoint `checkpoint/approved-freeze-tag`. Classic Tag is a new acceptance candidate; see [Classic Tag](docs/classic-tag.md).

**The existing iPhone Safari viewport and simultaneous multitouch were physically approved by the owner; The owner has approved Freeze Tag. Classic Tag still needs owner/device acceptance.** Current physical Android/tablet long sessions and desktop Safari/Firefox/Edge-specific validation remain outstanding. Crowded labels and lower-end phone performance need real-device assessment. Free cold starts and room loss on restart remain documented compromises. Four arenas and synchronized cosmetic customization are available; no progression, accounts or purchases.

[Submission readiness](docs/submission-readiness.md) lists required materials/drafts and remaining checks; [assets and licenses](docs/assets-and-licenses.md) records original procedural artwork/audio and dependencies.

## Historical Milestone 8 geometry playtest

Approved submission-ready M7 gameplay checkpoint: `e97bbcb418468149e5b936c7ff9e95a0ccbe5b9b`, branch `checkpoint/milestone-7-approved`. The original Canopy Courtyard remains the default and its geometry is unchanged. The lobby host can now choose **Rainbell Conservatory — Geometry Preview** before ready/start. Arena changes clear everyone’s Ready; choices are frozen across all rounds of a match and retained for rematch. No new mode or physics tuning. Arena 2 layout acceptance and final art are pending. See [M8 details](docs/milestone-8-geometry.md).

## iPhone reliability diagnostic candidate

Physical iPhone Safari testers reported a release-blocking viewport/input failure. This candidate is frozen pending physical testing and adds visual-viewport sizing, native finger lifecycle handling and opt-in Input monitor/Diagnostics. It is **not yet certified fixed on physical iPhone**. See [physical test instructions](docs/iphone-reliability-diagnostic.md).

## Milestone 9 presentation playtest

Original pond-percussion sound, restrained action feedback and short Outbreak/round celebrations. Current maps, physics, networking and scoring remain unchanged. Sound is opt-in; lobby help contains volume settings. Physical iPhone Safari remains a mandatory release gate; its input/viewport candidate stays frozen. See [M9 scope and acceptance checklist](docs/milestone-9.md).

## Current iPhone validation status

Simultaneous iPhone multitouch is physically validated at `eb7bfd5a58b134af428794bcbc10311c99fefa84` (`checkpoint/iphone-multitouch-physically-validated`). The latest [viewport stabilization candidate](docs/iphone-viewport-candidate.md) preserves that input implementation and adds stable touch-game layout plus diagnostics. Physical Safari viewport/screen-fit acceptance remains mandatory before submission; automated WebKit/Chromium checks are not physical-device verification.

## Accepted release and static-camera decision

The user physically accepted iPhone multitouch and Safari screen fit at `cc0c09b8fa0e021f2195ec6b12848081f6d1cefa`, preserved as `checkpoint/approved-release-pre-m10`; this supersedes earlier pending compatibility notes. The M10 dynamic-camera experiment was rejected after user playtesting. Production restores the exact accepted static-camera source with no experimental framing or A/B controls. No HUD, arena, physics, rules, input or viewport changes are retained from M10. See [static-camera decision](docs/post-m10-static-camera.md). Future arena-space work requires separate approval.

## Milestone 11 — Poison Dart Frog identity

Poison Tag keeps the approved body-contact rules, one-second transformation, starting tagger rotation and survival + placement-bonus scoring. Safe frogs become spotted Poison Frogs; the starting Poison Dart Frog wears its crown/badge. Sounds, static camera, arenas and physically accepted iPhone input/viewport systems are unchanged. See [M11 scope and playtest](docs/milestone-11.md).

### Milestone 12 balance candidate

The accepted Poison Tag identity checkpoint is `0b65d9954ad3da5b0a95ad15931ea4b571b35700` (`checkpoint/approved-milestone-11-poison-tag`). The M12 prototype gives fully poisonous frogs 10% more active grapple acceleration, with the existing radial pull ceiling unchanged. Safe/transformation movement remains approved behavior. See [Milestone 12](docs/milestone-12.md) for timing, validation and one-value rollback. This candidate awaits human balance acceptance.

### Milestone 13 prototype

Sunny Pond adds a third selectable arena with two springy lily pads and two optional sticky-mud perches. Lily tops bounce on downward landings; mud tops slow controlled running until you leave. Decorative water has no gameplay effect. Both original maps and approved Poison Tag balance remain available unchanged. See [Milestone 13](docs/milestone-13.md) for exact tuning, validation, fallback checkpoint and acceptance checklist.

## Current arena roster — Milestone 14 candidate

New rooms default to **Sunny Pond**. Hosts can choose **Bubblewash Bathhouse**, **Canopy Courtyard** or **Croakwork Toyshop**; selections remain fixed during matches and retained in the same room for rematch. Conservatory alone is retired. Croakwork Toyshop is selectable with its existing implementation unchanged. Bathhouse sponge tops repeatedly bounce using accepted lily behavior; the marked central soap dish reduces grounded traction while water remains scenery. See [roster, preservation and playtest notes](docs/bubblewash.md). Earlier milestone descriptions above are historical.

### Frog customization

Before readying up, open **Dress your frog** in the lobby for 10 color/pattern styles, five eye expressions and six hats (or no hat). The live preview and other players' portraits update together. Choices persist locally and through rounds/rematch/reconnection. These are cosmetic only: poison markings/status always take priority, and the starting Poison Dart Frog wears its reveal badge. See [Milestone 15 notes](docs/milestone-15-customization.md).

## Chaos Voting (Milestone A playtest)
Chaos Voting is ON by default; the host can turn it off in the lobby. Round 1 uses normal physics. After results, Next Round opens a 15-second vote. Up to three effects accumulate, then the oldest is replaced. Four prototype effects: Moon Frogs, Mega Tongues, Butterfeet, Quick Licks. Kept effects never appear on the ballot. The expiring effect can be renewed; later ballots may have fewer than three choices. Scoring and mode rules are unchanged.

## Chaos Voting B candidate

Approved A is preserved at `checkpoint/approved-chaos-voting-a` (`5b9f3403bff1b49946a8dfa23f48da98d9e87429`). Nine modifiers are now available: the four approved A effects plus Turbo Toads, Tiny Trouble, Mega Frogs, Super Suckers and Magnet Mouths. Tiny and Mega change physical bodies and are mutually exclusive. The oldest effect can still be renewed. See [B tuning, tests, limitations and playtest](docs/chaos-b.md). Flappy remains design-only and requires control approval. Public service remains https://frog-out.onrender.com/ on Render Free.
