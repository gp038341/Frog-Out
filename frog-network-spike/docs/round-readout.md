# Round-number readouts — playtest candidate

Baseline: `b8203763a3d4f5c4696ee899ec4ceee7bed30a5e` (existing Swap Hop protection playtest checkpoint). Earlier approved checkpoints remain preserved.

A compact `Round N/Total` badge appears at the upper-left of the gameplay area during the role reveal, countdown and active round. It is an absolute, noninteractive overlay and does not reserve another layout row or alter the canvas parent dimensions. Mobile placement respects the left safe-area inset. Room code and map details remain in Settings.

Between-round results now say `Round N/Total complete` in a more readable, bold context line. Chaos Voting shows the same completed-round label above its existing heading/cards; it is reattached safely when the voting panel rebuilds. The caption deliberately describes the completed round rather than predicting a next round that could be skipped after a departure. Final standings retain their existing overall-match context and celebration.

The new presentation adapter reads the existing authoritative round/count and phase. It adds no gameplay state, inputs, messages or timers. Gameplay, bots, controls, iPhone viewport code, scoring, modifiers (including 0.75-second Swap Hop protection), music and approved results animations remain preserved.

Validation: full 448-test suite and production build passed. Existing results browser coverage includes 20 desktop/laptop/mobile-sized cases and real two-client Poison/Freeze/Classic matches, results, voting and rematches. Added assertions check live round labels, completed-round/voting labels, hidden gameplay badge during results, and identical canvas bounds with the overlay shown or hidden. Physical-device testing was not performed. Production build retains the existing Phaser bundle-size warning.

Playtest: check top-left round counts in all modes; advance through results and Chaos Voting to the next countdown; check mobile landscape and Settings. Stop for approval before any further change.
