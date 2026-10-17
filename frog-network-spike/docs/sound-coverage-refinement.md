# Sound coverage refinement — listening candidate

Baseline: `13e7f8f45b2820d91589b4964e2634c846a14531`. Approved gameplay checkpoint remains `checkpoint/approved-bot-c-final-gameplay-baseline`.

- All three modes retain countdown ticks for 3, 2, 1 and a distinct GO. Gravity Flip warnings also receive ticks and a reversal cue.
- Poison/Classic contact tags use a short poison poof; Freeze Tag uses ice and rescue sounds, including round-ending contacts.
- Enabled buttons, disclosure controls, native selections and checkboxes receive quiet UI feedback. Sound enable and gameplay action controls avoid duplicate UI sounds. Volume is available in How to Play.
- Magnet Mouths emits a short magnetic chirp near a frog attachment; Windy Weather has finite filtered gust bursts; Bumper Frogs, Balloon Bellies and Pogo Panic use rubber boings; Swap Hop warns and teleports; Bubble Trouble captures, taps and pops; Sticky Frogs uses suction. Crumbling platforms crack and nearby energetic rubber-ball impacts thump.
- These observe existing authoritative event/state fields. No bot, simulation, modifier tuning, networking, controls, viewport, camera, arena or cosmetic changes.

## Mix and rights

Existing croaky/rubbery sound palette retained. All cues are original procedural synthesis, with no samples, downloads or new dependencies. Sound stays opt-in through the existing Sound button. Mute, volume and hidden-tab suppression remain. Eight concurrent sources maximum, cue cooldowns, repeated-event deduplication, same-frame coalescing, local priority and quiet nearby remote effects limit crowded mixes. Wind stops on calm/results and cannot mask a jump. One cached noise buffer uses approximately 115 KB at 48 kHz; no persistent background track.

## Validation and limits

Full suite: 353 tests; production TypeScript/Vite build. Targeted coverage exercises countdowns in all modes, final tags, freeze/rescue, modifier triggers, deduplication, mix limits, mute and UI routing. Preservation hashes protect gameplay and mobile systems. Physical-device listening is still required; automated checks establish triggers and safeguards, not subjective sound quality. Browser audio requires a user gesture and Sound On.

## Listening checklist

1. Enable sound and adjust volume in How to Play. Click home, lobby, customization and help controls; try mute.
2. Start each mode: hear 3–2–1 and GO, poison/Classic tags, Freeze tags and rescue, including final contact.
3. Try Magnet Mouths, Windy Weather, Bumper Frogs, Balloon Bellies, Swap Hop, Bubble Trouble, Pogo Panic and Sticky Frogs.
4. Check a crowded eight-frog match: critical sounds should remain clear without an overwhelming wall of repeated boings. Change tabs, return, and check sound resumes normally.

Possible future additions, not implemented: a brief vote-winner motif and restrained arena ambience. Avoid constant frog chatter or music before judging this mix.
