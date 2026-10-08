# Classic Tag acceptance candidate

Owner-approved Freeze Tag revision: `aadecb3f3258c4535bb29fe8bf9b02cb6d49cbb6`, checkpoint `checkpoint/approved-freeze-tag`. Local index tree and live Render deployment `dep-db41biad0e5s73fefld0` matched that revision before any Classic changes. No pending approved source edits; untracked historical screenshots are retained locally and excluded from the implementation commit.

Approved Classic specification is preserved in [milestone-16-approved-design.md](milestone-16-approved-design.md). Candidate checkpoint `checkpoint/classic-tag-candidate` points to the implementation commit. Service: `frog-out-milestone-2`, https://frog-out-milestone-2.onrender.com/ . Free plan and configuration remain unchanged. Classic Tag requires the owner's playtest before approval.

## Exact mode rules

- 2–8 players, one IT at any moment. Randomized starting order gives every frozen roster member one starting-IT round. No mid-match active joining.
- Fixed 60-second authoritative round. Highest round points wins, sharing ties. Match totals accumulate; top tied totals share victory.
- Body contact alone transfers IT; tongues do not. At most one transfer/tick. Eligible simultaneous targets: nearest body centre, then roster slot at exactly equal distance, independent of callback order.
- Newly tagged IT cannot transfer for one second. Continued body contact can transfer afterward. Starting IT can tag immediately when the countdown ends.
- 1 point/second not IT, credited in complete tenths like existing scoring; no bonus. Protection time remains IT time. At the exact round deadline the completed interval is scored before any new tag. Results show Time not IT, Time IT, Round Score and cumulative Total.
- Same reveal/countdown and host-led round continuation/final/rematch; no new phase timing. Existing 30-second disconnect reservation, clear stale controls/outgoing tongue, authoritative frog remains in the world, same identity/role returns, expiry interrupts entire match.

## Integration/presentation

Third host-only synchronized lobby choice; Poison Tag stays default. Mode change keeps Ready and cosmetics; locks during match. Existing four arenas, Sunny Pond default, input, viewport, static camera and physics remain unchanged.

ClassicRules is isolated from OutbreakRules and FreezeRules. The shared room selects it and supplies actual body contacts/centres; existing physics and client prediction run unchanged. Classic never receives poison pull buffs or Freeze immobilization. No new networking messages/transport architecture required beyond the existing mode selector and optional Classic state metadata.

IT has an amber ring/pennant plus textual IT identity; normal skin/eyes/hats remain visible. One-second transfer lock has an arc/countdown. Transfer triggers a restrained purple poison poof and compact local YOU’RE IT notification. Existing approved sound cues reused; no new audio assets or license changes. Poison Tag poison feedback and Freeze ice/freezer presentation preserved.

## Validation

- `npm test`: 129 passing tests; build passes (existing large Phaser bundle warning remains).
- Rule tests: one-transfer/grace, tongues do not tag, nearest target/ties/callback order, actual body contacts on all four arenas, full 2–8 rotation, points/tied results/deadline, local notices.
- [Network](results/classic-network.json): 16 independent rooms across all four arenas at 2/3/4/8 clients, selection/host/lock/default/Ready, transfers/grace, reconnect current IT and cosmetics, full starting rotation, scoring/results/rematch/Freeze fallback, disconnect expiry. Test-only 4-second rounds and 1-second reservation accelerate this suite; both require ENABLE_TESTS. Production remains 60 seconds/30 seconds.
- [Real timer](results/classic-timeout.json): real 60-second round, no duration override or clock fast-forward; IT earns zero, other runners earn 60 and share round victory.
- Poison and Freeze full network regression suites rerun on all four arenas at 2/3/4/8 clients; previous reports remain applicable. Unit suite covers special surfaces, input/hybrid recovery, iPhone source preservation, cosmetics and baseline tuning.
- Browser/touch evidence is described in the result reports. New-mode physical-device testing has not occurred; accepted iPhone input/viewport code is unchanged. Linux WebKit binary unavailable; no new WebKit result claimed.

## Acceptance checklist

1. Create/join by room code; default Poison Tag/Sunny Pond. Choose Classic as host while Ready; readiness/cosmetics stay. Peers cannot choose; start locks mode.
2. Body tag passes IT; tongue attachment alone does not. Verify poof, compact YOU’RE IT, amber role marker and one-second tag-back prevention.
3. Play 2-player and 3–8-player rounds on every arena, including bounce/mud/paint/soap. Movement/grapples should feel identical.
4. Let 60 seconds expire; compare Time IT/not IT and points, starting-IT rotation, final ties and rematch.
5. Refresh same tab while IT, then try disconnect timeout. Identity/role returns within reservation; expiry returns everyone to lobby.
6. Mixed desktop/mobile, two-thumb jump/charge/grapple, help/orientation, cosmetics and iPhone viewport. Then switch to Poison and Freeze to confirm approved modes still feel right.
