# Exact rollback — only on the owner's request

## Protected original

- Repository: gp038341/Frog-Out.
- Permanent branch: `checkpoint/pre-creative-identity-experiment`.
- Exact commit: `5da8bac60044643bdded2db7331052c56692ca4c`.
- Exact whole-repository tree: `d03d4c20a06b8c2deb9d4617dd5708bb676bd491`.
- Original verified live deploy: `dep-dbfndnm7bikc73e7fcg0`.
- Existing Render service: `srv-db5a1arrjlhs73cul7ng`, https://frog-out.onrender.com/.

The checkpoint is never updated, merged into, deleted or force-pushed. A local full-tree archive was also made before edits. Earlier checkpoints remain intact. The only pre-existing tracked local difference was a generated historical bot timing report, preserved separately and excluded. Historical untracked QA files are retained and excluded.

## Owner-approved promotion

The owner approved the experimental visual identity and explicitly authorized production promotion after the four requested adjustments pass on the existing isolated Free preview. See `approved-adjustments.md`. Promote the exact tested experiment commit by fast-forwarding `main`, without force or history rewriting; preserve both service configurations and the original checkpoint. The temporary service remains available until the owner requests its removal.

The original remains recoverable using the procedure below. Do not execute a rollback unless the owner requests it.

## Restore the exact deployed original SHA

1. Read the checkpoint ref and verify it still equals the SHA above.
2. In the existing Render service, choose **Manual Deploy → Deploy a specific commit**, enter `5da8bac60044643bdded2db7331052c56692ca4c`, then deploy. Alternatively the supported Render Trigger Deploy API accepts `commitId` with this SHA. Do not rename/recreate the service or change its configured branch. Auto-deploy remains off.
3. Wait for the particular deployment to become **live**. Verify its commit is exactly the saved SHA.
4. Confirm `/health`, the home page, assets and room/create/join/WebSocket startup. The original build has `index-Cmlze0Fk.js` and `index-L-yMRS_V.css`; verify content against the original Git tree/build, not just filenames.
5. Verify the original Heroic Age music, original visual appearance and original gameplay. This deploys the complete original code/assets, not an approximation or a visual toggle.

Render documents deployment of a specific historical Git commit without changing the URL: https://render.com/docs/deploys#deploying-a-specific-commit . The saved commit is in this service's existing repository and remains on the configured branch's history. This capability was checked; no test rollback was performed, as rollback is not authorized until requested. The current connector exposes only “deploy latest”, so the exact-SHA operation requires the supported Dashboard/API capability above, not a pretend connector parameter.

## If the owner also requests `main` code restoration

Create a new ordinary restore commit, parented to the current `main`, whose tree is exactly `d03d4c20a06b8c2deb9d4617dd5708bb676bd491`; fast-forward `main` with expected-head checking. Do not reset or force-push. This restores every tracked byte while preserving experiment history. This restore commit has a new SHA but an exactly identical original tree. For an exact deployed original SHA, still deploy the original SHA using the procedure above. Keep the experiment branch so its artwork can also be recovered.

Deployments restart the in-memory service as usual; they do not transfer active room sessions between process versions. There are no database migrations, paid infrastructure, DNS or hosting architecture changes in this experiment.
