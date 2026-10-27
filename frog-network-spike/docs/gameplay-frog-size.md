# Restore gameplay frog display size

Owner-requested correction; candidate for playtest.

Baseline: `46acfe703bcc00b1bcb2d718373b4492d8c1480a`.
Checkpoint: `checkpoint/pre-gameplay-frog-size-restoration`.

The rounded portrait conversion retained nominal body width but reduced visible head-to-toe height. This change uniformly scales only gameplay body artwork, selected patterns, flanks and hats. It leaves the original rounded portrait shapes/proportions, editor/lobby/results images, hitboxes, physics, camera, controls and gameplay data untouched.

The pre-conversion neutral artwork had eye top `-1.14r` and toe bottom `.78r + 4.1`, giving 30.02 render pixels of height at the unchanged base render radius 13.5. The original portrait's outlined head/toe extent is y=21.5..92.75, or 24.98377 render pixels before this correction. The uniform artwork scale is `(1.92r + 4.1) / (71.25r / 38.5)` (about 1.20158). A small upward offset aligns the toe line with its former position. This restores previous neutral visible height and ground alignment without distorting the rounded design. The wider rounded proportions are retained; this is not a collision-size increase.

The existing outer size/balloon and gravity/sticky transforms still apply normally. Charge squash, gait and other animations remain. Ground shadow, local/poison effects, starting badge and charge ring retain their existing tuning and positions.

Verification: 523 tests and production build pass, including bounds measured from the actual renderer, Tiny/Mega scaling, and protected-source hashes. Browser coverage uses desktop and mobile landscape with all four arenas. Physical-phone testing remains the owner's.
