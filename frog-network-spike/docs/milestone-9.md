# Milestone 9 — Pond percussion and presentation playtest candidate

Start checkpoint: `checkpoint/milestone-9-start` at `0c2f80ff0610c4400f5afc3dd4232536930c7f2d`. The deployed iPhone candidate runtime is `cd47dd80557b278803b35255255068bf2899ac17`, preserved independently at `checkpoint/iphone-validation-candidate` (evidence revision 0c2f80f).

## Sound direction and rights

Original synthesized **pond percussion**: short warm croaks, rubbery tongue notes, little impact pops and ascending celebratory calls. All oscillator envelopes/note combinations are original project code in `src/presentation/audio.ts`. No samples, external recordings/music, asset purchases, downloads or new dependencies. There is no third-party sound attribution requirement. System fonts and existing project art remain unchanged.

Cues: normal jump; distinct charged launch; charge tiers; tongue fire, attachment, miss/retraction and intermittent taut-rope creak; local landing/body impacts; room infection; local grace completion; Patient Zero reveal; countdown; Outbreak start; last healthy frog; round finish; final victory/shared victory; lobby/UI clicks.

Sound stays **Off by default** and starts only from the existing user-initiated Sound toggle. Lobby **Controls & Outbreak rules** contains a volume slider (persisted locally). Mute stops voices immediately. Browser audio failures fall back to silent play. No event can depend exclusively on sound.

Local action sounds remain player-focused. Room-wide cues are reserved for important rules events. Per-cue cooldowns, an 85ms small-effect mix gate, a compressor and an eight-oscillator cap bound the mix. No music loop, recurring max-charge noise, audio queue or network audio events. Important cues take precedence when the voice cap is reached; browser-hidden presentation is silenced rather than catching up missed events. Volume zero also suppresses synthesis.

## Visual direction

Existing frogs, themes and both arena geometries remain intact. Small launch/attachment accents and rubbery impact lines complement existing squash/stretch. Four charge tiers get soft ticks instead of a continuous oscillator. A grace-period ring uses the authoritative infectious tick, without changing the one-second rule. Tiny chevrons emphasize the last healthy frog and an approximately 1.3-second **LAST FROG STANDING!** banner adds spectator clarity. In two-player rounds this naturally occurs at start, once. **OUTBREAK!** is brief; last-survivor priority prevents stacked banners.

Patient Zero gets a short reveal animation and “ONE SMALL FROG. ONE BIG PROBLEM.” Countdown pops last 240ms. Existing server reveal/countdown duration is unchanged. Results add a short frog-flavored caption and final gold winner emphasis; all existing survival/bonus/round/total columns, tied placements and shared winners remain server-derived. No camera shake, pause, hit-stop, flash, arena redesign or new mechanic.

Additional sparks are capped at 24, each four short lines for 220–480ms. Existing effects remain capped at 64. One additional Phaser Graphics object renders feedback; no physics bodies, image filters, texture downloads or extra packets. Decorative overlays use pointer-events:none. Reduced-motion settings disable the new reveal/countdown animation. Volume settings live in existing collapsible lobby help, never in the gameplay footer or touch controls.

## Preservation and testing

`docs/milestone-9-preservation.json` locks exact bytes of all input, networking, simulation, arena, Outbreak, lobby/reconnect server, mobile CSS, index and Safari build adapter sources. Exact presentation adapter inverses preserve the entire previous main module, including normalized-input and visual-viewport/canvas/fullscreen/orientation code. Historical manifests/hashes are retained, not rebaselined. Main changes only import/instantiate the presentation UI, call it and replace the old phase sound dispatch; Courtyard adds a decorative renderer and leaves existing drawing/geometry intact.

Run `npm run build`, `npm test`, `node scripts/milestone-9-browser.cjs`, `npm run test:arenas`, `npm run test:lifecycle`, `npm run test:onboarding` and `node scripts/mobile-unsupported-browser.cjs`. WebKit: `node scripts/iphone-reliability-browser.cjs` (defaults to 180-second stress). Reports are in `docs/results/milestone-9-*.json`. Test-only body arrangement/short intros are isolated from public gameplay.

Browser testing verifies actual Web Audio node start/mute/cleanup and bounded concurrency, not subjective sound quality or actual hardware speakers. Chromium emulation and Linux WebKit are **not physical iPhone/Android certification**. Physical iPhone Safari remains a mandatory pre-submission release gate; diagnostic tools/instructions remain preserved. Physical Android retest, 6–8-player small-screen readability and Render Free cold-start risk remain outstanding.

## Acceptance playtest

1. Play both maps with 2, 4 and ideally 6–8 players. Verify approved movement/grapple/scoring still feels identical.
2. Turn Sound on before ready/start; adjust lobby volume. Compare normal and charged launch, missed tongue and successful attachment, sustained pull and impact. Ask whether the mix is informative rather than tiring.
3. Watch Patient Zero/countdown, infection grace and last survivor. Verify muted players can still understand everything, and nothing covers touch controls or hides important chase routes.
4. Complete a match and rematch; check survival+bonus breakdown, tied results and shared victory remain correct. Toggle mute during noisy gameplay and change tabs; no stale audio should replay.
5. Test smaller landscape screens and mixed desktop/touch rooms. Physical iPhone validation must still follow `docs/iphone-reliability-diagnostic.md`; do not call it resolved from automation.

Stop after deployment for human approval; no additional feature or milestone is authorized by this pass.
