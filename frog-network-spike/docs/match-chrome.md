# Compact match chrome

Approved scoring baseline: 3e6cf9cdc09c7bf458b37e96f1030c0362cbeac3, checkpoint/approved-scoring-refinement.

Room/arena and round labels relocate into the existing Settings dialog; existing renderers still update the same nodes for all three modes. Current-match details hide outside a match; lobby and results information remain unchanged. The same dialog opens by Esc, touch Settings, or supported mobile Back.

Diagnostics, input monitor, and layout-switch buttons are removed from the player-facing toolbar into an inert hidden container. Existing diagnostic adapters remain recoverable; touch ownership and device detection are unchanged. No change to viewport measurement, camera, input, physics, scoring, bots, or networking.

Touch gameplay reclaims the old metadata HUD row and unused second footer row through CSS; timer and essential role/score feedback remain visible. Settings does not resize the game.

Validation: 403 automated tests and production build pass. Chromium browser checks at 1280×800, iPhone-sized 844×390, and Android-sized 568×320 verify hidden developer controls, live room/arena/round metadata in Settings, Escape/touch close, unchanged canvas bounds while Settings is open, no page scrolling, and simultaneous movement/action with independent release. Mobile checks are emulation, not fresh physical-device testing. Existing large Phaser-bundle warning remains unchanged.
