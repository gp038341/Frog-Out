# Results fill the browser window

Baseline: `fdf0fe89885eda252379fba437b45b54274d4b78`, preserved at `checkpoint/pre-results-window-fit`.

The desktop results layout previously ended at its content height. Short results, especially with fewer frogs or a tall window, left unused space below the footer and allowed the page background to repeat. Results now give the body/main a viewport-height minimum, let the panel use remaining height, center its existing podium/standings content, and retain the footer near the bottom. The background does not repeat. Short mobile landscape layouts retain their existing sizing; longer content can still scroll.

Only `src/ui/results.css` changes at runtime. Reveal order, scores, animations, game canvas, input, viewport listeners, CPU behavior, networking, and all gameplay files remain unchanged.

Validation: 464 automated tests and production build pass. Browser checks cover thirty round/final/tied/reduced-motion component cases across six sizes (including 1920×1080 and 1280×1000 normal windows, laptop, desktop, and two mobile landscape sizes), footer/panel/background bounds, and complete two-client matches in all three modes. Mobile emulation is not a physical-device test.

Awaiting user playtest. Check a small-player round result and final standings in a normal tall browser window, then compare fullscreen and mobile landscape.
