# Missing State Checklist — AI Background (web prototype)

- Source: `features/ai-background` on `YouCamWeb/yco-collab-space` `main` (7632b8a), tested in a partial checkout
- Output mode: B — Web (State Explorer, bottom-right "States" pill, Alt+Shift+S)
- Analysed: 2026-11-03 · pattern questions asked 2026-11-03 (rerun: the first pass built without asking)
- Summary: 30 states (28 explorer entries + 2 shown by the default) · P0 10 · P1 12 · P2 8 · 3 newly built from the answers (bad upload, cut-out failed, delete confirm) · 1 conflict with the team rule (both built)

## Pattern decisions
Applied from the decision log without asking (Product scope): disabled region dims to 30% as a whole; Toast = Alert Tone=Error, Size=Small, Heading=off.

| Family | Applies to | Decision | Source |
|--------|-----------|----------|--------|
| F5 Generation failed | ERR-01, ERR-02 | Canvas text + Retry on the preset tile; a creation retries from its menu | User (kept as built) |
| F5 Upload can't be used | ERR-03 | Error Toast with the supported formats; file not added | User (= AI Auto Edit "Import failed") |
| F5 Cut-out failed | ERR-04 | Error Toast; original photo stays; editing off, Upload Image works | User |
| F15 Delete | DEST-03 | Confirm Modal, Tone=Destructive; Undo still restores | User (= AI Auto Edit) |
| F9 Empty section | EMP-01 | Hidden until the first creation | User (kept as built) |
| F14 Input length limit | VAL-01 | Input stops; counter 200/200 | default (unconfirmed) |
| Disabled region | DIS-01, LOAD-01, EDGE-03 | 30% (team rule) — RD builds 60%; both behind the switch | Log (Product) |

## Seams used (dev only)
| Seam | Where | Drives |
|------|-------|--------|
| The room's own reducer actions | `window.__AI_BACKGROUND_STATE__.dispatch` | select, generate, scenario (user / uses / credits), upload, apply, eraser, delete, cut-out failed |
| `__dev` patch action | generated/index.jsx `roomReducer` (dev seam only; every other action is the product reducer) | cut-out phase, saved creations, a task forced to fail |
| `hold` override | generated/index.jsx, empty outside `npm run dev` | freezes the mock engine timers; a state finishes a task with the real `taskDone` |
| Real file input with a synthetic file | Picture tab upload | bad upload |
| `patternVariant` override | generated/pattern-variant.js | RD vs team rule for the dimmed inspector |

The page's Demo widget was removed; its scenarios are states (PERM-01…05).

