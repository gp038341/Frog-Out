# Poison Tag HUD cleanup

Baseline: bc4c4081cbe1ef39a8bc1622b17d6dc183ca85aa (checkpoint/match-chrome-playtest).

Remove the redundant Poison Tag live-score and infection-score breakdown readouts, including the locked-points and starter zero-point messages. Empty HUD fields take no layout space. Keep the timer, safe-frog count, frog identity/status effects, sound/presentation, Freeze/Classic status messages, and round/final results intact. All authoritative scoring and gameplay code is byte-identical.

Validation includes the actual Poison Tag HUD renderer across healthy, transforming, and poisonous states, preservation checks, the full regression suite, production build, and desktop/mobile-landscape browser checks. Physical devices are not retested by automation.
