# Results pacing and ranking clarity — playtest candidate

Based on `73955f0ac1e8ae445485ba866b431d683594e76d` (preserved by `checkpoint/cartoon-results-playtest`).

- Score updates now last 3 seconds, using smoothstep instead of the previous fast-start cubic ease over 1.35 seconds. They start at the prior cumulative score, including final results, and finish at the exact authoritative total.
- Every standings card explicitly labels Up N, Down N, or No change, using arrows and words as well as colors. Accessible labels/hover titles include previous and current competition ranks; ties retain shared placement. First-round cards say First standings instead of describing an artificial drop from an all-zero tie.
- First entry to final results uses a 1.8-second “The pond holds its breath” curtain, then reveals the podium with a champion spotlight leap and confetti. All tied champions share the reveal equally. Controls and detailed score breakdown remain available throughout; there is no automatic advancement.
- Reduced motion skips anticipation, counting, and particles. Leaving results, hiding the page, or enabling reduced motion cancels pending timers and settles scores immediately. Repeated state updates do not replay the celebration.
- Compact results retain scrollable standings and reachable host controls. Only results presentation and its tests/documentation changed; source-byte preservation checks protect gameplay, scoring, CPU, networking, and mobile input/viewport code.

Physical mobile acceptance remains a user playtest; Chromium mobile emulation is not physical iPhone or Android validation.
