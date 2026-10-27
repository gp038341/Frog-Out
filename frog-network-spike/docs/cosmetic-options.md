# Independent frog colors and designs

Candidate for the owner's playtest; not marked approved.

Baseline: `e79275273af4c648b2402facac8354ce8d2bb58a`.
Recovery checkpoint: `checkpoint/pre-independent-frog-patterns`.

## What changed

- Color and Design / pattern are separate selectors for humans and host-edited CPUs. The ten existing body colors are unchanged; their labels now describe colors rather than a bundled pattern.
- Ten independent designs: Plain, Dart spots, Confetti freckles, Racing stripe, River ripples, Harlequin diamonds, Tiger bands, Lightning bolts, Star trail, and Pebble patches. Every design works with every color; accent ink uses the selected color's existing contrast palette.
- Eight expressions: the five existing gameplay expressions plus Wink, Joyful and Worried. Existing gameplay expression branches are retained. Previews now use those exact painters rather than different SVG eyes.
- Ten hat choices including No hat: the seven existing choices plus Rain hat, Leaf sprout and Coral bow.
- Mushroom and party preview hats use the already-approved gameplay anchor. Their in-game shapes and positions are unchanged. All existing hat painters are retained, including the outlined Daisy bonnet.

## Why previews differed

The portrait had a separate body silhouette, a cream belly with .66 opacity instead of the game's white .28 belly, different pattern geometry, separately authored eyelids and pupils, and independently positioned hats. Gameplay also added unselected slot-specific markings. `paintFrogCore` now owns the existing game's bean body, belly, toes, face and selected pattern. Both Phaser gameplay and SVG portraits call it. `paintHat` and its anchor are also shared. A small local SVG adapter converts the same draw commands to accessible SVG without images, external requests or new dependencies.

Neutral appearance matches across home, editor, lobby, results and gameplay. Gaze direction, gait, charge squash, bounce stretch, size changes, inflation, rotation, offline coloration and game-mode indicators still reflect gameplay state. Poison pattern priority, the starting Dart Frog badge (including its hat override), freezer/frozen effects and Classic Tag effects remain unchanged. Player labels continue to identify frogs; unselected slot markings are removed from the base cosmetic artwork.

## Data compatibility

The existing appearance object gains an optional catalog-validated `pattern` ID, carried through existing appearance messages, lobby/roster snapshots and localStorage. No new message, socket, account or server state system. New selections include an explicit pattern. Legacy three-field saved appearances and existing CPU defaults resolve to their former bundled pattern. Explicit designs persist when changing colors. The editor retains its latest optimistic cosmetic draft until that exact appearance is acknowledged, so earlier server echoes cannot replace newer color, design, eye or hat selections during quick edits. Editing becoming disabled clears the draft and restores authoritative appearance. Unknown IDs are rejected by the existing server validation path; normalization copies only known cosmetic fields. Existing ready-state and lobby-only edit restrictions remain intact.

## Verification

- 515 automated tests pass, including all 8,000 combinations, distinct pattern geometry, legacy migration, invalid IDs, persistence, identical portrait/game draw commands, poison priority, size transforms and exact protected runtime bytes.
- Production build passes; existing Phaser bundle-size advisory remains.
- Real Chromium UI checks at 1280×800, 844×390 and 667×375: independent selectors, refresh persistence, two human clients plus edited CPU, ready/start, identity sync, Tiny Trouble and Mega Frogs; no browser errors.
- Additional desktop/mobile gameplay checks across all four arenas, including Daisy and long-name announcements: eight cases passed.
- Twelve real WebSocket scenarios: all three modes × four arenas, alternating two humans and two humans plus six CPUs. Independent appearance sync, invalid pattern rejection, unchanged ready states, locked match appearance, and lobby reconnect preservation passed.
- Existing Bot A multiplayer/lifecycle suite passes, including all modes, voting/KEEP, reconnect/pause/cleanup, human priority, rematches and eight-frog stress on all four arenas. No local simulation overruns in that run.

All simulation, modifier, game-rule, AI, input, network and server TypeScript sources remain byte-identical. Historical preservation tests recover only the explicitly recorded cosmetic/test adapters; the new preservation guard independently checks today's actual runtime files.

Mobile checks are browser emulation, not physical iPhone/Android certification. Owner playtest should compare a chosen color/design/expression/hat in the lobby and match, try both corrected caps and the new options, and verify a refreshed/reconnected player's identity.
