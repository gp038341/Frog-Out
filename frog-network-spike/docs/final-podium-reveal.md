# Final standings: direct finish and sequential podium

Approved baseline: `ffa8b07d1dc1854cca42edaf6c8f1f860adb37c3`, preserved as `checkpoint/approved-bot-competitiveness-update`.
This is a presentation candidate awaiting user acceptance.

- Earlier rounds retain their existing score counts, rank movement, host continuation, and Chaos Voting.
- The completed final playable round presents final standings directly. It does not show the last-round score update, round gains, or rank-change captions first.
- The existing 1.8-second anticipation curtain leads into individual podium entrances, 0.85 seconds apart: third, second, then first. Shared places remain tied and each portrait enters individually; shared champions are last.
- Totals appear at their exact authoritative values. The full list, winner announcement, and expandable table remain hidden until the final podium frog enters. Confetti accompanies the winner reveal.
- Reduced-motion preferences show final totals immediately. Hidden-tab cleanup and leaving results cancel pending animations. Other screens and existing controls remain intact.

The server, scoring, game-mode rules, CPU behavior, modifiers, physics, and arenas are unchanged. A client-only presentation adapter reads the settled server totals/ranks and recognizes the last playable round, including absent future starting roles. Return to Lobby sends the existing ordered host commands (`next-round`, then `return-lobby`) to complete the already-approved final handoff, without adding a server message or changing authority. Reconnecting clients use the same settled results; no scores are inferred from animation.

Validation: 464 automated tests and production build passed. Browser validation covers desktop, laptop, two mobile landscape sizes, ordinary/tied/shared podiums, reduced motion, exact totals, sequential visibility, hidden spoiler details, and two independent clients through complete Poison Tag, Freeze Tag, and Classic Tag matches and rematches. Browser mobile emulation is not a physical-device test.

Manual playtest: finish a match in each mode; confirm the final round skips its ordinary score update, podium frogs appear separately with first place last, and Return to Lobby works. Also check an earlier round still uses the approved count-up/rank animation.
