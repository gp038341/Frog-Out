# Milestone 5 — Mobile controls and device compatibility

## Approved baseline and deferred work

The user approved the public Outbreak build `9c74d3f1a6edb0ee827256058bcf465ea2228e23`. It remains recoverable on `checkpoint/milestone-4-approved`; `docs/approved-milestone-4.json` records the deployed URL and hashes of approved simulation, network/prediction/client and authoritative lobby/Outbreak sources. The subsequent final test-evidence commit is preserved in main history. No history was rewritten.

The user reported a cramped arena with multiple players. `docs/deferred-work.md` records this for the dedicated arena/presentation phase. Arena dimensions/geometry, physics tuning, infection/scoring, networking, lobby and reconnect remain unchanged. Improved graphics, maps, intros, sound/cosmetics and possible additional modes remain deferred. Milestone 5 awaits personal acceptance; no next milestone has started.

## Input implementation

`src/input/touch.ts` adapts browser Pointer Events to the existing `{x, y, held}` input. The left pad has eight 45-degree sectors and a 20%-radius centre dead zone. Directions remain integers -1/0/1; no analogue speed, mobile physics or alternate rules. The right button maps press to held=true and release to held=false. Existing simulation determines jump/charge/tongue behavior. JUMP, CHARGE, TONGUE and HOLD / RELEASE are advisory labels from existing local predicted/authoritative state, not separate action routing.

Two independent pointer IDs/captures allow simultaneous thumbs. Dragging off a control retains capture until release. Extra fingers cannot steal an active control. Pointer cancellation/lost capture, blur, backgrounding, rotation/resize, disconnect and phase changes clear input. Keyboard controls retain the same key mappings and input semantics; shared controls combine keyboard/touch only if deliberately used together.

Coarse-pointer devices automatically enable touch; small touch-capable hybrid devices also qualify. Use touch controls / Use keyboard layout provides an explicit fallback. Diagnostic URL options `?touch=1` and `?touch=0` override initial detection. Mobile Diagnostics exports include touch state, viewport, device touch capability and existing network/game metrics, without reconnect tokens.

## Compatibility/layout

Landscape gameplay allocates side gutters for comfortable 82–112 CSS-pixel controls. The entire unchanged single-screen arena fits between them, with no control/canvas overlap. A portrait prompt asks players to rotate; the existing match stays connected and continues, with their controls cleared. It does not pause the authoritative game. Orientation changes preserve the room/identity and refresh Phaser bounds. ResizeObserver also follows container/browser viewport changes.

Active touch gameplay suppresses scrolling, pinch/double-tap interaction and selection using touch-action, overscroll and selection rules. Lobby and results remain normally scrollable; browser zoom is not globally disabled. Input font size stays 16px to avoid common iOS focus zoom. Touch start blurs the name/code input on entering gameplay to dismiss the on-screen keyboard. Safe-area insets and dynamic viewport height are supported, with a vh fallback.

Room forms, Ready/Start, connection status, results, host continuation/rematch, Leave and Diagnostics remain accessible. Results wrap long names and allow table scrolling where necessary. Debug status/help is hidden in the compact touch gameplay layout; Diagnostics remains in its footer. Desktop retains the existing arena/input presentation with an optional touch-layout toggle.

## Automated testing

- Build/type check and all **45 unit/regression tests** passed, including byte-for-byte approved Milestone 4 source checks and eight-sector/dead-zone input tests.
- Trusted Chromium CDP multi-touch tested normal jump, charge, simultaneous direction/action, all eight aim directions, terrain grapple/release, reciprocal mobile-to-desktop frog pull, real cancellation, portrait/landscape, full arena visibility, no horizontal overflow, reload reconnect and mobile diagnostics.
- One desktop plus two phones plus tablet completed a four-player Outbreak match and lobby return. Two phone contexts then completed a phone-only match with touch host Start/Next/Final/Return controls.
- Existing desktop browser regressions passed at 50/100/150 ms added RTT with ±10 ms/leg jitter: charge, terrain grapple/release, identity reload and diagnostic export. No browser errors or large snaps recorded.
- All 16 existing lifecycle tests passed, including eight-client admission/roster lock, names/readiness, input/tongue clearing, reconnect identity and actual 30-second expiry (30,011 ms).

These are isolated local browser/server tests, not physical-device acceptance. Positioning hooks and shortened 6/12-tick intros keep mobile integration tests deterministic; physics, infection grace (60 ticks) and Outbreak logic are the production implementations. Test flags are disabled on Render.

Configurations: desktop 1280x900; iPhone-sized Chromium touch emulation 844x390/390x844 at DPR2; Android-sized touch emulation 667x375/375x667 at DPR2; tablet 1024x768 at DPR2; additional 568x320 landscape layout. These do NOT establish actual Safari/WebKit or physical iOS/Android compatibility. Browser suites run sequentially. Reports/screenshots are in `docs/results/mobile-milestone-5.json`, `browser-milestone-5.json`, `lifecycle-milestone-5.json` and `mobile-landscape.png`, `mobile-portrait.png`, `mobile-results.png`.

## Known limits

Physical iOS Safari, Android Chrome and tablet acceptance testing remains for the user; OS edge gestures, interruptions and dynamic browser bars may vary. Tiny landscape screens make the unchanged arena/frog labels small. Arena crowding remains deliberately unresolved. Portrait rotation does not pause the match and disconnected/idle bodies remain vulnerable. Native OS gestures can cancel touch, at which point controls clear safely. Backgrounding longer than the approved 30-second reconnect window can end the match. The existing rare server tick outliers, Free Render cold starts and in-memory room loss on restart remain baseline limitations. No paid resources or services added.

## Acceptance test

1. Open the public URL on a phone in landscape and another desktop or phone. Create/join with a code, enter names, Ready everyone and host Start. Test phone hosting as well.
2. Left thumb: press/drag around all eight pad directions; return to centre/release for neutral. Right thumb: quick tap/release on ground for normal jump; hold for charge, then release for stronger launch.
3. Use both thumbs together. Aim while moving/jumping. Airborne press/hold to grapple terrain, swing/pull and release with momentum. Grapple another moving frog; both should physically respond. Compare desktop movement/charge/pull/collision feel with the approved baseline.
4. Play full Outbreak: Patient Zero/countdown, body-only infection, tongue noninfection, grace, timer, round scores, every-player rotation, final ties and rematch. Try multiple phones plus a desktop.
5. Rotate portrait during play and back: see prompt, same session/identity, no stuck movement/action. Repeat while charging/attached and drag a thumb outside its control before release. Try common window/browser-bar changes.
6. Refresh a phone mid-round; restore the same frog/infection/score. Briefly background it and return; separately test >30-second disconnection returning everyone to lobby. Verify no stale held tongue or movement.
7. Check lobby/results in portrait and landscape, long names, host buttons, Leave and mobile Diagnostics. No UI should become inaccessible or controls cover the arena.
8. For issues tap Diagnostics on phones and Download diagnostics on desktop; send both files, device/OS/browser, orientation, round/actions/time and optionally a recording. Artificial lag/jitter options remain available for comparison.