## States
| ID | State | Pattern | Reach before | Priority | Status |
|----|-------|---------|--------------|----------|--------|
| EMP-01 | My Creations — none yet | Section hidden | default | P1 | Covered by default |
| EMP-02 | My Pictures — no uploads | Transparent, Original, upload tile | Picture tab | P2 | Built (RD) |
| LOAD-01 | Photo cut-out — processing | Overlay + % on the canvas; inspector dimmed | 1.5 s on open | P0 | Built (RD) |
| LOAD-02 | Preset — generating | Tile progress + canvas generating preview | 4 s | P0 | Built (RD) |
| LOAD-03 | Custom prompt — generating | New My Creations item with progress | 4 s | P0 | Built (RD) |
| LOAD-04 | Several tasks at once | Progress on each tile | pick 3 fast | P2 | Built (RD) |
| ERR-01 | Preset — generation failed | Tile failed mark + Retry; canvas text | 2 presets, first try | P0 | Built (RD) |
| ERR-02 | Custom prompt — generation failed | Tile failed mark; Regenerate in its menu; canvas text | **not reachable** | P1 | Built (RD) |
| ERR-03 | Picture upload — can't be used | Error Toast; file not added | **was a broken tile, no message** | P1 | Built (new, placeholder copy) |
| ERR-04 | Photo cut-out — no subject found | Error Toast; original photo; editing off | **missing** | P0 | Built (new, placeholder copy) |
| DIS-01 | Inspector — disabled during cut-out / eraser | RD 60% / Team rule 30% (switch) | brief | P1 | Built (both) |
| DIS-02 | Generate — no prompt | Disabled | default | P1 | Covered by default |
| DIS-03 | Generate — prompt unchanged (D-17) | Disabled | needs a creation | P2 | Built (RD) |
| DIS-04 | Eraser / move locked on an AI result | Eraser disabled | after a result | P1 | Built (RD) |
| DIS-05 | Blur — does not apply | Slider disabled | after a result | P2 | Built (RD) |
| DIS-06 | Download — nothing new to save | Disabled | pick Original | P2 | Built (RD) |
| VAL-01 | Prompt at 200 characters | Input stops; counter 200/200 | type 200 chars | P2 | Built (RD) |
| PERM-01 | Free — no uses left | "0 uses left today" | Demo | P0 | Built (RD) |
| PERM-02 | Free — Generate opens subscription | Subscription modal | Demo + Generate | P0 | Built (RD) |
| PERM-03 | Pro — paying with credits | 2-credit badge on Generate | Demo | P1 | Built (RD) |
| PERM-04 | Pro — out of credits | Credits pricing overlay | Demo + Generate | P0 | Built (RD) |
| PERM-05 | Plus — Upgrade from header | Subscription modal, Pro tab only | Demo + header | P2 | Built (RD) |
| DEST-01 | Upload Image — result not downloaded | Upload Photo dialog: Download / Continue | yes | P0 | Built (RD) |
| DEST-02 | Upload Image — still generating | Upload Photo dialog: Cancel / Continue | yes | P1 | Built (RD) |
| DEST-03 | Creation — delete | Confirm Modal, destructive | **was immediate, no confirm** | P1 | Built (new, placeholder copy) |
| OK-01 | Preset — result ready | Tile check mark | 4 s | P1 | Built (RD) |
| OK-02 | Applied | Success toast | Apply | P1 | Built (RD) |
| EDGE-01 | Many creations | Section grows with the panel | **not reachable** | P2 | Built (RD) |
| EDGE-02 | Sections collapsed | "Title (count)" + chevron | yes | P2 | Built (RD) |
| EDGE-03 | Eraser open | Eraser panel; inspector inert | yes | P2 | Built (RD) |

## New copy (placeholder — PM to confirm)
| Key | Text |
|-----|------|
| `ai.background.upload.error.format` | Unsupported picture format. Supported formats: JPG, PNG, TIFF, GIF, WEBP. (formats from RD PicturePanel's accept list) |
| `ai.background.cutout.error` | Couldn't find a subject in this photo. Try another photo. |
| `ai.background.custom.delete.title` | Delete {{name}}? |
| `ai.background.custom.delete.desc` | It will be removed from My Creations. |

## Open questions
| # | For | Question | Affects |
|---|-----|----------|---------|
| 1 | Team | Keep RD's 60% or apply the 30% rule to the inspector? | DIS-01 |
| 2 | RD | Does the engine report "no subject found" separately from other failures? | ERR-04 |
| 3 | PM | Wording of the four new strings above | ERR-03, ERR-04, DEST-03 |
| 4 | PM | Is the counter alone enough at the 200-character limit? (default kept, unconfirmed) | VAL-01 |
| 5 | Designer | DESIGN-014: Figma shows Download / Apply disabled at rest; the prototype enables them after the cut-out | DIS-06 |

## Verification
- Every entry selected at 1280 × 800 and checked from the room state and DOM; the three new states and the delete flow screenshot-checked (Delete removes, Cancel keeps, Undo restores; Upload Image after a failed cut-out opens the next photo). Reset returns to the default with no dialog or toast left over. Clean console.
- Production build (`vite build`): no explorer code in the output.
- Known issue: on a phone-width layout the States pill covers the ✓ (Apply) button, and on desktop it overlaps the zoom slider.
