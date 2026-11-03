---
name: ui-state-explorer
description: Find and build the UI states a design is missing beyond the happy path — loading, empty, error, disabled, validation, interaction, edge cases, permission, responsive, retry, destructive and business-specific states. Asks the user which presentation pattern the team uses for each state family (skeleton vs spinner, toast vs alert dialog, text clamp lines and tooltip vs expand, empty-state illustration and CTA…), produces a Missing State Checklist, then delivers the states either as editable Figma frames (Mode A) or as a State Explorer toggle inside a web prototype (Mode B). Use when the user asks to "fill in missing states", "add loading/empty/error states", "what states am I missing", "state coverage", "edge cases for this screen", "UI states for RD handoff", "state explorer", or shares a Figma frame or web page and wants non-happy-path states designed or implemented.
---

# UI State Explorer

Designs usually show only the happy path. This skill analyses an existing UI, finds the states the design guideline does not yet cover, and produces them in the format the team will hand off: **Figma frames** or a **web prototype with a State Explorer**.

The analysis is shared; only the output step differs. Never hard-code anything about a specific product into the analysis — every state must be derived from what is observed in the source UI.

## Workflow at a glance

1. **Pick the mode** (Step 1) — Figma output or Web output.
2. **Inventory the source UI** (Step 2) — screens, regions, components, interactions, data.
3. **Run the state analysis** (Step 3) — walk the taxonomy, keep only states that apply.
4. **Ask how each state should look** (Step 4) — skeleton or spinner, toast or alert, how many lines before truncating… Always ask; never guess the team's patterns.
5. **Write the Missing State Checklist** (Step 5) — with the pattern decisions applied.
6. **Build the states** (Step 6) — Mode A: `references/figma-workflow.md`. Mode B: `references/web-workflow.md`.
7. **Verify and report** (Step 7).

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
- **Design system**: tokens/variables, text styles, spacing scale, existing feedback components (toast, banner, skeleton, spinner, empty-state illustration, inline error), and state tokens (disabled, hover, error…). Read the team's Design System Map first if one exists (`references/design-system-map.md`); otherwise search by role and synonyms, and read each candidate's variant properties (`references/pattern-questions.md` → "Find the guideline's pattern").

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

## Step 4 — Ask the presentation-pattern questions

The analysis says *which* states are missing; it cannot say *how* this team presents them. The same state has several common treatments — loading can be a skeleton, a spinner, a progress bar or a streaming result; an error can be a toast, an inline banner or a modal alert; long text can be clamped to 1–3 lines and revealed by a hover tooltip, an expand arrow or a "Read more" link; an empty state can have an illustration and/or a CTA to the next step. These are team decisions. **Always ask before building** — this step is not optional, even when the checklist is short.

**First gather what is already known**, and show it in the questions:
- the **decision log** in the team's Design System Map (`references/design-system-map.md`);
- the **Pattern decisions** of other pages' `ui-states-checklist.md` in the same project;
- how **this page is built today** (Mode B, or a Figma frame that already draws the state).

None of these replaces the question, except a `Product`-scope `Decided` row, which is applied without asking and listed in one line before the questions ("Using earlier decisions: …") so the user can overrule it. The as-built UI is never an answer on its own: code that already exists is the recommended option, not the decision. Label every option with where it comes from — `(Decided — <page>, <date>)`, `(Built today on this page)`, `(Found in <library>)` — and when two sources disagree, show both and ask which wins.

Follow `references/pattern-questions.md`:
- Group the kept states into pattern families (F1–F20) and ask one question per family that is actually triggered — never one per state, never about families with no states.
- Offer the common options for each family, not yes/no. Put the pattern found in the guideline first as `(Recommended — found in …)`; otherwise mark the most common practice as recommended.
- Ask text-length questions per text role (title, description, filename, button label): max lines **and** how the rest is revealed.
- Use the `AskUserQuestion` tool when available (≤ 4 questions per call, P0 families first, ≤ 3 rounds); otherwise send one numbered message the user can answer in shorthand.
- Ask in the user's language, using names from their screen.
- Offer "use the recommended defaults for the rest"; record those as `default (unconfirmed)`.
- For every chosen pattern with no component or token found, ask in the same round whether one exists (link) or it should be created as `NEW`. Never create `NEW` without that answer.

