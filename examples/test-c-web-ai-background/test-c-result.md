# Test C — Web prototype (Mode B): yco-collab-space · ai-background

- Source: `YouCamWeb/yco-collab-space` `main` @ 7632b8a, `features/ai-background`
- Setup: added to the same shallow, sparse test checkout as Test B; the user's own clone was not touched. Edits are test-only.
- Date: 2026-11-03
- Files: `ui-states-checklist.md`. The registry and code changes are not published here because the source repo is private.

## Result
- 29 states in the bottom-right State Explorer, each checked in the browser at 1280 × 800.
- 0 new UI built. Reachability was again the main gap: a failed custom generation and many creations could not be reached with the mocks, and most loading states lasted 1.5–4 s.
- The page's Demo widget was removed; its user / uses / credits scenarios became states.
- 1 conflict found by the design-system map, not by a Figma answer: the disabled inspector dims to 60% in RD; the YCO map says a disabled region dims to 30%. Both are built behind the RD / Team rule switch.
- 1 silent bug found by driving the real file input with a non-image: it is added as a broken tile, selected, with no message.
- 3 missing states listed with options and not built (bad upload, cut-out failure, delete confirm), because the skill asks before building NEW UI.
- Production build contains no explorer code.

## How states are driven
| Seam | States |
|------|--------|
| The room's reducer actions (`dispatch`) | selections, generate, scenarios, upload dialogs, apply, eraser, delete |
| One dev-only `__dev` patch action wrapped around the product reducer | cut-out phase, saved creations, a task forced to fail |
| `hold`: freeze the mock engine timers; finish a task with the real `taskDone` action | every processing / done / failed state, instantly and without waiting |
| Real file input with a synthetic file | bad upload |

## Findings for the skill
1. A reducer page needs only two seams: dispatch, plus one dev-only patch action wrapped around the product reducer. Timers that stand in for an engine need a hold switch, so a state can stay on "processing" and then finish through the real action. Added to `web-workflow.md` B3.
2. The team map caught a conflict that no Figma frame shows (group-disabled opacity). Checking the as-built UI against the map's rules is worth doing for every page.
3. Driving the real input with bad data finds silent failures that reading the code misses. Added to B3 seam 4.
4. Known issue: on phone width the explorer pill covers a fixed bottom-right button (here ✓ Apply). Not fixed yet.

## Rerun: Step 4 was skipped the first time
The user asked why the page was built without any questions. The first pass treated "RD already built it" as the answer, which breaks Step 4's "always ask". Fixed in the skill, then rerun:
- **Decision log** (`design-system-map.md`): a team-owned table of family, decision, scope (`Product` / `Page`), source, who and when, status. Step 4 reads it plus other pages' checklists plus the as-built UI, and labels every option with its source — `(Decided — AI Auto Edit, 2026-11-02)`, `(Built today on this page)`. `Product` rows are applied without asking and listed first; the rest are recommendations. Answers are appended after the user confirms.
- **The as-built UI is an option, not an answer** (`web-workflow.md` B1.7), and Step 7 checks that Step 4 ran before anything was built.
- Two rounds, 6 questions (5 answered, 1 left as `default (unconfirmed)`). Two answers matched AI Auto Edit (delete confirm, bad upload → Toast), so both are now candidates to promote to `Product`.
- Built from the answers: error Toast for a bad upload (the broken-tile bug is gone), cut-out failure (Toast, original photo kept, Upload Image still works), destructive delete confirm. 4 new strings are placeholders for PM.
- Review fix: states that look exactly like the default (EMP-01 "section hidden", DIS-02) no longer appear as entries that change nothing; the runtime's `defaultCovers` lists them on DEF-00, and the checklist marks them `Covered by default`.
