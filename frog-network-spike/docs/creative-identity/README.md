# Frog-Out — Pond Press creative identity experiment

**Unapproved playtest candidate.** No gameplay redesign. Stop for the owner's decision.

The protected current build is `5da8bac60044643bdded2db7331052c56692ca4c`, checkpoint `checkpoint/pre-creative-identity-experiment`. Work belongs to `experiment/frog-out-creative-identity`. The owner has authorized an isolated temporary Free-plan Render service deploying only this experiment branch. Do not promote, merge, or fast-forward main and do not modify the production service. Production promotion requires separate future approval. The permanent original checkpoint never moves.

## Artistic direction

An unruly pond club, screen-printed by hand: plum ink, cream paper, chartreuse and coral accents, cut-paper scenery, spare etching, stout display lettering, splayed frog toes and a pink ribbon tongue. One visual grammar across home, portraits, arenas, voting and celebrations. No generic gradient/glow treatment or added particle clutter. See [art direction](art-direction.md).

## Main changes

- Home: large two-line poster headline, illustrated pond arch/reeds, a much larger live customized frog, and a perforated admission-ticket form. All create/join/edit/settings functions remain.
- Characters: inked bean silhouettes, suction toe pads, broader grins, cheek/nostril details and cream bellies. The same character grammar appears in gameplay and every SVG portrait, including results and CPUs. Every eye, hat and skin option remains. Poison spots/badge, frozen/freezer/tagger effects, local locator, charge indicator and hat anchors remain supported. Ordinary SAFE/NOT IT/RUNNER labels are omitted to reduce repeated world text; meaningful status and Chaos feedback remain.
- Sunny Pond: cut-paper clouds, sun, shore layers and cattail silhouettes; etched branches, faceted rocks and bright veined spring pads.
- Bubblewash Bathhouse: quiet lavender tile grid, arched sky window, brass plumbing, towel and water-ring scenery; warm porous sponges, porcelain, soap and metal ledges.
- Canopy Courtyard: layered garden canopy, seed/leaf garland and distant cabin silhouette; wood grain and warm cut-edge platforms.
- Croakwork Toyshop: pegboard, hanging tools, window and wind-up frog silhouette; etched blocks, threaded spools, rulers, toy roof, rubber cushions and paint.
- Lobby: eight fixed-size numbered club passes, recognizable CPU portraits, printed Ready/Start controls, an expanded paper-style editor and illustrated arena postcards. All authorization, capacity, replacement and Ready rules remain.
- Chaos: twenty original vector pictograms, printed challenge cards, a stamped countdown, existing colored voter footprints and full KEEP behavior. No modifier registry, eligibility, balance or voting code changes.
- Results/settings: inked plinths, champion rosette, paper score slips and consistent field-notice dialogs. Score counting, ranks/ties, podium order/timing, final-only confetti and applause are unchanged. Original full-window results sizing remains.
- Browser icon: bright pond-blue original frog/tongue SVG plus PNG fallback.

## Evidence

- [Home before/after](home-comparison.jpg)
- [All four arenas before/after](arena-comparison.jpg)
- [Voting and results before/after](ceremony-comparison.jpg)
- [Validation, reproduction and manual checklist](validation.md)
- [Precise rollback instructions](rollback.md)
- [Protected-source manifest](preservation.json)
- [Client frame samples](performance.json)
- [96 modifier/arena rendering cases](chaos-rendering.json)
- [30 result layouts and real multiplayer results](results-validation.json)
- [Desktop controls](desktop-controls.json), [mobile controls](mobile-controls.json), [WebKit](webkit-validation.json)

All protected gameplay/physics/AI/audio/network/input bytes match the original. The renderers use the exact authoritative geometry, including local filtered geometry for tilted/crumbling platforms. Added art is small original vector code; the only third-party visual asset is a 29,948-byte self-hosted OFL display font with license/source included. No production dependency or hosting-cost change.

Physical iPhone/Android acceptance remains for the owner. Automated Linux WebKit and Chromium touch emulation are reported separately from physical tests. Subjective art acceptance is not inferred from tests. Long names/editor controls and large tied result groups keep their existing scrolling. The current presentation can be restored exactly from the permanent checkpoint; no rollback is performed unless requested.

## Owner approval and production promotion

The owner has approved the creative direction and authorized promotion after four scoped adjustments and isolated preview validation. See [approved-adjustments.md](approved-adjustments.md) for scope, preservation, verification and checkpoint details. This newer authorization supersedes the original preview-only boundary above.
