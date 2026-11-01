---
name: ui-state-explorer
description: Find and build the UI states a design is missing beyond the happy path — loading, empty, error, disabled, validation, interaction, edge cases, permission, responsive, retry, destructive and business-specific states. Produces a Missing State Checklist, then delivers the states either as editable Figma frames (Mode A) or as a State Explorer toggle inside a web prototype (Mode B). Use when the user asks to "fill in missing states", "add loading/empty/error states", "what states am I missing", "state coverage", "edge cases for this screen", "UI states for RD handoff", "state explorer", or shares a Figma frame or web page and wants non-happy-path states designed or implemented.
---

# UI State Explorer

Designs usually show only the happy path. This skill analyses an existing UI, finds the states the design guideline does not yet cover, and produces them in the format the team will hand off: **Figma frames** or a **web prototype with a State Explorer**.

The analysis is shared; only the output step differs. Never hard-code anything about a specific product into the analysis — every state must be derived from what is observed in the source UI.

## Workflow at a glance

1. **Pick the mode** (Step 1) — Figma output or Web output.
2. **Inventory the source UI** (Step 2) — screens, regions, components, interactions, data.
3. **Run the state analysis** (Step 3) — walk the taxonomy, keep only states that apply.
4. **Write the Missing State Checklist** (Step 4) — share it before building.
5. **Build the states** — Mode A: `references/figma-workflow.md`. Mode B: `references/web-workflow.md`.
6. **Verify and report** (Step 6).

---

## Step 1 — Decide the output mode

Input source and output format are independent. Decide by the **final deliverable**, not by where the design came from.

| What the user said / provided | Mode |
|---|---|
| Delivery to RD is Figma (or only a Figma link and "make the states in Figma") | **A — Figma** |
| Delivery is a web page / prototype / code project (or only a web project) | **B — Web** |
| Both Figma and web are present | Use the delivery format the user named |
| Figma input, web delivery | **B** — read Figma for analysis, implement in the web project |
| Web input, Figma delivery | **A** — analyse the web UI, build frames in the target Figma file |
| Delivery cannot be inferred | Ask once: "Should the states be delivered as Figma frames or inside the web prototype?" |

Rules:
- Do not assume GitHub or any repository is involved. A web project can be a single local HTML file.
- Do not convert Figma to web (or web to Figma) unless that is the requested delivery.
- In Mode A a web prototype is never the deliverable; in Mode B Figma frames are never the deliverable.

## Step 2 — Inventory the source UI

Build a working inventory before thinking about states. Read, don't guess.

- **Figma source**: follow "Read" in `references/figma-workflow.md` (metadata, screenshot, design context, variables, existing component variants).
- **Web source**: read the page/components, run it, and take a screenshot (see "Read" in `references/web-workflow.md`).

Record, per screen:
- **Regions**: header, input panel, result area, list, sidebar, footer, modal…
- **Components**: buttons, inputs, selects, uploaders, toggles, tabs, cards, tables, lists, media, toasts, dialogs. Note which already have state variants (e.g. a Button component with `State=Disabled`) — these must be reused, not redrawn.
- **Interactions**: every action the user can take and what it triggers (submit, upload, generate, save, delete, paginate, filter, sign-in-gated actions).
- **Data**: every value that comes from the user or a server — counts, names, lists, images, prices, quotas, timestamps. Each data dependency implies Loading / Empty / Error / Overflow candidates.
- **Existing guideline coverage**: states already designed or documented (other frames, component variants, a states page, code branches). These are excluded from "missing".
- **Design system**: tokens/variables, text styles, spacing scale, existing feedback components (toast, banner, skeleton, spinner, empty-state illustration, inline error).

## Step 3 — State analysis

Walk every category in `references/state-taxonomy.md` against the inventory. For each category, ask the detection questions there and keep a state **only if a concrete element in the inventory triggers it**. Do not pad the list to cover all categories.

