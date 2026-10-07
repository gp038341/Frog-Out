# Frog-Out competition-readiness / MVP audit

Audit date: 2026-10-07. Status: **Milestone 6 release candidate**, not final approval. This audit changes documentation/evidence only. No gameplay fixes, presentation changes, paid resources or new milestone were implemented.

## Checkpoint and deployment

- Exact release candidate/deployed revision: `6b85ff332bb12ffd539f7392a742f966ae9542bb`.
- Source correction revision: `45325ff76fd23ab1be10d7d3b90f8f68d4f55d81`.
- Git rollback branch: `checkpoint/milestone-6-release-candidate`, pointing to the exact deployed revision. Milestone 1 `363a607` and approved Milestone 5 `960a969` remain ancestors; no history rewritten.
- Render: My Workspace, `frog-out-milestone-2`, `srv-db2joi6gekts73falg8g`; deployment `dep-db2qn3s9v7es739u52sg`, live since 2026-10-07T02:17:36Z.
- Public URL: https://frog-out-milestone-2.onrender.com/.
- One existing Free instance, auto-deploy off. No upgrade or paid resource introduced. Documentation commits made for this audit do not change the running build.
- Render live/default port health passed; public root and working two-client WebSockets verified. A custom HTTP JSON health request was not separately verified. Error-log query from deployment through 02:49:47Z returned no errors. Sampled current-instance memory was approximately 66–80 MB; the small public test is not a production-capacity certification.
- Machine-readable record: `milestone-6-release-candidate.json`. Public mobile-correction evidence already committed on `evidence/milestone-6-mobile-public-check` is retained with this audit.

## Evidence boundaries and actual platforms

| Configuration | Evidence | Status |
|---|---|---|
| User's computer, browser/OS unspecified | User personally retested corrected build; normal gameplay, no obvious regression | Current user-confirmed desktop gameplay |
| Public cloud Chrome | Fresh create/join, invalid code, readiness, start, both Patient Zero rounds, keyboard body contact, results, final standings, return/rematch; live server state shared by two tabs | Current public check, not separate physical devices |
| Local isolated Chromium | Keyboard, trusted CDP multi-touch, hybrid switching, mixed contexts, viewport and fullscreen suites on current runtime source | Automated browser coverage |
| Phone/tablet-sized Chromium | 844×390, 667×375, 568×320, 1024×768; desktop/hybrid sizes also covered | Emulation, not Safari/Android hardware |
| iPhone/iOS Safari | No device available to user or agent | **Outstanding required pre-release compatibility test; not confirmed working** |
| iPhone/iOS Chrome | No physical current-build test | Unverified |
| Android Chrome / physical tablets | Prior users played mobile, but no confirmed physical long-session retest of this correction | Current correction hardware reliability unverified |
| Desktop Safari, Firefox, Edge-specific behavior | No targeted current-build run | Unverified; Chromium evidence is not browser-specific certification |

Historical user approvals establish real separate-computer multiplayer, four-player lobby/reconnect, Outbreak, and mobile/hybrid/scoring acceptance at their approved revisions. Protected-source checks establish preservation, but neither those approvals nor emulated phone sizes prove current iOS compatibility. Fullscreen standard enter/exit passed locally; prefixed-only, absent and rejected API cases were injected. The public cloud browser rejected fullscreen while exposing APIs and displayed the fallback notice. No Safari support claim follows from these tests.

## Complete new-player path

