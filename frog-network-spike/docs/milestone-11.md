# Milestone 11 — Poison Dart Frog identity

Pre-M11 checkpoint: `checkpoint/post-m10-static-camera` at `6cd9ddc668741e0e5c41da5308df16c48f62718a`, confirmed live on existing Render service before development. Static camera is the approved design direction.

## Player-facing vocabulary

Patient Zero → Poison Dart Frog; Outbreak → Poison Tag; Healthy → Safe; Infected → Poisoned; active poisoned state → Poison Frog; Last Healthy → Last Safe Frog; infection order → poison order. Home/lobby, onboarding, Help, reveal/countdown, HUD, feedback, results and final rotation context follow this language. Internal state/message/cue names remain unchanged for compatibility and do not imply a rules change.

## Original art and presentation

Original repository-native SVG hero gains turquoise dart-frog skin and dark flank spots. Phaser frogs keep all eight slot colors/permanent identity marks. Poison spots appear immediately during transformation; tagged-ready frogs gain a vivid rim and three small dart-shaped motes. The starting Poison Dart Frog keeps the existing crown and distinct DART FROG label. Safe/Changing/Poison labels, spots, crown and grace-ring progression remain readable without sound or color dependence. Longer status labels are clamped within arena edges without moving bodies or resizing the camera. The old skull reveal symbol becomes a dart-diamond emblem. Reveal palette changes to warm gold/teal; short playful caption becomes TINY FROG. BIG DART ENERGY. Existing transitions and sound cues remain unchanged.

No external images/audio/fonts/assets were added. New vector marks are original project code. The approved procedural audio source is byte-identical to the baseline; cue placement, palette and volume/mute behavior are preserved. Effects use bounded simple Graphics primitives; no new network payload, shaders, timers or camera effects.

## Preserved mechanics and compatibility

No change to body-only poison, tongues never tagging, 60-tick grace, tagger rotation, survival scoring/bonus/ties, count-up timer/endings, reconnect, authoritative simulation/networking, desktop/mobile input, iPhone touch/viewport/orientation/canvas sizing, static framing or either arena. Exact reversible presentation edits and hashes are in milestone-11-preservation.json; historical baseline guards reverse only those edits.

Automated browser emulation is not new physical iPhone/Android verification. User's accepted physical baseline is retained. Long Poison Dart Frog text is tested against mobile canvas layout; no viewport/input changes were made for this wording.

## Acceptance

Open public URL; check home/Help and lobby with a new player. Start Poison Tag on both arenas. Check the starter reveal, safe frogs, immediate spotted transformation, one-second non-tagging state, fully active Poison Frogs and Last Safe Frog callout. Confirm frogs remain identifiable by slot color/marks, including muted play and phone landscape. Complete a match; confirm Survival + Bonus = Round Score, ties/rotation/rematch and all results use new terms. Retest movement, charged jumps, reciprocal grappling, reconnect and two-thumb Safari input. Stop pending user approval; no Poison Frog ability/advantage or further feature is added.

## Validation record

Production build and 80 unit/preservation tests pass. Independent-client arena/Outbreak suites pass at 2/3/4/8 players; lifecycle includes the actual 30-second timeout. M11 UI tests complete a four-player match across desktop, phone and tablet-size contexts. Chromium native-touch compatibility passes 19 checks, including 60 seconds / 94 two-thumb stress cycles and two complete matches. Reports are in docs/results/milestone-11-*.

Current Linux WebKit rerun is unavailable: its binary downloads, but required system libraries are missing and official dependency installation is blocked by container privilege restrictions. This is not a pass. No production Safari/input/viewport code changed; physical acceptance remains the user's baseline, not a new test. Chromium setup and synthetic post-refresh fixture races were corrected only in local browser tooling/testing. New physical M11 visual/readability acceptance is pending.
