# Validation and scope

- Full suite: 505 tests, zero failures. Production TypeScript/Vite/server build passes; existing large Phaser chunk warning remains.
- New focused tests: exact protected-source hashes; original HTML element IDs/semantics; all collision silhouettes and filtered local platform art across four arenas; every cosmetic combination; all 20 original modifier glyphs; local asset/font licensing and reduced-motion treatment.
- Desktop/mobile browser tour: home, editor, settings, eight lobby seats, all four arenas, static aspect and no horizontal overflow. Seven CPU participants in every arena. Both Chromium and native Linux Playwright WebKit 26.0 passed with no page errors.
- Results: 30 desktop/laptop/small-landscape component cases including 2/8 frogs, ties, all-player ties and reduced motion. Real two-browser Poison/Freeze/Classic matches, voting, exact authoritative score endpoints, round/final separation, staggered podium reveal, one applause cue and rematch. Full-window results layout restored after an early QA sizing failure.
- Desktop controls: real mouse and keyboard events, mouse/Space priority, simultaneous held sources, charged jump, terrain grapple/reel, releases outside canvas, settings/focus interruption, resizing/fullscreen, all three modes. Classic tag feedback does not resize the canvas.
- Mobile: actual Chromium CDP touch sequences with iPhone Safari/Android Chrome user agents: arbitrary-angle analog input, floating controls, independent release in both orders, hold/movement, cancel/repeat, synthetic mouse ignored, settings access. This is not physical iPhone/Android validation.
- Modifier art: eight participants on all four arenas with each of the 20 authoritative modifiers and representative stacks. The harness checks the actual compatibility filter; Gravity Flip + Bubble Trouble remains rejected as approved. No compatibility changes were made.
- Eight-frog client frame samples: median ~16.7ms before/after on desktop and mobile-sized Chromium, p95 ~16.7–16.8ms. Software-graphics local samples, not controlled physical-hardware benchmarks. Existing server/AI code is byte-identical.
- Added assets: original small SVG illustrations, 64px PNG favicon, one 29,948-byte self-hosted OFL display font. No new runtime dependency, paid service, external font request or image-heavy background system.

## Reproduce

`npm test` and `npm run build`.

`node scripts/creative-identity-browser.cjs` (set CREATIVE_OUT for screenshots; set CREATIVE_ENGINE=webkit when a supported WebKit runtime/dependencies are installed).

`node scripts/creative-identity-results.cjs` (set CREATIVE_OUT to a writable existing folder).

`node --import tsx scripts/creative-identity-chaos.cjs`.

`node scripts/creative-identity-mobile.cjs` and `node scripts/creative-identity-mouse.cjs`.

For a before/after rendering sample, build the saved checkpoint separately, provide its `dist` directory as CREATIVE_BASELINE_DIST, then run `node scripts/creative-identity-performance.cjs`.

All harnesses start local test servers, use existing test-only hooks and stop their servers in cleanup. None enables test hooks on Render.

## Manual acceptance

1. Compare the poster-style home and your customized frog. Try every expression/hat, then edit a CPU in the lobby; verify eight seats stay equally sized.
2. Play each arena with 2 and 8 frogs. Check surface edges, underside grabs, poison/freeze/tagger readability, charge ring and local locator.
3. Try Tilt-a-Frog and Crumble Time; confirm rotating/cracking artwork follows the platform and materials still work. Try Tiny/Mega, bubbles, gravity and Sticky Frogs.
4. Vote and KEEP a modifier. Check the 20 new illustrations and colored voter footprints, especially on mobile landscape.
5. Review round scores and final podium: score count, rank arrows, winner-last reveal, ties, confetti and applause should behave as before.
6. On your physical iPhone/Android, test both floating controls simultaneously, independent thumb releases, settings, browser bars and landscape fitting. Automated Linux WebKit is not a substitute for this physical test.

Known limits: this is an unapproved artistic experiment. Physical device acceptance and subjective art preferences remain with the owner. Very long lobby names/CPU editors and large tied result groups retain their existing internal scrolling. Non-Latin text falls back to the system body font. The archived original renderers remain in Git; the new path uses a common geometry-fed renderer.
