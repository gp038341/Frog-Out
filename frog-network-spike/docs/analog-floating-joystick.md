# Analog floating joystick candidate

Approved baseline: `6be4186b2b1e6ce7e25b7748d64520c353651311`, checkpoint `checkpoint/approved-main-audio-settings`.

## Implementation

The old UI rounded angles to eight sectors, and the server accepted only integer axes. Touch now produces continuous radial x/y values with magnitude at most 1. Full deflection is 65% of the visual base radius; the radial dead zone is 15% of that travel, followed by a continuous linear intensity ramp. The server accepts finite axes in [-1,1] using the existing input schema, queues, sequencing, acknowledgments and prediction. Legacy keyboard/CPU inputs, including (1,1), stay unchanged. Horizontal movement uses x; aiming normalizes the full vector through the existing simulation. No diagonal speed boost, physics constants, or grapple tuning were introduced. Facing remains sign(x), rather than accidentally becoming a fractional facing/neutral tongue direction.

The transparent movement area covers the left 28% of the existing gameplay stage. It does not alter the viewport, canvas, safe-area grid, or right action lane. A valid initial touch defines the input origin; no movement is emitted until dragging. The origin stays fixed until release/cancellation. The visual base is kept inside the movement region at edges, while the input origin remains the actual initial touch position, so an edge touch is still neutral. The knob follows continuous displacement with bounded travel. Release restores neutral and the resting visual. Native Touch identifiers and pointer fallback retain independent action/movement owners. Additional movement fingers do not steal an active owner. Native missing-end recovery checks the browser's current touch inventory; existing blur/visibility/orientation/viewport reset paths remain.

Settings, lobby, voting and customization remain outside the movement region; existing canPlay/modal checks gate input. No new control gesture or action button was added. The touch controls description now explains free aim and touch-then-drag; desktop instructions are unchanged.

## Validation

387 automated tests pass. Focused current-controller tests cover arbitrary angles, edge starts, fixed centers, outside-area motion, independent native/pointer ownership and cancellations, 100 repeated action taps with held movement, jump charge/release, airborne tongue holding/release, interruptions, repeated resets, and source preservation. Historical fixed-pad tests retain their original baseline separately. Two independent WebSocket clients confirm analog axes/action edges survive the real authoritative pipeline, invalid values are rejected, and legacy diagonals remain accepted. The existing Bot C network suite exercises all three modes, all four arenas, mixed eight-frog rooms, reconnects, voting/KEEP and rematches. Production build passes with the existing large-bundle warning.

No physical iPhone/Android test is claimed. Event-model tests and desktop forced-touch-layout inspection do not establish physical Safari/Chrome acceptance. Test normal landscape browser chrome, edge thumb starts, repeated two-thumb jump/charge/tongue/grapple sequences, releases/cancellations, settings open/close, orientation and reconnects on actual devices before approving this candidate. Long strings in the optional diagnostics can show fractional axes; diagnostic UI is otherwise unchanged.

## Manual acceptance

1. In landscape on each phone, touch several positions in the left area. Each new touch begins neutral; drag at shallow and unusual angles and check smooth knob/aim movement.
2. Hold the same movement touch and tap action repeatedly; charge/release a jump, fire/hold/release a grapple, and reverse movement while action remains held.
3. Drag outside the left region. Only the original finger should steer. Release/cancel one thumb while keeping the other active.
4. Open/close Settings, rotate and return, background/foreground, reconnect, and play consecutive rounds. Fresh touches should immediately work without stale movement.
5. Verify desktop WASD/arrows+Space, CPU matches, arenas and Chaos remain unchanged.
