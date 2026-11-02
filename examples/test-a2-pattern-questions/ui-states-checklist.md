# Missing State Checklist v2 — AI Auto Edit (frame "1366")

- Source: https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=0-6172
- Output mode: A — Figma (re-run of Test A with pattern questions)
- Output: https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=10-9157
- Analysed: 2026-11-02
- Summary: 14 states · P0 6 · P1 5 · P2 3 · 5 rebuilt or new from pattern answers · VAL-01 removed · Toast = library Alert (Error, Small)

## Pattern decisions
| Family | Applies to | Decision | Source |
|--------|-----------|----------|--------|
| F3 Action in progress | LOAD-01 | After Generate, switch to History; existing generating card shows progress | User |
| F5 Errors | ERR-02, ERR-03 | Request failed → Toast top-center, stay on page · background job failed → failed History card | User |
| F8 Upload | LOAD-02, ERR-01 | Uploading → thumbnail + Spinner + % · import failed → not added, Toast only | User |
| F7 / F13 Validation & disabled | DIS-01, EDGE-01 | Disabled + persistent helper text; no click-then-error | User |
| F9 Empty | EMP-01 | Illustration + Import media CTA + formats/limits | User |
| F9 Empty | EMP-02 | Illustration + text, no CTA | default (unconfirmed) |
| F10 Text length | EDGE-02 | Voice / style names: 1 line + "…" + hover Tooltip | User |
| F15 Destructive | DEST-01 | Confirm Modal (Destructive) | User |
| F17 Permission | PERM-01 | Generate disabled + helper text + Get credits link | User |
| Toast | ERR-01, ERR-02 | Top center, auto-dismiss · Alert Tone=Error, Size=Small, Heading=off | User |

## Missing states
| ID | Category | State name | Pattern | Expected UI | Reuse | Priority | Status |
|----|----------|-----------|---------|-------------|-------|----------|--------|
| EMP-01 | Empty | Media — no media yet | F9 | Upload variant: illustration, formats, Import media | canvas=Upload | P0 | Kept (placeholder copy) |
| EMP-02 | Empty | History — no videos yet | F9 | Illustration + text, no CTA | Tabs History=yes, canvas=Upload | P1 | Kept — default (unconfirmed) |
| LOAD-02 | Loading | Media — importing | F8 | Thumbnail overlay + Spinner + % | Thumbnail-media, Fill/Overlay, ic-loader-circle | P0 | Kept |
| LOAD-01 | Loading | Generate — switched to History | F3 | History tab; new job on top as "Video Generating…" card; Generate ready again | Tabs History=yes, canvas=histories | P1 | Rebuilt |
| ERR-01 | Error | Media — import failed | F8 | File not added; Toast at top center with file and reason | Alert (Error, Small) | P0 | Rebuilt (placeholder copy) |
| ERR-02 | Error | Generate — request failed | F5 | Stays on Media; Toast + Try again; inputs kept | Alert (Error, Small, Link) | P0 | Rebuilt (placeholder copy) |
| ERR-03 | Error | History — generation failed | F5 | Failed History card with reason | canvas=histories card | P0 | Kept (placeholder copy) |
| DIS-01 | Disabled | Generate — requirements not met | F7/F13 | Generate disabled + reason below | Fill/Disabled, Text/Disabled (no Disabled variant), Text/Weak | P1 | Kept |
| DIS-02 | Disabled | Voice-over — off | — | Toggle off, whole voice selector dimmed to 30% (team group-disabled rule) | YCO_toggle open=no | P2 | Kept, opacity 40% → 30% |
| VAL-02 | Validation | Prompt — character limit | — | Counter 2500/2500 in Text/Error | Text/Error | P2 | Kept (not asked) |
| PERM-01 | Permission | Credits — not enough | F17 | Generate disabled + "Not enough credits" + Get credits link | Fill/Disabled, Text/Disabled, Text/Error, Text/Brand | P0 | Kept (placeholder copy) |
| EDGE-01 | Edge | Media — limit reached | F13 | Counters full; Import media disabled; helper text beside it; no Alert | Button State=Disabled, Text/Error | P1 | Rebuilt |
| EDGE-02 | Edge | Voice / style name — truncated | F10 | 1 line + "…"; hover Tooltip shows full name | Tooltip Bottom centre / Tiny | P2 | New |
| DEST-01 | Destructive | Media — delete confirmation | F15 | Destructive Modal: Cancel / Delete | Modal Tone=Destructive | P1 | Kept |

## Removed
| ID | Reason |
|----|--------|
| VAL-01 | Answer F7/F13: Generate is disabled with a reason, so a click-then-error state never happens |

## Open questions
| # | For | Question | Affects |
|---|-----|----------|---------|
| 1 | PM+RD | Does the switch to History happen on click, or only after the server confirms the job? (On failure the user should stay on Media.) | LOAD-01, ERR-02 |
| 2 | PM | Copy for every placeholder; are credits refunded when generation fails? | ERR-01–03, PERM-01 |
| 3 | PM+RD | Which import failure reasons can be told apart? Toast duration? | ERR-01 |
| 4 | PM | Which media limit blocks import? | EDGE-01 |
| 5 | RD | Tap / long-press alternative to the hover tooltip on touch devices | EDGE-02 |
| 6 | Design | Use the new [Comp] Empty State component instead of canvas=Upload? | EMP-01, EMP-02 |

## New patterns (needs design review)
| Item | Why new | Used by |
|------|---------|---------|
| Thumbnail uploading overlay | Thumbnail-media has only Default/Hover (from Test A) | LOAD-02 |
| Credit coin inside disabled Generate | Illustration has no disabled token — keep colours or grey out? | DIS-01, PERM-01 |
