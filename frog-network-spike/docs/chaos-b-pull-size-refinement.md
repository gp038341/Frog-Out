# Super Suckers / Mega Frogs follow-up candidate

Recovery: `checkpoint/pre-chaos-b-pull-size-refinement` at `74050c99f4f4868450bc6d7f43327ef24ed83759`.

| Parameter | Previous | Candidate | Normal |
|---|---:|---:|---:|
| Super pull acceleration | 57.6 | 72 | 48 |
| Super slack take-up speed | 4.4 | 5.2 | 4 |
| Super inward closing-speed ceiling | 8 | 10 | 8 |
| Mega size multiplier | 1.25 | 1.35 | 1 |
| Mega body radius | 0.5625 | 0.6075 | 0.45 |

This increases acceleration and permitted inward momentum only while Super Suckers is active. Equal/opposite frog pulls, the relative poison advantage, momentum-preserving release, and short-distance safeguards remain unchanged. The ceiling stops adding inward impulse rather than clamping pre-existing velocity. Mega uses existing shared resize/render/attachment geometry with constant mass, safe round spawns and exact expiry restoration. Tiny, Turbo, Magnet and all other modifiers are unchanged. No input, viewport, camera, arena, rule, networking, audio or global movement code changed.

Test the stronger terrain and frog pulls, release launches, reciprocal pulls near minimum separation, Mega spawning/traversal in all arenas, and combinations with Moon/Turbo. Physical-device testing of this candidate remains pending.

Validation: all 158 automated tests and production build pass. Compiled-server checks pass 22 scenarios across Poison/Freeze/Classic, 2–8 clients, voting rotation, reconnect and disabled-Chaos regression. Updated local eight-frog representative-stack measurements and multiplayer evidence are in `results/chaos-b-refinement-stress.json` and `results/chaos-b-refinement-network.json`. These are automated local tests, not new physical-device validation or Render CPU benchmarks.
