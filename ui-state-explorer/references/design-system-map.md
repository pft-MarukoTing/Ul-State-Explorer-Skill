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

## Decided patterns (optional)
Answers from earlier pattern questions that apply product-wide, e.g. "Validation: disabled + helper text, never click-then-error".

## Known gaps
Patterns the team has no component for yet, and what to do instead ("no Skeleton — use Spinner").
```

Keep only what the team has decided. An empty row is better than a guessed one.
