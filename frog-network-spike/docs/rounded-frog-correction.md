# Restore the original rounded frog

Candidate correction for owner playtest; not marked approved.

Baseline: `7b29adedbc66435e894cb4c1695cd519f37a595d`.
Pre-change checkpoint: `checkpoint/pre-rounded-frog-correction`.
Original artwork source: `checkpoint/pre-independent-frog-patterns` (`e79275273af4c648b2402facac8354ce8d2bb58a`), also recorded verbatim in the earlier cosmetic-options preservation manifest.

The previous customization change unified in the wrong direction: it replaced the curved lobby portrait with gameplay's ten-point bean polygon, and placed that smaller illustration in the original portrait frame. The owner requested retaining the original lobby physical design and bringing that design into gameplay.

The original quadratic body, feet, round eye positions, smile, open mouth, nose, blush and toe geometry now supply the shared frog. The portrait keeps its original 120×100 frame, coordinate positions and 77-unit body width, rather than a shrunken gameplay drawing. A transparent overflow margin lets raised hat tips remain visible without shrinking the frog or changing responsive layout dimensions. Existing old hat silhouettes are seated above the original eyes; mushroom and party hats remain raised. The new color/design separation, eight expressions, ten hat choices, saved appearances and delayed-echo protections remain.

`portrait-geometry.ts` copies the original body and foot paths exactly. SVG portraits draw those paths directly. Phaser receives cached, finely sampled quadratic/cubic curves (24 segments per curve), mapped into the existing render radius. There is no new physics system, dependency, external asset, or client/server protocol. Game-specific squash/gait, size modifiers, rotation, offline appearance and status effects remain in their existing renderer. Hitboxes, frog radius, scale modifiers, camera, inputs, game rules, CPU AI and network/server sources are unchanged.

Validation covers the exact original source paths, original preview dimensions, smooth gameplay contours, shared identity across expressions/hats, protected gameplay bytes, the existing complete test suite, desktop/mobile landscape UI, multiplayer cosmetic synchronization and all four arenas. Phone layouts use browser emulation, not physical-device certification.
