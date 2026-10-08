# Approved Milestone 16 rules

Approved through the design conversation, with subsequent corrections: no automatic thaw; frozen frogs surrounded by an icicle shell; two-player Freeze Tag ends on the first freeze. Timeout winners explicitly confirmed as the remaining unfrozen runners (shared escape victory), independent of cumulative points.

## Freeze Tag (implementation scope)
- 2–8 players. One freezer stays freezer throughout a round. Randomized starting order; each frozen roster member starts as freezer exactly once per match.
- 60-second authoritative active round limit. End earlier when all runners are frozen, including the first freeze in a two-player room.
- Body contact only. Tongues never freeze or rescue.
- Only an unfrozen runner can rescue another frozen runner through body contact. No automatic thaw, in any player count. No rescue is possible with two players.
- Rescue grants 1 second of freeze protection. Continued contact can freeze the runner again after protection expires.
- Freeze resolution precedes rescue in each tick. Newly frozen runners cannot rescue that tick; only runners already frozen before the tick are eligible for rescue. Apply the whole batch before checking all-frozen completion.
- Frozen frogs cannot move, jump or grapple. Remain solid at their frozen position, visible in an ice/icicle shell. Release incoming and outgoing tongues on freezing; frozen frogs are grapple-ineligible. No platform bounce, mud, soap or momentum bypass.
- Runners: 1 point per second unfrozen during active gameplay; pause while frozen, resume after rescue. Freezer: 3 points per successful eligible freeze, plus 5 for freezing everyone in 3–8-player rooms. The previously approved two-player exception retains no all-frozen bonus.
- End-all-frozen: freezer wins the round. Timeout: remaining unfrozen runners share the escape victory. Highest cumulative points wins the match; score ties share victory. Scores display one decimal place.
- Existing announcements/countdown, host-led round results/next round/final standings/rematch. Existing 30-second reconnect behavior unchanged: bodies remain in play, identity/role restored, expiry interrupts the entire match.
- Cosmetics remain visible under state treatment; freezer has distinct snowflake/cold badge, frozen frogs ice shell, protected runners shield/countdown.

## Classic Tag (approved design, deferred)
- 60-second rounds, 2–8 players. Each player starts IT once in randomized order. 1 point/second not IT; cumulative points and shared score ties.
- Body contact transfers IT once per tick. New IT cannot transfer for 1 second. Continued contact may transfer afterward. For multiple targets, nearest body center, then roster slot for exact ties; never callback order.
- Poison poof at transfer and compact YOU'RE IT notification. Poison Tag conversion similarly gets a poison poof and compact YOU'RE POISONED notification without changing any poison rules.

## Integration boundaries
Poison Tag default and approved rules unchanged. Host-only lobby mode selector; synchronized to all; frozen during match. Cosmetic and Ready state preserved on mode selection. Existing four arenas and Sunny Pond default unchanged. No new abilities/items/maps/physics tuning/camera/input/viewport changes. No automatic implementation of Classic Tag.

Approved pre-implementation gameplay: `f894102e9bb7f69406de278f94542d92f8154d0c`, checkpoint `checkpoint/approved-milestone-15-frog-customization`. Physical-device acceptance of new mode is pending even though the accepted input and viewport implementations are preserved.
