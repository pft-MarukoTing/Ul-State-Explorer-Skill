# Test A2 — Pattern questions on the Test A frame

- Source: https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=0-6172 (frame "1366", AI Auto Edit)
- Date: 2026-11-02
- Scope: SKILL.md Steps 2–7. Inventory and analysis reused from Test A; pattern questions asked; states rebuilt in Figma.
- Output: Section "UI States v2 (pattern decisions) — 1366 · AI Auto Edit" — https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=10-9157 (the Test A section is kept next to it for comparison)
- Checklist: `ui-states-checklist.md` (same folder) + `00 Checklist` frame in the section
- Goal: check that the new Step 4 asks useful questions, that recommendations are backed by the guideline, and how much the answers change the Test A output.

## Guideline evidence used for "Recommended"
Searched only the libraries the frame uses (`[Comp]YCO_web_components_2025`):

| Pattern | Found | Notes |
|---------|-------|-------|
| Spinner | ✅ Spinner 1, Spinner 2, ic-loader-circle | |
| Alert | ✅ Alert, Alert global | Alert global is new since Test A |
| Tooltip | ✅ Tooltip | |
| Empty state | ✅ Empty State (set), Empty state | New since Test A; Test A reused canvas=Upload |
| Modal | ✅ Modal (Tone=Destructive) | |
| Toast | ❌ → ✅ after review | Search for "toast" found only other products' libraries. YCO's toast is the **Alert** set (Tone × Size × Layout) — found only after the user pointed to it |
| Skeleton / progress bar | ❌ | Only in ycv_new_library → NEW |

## Questions asked — 3 rounds, 12 questions

| Round | Family | Question | Answer | Recommended? |
|-------|--------|----------|--------|--------------|
| 1 | F3 Action in progress | Generate after submit | Jump straight to the History tab (existing generating card) | No |
| 1 | F5 Errors | How to show errors (multi) | Inline Alert + Retry, Toast, failed card/thumbnail | Partly |
| 1 | F7/F13 Validation | Prompt missing / requirements not met | Disabled + persistent helper text below | No |
| 1 | F9 Empty | Media first-use empty (multi) | Illustration + Import media CTA + formats/limits | Partly |
| 2 | F5 | Generate request failed | Toast, stay on page, inputs kept | Yes |
| 2 | F8 | Import failed | File not added, Toast only | No |
| 2 | F10 Text length | Voice name / style name | 1 line + ellipsis + hover tooltip | Yes |
| 2 | F15 Destructive | Delete media | Confirm Modal (Destructive) | Yes |
| 3 | F17 Permission | Not enough credits | Disabled + helper text + link | No |
| 3 | F8/F2 Loading | Upload in progress | Thumbnail + Spinner + % | Yes |
| 3 | F5 follow-up | Toast position | Top center, auto-dismiss | Yes |
| 3 | F13 | Media limit reached | Import media disabled + persistent helper | No |

6 of 12 answers differed from the recommendation, so the step is worth having: without it those states would have been built differently.

## Pattern decisions → effect on the Test A checklist

| Family | Decision | Source | Test A states affected |
|--------|----------|--------|------------------------|
| F3 | After Generate, switch to History; existing generating card shows progress | User | LOAD-01 changes: no button loading state; becomes "tab switch + generating card" (mostly Covered) |
| F5 | Generate request failed → Toast top-center, stay on the page, inputs kept | User | ERR-02 changes: Alert bar → Toast (NEW) |
| F5 | Background job failed → History card shows failure | User | ERR-03 unchanged |
| F8 | Import failed → file not added, Toast | User | ERR-01 changes: failed thumbnail + Alert → Toast only; thumbnail-failed overlay no longer needed |
| F8 | Uploading → thumbnail + Spinner + % | User | LOAD-02 unchanged; overlay still NEW |
| F7/F13 | Requirements not met → Generate disabled + helper text | User | DIS-01 kept; VAL-01 (click-then-error) removed; open question #3 settled |
| F17 | Not enough credits → disabled + helper + link | User | PERM-01 unchanged |
| F13 | Media limit → Import media disabled + helper text | User | EDGE-01 changes: Alert → helper text under the counters |
| F9 | Empty Media → illustration + Import media CTA + formats/limits | User | EMP-01: switch reuse from canvas=Upload to the new Empty State component |
| F10 | Voice / style names → 1 line + "…" + hover tooltip | User | New EDGE state: tooltip on truncated names (Test A marked truncation Covered) |
| F15 | Delete → confirm Modal | User | DEST-01 unchanged; open question #6 settled |
| Toast | Top center, auto-dismiss | User | NEW pattern: Toast (no Toast in YCO library) |

