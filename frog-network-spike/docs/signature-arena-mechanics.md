# Signature arena mechanics — playtest candidate

Baseline: `df20836a9c091fdb5b01d8237b129cfc857514aa`.
Recoverable checkpoint: `checkpoint/pre-signature-arena-mechanics`.
Energy refinement baseline: `97f55373d267b2019314a907795da81c2c74421f`; checkpoint: `checkpoint/pre-signature-arena-energy-update`.

This update is a candidate for the owner's physical playtest, not an approval.

## Arena behavior and tuning

All clocks count authoritative 60 Hz gameplay steps and stop during countdowns or last-human reconnect pauses. Existing room reset clears the clocks. Reconnection snapshots include the current phases and moving-body poses. No new network message or service is required.

| Arena | Addition | Prototype values |
| --- | --- | --- |
| Bubblewash Bathhouse | Two upward shower nozzles in the lower arena | Centers (14.1, 21.25) and (25.7, 21.25) m; 1.4 m stream width, 11.5 m height; 1 s warning, 2.5 s flow, 6.5 s cooldown; alternating 5 s phase offset |
| Bathhouse force | Bounded, mass-scaled upward impulse per physics step | 120 m/s² acceleration; water stops adding upward speed at 20 m/s; stronger existing launches are not clamped |
| Canopy Courtyard | Existing two middle platforms become suspended vine carriers | Sources 6/7, originally (12, 11.5) and (28, 11.5) m; 4 s period, opposite phases, ±2.0397 m horizontal travel; constant height and level unless Tilt-a-Frog applies |
| Croakwork Toyshop | Two short animated belts on existing surfaces | Source 4: central 4 m, +4 m/s; source 7: central 3.6 m, −4 m/s; 2 s gameplay warmup |

The maps' solid definitions and spawns have not been added, moved, resized, or removed. Suspended platforms reuse two existing Canopy surfaces. Belts reuse two existing Toyshop tops. Shower nozzles are decorative outlets with a force region, not new collision obstacles. Sunny Pond is unchanged.

Vines now peak at about 3.22 m/s (previously 1.06 m/s): a faster, wider predictable sweep rather than a new pendulum simulation. The existing Tilt-a-Frog weight/torque behavior remains active when voted in. The vines use authoritative kinematic carriers. With Tilt-a-Frog, their existing freely rotating dynamic bodies rotate about moving kinematic pivots. Tongues retain actual local hit anchors. Grounded steering uses carrier-point horizontal velocity, permitting standing, charging, jumping and walking normally relative to the carrier. Fixtures, surface materials and the existing rotation tuning are preserved.

Belts feed a local carrier velocity into the existing grounded acceleration controller; airborne controls are unchanged. Normal running can overcome either belt. The upper belt retains the existing sticky-paint slowdown. Normal steering against a belt yields roughly 2 m/s; sticky-paint steering against it yields roughly 0.5 m/s (slightly lower after friction). Visible rollers and chevrons mark the actual top contact strip.

## Chaos and game-mode decisions

- Shower jets always point **world-up**, including during Gravity Flip. Their force region remains in the lower arena, so water does not pin frogs against the ceiling. Horizontal movement and tongues provide normal exits.
- Frozen static bodies, attached Sticky frogs and Bubble Trouble captives retain their existing restrictions; jets do not override those controlling states.
- Vine and belt sources retain spring, soap or mud metadata. Tilt rotates the actual collision body and belt direction. Crumble removes the actual carrier, releases its tongues, and waits for safe regeneration at its current moving position.
- No modifier is added, retuned, made incompatible or removed. KEEP and voting are unchanged. Poison Tag, Freeze Tag and Classic Tag retain existing contact and scoring rules.
- No frog velocity/position is scripted by the CPU helper. CPUs read live platform geometry, lead moving landing points modestly, charge relative to carrier motion, and may use a nearby visibly warning/active shower route when a goal is above them. B1/B2 tactical goals and difficulty remain intact.

Lobby map cards now illustrate both shower columns, both hanging vines with movement arrows, and both opposing conveyor strips, using the same mechanic coordinates/tuning as gameplay. The short captions name these features; Sunny Pond’s postcard output is byte-identical.

## Verification and limits

The complete automated suite passes **611/611 tests**; the production build passes (the existing Phaser chunk-size advisory remains). Focused physics tests cover each mechanic, snapshots, exact moving grapple points, Tilt, occupied Crumble return, Sticky attachment, Gravity Flip, all 20 individual modifiers on all three updated arenas, and representative three-modifier combinations.

Independent WebSocket clients cover all three modes × three updated arenas × two/eight frogs (18 cases), including mixed CPUs and reconnect state. Existing CPU lifecycle checks cover voting/KEEP, host transfer, rematches, human replacement, pause/reconnect and cleanup.

Five deterministic 20-second CPU routes reached within the existing 0.85 m arrival threshold: shower-assisted Bathhouse ascent, riding/leaving a Canopy vine, crossing toward the other vine, and leaving both Toyshop belts. These are representative samples, not proof of optimal navigation from every position.

Eight-frog local server samples had p95 ticks of 1.26–1.52 ms and p99 of 2.03–2.64 ms. One Canopy tick took 32.36 ms during concurrent test load (one overrun); the other arena samples had none. Free Render cold starts and shared-machine scheduling remain separate from these local measurements.

Eight browser scenarios pass without page errors, including iPhone-user-agent Chromium emulation with simultaneous movement/action and independent touch releases on all four arenas. Desktop and mobile-landscape browser screenshots check water/rope/belt alignment, visibility and layout. Chromium mobile emulation is not a physical iPhone Safari or Android playtest. Human review of feel, fairness, long sessions and touch hardware remains necessary.

`scripts/signature-sunny-proof.ts` compares complete state traces across 23 deterministic Sunny Pond scenarios (normal, each modifier, two stacks) against the preserved baseline. Source-hash guards protect unrelated gameplay, cosmetics, inputs, music and UI.

## Measured energy change

A deterministic unchanged-input comparison against the preserved previous implementation measured: shower rise in 2.5 seconds **8.48 → 14.89 m**, upward speed after 0.2 seconds **5.2 → 18.8 m/s**, vine peak speed **1.06 → 3.22 m/s**, and neutral belt ride speed **2.135 → 3.935 m/s**. These are local scenario measurements, not promises for every collision/modifier combination. All five representative CPU routes still reached within 0.85 m; no CPU policy changes were needed.

## Manual playtest

1. Bathhouse: watch alternating buildup and flow, steer out of water, grapple while rising, and check soap; repeat with Gravity Flip and Bubble Trouble.
2. Canopy: stand still on both vines, charge/jump, grapple off-center from underneath, then try Tilt and Crumble. Check eight-frog readability.
3. Toyshop: ride each belt, run against it, jump away and check the upper sticky paint; try Butterfeet and Pogo Panic.
4. Join from a second browser, reconnect mid-cycle, complete rounds and KEEP voting, and try CPUs in all three modes.
5. Confirm Sunny Pond, cosmetics, floating multitouch controls, mouse/Space controls, settings and results still feel familiar.

## Recovery

Preserve all checkpoints. To roll back after publication, create a new revert commit for the signature-mechanics commit and deploy it through the existing service. Alternatively deploy the preserved checkpoint's SHA through Render's supported deployment controls. Do not reset or force-push `main`, delete history, recreate the service or modify its URL/configuration.
