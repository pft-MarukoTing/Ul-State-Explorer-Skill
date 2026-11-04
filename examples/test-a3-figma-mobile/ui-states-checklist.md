# Missing State Checklist — AI Auto Edit (mobile)

- Source: https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=27-18333 (Section 1: Default, Uploaded, Voice-Over Style — My Voices)
- Output mode: A — Figma
- Output: https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=34-17893 (Section "UI States (mobile) — AI Auto Edit")
- Analysed: 2026-11-03
- Summary: 12 states built · P0 5 · P1 5 · P2 2 · 2 covered by the source · 1 not built

## Using earlier decisions (applied without asking)
Toast = Alert Error/Small, top center (Product) · disabled region dimmed to 30% (Product) · AI Auto Edit desktop decisions: import failed → not added + Toast; request failed → Toast; Generate disabled + visible reason; delete media → confirm Modal.

## Pattern decisions (asked 2026-11-03)
| Family | Applies to | Decision | Source |
|--------|-----------|----------|--------|
| F10 Text length — names on touch | EDGE-02 | 1 line + "…"; tap opens Voice-Over Style with the full name | User |
| F15 Delete inside a modal | DEST-02 | A confirm Modal stacked on Voice-Over Style (as on desktop) | User |
| F9 Empty — My Voices | EMP-03 | One line of text; the existing Record / Import buttons stay below | User (as built) |
| F4 / F5 Creating a voice | LOAD-05, ERR-09 | Row Spinner; on failure the row shows an error line + Retry | User |

## Missing states
| ID | Category | State name | Pattern | Expected UI | Reuse | Priority | Status |
|----|----------|-----------|---------|-------------|-------|----------|--------|
| EMP-03 | Empty | My Voices — empty | F9 | Rows hidden; one line of text; Record / Import below | Text/Weak | P1 | Built (placeholder copy) |
| LOAD-02 | Loading | Media — importing | F8 | Tile overlay + Spinner + % | ic-loader-circle, Fill/Overlay; NEW overlay from desktop | P0 | Built |
| LOAD-05 | Loading | My Voices — creating a voice | F4 | New row; Spinner instead of Play; "Creating…" | ic-loader-circle, Icon/Brand | P2 | Built |
| ERR-01 | Error | Media — import failed | F8 | File not added; Toast at the top | Alert (Error, Small) | P0 | Built (placeholder copy) |
| ERR-02 | Error | Generate — request failed | F5 | Stays on Edit; Toast + Try again | Alert (Error, Small) | P0 | Built (placeholder copy) |
| ERR-09 | Error | My Voices — voice could not be created | F5 | Row stays; Play disabled; error line; Retry | Button icon State=Disabled, Text/Error, Text/Brand | P1 | Built (placeholder copy) |
| DIS-01 | Disabled | Generate — requirements not met | F14 | Generate disabled + reason above it | Fill/Disabled, Text/Disabled (no Disabled variant), Text/Weak | P1 | Built |
| DIS-02 | Disabled | Voice-over — off | — | Toggle off; voice selector at 30% | YCO_toggle open=no | P2 | Built |
| VAL-02 | Validation | Prompt — character limit | — | Counter 2500/2500 in Text/Error | Text/Error | P2 | Built (not asked) |
| PERM-01 | Permission | Credits — not enough | F17 | Generate disabled + "Not enough credits. Get credits" | Fill/Disabled, Text/Error, Text/Brand | P0 | Built (placeholder copy) |
| DEST-01 | Destructive | Media — delete confirmation | F15 | Modal Destructive (Mobile): Delete / Cancel | Modal Tone=Destructive, Device=Mobile | P1 | Built |
| DEST-02 | Destructive | My Voices — delete confirmation | F15 | Confirm Modal on top of Voice-Over Style | Modal Tone=Destructive, Device=Mobile | P1 | Built |

## Covered by the source
| ID | Where |
|----|-------|
| EMP-01 Media — no media yet | "Default" frame |
| EDGE-02 Long voice name | Already 1 line + "…" in both screens; tapping opens Voice-Over Style |

## Not built
| ID | Reason |
|----|--------|
| LOAD-01 Generate → History | The mobile source has no History design yet (needs design) |

## Open questions
| # | For | Question | Affects |
|---|-----|----------|---------|
| 1 | PM | Copy for every placeholder; where Get credits goes | ERR-01, ERR-02, ERR-09, PERM-01, EMP-03 |
| 2 | PM+RD | Which import failures can be told apart? | ERR-01 |
| 3 | RD | How long does creating a voice take; can it always be retried? | LOAD-05, ERR-09 |
| 4 | PM | What happens to videos that use a deleted voice? | DEST-02 |
| 5 | Design | Mobile History tab design | LOAD-01 |

## New patterns (needs design review)
| Item | Why new | Used by |
|------|---------|---------|
| Thumbnail uploading overlay | Thumbnail-media has no uploading state (same as desktop) | LOAD-02 |
| Helper text above Generate | No component for a disabled reason (same as desktop) | DIS-01, PERM-01 |
