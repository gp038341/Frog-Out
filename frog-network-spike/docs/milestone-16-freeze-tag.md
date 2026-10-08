# Milestone 16 — Freeze Tag acceptance candidate

Approved previous gameplay revision: `f894102e9bb7f69406de278f94542d92f8154d0c`, `checkpoint/approved-milestone-15-frog-customization`.
Approved rules: [milestone-16-approved-design.md](milestone-16-approved-design.md), committed at `cfa3a38fbc92b229759a82ee36bc965f035ebc82`, checkpoint `checkpoint/pre-milestone-16-freeze-tag`.
Implementation checkpoint: `checkpoint/milestone-16-freeze-tag-candidate` identifies this implementation commit. Public service: `frog-out-milestone-2`, https://frog-out-milestone-2.onrender.com/ . This is not owner-approved until physical playtest.

## Implementation

Host-only compact lobby selector, default Poison Tag; mode changes retain readiness and cosmetics, selection locks at start. Existing four arenas and Sunny Pond default unchanged. FreezeRules is a separate deterministic rule module with shared round lifecycle/transport/results containers. It does not replace Poison Tag rules.

- Fixed freezer per round, randomized rotation, each participant starts once.
- 60 seconds, ending earlier when all runners freeze; first freeze ends two-player rounds.
- Body contact only; unfrozen runners rescue teammates. No automatic thaw. One-second rescue protection.
- Freeze batch precedes rescue; newly frozen cannot rescue that tick. Deadline resolves before contacts at the exact 60-second tick.
- Runners: 1 point/second unfrozen, paused frozen/resumed on rescue, complete tenths displayed. Freezer: 3/freeze; +5 all-frozen bonus in 3–8-player rooms, no two-player clear bonus.
- Freezer wins all-frozen rounds. Remaining unfrozen runners share timeout escape victory (explicit owner clarification). Match highest total wins, shared ties.
- Pinned solid ice bodies with no action, velocity or special-surface escape; restore existing dynamic fixtures on rescue. Incoming/outgoing tongues detach; frozen bodies cannot be tongue anchors. Snapshot frozen flags apply the same immobilization in existing local prediction.
- Icicle shell preserves chosen colors/eyes/hats; snowflake freezer badge, protection shield, freeze/rescue particles and compact local notices. Approved sounds reused. Requested Poison Tag poison poof/compact notice is presentation only.
- Existing 30-second reconnect remains: identities/roles restored, disconnected bodies remain eligible, expiry interrupts entire match. Frozen bodies remain frozen on reconnect.

## Regression evidence

`npm test`: 121 tests pass, including exact reversal/hash verification for every touched M15 source and prior accepted physics/input/viewport/cosmetic/arena tests. `npm run build` passes; existing large Phaser bundle warning remains.

- [Network](results/milestone-16-network.json): 2/3/4/8 independent clients across every arena; mode default, host-only/invalid/locked changes, readiness retention, freeze/immobility, rescue/protection, reconnect same frozen frog, freezer rotation, scoring/final/rematch and Poison fallback. Disconnect-expiry harness uses a 1-second test reservation; production remains 30 seconds.
- [Timeout](results/milestone-16-timeout.json): real 60-second round (no clock fast-forward), no automatic thaw, surviving runner escape victory, paused frozen points, 60-point survivor/no clear bonus.
- [Browser](results/milestone-16-browser.json): four Chromium clients, desktop 1280×900, phones 844×390 DPR3 and 667×375 DPR2, tablet 1024×768; lobby, ice/cosmetics, immobility/rescue/protection, full rotation/results/rematch, canvas aspect ratio and no page errors.
- [Touch](results/milestone-16-touch.json): mixed desktop/phone/tablet real WebSockets; trusted CDP eight-direction and simultaneous two-thumb charge, normal jump, terrain attachment/release, reciprocal frog pull, cancel recovery and orientation identity. Map-aware fixture uses Canopy; older historical harness expected retired terrain geometry and is not claimed passing unchanged.
- Existing cosmetics-network regression passed complete Poison Tag matches on all four arenas at 2/3/4/8 players, with cosmetics/reconnect/rotation/scoring/rematch.

No physical-device testing of Freeze Tag occurred here. Existing owner-approved iPhone touch/viewport code is unchanged; physical iPhone/Android acceptance of this candidate remains required. Linux WebKit executable is unavailable in this environment; no new WebKit pass is claimed. Classic Tag is not implemented.

## Manual acceptance

1. Create/join normally; confirm Sunny Pond/Poison Tag defaults. Pick Freeze Tag as host while already ready; readiness/cosmetics should stay. Peer cannot change mode. Start locks choice.
2. Two players: dodge/jump/grapple; freezer body contact ends round, tongue alone does not. Next round swaps freezer.
3. Three or more: freeze one runner; verify ice, no movement/grappling/bounce/sliding; another unfrozen runner body-rescues them. Confirm 1-second protection and normal movement return. No automatic thaw when left alone.
4. Repeat on all four arenas, including sponges/lily pads, sticky mud/paint and slippery soap; special effects cannot move frozen frogs.
5. Let one round reach 60 seconds. Remaining unfrozen runners escape; inspect paused survival + freezer points/clear bonus breakdown, cumulative totals, ties, full rotation and rematch.
6. Refresh a frozen player's same tab within 30 seconds: same frog/state/cosmetics returns. Let a disconnected reservation expire: whole match returns to lobby.
7. Mixed desktop/mobile landscape: simultaneous movement + jump/charge/tongue, independent release/cancel, Help, orientation and round transitions. Confirm accepted iPhone screen fit/two-thumb behavior.
8. Switch back to Poison Tag and check approved poison grace, grapple feel, scoring and presentation.
