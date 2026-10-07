# Milestone 6 mobile reliability correction — awaiting physical-device acceptance

Previous public revision: `6de0286a4c43d2a0626966e90746bb9a40cd4d80`. Preserve this revision and the approved Milestone 5 checkpoint. No visual or arena redesign, physics tuning, network protocol/authority/prediction change, or game-rule change is part of this correction.

## Diagnosis and scope of confidence

The old touch controller had two reproducible layer-A failure mechanisms:

* After a missing pointer end/cancel/capture-loss event, it retained the old owner ID. Every subsequent pointerdown on that control was rejected. A fresh finger could not reclaim the control.
* It assigned the owner before an unguarded `setPointerCapture`. A capture exception left an owner without publishing the new input, and later touches were rejected. Release exceptions could also interrupt a reset.

Fault-injection regression tests reproduce both failures using the old deployed source and verify recovery using the corrected source. These mechanisms existed in the Milestone 5.1 touch controller; its hash was unchanged in Milestone 6. This establishes defects in the prior implementation, **not proof that every reported physical-phone freeze had this cause**. No real affected-device trace was available. The added diagnostics are intended to distinguish any remaining causes.

Every landscape window resize previously cleared touch ownership, including ordinary mobile browser viewport changes while fingers remained down. Such fingers could not produce direction again until lifted/repressed. That interruption is removed for landscape resize; portrait/orientation interruption still safely releases controls.

Inspection found gameplay reveal overlays have `pointer-events:none`, and the touch controls remain outside the arena canvas. No overlay, input-ack rejection, or authoritative simulation freeze was reproduced in the successful tests. Server authority and networking source remain byte-for-byte unchanged.

## Fix

* Fresh down reclaims the control's previous owner; delayed old end events cannot clear the new owner.
* Capture/release errors are caught and logged; logical ownership/input cleanup is independent of capture success.
* Document capture listeners track owned pointer movement and end/cancel/capture-loss events, including events delivered outside the original control.
* Each thumb releases independently. Held controls are not expired by an arbitrary timeout.
* Blur, hidden tab, pagehide, orientation and inactive/portrait transitions clear touch input. Fresh touch restores control without changing player identity, respawning or initiating a reconnect.
* Landscape viewport resize reflows the existing layout without discarding valid held pointers.

## Diagnostics: A / B / C

The Diagnostics download adds the last 200 touch lifecycle/hit-target events (including reset reasons and capture errors), current owners/gates, normalized client input, sequence/ack, snapshot age/tick and authoritative frog state. The bounded recent sampling history contains normalized and authoritative input plus sequence/ack/tick. No reconnection token is exported. Download URLs remain alive for 60 seconds to allow mobile browsers to consume the file.

* **A:** touch-hit/down events or owners stop updating, controls are inactive, or touch and normalized input disagree. Hit targets help identify an intercepting overlay.
* **B:** normalized input changes but acknowledgements/state age stop advancing or authoritative input does not follow. Include connection status and sequence/ack history.
* **C:** fresh snapshots acknowledge and contain the intended input, but the frog remains unresponsive. Include frog position/velocity/grounded/charge/tongue and a screen recording; physical collision/rope constraints can legitimately limit movement.

## Fullscreen and viewport

User-initiated standard fullscreen remains supported. Prefixed WebKit request/exit/events are now supported when the API is enabled. A disabled standard API does not fall through to an unenabled legacy API. No forced fullscreen. Unsupported browsers show explanatory text instead of a broken button; restricted requests produce a readable notice and ordinary play continues.

The existing visualViewport sizing, aspect-preserving Phaser FIT, modern `dvh`, safe-area padding, landscape prompt and disjoint touch targets remain unchanged and protected by hashes. The footer's unsupported message participates in existing responsive height measurement.

Platform expectations are capability-based, not user-agent-based:

| Configuration | Expected behavior / verification limit |
| --- | --- |
| Android Chrome with enabled element fullscreen | Enter/exit control; standard API exercised in Chromium. No physical Android device tested here. |
| iPhone Safari / WebKit-based iPhone Chrome without element fullscreen | Explanatory fallback, landscape viewport; video-only fullscreen is not suitable for this interactive game. No physical iOS browser tested here. |
| iPad/tablet browser exposing standard or prefixed element fullscreen | Enabled API gets a control. Prefixed-only path tested with an isolated capability stub, not actual Safari. |
| Embedded browser or policy-restricted API | Unsupported fallback or readable rejected-request notice. |

WebKit still tracks element fullscreen on iPhone as an unresolved request, including 2026 discussion: https://bugs.webkit.org/show_bug.cgi?id=206854 . Its separate non-video prefixed API request was closed in favor of that issue: https://bugs.webkit.org/show_bug.cgi?id=212934 . Actual device/runtime capabilities decide the UI.

## Testing and limitations

See `docs/results/mobile-recovery-browser.json`, `mobile-correction-mixed.json`, `mobile-correction-lifecycle.json`, and `mobile-correction-outbreak.json`. The trusted-touch stress script defaults to five minutes of repeated two-thumb cycles with authoritative input/ack checks and native cancellation/slide-off tests, followed by two minutes without a world reset or reconnect. Test-only body arrangements isolate scenarios during the first segment; they are not enabled on the public service.

Chromium emulation covers 844×390 and 667×375 phones, 1024×768 tablet, 568×320 small phone and 1280×900 desktop. These are **not physical iOS Safari/Chrome or Android Chrome acceptance tests**. Actual browser gestures, OS interruptions and hardware characteristics require the user's physical-device retest.

An initial concurrent legacy mobile suite missed a transient latest-snapshot jump-velocity assertion. A repeat passed; the correction-specific suite checks the authoritative snapshot history for the current reset instead of depending on a narrow render-frame window. Initial long runs reached the fullscreen checks but did not pass the complete suite. The unsupported capability stub needed to disable both standard and prefixed flags to represent a truly unsupported browser; the prefixed-only exit path also needed to use the prefixed exit API rather than a present-but-inactive standard API. Those checks and paths were corrected before the final rerun. A hybrid grapple fixture originally spent time changing layouts after spawning two falling frogs. Recorded snapshots showed the committed horizontal tongue correctly missing a rapidly falling target, rather than an input failure. The fixture now changes layouts before arranging bodies and minimizes pre-fire settling, while checking recorded attachment snapshots. These initial failures are not represented as passes.

## Physical-device stress checklist

1. Reload the public URL after deployment; create/join a room from a desktop and at least two phones where available. Ready/start normally, landscape, initially without fullscreen.
2. Play for **10–15 minutes**, including multiple rounds. Keep one thumb moving/aiming while repeatedly tapping, holding/releasing charge, grappling terrain and other frogs.
3. Slide both fingers off their controls and lift them; start new touches. Cancel/interruption should release input; a new touch must work. Test stationary long holds too.
4. Rotate portrait → landscape; switch tabs/apps and return within 30 seconds; test fullscreen enter/exit if offered. Confirm no duplicate frog, respawn, stuck input or unexpected disconnect.
5. Repeat on iPhone Safari, iPhone Chrome and Android Chrome, plus tablet if available. On unsupported fullscreen browsers confirm the explanatory text, visible arena and usable controls.
6. If a freeze occurs, **download Diagnostics before refreshing**, try fresh touches and download again. Send both JSON files, device model, OS/browser versions, approximate time, what fingers were doing, and a short recording if possible. If download opens a preview, use the browser's save/share option.

The existing Free Render service is reused. Milestone 6 remains unapproved; stop after correction deployment for the user's acceptance test.