Categories:
1. Default / Success
2. Empty / No Data
3. Loading / Processing
4. Error / Failed / Timeout
5. Disabled / Unavailable
6. Validation
7. Hover / Focus / Active / Selected
8. Boundary / Edge Cases
9. Permission / Subscription
10. Responsive / Overflow
11. Partial Success / Retry
12. Destructive / Recovery
13. Business-specific states (derived from this product's own rules visible in the UI)

For every kept state, define:
- **ID** — `<category-code>-<nn>` (e.g. `LOAD-01`), stable across both modes.
- **Name** — short, specific (`Result area — generating`, not `Loading`).
- **Scope** — screen / region / component it affects.
- **Trigger** — the condition that produces it, stated in observable terms.
- **Expected UI** — what changes vs. the default, using existing components and tokens.
- **Priority** — P0 / P1 / P2 (definitions in `references/checklist-format.md`).
- **Needs confirmation** — `PM`, `RD`, `PM+RD` or `—`, with the open question.
- **Reuse** — which existing component/variant/token it uses, or `NEW` if nothing exists.

### Handling unknown product rules
Never invent product rules (limits, quotas, plan names, retry counts, error copy that implies policy, who has permission). When a state depends on an unconfirmed rule:
- still include the state if the UI clearly needs it,
- use a neutral placeholder in the UI (`{limit}`, `[Plan name]`, "Something went wrong. Try again."),
- mark it `Needs confirmation` with the specific question.

## Step 4 — Missing State Checklist

Write the checklist using `references/checklist-format.md` (Markdown table + optional JSON). Save it as `ui-states-checklist.md` beside the deliverable (web project root, or alongside the Figma work in the session folder), and also place it in Figma for Mode A.

Show the checklist to the user before building when there are open P0 questions or more than ~15 states; otherwise build directly and present it with the result.

## Step 5 — Build

- Mode A → `references/figma-workflow.md`
- Mode B → `references/web-workflow.md`

## Shared design principles (both modes)

- **Do not redesign.** Keep layout, typography, color, spacing, radius, iconography and component structure. A state changes only what the state requires.
- **Guideline first.** Use existing components, variants, variables/tokens and patterns. Create something new only when nothing fits, and label it `NEW — needs design review`.
- **Fill gaps only.** States already covered by the guideline are listed as "Covered" and not rebuilt.
- **Happy path is untouched.** The original frame/page and its behavior must be identical after the work. In Figma never edit the source frame; in web the explorer-off experience must behave exactly as before.
- **No unconfirmed product decisions.** Placeholders + confirmation flags instead.
- **Review- and dev-ready.** Every state is named by ID, grouped by category, and carries its trigger so designers can review and RD can inspect.
- **Accessible states.** Error/validation messages are associated with their fields, disabled controls keep readable contrast, focus states are visible, loading states announce progress (`aria-busy` / live region in web; annotated in Figma).

## Step 6 — Verify and report

Before reporting, check:
- [ ] Every checklist item is built, or marked "Not built" with a reason.
- [ ] Source happy path unchanged (Figma: source frame untouched; web: explorer off = original behavior, no console errors).
- [ ] Only existing tokens/components used, or `NEW` items flagged.
- [ ] Names follow the convention of the mode.
- [ ] Mode B: explorer cannot load in production (see isolation rules).

Report to the user: mode chosen and why, counts by category and priority, where the output is (Figma link / file paths), the open PM/RD questions, and anything not built.

## Reference files

- `references/state-taxonomy.md` — detection questions and typical expected UI per category.
- `references/checklist-format.md` — checklist template, priority definitions, JSON schema.
- `references/figma-workflow.md` — Mode A step by step (Figma MCP).
- `references/web-workflow.md` — Mode B step by step.
- `assets/state-explorer/state-explorer.js` — drop-in, framework-agnostic State Explorer panel (Mode B).
- `assets/state-explorer/states.example.js` — template for a project's state registry.
