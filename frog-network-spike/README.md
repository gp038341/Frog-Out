# Frog-Out — Milestone 3 acceptance build

Public prototype: https://frog-out-milestone-2.onrender.com/

Milestone 2/2.1 was approved by the user after multiplayer playtesting. Its exact revision is `c4c607be1607a8fd50e2da4eed42b8d69117b350`, recoverable on `checkpoint/milestone-2-approved` and recorded in `docs/approved-milestone-2.json`. Milestone 3 adds rooms, a lobby, and connection lifecycle around that simulation. **Milestone 3 requires the user's acceptance playtest; Milestone 4 has not started.**

## Play

1. Open the public URL on two keyboard-equipped devices. Enter your display name and choose **Create Room** on the first.
2. Share the six-character room code using **Copy code**, or use **Copy join link**. On the second device enter a name and the code, then choose **Join Room**. Everyone uses the same public URL; the optional link only pre-fills the code.
3. Each player selects **Ready**. The host selects **Start session** after at least two connected players are ready. All players must be ready. Up to eight players can join the lobby.
4. Play the existing placeholder physics arena. WASD or Arrow Keys move/aim; Space is the action button. Tap/release grounded for a normal jump; hold past 0.14 seconds to charge and release to launch. Airborne, press/hold to shoot and maintain a pulling tongue, release to detach with momentum.

No Outbreak rules, scoring, rounds or final presentation are included. Mobile touch controls are not implemented yet; joining the lobby works in a mobile browser, but gameplay currently requires a keyboard.

## Connection behavior

- New players may join only while the room is in its lobby. Start freezes the roster and locks admission. Refreshing during gameplay restores the same player/frog if the reservation is still valid; it is not a late join.
- Accidental gameplay disconnects reserve the slot for **30 seconds after server detection**. Inputs and the outgoing tongue clear immediately on detection; stale inputs also clear after 350 ms without updates. The body stays in the authoritative world. Incoming tongues and collisions can still affect it.
- The client retries automatically and retains its reconnect token in **sessionStorage for that tab**. A page refresh retains it. Closing a tab and opening an entirely new tab does not reliably retain identity. Do not share tokens.
- Expiry interrupts the placeholder session and returns connected players to the lobby with an explanation. Disconnected entries are removed and all readiness resets. Lobby disconnects remove the player immediately; host responsibility transfers to another connected player.
- Explicit **Leave room** during gameplay interrupts immediately rather than waiting 30 seconds. This is deliberate; use refresh or a temporary network disconnect to test the reconnection reservation.
- Room state is in memory. Server restart/redeploy loses rooms. Free Render may sleep after inactivity and take about a minute to wake; reload if the first connection fails. No paid resources were introduced.

## Run locally

From this `frog-network-spike` directory with Node.js 22+:

```sh
npm ci
npm run build
npm start
```

Open http://127.0.0.1:2567/ on two independent browser tabs or profiles and follow the same Create/Join/Ready/Start flow. For development run `npm run dev:server` and `npm run dev` in separate terminals; open http://127.0.0.1:5173/. `npm run preview` does not run multiplayer.

## Diagnostics

Gameplay's temporary debug panel shows RTT, input acknowledgements, state age, prediction corrections, coupling and server tick statistics. **Export diagnostics** downloads a JSON file without reconnect tokens. Export from both clients after an issue; report browser/device/network, room code, approximate time and the exact action sequence. A short screen recording from both sides helps diagnose collision/grapple discrepancies.

Optional per-client URL parameters: `?lag=50&jitter=10`, `?lag=100&jitter=10`, `?lag=150&jitter=10`. `lag` adds RTT on top of actual network latency; jitter is ±ms per leg, with message order preserved. Add `&prediction=0` only for comparison. Do not use it for acceptance testing. With a copied join link append parameters using `&`.

## Implementation and tests

`server/party-room.ts` subclasses the existing authoritative room. Physics remains 60 Hz with 30 Hz snapshots and inputs plus immediate input changes. Existing prediction, reconciliation, interpolation and tuning remain; the adapter supports a roster of 2–8 bodies. The approved `config.ts`, `world.ts`, and original Milestone 1 frozen copies are checked byte-for-byte. See `docs/milestone-3.md` and `docs/results/` for test reports.

```sh
npm test
npm run test:lifecycle
npm run test:network
npm run test:browser
npm run stress
```

Lifecycle tests use independent local WebSocket clients and a real 30-second reservation, covering admission, names, readiness, roster locking, reconnect identity and timeout recovery. Network tests exercise charge, terrain/frog grapples, collision and landing at 50/100/150 ms added RTT with jitter. Browser tests use isolated local headless Chromium contexts. These are regression checks, not substitutes for personal playtesting. Test-only rooms and repositioning require `ENABLE_TESTS=1`; the isolated stress room requires `ENABLE_STRESS=1`. Neither flag is set in production.

## Existing Free Render deployment

Use the existing `frog-out-milestone-2` service, one **Free** Node instance. Do not create a second service, upgrade plans, or add paid resources. Automatic deploys are disabled; release only after tests.

Repository-root build command: `cd frog-network-spike && npm ci && npm run build`.

Start command: `cd frog-network-spike && npm start`.

`NODE_VERSION=22`, `NODE_ENV=production`, `NPM_CONFIG_PRODUCTION=false` (build tools are needed). HTTP `/health` returns `{ok:true,milestone:3}`. The same host serves the frontend and secure WebSockets. The checked-in `render.yaml` describes a free service for reference; do not apply it to create another service. No database, disk, worker or account system is needed.
