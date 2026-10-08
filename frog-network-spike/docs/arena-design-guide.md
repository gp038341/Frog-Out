# Theme-driven arena design

## Approved checkpoint

Milestone 13 accepted by the designer after playtesting. Gameplay revision: `9190495614ee195cd4357e3468b4dde079b84475`. Git checkpoint: `checkpoint/approved-milestone-13-sunny-pond`. Render service: `frog-out-milestone-2`; deployment `dep-db3pg68m7kps73fjiheg` live at that revision. Public URL: https://frog-out-milestone-2.onrender.com/ . Verified GitHub main and Render synchronized on 2026-10-08. Existing staged canonical files match tree `47acc0ae469764e8ad2b7acd38270fad514c1058`; no unstaged tracked delta before this documentation pass.

Milestone 14 is concepts/documentation only. No arena, surface, input, physics, networking or art implementation is authorized yet. Keep all three accepted arenas unchanged.

## Seven design rules

1. Start with a memorable place and one traversal idea. Describe both in a sentence before drawing platforms.
2. Make platforms recognizable objects with distinctive silhouettes. Collision outlines must match artwork; use simple convex pieces and keep decorations visibly non-solid.
3. Teach surface behavior through material, marking and feedback. Bounce surfaces look elastic and carry spring chevrons; slowing surfaces look sticky and patterned. Color or sound alone is insufficient.
4. Design for the accepted tongue reach, jump arcs and momentum. Give ceilings, undersides and edges useful attachment angles. Never retune frogs to rescue a map.
5. Give important perches at least two practical approaches/exits. Include interception routes, ordinary ground and open swing space. Special surfaces are optional opportunities, not mandatory punishment.
6. Check 2/4/6/8-player spacing in the static view and phone landscape. Preserve frog/poison/tongue contrast; avoid overlapping silhouettes and decorated camping pockets.
7. Keep Frog-Out cohesive: playful original objects, clear dark solid outlines, restrained background contrast, vivid but limited palettes, short lightweight feedback. One strong visual joke is enough.

## Development order

Concept approval -> greybox silhouettes/physics -> 2–8-player desktop/mobile playtest -> surface tuning -> themed art/preview -> regressions -> human acceptance. Keep ordinary surfaces dominant. Reuse shared authoritative lily/mud effects when they fit; new behavior requires explicit selection and localized tests. No moving hazards/random effects, dynamic camera or input/viewport rewrite. Keep easy Git rollback points.

## Three proposals — none implemented

### A. Croakwork Toyshop — recommended

A tiny frog repair workshop inside an oversized toy box. Warm apricot light, dusty blue backdrop, mint rubber and coral paint; dark teal outlines. Toy-block stacks, broad rounded spools, tapered ruler bridges and a small toy-house roof provide recognizable static solids. Non-solid wind-up toy decorations stay quiet in the background.

Possible surfaces: springy rubber cushions reuse lily auto-bounce; small sticky paint smears reuse mud slowing. Neither adds new simulation behavior. Ordinary wooden routes remain dominant.

Geometry: two offset block staircases, a diagonal middle crossing and generous ceiling clearance. Spools create alternate underside grapple angles; rubber shortcuts launch across the diagonal, while paint is an optional low-route tradeoff. This is asymmetric zigzag pursuit/interception rather than Pond's open symmetric launch layout or Conservatory's edge-tier climbing.

Complexity: low–medium. Main work is new static convex silhouettes, art and route playtesting. Risks: block corners snagging tongues, toy-house shelter becoming a camping pocket, repeated bounce shortcuts becoming dominant. Use chamfered edges, no enclosed hiding interiors, and ordinary bypasses.

### B. Bubblewash Bathhouse

A cheerful miniature communal frog washroom: lavender tile, turquoise bathwater scenery, melon accents and warm brass. Static sponge islands, a rounded soap dish, broad faucet ledges and a tipped bucket rim create a recognizable bathroom playground. Water/bubbles are decorative.

Possible surfaces: springy sponges reuse lily bouncing; optionally one clearly marked soapy patch reduces contact friction. Soap is a new localized surface proposal, not a global acceleration/speed change; it needs separate approval and careful momentum/contact tests. A simpler first version can omit soap and use bounce alone.

Geometry: broad low basin routes, separated high faucet perches and long cross-basin swings. Different from the original maps through low sweeps and rounded edge approaches rather than stacked rectangular tiers.

Complexity: medium, medium–high if soap is selected. Risks: slipperiness undermining responsive control, bowl-like shapes trapping frogs, bubbles hiding tongues. Use shallow open silhouettes, two exits per perch and very sparse background bubbles.

### C. Teacup Tangle

An oversized picnic tea service seen at frog scale: sky blue, terracotta, buttery yellow and leafy green. Shallow saucers, angled teaspoons, broad cup-rim bridges and biscuit stepping stones. Cups have simplified open silhouettes rather than deep playable cavities. One mischievous background frog lounges in a decorative sugar bowl.

Possible surfaces: a springy rubber picnic mat reuses lily bouncing; optional small honey smears reuse mud slowing. No falling dishes, hot-tea damage or liquid effects.

Geometry: two broad cup-rim routes joined by offset spoon ramps and an open central swing gap; lower biscuit crossings provide interception. Emphasizes sloped running and lateral launch choices rather than Pond's paired spring platforms or Conservatory's vertical ladders.

Complexity: medium. Risks: curved cup silhouettes not matching collision, rim camping, sloped movement changing perceived feel. Use simple convex fixtures, shallow slopes tested against approved ground detection, and multiple approach angles. Keep rim interiors non-playable or completely open rather than hidden traps.

## Recommendation

Choose Croakwork Toyshop. It adds the clearest new place and asymmetric pursuit geometry while reusing both tested authoritative surface effects. Bathhouse offers the strongest alternative mood, but a slippery surface adds testing risk. Teacup Tangle offers approachable traversal variety, though cup rims and slopes need more geometry validation. No implementation until the designer selects a concept.
