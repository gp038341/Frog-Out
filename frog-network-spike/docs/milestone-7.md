# Milestone 7 — onboarding and submission readiness

Starting checkpoint: M6 release candidate `6b85ff332bb12ffd539f7392a742f966ae9542bb`; documentation/history head before work `7885bfee39cbd0c6fb6ed297d403285454e3cdd5`. User accepts this as the current checkpoint; physical iOS compatibility remains outstanding.

## Changes

- Home/lobby controls and concise Outbreak rules, with desktop keycaps or the actual left-pad/right-button touch concepts. Home has a visible Controls & Rules button.
- Footer How to Play opens a scrollable modal during any phase. It does not pause the authoritative match. Opening clears held controls; modal keyboard input is blocked from gameplay and touch controls are inactive until close. Fresh inputs resume afterward.
- All players receive confirmation before explicit Leave during a match, since the existing rule ends the match for everyone. Lobby leave preserves the existing immediate exit/host transfer policy.
- Same-tab reconnect, 30-second reservation and offline vulnerability explained without input-sequence/transport details. Notices clear on create/join/leave.
- Round results show Round X of Y; final results show total rounds and one Patient Zero turn each. Scoring is untouched.
- Root/app README, submission checklist, description draft and Free-host judging assessment updated. No final cover image or Handshake submission was created.
- Health/diagnostics milestone labels changed to 7; no protocol or authority change.

`milestone-7-preservation.json` plus existing baseline tests protect the exact M6 physics/tuning, simulation/arena, artwork/audio/theme, network/reconnect/Outbreak, touch recovery/mobile CSS and main input/responsive/fullscreen blocks. A separate UI stylesheet keeps the current visual identity intact. No dependencies or paid resources added.

## Implementation/test notes

The new Help test caught a queued native dialog-close cleanup clearing an immediately fresh key press. The UI now clears synchronously before closing, not in a delayed close event. This is a new panel lifecycle fix; approved game input handlers are unchanged. The legacy SDK latency fixture also needed to wait for actual ground support in the expanded arena and account for gravity between a 60 Hz launch and its first 30 Hz snapshot. Instrumentation measured full 0.8-second charge and -16.7 m/s at the first observed snapshot; the old near-instantaneous -17 m/s cutoff could miss a valid 18 m/s launch. The test now requires full authoritative charge plus the sampling allowance. No server/controller source changed. A results test now waits for rendered text after authoritative phase change rather than assuming the UI's existing 100 ms render interval has already run.

The longer touch fixture was also updated to recognize a legitimate Outbreak round ending and continue through the normal Next Round flow, rather than label a completed round as an input freeze.

Final automated results and deployment revision are recorded in `results/milestone-7-summary.json` and `results/public-milestone-7.json` after verification. Browser suites run only against isolated local Chromium or the public cloud Chrome browser. No physical iOS/Android claim.

## Acceptance playtest

1. Give two unfamiliar players only the public URL. Can they identify the objective, move/aim, tap-jump, charge, fire/hold/release tongue without verbal instruction?
2. Test keyboard and actual touch layout. Open/close How to Play while moving, charging and grappling; verify fresh input resumes, no held input persists and the match continues.
3. Host and non-host: choose Leave Room in a match, cancel and keep playing. Confirm only in a disposable match; others should return to lobby. Lobby Leave should remain immediate.
4. Verify round number/context, unchanged Survival + Bonus totals, host continuation, final standings and rematch readiness.
5. Refresh the same tab during play; verify the same frog returns. Do not interpret a new tab as a guaranteed reconnect.
6. Use small landscape sizes and optional fullscreen; check Help can scroll/close, controls remain unobstructed and orientation restores play.
7. Physical iPhone/iOS Safari remains required before release. Use Diagnostics for any mobile issue and report device/browser/actions.

Stop after Milestone 7 deployment. Personal approval is pending; no further content/features authorized by this milestone.