After the answers, propose the new log rows (family, decision, scope `Product` or `Page`) and append them to the map once the user confirms; offer to create the map if there is none.

Pattern questions do not replace product-rule questions (limits, plan names, copy) — those stay as `Needs confirmation` placeholders and can be asked in the same round if they are P0.

## Step 5 — Missing State Checklist

Write the checklist using `references/checklist-format.md` (Markdown table + optional JSON), including the **Pattern decisions** section from Step 4. Every state's Expected UI follows the decided pattern, and a family uses the same pattern across the whole screen. Save it as `ui-states-checklist.md` beside the deliverable (web project root, or alongside the Figma work in the session folder), and also place it in Figma for Mode A.

Show the checklist to the user before building when there are still open P0 questions or more than ~15 states; otherwise build directly and present it with the result.

## Step 6 — Build

- Mode A → `references/figma-workflow.md`
- Mode B → `references/web-workflow.md`

## Shared design principles (both modes)

- **Do not redesign.** Keep layout, typography, color, spacing, radius, iconography and component structure. A state changes only what the state requires.
- **Guideline first.** Use existing components, variants, variables/tokens and patterns. States switch the component's own state variant or bind state tokens — never raw opacity or colours when a token exists. A disabled group/region follows the team's group rule (e.g. whole region at a fixed opacity). Create something new only when the user confirmed nothing fits, and label it `NEW — needs design review`.
- **Stay team-neutral.** This skill carries no team's components. Team-specific choices live in that team's Design System Map, not in the skill.
- **Fill gaps only.** States already covered by the guideline are listed as "Covered" and not rebuilt.
- **Happy path is untouched.** The original frame/page and its behavior must be identical after the work. In Figma never edit the source frame; in web the explorer-off experience must behave exactly as before.
- **No unconfirmed product decisions.** Placeholders + confirmation flags instead.
- **No guessed patterns.** How a state is presented (skeleton vs spinner, toast vs alert, clamp lines, empty-state CTA) comes from the user's answers in Step 4, not from habit.
- **Review- and dev-ready.** Every state is named by ID, grouped by category, and carries its trigger so designers can review and RD can inspect.
- **Accessible states.** Error/validation messages are associated with their fields, disabled controls keep readable contrast, focus states are visible, loading states announce progress (`aria-busy` / live region in web; annotated in Figma).

## Step 7 — Verify and report

Before reporting, check:
- [ ] Every checklist item is built, or marked "Not built" with a reason.
- [ ] Source happy path unchanged (Figma: source frame untouched; web: explorer off = original behavior, no console errors).
- [ ] Step 4 ran before anything was built, and its answers are in the decision log (or the user declined).
- [ ] Every state uses the pattern decided in Step 4 (no silent fallback to a different existing component).
- [ ] Only existing tokens/components used, or `NEW` items flagged and confirmed by the user.
- [ ] Audit of changed nodes: no raw opacity/colour where a state variant or token exists; list every remaining raw value and `NEW` item in the report.
- [ ] Names follow the convention of the mode.
- [ ] Mode B: explorer cannot load in production (see isolation rules).

If no Design System Map existed, offer to write one from this run's findings and answers (`references/design-system-map.md`), saved where the team will find it next time.

Report to the user: mode chosen and why, the pattern decisions (and which were unconfirmed defaults), counts by category and priority, where the output is (Figma link / file paths), the open PM/RD questions, and anything not built.

## Reference files

- `references/state-taxonomy.md` — detection questions and typical expected UI per category.
- `references/pattern-questions.md` — pattern families, common options, how to find the guideline's pattern and how to ask (Step 4).
- `references/design-system-map.md` — team-owned map of patterns → components and states → tokens; where to find it and its format.
- `references/checklist-format.md` — checklist template, priority definitions, JSON schema.
- `references/figma-workflow.md` — Mode A step by step (Figma MCP).
- `references/web-workflow.md` — Mode B step by step.
- `assets/state-explorer/state-explorer.js` — drop-in, framework-agnostic State Explorer panel (Mode B).
- `assets/state-explorer/states.example.js` — template for a project's state registry.
