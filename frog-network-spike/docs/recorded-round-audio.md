# Recorded round music and audience applause — playtest candidate

Previous candidate: `7ca8c4b2a2e5e1e8243819528cde7b036dd12bad`.
Checkpoint: `checkpoint/pre-recorded-round-audio`. Earlier approval checkpoints remain intact.

## Changes

- Replace the rejected generated gameplay track with a coherent authored orchestral recording: **Youthful Elf Seeking Adventure** by **Ragnar Random**. The creator publishes the [Orchestral and World Music Pack](https://opengameart.org/content/orchestral-and-world-music-pack) as CC0. The game serves a 54.857-second, loudness-managed mono MP3 excerpt with short endpoint fades (549,400 bytes).
- Preserve the lobby music exactly. Its PCM still comes from the existing worker; the worker no longer generates the rejected active-game track. The recording is decoded into the existing two-source music player, with its original mute/volume/persistence/crossfade behavior. No third-party runtime services or new audio player.
- Activate gameplay music at the round announcement, throughout the countdown and playing phases. Voting/results/lobby use lobby music. This changes audio presentation only; it does not change countdown length, gameplay clocks or rules.
- Replace generated clap bursts with **Small applause** by **Breviceps**, a real recording of roughly 30 people applauding, published [on Freesound as CC0](https://freesound.org/people/Breviceps/sounds/462362/). The self-hosted 4.4-second MP3 is reduced to a -24 LUFS target with -9dBTP cap and a 150ms fade-in/650ms fade-out (35,779 bytes). Existing effects gain applies, with a moderate local cue gain. No oscillators or synthetic clap fallback.
- Applause preloads on Sound On and uses one cached Web Audio buffer. Mute, volume zero, hidden tabs and cancelled pending playback remain safe. The existing winning-podium callback still fires once, including reduced motion; returning to the lobby does not replay it. Loading errors leave gameplay usable and never substitute the rejected aggressive sound.

## Rights and provenance

Both creator pages explicitly grant CC0. No login, paid asset, subscription or external service is required. `public/audio/credits.json` records creator/source/direct download/license URLs, original and edited hashes, sizes and conversion details. Settings shows the gameplay title and author; optional credits are retained despite CC0 not requiring attribution.

## Verification

496 automated tests pass; production build passes with the pre-existing Phaser bundle-size warning. Tests cover countdown audio selection, loading failures, MP3 provenance/checksums, resampling, one cached applause source, interrupted-load/mute safety, and exact preservation of unrelated runtime files.

Complete two-client Poison/Freeze/Classic browser matches verify Adventure is selected during announcement/countdown, before playing; the approximately 55-second recording is actually decoded; only two music sources exist across rounds; recorded applause plays once at the final reveal; no repeat occurs on returning to the lobby. Thirty desktop/mobile-sized results cases cover reduced motion and ties. Browser tests are not physical iPhone audio acceptance.

Hats, facial expressions, controls, server/CPU logic, arenas, all modifiers, physics and scores are byte-identical to the prior candidate. The two audio assets total 585,179 bytes and are hosted by the existing app.

## Manual playtest

Enable Sound in the lobby; start a match and listen from the countdown. Compare the authored melody/rhythm with the prior candidate and check normal saved volume. Finish a match and assess the recorded audience applause for softness and clarity. Check Sound Off, music volume, and one mobile match. Stop for owner approval; do not make further unrelated changes.
