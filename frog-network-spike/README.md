# Frog Network Physics Spike — Milestone 2

Two keyboard-controlled browser clients share one authoritative Planck simulation. The approved Milestone 1 physics configuration and simulation source are unchanged. This deliverable does not include Outbreak, scoring, match flow, lobby UX, room codes, mobile touch controls, final art, or audio.

**Status:** implemented and tested locally. Public deployment and separate-physical-device acceptance remain pending a connected deployment provider. No public testing URL has been created. Do not approve Milestone 2 based solely on automated local results.

## Run locally

Node.js 22 or newer is required. Extract the ZIP and open the folder containing package.json in a terminal.

```sh
npm ci
npm run build
npm start
```

Open http://127.0.0.1:2567/. The first client automatically takes one frog. Copy the “Copy this link for player 2” link and open it in another browser window/profile. The link pins the same internal room. There is no lobby screen or room-code UX. Two clients fill the room; additional clients using that exact link are rejected.

Both clients use WASD or Arrow keys + Space:

- Grounded tap/release: normal jump.
- Hold past 0.14 seconds: begin charging; another 0.8 seconds reaches maximum. Release to launch.
- Airborne press/hold: fire tongue, attach, actively pull and take up slack. Release: detach with momentum preserved.
- A short near-landing tap is buffered; holding through landing begins charging.
- Eight-direction aiming and facing fallback are unchanged.

The server binds to 0.0.0.0 and uses PORT (default 2567). For a LAN test, use the computer's LAN IP and port from another keyboard-equipped device, with the host firewall allowing it. This is not a public internet deployment. Mobile touch controls are not implemented in this milestone.

For development, run npm run dev:server in one terminal and npm run dev in another. Use Vite's localhost URL. npm run preview only serves static files and is not the multiplayer server.

## Diagnostics and artificial latency

The temporary debug panel shows room/player assignment, connection state, measured ping RTT, injected delay/jitter, pending inputs, acknowledgements, state age, correction distances, large correction count, coupling mode, and server tick statistics. Download diagnostics on BOTH devices after a playtest.

URL query parameters apply to each client independently. Copy the pinned room link, then add these with & if it already has ?room=...:

- lag=50&jitter=10
- lag=100&jitter=10
- lag=150&jitter=10
- prediction=0 disables local prediction for an A/B comparison.

lag is ADDED round-trip delay, split across outgoing inputs/pings and incoming snapshots/pongs. jitter is ± milliseconds per leg. Message delivery order is preserved. Real internet RTT is additional; use measured RTT to interpret a WAN test. Keep both devices at the same profile initially. Do not confuse added delay with total RTT.

After losing the connection, refresh the pinned room link to join again. Identity-preserving reconnection, seat reservations and lobby lifecycle are later-milestone work. Inputs time out after 350 ms without updates; on a detected disconnect, actions clear and the outgoing tongue releases.

## Networking implementation

- Colyseus 0.16 rooms and secure WebSockets in production.
- One independent Planck world per room, two physical frogs, fixed 60-Hz server stepping.
- Small explicit authoritative snapshots at 30 Hz; no schema delta system yet.
- Inputs at 30 Hz plus immediate direction/action changes. Ordered sequence numbers; press/release edges are queued independently of physics frames. No accepted client positions or hits.
- Remote bodies interpolate 65 ms behind estimated server time. Snapshot history is bounded.
- Local prediction runs the same unchanged physics core. On a snapshot it restores body/controller/tongue state and replays only unacknowledged local inputs, bounded to 250 ms of catch-up.
- A two-body prediction world is necessary for physical joints/collisions. Remote inputs use their latest known values. When frogs grapple or approach contact, both displayed bodies use that predicted world so their rope endpoints share a timeline.
- Small correction offsets decay over 80 ms without modifying physics. Corrections above 2 m snap. Pure server rendering remains available with prediction=0.
- This is snapshot reconciliation, not deterministic rollback. Solver warm-start impulses are not serialized. New remote actions, collisions and attachment disagreements can require correction.

## Approved baseline

