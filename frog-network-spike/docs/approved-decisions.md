# Approved decisions — 2026-10-06

Game Specification v1.0 remains authoritative, with these user-approved amendments:

1. Tongues use maximum-length rope constraints: slack is allowed; taut at attachment length; no rod behavior.
2. Begin with simple server-authoritative synchronization. Preserve separation for prediction/reconciliation, adding complexity only when measurements justify it.
3. Healthy frogs infected in the same authoritative tick tie for placement/score. Physics callback ordering must not assign survival order. Points count frogs infected in earlier ticks.
4. Reserve reconnect seats for 30 seconds. Clear inputs, release outgoing tongue, retain the physical frog and its eligibility for infection. Restore current state on timely return. Expiry during an active match interrupts it and returns remaining players to the lobby with a message.
5. Highest cumulative score ties share victory; no tiebreak.
6. Freeze match roster; joins occur in the lobby only.
7. Only Milestone 1 is authorized in this deliverable. Stop before Milestone 2.

Only item 1 and the local physics boundaries are implemented here. The others are recorded for later authorized work.

## Subsequent Milestone 1 tuning amendment

User approved an active grappling hook effect while holding: inward physical pull combined with a slack-capable maximum-length rope and automatic takeup of achieved slack. This supersedes the passive-only behavior in item 1. The user also authorized a charge threshold, small landing input buffer/coyote time, and moderate movement tuning. No networking milestone is authorized.
