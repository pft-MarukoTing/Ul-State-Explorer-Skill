# Missing State Checklist — Format

One checklist per analysed screen (or one per flow with a section per screen). The same checklist drives both modes; state IDs must match the Figma frame names (Mode A) and the State Explorer entries (Mode B).

## File: `ui-states-checklist.md`

```markdown
# Missing State Checklist — <Screen / Flow name>

- Source: <Figma URL + node id | file path / URL>
- Output mode: <A — Figma | B — Web>  (reason: <one line>)
- Analysed: <YYYY-MM-DD>
- Summary: <n> states missing · P0 <n> · P1 <n> · P2 <n> · <n> need confirmation · <n> already covered

## Inventory (short)
- Regions: …
- Key components: … (existing state variants: …)
- Interactions: …
- Data dependencies: …

## Pattern decisions
| Family | Applies to | Decision | Source |
|--------|-----------|----------|--------|
| F4 Long task | LOAD-01 | Indeterminate bar + step text, Cancel allowed | User |
| F5 Action error | ERR-01 | Inline banner in result area + Retry | User |
| F10 Text length — prompt title | EDGE-02 | 2 lines, "…" + expand arrow | User |
| F9 Empty — history | EMP-01 | Icon + one-line text + primary CTA | default (unconfirmed) |

## Missing states

| ID | Category | State name | Scope | Trigger | Pattern | Expected UI | Reuse | Priority | Confirm | Status |
|----|----------|-----------|-------|---------|---------|-------------|-------|----------|---------|--------|
| LOAD-01 | Loading | Result — generating | Result panel | User clicks Generate; request pending | F4 | Button → loading variant; result area indeterminate bar + step text + Cancel | Button/Loading, Progress | P0 | RD: is progress % available? | Built |
| ERR-01 | Error | Generate failed | Result panel | Request fails / times out | F5 | Inline banner in result area, inputs kept, "Try again" secondary button | Banner/Error | P0 | PM: copy | Built |
| PERM-01 | Permission | Out of credits | Generate button | Credits = 0 | F17 | Button disabled + helper "You've used all credits. [Upgrade]" | Button/Disabled, Link | P1 | PM: plan names, upgrade target | Built (placeholder copy) |

## Already covered by the guideline
| State | Where it exists |
|-------|-----------------|
| Button hover/pressed | Button component variants |

## Open questions
| # | For | Question | Affects |
|---|-----|----------|---------|
| 1 | PM | What is the free-plan generation limit? | PERM-01, BIZ-02 |

## New patterns (needs design review)
| Item | Why new | Used by |
|------|---------|---------|
| Result skeleton | No skeleton component in library | LOAD-01 |

## Not built
| ID | Reason |
|----|--------|
```

## Column rules

- **ID** — `<CODE>-<nn>`; codes: `DEF EMP LOAD ERR DIS VAL INT EDGE PERM RESP PART DEST BIZ`. `DEF-00` is always the untouched original.
- **State name** — `<Region> — <condition>`; no generic names like "Error".
- **Trigger** — an observable condition ("upload > {maxSize}", "API returns 5xx", "list has 0 items after filter"), never vague ("when something goes wrong").
- **Pattern** — the family ID from `pattern-questions.md` whose decision this state follows (`—` if no family applies).
- **Expected UI** — the delta from default only, following the decided pattern.
- **Pattern decisions → Source** — `User` (answered in Step 4), `Guideline` (found in the design system and confirmed), or `default (unconfirmed)` (user chose "use recommended defaults").
- **Reuse** — component/variant/token names from the design system, or `NEW`.
- **Confirm** — `—`, `PM`, `RD`, or `PM+RD` followed by the specific question.
- **Status** — `Built`, `Built (placeholder copy)`, `Not built`, `Covered`.

## Priority definitions

| Priority | Meaning | Examples |
|----------|---------|----------|
| **P0** | Without it the user is blocked, misled, or loses data. Must ship with the feature. | main-action loading, load/action failure, required-field validation, destructive confirmation, first-use empty of the main area |
| **P1** | Common situation; confusing or ugly without it. Should ship. | disabled-with-reason, no search results, permission/quota, partial success, long-text overflow in key places |
| **P2** | Rare or polish. Nice to have. | extreme numbers, hover refinements, uncommon error types |

## Optional JSON (machine-readable, used by Mode B registry)

```json
{
  "screen": "Tool page",
  "mode": "B",
  "patterns": [
    { "family": "F4", "appliesTo": ["LOAD-01"], "decision": "Indeterminate bar + step text, Cancel allowed", "source": "User" }
  ],
  "states": [
    {
      "id": "LOAD-01",
      "category": "Loading",
      "name": "Result — generating",
      "scope": "Result panel",
      "trigger": "User clicks Generate; request pending",
      "pattern": "F4",
      "expectedUI": "Button loading; indeterminate bar + step text + Cancel",
      "reuse": ["Button/Loading", "Skeleton"],
      "priority": "P0",
      "confirm": { "who": "RD", "question": "Is progress % available?" },
      "status": "Built"
    }
  ]
}
```
