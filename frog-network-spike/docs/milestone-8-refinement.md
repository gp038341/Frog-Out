# Milestone 8 refinement — awaiting personal acceptance

Approved gameplay rollback remains `checkpoint/milestone-7-approved` (`e97bbcb418468149e5b936c7ff9e95a0ccbe5b9b`). Previous layout preview remains `checkpoint/milestone-8-geometry-playtest` (`995e484e25bd11cf627c661079b0338672104cde`). This pass will be checkpointed as `checkpoint/milestone-8-refinement-playtest`; it does not approve Milestone 8.

## Places and play
- **Canopy Courtyard**: warm garden, timber/moss surfaces, sun and boundary foliage. Exact approved Arena 1 collision geometry: balanced horizontal crossings and approachable tiered pursuits.
- **Rainbell Conservatory** (stable internal ID `swingworks`): cool rainy glasshouse, pale metal/grip edges, distant glass ribs and nursery plants. All tested side tiers/open center/low interception perch remain. The left overhead grip now ends at y=6.5 rather than 5.5; the right ends at y=4.5 rather than 5.5. This stagger creates different diagonal launch/interception angles. No additional solid, hazard, mechanic, physics retune or spawn change.

Background glass/rain/plants are low contrast and non-colliding. Physical rectangles retain crisp outlines on tops, undersides and walls. Environment is painted once per arena change; no additional per-frame effect system. Frogs/tongues/infection graphics, movement, network, inputs, rules and scores remain unchanged.

## Lobby
Ready/Not Ready and host Start sit directly beneath room information, before sharing/player list/previews/rules. Their sticky action row remains reachable while scrolling. Rules collapse by default; How to Play remains accessible. Host chooses using two visual cards; guests see the shared selection. Changing maps still clears everyone's Ready. Map freezes at match start and survives reconnect/rematch.

`src/ui/arena-preview.ts` draws inline vector thumbnails directly from the same arena definitions used by authoritative physics. There is no extra image download or independently maintained geometry. Metadata supplies name/descriptor; selected cards carry a tick, contrasting border and accessible pressed state. Stable IDs preserve existing room/state compatibility.

## Evidence and limits
- TypeScript/Vite/server build; 61 unit tests, including exact approved-source checks.
- Network matches: 2, 3, 4 and 8 clients on each map; selection permissions, Ready reset, freeze, identity reconnect, Patient Zero rotation, survival scoring, results/rematch.
- `scripts/arena-refinement-browser.cjs`: trusted Chromium pages; visible Ready without initial scrolling at 1280×900, 844×390, 667×375, 390×844, 320×568; no horizontal overflow; sticky Ready while scrolling previews; synchronized card selection; both themed arenas rendered in two-client matches.
- Existing onboarding desktop/touch suites on both maps and mixed mobile regression use local Chromium/CDP. These are not physical Safari/Android certification.

Outstanding: physical iPhone/iOS Safari, physical Android retesting, small-screen/high-player-count readability and Render Free cold starts. Layout/theming fun/readability require user acceptance. No paid resources or hosting migration authorized or introduced. Public service remains https://frog-out-milestone-2.onrender.com/ .

## Acceptance
Refresh the public URL. Create/join with desktop and phone; confirm Ready is immediately visible, host Start is obvious, and rules remain discoverable. Select each card and verify guests see it and everyone must Ready again. Compare garden horizontal chases against glasshouse vertical escapes/ceiling swings/launches with 2, 4 and ideally 6–8 players. Check small-screen infection/tongue/platform readability, touch release, refresh/reconnect, results and rematch. Report awkward grips, camping, visual ambiguity or long pursuits. Stop before any next arena/mode/milestone.

## Public deployment
Deployed revision `cfc7601a2a320a7d03c3a1cad90b789467263b46`, Render deploy `dep-db34ldvlk1mc739e2jcg`, live 2026-10-07T13:36:51.656143Z. Public two-client verification is in `results/public-refinement-milestone-8.json`. Later evidence-only commits do not change this deployed game.
