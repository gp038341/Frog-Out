# Bright surroundings, announcements and Daisy correction

Baseline: `975710b3f805edf6f4250b4fa8d6ed217923790e`, preserved by `checkpoint/approved-creative-identity-redesign`.

## Diagnosis and changes

- The black-looking regions were explicit CSS plum fills, not a camera or simulation issue: page background, active-game shell and canvas container, results shell, full-viewport voting shadow, and dialog backdrops. Sky/mint print-stock gradients now surround home/lobby and gameplay; results have an apricot/rose backdrop with a mint highlight. Voting uses a translucent sky surround, settings a light teal veil. Existing paper panels, dark ink outlines, arena paintings and dimensions remain unchanged. Letterboxing is the canvas container background. The fixed gameplay main also left the body with no paint height; `min-height:100dvh` gives the backdrop a real paint area without changing the fixed canvas bounds. No Phaser scaling or camera changes were needed. Header/footer/HUD text colors were adjusted for contrast on these brighter surrounds. Small dark ink accents remain intentionally, rather than replacing every dark color indiscriminately.
- LAST SAFE inherited a pale-yellow state-specific color on the redesign's pale paper toast. Its exact existing `data-kind=last` toast now has cream-yellow text, a contrasting teal panel, and ink shadow. No toast event, wording, placement, animation or lifetime changes.
- A legacy `#phase-overlay .reveal-card` rule outranked the newer `.reveal-card`, leaving a dark panel but inherited black name. Explicit scoped styling now selects the paper panel and cream-yellow outlined name. Supporting text uses dark teal. Existing font sizing, overflow wrapping, animation and timing remain intact.
- The gameplay Daisy branch filled petals and center without drawing a stroke. SVG portraits already inherited the shared ink stroke. Only the gameplay Daisy branch adds closed 1.5px plum outlines to its five existing petals and center; coordinates, radii, colors, stem, attachment position and all other hats remain unchanged. It continues to inherit the normal frog transform for size, movement, gravity and sticky orientation.

## Validation

Full automated suite and production build; 70 voting layouts; actual local authoritative Poison Tag on four arenas at desktop/mobile landscape with a long player name, LAST SAFE event, Daisy cosmetics on coral/lagoon frogs, Tiny/Mega sizes; eight-frog CPU arena tour; results layouts and all three mode lifecycles. Tests use local-only test hooks, never public hosting. Physical-device acceptance remains the owner's playtest. No source changes to simulation, input, networking, AI, audio, scoring, arena geometry, modifier or lifecycle rules.

Deploy only to the existing production Free service. Do not recreate the removed preview service. Preserve all checkpoints and the experiment branch.