- docs/approved-physics-baseline.json stores all current tuning values, timestep, arena, behavior notes and source hashes.
- docs/approved-physics-config.ts is a frozen copy of the approved configuration.
- npm test asserts both config.ts and world.ts remain byte-for-byte unchanged from Milestone 1.
- Historical tuning details remain in docs/tuning-pass.md.

## Automated verification

```sh
npm test
npm run test:network
npm run stress
```

The network test launches its own local server, connects two Colyseus clients, uses 50/100/150 ms added RTT with ±10 ms jitter per leg, and exercises charged jumps, terrain pulls, mutual frog grapples, collisions and landing inputs. It writes docs/results/latency.json.

The stress test launches an isolated room with eight real WebSocket clients and eight physical bodies for 60 seconds, writing docs/results/stress.json. The test-only room is registered ONLY when ENABLE_STRESS=1. It does not add an eight-player UI. Test scenario repositioning is registered ONLY when ENABLE_TESTS=1. Neither variable should be enabled in production.

scripts/browser-check.cjs checks two isolated headless Chromium contexts at each latency profile, including separate ownership and charging/jumping. npm run test:browser requires a Linux environment compatible with the bundled Chromium. Its JSON report is in docs/results/browser.json. Those tests are not a substitute for physical-device or human acceptance.

The stress output's payload count is JSON-equivalent encoded state size, not measured WebSocket wire bandwidth. Tick statistics measure input application plus physics stepping, not complete end-to-end rendering latency.

## Deploy to Render

Deploy the repository root as one Node Web Service. Render serves the page and WebSockets through the same public URL.

- Build command: npm ci && npm run build
- Start command: npm start
- Health check: /health
- Node version: 22
- One instance; choose an always-on plan for reliable playtests.
- Do not set ENABLE_TESTS or ENABLE_STRESS.

render.yaml provides an always-on Starter-plan blueprint; review its billing in the hosting account before deployment. Dockerfile is also supplied. The server honors Render's PORT automatically. Browser clients select WSS automatically on HTTPS.

Hosting connection and a deployable source repository are still required. Current local results cannot establish host CPU performance, geographic RTT, mobile network behavior, or the public-URL acceptance requirement. Keep the single-process topology; do not add horizontal scaling yet.

## Multiplayer playtest checklist

1. Use two keyboard-equipped physical devices on separate networks. Player 1 opens the deployed URL; player 2 opens the pinned room link. Confirm different YOU labels and the same room identifier.
2. First test without injected lag. Run, stop, reverse, normal-jump, charge-jump and steer in air. Compare to the approved Milestone 1 baseline.
3. Tap just before and immediately after landing. Test the charge threshold and full-charge duration. Watch for ignored taps, double jumps or unintended tongues.
4. Grapple ceilings/platform undersides from rest. Swing and release at several points. Check attachment/release timing and retained momentum.
5. One frog grapples the other while the target runs, jumps or changes direction. Swap roles. Both frogs grapple each other; steer apart, collide and release one tongue at a time.
6. Collide head-on at low and high speed and during a grapple. Ask the other player whether the same collision/attachment happened. Look for repeated corrections, false attachments or bodies passing through each other visually.
7. Repeat at approximately 50/100/150 ms MEASURED RTT, accounting for existing network latency. Use the injected profiles for controlled local comparisons, not blindly on a high-RTT WAN path.
8. Compare prediction=0 briefly. Return to prediction on for acceptance. Watch state age, correction p95, large snaps, and whether latency affects charge/landing behavior disproportionately.
9. Change tabs while holding controls, then disconnect a client. Verify controls stop and stale state is clearly shown. Reconnect/identity restoration is not an acceptance feature for this milestone.
10. Export diagnostics from both devices. Report device/browser, network type, measured RTT, added delay/jitter, action sequence, and whether jitter/snapping was frequent enough to spoil play.

**Milestone 2 acceptance remains pending:** two people on separate physical devices must find grappling, collisions, jumping, swinging and launching responsive without frequent visible desynchronization. No Milestone 3 work is authorized.
