# Frog-Out

A playful **2–8 player** real-time physics party game. Run, charge-jump and swing through Canopy Courtyard with a pulling tongue. Grapple the arena—or another frog—while an outbreak spreads through body contact.

**[Play Frog-Out](https://frog-out-milestone-2.onrender.com/)**. No player accounts or installation. Bring at least one friend on another browser/device.

## Play

1. Enter a display name and create a room.
2. Share its six-character code or copied join link. Friends enter a name and join.
3. Read Controls & Rules. Everyone selects Ready; the host selects Start Outbreak.
4. Healthy frogs escape; poisoned frogs chase. Everyone becomes Patient Zero once per match. Highest total score wins, including shared victories.

**Desktop:** WASD/arrow keys move and aim. Grounded, tap/release Space to jump, or hold/release for a charged launch. Airborne, press Space to shoot your tongue; hold to pull, release to detach with momentum.

**Touch:** left eight-direction pad moves/aims; right JUMP/TONGUE button performs the same action. Landscape is recommended; fullscreen is optional. How to Play remains accessible during the game.

**Outbreak:** frog-body contact alone spreads poison; tongues never directly infect. Newly infected frogs have one second of grace. Healthy survival earns **1 point/second**, plus **2 points** for the last healthy frog(s). Infection stops survival scoring. Patient Zero earns zero. Round results separate survival, bonus and cumulative totals.

## Development

The current app is in [`frog-network-spike/`](frog-network-spike/); its historical directory name does not mean the game is incomplete. Root source/archive files preserve the initial physics prototype and Git history.

With Node.js 22+, from the repository root:

```sh
cd frog-network-spike
npm ci
npm run build
npm start
```

Open http://127.0.0.1:2567/ in independent browser tabs/profiles. See the [app README](frog-network-spike/README.md) for development servers, tests, diagnostics and architecture.

One existing Render Free Node service serves the browser build, room lookup and secure WebSockets. Server-authoritative Planck physics and rules are rendered by Phaser clients with approved prediction/interpolation. No database, player accounts or paid API is required.

## Release status / compatibility

Milestone 6 release-candidate baseline: `6b85ff332bb12ffd539f7392a742f966ae9542bb`, checkpoint `checkpoint/milestone-6-release-candidate`. Milestone 7 adds focused onboarding/submission-readiness UI; physics, arena, rules and networking are unchanged. Milestone 7 is personally approved; Milestone 8 arena geometry acceptance is pending.

**Physical iPhone/iOS Safari compatibility is an outstanding pre-release requirement, not confirmed working.** Phone/tablet automated tests use Chromium emulation. Long-session physical Android/tablet retesting and desktop Safari/Firefox/Edge-specific validation also remain outstanding.

Free Render may show a loading page while waking after inactivity. In-memory rooms do not survive restart. Small-screen labels can overlap in crowded play. See [Milestone 7](frog-network-spike/docs/milestone-7.md), [submission checklist](frog-network-spike/docs/submission-readiness.md) and [hosting/demo assessment](frog-network-spike/docs/hosting-demo-readiness.md).

Art/audio are original procedural project assets; [sources and licenses](frog-network-spike/docs/assets-and-licenses.md). Built with OpenAI-assisted development for the Handshake/OpenAI Multiplayer Game Challenge.

## Milestone 8 geometry playtest

Approved submission-ready M7 gameplay checkpoint: `e97bbcb418468149e5b936c7ff9e95a0ccbe5b9b`, branch `checkpoint/milestone-7-approved`. The original Canopy Courtyard remains the default and its geometry is unchanged. The lobby host can now choose **Rainbell Conservatory — Geometry Preview** before ready/start. Arena changes clear everyone’s Ready; choices are frozen across all rounds of a match and retained for rematch. No new mode or physics tuning. Arena 2 layout acceptance and final art are pending. See [M8 details](frog-network-spike/docs/milestone-8-geometry.md).

Physical iPhone Safari reliability is currently a release blocker under diagnosis. The candidate is frozen pending physical validation. See [diagnostic build and physical testing](frog-network-spike/docs/iphone-reliability-diagnostic.md).

## Milestone 9 presentation playtest

Original pond-percussion sound, restrained action feedback and short Outbreak/round celebrations. Current maps, physics, networking and scoring remain unchanged. Sound is opt-in; lobby help contains volume settings. Physical iPhone Safari remains a mandatory release gate; its input/viewport candidate stays frozen. See [M9 scope and acceptance checklist](frog-network-spike/docs/milestone-9.md).
