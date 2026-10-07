# P0 physical-iPhone Safari reliability — diagnostic candidate, NOT confirmed fixed

Content development is paused. Baseline before this correction: `857a03bdf3d62f174ca87fcf9fc2821553ebb81b`; deployed arena refinement: `cfc7601a2a320a7d03c3a1cad90b789467263b46`, recoverable at `checkpoint/milestone-8-refinement-playtest`. No maps, art, physics, authority, lobby lifecycle, Outbreak or scoring changes in this pass.

## Three separate conclusions

**Fullscreen:** method availability alone is not enough. The prior prefixed condition accepted an undefined capability flag; the candidate requires a callable document-root method AND a positively enabled corresponding capability. No UA-based assumption, video-only fullscreen or automatic fullscreen. Unsupported browsers get a short browser-view hint. Normal Safari is the primary phone flow. Fullscreen absence is not itself a gameplay failure.

**Viewport:** the previous layout used visual height but layout width and unadjusted page coordinates. It ignored visual offsets and visual scroll events. These are confirmed code defects; reduced/shifted visible rectangles could leave controls/canvas outside the actually visible region. Active gameplay now anchors to visual width/height/left/top with safe-area padding, subtracts actual HUD/footer space and maintains Phaser FIT aspect ratio. ResizeObserver and visual resize/scroll/orientation signals update in an animation frame; the existing UI interval is a secondary measure, not an input watchdog. No requirement to hide Safari chrome, no scroll-to-hide hack and no Add to Home Screen requirement. DPR remains a reported device characteristic; physics/render world dimensions are unchanged.

**Freeze:** the physical testers' exact freeze has NOT been captured in diagnostics and its root cause is NOT yet established. Prior pointer-only finger handling depended on Safari continuing to dispatch pointer events after browser interruptions; landscape control relocation did not neutralize held input. A reproduced WebKit rotation race showed a queued resize frame clearing a fresh finger that arrived after the viewport event. Input neutralization now happens synchronously when viewport state changes; deferred rendering only sizes the canvas. A live readiness gate accepts a fresh finger immediately rather than waiting for the UI interval. This reproduces one apparent loss-of-control path, but does not prove it was the testers' long-session failure. The candidate removes pointer capture from the native finger path and explicitly neutralizes layout interruptions. These are justified reliability changes, not proof of the reported physical failure's cause. They predate M8; evidence does not establish that M8 introduced the reported freeze.

## Input lifecycle

Touch-capable browsers use native touchstart/move/end/cancel with stable Touch identifiers. Only native Touch Events publish finger input; associated Pointer Events are ignored, preventing duplicate action edges. Mouse/pen and environments without native Touch Events keep pointer handling and document-level fallback. Two thumbs own movement and action separately; moving outside the original control continues through document capture, with fresh coordinates from its current rectangle. Native end reconciles active finger inventory; a fresh start clears an orphan even if its old end was lost. Cancel, blur, hidden/pagehide, orientation, dialogs and actual viewport relocation neutralize inputs/owners. New finger down can reclaim control; players should lift/re-touch after a cancellation. No timeout-based input reset, forced reconnect, respawn or physics change. Recaptured pointer ownership ignores obsolete lost-capture notification while a fresh capture is held.

Game-only touch-action/overscroll/gesture protections prevent normal control gestures from scrolling/zooming the page. Help/lobby remain scrollable and normal page accessibility is retained. Existing page zoom is handled by the available visible rectangle rather than forcing a global user-scalable=no policy.

## WebKit startup compatibility findings

Actual Linux WebKit testing also surfaced exceptions before play: Phaser initialized an unused audio manager even though Frog-Out uses its own opt-in `GameAudio`; it failed on the headless machine's unavailable audio device. Phaser's unused audio manager is now disabled; the approved opt-in cues/controls are unchanged. This is not proof of a physical iPhone audio failure.

Pinned Colyseus 0.16.22 first tries Node-style WebSocket options in a browser and catches the invalid-protocol constructor before retrying standard browser arguments. WebKit still reported the invalid probe. A narrow Vite build/dev adapter substitutes exactly the already-successful standard browser constructor for that one SDK file. It doesn't change packet formats, room/input authority, prediction, timing, reconnect or server code. Unit tests verify the actual pinned CJS/ESM files and fail on unexpected versions; Node test/server SDK files are untouched. No SDK upgrade/global WebSocket replacement.

## Physical-device diagnostics

