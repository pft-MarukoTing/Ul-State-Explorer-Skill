# Design System Map — YCO (YouCam Online Editor web)

- Libraries: [Comp]YCO_web_components_2025 (components in other products' libraries — ycv, YCE, YCP… — are not YCO's guideline)
- Library file: https://www.figma.com/design/JXNIQPJT9I9qFrgtiaCn4i/-Comp-YCO_web_components_2025
- Updated: 2026-11-03 — decision log added (rows from Test A2 / Test B, AI Auto Edit, Test C, AI Background, and Test A3, AI Auto Edit mobile) — fill in the empty links

## Patterns
| Pattern (family) | Use | Variant / props | Notes |
|------------------|-----|-----------------|-------|
| Toast (F5, F8) | Alert — https://www.figma.com/design/JXNIQPJT9I9qFrgtiaCn4i/-Comp-YCO_web_components_2025?node-id=3482-58557 | Errors: Tone=Error, Size=Small, Heading=off | Named "Alert", not "Toast". Top center, auto-dismiss |
| Inline alert / banner (F5) | Alert (same set) or Alert global | Size=Large; tone by meaning | Alert has Error, Warning, Success, Information, Neutral, Brand, Inverse neutral, Inverse brand |
| Modal / confirm (F15) | Modal | Tone=Destructive for delete | |
| Empty state (F9) | Empty State | | Newer than canvas=Upload; prefer it |
| Tooltip (F10, F13) | Tooltip | Size=Tiny, Heading=off, Dismissible=off for hover hints | Arrow side via Type |
| Spinner / loader (F1–F4) | Spinner 1, Spinner 2, ic-loader-circle | | |
| Skeleton (F1) | none | | Known gap |
| Progress (F4) | canvas=histories generating card | | Only inside History |

## State tokens and variants
| State | Components with a State variant | Tokens when there is no variant |
|-------|--------------------------------|---------------------------------|
| Disabled (one component) | Button (State=Disabled) | Fill/Disabled, Text/Disabled, Icon/Disabled, Stroke/Disabled (e.g. "Button with creadits" has no Disabled variant) |
| Disabled (whole group / region) | — | Dim the whole region to **30% opacity** (e.g. voice selector when Voice-Over is off) |
| Error (field) | | Stroke/Error strong, Text/Error, Icon/Error |
| Hover / Pressed | Button, Thumbnail-media (Hover), Tag | Fill/Hover, Fill/Press |
| Overlay / scrim | | Fill/Overlay, Fill/Overlay Weak |

## Pattern decisions log
| Family | Decision | Scope | Source | Decided by · date | Status |
|--------|----------|-------|--------|-------------------|--------|
| Disabled — whole group / region | Dim the whole region to 30% opacity | Product | Team rule, stated in Test A2 review | User · 2026-11-02 | Decided |
| F5 Toast component | Alert, Tone=Error, Size=Small, Heading=off, top center | Product | Test A2 review | User · 2026-11-02 | Decided |
| F4 Long task — after Generate | Switch to History; the generating card shows progress | Page: AI Auto Edit | Test A2 | User · 2026-11-02 | Decided |
| F14 Validation — requirements not met | Disabled + persistent visible helper text, no click-then-error | Page: AI Auto Edit | Test A2 | User · 2026-11-02 | Decided (RD differs: reason screen-reader only — compare in Test B) |
| F5 Action error — request failed | Toast, stay on page | Page: AI Auto Edit | Test A2 | User · 2026-11-02 | Decided (RD differs: nothing visible — compare in Test B) |
| F5 Import failed | File not added, Toast only | Page: AI Auto Edit | Test A2 | User · 2026-11-02 | Decided |
| F10 Text length — single-line names | "…" + hover Tooltip | Page: AI Auto Edit | Test A2 | User · 2026-11-02 | Decided |
| F15 Delete | Confirm Modal (Tone=Destructive) | Page: AI Auto Edit | Test A2 | User · 2026-11-02 | Decided |
| F5 Generation failed (task) | Text on the canvas + Retry on the preset tile; a creation retries from its menu (Regenerate) | Page: AI Background | Step 4, Test C | User · 2026-11-03 | Decided (kept as built) |
| F5 Upload can't be used | Error Toast listing supported formats; file not added | Page: AI Background | Step 4, Test C (matches AI Auto Edit "Import failed") | User · 2026-11-03 | Decided |
| F5 Cut-out failed / no subject | Error Toast; keep the original photo; editing off, Upload Image still works | Page: AI Background | Step 4, Test C | User · 2026-11-03 | Decided |
| F15 Delete | Confirm Modal (Tone=Destructive); Undo still restores | Page: AI Background | Step 4, Test C (matches AI Auto Edit) | User · 2026-11-03 | Decided |
| F9 Empty — section with no items yet | Hide the section until the first item (My Creations) | Page: AI Background | Step 4, Test C | User · 2026-11-03 | Decided (kept as built) |
| F14 Input at its length limit | Input stops; counter shows 200/200 | Page: AI Background | Step 4, Test C — not answered | — · 2026-11-03 | default (unconfirmed) |
| F10 Text length — names on touch (no hover) | 1 line + "…"; tap opens the detail (Voice-Over Style) with the full name | Page: AI Auto Edit (mobile) | Step 4, Test A3 | User · 2026-11-03 | Decided |
| F15 Delete inside a modal | Stack a confirm Modal (Tone=Destructive, Device=Mobile) on top | Page: AI Auto Edit (mobile) | Step 4, Test A3 (matches desktop delete) | User · 2026-11-03 | Decided |
| F9 Empty — My Voices | One line of text; the existing Record / Import buttons stay below | Page: AI Auto Edit (mobile) | Step 4, Test A3 | User · 2026-11-03 | Decided (kept as built) |
| F4 / F5 Creating a voice | Row Spinner; on failure the row shows an error line + Retry | Page: AI Auto Edit (mobile) | Step 4, Test A3 | User · 2026-11-03 | Decided |

Page-scope rows are recommendations for other pages, not answers; promote a row to `Product` when the team confirms it applies everywhere. Candidates: "Delete → confirm Modal" (now chosen on three pages, including inside a modal on mobile) and "Upload/import can't be used → error Toast, file not added" were chosen the same way on both pages.

## Known gaps
- No Skeleton component.
