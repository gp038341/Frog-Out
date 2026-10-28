# Visible Chaos and mobile layout correction

Previous deployed revision: `8be48283882dd2969678a9ee3110912096f48337`.
The approved performance/results checkpoint remains `checkpoint/approved-performance-results-update` at `e16379f6d91f7c081332bc3990dabfcc56a2fe72`.

## Corrections

- Active Chaos names remain visible in the existing top bar, above the arena. They replace the decorative logo during gameplay and share the row with connection status. No extra row is introduced and no modifier text overlays playable space. Voting and results retain their own approved modifier presentation. Round 1 still says Normal physics. KEEP and every modifier effect are unchanged.
- The touch shell previously reserved 92px for header, HUD, footer, gaps and padding. A shorter visible viewport with browser bars made the arena disproportionately small. Compact spacing reclaims 18px in the height-limited cases. Slightly narrower side lanes reclaim width in narrower windows. Visual-viewport anchoring, safe areas, the static FIT camera, world dimensions and all control touch ownership/geometry remain intact. Fullscreen is not required. Browser bars still consume real screen space and cannot safely be drawn behind.
- Results utility buttons now share one 32px, 11px-font, static footer treatment. This overrides both the home-screen floating Settings rule and How to Play's separate 44px minimum. Next Round and Rematch buttons are unchanged.

## Measurements

Actual Phaser canvas sizes, same seeded test setup and available viewport:

| Viewport | Before | After |
| --- | --- | --- |
| 844 x 390 | 529.8 x 298 | 561.8 x 316 |
| 844 x 300 (short browser viewport) | 369.8 x 208 | 401.8 x 226 |
| 667 x 375 | 460.3 x 258.9 | 483 x 271.7 |
| 667 x 285 (short browser viewport) | 343.1 x 193 | 375.1 x 211 |
| 568 x 320 | 372 x 209.3 | 384 x 216 |
| 1280 x 800 desktop | 1251.5 x 704 | 1251.5 x 704 |

These are Chromium-emulated viewport measurements, not physical iPhone Safari or Android hardware tests. Reduced viewport heights model the available space with browser chrome; they are not an emulation of native browser toolbars themselves.

## Validation

Full automated suite and production build. Six real CPU-match layout scenarios check visible modifier names outside the arena, no shrinking versus baseline, and stable arena bounds after How to Play opens/closes. Twenty-five podium fixtures use actual footer IDs and mobile touch-layout classes (the earlier generic-button fixture missed the conflicting selectors), including ties, long names, large scores and compact landscape. Existing iPhone- and Android-user-agent multitouch browser scenarios verify simultaneous move/action input, independent release and cancellation. Only four runtime display/layout adapters change; a manifest hashes all other runtime sources and assets.

Rollback through a new commit restoring the four presentation files from the previous revision. Do not reset or force-push. Stop after deployment for user playtest.