| Step | Assessment |
|---|---|
| Open URL / understand the game | Distinct original frog identity; 2–8 players clearly stated. Tagline conveys grappling/infection. It does not yet fully explain the objective or keyboard controls. |
| Learn controls | **Significant gap:** no key legend on home/lobby. `#game-help` exists in source but is hidden by `.game-active` and `.touch-game`; it is unavailable in normal play. Touch buttons communicate context but do not teach charging, eight-direction aim or momentum-preserving release. |
| Create/join/share | Simple named create/code join; no login/install. Six-character code, Copy Code/Join Link and clipboard fallback. Public nonexistent-code error understandable. Duplicate names get suffixes rather than ambiguous identities. |
| Ready/start | Clear ready cards and host label; host Start disabled until at least two connected and all ready. Non-hosts cannot start. No hidden player-specific URLs. |
| Patient Zero / start | Clear named reveal, skull/crown identity, countdown and body-contact reminder. Intro is short (1-second announcement + 3-second countdown); no unnecessary waits. |
| Infection / continued play | Healthy/grace/poison/Patient Zero words, markings and effects supplement color. Grace is visible. Lobby says infected players help hunt and tongues never poison. Exact 1-second grace and one-turn-each match structure are not explained before play. |
| Survival scoring | Lobby explicitly says 1 point/sec + 2 for last healthy frogs. Live points stop on infection. Results separate components and cumulative totals. Tie behavior is supported; the lobby does not explain simultaneous final survivors sharing the bonus. |
| Round results / advance | Clear winners and component table; non-hosts see waiting-for-host text. Host explicitly advances, giving time to read. Results omit the round number/count, making progression less clear. |
| Final standings / play again | Sorted standings, shared winners supported, host Return to Lobby / Rematch; instructions say ready up/start again. Public two-player total calculations matched displayed survival plus bonus. Same room retained and readiness reset. |
| Disconnect / accidental exit | Automatic refresh reconnect works, 30-second reservation and same-frog restoration tested. A new tab is not a reliable reconnect because identity is in sessionStorage. Leave Room interrupts the entire match immediately; its label does not warn other players will be returned to lobby. |

**First-time teaching verdict:** Outbreak's basic chase/infection and survival-score idea is understandable from the lobby; the controls and full match structure are not adequately taught without verbal explanation. A short discoverable controls/rules card before readiness, with access during play, is the highest-value UX correction. No mandatory long tutorial or new practice/bot mode is needed.

## MVP and competition coverage

| Requirement | Evidence / result |
|---|---|
| 2+ separate-device multiplayer | Personally approved by user in M2 and later multiplayer milestones; current preserved network sources plus fresh public two-tab WebSocket gameplay |
| Public URL; no player accounts/install | Public page loads directly; code/name join only |
| Room-code joining; invalid/full-room feedback | Fresh public invalid/join check; fresh 16-check lifecycle suite includes full eighth/ninth-client handling |
| 2–8 players / ready / roster freeze | Fresh SDK admission and complete Outbreak matches at 2/3/4/8; late active joining rejected |
| Reliable movement / reciprocal grapples / collisions | 56 fresh tests preserve source and exercise these behaviors; previous network/browser and user's current desktop retest support feel |
| Reconnect lifecycle | Fresh real 30-second expiry (30,014 ms), stale input/tongue clearing, same identity/slot/input sequence, lobby recovery |
| Desktop, touch, hybrid | Current desktop public check; recorded long touch/hybrid Chromium suites; physical mobile gate outstanding |
| Responsive/fullscreen | Recorded FIT aspect-ratio/layout, orientation and unsupported/restricted fallback checks; physical safe-area/browser chrome behavior unverified |
| Complete Outbreak / scoring / results / rematch | Fresh SDK full matches, public two-round match/results/rematch, contact-only infection, 60-tick grace, deterministic ties |
| Understandable instructions | Rules partially satisfy this; controls discovery is P1 below |

Competition reference: the supplied **Handshake AI Skills Studio X OpenAI Multiplayer Game Challenge Official Rules**, pages 1–3. The entry must include a title, cover image, description and project URL and be submitted in the Handshake Create a Multiplayer Game mission; the stated deadline is **2026-10-30 at 11:59 PM PT**. Judging weights execution, creativity, usefulness/value and polish/thoughtfulness equally (25% each). The rules refer to monthly mission requirements without reproducing their entire detail: the mission checklist and entrant eligibility/submission status were not independently verified. This audit does not claim an entry has been submitted or that personal eligibility has been established. No in-game paid API integration is specified by this supplied rules PDF.

Original procedural vector art and Web Audio are recorded in `assets-and-licenses.md`; system fonts and existing dependency notices should be retained. Do not spend this pass on a second mode or arena to improve creativity: the original tongue/reciprocal-grapple Outbreak identity is already distinctive. Independent new-player onboarding and mobile validation will improve execution and polish more directly.

## Technical evidence

Fresh on the unchanged current runtime source:

