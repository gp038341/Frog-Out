# Chaos Voting — Milestone A candidate

Pre-implementation checkpoint: `checkpoint/pre-chaos-milestone-a`, revision `966c7778923560f040b33c18bafd91faf91f7a3b`. Production target remains https://frog-out.onrender.com/ (`frog-out`, Free). Old service is not a deployment target.

Chaos defaults ON for new rooms. Host can toggle in lobby; changes clear Ready with notice. First round remains normal. Host Next Round opens a 15-second authoritative ballot if another playable round remains. One changeable vote per connected frozen-roster participant; disconnected ballots retained but excluded from count until reconnection. Live counts and visible shuffled tie priority; no-vote result uses same priority. Winner reveal 1.5 seconds, then approved role reveal/countdown. No scoring or gameplay-time advancement during voting. Final Standings transition has no vote.

Three effects accumulate, then each winner replaces oldest. Expiring effect shown separately and never offered. Reset at new match/rematch/interruption; existing reconnect identity/reservation policy retained. With four modifiers, ballots naturally have 3, 2, 1, then 1 choices. Expired effects can return on later ballots. More variety requires Milestone B, not invalid/duplicate cards. Server registry supports mode/arena/conflict eligibility; all four A entries support all approved modes/arenas.

Provisional central tuning in `src/chaos/registry.ts`:
- Moon Frogs: gravity 26 → 19.5 (×.75); jump impulses unchanged.
- Mega Tongues: reach 12 → 15.6 (×1.30); aim/flight unchanged.
- Butterfeet: ground acceleration 60 → 39; brake 50 → 15; frog contact friction capped .03. With bathhouse soap choose stronger traction reduction rather than multiply penalties. Mud speed penalty unchanged.
- Quick Licks: flight 35 → 43.75; retract 45 → 56.25. No new recovery cooldown added because approved controller has no independent recovery timer; existing held/release semantics retained.

Effective configuration is rebuilt from baseline plus active IDs, applied before new-round reset and included in snapshots for client prediction. No global defaults overwritten. No changes to physical size/mass, poison advantage, jumps, pull mechanics, mode rules, surface bounce logic, camera, touch adapter, viewport CSS/meta, arenas, cosmetics or audio palette. `chaos-a-preservation.json` documents exact integration hunks and frozen source hashes; historical baseline tests reverse only these approved adapter changes before verifying historical hashes.

Validation:
- 140/140 unit and existing regression tests passed; production build passed (existing large Phaser bundle warning remains).
- All 16 A subsets checked for composition/restoration; disabled simulation trajectory compared tick-for-tick against baseline through 400 movement/jump/grapple input ticks.
- 21 simultaneous local rooms cover 2–8 clients for each of Poison/Freeze/Classic, full role rotation/round lifecycle, conveyor, ties, abstentions, host lock, invalid/stale ballots, rematch and disabled snapshots. Four-player rooms reconnect during voting with same identity, slot and saved ballot. Additional reservation-expiry scenario returns to lobby/clears Chaos. Test-only 600ms ballots/150ms reveals and short Classic rounds; production 15s/1.5s deadline separately unit-tested. Test hooks require ENABLE_TESTS=1; not enabled in production.
- Existing loopback latency suite rerun at added 50/100/150ms RTT, 10ms jitter per leg. Measured median RTT 54/102/147ms; full diagnostics in `results/chaos-a-latency.json`. This checks preserved networking; not a WAN or Chaos-modified latency acceptance test.
- Frozen input/viewport/game-rule hash checks pass. Browser-render inspection attempt timed out; no physical iPhone/Android testing claimed. Responsive card CSS uses three columns in landscape, 44px baseline controls, compact low-height rules; actual phone voting/readability needs acceptance testing.

Manual acceptance:
1. Open canonical URL on two devices; see Chaos ON, verify host-only toggle and Ready notice. Try each mode with Chaos OFF to compare baseline feel.
2. Start with Chaos ON: round 1 normal. Review results, host Next Round. Vote/change vote on each device; countdown 15s, equal split resolves via displayed priority, abstention still proceeds.
3. Use 5+ players to see three modifiers accumulate and fourth replace oldest; oldest shown separately, never a candidate. Four-player matches cannot reach fourth activation because match has four rounds.
4. Compare Moon hops, Mega reach, Butterfeet stopping (including soap/mud), Quick flight/retraction. Confirm ordinary action semantics, poison pull balance, physical contact rules and scoring.
5. Briefly disconnect during voting and gameplay; reconnect same tab before 30s, verify same frog/ballot/active effects. Reservation expiry interrupts as before.
6. Finish/rematch: round 1 resets to normal; toggle/arena/mode/cosmetics remain expected. Check iPhone landscape voting, Safari chrome, two-thumb control after transitions, Android and desktop.

Candidate only; stop after deployment for owner acceptance. No additional modifiers/Milestone B authorized.

## Owner playtest refinement — 2026-10-10
Supersedes earlier A tuning and expiring-ballot exclusion. Moon gravity is ×0.25 (6.5), free-flight air acceleration ×0.45 (4.5), horizontal drag 1.5/s, vertical drag .6/s, maximum downward speed 4.2. Air resistance excludes frogs attached to terrain and either end of frog-to-frog grapples; lower gravity remains active. Butterfeet acceleration ×.40 (24), braking ×.025 (1.25), friction cap .001. Mega Tongues reach covers the full 40×22.5 arena diagonal plus 2 units (47.8939); no infinite ray or change to boundaries. Quick Licks unchanged. At capacity, expiring modifier appears with RENEW on the ballot; choosing it moves it to newest without duplication. Ballots become 3→2→1→2 with this limited catalog. Distinct moon-purple, tongue-pink, butter-gold and lightning-teal cards retain names/icons and checked state. Normal baseline, input and viewport systems unchanged. Physical acceptance pending.

Refinement validation: 144/144 tests and build pass; 22 independent-client network scenarios pass for all modes and 2–8 clients, including renewal/replacement, ties, abstention, disconnect/reconnect and rematches. Frozen-source checks remain exact. Local test-only short deadlines; public production verification performed separately. No new physical-device test claimed.
