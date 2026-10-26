# Pond Press — one visual experiment

Protected baseline: `5da8bac60044643bdded2db7331052c56692ca4c`.
Permanent checkpoint: `checkpoint/pre-creative-identity-experiment`.
Development branch: `experiment/frog-out-creative-identity`.

## Diagnosis

The existing screens mix softly rounded teal application cards, pastel diagram-like arenas, gradient modifier cards and small circular frog illustrations. They work well, but lack a common expressive drawing language. Menu characters are small; blank background competes with the game; four attractive themes do not yet share a recognizable graphic signature.

## Direction: an unruly pond club, printed by hand

Pond Press uses original screen-print and cut-paper-inspired cartoon illustration: confident plum ink, warm cream highlights, exaggerated bean-shaped frogs, splayed suction toes, a pink ribbon tongue, limited flat colors, crisp silhouettes, sparse halftone and etched hatching. No raster filters, runtime third-party requests, image libraries, or heavy textures. One small self-hosted OFL display font is the only third-party visual asset. The art is code-native vector work, not a borrowed game style.

Display typography is Pond Press Display, a Latin-subset WOFF derivative of Vernon Adams’ Bowlby One SC, renamed in accordance with the reserved-name clause (with Impact / Arial Black / system sans fallback) with oversized headlines and short labels. Body text stays a readable system sans. Buttons are stout printed tabs; panels resemble die-cut notices and field-club placards. Texture stays subtle and behind text. The home screen is an illustrated poster; the lobby is an eight-seat club roster; voting is a sheet of mischievous printed challenge cards; results are a winner's rosette and illustrated award plinths. All belong to the same club.

Palette: plum #292431; cream #fff1ce; chartreuse #c3db55; coral #ef785f; rose #d86891; pond blue #80b9cb. Arena backgrounds use quieter values; outlined collision surfaces remain dominant. Each arena keeps its setting: pond and reeds; tiled bathhouse with arched window; layered canopy garden; oversized workshop. Background storytelling is visibly quieter than solid terrain.

Frog customization uses the same illustrated face/body grammar in SVG portraits and Phaser gameplay. All catalog IDs, selectable expressions and hats remain. Poison spots/badge, freezer/ice effects, tagger markers, local labels, charge ring and all Chaos effects remain recognizable. Character artwork stays inside the existing scale envelope; collision geometry never changes.

## Animation and accessibility

Use short, restrained print-stamp entrances on interactions, existing score/podium timing and confetti, small visual foot motion and body squash. No camera movement, flashes or screen shake. Reduced-motion disables decorative UI animation. Preserve focus rings, labels, disabled/selected states, readable controls, safe areas, touch hit regions and the accepted viewport shell.

## Safety

All server, simulation, bots, game rules, modifier tuning, audio, input, networking and lifecycle source stays byte-identical. Existing dynamic platform rendering must use the same new artwork for static, tilted and crumbling geometry, with filters and local contact positions preserved. Original assets remain in the immutable Git checkpoint and a full exact-tree local archive. No existing checkpoint is moved or deleted.
