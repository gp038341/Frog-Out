# Background music — listening candidate

Approved baseline: `a763df12f787835212451b92f9a237b7a313a1c1`.
Preserved checkpoint: `checkpoint/approved-sound-rules-lobby-recovery`.

## Soundtrack and rights

**Pondside Pandemonium** is an original Frog-Out instrumental composition, implemented entirely in project code (`music-score.ts`). C-major/A-minor, 116 BPM, 16 bars / approximately 33.10 seconds: syncopated mallet call-and-response, round bass, light offbeat chords and percussion. Note tails wrap through the loop boundary; there is no file-loading gap between loops. No external melody, recording, sample, music library, asset pack or paid service is used. The composition and synthesizer source are original project assets for redistribution with Frog-Out. Existing approved sound effects are unchanged.

## Controls and behavior

- Music defaults On at 30%; music and effects remain independent.
- Music On/Off and Music Volume 0–100% are inside the existing Escape/Game menu. The same settings are accessible from How to Play on home/lobby screens. Both panels mirror the same player.
- `frog-out-music-enabled` and `frog-out-music-volume` persist locally. Storage failures do not block gameplay.
- One client-side AudioContext and one looping AudioBufferSourceNode persist across all game screens, rooms, rounds, voting and results. Menus do not restart the track. Mute/zero volume silence immediately and suspend playback; enabling resumes its position.
- Browser permission is requested synchronously during a trusted pointer/touch/key/click gesture. Passive observers never prevent events or change control ownership. Muting on the first settings interaction cannot inadvertently unlock audible music.
- Hidden tabs/page cache suspend the music; returning resumes the same source if enabled and previously unlocked. Blocked playback can retry on a subsequent gesture. Unsupported audio/worker APIs or failed generation produce an unobtrusive unavailable message; the game remains playable.
- One short-lived Web Worker generates a 22,050 Hz mono buffer away from the render/input thread. The buffer is about 2.92 MB; temporary generation data is released afterward. The worker script is about 2.2 KB. No audio download, new dependency or server work.

## Validation

- 11 focused tests: deterministic score/duration/seam, one-source looping, default volume, gesture gating, mute/unmute, persistence, hidden/page-cache behavior, pending-resume and pending-generation races, blocked APIs, storage failures, both settings panels and source preservation.
- Full suite: 370 tests. Production build checked.
- Exact source hashes protect server, bots, physics, all modifiers, arenas, effects, cosmetics, Escape/menu implementation, networking and mobile/iPhone controls/viewport. `main.ts` only adds the music UI/CSS import and its singleton initialization.
- Browser listening and physical-device audio acceptance are separate from automated state checks. Physical iPhone Safari/Android music playback is not claimed verified by this change; existing input/viewport implementations remain unchanged.

## Listening checklist

1. Refresh, interact once, open How to Play and check Music On at 30%.
2. Adjust volume, mute, refresh and confirm Off persists. Enable again and confirm music resumes.
3. Create/join a room, start, open Escape/Menu and adjust music. Resume, vote, view results: no restart or overlapping tracks.
4. Play longer than 33 seconds to hear the loop. Change tabs and return; ensure it pauses/resumes rather than doubling.
5. On physical iPhone Safari/Android, use the existing touch menu to adjust/mute; verify two-thumb gameplay and sound effects remain unchanged.
