# Background music — Reedwater listening candidate

Approved gameplay checkpoint: `checkpoint/approved-sound-rules-lobby-recovery` at `a763df12f787835212451b92f9a237b7a313a1c1`.
Previous music candidate: `checkpoint/background-music-playtest` at `b37a21d40970bed0e7d4f760cf7f08c718f8e6b0`.

## Composition and rights

**Reedwater** replaces the earlier bright mallet composition. It is an original Frog-Out modal/minor theme, with warm plucked strings, a lower reed melody, sustained harmony, bass and restrained drums. No third-party composition, recording, sample, music service, dependency or paid asset is used. The composition and synthesis source (`music-score.ts`) are original project assets for redistribution with Frog-Out.

Two arrangements share the exact 124-BPM, 16-bar clock (approximately 30.97 seconds):

- **Chill:** half-time feel, sparse reed phrases, slower bass and soft percussion. Home, lobby, countdown, voting and results.
- **Adventure:** driving string ostinato, active bass, full melody and tom/snare accents. Active gameplay in every game mode.

Both loop gaplessly. A short smooth crossfade changes their balance; neither starts over at a phase transition. No playlist or per-arena soundtrack system.

## Audio controls

- Existing **Sound: On/Off** is the master switch for effects and music. Its existing initial Off behavior is preserved. Music will not play while Sound is Off, even after other page interactions.
- Music On/Off and Music Volume 0–100% remain in the Escape/Menu and home/lobby How to Play dialogs. Default music volume remains 30%.
- Music preferences persist in browser localStorage. Master Off does not erase the separate Music preference or volume. Sound On respects an explicitly saved Music Off setting.
- Trusted gestures request browser permission; mute immediately silences both arrangements. Hidden tabs/page cache pause the same music clock. Returning, unmuting or changing game state does not create extra sources or restart the theme.
- Generation runs in one short-lived worker, not the input/render thread. One music context contains two aligned looping sources and one music-volume output. Total audio-buffer storage is approximately 5.46 MB; no audio download or server work.
- Blocked audio, generation failures and unavailable APIs remain isolated from gameplay. A small status line explains master mute or unavailable playback.

## Validation

16 focused audio tests cover composition bounds, different mood energy, identical timing, crossfade targets, no source duplication, shared Sound gating, saved Music Off, pending-generation mute races, gestures, volume, visibility, storage/API failures and exact source preservation. Full suite: 375 tests. Production build checked.

All server, bots, physics, modes, arenas, modifiers, sound effects, cosmetics, Escape/menu logic and physical-iPhone input/viewport sources remain unchanged. `main.ts` only stores the music UI reference, forwards the existing Sound toggle result and reports active-play state to music.

Physical iPhone/Android listening remains a test item for this audio revision; no new physical-device verification is claimed.

## Listening checklist

1. On home, Sound Off should silence everything. Enable Sound and hear the calmer arrangement.
2. Start a match: Adventure should fade in at GO; results/voting should return to Chill without a restart.
3. Toggle Sound Off during play: music and effects should stop. On should resume music in place.
4. Set Music Off while Sound is On: effects should still work. Refresh and confirm Music stays Off.
5. Try volume and Escape/Menu on desktop and physical mobile; listen through several loops and tab switches.
