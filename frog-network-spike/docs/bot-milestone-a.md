# CPU Bot Milestone A — participant and lobby candidate

## Preserved baseline

- Owner-approved application: `d6c370da4bf820ce071a9b102f79591d5b74b19b`.
- Approval checkpoint: `checkpoint/approved-lobby-customization-voting-visuals`.
- Pre-bot repository: `9925f0bdcd9c17d3ed4192afcdcdca1ed96c0a05` (documentation-only successor).
- Pre-implementation checkpoint: `checkpoint/pre-bot-milestone-a`.
- This implementation is a playtest candidate, not owner-approved. See `checkpoint/bot-milestone-a-playtest` for the delivered revision.

## Implemented contract

New rooms have zero CPUs. Only a human host can add a CPU to a specific empty lobby seat, remove it, or edit its existing color/pattern, eye expression and hat. CPU edits do not overwrite the human's saved appearance. CPU addition/removal does not reset human Ready. CPUs are automatically ready. Sunny Pond stays default; all modes, four maps, cosmetics, Chaos, KEEP, static camera and accepted input/viewport behavior remain.

Participants explicitly distinguish human and CPU kinds. CPU IDs include room identity and monotonic addition order. Lobby seats are separate from immutable in-match simulation slots. CPU `connected` is false: server participation/readiness/vote/host predicates explicitly distinguish eligible participants from actual browser connections. Snapshot `connected` remains the existing body-presentation participation mask, so CPU bodies are rendered normally. CPU slots generate no network commands/sequence acknowledgments; their aligned snapshot ack entry stays zero. Human ack processing is unchanged.

Joining validates the human before a synchronous admission operation. Empty seats are used first. Otherwise, the oldest-added CPU is removed and the admitted human takes its lobby seat. Lookup does not evict CPUs. Full human/reserved-human rooms reject joins. Reserved humans remain separate from the active lobby list so approved human-only lifecycle messages/counts remain compatible; their physical lobby seats are protected and shown as reserved. No midmatch replacement, bot backfilling, synthetic clients or CPU host ownership.

The authoritative input hook generates only ordinary `{x,y,held}` commands. Basic controllers steer and occasionally tap or charge grounded jumps. Frozen/trapped/nonplaying controllers are neutral. No navigation, chase planning, deliberate grappling, difficulty settings, physics changes, direct velocity/position overrides or new abilities.

CPUs vote once per ballot through existing Chaos validation using individual seeded random streams and staggered deadlines. KEEP is an ordinary eligible choice. Decisions reset on match/round lifecycle changes; clearing controllers cancels all pending work without extra timers. CPUs never perform host actions.

When the last connected human accidentally disconnects, valid human reservations keep the room alive. Active gameplay simulation ticks, game clocks, CPU decisions and voting stop; the 30-second real-time reconnect deadline continues. Reconnect resumes the existing session and shifts voting/CPU deadlines by the paused interval. No-human/no-reservation rooms are disposed with all CPUs. Explicit final-human Leave closes immediately. Other human departures and gray offline-frog rendering retain approved behavior.

## Validation

- Full suite: 260 passed, zero failures. Build passed (existing bundle-size advisory only).
- `scripts/bot-a-network.ts`: compiled server with independent WebSocket clients, test-shortened countdown/vote and 2-second reservations. Solo full matches in Poison/Freeze/Classic, mixed humans/CPU, oldest CPU replacement, concurrent admission, reserved seats, authorization, valid/invalid cosmetics, frozen roster, score/results, CPU votes, KEEP, pause/reconnect/cleanup, rematch and eight-frog load on every arena.
- `scripts/bot-a-reservation.ts`: real production 30-second setting, room retained at 29 seconds and removed at 30.049 seconds.
- Existing `scripts/departure-network.ts`: passed unchanged, including human-only reconnect, departure scoring/results and host transfer.
- Reports: `docs/results/bot-a-network.json` and `bot-a-reservation.json`.
- Local short per-arena eight-frog run (one human + seven CPU controllers): worst p95 0.6533 ms, p99 1.3215 ms, maximum 2.6733 ms; zero reported overruns. Not a Render multi-room capacity benchmark or physical-device claim.
- Exact reversible CPU adapters and untouched-source hashes are in `bot-a-preservation.json`; historical preservation tests reverse this explicitly authorized layer before checking older baselines.

## Acceptance checklist / limits

1. New room has eight seats and no CPUs; Add/Remove/Edit appear only for host.
2. Change a CPU color/eyes/hat; confirm portrait and match appearance. Human home preference must stay unchanged.
3. Ready the host, add/remove CPUs, confirm host stays Ready; start with one CPU.
4. Fill seven CPUs, join from other devices; oldest CPUs disappear in addition order. All-human room remains full. An invalid join must not evict a CPU.
5. Try all modes/maps, round results, CPU votes and KEEP, final standings and returning to the lobby. Host continues rounds manually.
6. With another human present, disconnect/reconnect: gray reserved frog, stable slot, human-only host transfer.
7. As sole human, interrupt the network for less than 30 seconds: same room/match resumes, no lost gameplay/vote time. After more than 30 seconds: old room gone; new Create/Join remains available.
8. Verify desktop and mobile landscape controls, original visuals, existing Chaos and human-only play.

Basic CPUs are intentionally not competitive yet; they may remain on low routes or make poor choices. In Poison Tag a passive/basic CPU can prolong a round because its approved mode has no timeout. Bubble-trapped CPUs currently wait safely rather than perform intelligent escape presses. Competent navigation, grappling, rescue strategy and modifier-aware decisions belong to later approved bot milestones. No physical iPhone/Android testing is claimed for this candidate. No hosting configuration, service identity or plan changes.

Public smoke check: room creation, independent guest join and host-only CPU controls, CPU hat synchronization, removal/addition preserving Ready, solo start, and a completed Poison Tag round, and a legitimate CPU vote with a colored footprint were observed. A CPU-card grid layout keeps names readable instead of squeezing them beside Remove.

Owner lobby refinement: all eight seats reserve the same 160px outer height before CPUs join. CPU customization scrolls inside its seat if expanded; adding/removing CPUs or opening the editor cannot resize the grid. Width remains responsive at the existing breakpoints. No gameplay changes.


## Approved checkpoint and B1 follow-up

Bot A including fixed-size lobby seats is approved at `cc4673064381aec696e2a40fe83203d5389d356a`, checkpoint `checkpoint/approved-bot-milestone-a`. The movement/navigation follow-up is documented in [bot-milestone-b1.md](bot-milestone-b1.md); its playtest candidate does not imply approval of B1.
