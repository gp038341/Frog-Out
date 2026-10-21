# Cartoon frog results — playtest candidate

Preserved baseline: `bb6a00518f79a4741b59fc00a023cd95fef3feb4`, `checkpoint/pre-cartoon-results`. Earlier approval checkpoints remain intact. This is a results presentation change only.

## Presentation

Both round and final results show a lily-pad/block podium and a complete portrait standings board. Non-tied placements put 2nd left, 1st center/highest, and 3rd right. The podium is explicitly the current **cumulative match standings**, using the server's `finalPlace` for both screens; actual round winners remain identified separately. All players, including frozen-roster departed entries and CPUs, remain in the complete board.

Portraits reuse `appearancePreview` and the existing skin/pattern/eye/hat catalog. Match-roster slot/ID identity is authoritative; connection status is taken only from the matching current ID. CPU network-disconnected flags do not label CPUs as offline.

Shared ranks share a labeled tier. Competition-ranking gaps remain gaps; a three-player podium is never filled with invented placements. If more than three frogs share a qualifying rank, all share the tier. Final champion accents use the server's `matchWinners`, including every tied winner.

Each round's count runs for 1.35 seconds from `totalPoints - roundPoints` to `totalPoints`, with a separate round gain. Final scores count from zero to the exact authoritative total. No score cache or inferred gameplay events are needed for reconnects. Endpoints are assigned exactly, and the existing detailed scoring table is retained under **Score breakdown**. Identity/status refreshes do not restart a previously seen score reveal.

Final standings alone have 24 non-interactive CSS confetti pieces, removed after 2.6 seconds, plus a brief champion hop. Reduced motion skips counting animation and confetti. Hidden tabs, voting, new rounds, and rematches settle/cancel effects safely. No new sounds/assets/services/dependencies are introduced.

## Layout and controls

Desktop uses a broad podium with four-column standings. Shorter laptops use a side-by-side layout. Landscape phones retain the host controls and settings/footer in the visible rectangle, with scrollable standings when space is limited; wide phones use three standings columns. Very short screens and large tied tiers require scrolling inside the awards area. Every frog remains rendered and reachable. Frog portraits, score text, ranks, and identities remain separate semantic content.

The existing mode renderers still own the original table and host-only Next Round/Final Standings/Return to Lobby buttons. The results adapter only moves the same button nodes into an action rail; it does not register host actions or send network messages. Animations never advance a round or block a valid host action. Existing gameplay camera, usable-viewport measurement, input ownership, physics, CPU logic, scoring, and multiplayer code remain unchanged and hash-verified.

## Validation and manual acceptance

Automated model tests cover real authoritative rules in all three modes at 2, 3, and 8 frogs; exact prior totals/gains and count endpoints; actual catalog cosmetics; competition ties and eight shared champions; departed/offline roster identity; and protected runtime sources.

Browser scenarios cover desktop 1280×800, laptop 1024×650, landscape 844×390 and 568×320, 2/3/8 frogs, round/final screens, all three modes, shared winners, reduced motion, every portrait's SVG, exact count endpoints, scroll access, final-only confetti, and early-action cleanup. Compiled-server two-client scenarios complete matches, voting, and rematches through existing UI controls. Mobile checks use Chromium emulation; no fresh physical iPhone/Android test is claimed.

For playtesting: try a human/CPU match with distinct hats; inspect round deltas and totals; open Score breakdown; advance before counting finishes; complete a match and inspect confetti/shared champions; test eight frogs and scroll the smallest landscape layout; refresh/reconnect during results; return to the lobby and rematch. No gameplay balance changes are included.
