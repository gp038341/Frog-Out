# Current audio additions

The current round-audio revision uses two self-hosted recordings with verified redistribution licenses. Earlier milestone asset inventories below remain historical descriptions.

- `public/audio/heroic-age.mp3`: **Heroic Age**, by **Kevin MacLeod** ([Incompetech](https://incompetech.com/)), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Edited and looped for Frog-Out: 32-bar, 129 BPM excerpt with an 80ms cyclic seam crossfade; loudness-managed mono MP3. Permanent linked attribution appears in Settings.
- `public/audio/audience-applause.mp3`: **Small applause**, by **Breviceps**, [Freesound 462362](https://freesound.org/people/Breviceps/sounds/462362/). Author-published CC0; real applause from roughly 30 people. Edited to 4.4 seconds, lowered loudness and gentle endpoint fades.

See `public/audio/credits.json` for direct sources, licenses, exact edits and checksums. No runtime third-party requests, accounts or paid services. The generated lobby composition remains unchanged. Prior synthetic gameplay/applause candidates are not used by the live playback path.

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

## Background music — Reedwater

Reedwater is an original Frog-Out modal/minor theme in two synchronized arrangements (Chill and Adventure), replacing the previous Pondside Pandemonium candidate. Composition and string/reed/bass/percussion synthesis are project-native code in `src/presentation/music-score.ts`, rendered locally by `music-worker.ts`. No external melody, recording, sample, dependency, paid service or third-party licensing obligation. Source and generated audio are original project assets for redistribution with the game. Approved sound effects are unchanged. See `docs/background-music.md` for controls and validation.

## Current gameplay music replacement (2026-10-26)

“Run Amok” by Kevin MacLeod (https://incompetech.com/), licensed under Creative Commons Attribution 4.0 (https://creativecommons.org/licenses/by/4.0/). Official catalog: https://incompetech.com/music/royalty-free/pieces.json, ISRC USUAN1400024. Original 148 BPM, strings/brass/woodwinds/percussion, described by its composer as comic action. Edited to a 32-bar cyclic excerpt, normalized and encoded locally. Attribution and edit notice are visible in Settings at all times. Provenance and checksums: `public/audio/credits.json`. This replaces Youthful Elf Seeking Adventure only; lobby music and recorded audience applause remain unchanged. Historical sections below/above describe earlier candidates, not the active gameplay recording.

## Owner-selected Heroic Age (2026-10-26)

The user selected Heroic Age after rejecting the comic Run Amok candidate. Heroic Age by Kevin MacLeod (https://incompetech.com/), CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/), ISRC USUAN1100848. 32-bar loop, original 129 BPM, normalized, resampled, MP3 encoded with a short cyclic seam crossfade. Linked attribution and edit notice remain visible in Settings. The Run Amok section describes a superseded candidate.