- **56/56 unit/regression tests:** frozen M1 baseline, approved controller/tuning/network protections, charge/normal/buffered jumps, eight-direction aim, unilateral rope/pull/release, reciprocal dynamic pulls, collisions, input recovery, infection/grace/ties/time scoring, arena spawns/recovery.
- **16/16 lifecycle checks:** invalid/missing/blank/duplicate names, host/all-ready/2-player minimum, eight clients/full room/frozen roster, explicit leave/host migration, disconnect neutralization, reconnect/reload sequence identity, actual 30,014 ms timeout/lobby return/new joining. `results/audit-lifecycle.json`.
- **9 Outbreak integration checks**, including complete matches/rematches at 2/3/4/8, Patient Zero once each, cumulative/time-based scoring, actual same-tick contact ties, grace and tongue-not-infection, infection during disconnect and identity restoration. Test-only position arrangements and 6/12-tick intros; production grace remains 60 ticks. `results/audit-outbreak.json`.
- **Public UI audit:** nonexistent code recovery; two-client create/join/ready/start; normal keyboard movement causes body infection; two Patient Zero rounds with displayed scores 6.2+2=8.2 and 33.8+2=35.8; final standings and same-room lobby return. Full production countdown/grace timing; no production test hooks.

Existing recorded tests on identical protected/runtime source (not rerun or relabeled as new hardware tests):

- Mobile recovery: 711 two-thumb cycles over 300,306 ms with 711 server input/ack checks; 10-second valid stationary hold; 396 continuous cycles over 120,214 ms with no reset/reconnect; cancel, off-control release, capture-error, hybrid and viewport interruptions; zero page errors. `results/mobile-recovery-browser.json`.
- Mixed-device-sized Chromium: 15 checks, four-client desktop/phone/phone/tablet room plus phone-only full match, results/reconnect/export, canvas/control separation; `results/mobile-correction-mixed.json`.
- Added RTT 50/100/150 ms, ±10 ms/leg jitter: zero large snaps in short browser runs, correction p95 0.014/0.042/0.127 units. Actual measured RTT includes loopback overhead. `results/browser-milestone-6.json`.
- Eight-client 60-second production-timed local stress: tick p99 **0.672 ms**, maximum **10.460 ms**, **0 overruns** against 16.667 ms tick budget, 14,440 received snapshots. Eight bots jumping/grappling/colliding; this measures one local room, not unlimited public concurrency. `results/stress-milestone-6.json`.
- Eight-context presentation test: approximately 30 FPS median on shared runner; not a physical phone performance benchmark. Names can overlap in clusters; canvas has no obstructing touch controls. `results/presentation-milestone-6.json`.

The current correction isolates touch/UI, input sequence/ack transport and authoritative frog state in Diagnostics. Earlier orphan-owner/capture-error defects were reproduced and corrected, but every random physical-user freeze was not individually proven to have that cause. Physical long sessions are necessary to close that uncertainty.

## Prioritized findings

Complexity is estimated work size, not a promised schedule. Proposed changes below are **not implemented**.

