# Milestone 5.1 — input, viewport/fullscreen and survival scoring

This is an acceptance revision on top of `a2d61546fe5ef9d70cd4f9029c9d18a9662aae70` (`checkpoint/milestone-5-acceptance`). The user has not approved Milestone 5. Approved Milestone 4 remains at `9c74d3f1a6edb0ee827256058bcf465ea2228e23` (`checkpoint/milestone-4-approved`). Public service: https://frog-out-milestone-2.onrender.com/ on the existing Free Render instance. No paid resources or new services. Arena/presentation work remains deferred.

Implementation commit: `ead76b6524bbc9f588b069aee820f45b515f5f74`. The release checkpoint is `checkpoint/milestone-5-1-acceptance`.

## Input diagnosis and correction

The user reported a permanent freeze switching on Windows Chrome/Edge. Basic switching in isolated Chromium did not reproduce that exact permanent failure. Code inspection found the layout event also ran the resize handler that cleared keyboard state, while touch resets notified the shared input sampler separately for direction and action. Layout changes therefore had multiple independent resets/intermediate commands, with touch activation/labels only catching up on the next 100ms UI interval. The toggle also retained focus. These are concrete handoff weaknesses; they are not proof of the precise device-specific permanent-freeze cause.

Switching now retires touch captures, clears both keyboard/touch sources atomically, and publishes one neutral normalized input. It immediately reapplies the current gameplay gate and updates the button/controls, then blurs the toggle. Auto-repeat cannot resurrect a key cleared by handoff until a fresh press. Both methods still feed the existing `{x,y,held}` command, with one held action even if both are used. Ordinary canvas reflow does not clear keyboard input. Blur/background/disconnect/phase transitions still clear inputs. After a switch release held fingers/keys and make a fresh press; an existing tongue releases and a charge receives the ordinary action-release semantics. The player, room, body and network ownership are untouched. Switch history, focus and normalized input are included in Diagnostics for further investigation if the original device still fails.

## Screen/fullscreen

The previous desktop parent capped arena height at 58vh / 540px and main width at 960px. Touch used a fixed 142px vertical reserve. Active gameplay now uses the available page width and computes arena height from the visual viewport, actual HUD top and actual footer height. Phaser FIT keeps the unchanged 32:18 aspect ratio; touch pads retain separate side gutters. Layout observations and browser viewport/fullscreen changes refresh bounds only when bounds change. No world/arena geometry changes.

Enter Fullscreen is a user gesture on the document root; Exit Fullscreen returns normally. Unsupported API hides the button. A rejected request displays a readable notice and preserves ordinary play. Fullscreen is optional and never forced. Portrait still asks for landscape and keeps the match running. Controls/footer remain visible without fullscreen; aspect-ratio letterboxing remains necessary, particularly on tablets. At 844x390 the touch canvas is about 478x269 versus 441x248 previously; at 667x375 it is about 452x254 versus 414x233. Desktop 1280x900 tests measured 1260x709 versus the old roughly 924x520 cap. Fullscreen may further reclaim browser chrome on supported physical devices.

## Selected scoring formula

The user selected **1 point per second survived + 2 points for the last survivor** before implementation. Each complete 0.1 second after authoritative Outbreak start earns 0.1 point; the score locks on the authoritative infection tick. This truncates sub-tenth time rather than crediting time not yet survived. Patient Zero gets 0 survival and 0 bonus. Only the final infection batch gets the 2-point bonus; every same-tick last survivor gets the full bonus. Same-tick infection placement and score remain equal. Cumulative addition uses integer tenths to avoid floating-point accumulation changing ties. Round results display Survival, Bonus, Round Score and Total separately; infection feedback also shows components. Timer, infection/body-only contacts, grace, rotation, ending and match structure are unchanged.

Two-player example: B survives 8.3s while A is Patient Zero, earning 8.3 + 2 = 10.3. A later survives 13.6s while B is Patient Zero, earning 13.6 + 2 = 15.6. A wins 15.6 to 10.3. Equal survival durations can still tie.

