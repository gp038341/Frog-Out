# Global settings access candidate

Approved music baseline: `a3d574adc5fca4588e94b5098717d631f7f708d2`, preserved at `checkpoint/approved-reedwater-music`.

One `PlayerGuide` owns the existing `#game-menu` dialog. Escape and Settings buttons use the same overlay on home, customization, lobby, gameplay, voting and results. A suspended customization/rules dialog is restored on closing settings. Leave confirmation consumes Escape as cancellation. The match continues; opening/closing clears held input synchronously. No audio instances, preferences, gameplay rules or networking are recreated.

The existing footer button is now Settings. On touch layouts outside gameplay it stays at the lower-right safe area, with page space reserved so the last controls can scroll clear. Gameplay retains its existing toolbar position. Customization/rules dialogs also have Settings buttons because native modal dialogs make background buttons inert. Esc instructions are alongside keyboard controls, with the touch equivalent alongside touch instructions.

## Mobile Back

On primary coarse-pointer browsers, two same-URL History API guard entries are installed on the first pointer interaction, once per document visit. Back opens settings, the next Back closes it, and further Back can leave the website. A menu already open closes on the first Back. Entries are not replenished after Back or on refresh of marked entries; state is merged rather than discarded. Forward navigation and restricted History API environments fail safely. There is no `beforeunload` navigation trap and no automatic room leave on popstate.

This is a bounded accidental-departure safeguard, not a replacement for browser navigation. After the guard is consumed, use the visible Settings button or Escape. Browsers can ignore history entries created before user interaction, and swipe previews, embedded browsers, and physical hardware Back differ by platform. Desktop navigation is unchanged. Physical Android/iPhone acceptance remains necessary; no physical-device testing is claimed for this candidate.

## Manual acceptance

1. On home, press Esc twice. Edit your frog; open/close Settings with Esc and its touch button; confirm selections remain.
2. In a lobby, open Settings, adjust Music, close; verify room, cosmetics, ready and arena selection remain. Refresh to check saved audio preferences.
3. Start a human/CPU or human-only match. Open Settings while moving; verify controls neutralize, the match continues, and fresh controls work after closing.
4. Open Settings during voting and both results screens; confirm votes, scores and round progression remain intact.
5. On Android, enter from another page, interact with Frog-Out, then Back → Settings → Back → closed. Further Back may leave the site intentionally. Return and check reconnect behavior; the Settings button remains the reliable access path.
6. On iPhone Safari landscape, test the visible button, menu scrolling, safe areas, two-thumb controls after closing, and unchanged viewport fit. Back interception is best-effort.
7. Verify Leave Room/Leave Match still removes only your frog through the existing lifecycle.

## Validation record

Full automated suite after final gesture-installation safeguard: 379/379 passing. Production TypeScript/Vite/server build passes. Source-hash checks preserve all audio, simulation, CPU, network, input, viewport and canvas code byte-for-byte. Existing large-bundle warning remains unchanged. Public browser smoke checks and exact deployment metadata are recorded at handoff; physical-device acceptance is outstanding for these new menu/Back interactions.

The historical `test:lifecycle` script still expects any mid-match departure to end the entire session and fails that obsolete assertion; it was not changed to alter approved departure behavior. The current departure and Bot C integration suites are used for current lifecycle validation.
