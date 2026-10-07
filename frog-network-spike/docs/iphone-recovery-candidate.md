# P0 iPhone recovery / physical diagnostic candidate

## Status and comparison

Previous physically reported good screen fit (multitouch still broken, revised sound present): `955b77ed168bed9eb2e17cbb8c87d65ef63db2cc`.
Failed physical-device candidate: `a86c5f0b9feb439b0f555f035f83a89ab390fe0a`.
This recovery is a new additive commit, not a history rewrite. **Neither iPhone screen-fit recovery nor multitouch acceptance is physically verified.** No further iterations/content work until tester evidence returns.

`iphone-recovery-focused-diff.patch` contains the complete previous-to-failed runtime diff. GitHub commit comparison confirms the only runtime file changed was `src/input/touch.ts`; twelve other files were tests, runners or documentation. Existing sound, CSS, canvas/Phaser configuration, viewport sizing, orientation listeners, safe-area rules, HTML and networking were unchanged. Existing frozen-source hashes independently verify that claim.

## Failed pass changes and recovery

| Area | Previous → failed | Recovery |
|---|---|---|
| Native start | Removed missing-owner inventory cleanup | Retain independent owners; no additional ownership workaround |
| Native end/cancel | Match changed identifiers; prevent owned-event default; explicit nonpassive capture | Keep proven per-ID cancellation safeguard; remove end/cancel default prevention and restore original capture listener policy |
| Safari gesture | Added a capture-phase, nonpassive gesturestart preventDefault | Remove that new interceptor entirely |
| Event metadata | Added changed IDs/targets/cancelability | Retain and expand passive observation |
| CSS/canvas/viewport/orientation/safe areas/fullscreen | No changes | No sizing/layout redesign; retain previous revision's source |

The new gesture interception and end/cancel default prevention were the only changed browser-default policies and are **suspects**, not confirmed causes of the reported viewport regression. Restoring those policies does not certify physical iPhone fit. The same Safari/browser-chrome conditions must be repeated physically.

## Newly reproduced application defect

The complete trace uncovered an older handler in `src/main.ts`, present in both comparison revisions: every Safari `gesturestart`/`gesturechange` during gameplay called `clear()` and `viewportChanged(event)`. Thus a two-finger gesture notification cleared both normalized controls, even though browser fingers remained down, and unnecessarily requested viewport work.

`scripts/iphone-gesture-evidence.cjs` reproduces this in actual Linux WebKit with real authoritative clients and a **synthetic** gesture event: before `(x=1,y=0,held=true)` became `(0,0,false)`. The smallest justified correction removes those two side effects while retaining the existing gameplay-only `preventDefault` policy against zoom. Actual resize/visualViewport/orientation events still execute all existing safety neutralization and sizing code. No new fullscreen system, CSS, camera or physics changes.

This is a demonstrated handler defect, **not proof that this is the physical iPhone event sequence**. Diagnostics must establish whether Safari emits gesture notifications in the failing two-thumb scenario. The previous pass concentrated on cancellation and missed this separate main-level global reset; its synthetic touch tests did not trigger Safari gesture events and therefore did not test that path.

## Architecture audit

- Phaser 3.90 defaults to `input.activePointers=1`. No gameplay control reads Phaser pointer state: left/right controls are DOM elements outside the canvas, feeding the DOM adapter directly. Therefore increasing Phaser's pointer count is not justified by this code path. Phaser has unchanged canvas listeners and window touch bookkeeping; the browser trace can reveal propagation/targets.
- Native touch path deliberately ignores duplicate touch Pointer Events (`ontouchstart` detection), processes Touch Events with nonpassive capture on start/move, and has distinct movement/action source IDs. Mouse/pen use the unchanged capture/document fallback path.
- A fresh down replaces only the same control owner. Per-ID pointer cancellation/end releases only its matching owner. Native cancellation remains per-ID. Global blur/hidden/pagehide/orientation/usable-viewport/session interruptions clear both as intended and permit fresh downs.
- Shared normalized input represents `{x,y,held}` simultaneously; keyboard and touch are combined independently. Client immediately transmits changed normalized input and periodically sends the same state with increasing sequence. Server authoritative input/ack/tick appears in snapshots. Those implementations are unchanged.
- Existing CSS uses `touch-action:none` on gameplay and control regions. No passive setting, capture behavior, focus management or DOM geometry is changed except rollback described above and strictly passive diagnostic observers.

