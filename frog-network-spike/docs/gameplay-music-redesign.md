# Hop Pursuit — gameplay music listening candidate

Baseline: `c0a184e2e9002dac4e1873874ba25fe97e0f4d60`.
Preserved checkpoint: `checkpoint/pre-gameplay-music-redesign`.
The owner-approved signature-arena checkpoint and all earlier checkpoints remain intact.
This is a listening candidate, not an owner-approved musical result.

## Previous loop diagnosis

The previous player was already using a continuously looping Web Audio AudioBufferSourceNode. No per-loop JavaScript timer or repeated start caused the restart. However, the edited Heroic Age MP3 decodes to **59.4568254 seconds** in both FFmpeg and the browser, whereas its documented 32 bars at 129 BPM require **59.5348837 seconds**. The decoded cycle is **78.0583 ms short** of that grid. The archived edit notes describe an 80 ms cyclic crossfade; that is consistent with a shortened audio edit, though the exact contribution of the MP3 edit/encoding cannot be inferred from the final file alone. Playing the entire decoded buffer repeated this mismatch. A smooth amplitude seam did not make the excerpt a complete musical cycle.

The old file, attribution, checksum and source history remain unchanged and recoverable. It is no longer fetched by gameplay music.

## Original musical direction

**Hop Pursuit** is an original 32-bar composition at **168 BPM**, in D minor/Dorian with brighter contrasting harmony. No third-party recordings, sampled instruments, external music service or new dependency is used.

- Bars 1–8: a syncopated mallet question/answer over a mobile bass groove, plucked chord patterns and kick/backbeat percussion.
- Bars 9–16: the theme returns with a lower answering figure and small rhythmic accents.
- Bars 17–24: a contrasting reed-led phrase with more space, brighter harmony, and the same forward-moving rhythm.
- Bars 25–32: the main theme returns with lower doubling, occasional short brass-like stabs and a final dominant pickup leading back to the first D-minor downbeat.

The melody is authored explicitly. Seeded noise only supplies percussion texture; it does not choose random melody notes. There is no ambient introduction, slide-whistle gimmick or oom-pah accompaniment. Subjective energy, timbre, memorability and long-session enjoyment still require the owner's ears.

## Exact loop and playback

The composition renders once in the existing worker at 22,050 Hz. The loop contains exactly **1,008,000 samples**, or **45.7142857 seconds / 128 beats**. Notes, percussion releases and small room reflections wrap within this complete cycle. Their tails are part of the periodic steady state; the end is not faded out or shortened to hide a musical mismatch.

The existing music player uses the resulting PCM directly, with explicit gameplay loopStart=0 and loopEnd=samples/sampleRate. There is no MP3 encoder padding, extra audio file download, per-loop restart, duplicated source or loop crossfade. The existing short crossfade between lobby and gameplay moods remains unchanged.

All existing state routing is untouched: gameplay arrangement during announcement/countdown/play; lobby arrangement on home/lobby/voting/results. Both cached sources start once on the existing clock, so entering another screen or round does not create another player. The existing mute, master Sound, saved volume, trusted-gesture unlock, visibility/page-cache behavior and generation-failure handling are preserved. Default music volume remains 30%.

## Lobby preservation

`music-score.ts`, the complete lobby composition, is byte-unchanged. Its generated PCM remains exactly **682,839 samples**, SHA-256:
`88f18cdde81270822f39a911fce34fd16ecdc3bb37e9fef59f76e05ace1b604d`.

The lobby still renders at startup as it did previously; it has not been recomposed, remixed or normalized differently. Lobby gain and mood-transition behavior remain unchanged. Settings only replace the incorrect active Heroic Age title/credit with the original composition's title.

## Validation and limits

- Full regression suite: **619/619 passed**; production build passes with the existing Phaser bundle-size advisory.
- New PCM: RMS 0.105, peak about 0.615, no clipped samples. Every sampled 50 ms window has nonzero energy; the minimum measured RMS is 0.0161. Approximately 0.04% of spectral energy lies above 6 kHz, a technical check against an excessively sharp high end, not a listening judgment.
- One local render took about 0.60 s. New gameplay PCM is 4.03 MB and is synthesized off the main thread once. This is not a physical-device performance measurement.
- Browser OfflineAudioContext renders cover **six full cycles / five successive joins** at 22,050 and 48,000 Hz (about 4.57 minutes each). Source-rate cycles repeat exactly; 48 kHz join sampling is within 9 microseconds of the ideal clock. Join RMS remains consistent, with no inserted silence or accumulation.
- Real two-client desktop and iPhone-user-agent Chromium-emulated matches cover countdown music, voting, round/final results, rematches, reconnection, settings mute/volume, persisted preferences and refresh. Exactly two existing looping sources remain; muting and refreshing with Music Off creates no unexpected playback.
- A separate normal-duration 60-second Classic round with one human/seven CPUs checks sustained playback through a real-time gameplay loop and transition back to lobby music at results.
- The first long-run sample recorded a 2.4-second server tick outlier on the shared runner, despite unchanged server code; an isolated repeat measured p95 1.30 ms, p99 3.13 ms and max 23.72 ms. Both completed the full 60-second round with exactly two music sources and no browser errors. These samples do not establish physical-device performance. The outlier is not attributed to the soundtrack without evidence, and no server or physics tuning was changed.
- All non-music runtime sources, server code, public assets, approved arena mechanics, controls, physics, cosmetics, scoring, effects and voting are protected by exact hashes.

**No listening by ear was possible in this environment.** Complete rendered PCM, loop boundaries, browser scheduling and state transitions were analyzed programmatically. No claim is made that the music's taste or absence of every perceptible artifact was verified aurally. Physical iPhone Safari/Android audio and the owner's listening acceptance remain necessary.

## Owner playtest

1. Keep the lobby playing, then start a match with Sound On: compare the unchanged lobby with the new chase during countdown.
2. Listen to the full 45.7-second arrangement and several repeats, especially the final pickup returning to the opening motif.
3. Check whether the lead/bass/percussion feel playful and driven rather than robotic, tiring, clown-like or aggressive; compare with gameplay sound effects at your saved volume.
4. Check voting, final results and a rematch; test master Sound, Music Off, volume and a refresh on your phone.

## Restore the previous gameplay soundtrack

Create a new revert commit for this music-only update and deploy it through the existing `frog-out` service, or restore the three music adapter files from `checkpoint/pre-gameplay-music-redesign` in a new commit. The old MP3 and license records are still present. Do not force-push, reset approved history, recreate the service or alter the URL. No further audio revision should begin before owner feedback.
