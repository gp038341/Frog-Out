# Results fanfare, adventure music and cosmetic clarity — playtest candidate

Baseline: `c0e21c3186f75fca73b9fd615f980421a964dbf6`.
Pre-change checkpoint: `checkpoint/pre-results-audio-cosmetic-refinement`.

## Requested changes

- A new original 1.23-second victory fanfare plays once when the last/winning podium frog is revealed. Reduced-motion users hear it when final standings appear. The older raw-phase victory playback is suppressed to avoid duplicate or late playback. Sound Off, zero effects volume and hidden tabs continue suppressing effects. Ordinary round sounds and podium timing remain unchanged.
- The active-game Reedwater arrangement now has a fuller brass-like melody, rhythmic chord stabs, sixteenth-note string accents and stronger kick/snare/tom percussion. The lobby waveform remains exactly identical to the approved version. Both arrangements retain the same duration, key material and synchronized clock, with the existing crossfade, volume and master Sound behavior. Original synthesized composition only; no external music, samples, licensing obligations or network services.
- Mushroom cap: domed spotted cap, pale underside and short stem. Propeller beanie: curved multicolor panels, lower band, mast, hub and two gently animated blades. Party cone: taller cone, contrasting ribbon, brim and pom-pom. These designs appear in both SVG portraits and actual Phaser artwork.
- All cosmetic hats sit closer to the forehead. Gameplay attachment moves from `y - r - 5` to `y - 0.86r`; portraits use correspondingly lower seats. Nothing changes collision bodies, cosmetics IDs, ownership, state indicators or physics.
- Sleepy portraits have skin-colored closed lids with clear curved eyelid lines; Mischievous has a similarly visible wink. The already approved in-game expression renderer is byte-identical. Home, editor, lobby seats, CPU portraits, voting/results portraits share the same preview renderer.

## Validation and limitations

The preservation manifest protects every unrelated runtime source, including all server/CPU/game-mode/Chaos/arena/input/settings/music-playback systems. Tests also pin the original lobby PCM exactly and keep in-game eye rendering exact.

The new game arrangement has RMS 0.0803 versus the previous 0.0688 and lobby 0.0401; peak 0.399, with bounded output. This quantifies contrast, not whether the owner will prefer its musical feel. Music remains procedurally synthesized, not recorded orchestral audio.

486 automated tests and the production build pass. The existing large Phaser bundle warning remains.

Visual inspection covers 18 expression/hat portraits and six hats drawn through the actual Phaser renderer. Desktop and landscape mobile-sized results checks cover reduced motion, tied winners, sequential reveals, exact scores and no duplicate victory callbacks. Thirty desktop/mobile-sized results cases pass, including exactly one celebration callback. Complete real two-client Poison, Freeze and Classic matches verify actual Web Audio fanfare note scheduling and no repeat on returning to the lobby. Real home/editor/lobby previews and music preference persistence pass in desktop and mobile-landscape Chromium. Public deployment verification is reported at handoff. Physical iPhone audio and personal aesthetic acceptance remain with the owner.

## Owner playtest

1. Enable Sound; compare the home/lobby music with an active round. Confirm the difference remains comfortable at your saved volume.
2. Complete a match: the winner's reveal should have a celebratory fanfare, with no repeat on returning to the lobby. Verify Sound Off suppresses it.
3. Inspect mushroom, propeller and party hats in the editor, lobby and gameplay. Compare crown/cowboy/flower seating too.
4. Select Sleepy and Mischievous expressions while dressing the frog; confirm closed lids and the wink are obvious. Check mobile landscape briefly.

Stop after deployment for owner approval. Do not bundle additional audio, cosmetic or gameplay changes.
