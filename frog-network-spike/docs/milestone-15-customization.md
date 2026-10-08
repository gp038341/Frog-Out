# Milestone 15 — Frog Customization (acceptance candidate)

## Approved baseline

Before changes, GitHub `main` and Render's live deployment matched `41b3c9c8555020e85b942f2659c28a265c14434b` (approved four-arena build with stronger localized soap traction). Preserved on `checkpoint/approved-milestone-14-four-arenas-soap`.

Active arenas remain Sunny Pond (default), Bubblewash Bathhouse, Canopy Courtyard and Croakwork Toyshop. Conservatory remains retired. No arena, physics, poison advantage, input, viewport, camera, scoring, sound or match-rule source was changed.

## Choices

- 10 paired colors/patterns: Pond Pop, Coral Confetti, Lagoon Lightning, Sunshine Speckles, Orchid Swirl, Melon Racer, Mint Mosaic, Berry Bandit, Blueberry Dots and Lime Checkers.
- 5 eyes: Cheerful, Determined, Sleepy, Surprised and Mischievous.
- 6 hats plus no hat: Tiny Crown, Mushroom Cap, Cowboy Hat, Propeller Beanie, Party Cone and Daisy Bonnet.

In the lobby, open **Dress your frog**. All choices update a live portrait and synchronize to other player cards. Ready/Start stay above this collapsible panel. Choices remain cosmetic and do not reset Ready or alter match behavior. Cosmetic changes are accepted only in the lobby.

## Data and readability

The client sends three catalog IDs. The server validates them, strips unknown properties and stores appearance on its player record. Invalid join data safely defaults; invalid updates are rejected with a notice. That same record survives rounds, rematch and the existing same-player reconnect reservation. Cosmetics are broadcast with lobby/player metadata, not injected into physics snapshots or simulation bodies.

Selections are saved locally under `frog-out-appearance-v1`; unavailable/private storage gracefully defaults. No account, external service or purchase is involved. Defaults are Pond Pop / Cheerful / No hat.

Custom patterns yield to the approved black/rimmed poison flank spots during transformation and poison. Transformation rays, poison outline/diamond motes and explicit status labels remain. The starting Dart Frog badge replaces the chosen hat for that match; the chosen hat returns afterward. Names, permanent slot markings and the local-player indicator remain. Cosmetic crown is coral, distinct from the starting tagger's gold badge.

## Art and performance

All new portraits, eyes, markings and hats are original code-generated SVG/Phaser vector art in the repository. No external assets or licensing dependencies. Hats follow the frog's existing render motion without changing collision shape. No new textures, network streams, audio or expensive particle systems.

## Validation

See `docs/results/milestone-15-network.json` and `milestone-15-browser.json` for completed checks. Unit tests validate all 350 combinations, invalid data, poison precedence and exact restoration of approved source beneath narrow presentation/metadata adapters. Full network checks exercise all four arenas with 2, 3, 4 and 8 independent clients, appearance validation/sync, frozen in-match selection, reconnect identity, every round, survival scoring, final standings and rematch. Browser checks cover live preview, four distinct appearances, desktop 1280×900, phone landscape 844×390 and 667×375, tablet 1024×768, complete Poison Tag match/results/rematch and page errors.

Phone configurations are automated Chromium emulation, not new physical iPhone or Android testing. The accepted physical-device input and viewport implementations are byte-preserved. Physical customization readability should be checked during acceptance. Existing clustered-player name overlap and Render Free cold-start/room-loss-on-restart limitations remain.

## Acceptance checklist

1. Create/join with at least two devices. Choose different skins, eyes and hats; confirm all lobby previews update.
2. Verify Ready/Start remain easy to find; open/close customization on a landscape phone.
3. Start a match. Compare your portrait with your moving frog; check hats/eyes remain readable while jumping and grappling.
4. Check transforming/poisoned frogs and the starting Dart Frog remain immediately recognizable regardless of cosmetics, including tiny crowns.
5. Refresh/reconnect the same tab during play, advance rounds, and return for rematch: appearance should persist.
6. Leave and create/join again: the same browser should remember your choices. Check desktop and two-thumb mobile controls remain unchanged.

STOP after deployment for user acceptance; this candidate is not automatically approved.
