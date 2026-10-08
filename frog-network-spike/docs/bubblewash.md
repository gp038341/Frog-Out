# Milestone 14 roster revision — Bubblewash acceptance candidate

Pre-change main/deployed revision: `f20ff0d9e934fea5d4bd2f0e0228c3121e971f4d`, Render deploy `dep-db3qatom7kps73fm6i2g`. Completed Toyshop work was already pushed/deployed, not uncommitted. Preserved as `checkpoint/pre-bubblewash-toyshop-preserved` and `checkpoint/milestone-14-toyshop-candidate`; approved Sunny Pond remains `9190495614ee195cd4357e3468b4dde079b84475` / `checkpoint/approved-milestone-13-sunny-pond`.

Active roster, in order: **Sunny Pond (default), Bubblewash Bathhouse, Canopy Courtyard, Croakwork Toyshop**. Rainbell Conservatory alone is excluded from selectable/accepted room IDs. Toyshop is restored unchanged. Sunny Pond and Canopy geometry/art are unchanged.

New rooms choose Sunny Pond. Lobby host selection resets readiness and synchronizes everyone. Invalid/retired IDs resolve to Sunny Pond in lobby with an understandable notice; gameplay arena changes remain rejected. Returning to the same room keeps the host's selection; creating a fresh room uses Sunny Pond. The simulation adapter now correctly identifies raw historical courtyard construction as canopy, so selecting the new default installs real pond geometry rather than falsely assuming it is already loaded.

Bathhouse is lavender tiled frog-scale washroom: shallow soap dishes, melon bucket rim, brass faucet perches/handles, apricot sponges, turquoise decorative water, subdued mirror/towel/plumbing/bubbles. Visible bold polygons exactly match shared authoritative convex fixtures and preview polygons. Broad lower routes and separated upper perches encourage horizontal swings, alternatives and optional launch shortcuts. No bowls/traps, swimming, moving hazards or lethal surfaces.

Two sponges reuse lily behavior unchanged: automatic repeated top-contact bounce, upward velocity 12 units/s, cooldown 12 ticks/0.2 seconds, no extra horizontal impulse. Side/underside/tongue contacts do not trigger it. Existing sound/feedback remains unchanged.

**Soap omitted:** movement controller actively sets grounded velocity. Reduced fixture friction alone would not give a reliable controlled traction effect; convincing soap would need controller/prediction changes. Avoided that risk for this content pass. Soap shapes are ordinary non-slippery platforms, without special-behavior markings.

Validation: 106 passing unit/regression tests; roster/default/fallback, untouched-source hashes, convex geometry/preview, 2–8 spawn/recovery, deterministic restore and repeat sponge bounce. Authoritative WebSocket match tests all active arenas at 2/3/4/8 clients, choice/Ready/freeze/reconnect/full rotation/scoring/final/rematch; sponge synchronization at 2/4/8 clients and grapple/release. Chromium four independent clients desktop 1280×900, emulated phone 844×390/DPR3 and 667×375/DPR2, tablet 1024×768, full match/rematch/aspect ratio and no page errors. No new physical iPhone/Android certification; their accepted input/viewport source remains byte-preserved.

Playtest: confirm Sunny Pond default and four preview order; choose Bathhouse and ready/start; repeatedly land on both sponges hands-off; swing under dishes/faucets, chase across lower basin and escape upper perches. Try 2–8 desktop/mobile players and reconnect/rematch. Inspect camping/snags/readability. Existing clustered player-label overlap and Render Free cold starts remain limitations. Candidate is not milestone-approved.

## Roster correction

User clarified that Croakwork Toyshop should remain playable. Restored its existing registry entry to the active list; no map, art, surface, physics, input or viewport changes. Sunny Pond stays default; Conservatory stays retired.
