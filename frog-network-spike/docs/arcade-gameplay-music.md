# Hop Pursuit — warm bass-and-drums arcade arrangement

Baseline: `ca462165b3352e83aa8d6a039d400e5a77e5e6d4`.
Checkpoint: `checkpoint/pre-arcade-bass-drums-music`.
The owner selected driving bass-and-drums arcade instrumentation with a playful, moderately bright character, after rejecting the mallet/reed palette as clownish. This remains a listening candidate.

## Instrumentation and mix

The gameplay composer now uses only warm arcade synth, bass, soft chord keys, kick, snare and restrained hats. Mallet/bell partials, reed lead, brass, tom fills and the plucked arpeggio are removed from the actual composer.

- Fuller bass uses a rounded four-partial waveform, sustained note body and a 650 Hz low-pass cutoff.
- The melodic hook is one octave lower, using a soft band-limited pulse with a 1350 Hz low-pass cutoff. It stays subordinate to the rhythm section throughout the arrangement.
- Quiet, warm three-note keys on beats 1/3 replace the busy arpeggio; cutoff is 1050 Hz.
- Kick/snare are stronger relative to the lead, and hats are softer. There is no bitcrusher, extreme distortion, shrill chiptune lead, new sound effect or abrupt instrumental bridge.

All tone and mix settings are centralized in `ARCADE_MIX`. The original authored melody, small phrase-ending variations, steady backbeat, bass rhythm and eight-bar harmonic progression are preserved. No third-party music or instrument samples are used.

## Preserved behavior

168 BPM; 32 bars; 1,008,000 samples at 22,050 Hz; 45.7142857-second loop; RMS target 0.105; existing circular tails/reflections; the same cached playback pair; default volume and saved settings; state transitions and browser gesture/visibility handling.

The lobby composition/PCM, music player, worker, settings UI, effects, entire server, controls, arenas/mechanics, cosmetics, CPU behavior, scoring and Chaos Voting remain byte-unchanged. Only `src/presentation/gameplay-chase.ts` changes at runtime.

## Validation

626 automated tests and production build pass (existing Phaser size advisory only). Desktop and iPhone-user-agent Chromium emulation exercise full matches, countdown, voting, results, rematches, reconnects, volume/mute and refresh persistence. Exactly two cached music sources remain.

OfflineAudioContext checks render six complete loops / five consecutive joins at both 22,050 and 48,000 Hz. Source-rate cycles repeat exactly; no gap or timing drift is inserted. PCM peak is about 0.408, RMS stays 0.105, and the minimum measured 50 ms RMS is 0.0244. One local render took about 0.70 seconds; this is not a physical-device benchmark.

Spectral comparison against the preceding composition shows 60–350 Hz energy increasing from about 61% to 90%, while energy above 2 kHz decreases from 0.475% to 0.050%. The broad low/mid band includes both bass and lower melodic notes. These measurements describe tonal balance, not musical quality or perceived loudness.

No ear-listening was possible here. Physical Safari/Android audio and the owner's subjective acceptance are still pending. Do not make further audio revisions without feedback.

## Recovery

Restore `checkpoint/pre-arcade-bass-drums-music` through a new revert/restoration commit and deployment to recover the prior instrumentation. Earlier music checkpoints and the original recording remain intact. Do not reset or force-push history or recreate the Render service.
