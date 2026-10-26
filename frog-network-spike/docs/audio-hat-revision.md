# Audio and cosmetic revision — playtest candidate

Previous candidate: `6bb5fefd984f4d72b87e5592fa6ed5010a338e24`, preserved at `checkpoint/pre-audio-hat-revision`.
The approved baseline `c0e21c3186f75fca73b9fd615f980421a964dbf6` and its approval checkpoint remain preserved. This revision supersedes the rejected parts of the previous sound/hat candidate; it is not owner-approved yet.

## Changes

- Raise cosmetic hats in gameplay, with extra clearance for crown, cowboy and propeller brims. Those three portrait hats now finish above the eye outlines; the beanie/cowboy portrait geometry fits the available headroom without clipping. The mushroom and party designs from the previous candidate are retained.
- Restore the exact original preview expression strokes and pupil geometry from before the previous revision. Sleepy uses its original straight eyelid lines; Mischievous keeps both original pupils and its angled lid. Only skin-colored upper-lid fills are added behind those strokes. The gameplay eye renderer remains unchanged.
- Move the previous gameplay track to the lobby exactly, sample for sample. The old quiet lobby arrangement is no longer active.
- Add **Canopy Chase**, a genuinely separate original 155 BPM, 20-bar adventure/chase composition with a new melody, moving bass, rapid string ostinato, answering horn parts and driving percussion. Its loop duration matches Reedwater's 124 BPM, 16-bar track, retaining the existing continuous sources and crossfades. Music playback, preference persistence, default volume and master Sound gating are unchanged.
- Replace the pitched victory fanfare with a 2.1-second applause-style effect: 18 varied palm-clap transients and short diffuse tails in one cached noise buffer. No pitched oscillators or melody. It still plays exactly once at the winning podium reveal and respects Sound Off, effects volume, reduced motion and hidden tabs. This is original procedural clapping, not a recording of real hands; no external assets or redistribution rights are required.

## Validation

490 automated tests and the production build pass. The previous gameplay PCM exactly equals the new lobby PCM. New gameplay RMS is 0.0993 versus lobby 0.0803; gameplay peak is 0.402. This is measurable contrast, not proof of musical taste. Both loops remain bounded and continuous, with no new music sources/dependencies.

Tests cover non-pitched applause generation at 22.05/44.1/48 kHz, one cached playback source, mute/volume/hidden gating, original expression geometry, upper-lid fill and unchanged unrelated runtime sources. The preservation manifest protects all server, CPU, game-mode, modifier, input, settings and physics files.

Visual inspection covers 18 portraits and six hats rendered through actual Phaser. Browser checks cover complete two-client matches in all three modes, exact-once applause playback at the final reveal, no repeat when returning to the lobby, reduced-motion results, editor/home/lobby previews, and music preference persistence on desktop and mobile-landscape emulation. See the accompanying results reports. Physical-device sound and personal aesthetic acceptance remain with the owner.

## Playtest

Compare lobby music with an active round; inspect crown/cowboy/propeller clearance; confirm the original facial expressions with filled upper lids; finish a match to hear the applause. Check Sound Off and saved volume, then briefly check the mobile editor.

No gameplay, bot, modifier, arena, control, scoring or camera changes. Stop for owner approval after deployment.
