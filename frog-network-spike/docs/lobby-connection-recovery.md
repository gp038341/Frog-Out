# Lobby Ready / connection recovery candidate

Baseline: `edb5f9a1f3c304671272d775e327702dd433efea`.
Rollback checkpoint: `checkpoint/pre-lobby-connection-recovery`.

## Evidence and corrections

- Ready was gated by the exact display string `status === 'connected'`. It now derives eligibility from an open current transport, no pending reconnect, lobby phase, and the local connected human membership. Server authority over Ready and the existing map/Chaos Ready reset remain unchanged. An authoritative lobby update restores the connected label.
- Most room-message handlers had no current-room/generation guard. Terminal closes and intentional departure did not clear the stored game/Chaos view and snapshots consistently. Baseline reproduction with a terminal close followed by an old callback left `outbreak` stored, restored an obsolete game view, and incorrectly reported `playing` true. New tests reject old callbacks, including queued delayed data, and clear all game state immediately when a session ends. Gameplay eligibility also requires the current open connection.
- A remote connection end no longer claims the user intentionally left. Intentional Leave still says so. The 30-second temporary reconnect deadline and all server lifecycle/scoring behavior are unchanged.
- Existing Diagnostics export now includes a capped 32-event connection lifecycle trace (attach, close/error code, Ready reset, session end). It records no reconnect tokens or credentials.

## Scope and uncertainty

Only client room ownership/cleanup, Ready eligibility, and diagnostic export changed. Server, simulation, bots, input handlers, viewport CSS, camera, modifiers, arenas, cosmetics and sounds are byte-protected in `lobby-recovery-preservation.json`.

The exact public Ready lock reported by the user was not reproduced during the baseline browser session. These changes remove demonstrated lifecycle failure paths and a fragile status-text gate; physical acceptance is still required. Render logs show a new instance starting around 21:09 UTC on October 17, but no logged application exception identifies the user's interruption or proves its cause. Connection diagnostics should be exported if it recurs.

## Validation

- Full automated suite: 358/358 passed.
- Production TypeScript/Vite/server build passed (existing bundle-size advisory).
- Focused lifecycle/departure tests: 16/16 passed.
- Independent client/server test: 12 alternating map/Chaos resets with two humans plus a CPU; both humans can re-ready; same-ID reconnect; countdown/start and authoritative snapshots; explicit departure clears stored game state without disconnecting the remaining peer.
- Baseline failure reproduced separately from the preserved source; new tests cover terminal cleanup and stale callbacks after closing/joining another room.

## Manual acceptance

1. Ready, switch arena, ready again. Repeat with Chaos On/Off several times, with a second player connected.
2. Start a match. Refresh/briefly interrupt one connection; confirm same-frog reconnect within the existing window and that the other players continue normally.
3. Leave and create/join another room. Confirm no old game or old notices return.
4. If Ready becomes unavailable or the game stalls unexpectedly, export Diagnostics before leaving, and record the exact on-screen connection message and local time.
