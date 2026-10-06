# Milestone 3 — Lobby and Connection Lifecycle

## Scope and baseline

User approved the deployed Milestone 2/2.1 revision **c4c607be1607a8fd50e2da4eed42b8d69117b350** on 2026-10-06. The checkpoint branch is `checkpoint/milestone-2-approved`; machine-readable source fingerprints are in `approved-milestone-2.json`. Existing Git history, including Milestone 1 `363a607`, is retained. Physics and grapple constants and `config.ts`/`world.ts` are unchanged in Milestone 3.

This build implements admission, lobby and the placeholder physics session only. No Patient Zero, infection, scoring, rounds, final standings, rematch flow, additional modes or final art.

## Flow and policies

- Cryptographically random six-character uppercase room codes omit ambiguous characters. Codes are case-insensitive. No accounts.
- Display names are trimmed, control characters removed, whitespace collapsed and limited to 24 characters. Blank names are rejected. Case-insensitive duplicates receive a suffix such as `(2)`; names are rendered as text, not HTML.
- Lobby shows room code, copy-code/join-link controls, player names, host/you markers, readiness and connection status. The first entrant is host; lobby departure transfers it.
- Host starts only with 2–8 connected players, all ready. The server enforces this independently of button disabling. Start creates the roster/slots and locks the room. Admission is checked again at actual join to cover a reservation/start race.
- Gameplay uses the approved arena. More than two players spawn spaced along its floor; the two-player spawn positions remain unchanged. This is functional multi-body support, not a new arena design.
- Accidental disconnect preserves body and identity for 30 seconds, clearing controls and outgoing tongue. Other frogs remain able to collide/grapple. Reconnect restores the same session ID/slot/current world and sequence base.
- The browser automatically retries. Reload uses a tab-scoped sessionStorage token. New tabs do not inherit it. An explicit Leave aborts the session immediately. Lobby drops do not reserve slots.
- Reservation expiry interrupts and unlocks the session, removes disconnected entries, resets everyone else to not-ready, migrates host if needed, and sends a clear lobby notice. Concurrent pending reservations are cancelled on interruption.

## Architecture changes

`PartyRoom` wraps the existing `SpikeRoom` simulation/input/snapshot code; public clients create or join `frog_party`. A lightweight `/api/rooms/:code` lookup provides understandable invalid/not-found/full/already-playing errors. All admission and readiness decisions are authoritative.

The shared `sizeSimulation` adapter creates/removes identical approved frog bodies for a 2–8 roster. Authoritative state restore and prediction resize to the roster. Rendering selects the local connected component for predicted frog collisions/grapples, extending the original two-body behavior. Simulation source, numerical tuning, fixed timestep and network rates/smoothing thresholds remain unchanged. No rollback, scaling or networking rewrite.

The public legacy `physics_spike` test room is now registered only with `ENABLE_TESTS=1`. Production cannot bypass the lobby through old player-specific URLs. Rooms/codes/identity reservations remain in process memory; a service restart cannot restore them. One free Render instance is retained, with no paid additions.

## Verification

- `npm test`: baseline byte fingerprints, approved movement/grapple regressions, and 2/3/8-body state restoration/prediction.
- `npm run test:lifecycle`: invalid/nonexistent code, blank/duplicate names, single-player and unready/nonhost start rejection, ready/unready, eight concurrent clients, full room, frozen roster/late join, host transfer, explicit leave, stale input/tongue clearing, brief reconnect and reload identity, accepted post-reconnect inputs, real 30-second expiry and return-to-lobby cleanup. Report: `results/lifecycle.json`.
- `npm run test:network`: approved charge/landing/collision/terrain and reciprocal frog grapples at 50/100/150 ms added RTT and ±10ms jitter. Report: `results/latency.json`.
- `npm run test:browser`: two isolated local Chromium contexts complete Create/Join/Ready/Start, visible arena, charge/terrain grapple/release, reload identity and post-reload input acknowledgements at each latency profile. Report: `results/browser-milestone-3.json`.

Automated results establish correctness checks, not Milestone 3 acceptance. The user will personally test the deployed flows. No Milestone 4 work is authorized.

Browser transition sizing required disabling Phaser parent expansion and refreshing bounds when gameplay becomes visible. This changes presentation sizing only. Reconnect sequence handling was checked for both an existing client and a fresh page load; new inputs are accepted immediately after restoration.

## Recorded local results

31 unit/regression tests passed. All 16 lifecycle checks passed; the real reservation expired at 30,016 ms. All three isolated browser latency profiles passed with no runtime errors, correct frog identity after reload and acknowledged post-reload controls. The network harness observed charge launch, terrain/frog attachments and collisions at each profile, with no large snaps or tick overruns.

A 60-second eight-client test through the actual PartyRoom lobby/start flow measured tick p95 0.433 ms, p99 0.927 ms and max 7.420 ms, with zero overruns (16.67 ms budget). An earlier run overlapped a browser/build workload and recorded one scheduler catch-up overrun despite individual ticks remaining below budget; the isolated rerun above passed. These are local measurements, not a guarantee of Free Render host capacity.

The existing Render Free instance is used. No service, database, disk, worker or paid plan is added. Free hosting cold starts and process restarts remain limitations.
