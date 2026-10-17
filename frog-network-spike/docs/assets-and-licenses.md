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

### Chaos Voting D
Bumper stars, balloon shell/core, swap rings and translucent bubbles are original procedural Canvas/Phaser graphics implemented in the repository. No external assets added. D reuses the approved original jump/impact/build/attach/miss synth palette; no recordings, music, paid services or additional licensing obligations.

### Chaos E
Gravity arrows/countdown, warning pulse and Pogo foot bursts are original code-native graphics. Reuse approved original count/go/jump audio cues; no new external assets, fonts, recordings, dependencies or paid resources.

Lobby visual candidate: original code-drawn Chaos badge, frog-foot vote stamps and Frog-Out SVG/PNG favicon created in this repository. No external artwork, fonts or paid assets. Original hero frog and all approved arena/gameplay art retained.
## Sound coverage refinement

Countdown, poison poof, ice/rescue, magnet, gust, rubber boing, teleport, bubble, suction, crumble and ball-impact cues are original Web Audio synthesis in `src/presentation/audio.ts`. Short filtered-noise bursts use a locally generated seeded buffer, not an external recording. No downloaded samples, external assets, new dependencies or license obligations. Existing approved sounds remain in use.

## Background music — Pondside Pandemonium

Original Frog-Out composition and synthesis in `src/presentation/music-score.ts`, generated locally by `music-worker.ts`: 16 bars, 116 BPM, mallet melody, bass, chords and percussion. No external recordings, samples, melodies, assets, dependencies or music services. Source and generated audio are original project assets permitted for redistribution with the game. Existing approved sound effects remain unchanged. See `docs/background-music.md` for controls and validation.
