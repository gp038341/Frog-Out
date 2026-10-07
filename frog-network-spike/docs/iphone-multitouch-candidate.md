# Physical iPhone simultaneous-input validation candidate

Baseline: `955b77ed168bed9eb2e17cbb8c87d65ef63db2cc` (sound refinement).

Physical iPhone testers confirmed that either control worked individually but simultaneous movement/action was unreliable. This candidate is **not physical iPhone certification** and the release gate remains open.

## Identified defects and bounded correction

The native `touchcancel` handler reset the entire controller for any canceled touch anywhere in the document. A cancellation of the action finger therefore erased a still-held direction finger, and vice versa. This failure is reproduced against the exact pre-fix source in unit tests. Native start/end handling also inferred owner loss from a whole touch inventory; ownership now ends only for matching `changedTouches` identifiers. New downs reclaim the same control without resetting the other control. The native Touch Events path existed before the sound refinement; sound did not change it.

The exact physical Safari sequence causing the reported failure has **not** been captured. Partial cancellation is a demonstrated application defect, not proof that it explains every physical-device symptom. Testers must confirm the real-device outcome and export diagnostics if anything remains unreliable.

Only `src/input/touch.ts` changes at runtime:

- Independently match native end/cancel IDs to direction/action owners, publish the combined state once, and leave the other owner intact.
- Preserve pointer capture handling for mouse/pen, native-touch/pointer deduplication, eight-way input, and global neutralization on blur/visibility/orientation/viewport/session interruption.
- Suppress a cancelable Safari `gesturestart` only while gameplay has an active touch-control owner, preventing native two-finger gesture takeover of controls. No CSS, sizing, fullscreen or viewport code changes.
- Log active and changed native touch IDs, original targets and event cancelability in the existing bounded diagnostic history. No credentials or additional network messages.

The Touch Events specification defines `changedTouches` as the removed/canceled points for end/cancel: https://www.w3.org/TR/touch-events/#touchevent-interface. The implementation uses that lifecycle contract instead of treating a partial cancellation as a global interruption.

`docs/iphone-multitouch-preservation.json` freezes all other source/server/CSS/config/HTML files byte-for-byte. Historical preservation guards reverse only this documented touch adapter before checking their original baseline hashes.

## Validation scope

Unit coverage includes exact pre-fix cancellation reproduction; both thumb orders; either release; each owner's independent cancellation; unrelated cancellation; fresh recovery; held movement with 100 action presses/releases; held action while direction updates; old-owner events; capture failures; global interruption recovery; and unchanged simulation/authority rules.

`scripts/iphone-multitouch-browser.cjs` uses actual Linux Playwright WebKit with trusted single taps and synthetic native two-thumb events. It checks both normalized and authoritative server input, charged launch, terrain grapple/release, both start orders, direction changes, independent cancellation, 20 repeated action presses with movement held, 180-second event stress, reconnect and two complete matches/rematch. Toolbar rectangles are mocked. It is not physical Safari gesture delivery.

`scripts/iphone-multitouch-chromium.cjs` runs desktop plus phone/tablet emulation with trusted CDP touch events and real WebSockets. It fixes test-only touch-end dispatch, short-lived velocity sampling and an obsolete diagnostic milestone assertion; it does not change product behavior. No physical Android retest is claimed.

Existing lifecycle and both-arena 2/3/4/8-client tests also run. Reports are stored under `docs/results/iphone-multitouch-*` separately from historical reports.

## Physical iPhone procedure (required)

1. Refresh the public game in ordinary landscape Safari. Join a desktop player's room and play several consecutive rounds. Fullscreen is not required or changed.
2. Hold left-pad movement continuously and tap action ten times. Hold movement while charging, then release only action: movement must continue. Repeat with action touched first.
3. Aim/move while firing and holding a tongue; change direction without releasing action; release the grapple without lifting movement. Then lift movement while holding action: only direction should stop.
4. Slide each thumb outside its control and back; lift just one finger; repeat quickly. After switching tabs/orientations, start fresh touches and verify control returns.
5. Continue for at least five minutes across multiple rounds, checking that neither thumb steals/cancels the other.
6. If it fails, open the same public URL with `?diagnostics=1` for the Input monitor. Capture the owners, local input, sent/ack sequence and server input/tick. Press **Diagnostics** and send the downloaded JSON with iPhone model, iOS version, browser, thumb order and a short screen recording. Capture evidence before refreshing; do not send credentials.

Do not mark this P0 resolved or begin other feature work until physical iPhone testers confirm simultaneous control under the previous failure conditions.

## Candidate test results

- Build/TypeScript and 73 unit tests passed, including exact old-source reproduction and complete frozen-source hashes.
- Chromium mixed-device regression: 15 checks passed, zero page errors; four-client and phone-only full match flows.
- Hybrid controls: 15 repeated keyboard/touch switching cycles across grounded, airborne, charging, terrain and frog grappling; ten-second steady hold, capture fault recovery, desktop/touch sizing and reconnect passed. Long hybrid loops were disabled; long native event stress ran separately in WebKit.
- Actual Linux WebKit: 16 checks, 217 synthetic two-thumb cycles over approximately three minutes, advancing authoritative input acknowledgements/ticks, two complete matches, zero page errors. Single touchscreen taps were trusted; multi-finger events and interruptions were synthetic.
- Both arenas with 2/3/4/8 WebSocket clients and all 16 connection lifecycle checks passed, including actual 30-second timeout.

Initial runs exposed stale test harness assumptions: an old synthetic cancel used an unrelated ID, the mixed-device harness sampled a transient velocity in a later frame, and its diagnostic assertion still expected Milestone 6. The candidate runners correct those fixtures without changing product mechanics. A long hybrid runner also encountered a results/hidden-control race; its focused switching/capability pass was rerun with long loops disabled, with the long stress covered separately by WebKit.