During gameplay tap **Input monitor** to enable/disable a small non-intercepting panel. The ordinary **Diagnostics** button exports a JSON file. Optional `?diagnostics=1` enables the panel from page load; no special URL is required. No automatic telemetry upload and no reconnect tokens/credentials in exports.

Panel/export include layout/visual dimensions, offsets, scale, orientation, DPR/browser version, control/canvas bounds, recent viewport causes, native finger inventory/owners, recent touch lifecycle/coordinates, normalized input, send attempts and actual transport sends, sequence/time, acknowledgement/time, snapshot age, tick progress, authoritative input/position/velocity, connection state and correction history. Existing server snapshots provide acknowledgement and applied input; there is no server protocol/authority change.

Interpret **during PLAY**, not announcement/countdown/results:
- Finger events missing or owners/local input neutral despite touching controls: layer A, hit testing/input/browser interruption.
- Local input changes but actual sent sequence/time stalls: layer B, client scheduling/transport gating. If sends advance but acknowledgement stalls, inspect connection/snapshot age.
- Acknowledgement and ticks advance but authoritative input is neutral/different: delivery/acceptance evidence; retain export for diagnosis.
- Server input agrees and ticks advance but position/velocity do not behave normally: layer C, authoritative movement/contact evidence. A frog resting against a wall is not by itself a simulation freeze.
- Snapshot/tick ages grow: network/server/client delivery may have stalled; capture both players' diagnostics if possible.

## Test scope

65 unit tests include native two-thumb separation, missing end, native cancel, viewport/focus/page interruptions and fresh touch recovery. Strict inverse edits keep historical approved hashes intact and a new preservation guard locks current maps/graphics/physics/rules/authority. Existing Chromium/CDP suites exercise trusted multi-touch, jumps, terrain/reciprocal frog grapple, cancellation, responsive layout, Help, orientation, reconnect and full matches.

The new `scripts/iphone-reliability-browser.cjs` uses actual Linux Playwright WebKit 26.0/build 2248, real local authoritative physics/WebSockets, trusted single touchscreen taps, synthetic native multi-finger/interruption events and mocked visual viewport toolbar/zoom rectangles. Local test-only body arrangements and shortened intros are labelled; infection/grace/scoring remain production rules. Default stress duration is 180 seconds. It is NOT Safari's iOS shell, UIKit gestures, real notches, hardware performance or physical browser chrome.

WebKit setup in this execution environment required locally extracted official Ubuntu runtime libraries because ordinary apt installation was unavailable. Host requirements validation was skipped after supplying libraries because its global ldconfig inventory did not see the local GLES library; WebKit itself then launched and executed. No application dependency, hosting resource or paid service was added.

Useful runtime sources: https://webkit.org/blog/9674/new-webkit-features-in-safari-13/ (Pointer/Visual Viewport APIs); https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport ; https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenEnabled . These do not certify a tester's exact iOS version.

## Physical iPhone test procedure (release gate)

1. Record iPhone model, iOS version and browser. Open the public URL in a normal Safari tab, refresh, use landscape with browser chrome visible. Do not install/add to Home Screen or require fullscreen.
2. Create/join with a desktop friend. Start both maps. Confirm both virtual controls, complete arena and footer fit when Safari toolbars are expanded/collapsed. Open/close Help, rotate portrait/landscape, and return from another app/tab.
3. Enable **Input monitor**. Play at least 10 continuous minutes and several rounds/matches: rapid taps, full charge releases, terrain swings, frog-to-frog pulls, simultaneous two thumbs, fingers sliding outside controls, repeated lifts/re-touches. Include browser chrome changes while holding controls. Existing approved gameplay should feel unchanged.
4. A browser interruption may safely release held controls. After it, lift both thumbs and touch again; controls must resume without reset/reconnect/respawn. Check refresh restores the existing frog; reconnect remains the existing 30-second policy.
5. If responsiveness fails, first record the monitor for 5–10 seconds while trying movement/action. Note whether local input, sent/ack numbers, server input and ticks advance. Then lift/re-touch. **Before refreshing**, tap Diagnostics and save/send the JSON (Safari may open/share/download it differently). If export is inaccessible, send a screen recording/screenshot with monitor and timestamp. Ask the desktop peer to capture Diagnostics too.
6. Send device/iOS/browser, map, approximate elapsed time, exact interruption/actions, screen recording and exports. Report whether the next touch recovered without refresh. Never send private credentials.

Physical testers must repeat the prior failing conditions successfully before this P0 is called fixed. Physical Android retesting, high-player-count small-screen readability and Render Free cold-start risk remain outstanding. Stop content development pending reliability confirmation.
