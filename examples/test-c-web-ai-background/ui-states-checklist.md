# Missing State Checklist — AI Background (web prototype)

- Source: `features/ai-background` on `YouCamWeb/yco-collab-space` `main` (7632b8a), tested in a partial checkout
- Output mode: B — Web (State Explorer, bottom-right "States" pill, Alt+Shift+S)
- Analysed: 2026-11-03
- Summary: 29 states in the explorer · P0 9 · P1 12 · P2 8 · 0 newly built UI · 1 conflict with the team's design-system rule (both built) · 3 missing states waiting for a pattern decision · 1 silent bug found (bad picture upload)

## Seams used (dev only)
| Seam | Where | Drives |
|------|-------|--------|
| The room's own reducer actions | `window.__AI_BACKGROUND_STATE__.dispatch` | select, generate, scenario (user / uses / credits), upload, apply, eraser, delete |
| `__dev` patch action | generated/index.jsx `roomReducer` (dev seam only; every other action is the product reducer) | cut-out phase, saved creations, a task forced to fail |
| `hold` override | generated/index.jsx, empty outside `npm run dev` | freezes the mock engine timers so "processing" stays on screen; a state finishes a task by dispatching the real `taskDone` |
| Real file input with a synthetic file | Picture tab upload | bad upload |
| `patternVariant` override | generated/pattern-variant.js | RD vs team rule for the dimmed inspector |

The page's own Demo widget (user / uses / credits / photo) was removed; its scenarios are states here (PERM-01…05).

## States
| ID | State | Pattern in RD today | Reach before | Priority |
|----|-------|---------------------|--------------|----------|
| EMP-01 | My Creations — none yet | Section hidden | default | P1 |
| EMP-02 | My Pictures — no uploads | Transparent, Original, upload tile | Picture tab | P2 |
| LOAD-01 | Photo cut-out — processing | Overlay + % on the canvas; inspector dimmed | 1.5 s on open | P0 |
| LOAD-02 | Preset — generating | Tile progress + canvas generating preview | 4 s | P0 |
| LOAD-03 | Custom prompt — generating | New My Creations item with progress | 4 s | P0 |
| LOAD-04 | Several tasks at once | Progress on each tile | pick 3 fast | P2 |
| ERR-01 | Preset — generation failed | Tile failed mark + Retry; canvas text "Generation failed. Try again." | 2 presets only, first try | P0 |
| ERR-02 | Custom prompt — generation failed | Tile failed mark, no Retry button; canvas text | **not reachable** | P1 |
| ERR-03 | Picture upload — not an image | **Broken tile, selected, no message** | pick a non-image via "All files" | P1 |
| DIS-01 | Inspector — disabled during cut-out / eraser | Whole inspector 60% | brief | P1 |
| DIS-02 | Generate — no prompt | Disabled | default | P1 |
| DIS-03 | Generate — prompt unchanged (D-17) | Disabled | needs a creation | P2 |
| DIS-04 | Eraser / move locked on an AI result | Eraser disabled | after a result | P1 |
| DIS-05 | Blur — does not apply | Slider disabled | after a result | P2 |
| DIS-06 | Download — nothing new to save | Disabled | pick Original | P2 |
| VAL-01 | Prompt at 200 characters | Input stops; counter 200/200 | type 200 chars | P2 |
| PERM-01 | Free — no uses left | "0 uses left today" | Demo | P0 |
| PERM-02 | Free — Generate opens subscription | Subscription modal | Demo + Generate | P0 |
| PERM-03 | Pro — paying with credits | 2-credit badge on Generate | Demo | P1 |
| PERM-04 | Pro — out of credits | Credits pricing overlay | Demo + Generate | P0 |
| PERM-05 | Plus — Upgrade from header | Subscription modal, Pro tab only | Demo + header | P2 |
| DEST-01 | Upload Image — result not downloaded | Upload Photo dialog: Download / Continue | yes | P0 |
| DEST-02 | Upload Image — still generating | Upload Photo dialog: Cancel / Continue | yes | P1 |
| DEST-03 | Creation — delete | **Deleted at once, no confirm** (Undo restores) | needs a creation | P1 |
| OK-01 | Preset — result ready | Tile check mark | 4 s | P1 |
| OK-02 | Applied | Success toast | Apply | P1 |
| EDGE-01 | Many creations | Section grows with the panel | **not reachable** (mock account has none) | P2 |
| EDGE-02 | Sections collapsed | "Title (count)" + chevron | yes | P2 |
| EDGE-03 | Eraser open | Eraser panel; inspector inert | yes | P2 |

## Conflict with the team rule — both built, switch RD / Team rule in the explorer
| # | State | RD today | Team rule (YCO design-system map) | Affects |
|---|-------|----------|-----------------------------------|---------|
| 1 | Disabled inspector | Whole region at 60% | A disabled group or region dims as a whole to 30% | DIS-01 (also LOAD-01, EDGE-03) |

## Missing — need a pattern decision before anything is built
| # | State | Today | Options |
|---|-------|-------|---------|
| M1 | Bad picture upload (not an image, unsupported, too large) | Broken tile, no message (ERR-03) | Error toast (Alert, Tone=Error) and the file is not added · Inline error under My Pictures · Tile with an error badge and Remove |
| M2 | Cut-out finds no subject / fails | Not handled | Canvas message with Upload another photo · Error toast and stay on Original · Dialog |
| M3 | Delete a creation | No confirm; Undo restores (DEST-03) | Keep as is (Undo is enough) · Confirm dialog · Toast with Undo |

## Open questions
| # | For | Question | Affects |
|---|-----|----------|---------|
| 1 | Designer | DESIGN-014: Figma shows Download / Apply disabled at rest; the prototype enables them after the cut-out (RD rule). Intended? | DIS-06 |
| 2 | PM | Should a failed custom creation get the same Retry button as a preset tile? | ERR-02 |
| 3 | PM | Is the counter alone enough at the 200-character limit? | VAL-01 |

## Verification
- Every state selected at 1280 × 800 and checked from the room state and DOM (phase, selection, tasks, canvas kind, Generate enabled, uses line, dialogs, toast, inspector opacity); key screens screenshot-checked. DIS-01 measured 0.6 (RD) and 0.3 (Team rule).
- Reset returns to the default (Transparent, AI Generate, Free with 3 uses, all sections open) and writes the open sections back so a collapsed state does not survive a reload.
- Production build (`vite build`): no `StateExplorer` or `__AI_BACKGROUND_STATE__` in the output. Clean console.
- Known issue: on a phone-width layout the States pill covers the ✓ (Apply) button at the bottom right.
