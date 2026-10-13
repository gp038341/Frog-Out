# Lobby/player lifecycle playtest candidate

Baseline: `d033b9059fb5c19a61041343fcd1553356a41bc5`, `checkpoint/pre-lobby-departure-phase`. Candidate checkpoint: `checkpoint/lobby-departure-playtest-candidate`. Public URL: https://frog-out.onrender.com/ . Owner acceptance is pending.

## Authorized behavior
- Accidental disconnect keeps the frog visible with its gray OFFLINE indicator until expiry, deactivates physical participation, clears controls and incoming/outgoing tongues, hides its lobby entry and pauses score accumulation. Same identity reserves30s after server detection.
- Reconnect restores current-round role/status/cosmetics at a safe position, not original momentum. Frozen status remains frozen. No duplicate frog.
- Explicit Leave is permanent. Expiry removes only that player. Neither closes everyone’s room.
- Host responsibility transfers to the first connected remaining member. Hosts can kick another connected player in the lobby only; this removes the session, not a permanent identity/IP ban.
- Poison round’s starting Poison Dart Frog, Freeze round’s freezer, or Classic round’s current IT departure ends the current round. Earned scores settle once; no invented survival/placement/clear bonuses or round winner. Advance automatically through the existing Chaos ballot when a played round has another eligible round. An unplayed reveal/countdown skips directly. Absent future starting-role turns are skipped.
- Fixed original roster slots preserve identity, scores and cosmetics; absent bodies are inactive rather than compacting slots. Former players’ already-earned totals remain in results.
- If fewer than2players are connected, return remaining players to the same lobby and reset readiness. Reservations can reconnect into that lobby; they cannot late-join a fresh match already started without them.

## UI
Lobby Leave sits beside primary actions. Host sees targeted Kick controls. Escape or the existing mobile-accessible Menu button opens Resume / Controls & Rules / Leave Match. Menu blocks and clears local input, does not pause the shared simulation. Leaving clears stale local notices and dialogs. Other players receive a short notice.

## Validation
Production build passed;247 automated tests passed (238 existing +9focused tests). Independent compiled-server/WebSocket tests passed16checks covering all3modes, lobby authority, stale inputs/tongues, score pause, safe identity reconnect, frozen reconnect, explicit/expired departures, current role advance/Chaos vote,8player stable slots and same-lobby fallback. Test reservation2s; production30s. See `results/departure-network.json` and `scripts/departure-network.ts`.

Preservation manifest verifies untouched tuning, input/viewport, artwork/sound and other systems, plus reverses narrowly authorized lifecycle adapters for historical regression checks. No physical-device validation claimed in this phase; previously approved iPhone pointer/viewport code is untouched.

## Acceptance checklist
Create a3–4player room. Kick one lobby guest; verify others stay and only host has the control. Test lobby Leave and automatic host transfer. Start each mode; use Escape/Menu and resume, then have a runner leave. Temporarily interrupt another connection and restore within30s; verify same cosmetics/status and no duplicate. Let one reservation expire; others should continue. Have the current tagger/freezer leave; verify round advances and normal voting appears. Reduce to one connected player; verify same room code/lobby stays usable. Verify desktop/two-thumb controls and approved gameplay feel. Server redeploy still clears in-memory rooms.

Public browser verification exposed an abnormal transport-close code after a valid kick message. The explicit server kick message now clears the local session immediately and prevents reconnect regardless of transport close code; focused client regression coverage verifies this.

## Owner visibility refinement
Temporary disconnects retain the on-screen frog and existing gray OFFLINE label during the30-second reservation. Permanent Leave/Kick or reservation expiry hides it. This is a presentation-only refinement; score pause, cleared inputs, safe reconnect, role-departure advancement and one-player same-lobby rules remain unchanged.

## Expired-session and notice correction
Client reconnect stops immediately on authoritative expired/invalid-token or missing-room responses rather than retrying them for another30seconds. A known reconnect deadline survives refresh; successful reconnection clears it. Home Create/Join remain usable during a saved-session lookup and cancel that lookup safely, including a late reconnect success. Transient network failures can still retry within the reservation. Active-game notices now overlay the play area without taking layout space or intercepting controls; accepted mobile viewport/pointer code is untouched.249 automated tests pass, including expiry, preserved deadline, Create/Join during saved-session lookup and late-response cleanup. Physical-device acceptance remains owner-tested.

## Desktop touch-control display correction
Phone/tablet UI eligibility is now separate from touch capability and viewport width. A narrow touchscreen Windows PC, an explicit touch query, or the old layout toggle no longer enables the phone controls on desktop. The toggle remains available on phones/tablets for keyboard-layout switching. iPadOS desktop-style Safari is recognized by MacIntel plus multiple touch points. The reconnect/notice revision did not modify the original detector; that pre-existing detector accepted coarse pointers or touch-capable windows<=1100px, as well as a force-touch query. Native touch/pointer handlers and accepted viewport CSS remain byte-identical. Physical-device regression acceptance is not claimed from automated checks.
