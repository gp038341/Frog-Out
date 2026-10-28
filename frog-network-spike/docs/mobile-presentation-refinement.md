# Mobile presentation refinements

Approved baseline: `e16379f6d91f7c081332bc3990dabfcc56a2fe72`.
Approval checkpoint: `checkpoint/approved-performance-results-update`.

- The portrait prompt previously required an active session. It now depends only on the existing touch-layout detection and portrait orientation, including home, lobby, and results. It clears when landscape returns. Input ownership and all movement/action mechanics remain unchanged.
- The full active-modifier list was absolutely positioned over the arena. It now appears within the existing Settings dialog (Escape or the touch Settings button), immediately above Close/Leave. Voting cards and the synchronized list content are unchanged. No extra game-space row or overlay reduces the map. The approved swap/gravity warning indicators remain unchanged.
- The raised green podium lip used an absolutely positioned pseudo-element with no text clearance. Added reserved space beneath score glyphs and above the placement labels. Small-landscape placement type is slightly smaller. At <=380px height, the existing compact score-breakdown/action row is reused to preserve the visible podium space. Scores, standings, count animation and champion-last reveal are unchanged.

Validation: full automated suite; production build; real local browser home/portrait/landscape checks with desktop and iPhone-user-agent touch emulation; CPU match and modifier state; Settings open/close with unchanged arena bounds; 25 results fixtures across 1280x800, 1024x650, 844x390, 667x375 and 568x320, including eight players, ties, final results, long names and large totals. Added explicit checks separating placement labels and scores from the green lip. Chromium emulation is not physical iPhone Safari or Android testing.

Preservation guard hashes every unrelated runtime source and public asset. Only four runtime presentation adapters changed. No physics, CPU, modifier effects, networking, music, controls or server changes.

Rollback: restore these four files from the approval checkpoint using a new commit and deploy normally. Never reset or force-push history. Stop for user playtest after deployment.
