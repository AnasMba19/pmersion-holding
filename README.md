# PMersion — public project-learning beta

Public website: https://pmersion.com · Application: https://pmersion.com/beta/

Six discovery decisions and budget, planning, risk and synthesis workshops use the shared Synapse
engines. The homepage exposes a real decision demo and a studio of original projected 3D models.
Six sector pages add contextual questions and 18 original fictional documents: construction,
nuclear, robotics, SI/data, industry and services/health. These introductions are explicitly
separate from complete sector simulations; their numeric workshop links open transversal Synapse.

## Local data

No account, email collection, analytics or application API is used. The discovery key stores the
six decision codes; `pmersion.public-workspace.v1` stores workshop drafts, explicitly retained
versions and history. Retained budget/planning/risk versions feed the visitor’s common synthesis.
Export and explicit scoped reset preserve the other progress keys. There is no cross-device sync.
Sector choice, model rotation and layer separation are presentation state, never persisted work.
Hosting receives normal technical requests. All project data is fictional.

## Source and design

`beta/` is the compiled `apps/public-beta` app; `beta/release.json` records exact source and hashes.
The source catalogue and SVG geometry are shared by homepage, context pages and method resources.
Public titles use locally hosted Barlow Condensed; Manrope remains body/control type. The font’s
OFL license is included. Generated world JS/CSS and decision modules use immutable content URLs.
Old hashed assets remain for previously cached pages. No source maps or credentials are shipped.

## Verification and publication

GitHub Pages publishes main with the existing CNAME. The browser workflow tests the compiled
bundle at 390/430/768/1280 px, including keyboard, model controls, direct routes, storage isolation,
reduced motion, workshop calculations, export and reset. Screenshots require visual review before
merge; CI alone does not establish aesthetic acceptance or learning outcomes. Release 0.5.0 is
tracked in https://github.com/AnasMba19/pmersion-holding/pull/11.

Run locally: `npm ci`, `npx playwright install chromium`, `npm test`.
Rollback: revert the release commit; private connected environments and DNS remain separate.
