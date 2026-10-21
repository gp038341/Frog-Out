# Swap Hop contact-protection refinement

Approved baseline / arrow checkpoint: `185efa3a2851663d46a2508cdd68551096dce084`, `checkpoint/approved-local-frog-locator`.

The sole runtime change increases `FROG_CHAOS.swapProtection` from 21 ticks (0.35 seconds) to 45 ticks (0.75 seconds) at the existing 60 Hz. This provides an extra 0.4 seconds to reorient after swapping. Both incoming and outgoing harmful frog-body tag/poison/freeze contacts retain their existing protection behavior; legitimate Freeze rescues, physical collisions, terrain, bubbles and other interactions retain their existing behavior. The existing protected-state visual reads the same authoritative deadline and naturally lasts longer. The approved YOU arrow remains 1.8 seconds after a swap and countdown-only at round start.

Validation: all 448 automated tests and the production build passed. Tests use actual swaps to verify both participants' 45-tick deadlines, snapshot restoration, protection during the added interval, exact expiration, and modifier cleanup. Existing all-mode body-contact and rescue tests remain passing. Source-byte preservation verifies the numerical constant is the only runtime change; controls, physics, arenas, spawning, bots, scoring, networking and the approved arrow are unchanged. Build retains the pre-existing large Phaser chunk warning. No new physical-device testing was performed.

Manual playtest: use Swap Hop near a tagger in Poison Tag, Freeze Tag and Classic Tag. Confirm the brief shield gives more time to move, then normal contact tagging resumes. Verify the existing arrow, swap animation and movement still feel right. Stop for user approval; no additional tuning is authorized.
