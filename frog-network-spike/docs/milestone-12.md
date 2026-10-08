# Milestone 12 — Poison Dart Frog balance prototype

Approved M11 parent: `0b65d9954ad3da5b0a95ad15931ea4b571b35700`.
Approved checkpoint: `checkpoint/approved-milestone-11-poison-tag`.
Approved deployment: Render `frog-out-milestone-2`, deployment `dep-db3dligm7kps73e8avt0`, same commit, live.
Prototype checkpoint: `checkpoint/milestone-12-poison-pull-candidate` (tip records exact revision).
Public URL: https://frog-out-milestone-2.onrender.com/

## One isolated balance value

`src/game/poison-balance.ts`: `POISON_BALANCE.grapplePullMultiplier = 1.1` (original `1`). Fully poisonous frogs gain **10% active inward grapple acceleration**: approved 48 world units/s² becomes 52.8. Safe and transforming frogs remain 48. The approved soft relative inward speed ceiling stays 8; takeup stays 4. Reach, size, mass, ordinary movement and jump tuning are unchanged. This helps acceleration from low momentum while keeping the existing speed ceiling and swing momentum. It is intentionally conservative and requires human balance acceptance.

OutbreakRoom assigns each frog's server-owned eligibility tick from the existing authoritative `infectiousTick` before physics. The starting tagger gets the increase immediately on active play. Others gain it only when their 60-tick grace expires. Input messages cannot set eligibility. Snapshots include the optional tick, so existing client prediction/restoration uses exactly the same multiplier across grace expiry without a networking redesign. Pure physics/lobby simulations without eligibility retain original behavior.

Both bodies still receive equal-and-opposite impulses with mass weighting. Clearance, short-distance early-out, rope takeup/constraint and release behavior are unchanged. The multiplier applies only to the frog firing the tongue, not to a safe frog merely attached to a poisoned target. Multiple tongues can still combine physically as before; no additional buff.

## Revert

Set `grapplePullMultiplier` to `1`, commit and deploy normally. This restores original balance without removing snapshot compatibility or unrelated approved work. Full M11 fallback remains the approved checkpoint; do not force-push/rewrite history. The exact-1.1 prototype assertion must be updated if intentionally accepting another value.

## Validation

87 unit/preservation tests: exact 10% terrain/dynamic impulse increase; safe/grace unchanged; precise eligibility; snapshot round trip; reciprocal momentum; unchanged radial ceiling/tangential momentum/release; short-distance behavior; repeated attach/release; 2/4/8-frog chase/escape stress; identical non-grapple move/jump trajectories; all approved runtime sources unchanged outside documented three-file edits.

Independent WebSocket checks cover both arenas at 2/3/4/8 clients, start/selection/reconnect/rematch/complete rotation/scoring, and authoritative starting-poison eligibility. Outbreak and real 30-second lifecycle regression reports are in `docs/results/milestone-12-*.json`. Browser UI and touch compatibility tests distinguish Chromium emulation/synthetic native multitouch from physical-device validation. No new physical iPhone/Android playtest is claimed. Accepted iPhone input, viewport, static camera, visual and sound source files are preserved exactly.

## Acceptance playtest

Compare low-momentum terrain attaches and launches as safe vs poisonous; chase a safe frog without overwhelming escapes. Try frog-to-frog pull from rest, against opposite momentum and near a ledge. Confirm both bodies move, short separation does not trap them, release preserves motion. Compare two-player rounds and 4–8-player last-safe pursuits in both arenas. Verify newly poisoned frogs receive no advantage during transformation. Check desktop and simultaneous two-thumb mobile controls, sound, static framing and reconnect. Watch for spikes, uncontrollable swings or several poison tongues producing excessive combined pulling. No scoring/rules/audio/art/layout changes are intended.

Prototype only; stop after deployment for designer approval. No next milestone.
