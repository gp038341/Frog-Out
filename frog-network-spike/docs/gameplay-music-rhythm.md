# Hop Pursuit — steady groove refinement

Baseline: `4173878755d93896b8aee006c8fc55e1e1f1b185`.
Checkpoint: `checkpoint/pre-gameplay-music-rhythm-refinement`.
This candidate responds to the owner's report of sporadic beats and an unrelated-feeling middle section.

## What changed

The previous kick pattern fell on beats 1, the upbeat after 2, and the last upbeat before 4. It also changed from a mallet lead to a reed lead during bars 17–24, changed harmony there, thinned its accompaniment, and added sixteenth-note hats/fills elsewhere. Those were explicit composition choices, not audio scheduling drift, but they undermined the consistent pulse and identity the owner wants.

The revision uses one clear four-count pattern throughout: kick on 1/3, snare on 2/4, straight eighth-note hats, and one repeating bass rhythm. Extra sixteenth hats, irregular kick substitutions, tom fills and isolated brass stabs are removed. A consistent blended lead (mallet with a soft reed layer) plays the entire song.

The same eight-bar melody/harmony returns across the full 32-bar loop. Melody attacks share a straightforward quarter/eighth-note phrasing pattern. Only a couple of phrase-ending notes vary slightly on alternate passes. There is no replacement lead or different bridge progression midway through the track.

## What stays unchanged

168 BPM, 32 bars, 1,008,000 samples at 22,050 Hz, 45.7142857 seconds, RMS target 0.105, default volume, exact looping/tail wrapping, music player, worker lifecycle, settings, state routing and all game functionality remain intact. The approved lobby remains sample-identical, including its existing checksum. This is a change only to the gameplay composition.

Peak amplitude is about 0.521 (previously 0.615), while overall RMS remains 0.105. Minimum measured 50 ms RMS rises from 0.016 to 0.044, consistent with a more continuous arrangement, not proof of musical taste. One shared-runner render took about 0.96 seconds; playback still uses cached PCM rather than live JavaScript synthesis.

## Validation

The full regression suite passes **622/622 tests** and the production build passes (existing Phaser size advisory only). Targeted tests verify the steady backbeat, returning hook, exact lobby and non-music source preservation, bounded PCM, and existing player/settings behavior. Browser tests exercise five loop joins at source and hardware rates plus desktop/mobile-emulated full matches, voting, results, rematches, reconnects and persisted controls. The accompanying reports record results.

No listening by ear was possible. All claims of improved feel describe the intended arrangement; the owner's listening playtest remains the musical-quality check. Physical Safari/Android audio acceptance remains pending. No further audio changes should start without feedback.

## Recovery

Revert the rhythm-refinement commit in a new commit to restore the initial Hop Pursuit candidate. `checkpoint/pre-gameplay-music-redesign` still restores the older Heroic Age implementation. Preserve every checkpoint; never reset/force-push history or recreate the existing Render service.
