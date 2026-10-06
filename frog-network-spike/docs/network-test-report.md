# Milestone 2 network test report

Status: LOCAL IMPLEMENTATION AND TESTING COMPLETE; PUBLIC DEPLOYMENT AND PHYSICAL-DEVICE ACCEPTANCE PENDING.

The Render plugin was found but is not installed/connected in this session. No public URL has been created.

## Baseline

Approved Milestone 1 config.ts and world.ts remain byte-for-byte unchanged. All values, arena and hashes are saved in approved-physics-baseline.json. Nineteen unit/state/baseline tests pass.

## Latency tests

Two independent Colyseus clients over real loopback WebSocket connections, with ordered application-layer delay and ±10 ms jitter per leg. These are not deployed internet tests or human-playtest results.

| Added RTT | Measured RTT p50 | Input-to-authoritative acknowledgement p50/p95 | Local predicted step p50/p95 | Largest phase correction p95 | Single largest correction |
|---:|---:|---:|---:|---:|---:|
| 50 ms | 56 ms | 85/101 ms | 11/16 ms | 0.222 m | 0.542 m |
| 100 ms | 102 ms | 134/147 ms | 7/18 ms | 0.252 m | 0.519 m |
| 150 ms | 148 ms | 179/205 ms | 14/19 ms | 0.246 m | 0.502 m |

Every profile observed terrain attachment, mutual two-frog attachment, body contact, and a charged launch. No corrections above the configured 2-metre snap threshold and no server tick overruns were observed. The local predicted-step metric measures simulation scheduling, not end-to-end input-to-photon latency. Authoritative acknowledgement includes the outgoing delay, tick wait, snapshot cadence and returning delay; it is not one-way input latency.

At 150 ms added RTT: terrain-grapple correction p95 was 0.128 m; frog-interaction p95 0.069 m; collision p95 0.095 m; charge p95 0.246 m; landing p95 0.223 m. Charge/landing corrections are the highest-priority human checks. Full phase distributions are in results/latency.json.

## Browser checks

Two isolated Chromium contexts at each delay profile successfully joined one room with different player slots, responded to keyboard input, charged/jumped, grappled terrain and released. No browser runtime errors. A screenshot and results are in results/browser-100ms.png and results/browser.json. These checks do not prove physical-device/network acceptance.

## Eight-client stress

Eight actual Colyseus/WebSocket clients, eight dynamic frogs, 30 inputs/client/second, one authoritative room, 60 seconds. Physics/input work p50 0.124 ms, p95 0.242 ms, p99 0.524 ms, maximum 3.708 ms. Zero overruns against the 16.667-ms tick budget. Median snapshot gap 33 ms; p99 37 ms. The load room recorded 4486 attachment observations.

The stress room is test-only and is not registered in a production deployment. Performance describes this local runtime, not a future hosting tier. Payload bytes in the raw report are JSON-equivalent sizes, not actual wire bandwidth.

## Implemented reconciliation and compromises

Server owns every collision and tongue attachment. Inputs carry sequence numbers; snapshots carry processed acknowledgements. A bounded snapshot restore plus replay of unacknowledged local input uses the unchanged physics core. Latest-known remote input drives the two-body predicted world. Remote frogs normally interpolate 65 ms behind server time; during contact/grapple coupling they use the predicted timeline. Small render-only correction offsets decay over 80 ms. No historical world rollback, server rewind or deterministic solver replay is implemented.

Physics solver warm-start impulses are not serialized. New remote button presses, reversals, attachments and collision outcomes can disagree temporarily. Attachment confirmation remains authoritative. Short network stalls freeze local stepping and show stale-state information; input timeout clears held controls. Full reconnection identity/reservation and lobby lifecycle are not implemented in this milestone.

## Remaining acceptance gates

1. Add/connect Render and supply a deployable source repository, then publish the included Node service.
2. Repeat latency/budget measurements on the deployed host; local measurements are not a replacement.
3. Two people on keyboard-equipped physical devices and different networks run the README checklist, exporting diagnostics from both clients.
4. Address only demonstrated networking issues before requesting Milestone 2 approval. Do not start Milestone 3.
