# Post-M10 static-camera decision

User rejected the dynamic camera after physical playtesting: visible/finicky movement and close framing increased the sense of crowding. Frog-Out uses a stable static gameplay camera. Future physical arena-space/geometry exploration is deferred pending authorization.

## Recovery and history

Approved source: `cc0c09b8fa0e021f2195ec6b12848081f6d1cefa`, branch `checkpoint/approved-release-pre-m10`. Rejected experiment: `4b5b26d0a50f50fb36c255d8145a25a6a42d5d77`, branch `checkpoint/milestone-10-camera-prototype`. Both remain recoverable; restoration is an additive commit. New restoration checkpoint: `checkpoint/post-m10-static-camera`.

`src/main.ts` is restored byte-for-byte to the accepted release hash. Experimental camera model, Help/lobby A/B controls, camera CSS, camera-only browser runner and camera-algorithm tests are removed. Historical M10 design/report documents remain as experiment evidence, not current behavior. A new static-camera preservation test protects all accepted source hashes.

No M10 HUD changes were made independently of camera controls, so none are retained. No M10 geometry/bounds changes were made; both arenas remain exact approved versions. Sound/presentation, gameplay, physics, networking, scoring, reconnect, Android/desktop controls and physically accepted iPhone multitouch/viewport code are unchanged.

Automated mobile/WebKit checks are distinct from new physical-device tests. Physical iPhone acceptance belongs to the user-confirmed baseline; the restoration preserves that exact source. No new physical Android/iPhone test is claimed.

## Retest

Open the existing public URL; create/join, ready/start and test both arenas. Confirm the camera stays still during separation, charge launches and ceiling/frog grappling; no Camera prototype controls appear in Help. On iPhone landscape Safari confirm the accepted screen fit and movement+action remain intact through multiple rounds and orientation changes. No new content/arena-space work follows this restoration without approval.
