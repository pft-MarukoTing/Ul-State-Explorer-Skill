# Test B — Web prototype (Mode B): yco-collab-space · auto-edit

- Source: `YouCamWeb/yco-collab-space` `main` @ 7632b8a, `features/auto-edit` (the same AI Auto Edit page as Test A / A2)
- Setup: shallow, sparse checkout of only what the page needs, in a separate folder; the user's own clone was not touched. Edits are test-only (the repo's rule is that `generated/` is regenerated from product sources).
- Date: 2026-11-02
- Files: `ui-states-checklist.md`. The registry and code changes are not published here because the source repo is private.

## Result
- 29 states in one bottom-right State Explorer; every one checked in the browser.
- 0 new UI: the RD port already implements the states. 7 were unreachable with mock data before (empty History, style/voice catalog loading and errors, request failure, microphone blocked); 4 more needed impractical media (10-minute clips, 301 photos, 30 minutes).
- The page's own "Demo" panel was removed at the user's request so the skill's explorer is the only switcher; all its options became states.
- Production build contains no explorer code (dynamic import behind `import.meta.env.DEV`).

## How states are driven
| Seam | States |
|------|--------|
| Mock session store | History generating / failed / empty, gates, clones |
| Dev-only overrides of injected props (empty in production) | catalog loading / error, microphone denied, request failed, fake metadata |
| Real import flow with synthetic files (valid MP4 / PNG headers) | format rejections, tile errors, all media limits |
| Page setters | tab, new-project confirm, reset |

## Findings for the skill
1. On mature or ported code the job is **reachability**, not missing UI. Added to `web-workflow.md`: classify states as implemented-reachable / implemented-unreachable / missing.
2. The existing implementation is guideline evidence. Four conflicts with the Test A2 (Figma) answers were listed, not changed — e.g. a failed Generate request shows nothing visible in RD, while A2 chose a toast.
3. Existing review panels ("Demo") should be folded into the explorer, so there is one entry point.
4. Injected dependencies are the cleanest seam: overriding props through a dev-only object keeps production props identical.
5. Reset must undo the app's own reactions to state changes: RD auto-switches to History when the newest job changes, so a plain reset left History open. Fixed by restoring the tab after the room settles; added to `web-workflow.md`.
6. Repos with guarded generated code need the repo's own workflow for real changes.

## Follow-up: RD / Figma switch for the 4 conflicts
The user asked to compare both designs instead of picking one blind.
- Runtime: `state-explorer.js` gained generic `variants` (A/B switch in the detail area, `ctx.variant`, `data-ui-variant`). Back-ported to the skill's asset.
- Product code: a dev-only `PatternVariantContext` (default `rd`) switches four spots — Generate reason visible, storage helper instead of banner, style error inline, error toast on a rejected request. All copy already existed in `i18n.json`; no new tokens.
- 6 states carry the switch (ERR-06, ERR-07, DIS-01, VAL-02, VAL-05, EDGE-01); both sides checked in the browser, RD side unchanged, clean console, production build still free of explorer code.
- Skill: `web-workflow.md` now says to offer both designs behind a variant when the as-built UI and an earlier decision conflict.

## Review fix: error toast background
The user flagged the error toast as wrong (white). Cause: RD's own `common/yce-toast/index.module.scss` gives success and info a weak fill but leaves error (and warning) white; the port copies it. The Figma Alert Error uses Fill/Error weak. In the test copy `platform/ui/yce-toast` now fills errors with `--fill-error-weak` (verified in the browser). This is a shared-component and RD-parity change — report it to RD / the Prototype Platform Owner rather than patching one feature. Warning has the same gap (not changed).
