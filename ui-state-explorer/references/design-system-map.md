# Design System Map

A team-owned file that says which component and which tokens this team uses for each presentation pattern and state. It is what stops the skill from inventing a Toast when the library already has one under another name, or dimming a button with opacity when a disabled token exists.

The skill never ships a team's map. Each team keeps its own, next to its own work.

## Where the skill looks (in order)

1. A path or link the user gives in the request ("use our map at …").
2. Web projects: `design-system-map.md` in the project root (or `docs/`).
3. Figma: a page or frame named `Design System Map` in the source file, then in the library file the source's instances come from (read it with `get_metadata` / `get_design_context` like any frame).
4. A map saved earlier in this session.

If none is found, discover patterns as in `pattern-questions.md` → "Find the guideline's pattern", and at the end offer to write a map from what was found and answered (Step 7). Save it where the team will find it next time: the project root for web; for Figma-only work, ask the user where (a local file they keep, or a `Design System Map` frame in their library file — only with their go-ahead, since that edits the library).

A map overrides search results. If the map and the library disagree (a mapped component no longer exists), say so and ask.

## Format

```markdown
# Design System Map — <team / product>

- Libraries: <library names the product uses> (others are not this team's guideline)
- Updated: <YYYY-MM-DD> by <who>

## Patterns
| Pattern (family) | Use | Variant / props | Notes |
|------------------|-----|-----------------|-------|
| Toast (F5, F8) | <component name + link> | <e.g. Tone=Error, Size=Small, Heading=off> | <position, duration> |
| Inline alert (F5) | … | … | … |
| Modal / confirm (F15) | … | … | … |
| Empty state (F9) | … | … | … |
| Tooltip (F10, F13) | … | … | … |
| Spinner / loader (F1–F4) | … | … | … |
| Skeleton (F1) | … or "none — do not use" | | |
| Progress (F4) | … | … | … |

## State tokens and variants
| State | Components with a State variant | Tokens when there is no variant |
|-------|--------------------------------|---------------------------------|
| Disabled (one component) | <e.g. Button State=Disabled> | <fill / text / icon / stroke tokens> |
| Disabled (whole group / region) | — | <team rule, e.g. "dim the whole region to 30% opacity"> |
| Error (field) | … | … |
| Hover / Pressed | … | … |
| Selected | … | … |
| Overlay / scrim | — | … |

## Pattern decisions log
| Family | Decision | Scope | Source | Decided by · date | Status |
|--------|----------|-------|--------|-------------------|--------|
| F5 Action error — request failed | Toast (Alert Tone=Error), stay on page | Product | <page>, <checklist link> | <who> · <YYYY-MM-DD> | Decided |
| F14 Validation | Disabled + visible helper text, never click-then-error | Product | … | … | Decided |
| F9 Empty — first use | Illustration + CTA | Page: <page> | … | … | default (unconfirmed) |

## Known gaps
Patterns the team has no component for yet, and what to do instead ("no Skeleton — use Spinner").
```

Keep only what the team has decided. An empty row is better than a guessed one.

## The decision log

The log is how answers from one page reach the next. It lives in this team-owned file (in the project repo, so the team shares it and git keeps its history), never inside the skill and never only in one person's assistant memory.

- **Family**: the pattern family from `pattern-questions.md` plus the state kind, so a later page can match it.
- **Scope**: `Product` (applies to every page) or `Page: <name>` (decided for one page; a later page treats it as a recommendation, not an answer).
- **Status**: `Decided`, `default (unconfirmed)` (the user took the recommended default) or `Superseded by <row>`. Never delete a row; supersede it.
- The skill reads the log in Step 4 and appends to it after Step 4, with the user's confirmation of the rows and their scope. If the project has no map yet, the skill offers to create one holding just the log.

