# Mouse-action priority, stable tag HUD and Freeze Tag recovery — playtest candidate

Baseline GitHub and live Render: `1d365c9646f4b4caed6e138bf48c901e443e19b7`.
Preserved as `checkpoint/pre-mouse-classic-freeze-corrections`.

## Scope and causes

1. The original desktop adapter retained a mouse-aim mode after releasing click. This let cursor movement override Space's legacy directional aim. Mouse aim now exists only while mouse action is held; Space always wins aim selection when both are held. The existing OR policy for the action itself remains: release both to end it. Hovering never affects Space. UI/touch guards, coordinate conversion, pointer cleanup and mobile controls are unchanged.
2. Classic Tag writes a one-second protection message into `infection-feedback`. The existing empty-message CSS removed that block entirely when it expired. On desktop it was still in layout, so every tag added/removes a row and Phaser FIT rescaled. The block is now an absolute, noninteractive overlay on all gameplay layouts. A bounded, single-line IT label also prevents player-name wrapping. The camera, world size and mobile viewport pipeline are unchanged.
3. Frozen frogs are static colliders. The generic obstruction path always attempted a very short jump and resumed the same route, even under a low overhang. Ice blockers now receive a proper charged clearance jump; a repeated blockage backs away and selects a reachable elevated detour using the existing navigation graph. Jumping, steering and grappling still use ordinary normalized inputs. Failed rescues previously ignored the existing failed-target cooldown; now they honor it. Rescue selection accounts for visibly approaching teammates and independent seeded preferences. Freeze escape commitments are refreshed after four seconds rather than ten; other modes' timing is unchanged.

## Validation

- 481 automated tests pass, including exact unrelated-runtime preservation, intentional tagging contact, low-overhang ice detours, rescue cooldowns, independent decisions and unchanged five-press Bubble Trouble escapes.
- All 14 compiled-server multiplayer checks pass, including all three modes, reconnect/pause/resume, host transfer, CPU replacement, voting/KEEP, rematches and eight Chaos combinations. Eight-frog normal-physics p99 is 1.03–2.12 ms across all four arenas, with zero overruns; the tested Chaos cases also record zero overruns.
- iPhone Safari-UA and Android Chrome-UA emulated multitouch pass. One initial Android harness attempt began touches during the initial layout transition and timed out; waiting for the initial control layout to settle makes both pass. No production mobile control changes were made. This is Chromium emulation, not physical-device testing.
- Production build passes; the existing large Phaser bundle warning remains.
- Real two-client browser gameplay passes all three modes: mouse aim, Space directional aim after mouse use, combined holds, grounded charging, actual terrain grapple/reel/release, outside release, menu/focus/visibility cleanup, resizing and fullscreen.
- The browser reproduces the previous HUD error by temporarily restoring its old in-flow style: canvas 1420 × 798.75 at (10,59) becomes 1397.33 × 786 at (21,70), then returns. With the fix, all three measurements remain 1420 × 798.75 at (10,59).
- A deterministic low-roof ice obstruction remains blocked for the full 15 seconds in the exact previous controller. All three tested seeds now back away, traverse the roof and pass the obstacle in 5.5 seconds. Open-air frozen obstacles remain traversable.
- Twelve eight-CPU Freeze Tag scenarios per version cover all four current arenas with matched seeds and original controller fixtures. Shared destination pairs fall from 29.2% to 24.0%; average distance rises from 912.6 to 921.2 simulation units; freezes rise from 4.17 to 4.67 and rescues from 4.75 to 4.92. There are zero controller exceptions. These are short deterministic simulations, not proof of human-level competitiveness.
- Excluding frozen, trapped and charging frogs, stationary samples increase from 4.38% to 5.52%; mean per-run longest pause increases from 0.85 to 1.29 seconds. The focused bottleneck is fixed, but this does not establish a general reduction in all stationary behavior or eliminate every camping case. No physics or difficulty values were changed to improve a metric.

See the committed browser, behavior and multiplayer reports for exact results. Local timings do not establish Render hosting capacity. Physical iPhone testing remains with the owner.

## Owner playtest

- Move the mouse to one side, then use Space + arrow keys to fire the other way. Click to fire toward the cursor. Try overlapping Space/click and release them independently.
- In windowed Classic Tag, pass IT repeatedly and wait for each protection window to expire; the arena should stay still.
- In Freeze Tag, block a freezer with a frozen frog near a platform. Observe it jumping over or backing away to detour. Test several CPUs for independent escape/rescue routes.
- Briefly check existing mobile controls and all three modes.

Stop for owner approval after deploying this candidate. No unrelated bot milestone, modifier tuning or UI redesign is authorized.
