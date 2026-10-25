# Desktop mouse controls — playtest candidate

Approved baseline: `770861b5dbdc94915514e622a83533d029759c67`.
Checkpoint: `checkpoint/pre-desktop-mouse-controls`.

## Controls

- WASD / arrows still move normally.
- While left-click is held, mouse aim points toward the cursor, including a stationary cursor as the frog moves. Mouse motion alone never changes keyboard aiming.
- Space always uses the existing WASD / arrow aiming. If Space and left-click overlap, keyboard aiming takes precedence until Space is released; the combined action remains held until both are released. No Q toggle is required.
- Left Click or Space uses the same jump/tongue action. Holding either keeps the action held; only releasing both releases it. A short grounded press/release jumps, a grounded hold charges, an airborne press fires, holding maintains/reels, and release detaches.
- Only mouse-pointer downs on the gameplay canvas start mouse actions. Touch/pen, right clicks, mobile synthetic mouse events, and UI clicks are excluded.

## Coordinates and transport

Every sample uses the actual canvas CSS rectangle, Phaser logical game dimensions and `camera.getWorldPoint()`. Camera-world pixels are divided by the existing 30 pixels per simulation unit. The normalized direction points from the rendered local frog to that world target. Parent margins, FIT letterboxing, fullscreen, resized canvases and DPR do not require guessed offsets or fixed screen coordinates.

The original x/y fields continue controlling movement and legacy aim. Two optional bounded fields, `aimX` and `aimY`, carry independent mouse aim. Both must be finite, within [-1,1], and nonzero together. Invalid commands are rejected before consuming their sequence number. Existing clients, keyboard/mobile inputs and CPU commands omit them and retain their previous behavior. Capture/restore and prediction already copy complete flat inputs.

Aim updates are prepared once per rendered frame and carried by the existing periodic 30 Hz transport. Action edges still send immediately. No extra mouse movement packets, client-authoritative grapples, physics tuning, range, speed, or force changes are introduced.

**Explicit user clarification:** normal mouse shots bypass the existing 8° assistance. While Magnet Mouths is active, its approved server-side assistance remains. Keyboard, mobile and CPU assistance are unchanged. No new targeting or homing system is added.

## Interruptions

Mouse ownership uses pointer capture plus window-level release, cancel and lost-capture handling. A mouse cancellation clears only that source; Space may remain held. The existing global clear path now also clears mouse ownership on blur, hidden tab, settings, phase changes, resizing/fullscreen, departure and disconnect. Repeated stale key events cannot re-arm an interrupted hold. Closing settings requires a fresh action press.

## Preservation and validation

Runtime changes are limited to the input adapter, input sampling, optional server validation/forwarding, input comparison, selecting the firing direction, and desktop control instructions. The simulation's launch, step, collision, grapple/reel and all subsequent physics functions remain byte-identical. All CPU, arena, mode, scoring, Chaos tuning, mobile control/viewport, audio and results sources are protected by `desktop-mouse-preservation.json`.

- 475 automated tests passed, including arbitrary angles, moving-frog/static-cursor vectors, jump/movement parity, combined holds, touch exclusion, snapshot restoration and the approved assistance policy.
- Real two-client Chromium gameplay passed in Poison Tag, Freeze Tag and Classic Tag: independent movement/aim, actual tongue direction, terrain attachment/reeling, charged jumps, outside release, Space keyboard aiming, rapid clicks, blur/menu/visibility cleanup, resize/letterboxing and fullscreen. Results interruption was directly exercised in Poison/Freeze; Classic uses the same shared clear path and its round lifecycle is covered by multiplayer integration.
- iPhone Safari-UA and Android Chrome-UA Chromium touch tests passed with actual CDP touch events: both ownership orders, independent releases, repeated floating controls, cancellation and synthetic mouse exclusion. This is not physical iOS/Safari testing.
- Independent WebSocket clients verified optional aim replication and rejection of malformed/partial/nonfinite/zero vectors without consuming sequence numbers, alongside legacy analog/keyboard inputs.
- See the multiplayer report for host transfer, reconnects, reservations, CPU voting/KEEP, rematches, all-mode lifecycle and eight-frog measurements. A concurrent-load stress run narrowly failed its unchanged p99 <8 ms assertion (Canopy 8.36 ms); performance was then rerun without other suites competing. No threshold or gameplay parameter was changed.

## Manual playtest

Try WASD + cursor + left click, including moving opposite the tongue aim; a charged jump; a terrain swing/reel/release; then move the mouse and confirm Space still aims using the arrow keys. Hold left click to use cursor aim again. Test mouse release outside the canvas, Escape while holding, and returning after changing tabs. Compare windowed/fullscreen aiming and briefly verify the approved mobile controls. Try Magnet Mouths to confirm its intentional exception.

Await user approval; do not begin unrelated work.

Final isolated compiled-server results: all 14 integration checks passed. Eight-frog normal-physics p99 ranged from 2.66–4.74 ms, with no overruns. The brief Chaos cases still recorded three overruns and a maximum case p99 of 20.72 ms; these local timing spikes are not a hosting-capacity or before/after performance comparison. No hosting settings were changed.
