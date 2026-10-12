# Chaos D — bigger pop/bounce and bubble escape refinement

Playtest candidate, not approved. Baseline remote main `f8aadf0d54ba82d57e75acbc4f9f39087eccc9f9`, checkpoint `checkpoint/pre-chaos-d-pop-bounce-refinement`. Approved C `b31caa9c1916d1647123934da8321de76bbb0469` remains recoverable. Canonical Free service https://frog-out.onrender.com/ only.

## Changes and centralized values
All below live in `src/chaos/frog-chaos.ts` (`FROG_CHAOS`), units metres, seconds at 60Hz.

|Behavior|Before|Candidate|
|---|---|---|
|Bumper normal separation|4–8, incoming speed dependent|24 fixed target|
|Bumper added velocity per frog per tick|6|24 total bounded budget|
|Bumper upward kick|none|target upward speed8, within budget|
|Balloon inflated duration per10s cycle|3s|7s|
|Balloon end pop|none|upward speed18, preserves faster upward momentum|
|Balloon ordinary support rebound|restitution .2 only|outward speed18;12tick repeat guard|
|Balloon spring rebound|ordinary surface|1.35× approved spring launch, minimum18, maximum24|
|Bubble spawn opportunity|8s|2s, existing max2 retained|
|Bubble capture timeout|2s|6s from capture, independent of free-shell lifetime|
|Bubble escape|1 fresh action press|5 fresh presses; holding never adds presses|

Balloon gravity .65, combined floor .25, warning .75s, visual1.20, core collider/mass and restitution .2 unchanged. Tangential velocity is preserved on support rebounds, including tilted platform normals. End pop applies to dynamic uncontained frogs; frozen or bubble-contained frogs are excluded to respect mode/capture restrictions. No repeated post-step jitter launches. Balloon expiration clears overrides without an artificial expiry launch.

Bumper tags/rescues/infections resolve before extra impulse; one kick per new contact episode. Frozen bodies remain immovable; no explosive repeat while overlapping. Extra upward kick respects the same per-tick budget. Reciprocal mass-aware normal impulse preserves tangent before the intentional upward kick.

Each bubble escape press is consumed even before fifth, preventing accidental jumps/tongues. Five dots and local POP n/5 explain progress. Existing ceiling/freeze/expiry safety releases and1s recapture protection remain: six seconds is a maximum, not guaranteed if a frog reaches the ceiling first. Existing lift/steering/core/taggability unchanged.

Swap timing/protection/pairing unchanged. Persistent authoritative screen-space SWAP IN countdown turns amber in the1.5s paired warning. Own frog has a cream/dark halo, gold pointer and YOU label. Other names and selected body colors remain, helping tracking without removing chase information. This does not affect hitboxes.

## Validation
Full automated tests/build, compiled local network and timed network reports, and eight-frog microbenchmark are recorded under `docs/results/chaos-d-refinement-*`. Exact before/after hashes and reverse adapters in `chaos-d-refinement-preservation.json` preserve all untouched source: input/viewport/main/network predictor, approved C arena modifier code, surfaces, audio, mode rules, authored arenas. Mobile/hybrid input tests included in full suite. No physical iPhone or Android testing claimed for this candidate.

## Playtest
Vote Balloon: watch seven-second inflation, stronger hands-off terrain rebounds and synchronized end POP. Try angled spring platforms; verify strong existing swing momentum remains useful. Vote Bumper: stand/run into another frog at low/high speeds; all contacts should launch strongly, tag first and avoid repeated jitter. Vote Bubble: try hold (one press only), then five released taps, confirm visible progress and no accidental tongue/jump on fifth; wait for safety timeout; check more frequent entries while below2. Vote Swap: check countdown throughout, own YOU marker after swaps, and normal controls/reconnect. Try four/eight players and Moon/Wind/Ball/size combinations. Physical phone feel remains for player acceptance. No Milestone E or unrelated feature work.
