# Dedicated How to Play panel

Baseline: `cdcc03488e06c9ca6c121785ac0cee2ded556c48`.
Preserved at `checkpoint/pre-how-to-play-panel` and `checkpoint/approved-arcade-music`.
Status: candidate for the user's personal playtest; approval is pending.

## Scope

The existing footer now has **How to Play** alongside Settings, Sound, and Fullscreen. It opens the existing shared instructional dialog directly. Settings no longer has a Controls & Rules link; its Sound, Music, current-match details, Close, and Leave functions are unchanged.

Instructions retain Chaos Voting as the signature feature, followed by Movement and Controls, Game Modes, and Winning and Scoring. The three mode descriptions are expanded initially and remain collapsible. Existing desktop/mouse and mobile-specific instructions, reconnect advice, 15-second voting, KEEP renewal, three-modifier conveyor, current scoring, and mode endings are retained. Rules were checked against `outbreak.ts`, `freeze-tag.ts`, `classic-tag.ts`, the input adapters, and Chaos UI.

## Readability and navigation

The cream panel uses explicit dark ink `#292431` for body text, descriptions, summaries, notes, and keyboard labels. Headings use dark teal `#31575e`. Keyboard keys and the Chaos feature block use pale mint `#e2efb9`. These replace inherited pale-blue/cream list text that lacked contrast on the redesigned light panel. All combinations exceed 4.5:1 text contrast.

A fixed dialog header keeps Close reachable; only the instruction region scrolls. Escape closes How to Play directly. The existing settings shortcut within the instructions can still open Settings and return to the same help content afterward. Native dialog modality and the existing held-input cleanup block underlying gameplay input; matches continue running normally.

The existing toolbar layout is reused. A small footer-margin correction keeps desktop and touch gameplay toolbar buttons inside the fixed shell; otherwise focusing a footer button could scroll the hidden main container by a few pixels and shift the arena. The touch toolbar uses its existing reserved grid row without an extra top margin. No camera, canvas, simulation, or input code changed.

## Validation

- Full automated suite: 629 tests, including direct-entry, Escape/input blocking, single-copy instructions, exact rule copy checks, and byte-preservation of all unrelated runtime files/assets.
- Production build: passes; existing Phaser bundle-size advisory remains.
- Browser checks cover desktop 1280×800, laptop 1024×600, iPhone-UA Chromium landscape 844×390, and small landscape 667×375. Home, lobby, gameplay, results and voting; settings/customization restoration; Sound/Music/volume; desktop Fullscreen; fixed Close and internal scrolling; explicit text colors; toolbar fit; and blocked gameplay inputs.
- Real native iPhone Safari/Android and physical-device touch behavior require user playtesting; emulation is not physical-device validation.

All original music, bots, game modes, scores, controls, arenas, modifiers, networking, and assets are protected by `how-to-play-preservation.json`. Historical source checks reverse only this authorized adapter; current protection checks read the actual current sources.
