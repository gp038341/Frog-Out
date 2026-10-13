# Sticky Frogs — approved final Milestone E modifier

Owner approved Sticky Frogs and all20 modifiers at `e6f6cafec250d2713d02f61c1f1a05bf8e5c9183`; checkpoint `checkpoint/approved-all-20-chaos-modifiers`. See `approved-chaos-system.md`. New non-gameplay work remains owner-directed; no feature freeze or submission preparation.

## Pre-implementation approved baseline

Gravity Flip/Pogo were personally approved at `e8237382843cc80737882e3fd67a3c37f2f0b5a3`; checkpoint `checkpoint/approved-chaos-voting-e-gravity-pogo`. GitHub main and the live Free Render service matched that revision before editing; no outstanding working-v-index changes. Previous candidate checkpoint remains recoverable. Existing historical local HEAD is not pushed wholesale. Normal GitHub parent/tree/ref append only, no rewrite or force push.

## Behavior and control model

Sticky Frogs is modifier20, replacing **Flappy Frogs**, which is retired and will not be implemented. Real contacts attach automatically to active static/kinematic solids or Tilt runtime platforms, including floors, walls, ceilings, undersides and slopes in all four arenas. Sensors, other frogs, balls and invisible ball-only bounds are not sticky routes.

Surface points and normals are stored in contacted-body local coordinates. A short same-body probe maintains the actual supporting face during crawling/rotation. No platform-center anchors, teleport, collider rotation/size change or new joints. Existing directions remain screen based and project onto the current tangent: left/right on floors or ceilings, up/down on walls, diagonals at corners/slopes. Neutral input holds position. Intentional diagonal input can transfer at an inner corner; outer edges release or follow a real adjoining contact rather than inventing a wrap/teleport. Sharp external corners may require jumping or grappling—test this feel.

The existing grounded action semantics apply while stuck: tap/release jumps; hold/release charges. Jump velocity is along the actual outward normal, retaining tangent and support-point velocity. Jump off then use a fresh airborne action to fire the tongue. **A tongue already flying or attached is retained when physical contact sticks the frog**; pulling remains active. No separate grounded fire gesture/button has been added. This avoids reinterpreting the accepted mobile action button.

Frogs carry the moving/rotating support's point velocity. Reciprocal bounded controller impulses and transferred weight apply to dynamic platforms at the actual off-center surface point, so Tilt still reacts physically. All of this runs in the shared simulation on the authoritative server and existing prediction client. Snapshots include surface-local anchors/normals, cooldowns and pause state; rendering gets the authoritative support normal and attach/release ticks.

## Centralized prototype tuning

| Parameter | Value | Purpose |
|---|---:|---|
| Crawl speed | 5 m/s | Slightly below approved ordinary6; Turbo speed factor composes |
| Crawl acceleration | 45 m/s² | Responsive tangent controller; active acceleration modifiers compose |
| Neutral brake | 55 m/s² | Stop and hold reliably |
| Inward contact target | 1 m/s | Maintains physical support against the contact solver |
| Normal correction acceleration cap | 110 m/s² | Bounded adhesion, no positional corrections |
| Outward separation threshold | 5 m/s | Strong impact/grapple separation can break adhesion |
| Same-face probe allowance | .14 m beyond current collider radius | Maintains nearby actual support only |
| Jump/forced-release reattachment cooldown | 12 ticks / .2 s | Prevents immediate sticking/bounce jitter |
| Corner transfer hold | 6 ticks / .1 s | Prevents contact switching chatter |
| Normal / maximum charged jump | Existing9.5 /18 m/s | Oriented into surface normal; no global retuning |
| Charge threshold / duration | Existing.14 / .8 s | Existing action timing unchanged |

Adhesion offsets the frog's current gravitational force while attached, including reversed/Moon gravity, and transfers that weight to a dynamic support. It does not modify gravity scales or global tuning. Mud and soap keep authored-top material effects; underside/side contact does not invent extra spring/mud behavior. Butterfeet reduces deliberate tangential acceleration but cannot disable neutral suction holding. Spring/Pogo/balloon launches and strong body separation win over adhesion; cooldown then prevents immediate re-sticking.

## Compatibility and cleanup

