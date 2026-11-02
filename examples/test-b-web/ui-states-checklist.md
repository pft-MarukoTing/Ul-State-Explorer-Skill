# Missing State Checklist — AI Auto Edit (web prototype)

- Source: `features/auto-edit` on `YouCamWeb/yco-collab-space` `main` (7632b8a), tested in a partial checkout
- Output mode: B — Web (State Explorer, bottom-right "States" pill, Alt+Shift+S)
- Analysed: 2026-11-02
- Summary: 29 states in the explorer · P0 9 · P1 12 · P2 8 · 0 newly built UI (every state is RD's own) · 7 were unreachable with mock data before (4 more needed impractical media) · 4 conflicts with Test A2 pattern decisions

## What was different from a "missing states" page
The RD port already implements almost every state. The gap was **reachability**: most states needed many steps or were impossible with the mocks (hard-coded `"ready"` catalogs, a microphone that always grants, a submission that never fails, a session that always has a History job). The explorer makes each one a single click, driven through the page's own seams.

## Seams used (dev only)
| Seam | Where | Drives |
|------|-------|--------|
| Mock session store (`updateSession`) | generated/services/mock-session.js | jobs (History), clones (My Voices), sign-in / credits gates, balance |
| Dev overrides on injected props | generated/index.jsx (`window.__AUTO_EDIT_STATE__.setOverrides`, empty outside `npm run dev`) | `styleCatalogStatus`, `voice.catalogStatus`, `voice.runtime` (mic), `onSubmit`, `readMetadata` |
| Real import flow with synthetic files | the media `<input type=file>` | format rejections (toast), tile errors, limits via fake metadata durations |
| Page setters | `setActiveTab`, `setConfirmNew`, `reset` | tab, new-project confirm, full reset (remount + session reset) |

The old Demo panel (generated/demo) was removed; everything it offered is a state here (PERM-01, PERM-02, ERR-05, ERR-09).

## States
| ID | State | Pattern in RD today | Reach before | Priority |
|----|-------|---------------------|--------------|----------|
| EMP-01 | Media — no media yet | Empty illustration + Import media CTA | default | P0 |
| EMP-02 | History — no videos yet | Empty image + text | **not reachable** | P1 |
| EMP-03 | My Voices — empty | Illustration + hint | open dialog | P2 |
| LOAD-01 | History — generating | Progress card with % | Generate (4 s) | P0 |
| LOAD-02 | Style list — loading | Inline text | **not reachable** | P2 |
| LOAD-03 | Media — reading files | Tile placeholder | brief | P1 |
| LOAD-04 | Voice library — loading | Inline text | **not reachable** | P2 |
| LOAD-05 | My Voices — clone generating | Spinner row | record + clone | P2 |
| ERR-01 | Import — unsupported video | Toast (yce-toast, error) | pick .avi | P0 |
| ERR-02 | Import — unsupported photo | Toast | pick .psd | P1 |
| ERR-03 | Import — not a photo or video | Toast | pick .txt | P2 |
| ERR-04 | Media tile — can't read | Tile badge + Retry | corrupt file | P1 |
| ERR-05 | History — generation failed | Failure card, no retry | Demo toggle | P0 |
| ERR-06 | Generate — request failed | **Nothing visible** (screen-reader hint only) | **not reachable** | P0 |
| ERR-07 | Style list — failed to load | Section hidden | **not reachable** | P2 |
| ERR-08 | Voice library — failed to load | Inline alert | **not reachable** | P2 |
| ERR-09 | My Voices — clone failed | Failed row + Retry | Demo toggle | P1 |
| ERR-10 | Voice record — microphone blocked | Inline error | **not reachable** | P1 |
| DIS-01 | Generate — nothing entered | Disabled; reason screen-reader only | default | P1 |
| VAL-01 | Material — under 30 s | Warning banner + amber meter | import 1 photo | P0 |
| VAL-02 | Description — required | Disabled; reason screen-reader only | import + leave empty | P0 |
| VAL-03 | Video — over 10 min | Error banner + tile badge | needs a >10 min clip | P1 |
| VAL-04 | Photos — too many | Error banner, red count | needs 301 photos | P2 |
| VAL-05 | Material — over 30 min total | "Storage is full" banner | needs >30 min | P1 |
| EDGE-01 | Storage — full | Banner + red meter + Import disabled | needs 30 min | P1 |
| PERM-01 | Sign-in required | Confirm dialog | Demo › Guest | P0 |
| PERM-02 | Out of credits | Confirm dialog with Upgrade | Demo › Short | P0 |
| DEST-01 | New project — unexported changes | Confirm dialog | edit storyboard | P1 |
| DEST-02 | My Voices — delete | Destructive confirm | clone + trash | P1 |

## Conflicts with earlier pattern decisions (Test A2, Figma) — both built, switch RD / Figma in the explorer
| # | State | RD today | Test A2 decision | Affects |
|---|-------|----------|------------------|---------|
| 1 | Generate request failed | Nothing visible | Toast top-center, stay on page | ERR-06 |
| 2 | Generate disabled reasons | Screen-reader only | Persistent visible helper text | DIS-01, VAL-02 |
| 3 | Storage full / media limit | Banner | Helper text, no banner | EDGE-01, VAL-05 |
| 4 | Style catalog failed | Section hidden | (not asked) — recommended: inline error in the section | ERR-07 |

The Figma side is real product code behind a dev-only variant (`generated/pattern-variant.js`, default `rd`): Generate footer shows its reason, the media panel shows a helper line instead of the storage banner, the style picker shows its error, and the container shows the existing error toast on a rejected request. Production always renders RD.

## Open questions
| # | For | Question | Affects |
|---|-----|----------|---------|
| 1 | PM | Should the failed History card offer Retry? | ERR-05 |
| 2 | PM/Design | Resolve conflicts 1–4 above | ERR-06, DIS-01, VAL-02, EDGE-01, VAL-05, ERR-07 |

## Verification
- Every state selected in the browser and screenshot-checked; reset returns to the default (Media tab, empty draft, preset History job, balance 436).
- Fixed during verification: reset after a History state left the History tab open (RD auto-switches when the newest job changes) — reset now restores the tab after the room settles.
- Production build (`vite build`): no `StateExplorer`, `__AUTO_EDIT_STATE__` or `state-explorer` in the output.
