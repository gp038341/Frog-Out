# Chaos B tuning refinement — playtest candidate

Parent: `68f178da974167f5de7afac2d153e5f8c0e2596a`. Recovery checkpoint: `checkpoint/pre-chaos-b-tuning-refinement`.

Authorized feedback: increase Turbo; add modest normal frog-grab assistance and a stronger Magnet Mouths. Tiny Trouble remains unchanged and received positive player feedback. Mega Frogs and Super Suckers still await player testing; neither is approved by this refinement.

| Parameter | Previous | Candidate |
|---|---:|---:|
| Turbo ground speed multiplier | 1.15 | 1.50 |
| Turbo ground acceleration multiplier | 1.20 | 1.60 |
| Turbo ground speed | 6.9 | 9 |
| Turbo ground acceleration | 72 | 96 |
| Normal grab assist half-cone | 0° | 8° |
| Magnet Mouths assist half-cone | 6° | 24° |
| Normal maximum target lead | 0 s | 0.18 s |
| Magnet maximum target lead | 0 s | 0.30 s |

Ground braking, air movement, jumps, reach, rope forces and pull caps are unchanged. Butterfeet still composes its traction reduction with Turbo. All previous B size/pull tuning is unchanged.

Assistance is a one-time firing-direction correction. Only current targets inside the cone and existing range qualify. A bounded velocity/gravity forecast accounts for tongue travel. Correction cannot exceed the cone; blocked terrain and intended terrain hits are preserved. Frozen static frogs are excluded. The trajectory does not home or steer after firing, hitboxes are unchanged, and later movement can still make a shot miss. The shared simulation performs the same selection on server and client.

Normal assistance applies with Chaos disabled and in Round 1. Magnet expiration restores 8°/0.18 s rather than disabling normal assistance, as requested.

Validation: 157 automated tests and production build; local compiled-server multiplayer report in `results/chaos-b-refinement-network.json`; 16 eight-frog/all-arena representative-stack stress runs in `results/chaos-b-refinement-stress.json` (maximum p95 0.207 ms, p99 0.331 ms, 16.67 ms tick budget). Local measurements are not Render CPU measurements. Tests cover cone limits, moving-target capture, committed trajectory, exact previous source recovery and protected mobile/input/arena/mode/audio bytes. No new physical iPhone or Android testing is claimed.

Playtest: compare ordinary grabs with Magnet, including jumping targets, moving-away targets, terrain shots near frogs, reciprocal pulls and crowded rooms. Check Turbo's turning/stopping with and without Butterfeet. Test Mega Frogs and Super Suckers separately; their acceptance remains pending.