No new exclusions. Requested pairs Sticky+Gravity, Moon, Tilt, Crumble, Butterfeet, Pogo, Mega Tongues, Super Suckers, Tiny, Mega Frogs and Wind are exercised. Existing19-by-19 registry rules remain unchanged, including Gravity+Moon/Tilt/Pogo/Bubble exclusions, Tiny+Mega and Crumble+Tilt. Three-way stacks still use existing filtering.

Gravity reversal retains sticky support and charge; one guarded adapter skips the usual air-support reset only for an attached sticky frog. Pogo remains the approved immediate14.25 normal launch on valid ordinary top landings, with all prior timing intact; suction does not swallow it. Spring materials retain their existing impact-based launch. Collapsing/deactivated/removed supports release safely. Frozen/captured bodies, teleports and strong separation cannot retain active adhesion. Expiry clears attachment/charge support caches and restores ordinary contact control; reset/rematch clears anchors, cooldowns and metadata. No tag immunity. Poison/Freeze/Classic rules are untouched, including swap protection and rescue ordering.

KEEP renewal, normalRound1,15s voting,3-active conveyor and duplicate/compatibility filtering remain. Sticky has a hand icon/green suction-themed ballot card, small foot-cup marks and original attach/jump cues. Artwork/cosmetics rotate to the normal; names and HUD stay screen upright. No audio assets/dependencies, camera, arena, input/viewport or hosting-plan changes.

## Validation

- Full suite: **238 passing tests**, zero failures. Production build passed; existing large-bundle warning remains.
- Focused tests: physical floor/wall/ceiling/underside/slope attachment; neutral holding; inner corner transfer; outer-edge release; oriented normal/charged jumps; retained tangent momentum; cooldown; live tongues and airborne fire; off-center Tilt and moving support; spring/Pogo/mud/soap; collapse; frozen/capture/teleport cleanup; reversed gravity/charge; snapshots/resets; all modes;2/8 frogs,4arenas,11 requested pair stacks.
- Graphics-command test invokes the real frog drawing method and verifies each wall/ceiling transform and transform restoration. It is automated rendering logic validation, not a physical-device test.
- `docs/sticky-preservation.json` hashes/reversal records protect all approved source and exact unchanged input/touch/viewport/camera/network/mode/audio/material/arena code. Previous preservation chain still passes.
- `results/sticky-network.json`:22 compiled-server checks,21 rooms covering2–8clients across3modes, round/vote/conveyor/KEEP, ties/abstentions/reconnects/rematches/disabled gameplay; plus timeout.
- `results/sticky-timed-network.json`:8independent WebSocket clients simultaneously adhere/charge on a wall; actual gravity reversal retains both; action release launches; same-frog reconnect; Sticky/Tilt/Suck and ordinary airborne tongue; expiry cleanup. Local server p95≤**.992ms**, p99≤**2.532ms**, maximum5.220ms versus16.67ms budget.
- `results/sticky-stress.json`:68 local8-frog simulation cases, all4arenas,2400ticks/case including requested pairs and four triple stacks. Local CPU measurements: maximum case p95 **.440ms**, p99 **.759ms**, versus16.67ms budget; not Render or physical-phone FPS claims.

## Regression playtest reference

1. Refresh the public URL and create a2–8player room. Round1 must still feel unchanged. Vote **Sticky Frogs** when offered.
2. Run into a wall, use up/down, stop, jump sideways, then hold/release a charge. On a ceiling/underside, use left/right and jump downward. Try slopes and inner/outer corners; report awkward transitions/traps.
3. Hold an existing grapple as you touch a surface. Jump off and press action again in the air; check normal tongue aim, pull/release and reciprocal frog grappling.
4. With Tilt, crawl on an off-center platform and its underside. Watch rotation/weight and jump normal. With Crumble, attached support must release when it falls away.
5. Check spring and Pogo landings still launch instantly. Mud/soap behavior should return immediately after leaving. Try Gravity reversal during a wall/ceiling charge; it should not detach you.
6. Play each mode; tag/freeze/rescue must still register on adhered frogs. Refresh/reconnect, KEEP Sticky, replace it, finish/rematch; no stale adhesion.
7. Physical phone landscape: use both thumbs, charge, jump, tongue, stop/crawl and rotate the device. Accepted iPhone source is unchanged; **this new traversal has not been physically tested here**. Report mobile readability and accidental actions.

Owner acceptance is complete. Preserve these behaviors; further validation can be recorded without claiming unperformed physical-device tests. Wait for individually directed changes.
