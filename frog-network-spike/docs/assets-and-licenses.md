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