| ID / priority | Finding and recommendation | Complexity / risk | Approved-system regression exposure |
|---|---|---|---|
| P0 | **No demonstrated P0 failure found in this audit.** No remaining automated gameplay/input blocker. This is bounded evidence, not certification of untested platforms or infinite hosting capacity. | N/A | N/A |
| P1-1 | **Controls cannot be discovered.** Add compact home/lobby controls and an optional in-game Help view. Teach move/aim, tap/release jump, hold/release charge, airborne tongue, hold pull/release momentum. Include poison hunting, grace, one Patient Zero turn each, score/tie basics. | Small; low | UI overlays can intercept touches; Help must neutralize/release inputs safely and avoid touch-control overlap. Do not change action semantics. |
| P1-2 | **Native mobile release gate remains open.** Required physical iPhone/iOS Safari stress test; also current Android Chrome/tablet retest. Include 15–20 minute mixed rounds, repeated two-thumb slides/cancels, orientation/background/fullscreen interruption and diagnostics. | Validation medium; fixes unknown | No code regression if validation passes. Any discovered fix requires focused input/layout regression protection. |
| P1-3 | **Free-host demo availability and budget limits.** Judge may encounter about a minute of cold-start loading; memory rooms disappear on restart. Verify no-payment/free usage posture, included bandwidth/build balance and demo cold-start recovery. Prepare a short demo runbook and warm the page manually just before a scheduled demo. No paid tier or background keep-alive service. | Small operational check; medium availability uncertainty | No physics risk. Hosting changes would interrupt sessions; none proposed. Usage suspension can make the public URL unavailable. |
| P1-4 | **Leave/reconnect expectations are hidden.** Explain that refresh/same-tab reconnect has a 30-second reservation and a fresh tab may not recover identity. Warn or confirm that Leave Room ends the match for everyone; preserve the existing server policy. | Small; low | UI focus/input handling requires regression; lifecycle/server rules should remain unchanged. |
| P1-5 | **Submission instructions and repository status are stale/unverified.** Root README is the archived M1 prototype; app README still calls M5.1 pending with placeholder arena/no-next-milestone wording. Update the entry-facing play instructions/version and validate title/cover/description/URL plus the actual mission checklist before submitting. Include “bring at least one friend/device” so a solo judge knows how to evaluate multiplayer. | Small; low | Documentation/assets only; no gameplay risk. Handshake submission is a separate user action. |
| P2-1 | **Small-screen eight-player readability needs a human check.** Names/state labels can overlap when frogs cluster. Validate 6–8 real players with long names on a small landscape phone; consider restrained label spacing/truncation only if needed. Preserve current frogs/arena. | Validation small; label fix small–medium | Presentation-only, but can reduce clarity or add draw cost if overdone. |
| P2-2 | **Results lack round progress context.** Add Round X/Y on round results; keep the current component table and host continuation. | Tiny; low | UI only; no round-state or scoring changes. |
| P2-3 | **Old browser harness capability assumptions need maintenance.** The legacy compatibility test suppresses only the standard fullscreen flag; the corrected app legitimately supports prefixed APIs. Use both flags for an unsupported test and label fault emulation honestly. Correction-specific suites already cover this. | Small; low | Test code only; do not remove real prefixed support to satisfy an obsolete fixture. |
| P2-4 | **Rare OOB recovery resets all frogs.** Existing approved fallback is room-wide rather than individual recovery. Enclosed arena and tests stay finite, so no ordinary-play failure was observed. Consider per-frog safe recovery only if a real escape reproduces disruption; do not change physics during an onboarding pass. | Medium; medium | High relative exposure: constraints, inputs, prediction reset IDs, infection/timer preservation. Defer absent a demonstrated normal-play issue. |
| P2-5 | **Cold-load payload and physical performance not measured.** Phaser bundle is ~446 kB gzip; headless multi-context FPS is not hardware evidence. Measure an actual lower-end phone and first mobile load before deciding whether optimization is needed. | Validation small; optimization unknown | Premature rendering/bundle refactor has moderate regression risk. No optimization recommended without measurements. |
| P2-6 | **Old notice remains after leaving.** Public cleanup returned both players home correctly, but the earlier “Match complete. Ready up in the lobby” notice remained under the “You left the room” status. Clear phase-specific notice when explicitly leaving. | Tiny; low | Client notice/UI only; preserve leave and reconnect semantics. |
| P3 | **Additional maps/modes, cosmetics/progression, accounts, elaborate intros/music.** Future expansion; no MVP need. | Medium–large | Large scope and regression exposure; explicitly deferred. |

Free Render reference checked 2026-10-07: https://render.com/docs/free. Idle spin-down is after 15 minutes without inbound HTTP/WebSocket messages, spin-up about a minute; usage exhaustion without a payment method can suspend Free services or disable builds. The service plan is verified Free, but connector service metadata does not verify current payment-method settings or remaining monthly allowance. The eight-client SDK stress received ~46.6 MB of JSON payload in one minute across all clients (~2.8 GB/hour if sustained); this is **not billed bandwidth** and excludes transport/compression/accounting differences, but it justifies checking the actual free allowance before broad promotion. Do not add payment information, paid upgrades or paid resources to solve demo availability.

## Recommended next pass (requires user selection)

1. A **small first-time-player / submission-readiness pass**: P1-1 controls/rules discovery, P1-4 leave/reconnect explanations and P1-5 current README/submission package. Include P2-2 round context if desired. Preserve physics, scoring, network and visual identity.
2. In parallel with that approved pass, close P1-2 physical-device validation and P1-3 free-host/budget/demo checks. iPhone/iOS Safari remains a release gate until actually tested. Ask two fresh players to learn solely from the public URL, complete a match/rematch, and explain controls, body-only infection, grace and scoring.
3. Only implement a demonstrated remaining mobile/rendering issue or a clearly unreadable eight-player label problem. Do not preemptively rewrite networking, tune physics, redesign the arena or add another mode.

Stop here: findings are proposals. Milestone 6 remains a release candidate pending user decisions and the outstanding compatibility checks.
