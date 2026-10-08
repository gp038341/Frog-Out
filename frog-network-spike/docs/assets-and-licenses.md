# Milestone 6 assets and rights

All newly added art and audio are original project source, generated procedurally for Frog-Out. No external game assets, stock artwork, samples, font downloads or paid services were introduced.

| Asset | Source | Rights / dependencies |
| --- | --- | --- |
| Frog bodies, markings, eyes, feet, state indicators and reactions | src/presentation/courtyard.ts | Original vector drawing in project code |
| Courtyard wood/moss solids, pond/foliage background | src/presentation/courtyard.ts + simulation/arena.ts | Original procedural drawing; collision silhouettes use physics rectangles |
| Pink tongue/slack/tension and capped particles | src/presentation/courtyard.ts | Original procedural drawing |
| Home frog illustration | Inline SVG in index.html | Original project SVG |
| UI theme, layout, countdown/results transition | src/presentation/theme.css | Original project CSS |
| Jump/grapple/infection/countdown/UI sound cues | src/presentation/audio.ts | Original oscillator synthesis; no recordings or samples |
| Typography | Trebuchet MS / system-ui / monospace fallback | Uses device-installed fonts; no font binaries distributed |

Existing dependencies remain under their upstream licenses (Phaser MIT, Planck MIT, Colyseus MIT); no dependency was added for presentation. Browser screenshots in docs/results are generated test evidence, not imported gameplay assets.

## Milestone 9 audio and feedback

All additional cues (pond percussion, charge tiers, tongue miss/tension, impacts, transformation, reveal/last survivor and short round/victory calls) are original oscillator synthesis in `src/presentation/audio.ts`; no external samples or music. Feedback in `feel.ts`, `feel.css` and `presentation-ui.ts` is original project drawing/CSS/text. No new third-party assets or dependencies. See `docs/milestone-9.md` for scope, mix limits and acceptance instructions.

## Milestone 13 Sunny Pond prototype

`src/presentation/sunny-pond.ts` and the Sunny Pond vector thumbnail are original project-native drawing code: sunshine, clouds, reeds, decorative water, logs, leaf veins, lily spring chevrons and mud flecks. No external textures, recordings, images, fonts or new dependencies. Lily landing feedback reuses the approved `charge` sound cue; the sound palette/source is unchanged.

## Milestone 14 Croakwork Toyshop

`src/presentation/toyshop.ts` and its SVG map preview are original project-native vector art: wooden blocks, ruler markings, thread spools, toy-house roof, rubber cushions, paint patches and quiet pegboard/workbench scenery. No external assets, audio changes or new dependencies; existing approved surface feedback is reused.

## Bubblewash Bathhouse roster revision

`src/presentation/bathhouse.ts` and the shared-geometry SVG preview are original project-native vector drawing code. No external images/textures/audio, fonts or new dependencies. Sponge effects reuse approved lily sound/feedback unchanged.
