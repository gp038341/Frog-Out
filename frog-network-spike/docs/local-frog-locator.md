# Local frog countdown / Swap Hop pointer — playtest candidate

Baseline: `d50133739cf0692cf22f33a57e7356024652af35`, preserved as `checkpoint/approved-arena-spaciousness-experiment-a`.

Adds one light-blue, dark-outlined arrow and YOU caption beside the local frog during the official countdown. It hides immediately at Go; the preceding role reveal and results do not display it. After every authoritative swap affecting the local frog, it returns for 108 physics ticks (1.8 seconds). A swap involving only other frogs does not trigger it. Snapshot refreshes do not restart its lifetime.

The pointer follows the existing rendered position, stays outside the charge ring and cosmetics, adapts for effective frog radius/mobile display size, and flips its placement near the floor/side boundaries. It is static, including for reduced-motion users, and has no hit area or input handlers. There are no new rings, label backgrounds, camera changes, timers, gameplay messages or physics writes. All existing labels, swap poofs, audio and charge feedback remain unchanged. Room transitions clear it through the existing art cleanup path.

Validation: 446 automated tests and production build passed. Forty-eight real Phaser renderer cases cover four arenas, three modes, two/eight frogs and desktop/mobile-landscape sizes: countdown, Go, role reveal/results, remote-only swaps, repeated local swaps, exact expiration and cleanup. Screenshot inspection confirms the pointer is readable alongside existing frog labels. Physical iPhone/Android testing has not been performed; input, viewport, server, bot, arena and scoring source bytes remain preserved.

Manual acceptance: start several rounds and locate your frog before Go; confirm the arrow vanishes at Go. Enable Swap Hop and observe it after multiple swaps, then disappearing after about 1.8 seconds. Check ground/upper spawns, charging and mobile landscape readability. No other changes are included.
