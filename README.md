# PMersion — public discovery beta

Public website: https://pmersion.com · Discovery app: https://pmersion.com/beta/

The product-focused landing page opens an anonymous, browser-only project-management simulation:
six canonical Synapse decisions, explicit tradeoffs, consequences, historical review and a
printable final summary. Four public workshops extend this journey: a budget dossier and printable note, a conditional schedule, supplier-risk observations, and an independent common-synthesis example. The workshops are temporary; the synthesis does not aggregate a visitor’s separate trials. All project data is fictional. This beta does not certify skills,
manage real projects or expose the private connected workspace.

## Data

No account, analytics, email collection or application backend calls. A single versioned
localStorage key stores only decision codes and content version for this browser. Progress
can be cleared with explicit confirmation. Hosting still receives normal technical requests.

## Source and publication

`beta/` is the production build from `apps/public-beta` in the private PMersion source
repository. `beta/release.json` identifies the source revision. Scenario rules are shared with
the private app; this is a dedicated public entry, never the browser test harness. No source
maps, credentials, cloud identities or databases are deployed here.

GitHub Pages publishes main using the existing CNAME. Public Beta Verification tests the
actual compiled bundle on phones, tablet and desktop before merge. It also checks reload,
invalid storage, unavailable storage, route locks, cross-tab updates and reset isolation.
Run locally with `npm ci`, `npx playwright install chromium`, then `npm test`.

Rollback: revert the beta publication commit. DNS and private environments are unaffected.

Release 0.2.0 replaces the spatial theme with the project-dossier presentation and shares navigation across the public journey and all four workshops. Canonical laboratory engines perform all calculations; no tests or fixture server are shipped. Source revision and file hashes are recorded in beta/release.json.
