# Current production deployment

Canonical public URL: https://frog-out.onrender.com/
Render workspace: My Workspace (`tea-db2i14mgekts73cf45p0`).
Production service: `frog-out` (`srv-db5a1arrjlhs73cul7ng`), Free web service, Ohio.
Source: `gp038341/Frog-Out`, branch `main`.
Build: `cd frog-network-spike && npm ci && npm run build`.
Start: `cd frog-network-spike && npm start`.
Auto-deploy is off. Trigger deployments on this service only after verified pushes.

Migration source gameplay revision: `18bebf5f9f7e19a6765a37c9165bcd41791455da`.
No gameplay, input, physics, arena, audio, or networking code was changed for migration.

Legacy service `srv-db2joi6gekts73falg8g` at https://frog-out-milestone-2.onrender.com/ is preserved as a rollback deployment. Do not target it for future development/deployments. Historical milestone reports retain their original URLs as historical evidence.

Rooms run in server memory and are separate between services; open the canonical URL and create a fresh room. Browser-local preferences may need to be selected again on the new origin. Free service inactivity/cold-start and shared workspace usage limits still apply. No paid instance, database, domain, or other paid resource was added.

Approved pre-E gameplay checkpoint:233456c81a7b5bef8529c73617014326119d6ec4, `checkpoint/approved-chaos-voting-d`; GitHub main and live Render verified matching before E. Deploy E candidates only to the canonical Free service above.

## Approved Gravity Flip/Pogo checkpoint and Sticky candidate
Owner approved revision `e8237382843cc80737882e3fd67a3c37f2f0b5a3`, live deploy `dep-db6mm3hsrm7s73c4c8gg`, preserved as `checkpoint/approved-chaos-voting-e-gravity-pogo`. The Sticky candidate is recorded by `checkpoint/sticky-frogs-playtest-candidate`; see `sticky-frogs.md`. Canonical service remains `frog-out`, Free, https://frog-out.onrender.com/. Old service, input/viewport and camera are untouched. Sticky requires owner acceptance.
