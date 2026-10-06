# Frog Physics Spike — Milestone 1

A local, two-body physics prototype. No networking or Outbreak systems are included.

## Run (Windows PowerShell, macOS or Linux)

Install Node.js 22 or newer, extract this archive, and open a terminal in the folder containing package.json.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173 (or the alternate address printed by Vite if that port is occupied). Leave the terminal running. Stop it with Ctrl+C. Do not open index.html directly.

```sh
npm test
npm run build
npm run preview
```

The preview address is normally http://127.0.0.1:4173. Build output is in dist/.

This is the revised active-grapple tuning pass. See docs/tuning-pass.md for the complete before/after values and behavior changes.

## Controls

| Input | P1 (green) | P2 (orange) |
|---|---|---|
| Move and aim | WASD | Arrow keys |
| Action | Space | Enter |

- Tap and release action while grounded: normal jump.
- Hold past 0.14 seconds while grounded, then release: charge launch. Charge builds for another 0.8 seconds (0.94 seconds total to maximum). The ring appears after the threshold.
- Hold left/right on charge release for a horizontal launch boost.
- Once airborne, press action again to fire; hold to pull and maintain attachment; release to detach. A descending ungrappled frog within the small near-landing window reserves the press for jumping instead.
- Hold diagonal directions to shoot diagonally. With no direction held, shoot horizontally in the facing direction.
- Aim is committed at firing. Subsequent direction changes steer the frog, not the shot.
- A miss automatically retracts; another shot requires a fresh press.
- R or Reset bodies returns both frogs to their starting positions. Tuning stays unchanged.
- Click the arena after editing a tuning field to return keyboard focus to gameplay.

Both frogs share one keyboard. Some keyboards cannot register certain simultaneous combinations (hardware key rollover).

## Tuning

Edit the numeric fields below the arena. Values change live and revert to defaults on page reload. Body radius/mass changes rebuild fixtures and reset bodies. Source defaults: src/simulation/config.ts. The arena uses metres; rendering uses 30 pixels/metre.

| Parameter | Default | Meaning |
|---|---:|---|
| gravity | 26 | Downward acceleration, m/s² |
| groundSpeed | 6 | Target running speed, m/s |
| groundAcceleration | 60 | Maximum ground acceleration, m/s² |
| groundBrake | 50 | Ground stopping acceleration, m/s² |
| airAcceleration | 10 | Horizontal air-control acceleration, m/s² |
| jumpImpulse | 9.5 | Basic target upward launch speed, m/s |
| chargedJumpImpulse | 18 | Maximum target upward launch speed, m/s |
| chargeThreshold | 0.14 | Hold threshold before charging, seconds |
| chargeSeconds | 0.8 | Time from threshold to maximum charge |
| jumpBufferSeconds | 0.1 | Near-landing input reservation / tap buffer, seconds |
| coyoteSeconds | 0.06 | Jump eligibility after leaving support, seconds |
| grapplePullAcceleration | 48 | Relative inward acceleration, m/s² |
| grappleMaxPullSpeed | 8 | Ceiling for adding inward speed, m/s |
| grappleTakeupSpeed | 4 | Maximum takeup of existing slack, m/s |
| grappleMinLength | 0.65 | Pull standoff / takeup floor, m |
| chargeHorizontalImpulse | 4 | Maximum directional charge-launch velocity boost, m/s |
| tongueRange | 12 | Maximum tip travel, m |
| tongueSpeed | 35 | Outgoing tip speed, m/s |
| tongueRetractSpeed | 45 | Miss retraction speed, m/s |
| frogRadius | 0.45 | Circular collision radius, m |
| frogMass | 1 | Body mass, kg |
| friction | 0.15 | Frog fixture friction; terrain initially 0.15 |
| restitution | 0.05 | Frog bounce coefficient |
| velocityIterations | 10 | Planck velocity solver iterations per step |
| positionIterations | 6 | Planck position solver iterations per step |
| physics timestep | 1/60 | Fixed seconds per step (source constant) |

Air steering adds acceleration without clamping existing momentum. Rope length starts at attachment distance and takes up slack as the frog is physically pulled closer. Changing tongueRange does not resize an existing rope. A rope joint limits separation and permits slack. Active mass-aware radial impulses pull toward the anchor without changing tangential momentum. Connected bodies still collide.

Telemetry shows grounded state, velocity, charge, tongue phase, maximum rope length L, actual separation d, and SLACK/TAUT. The tongue is drawn as a straight debug line even while slack; the physics permits slack regardless of that drawing.

## Playtest sequence

1. Compare quick jumps with half/full charges. Does launch direction and strength feel controllable?
2. Run and stop, then steer while airborne. Does air control preserve useful momentum?
3. Jump and fire up toward the center platform underside. Continue holding to swing. Release near the bottom of a swing and observe retained velocity.
4. Move toward an anchor: d should drop below L and show SLACK. Move away: the rope should become taut without pushing you away first.
5. Try all eight shot directions and no-direction facing shots. Change direction after firing to verify the shot stays committed.
6. Move P2 near P1. Jump P1 and fire toward P2. Run P2 away while holding P1's attachment; both bodies should respond.
7. Collide while connected. Repeat jump/grapple/release quickly and look for jitter, sticking, or explosive impulses.
8. Shoot into open air to test range and miss retraction. Change tabs while holding action to confirm controls clear.

Report the tuning values, action sequence and approximate location for any issue. Prioritize responsiveness, charge-launch usefulness, swing control, release timing, two-frog pulling and collision feel.

## Implementation and boundaries

- Phaser 3 renders placeholder circles and rectangles only.
- Headless Planck simulation is isolated in src/simulation/ and has no DOM or Phaser imports.
- Input uses direction + held action and preserves queued press/release edges, including taps between ticks.
- Static rectangular terrain; circular dynamic frogs with fixed rotation and continuous-collision flag.
- Swept tongue raycasts choose the nearest valid hit; rope joints attach to local body anchors.
- Ground support comes from contact normals with takeoff filtering, short coyote time and a near-landing jump-input buffer.
- Grounded jumps occur on release to distinguish tap from hold. Maximum charge does not auto-launch.
- Fixed stepping allows at most six catch-up steps/frame; long stalls drop excess time. This local policy is not a future server scheduler.
- A safety reset returns both frogs if a body escapes far outside the arena or becomes non-finite. It is a debugging fallback, not final recovery behavior.
- No mobile controls, room service, synchronization, prediction, scoring, infection, art or audio.
- Full Phaser creates a large production bundle. Bundle optimization is deferred.

Seventeen automated scenarios validate core physics. Build/type checks are included in npm run build. Human game-feel and two-person keyboard playtesting remain necessary.

Verification in the build environment: production build/type check and all seventeen physics tests passed; the dev server started. A browser smoke test could not run because Chromium was absent and its download failed. Visual behavior and subjective game feel have not been verified here.
