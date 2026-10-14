# Lobby / voting visual playtest candidate

Approved rollback revision: `08b3ddea017cb1884f3fecabb366cc8a09aa2641`, checkpoint `checkpoint/approved-lobby-lifecycle-before-visuals`. This visual pass is a candidate, not owner-approved.

- Home pencil Edit action below the original hero frog opens the existing cosmetic editor in a dialog. Changes save to the same local appearance preference used on room join. No duplicate editor IDs or new appearance protocol.
- Lobby customization is expanded and sits above the player seats. Ready/Start retain their primary sticky position.
- Chaos receives an original illustrated badge, coral/plum treatment and explicit On/Off label; host authority and default remain unchanged.
- Between-round voting is a larger centered screen-space panel with scrolling on short viewports. Three/two/one-choice and reveal layouts adapt to actual ballot eligibility.
- Each connected voter leaves a frog-foot stamp in their selected skin color. Names remain available through accessible labels and tooltips; a changed vote moves the stamp, disconnected votes are excluded, and tie priority stays visible. Server vote counts and KEEP rules are unchanged.
- Eight lobby seats show connected players and labeled empty places. No changes to reservations, capacity or frozen gameplay roster.
- Original SVG and code-drawn32px PNG frog favicons. No external assets or services.

Gameplay, physics, modifier values, networking, mobile pointer handling and accepted viewport CSS remain unchanged. The preservation manifest records only authorized presentation adapters for historical regression checks.

Acceptance: home Edit/Done/Escape, save color/eyes/hat and join; expanded lobby editor on desktop and phone landscape;2–8 filled/empty seats and host Kick; Chaos toggle host-only clarity; centered ballots and winner reveal with1/2/3choices; stamps match cosmetics, move on changed vote and disappear on disconnect; no active-game layout/input regressions. Physical-device testing is owner acceptance, not claimed by browser checks. Stop after deployment for owner review.
