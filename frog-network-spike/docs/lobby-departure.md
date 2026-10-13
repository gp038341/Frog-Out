# Lobby/player lifecycle playtest candidate

Baseline: `d033b9059fb5c19a61041343fcd1553356a41bc5`, `checkpoint/pre-lobby-departure-phase`. Candidate checkpoint: `checkpoint/lobby-departure-playtest-candidate`. Public URL: https://frog-out.onrender.com/ . Owner acceptance is pending.

## Authorized behavior
- Accidental disconnect immediately deactivates the frog, clears controls and incoming/outgoing tongues, hides its lobby entry and pauses score accumulation. Same identity reserves30s after server detection.
- Reconnect restores current-round role/status/cosmetics at a safe position, not original momentum. Frozen status remains frozen. No duplicate frog.
- Explicit Leave is permanent. Expiry removes only that player. Neither closes everyone’s room.
- Host responsibility transfers to the first connected remaining member. Hosts can kick another connected player in the lobby only; this removes the session, not a permanent identity/IP ban.
- Poison round’s starting Poison Dart Frog, Freeze round’s freezer, or Classic round’s current IT departure ends the current round. Earned scores settle once; no invented survival/placement/clear bonuses or round winner. Advance automatically through the existing Chaos ballot when a played round has another eligible round. An unplayed reveal/countdown skips directly. Absent future starting-role turns are skipped.
- Fixed original roster slots preserve identity, scores and cosmetics; absent bodies are inactive rather than compacting slots. Former players’ already-earned totals remain in results.
- If fewer than2players are connected, return remaining players to the same lobby and reset readiness. Reservations can reconnect into that lobby; they cannot late-join a fresh match already started without them.

## UI
Lobby Leave sits beside primary actions. Host sees targeted Kick controls. Escape or the existing mobile-accessible Menu button opens Resume / Controls & Rules / Leave Match. Menu blocks and clears local input, does not pause the shared simulation. Leaving clears stale local notices and dialogs. Other players receive a short notice.

## Validation
Production build passed;246 automated tests passed (238 existing +8focused tests). Independent compiled-server/WebSocket tests passed16checks covering all3modes, lobby authority, stale inputs/tongues, score pause, safe identity reconnect, frozen reconnect, explicit/expired departures, current role advance/Chaos vote,8player stable slots and same-lobby fallback. Test reservation2s; production30s. See `results/departure-network.json` and `scripts/departure-network.ts`.

Preservation manifest verifies untouched tuning, input/viewport, artwork/sound and other systems, plus reverses narrowly authorized lifecycle adapters for historical regression checks. No physical-device validation claimed in this phase; previously approved iPhone pointer/viewport code is untouched.

## Acceptance checklist
Create a3–4player room. Kick one lobby guest; verify others stay and only host has the control. Test lobby Leave and automatic host transfer. Start each mode; use Escape/Menu and resume, then have a runner leave. Temporarily interrupt another connection and restore within30s; verify same cosmetics/status and no duplicate. Let one reservation expire; others should continue. Have the current tagger/freezer leave; verify round advances and normal voting appears. Reduce to one connected player; verify same room code/lobby stays usable. Verify desktop/two-thumb controls and approved gameplay feel. Server redeploy still clears in-memory rooms.
