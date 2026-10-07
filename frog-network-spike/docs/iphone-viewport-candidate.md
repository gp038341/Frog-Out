# iPhone Safari viewport stabilization — physical acceptance candidate

## Status/checkpoint

Known-good simultaneous iPhone multitouch was **physically validated by the user** at `eb7bfd5a58b134af428794bcbc10311c99fefa84`. Branch `checkpoint/iphone-multitouch-physically-validated` preserves that exact revision. Earlier reports describing multitouch as unverified are historical and superseded by this physical result.

This candidate changes only touch-game layout/sizing and diagnostic reporting. **Physical iPhone viewport acceptance remains a mandatory pre-submission gate.** No iPhone was available to the developer. Do not begin further features or compatibility iterations until the user returns physical results.

## Diagnosis and smallest correction

The previous `resizeGame()` measured the stage's flowing top position and footer height and subtracted both from the visible height. Header/HUD wrapping or inflated text therefore directly reduced the Phaser parent height. `ResizeObserver` and periodic refresh propagated that change into FIT scaling. That dependency is confirmed in source and reproduced with forced larger text.

The document lacked an explicit text-size-adjust setting. iOS Safari text inflation is a plausible cause of the reported sudden text growth; without a physical trace, it is **not confirmed to be the sole trigger**. Browser chrome/orientation changes alter the usable viewport independently. Linux WebKit does not expose iOS mobile text inflation and cannot establish the physical event sequence.

Changes:
- `html` uses `-webkit-text-size-adjust:100%;text-size-adjust:100%` to preserve intended CSS text size without globally disabling page zoom or accessibility controls.
- Touch-only active-game root uses the existing visual viewport rectangle and safe-area insets, with fixed 22px branding, 34px HUD, and 36px toolbar bands (64px toolbar below 700px usable width to allow two rows). HUD/notice/infection feedback are overlays or bounded bands; incidental text growth cannot change arena-parent geometry.
- Touch stage no longer receives a height computed from text/footer measurements. Desktop's prior calculation is retained exactly.
- HUD labels use predictable no-wrap/ellipsis bounds. Timer retains its existing font size, with sufficient line height and separation from round context.
- Existing VisualViewport resize/scroll, usable-rectangle offsets, synchronous interruption neutralization, rAF coalescing and parent-bound refresh are retained. No new debounce, periodic input reset or fullscreen requirement.
- Diagnostic export/monitor additionally show CSS canvas size, fixed backing size, parent/session/footer rectangles, DPR, orientation, font/adjustment and last resize event/age.

Unchanged: viewport meta (`width=device-width,initial-scale=1,viewport-fit=cover`), 1200×675 Phaser logical/backing size, FIT aspect ratio, DPR handling, camera/world/frog sizes, all touch identifiers/capture/cancellation/gesture policy, normalized input, desktop controls, physics, networking, scoring, arena geometry/art and sound. `iphone-viewport-preservation.json` and tests independently check protected sources and reverse only the documented main/CSS exceptions to the physically validated baseline.

Normal Safari must work with browser chrome present. If usable height actually changes, the same arena fits that new rectangle; the fix prevents **text-driven** shrink/reflow, not every physically necessary scale change. Fullscreen remains capability-based enhancement. Narrow screens retain side control strips and some aspect-ratio letterboxing. Long HUD text can ellipsize; it cannot steal space from the arena.

## Evidence and limitations

See `docs/results/iphone-viewport-*` for new reports. Historical evidence is preserved. These are local real authoritative servers/WebSockets with desktop/mobile-size browser contexts, synthetic multi-finger/cancel/gesture/toolbar fixtures and some trusted browser touch actions. They are **not physical Android or iPhone certification**.

Sources: Apple Safari Web Content Guide, Adjusting the Text Size (archival) and CSSWG CSS Mobile Text Size Adjustment Module Level 1. They document automatic inflation and percentage adjustment; neither establishes this tester's physical root cause.

## Physical iPhone test procedure

1. Open the public URL in ordinary Safari, refresh once to load this revision, keep fullscreen optional/unavailable, and rotate landscape. Join a second device and start a match. Record iPhone model, iOS/Safari version and display/text accessibility settings.
2. With Input monitor **off**, check initial game fit and readable HUD with Safari toolbars expanded. Reveal/collapse the bars repeatedly, rotate portrait→landscape, and return from another tab. Expect no page scroll or text-driven canvas shrink, no clipped important controls, and usable safe-area spacing. A real reduction in usable height can resize the arena proportionately.
3. Hold movement + tap jump repeatedly; hold/release a charge; aim/fire/hold/release a grapple; change direction while action is held; lift either thumb independently. Play several rounds for at least five minutes. Working simultaneous multitouch must remain intact.
4. Enable **Input monitor**, or open the URL with `?diagnostics=1`. Note layout vs visual dimensions/offset/zoom, DPR/orientation, canvas CSS/backing, parent dimensions, HUD font/adjustment and last resize age. The monitor does not intercept input or affect game layout, but obscures part of the scene, so disable it for normal fit assessment.
5. If text grows or the arena shrinks unexpectedly, record a video/screenshot before and after with the monitor visible. Capture whether the visual viewport or zoom changed. Use **Diagnostics** promptly to download JSON; send it with video, model/OS, toolbar/orientation state and what was touched. Do not refresh before collecting evidence.
6. Confirm the same frog/input recovers after orientation/tab return and that sounds, desktop/Android peers, lobby, results and rematch remain normal. Stop and report any regression; no next milestone is authorized.

## Regression record

Production build and 77 unit/preservation tests pass. Chromium mixed desktop/iPhone-size/Android-size/tablet suite passes 15 checks with zero page errors, including reciprocal frog pulling, charge/release, orientation, reconnect, diagnostics, full four-player Outbreak and phone-only matches. Focused hybrid suite passes 16 checks, including 15 input-method switching cycles and a 10-second two-thumb hold; long loops were disabled in that runner. Both arenas pass 2/3/4/8-client authoritative match/selection/reconnect checks. Lifecycle passes 16 checks including actual 30-second expiry. Outbreak passes body-only infection, grace, simultaneous ties, scores/rotation/round/final/rematch and disconnected-frog infection.

Important runner caveats and earlier failed assertions are retained in `iphone-viewport-validation.json`; no product input or physics changes were made to address those assertions. Read the final WebKit report for exact stress duration/cycle count. All previous reports remain preserved.
