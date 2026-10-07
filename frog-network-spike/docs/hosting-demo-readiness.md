# Hosting and judging readiness

Reviewed 2026-10-07. Existing Render service `frog-out-milestone-2`, My Workspace, one **Free** Node instance; no migration or paid change. Frontend, HTTP room lookup and secure WebSockets share one host. Automatic deployment remains disabled.

## Cold starts and inactivity

Render's [Free-service documentation](https://render.com/docs/free) says a Free web service sleeps after **15 minutes without inbound HTTP requests or WebSocket messages**, and waking takes **about one minute**. A browser opening the submission URL can see Render's loading page before Frog-Out is available. It is outside the game's own UI; an in-game spinner cannot hide it before the app has loaded. Active client messages normally prevent inactivity sleep, but this does not make Free hosting an availability guarantee.

This is the principal judging risk: an unscheduled judge opening a cold URL might think it is broken or leave before loading finishes. The known cold-start behavior comes from Render documentation, not a controlled idle experiment during live playtests. No artificial keep-alive or background service was introduced.

Practical no-cost demo procedure:

1. Open the public URL shortly before a scheduled demo; allow about a minute if it is cold.
2. Verify two browsers/devices create/join and start a brief match. Keep the active demo room connected while showing it.
3. Tell an unscheduled tester: initial loading may take about a minute; once loaded, create/join normally. Use a fresh room if the service restarted.
4. Avoid deployment during a demo or active matches. Do not leave a QA room running indefinitely as a hosting workaround.

Rooms/rosters/scores are in memory and disappear on server restart or redeployment. Free may restart independently of a deploy. The 30-second player reservation handles ordinary connection loss; it cannot recover a room lost with the server process.

## Limits verified versus not verified

| Item | Verified evidence |
|---|---|
| Current service compute | Render connector reports `plan: free`, one instance, not suspended |
| Free instance allowance | Render documents **750 instance-hours/workspace/calendar month**; exhausted hours suspend Free services until next month |
| Bandwidth/build usage | Both count against included workspace allowances. Without a payment method, exhausted bandwidth can suspend Free services and exhausted build minutes can disable new builds; existing artifacts remain serving in the latter case |
| Actual allowance and remaining balance | Not exposed by the available service/metrics connector; must inspect the workspace Billing → Monthly Included Usage page before broad promotion |
| Payment method / billing spend settings | Not verified by service metadata. No payment information was added or billing settings changed |
| Runtime capacity | Existing local one-room/eight-client tick test is comfortably under 16.667 ms; it does not certify unlimited concurrent rooms on Free Render |

The earlier eight-client test received ~46.6 MB JSON payload across clients in one minute. This is not billed bandwidth and does not include transport/compression/accounting differences. It does justify checking actual bandwidth allowance rather than assuming unlimited free traffic.

## Would paid always-on materially help?

**Yes, specifically for an unscheduled judge's first visit.** A paid web-service compute instance removes Free inactivity sleep and the associated cold-start wait, so opening the public URL is more predictable. This conclusion follows from Render's stated Free limitations; it is not a guarantee against outages. Changing only the workspace plan does not remove a service's Free compute limits.

It would not change game responsiveness, make rooms persistent across a restart, remove bandwidth accounting, or substitute for physical mobile testing. An approved change could use the same service/repository/URL; no migration is necessary. An upgrade itself must be planned outside active matches.

**No paid plan was selected and no charges were authorized.** The user's free-development preference remains in force. Reconsider the compute option only if the user explicitly approves its current price, duration and potential usage charges. Exact current paid pricing was not established from the retrieved pricing page; do not use an old quoted price as authorization.

## Final demo checks

- Confirm live revision and public root + two-client WebSocket play after the last deploy.
- Confirm actual monthly included usage and the intended no-payment/spend posture in Render before promotion; react to Render usage notifications without automatically upgrading.
- Complete physical mobile checks, especially iPhone/iOS Safari.
- Have at least two participants/devices available; the game intentionally has no solo/bot mode.
- Prepare the required entry description/cover and explain the first cold load succinctly if remaining on Free.
