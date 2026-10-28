# Performance and stable results update

Baseline: `b042715353982c7410c89cf3483f98b42ddb874d`.
Recovery checkpoint: `checkpoint/pre-performance-results-update`.
Status: tested candidate; personal playtest approval pending.

## Findings and changes

1. **Redundant text rasterization:** each frog label called Phaser's `setBackgroundColor`, `setPadding`, and `setColor` every rendered frame. These setters redraw the text canvas even when unchanged. Eight frogs produced roughly 8,200 redraws in 5.7 seconds. Background/padding now initialize once; text and color update only when changed. Labels retain the same font, colors, wording, padding and placement.
2. **Repeated state allocations:** aggregate state capture called each modifier's serializer twice, and Frog Chaos up to four times. The client also recaptured platform/environment state after already capturing the same simulation instant. Each aggregate now captures each component once and rendering reuses it. No data is cached across simulation steps. 2,880 deterministic snapshots across all four arenas, all 20 modifiers and combinations match the previous serializer byte for byte.
3. **Hidden rendering:** the Phaser scene kept rebuilding frog/effect graphics while its canvas was hidden behind results/voting. It now stops scene drawing on these screens and resumes on announcement/countdown. Server physics, client network receive, clocks, voting, music and CSS celebrations continue normally.
4. **Unstable score lanes:** animated numbers used proportional display lettering inside a wrapping score/gain flex row. Crossing digit-width thresholds changed card height by 12–14 pixels in reproduced cases. Stable numeric rows, reserved width based on the final/previous digit counts, tabular monospace numbers, and container-aware sizing keep structure independent of animated values. The existing 3-second count, rank movement, sequential final reveal and confetti remain.
5. **Oversized placement labels:** the redesigned display font produced a 44-pixel-high third-place label in a 36-pixel base on desktop, and 31 pixels in a 20–24-pixel base on compact screens. Placement line-height and font sizing are explicit; tied captions occupy a separate line. Podium bases/frogs grow where room permits, and the desktop composition gives podiums a dedicated column. Small landscape screens keep the podium and a scrolling full standings column. At 320 pixels tall, Score breakdown shares the host-action row to reclaim vertical space. Long names retain ellipsis/title and the full score-breakdown table.

## Measurements

Local headless Chromium with software graphics, loopback WebSockets and existing CPUs. These are illustrative samples, not physical-device or Render capacity benchmarks. CPU roles/routes vary between runs. `render` is the frog/effect JavaScript drawing call, not GPU time. Snapshot byte counts are decoded JSON estimates, not wire bandwidth. No artificial CPU physics advantages or altered tick/snapshot rates were used.

| Scenario | Frog/effect draw, mean ms before → after | Text redraws before → after |
| --- | --- | --- |
| Two frogs, ordinary Sunny Pond | 0.62 → 0.30 | 2,016 → 0 |
| Eight frogs, ordinary Sunny Pond | 1.72 → 0.82 | 8,186 → 4 |
| Eight frogs, balls + bubbles + wind | 1.78 → 0.92 | 8,166 → 4 |
| Bathhouse jets, eight frogs | 1.72 → 0.82 | 8,138 → 8 |
| Canopy, Tilt + Super Suckers + Mega Tongues | 1.48 → 0.88 | 8,194 → 10 |
| Toyshop, Crumble + Pogo + Turbo | 1.55 → 1.12 | 8,238 → 9 |

Regular samples stayed approximately 59–60 FPS, already near the 60-Hz cap before optimization. Eight-frog main-thread script time fell from 1,790 to 1,288 ms over the sample. Ordinary/modifier server tick p95 was approximately 1–2 ms in these runs; server AI and physics were not identified as a sustained bottleneck.

A separate 21-second warmup reached the full eight persistent balls, with eight frogs, Bubble Trouble and Windy Weather. Baseline draw mean was 1.49 ms; final isolated repeat was 1.07 ms, with 8,196 versus 17 text redraws. FPS was 60.0 versus 59.1 in this short noisy sample (p95 frame time 16.7 versus 16.8 ms); this does **not** prove a consistent FPS increase. Candidate repeat tick p95/p99/max: 1.82 / 3.61 / 13.50 ms, zero overruns. Loopback RTT ~6.5 ms; snapshot median ~33 ms. One candidate run while other tests were running had a 69-ms startup task; the isolated repeat did not. Baseline stress and concurrent lifecycle runs also had isolated server spikes. Severe user-reported startup lag was not reliably reproduced. Reduced countdown redraws provide headroom, not a promise of zero stutter.

## Results, lifecycle and regressions

- 634 automated tests pass. All unrelated server, bot, input, networking, music, cosmetics and arena sources/assets are protected by byte hashes.
- Production build passes (existing Phaser bundle-size advisory).
- 25 score-animation layout cases: desktop 1280×800, laptop 1024×650, landscape 844×390, 667×375 and 568×320; 2/8 frogs, eight-way ties, round/final results, long names and large totals. Zero measured structural score-card or podium shifts after the fix. Placement labels fit their bases and visible stage; host controls remain visible; no horizontal/page overflow. All eight standings remain in the scrollable board.
- Real independent-client Poison, Freeze and Classic matches complete, including final-only totals, staged champion reveal, one celebration, host continuation and rematch. Legacy music assertions were updated in the new test harness to the already approved Hop Pursuit track; production music code is untouched.
- Two complete eight-frog matches (two humans/six CPUs), 16 rounds with voting/stacking/renewal and rematch. Textures stayed at 10; listeners settled at 181. Object counts reflected active platform graphics (17 ordinary / 27 Tilt), rather than rising each round. Post-GC heap ranged roughly 9.3–10.6 MB; warm-sample range ~1 MB. This short test cannot exclude very long-session leaks. One concurrent-run server max spike reached ~85 ms; typical tick p99 stayed below 10 ms and improved after warmup. Full raw observations are retained, including outliers.
- Repeated Crumble/Tilt activation and expiration returned platform/mask counts to zero and scene objects to 17 every time; textures stayed at 10. Crumble temporarily used 107 scene objects on revised Sunny Pond, all released on expiration.
- Native physical iPhone Safari/Android were not available. Mobile viewport/touch emulation and touch-input regression tests do not substitute for user device playtesting.

## Preservation and rollback

Only `src/main.ts`, `src/presentation/courtyard.ts`, `src/simulation/state.ts`, `src/ui/results-ui.ts` and `src/ui/results.css` change at runtime. State serialization is the sole shared/server-used adapter; its outputs are identical. Tick rate remains 60 Hz; snapshot/input rates remain 30 Hz. No CPU decisions, physics tuning, gameplay rules, modifier effects, geometry, controls, music or settings change.

To roll back, create a **new commit** restoring these five paths from `checkpoint/pre-performance-results-update`, then deploy that new commit through the existing production service. Do not reset main, force-push, overwrite checkpoints or recreate Render.

## Manual playtest

- Start eight-frog matches on desktop and phone; compare the first countdown and opening chase.
- Stack ball/bubble/wind and let eight balls accumulate; test Bathhouse jets, Canopy vines/Tilt and Toyshop conveyors/Crumble.
- Watch score counting across 9.9/10.0 and 99.9/100.0, with long names and ties; verify stable frogs/names/ranks.
- Inspect all three podium bases, scroll to places 4–8, expand Score breakdown, continue and rematch.
- Check final reveals/confetti, How to Play/settings, sound, and simultaneous floating mobile controls.

Render Free cold starts, Internet jitter, background browser throttling and device/GPU limits remain possible causes of lag. No hosting or timing configuration was changed.