Four-player example: Patient Zero 0; frog infected at 12.4s gets 12.4 + 0 = 12.4; frog infected at 25.8s gets 25.8 + 0 = 25.8; final survivor infected at 41.2s gets 41.2 + 2 = 43.2. If the last two frogs are infected together at 41.2s, each gets 43.2 and shares the round victory. The fixed bonus is worth two seconds of survival; it can outweigh survival in extremely short rounds, but does not scale up with room size.

## Regression evidence

- Build/typecheck and 47 unit/regression checks: approved physics, movement, normal/charge jumps, landing buffer, terrain/dynamic grapples, collisions, authority, prediction, roster and reconnect bytes unchanged. Only `src/game/outbreak.ts` is exempted from the M4 byte comparison for the explicitly requested scoring revision; the historical baseline itself is preserved.
- Hybrid suite: three keyboard→touch→keyboard→touch cycles for each of grounded, airborne, charge, terrain and frog-grapple states during active Outbreak; neutral handoff, new input accepted, same identity/room/reset. Held-key repeat suppression, reload, orientation and scoring components checked.
- Ten viewport/layout configurations (1366x768, 1024x768, 844x390, 667x375, 568x320 × keyboard/touch) check aspect ratio, filling a maximum dimension, no horizontal overflow and visible footer. Trusted two-thumb CDP tests remain in the mobile suite.
- Fullscreen enter/exit tested in headless Chromium. Unsupported/restricted capability cases injected only in isolated test browsers; no production capability bypass.
- Mobile suite: 15 checks including eight directions, normal/charge, terrain/frog grapple/release, orientation, reconnect, four-player mixed desktop/phone/tablet match, two-phone match, results/rematch and Diagnostics.
- Desktop browser suite: 50/100/150ms added RTT, ±10ms per-leg jitter, jumps/grapple/release/reload/diagnostics; no runtime errors or large snaps. Production physics/network code was not retuned.
- 2/3/4/8-client authoritative Outbreak matches: rotation, contacts, no tongue infection, 60-tick grace, same-tick scores, timer stop, cumulative totals, results/rematch and disconnected infection/reconnect. Different-duration two-player rounds produce a unique winner. Production-countdown browser suite verifies results/components and standings.
- 16 lifecycle checks including actual 30-second disconnect expiry (30,014ms), stale controls/tongue clear and return to lobby.

These use isolated Chromium on Linux with trusted keyboard/touch inputs and phone-size emulation, not physical Windows, iOS Safari or Android acceptance. Test body arrangements/short intros require local-only test flags, disabled publicly. Reports are in `docs/results/*5-1*.json`. The original physical Windows permanent-freeze symptom still requires the user's retest. OS gestures/fullscreen restrictions vary; very small screens still have small labels. Existing Free Render cold starts and in-memory room loss on restart/deploy remain.

## Acceptance checklist

1. On the original Windows Chrome/Edge hybrid device plus another phone/desktop, create/join, Ready and Start. Repeatedly switch keyboard → touch → keyboard → touch while running, airborne, charging and grappling terrain/another frog. Release/repress controls after each switch; verify same frog and no stale action or loss of input.
2. Check the arena fills the available viewport without stretching. Enter/exit fullscreen if the button is available; play without fullscreen too. Resize/rotate and check HUD, pad/action and footer stay accessible. Portrait should show the prompt and preserve the session.
3. Verify desktop controls, two-thumb touch jump/charge/aim/grapple/release and mixed-device collisions retain approved feel.
4. Play a two-player match with clearly different survival durations, then a four-player match. Check Patient Zero 0, survival stops on infection, only last survivors get +2, breakdown sums, cumulative totals, rotation, results and final shared ties where appropriate.
5. Refresh/background briefly and reconnect to the same frog; separately disconnect for more than 30 seconds and verify return to lobby.
6. If control loss/corrections occur, export Diagnostics from both players. Send files, Windows/browser/device details, layout/fullscreen state, exact switch/action sequence and a short recording if possible. Diagnostics omit reconnect tokens.

Stop after deployment and verification. No next milestone until personal approval.
