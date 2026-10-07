# Milestone 8 — second arena geometry playtest

Approved M7 gameplay revision: `e97bbcb418468149e5b936c7ff9e95a0ccbe5b9b`, Git checkpoint `checkpoint/milestone-7-approved`. Existing history is preserved; the submission-ready version remains recoverable. M8 layout and art acceptance are pending.

## Scope / design

**Canopy Courtyard** stays the default and uses the exact approved `arena.ts` geometry and rendering. **Swingworks — Geometry Preview** is the second selectable arena, using the same 40 × 22.5 m / 16:9 single-screen footprint. No scrolling or hazards.

Swingworks replaces the Courtyard's central crossings with an open swing volume. Four tiers on each side give alternative ascent/escape routes (4–4.75 m rises fit the existing full charged jump). Offset tiers leave exposed undersides and wall access. Slim overhead teeth at x=14/26 create ceiling-angle grapple opportunities and launches between side routes. A low, narrow central perch offers an interception/launch route without partitioning the open center. Symmetry avoids an initial positional advantage, but it needs real multi-player evaluation for camping, pursuit and escape pacing.

The full floor remains non-lethal. Existing recovery and spawns are unchanged. Frogs have no new abilities. Approved tuning and physics/controller source are byte-identical. Current frogs/tongues/HUD/effects remain; the preview uses simple cool-gray collision surfaces against the existing quiet backdrop. No new assets, final decoration, sound, environmental mechanic or game mode.

## Selection / authority

The lobby host chooses from a labeled select control; every player sees the selected name and description. A change clears all Ready flags; the start condition remains 2–8 connected, all ready, host Start. Invalid, non-host and in-match map changes are rejected by the server. Selection is fixed for every round in the match, survives reconnect and is retained when returning to lobby/rematch. The next match may use another map. Separate rooms have independent choices.

A shared arena registry drives lobby options and physical/render geometry. A small static-body adapter replaces only terrain between matches, preserving dynamic frog bodies and approved simulation code. Snapshots identify their authoritative arena; clients construct its terrain before restoring/predicting state. The predictor algorithm, tick/input/snapshot cadence, collision/infection/grace/scoring and reconnect rules are unchanged. Terrain body ordering is tested for snapshot tongue-anchor restoration.

`milestone-8-adapter-preservation.json` records exact adapter diffs against approved M7. Tests reverse only these additions and require the original full-file hashes; historical baseline guards remain effective. No baseline hashes were overwritten. The original physics/world/tuning, arena, input, scoring, responsive/fullscreen/onboarding and frog presentation logic remains protected.

## Automated evidence

See `results/arena-network-milestone-8.json`, both `onboarding-*-milestone-8.json`, `lifecycle-milestone-8.json`, `stress-swingworks-milestone-8.json`, and the final summary/public report. Test arrangement controls exist only on isolated ENABLE_TESTS servers. Automated browser tests are Chromium with trusted touch input and emulated viewports, not physical iOS/Android certification.

An initial eight-body overlap fixture could not guarantee direct Patient Zero contacts after the solver separated the pile. The arena-match test instead creates individual real body contacts. The mixed-device terrain test targets Swingworks' nearby ceiling tooth rather than the old Courtyard beam position; changing map geometry changes valid shot locations, not input semantics.

## Your layout playtest

1. Create a fresh room, choose **Swingworks — Geometry Preview**, have everyone verify the same selection, Ready, then host Start.
2. Compare with Canopy in another match. Try 2, 4 and 6–8 players. Is the open center useful for escape/interception, or does it prolong outbreaks too much?
3. Charge-jump up either edge, grapple platform undersides/ceiling teeth, swing into the center and release across it. Are several escape routes reachable with approved controls?
4. Test grounded and airborne frog-to-frog pulling, reciprocal grapples, body collisions/infection, scoring and every Patient Zero round.
5. Look for dominant upper camping spots, frustrating ascent, cramped edge tiers, blocked swings or unavoidable traps. Report the location/count/device rather than requesting a physics retune first.
6. Refresh a player mid-match; verify same frog and same arena. Finish a match, rematch and change arenas; a change must clear Ready and the new geometry must agree on all clients.
7. Use keyboard and landscape touch, including orientation and optional fullscreen. Check names, infection markings, tongues, HUD and controls remain readable.

## Outstanding pre-submission validation

Physical iPhone/iOS Safari testing, physical Android retesting, small-screen/high-player-count readability and Render Free cold-start risk remain unresolved. No paid resources or artificial keep-alive are introduced. The existing Free service may sleep after inactivity, and in-memory rooms cannot survive a server restart/redeploy.

**Stop after deployed geometry/selection. Do not create final Arena 2 art until the user approves the layout.**
