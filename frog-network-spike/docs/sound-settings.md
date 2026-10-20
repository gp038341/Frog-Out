# Main Settings audio controls

Approved global-settings/mobile baseline: `43e19114603a45d99075bd6d06aac0d4ddef1e8e`, checkpoint `checkpoint/approved-global-settings-mobile`.

The main Settings overlay now owns Sound On/Off, Sound Effects Volume, Music On/Off and Music Volume. Rules contain instructions only; their Settings button returns to the same shared overlay.

The Sound toggle forwards to the existing master Sound button handler, preserving its music/SFX gating. Effects volume uses the existing saved `frog-out-volume` gain. Music retains its existing saved preferences and single persistent player; only the duplicate help-dialog controls were removed. No playback, navigation, viewport, input, gameplay, CPU or multiplayer changes.

Manual check: open Settings from home/lobby/game; change Sound and both volume sliders; confirm the footer master stays synchronized. Open Controls & Rules and confirm no audio controls remain there. Return to Settings and check values, then refresh to verify existing volume/music persistence. Check the approved mobile Settings button and Escape/Back behavior remain intact.
