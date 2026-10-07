# Milestone 10 — bounded arena camera prototype

## Accepted release checkpoint

The user physically accepted iPhone simultaneous multitouch and ordinary Safari viewport/layout, plus current sound/presentation and the existing gameplay, Android/desktop input and multiplayer systems. The accepted source/deployed revision is **cc0c09b8fa0e021f2195ec6b12848081f6d1cefa**, preserved as **checkpoint/approved-release-pre-m10**. GitHub main and live Render were verified to match before prototype development. Render deployment: dep-db3a1n3ncjis73euqisg, service frog-out-milestone-2, Free, My Workspace. Historical candidate documents remain historical; their outstanding iPhone flags are superseded by this user acceptance.

M10 is a prototype pending playtest, not an approved replacement for this release.

## Implementation

One client-side bounded camera consumes all authoritative frog positions, a 100ms capped velocity lookahead and active tongue tips. Predicted/rendered frog positions are included only as an additional visibility envelope. Disconnected roster members are included. Physics, snapshots, input and outcomes remain server authoritative and unchanged.

The bounding rectangle includes 3.5m horizontal, 3m upper and 2m lower padding, clipped to the existing world edges. Camera center and view are clamped to arena bounds. No outside-world background or new camera-driven collision rule.

| Parameter | Value |
|---|---|
| Wide limit | 1.00× — exact approved full-arena view |
| Desktop close limit | 1.28× |
| Touch/small-canvas close limit | 1.18× |
| Small-canvas threshold | CSS display width <700px |
| Zoom-in settling time | 0.45s |
| Zoom dead band | 0.035× |
| Center dead band | 0.35m |
| Zoom-in damping time constant | 1.8s |
| Zoom-out damping time constant | 0.32s |
| Pan damping time constant | 0.5s |
| Velocity lookahead | 0.1s, each axis capped to 30m/s |
| Integration step cap | 50ms |

Close framing waits for settling and eases in slowly. Spreading/tongue targets widen the target earlier. If a sudden recovery or separation would crop a frog, the visibility constraint overrides smoothing; an abrupt widen/pan can happen in that safety case. There is no shake or automatic frog rescaling. The widest view never makes a frog smaller than the accepted baseline.

Reveal/countdown, round changes, lobby and static mode start from the original frame. Phaser camera zoom/center affect world graphics only; DOM HUD, controls, Patient Zero cards and feedback overlays stay in screen space. Phaser FIT/backing dimensions, DPR and viewport behavior are unchanged.

## A/B fallback

Open **How to Play → Camera prototype**, select **Dynamic framing** or **Original static view**, then close help. The setting is local to that browser session and does not change the room or simulate a reset. The existing help behavior neutralizes controls while the dialog is open; the round keeps running. Lobby Controls & Outbreak rules exposes the same selection. A URL with `?camera=static` starts in static mode. Refresh otherwise defaults to dynamic. No new gameplay footer button.

Static mode is exactly zoom=1, center=(20,11.25), with the same arena geometry. The accepted checkpoint also provides a complete source rollback, preserving all existing Git history.

## Arena-space and HUD evaluation

Both arenas remain 40m×22.5m with their accepted geometry, themes and frog dimensions. The wider camera view is the current full map; this pass **does not create extra physical traversal space**. It tests whether closer group framing and gentle reveal improve the feeling of swings/chases. Actual geometry expansion would change escape distances and pacing, so the prototype keeps it separate for user feedback rather than combining two untested changes.

Current HUD is already in bounded screen-space bands on phones. It remains unchanged, avoiding churn in the newly accepted layout. Camera settings live in existing help instead of consuming play space. Results retain Survival + Placement Bonus = Round Score.

## Preservation and diagnostics

`milestone-10-preservation.json` locks the accepted touch/pointer adapter, normalized-input/viewport/scale implementation, mobile CSS, orientation/gesture policies, onboarding, physics/tuning, map geometry, networking, lobby/reconnect, Outbreak/scoring and sound/art. The main-file camera/diagnostic insertions are reversed independently by tests to verify every other byte. No hosting configuration, dependency or paid resource change.

Diagnostics downloads include camera mode, center, zoom, target/fit limit and world size alongside existing input and viewport traces. Camera debug data is local and never sent as simulation input. Existing Input monitor remains untouched visually.

## Tests and limits

Build and 82 unit/preservation tests pass. Real local Phaser/WebSocket camera checks cover 2/4/6/8 separate clients, desktop plus touch-sized layouts, clustered/separated framing, static A/B without a round/player reset, fixed HUD/control/canvas rectangles and 844×390, 667×375, 568×320 phones. Both arenas' authoritative lifecycle tests cover 2/3/4/8 clients, scoring/rotation/reconnect/rematch. Lifecycle includes actual 30-second reservation expiry; Outbreak covers body-only infection, grace, simultaneous ties and disconnected-frog infection. Focused hybrid tests exercise movement, charge, terrain/frog grappling, repeated keyboard/touch switching and a 10-second two-thumb hold; long loops disabled there. Linux WebKit separately stresses native finger events, gestures, viewport fixtures and complete matches for three minutes. Reports live in docs/results/milestone-10-*.

Automated contexts are not new physical iPhone/Android tests. The accepted compatibility source is unchanged; physical camera comfort/readability is still part of M10 acceptance. Closely grouped eight-player name labels still overlap as in the baseline. All frogs/states stay visible, but the camera cannot solve physical crowding or name overlap by itself. Browser infrastructure initially closed a single-process Chromium instance during individual-context cleanup; the camera runner now uses a fresh process per player-count scenario. An early jitter test compared against a camera that was still settling; the corrected test starts from a settled state. Neither required product retuning.

## Acceptance checklist

- Compare Dynamic vs Original static view with the same players and arena, ideally 2, 4, 6 and 8 players.
- Cluster, split to opposite sides/heights, regroup repeatedly. Is zoom noticeable/pumping? Can you still predict escape routes?
- Charge-launch, swing from ceilings, chase moving frog grapples and release across the map. Do anchor tips, frogs and infection stay readable?
- Test both arenas; assess whether framing actually improves spaciousness or whether geometry is the remaining limitation.
- On iPhone/Android landscape, use two thumbs continuously, change direction while holding action and release either independently. Reveal browser bars, rotate/return and reconnect. Canvas/layout and thumb ownership must remain as accepted.
- Confirm HUD/timer/control size stays stable through camera motion. Test Help camera switching; no duplicate frog, respawn, session reset or scoring change.
- Send Diagnostics after an uncomfortable zoom/pan, noting arena/player count/device and selected mode. Report rare recovery-driven abrupt widening separately from ordinary camera pumping.

STOP after deployment; no next milestone, additional geometry iteration or unrelated feature without user feedback.
