# Milestone 14 — Croakwork Toyshop acceptance candidate

Approved parent: `9190495614ee195cd4357e3468b4dde079b84475`, checkpoint `checkpoint/approved-milestone-13-sunny-pond`. The approved arena-design-guide.md is included unchanged from the concept branch.

Fourth arena: an oversized dusty-blue toy workshop with apricot/coral blocks, thread spools, a sloped ruler bridge, a toy-house roof and mint rubber cushions. Offset low/mid/high routes encourage zigzag pursuit, diagonal crossings and roof interceptions, with open gaps for swinging. Decorations are subdued and non-solid; dark outlined polygons match the authoritative convex fixtures exactly. The floor stays clear for spawning and recovery.

Two rubber cushions reuse automatic lily bouncing unchanged: upward velocity 12 units/s, cooldown 12 ticks (0.2s), repeated landings bounce without action input, no horizontal impulse. Two sticky-paint tops reuse mud unchanged: controlled grounded speed ×0.75 (6→4.5 units/s), cleared on departure/jump. Side/underside/tongue contacts do not trigger surface effects. Approved poison bonus and grapple forces remain unchanged.

No edits to input, viewport, CSS, camera, sound, physics controller, networking or the original three arena definitions. The small arena registry/render/preview/descriptor adapters are reversible via milestone-14-preservation.json; historical baseline verification remains active. Art is original vector code, no downloads or new dependencies.

Validation: 101 unit/regression tests; dedicated toyshop spawn/recovery/deterministic restore/convex preview/material tests. Real loopback WebSocket arena regression covers all four maps at 2/3/4/8 clients with ready, roster freeze, reconnect, scoring, full rotation/final/rematch. Surface network checks at 2/4/8 clients cover repeat bounce, simultaneous pads, paint speed/restore and terrain grapple/release. Browser regression uses four independent desktop/phone/tablet-size Chromium clients, full match/results/rematch and canvas aspect ratio. Device emulation is not new physical iPhone/Android validation.

Playtest: select Croakwork Toyshop in lobby, ready/start with 2–8 players. Try both cushions repeatedly without jumping; traverse/leave the paint tops; swing below spools and across ruler/roof gaps; chase in both directions. Check platform corners for snags, high paint perch for camping, roof for escapes and 6–8 player mobile label readability. Physical fairness/feel acceptance remains pending. No Milestone 14 approval implied.
