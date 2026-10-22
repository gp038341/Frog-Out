# Focused CPU movement and competitiveness candidate

Approved baseline: `c0915a01076c44b2e5c035609f97382f06d04afe`.
Approval checkpoint for the round readouts: `checkpoint/approved-round-number-readouts`.
Pre-change checkpoint: `checkpoint/pre-bot-competitiveness-update`.
Status: candidate for user playtesting; not approved. No further bot milestone is included.

## Diagnosed causes and corrections

1. **Frog obstruction:** spatial recovery noticed low movement but its identical reverse-steering response could reproduce a head-on deadlock. The navigator now requires 24 ticks of grounded attempted travel blocked by a nearby frog before issuing an ordinary jump/steer recovery. The current pursuit or rescue target is excluded: intentional body contact must remain possible. It does not alter collisions or interrupt a charge, tongue maneuver, or fleeting contact.
2. **Pogo grapple oscillation:** Pogo/bumper/inflation event handling resets the maneuver state and `attachTick`, even while the same actual tongue remains attached. Repeated bounces thus renewed the hold timeout. Physical tongue identity now owns the lifetime clock, independently of maneuver interruption. Progress monitoring releases a stalled low anchor, remembers its local position for four seconds, and temporarily penalizes the failed route. Productive reeling/swinging and the ordinary press/hold/release pipeline remain in use.
3. **Vertical routes:** first-leg costs omitted the journey across a broad floor to the launch point; exterior tops of the world boundary could also enter routes. The shared read-only graph now charges for the launch approach and rejects exterior surfaces. Drop routes now explicitly steer beyond an edge instead of aiming directly downward while standing still on a platform. Route execution advances an intermediate platform waypoint passed in flight/spring launch rather than repeatedly returning to it. Two failed jump landings temporarily suppress that edge. Modest tactical goal updates retain progress accounting, and precision rays toward visible platform lips use the existing continuous input axes. Air steering accounts for stopping distance. Grapple setup uses a 0.38-second charge where appropriate, within the existing 0.8-second human charge limit.

Tactics retain their existing roles, independent preferences, reaction schedules, and targeting rules. Travel-cost estimates share the corrected first-leg cost. Rescue targets, like pursuit targets, are treated as intentional contact. No body, velocity, collision, force, scoring, or tag state is written by the AI.

Only three production files change: `server/navigation/geometry.ts`, `server/navigation/navigator.ts`, and `server/strategy/tactics.ts`. The preservation manifest checks all other current source bytes, including physics, arenas/spawns, modifiers, human controls, networking, voting, cosmetics, audio, results, and viewport code.

## Reproducible evidence

All comparisons use the exact approved CPU source fixtures, identical seeds and current geometry. Setup positioning is test-only. Bots execute ordinary inputs and real Planck contacts. Scripted human inputs are stand-ins, not physical playtests.

| Measure | Approved baseline | Candidate |
|---|---:|---:|
| Head-on obstruction: time to pass | Did not pass in 10 s | 2.07 s |
| Longest continuous deadlock | 9.92 s | 1.10 s |
| Ground-grapple Pogo reproduction: longest same attachment | 4.00 s | 0.68 s |
| Completed representative climbs within 30 s | 28/36 | 32/36 |
| Median arrival among successful climbs | 14.63 s | 8.72 s |
| Sunny Pond highest target, seed 23 | 23.93 s | 8.72 s |

The full-match comparison uses 36 scenarios per version: all four arenas × three modes × eight-CPU, mixed scripted-human/CPU, and scripted-human-runner cases; at most 30 seconds each. Legitimately frozen/trapped participants are excluded from activity rates. Rates are averaged equally across runs; this does not establish a human win rate.

| Mean per-scenario measure | Approved baseline | Candidate |
|---|---:|---:|
| Stationary eligible gameplay | 23.29% | 11.92% |
| Neutral input | 14.51% | 3.71% |
| Distance per eligible frog-minute | 369.15 | 432.99 |
| Platform transitions per eligible frog-minute | 6.97 | 13.30 |
| Jumps per eligible frog-minute | 8.87 | 9.60 |
| Charged jumps per eligible frog-minute | 7.36 | 6.85 |
| Grapple attachments per eligible frog-minute | 14.85 | 16.83 |
| Oscillation time | 2.44% | 1.33% |
| Total successful rescues | 21 | 27 |

Timing fields from comparative runs may include concurrent local validation load; use the separate compiled-server network/stress report for timing conclusions.

## Validation and limitations

See `docs/results/bot-competitiveness-*.json` and the corresponding scripts. The historical B1-versus-B2 movement harness now pins the original navigator/geometry for the historical sides; previously both imported today's navigator, inadvertently changing the comparison opponents. Its original performance assertions remain intact. Continuous-aim assertions validate finite axes within [-1,1], rather than restricting legitimate input to eight compass directions.

The highest Toyshop perch remains an unreliable route in the fixed ground-start climb cases. Some routes are slower than the baseline; there is no guarantee of optimal paths, human-level competitiveness, or perfectly reliable navigation under every triple. No modifier tuning was changed. Physical iPhone/Android acceptance is not claimed for this server-only candidate.

## Manual playtest

- Put several CPUs in a normal match on each arena; seek elevated platforms and see whether hunters maintain pressure and runners use upper routes.
- Watch two frogs meet on a lower lane; verify deadlocks break without preventing legitimate tags/rescues.
- Enable Pogo Panic and watch low grapples: they should release instead of sustaining repetitive ground swings. Useful high grapples should remain common.
- Check Freeze Tag rescues, spring-pad escape, and Bubble Trouble's five-tap escape.
- Try eight frogs with Tilt/Sticky, Gravity Flip, wind, and crumbling platforms; confirm lively movement and ordinary reconnect/voting behavior.

Stop after deployment for physical/user playtesting.

Final validation: 457/457 automated tests passed; TypeScript, Vite, and server production builds passed. The existing large Phaser chunk warning remains. The 420-scenario Chaos sweep had zero AI errors/non-finite positions; 158 bubble captures and 150 observed releases (some captures persisted at scenario termination, not all imply escape failures). Independent-client integration passed 14 lifecycle/CPU/multiplayer checks. Four eight-frog compiled-server stress runs had p99 tick times of 1.38–2.63 ms. One isolated Canopy tick took 18.76 ms and exceeded the 16.67 ms budget; the other stress ticks stayed within budget. Eight mixed Chaos integration cases had zero overruns. These are local measurements, not a hosted-capacity guarantee. See the dedicated network report for per-arena timings.