## Diagnostic candidate

Enable **Input monitor** during gameplay or append `?diagnostics=1` to the normal public URL. The overlay does not receive pointer events or consume layout space.

It displays:
- browser-reported touch count and IDs, pointer IDs, last touch/gesture event, target and changed IDs;
- movement/action owner IDs separately, raw adapter direction/action and normalized combined input;
- cumulative cancellation count and last cancellation (persists after fresh touch);
- connection/playing state, sent sequence/age, acknowledgement/age, snapshot/tick age;
- authoritative frog input, position and velocity;
- layout versus visual viewport dimensions, offset and zoom.

Passive capture observers see browser events before game handling and do **not** call preventDefault, set pointer capture, change focus, input or layout. Native point coordinates/original targets and lifecycle history are exported by **Diagnostics**. Movement logs are sampled (250ms); lifecycle/gesture events are kept in the existing bounded 200-entry history. Existing sample/viewport traces remain available. No credentials/tokens are added.

### Interpret a failing test

1. Browser touch count/IDs remain one: Safari has not delivered the second touch to the document. Capture last event, targets, viewport/zoom and any gesture/cancel.
2. Two browser IDs but absent ACTION/MOVE owner: loss occurs in event routing/eligibility/ownership. Export the report.
3. Both owners/raw inputs correct but normalized input wrong: normalization/focus/playing eligibility.
4. Normalized input correct but sequence/ack stalls: transport/server input acceptance.
5. Server input correct and tick advancing but frog not moving: authoritative gameplay/physical constraints. Position/velocity distinguish this from input loss.

## Physical iPhone procedure — mandatory

Use ordinary landscape Safari; do not require fullscreen. Refresh once to load the candidate, join another device and start Outbreak. First assess screen fit **with monitor off**, with Safari chrome expanded/collapsed and after orientation return. Then enable the monitor.

Record a screen video and say which thumb touched first. Hold movement; tap action ten times; hold/release a charge; fire/hold/release tongue while aiming. Repeat action-first, change movement while action stays held, lift just one thumb, slide off controls. Play five minutes/multiple rounds; open/close Help and leave/return to Safari. After interruption, fresh touches should regain control.

At the failure, keep both thumbs down long enough to capture browser count/IDs, owners, raw/local input, event/cancellation and sent/ack/server state. Lift only action, retouch action with movement still held, then reverse. If practical have a second person record the screen while both thumbs are held. Export **Diagnostics** promptly after capture and before refreshing. Send JSON/video plus model/iOS/Safari version, thumb order and browser chrome/orientation state.

No physical iPhone or Android test is claimed by the developer tooling. Physical iPhone screen fit AND simultaneous gameplay remain P0 release gates. Do not continue features after deployment until physical results return.

## Automated validation results

Build and 75 unit tests pass; independent frozen-source hashes preserve sound, physics, rules, authority, CSS and viewport math. Final Linux WebKit: 17 checks, 217 synthetic two-thumb cycles over three minutes, 20 synthetic gesture pairs preserving both local/server input, two full matches/rematch, zero page errors. Chromium desktop/phone/Android-size/tablet: 15 final checks, zero page errors. Focused hybrid regression: 15 switching cycles plus steady hold, cancellation/capture faults, layout/fullscreen capability checks and reconnect. Long hybrid loops were disabled; WebKit covers the long synthetic session. Lifecycle 16 checks (actual 30-second timeout), both arenas 2/3/4/8 clients, Outbreak and 50/100/150ms loopback delay tests passed.

Two Chromium runs timed out waiting for a brief close-frog attachment. The recovery runner checks retained authoritative snapshot history and adds failure diagnostics; the subsequent run and separate hybrid frog-grapple tests passed without another product change. The failed runs did not capture enough state to prove a harness-only cause. This intermittent automated assertion is recorded, not hidden or treated as physical reliability evidence.

Evidence is in `docs/results/iphone-recovery-*`. Earlier candidate reports remain untouched. Synthetic gesture before/after proof is separate from physical iPhone evidence, which is still required.