## New open question raised by the answers
- F3 × F5: the UI switches to History right after Generate, but a failed request should "stay on the page". Does the switch happen on click (then the toast appears on History) or only after the server confirms the job (button needs a short submitting state)? → PM + RD.

## Build (Mode A)
Cloned the Test A section and changed only what the answers changed:

| State | What happened |
|-------|---------------|
| LOAD-01 | Rebuilt: fresh source clone, Tabs History=yes, canvas=histories (existing "Video Generating…" card). Renamed "Generate — switched to History" |
| ERR-01 | Rebuilt: fresh source clone + NEW Toast at top center; no failed thumbnail |
| ERR-02 | Rebuilt: fresh source clone (stays on Media) + NEW Toast with "Try again" |
| EDGE-01 | Alert turned off (canvas Show Alert=false); helper text in Text/Error next to the disabled Import media |
| EDGE-02 | New: library Tooltip (Bottom centre, Tiny) above the truncated voice name with the full name |
| VAL-01 | Removed (replaced by DIS-01 disabled + helper text) |
| Others (9) | Kept; annotation now starts with the pattern decision it follows |
| NEW · Toast | Local component (Message / Action / Show action props), Fill/Strong + Text/Inverse strong + ic-circle-alert, in "New patterns" row |

Verification: source frame "1366" unchanged (same position, size, 7 children); Test A section unchanged; 14 state cards in v2; screenshots checked for every rebuilt state. Two visual fixes: Toast was first bound to Fill/Inverse strong, which is white in this library (switched to Fill/Strong, the token of the dark active tab); EDGE-01 helper text overlapped the storage bar (moved next to the button).

## Review fixes (user feedback)
The user pointed out two things built from scratch although the guideline has them:

| Issue | Cause | Fix in Figma |
|-------|-------|--------------|
| NEW Toast component | Searched only the word "toast"; YCO's toast is named **Alert**. Test A also wrongly recorded "Alert has no Error tone" — only the instance on screen was read, not the whole set | ERR-01 / ERR-02 now use Alert Tone=Error, Size=Small, Heading=off (tone and size confirmed by the user); NEW Toast component deleted |
| Disabled buttons at 40% opacity | Did not search state tokens or read the Button set's `State` variants | Import media → Button `State=Disabled`; Generate ("Button with creadits", no Disabled variant) → Fill/Disabled + Text/Disabled tokens |

Post-fix audit of the v2 section: no local components; DIS-02 voice selector was 40% opacity from Test A; the user confirmed YCO's rule — a disabled group/region is dimmed as a whole to 30% — so it was set to 30% and recorded as a team rule (YCO map), not NEW. The credit coin inside the disabled Generate button keeps its colours (illustration, no disabled token) — design to confirm.

Skill changes from this review (team-neutral):
- `pattern-questions.md` → "Find the guideline's pattern": search by role with synonyms, read each candidate set's properties, states via variants then tokens (never opacity), and **ask before any NEW**.
- New `references/design-system-map.md`: team-owned map (patterns → components, states → tokens) the skill reads first; kept outside the skill. YCO example: `examples/design-system-maps/yco.md`.
- Step 7 audit: list every raw opacity / unbound colour / NEW item.
- Group/region disabled is separate from component disabled: follow the team's group rule (YCO: whole region 30%), or ask.

## Skill fixes made from this test
Added rules 9–12 to `references/pattern-questions.md`:
- Count guideline evidence only from libraries the source uses (the search returned Toast/Skeleton from other products' libraries).
- Resolve multi-select answers with per-state follow-ups (errors needed a second round).
- Check decisions against each other for conflicts (the F3 × F5 case above).
- Let answers settle earlier open questions and drop obsolete states (VAL-01).

Added to `references/figma-workflow.md`:
- Re-runs: clone the previous states section and rebuild only the states whose pattern changed.
- Pick colors for NEW components from tokens already used by a similar surface in the source (token names like "Inverse" are not reliable), and check the screenshot.
