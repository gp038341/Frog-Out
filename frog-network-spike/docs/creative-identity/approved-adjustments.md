# Approved creative identity — four requested adjustments

The owner approved Pond Press after public playtesting on `experiment/frog-out-creative-identity` at `a594a2fc7fadae9e7ffe905e6a0f16d118659959`, and authorized promotion only after these four adjustments pass on the isolated preview.

## Changes

1. **Voting fit:** the previous fixed panel capped its height at viewport minus 92px (70px in landscape), while the print treatment imposed a 186px card minimum plus a separate large heading, timer, KEEP notice, round readout and footer. These independent minimums overflowed short screens. The scoped voting layout now shares a compact heading/timer row, uses content-sized cards, reduces decorative icon/stamp spacing at short heights, and accounts for safe areas. Text and controls remain visible; scrolling remains an emergency fallback for unusual accessibility zoom rather than clipping content. KEEP semantics, vote validation, colored frog footprints and the conveyor are unchanged.
2. **Match colors:** new `GAME_PALETTES` brighten the four match backgrounds, foliage, wood, stone, water and special surfaces. `PRINT_PALETTES` remain unchanged for approved lobby postcards. Exact platform polygons and all drawing shapes remain unchanged. Frogs use the exact selected catalog body colors, with a smaller white belly tint in place of the heavy cream wash; artwork, cosmetics, status marks, dimensions and hitboxes remain unchanged.
3. **Original favicon:** the existing `frog-out-icon.svg` and `.png` were verified byte-for-byte against the protected original archive. The page now references these exact assets with a fresh version query, avoiding cached Pond Press icons. No original asset was redrawn or deleted.
4. **Countdown:** pale yellow `#fff7b0`, dark plum 2px outline and contrasting offset shadow replace plain black digits. Existing timing and pop animation remain unchanged.

## Preservation and promotion

- Original production and immutable checkpoint: `checkpoint/pre-creative-identity-experiment` → `5da8bac60044643bdded2db7331052c56692ca4c`.
- Adjustments stay on the experiment branch until the isolated preview is verified.
- The approved tested candidate is checkpointed as `checkpoint/approved-creative-identity-redesign`.
- Promotion fast-forwards `main` to that exact tested commit with an expected-head lease and no force. The candidate descends from the original production commit.
- Existing production service `srv-db5a1arrjlhs73cul7ng`, URL, Free plan, branch and commands remain unchanged.
- Existing preview service `srv-dbfq158ae00c739k6jg0` is retained. Both processes own separate rooms, CPUs and WebSocket state.
- Earlier checkpoints and the full experiment history are retained. No gameplay, AI, audio, networking, input, arena geometry, scoring or modifier source changes are authorized or included.

## Verification

The full automated suite and production build, exact protected-source hashes, actual authoritative multiplayer/CPU matches, mouse/keyboard checks, Chromium multitouch regression, real Linux WebKit rendering, and results ceremonies are checked before promotion. `scripts/creative-adjustments-browser.cjs` exercises 70 voting layouts per engine: all 20 modifier cards, KEEP/reveal, eight footprints, five desktop/mobile landscape viewports down to 568×320; it asserts no clipped buttons or panel/page scrolling. These are automated browser checks, not a claim of physical iPhone testing.

See `rollback.md` for the exact original SHA and non-destructive restoration procedure. Public deployed SHAs and terminal deploy status are recorded in the handoff after verification.
