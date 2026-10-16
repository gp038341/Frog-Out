# Rules and controls presentation refinement

Candidate for owner playtest; not automatically approved.

Approved baseline: `546f8357283d90a17e09fae3afad79250c6eed8a`, checkpoint `checkpoint/approved-bot-c-final-gameplay-baseline`.

## Requested changes

1. Remove repeated controls/rules from the same screen. The home page's extra Controls & Rules button and inline guide are removed; the lobby's duplicate rules disclosure is removed. The existing persistent How to Play button is the single home/lobby help entry. During a match, the existing Menu / Escape → Controls & Rules path is unchanged. One shared dialog contains one copy of the guide; it is no longer cloned or moved between screens.
2. Poison Tag has its own collapsible mode section, with the same presentation as Freeze Tag and Classic Tag. Shared movement controls are mode-neutral. The selected lobby mode still has a short contextual descriptor.
3. Chaos Voting leads the guide in a highlighted card: 20 modifiers, normal round 1, 15-second between-round voting, individual votes including CPUs, visible tie priority, up to three effects and KEEP renewal. The home introduction also highlights voting and stacking instead of treating Poison Tag survival as the whole game's objective.

Desktop and touch instructions retain their approved wording and input concepts. All mode rules/scoring remain unchanged. The shared dialog retains existing scroll limits, modal input clearing and keyboard suppression. The new card/heading styling is limited to help content. No viewport, touch, camera or gameplay styles were changed.

## Preservation and validation

- `docs/rules-guide-preservation.json` records the four authorized runtime-file edits and protects all other server/client/public source bytes, including every CPU file, game mode, modifier, physics, arena, networking, customization, mobile/iPhone input and viewport source.
- Historical preservation tests use an explicit adapter for these authorized presentation changes. Binary assets continue to be checked as raw bytes; earlier manifests are unchanged.
- `npm test`: **344/344 passed**, including single-copy guide structure, equal mode sections, Chaos wording, help opening/closing from home/lobby/game, input-clearing behavior and all existing gameplay/bot regressions.
- `npm run build`: passed (existing Vite large-chunk advisory remains).
- Public browser handoff checks cover home/lobby duplication, the three mode sections, Chaos-first content and in-game menu/help access. No physical iPhone/Android testing is claimed for this presentation-only change.

Deploy only to the existing https://frog-out.onrender.com/ service. Candidate checkpoint: `checkpoint/rules-guide-chaos-refinement-playtest`. The handoff records its exact commit and live deployment status. Stop for owner approval; do not start another refinement automatically.
