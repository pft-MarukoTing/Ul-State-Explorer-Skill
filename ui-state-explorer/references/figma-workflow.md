# Mode A — Figma Output

Deliverable: editable Figma frames, one per missing state, built from the original design's own components, variables and auto layout, organised so RD can Inspect them. A web prototype is never the deliverable in this mode.

## Prerequisites

- A Figma MCP server with read and write tools (`get_metadata`, `get_screenshot`, `get_design_context`, `get_variable_defs`, `search_design_system`, `use_figma`, `create_session`). If the server needs authorisation, tell the user and stop — do not fall back to building a web page.
- Load the `figma-use` skill **before every `use_figma` call** (and `figma-generate-design` if many frames must be composed). Follow its rules over anything here when they conflict.
- From the URL extract `fileKey` and `node-id` (`node-id=12-345` → `12:345`). Call `create_session` with the file key first and reuse the session id.

## A1. Read (inventory)

1. `get_metadata` on the frame — layer tree, names, types, sizes. Note component instances and their main components.
2. `get_screenshot` on the frame — visual reference for review later.
3. `get_design_context` on the frame (and on complex sub-regions if the result is truncated) — structure, styles, text.
4. `get_variable_defs` — color/spacing/radius/typography variables in use. Every new fill/stroke/spacing must bind to these.
5. Discover existing state coverage:
   - With `use_figma` (read-only script): for each instance, read `mainComponent.parent` — if it is a component set, list its `variantGroupProperties` (e.g. `State: Default | Hover | Disabled | Loading | Error`). Existing variants = states already covered at component level, and they are what you switch to.
   - Search the page/file for frames that already depict states of this screen (names containing loading/empty/error/…); `search_design_system` (restricted with `includeLibraryKeys` to the libraries the source uses) for feedback components by role and synonyms (`pattern-questions.md` → "Find the guideline's pattern"), and for state tokens (`disabled`, `hover`, `press`, `error`, `overlay`).
   - For every candidate component set, import it and read `componentPropertyDefinitions` (all variant options, booleans). Do the same for the component sets of instances already in the screen — e.g. a Button set with `State=Disabled`. Record what exists; "the frame shows Tone=Warning" says nothing about which tones the set has.
6. Also read each container instance's `componentProperties`: BOOLEAN props (e.g. "Show Alert", "Show usage") and VARIANT props on large containers (a canvas/panel with `Empty`/`Upload`/`History` variants) often already hold state patterns. Preview them by cloning the source frame off-canvas, switching the property, taking `node.screenshot()`, then removing the clone (also remove clones if the script errors). Anything found there is **Covered** — reuse it instead of redrawing.
7. Hidden layers inside the source frame may be leftovers from other screens. Do not treat them as this screen's guideline unless their content clearly belongs to it; mention them in the checklist notes.
8. Fill the inventory from SKILL.md Step 2.

## A2. Analyse and write the checklist

Run SKILL.md Steps 3–5 (analysis, pattern questions, checklist). If a chosen pattern (e.g. skeleton) has no component in the file or library, build it in A4 step 6 as `NEW` rather than swapping in a different existing pattern. Save `ui-states-checklist.md` locally and keep it for the Figma checklist frame (A5).

## A3. Plan the canvas

Never modify the source frame. Build next to it:

```
Section: "UI States — <Source frame name>"   (placed to the right of the source frame, 200px gap)
├── Frame: "00 Checklist"                    (checklist table + legend + open questions)
├── Row per category (auto layout horizontal, 80px gap), label text above each row:
│   ├── "LOAD-01 · Result — generating"
│   ├── "LOAD-02 · Page — initial load"
│   └── …
├── Row: Error …
└── …
```

Practical structure that works well: inside the Section, one vertical auto-layout "States board"; first child `00 Checklist`; then one row per category (label + horizontal list). Each state is a vertical auto-layout card = annotation box (outside the UI) + the cloned state frame. Order cards P0 first.

Frame naming: `<ID> · <State name>` — e.g. `ERR-01 · Generate failed`. The ID prefix makes frames sortable and maps 1:1 to the checklist. Use the same frame size as the source unless the state is component-scope (then a smaller frame containing only the affected region is acceptable, named the same way, and noted as "component-scope" in its annotation).

Order rows by category order in the taxonomy; within a row, P0 first.

## A4. Build each state

**Re-running after new pattern answers:** clone the previous states section, keep cards whose pattern did not change (prefix their annotation with the decision), and rebuild only the changed ones from a fresh source clone. Keep the previous section for comparison.

Work in small `use_figma` batches (a few states per call), returning created node ids so you can verify and continue. For each state:

1. **Clone** the source frame: `const f = source.clone()`; append into the section row; rename. Cloning keeps the exact layout, auto layout, instances and variable bindings.
2. **Change only the delta**, in this order of preference:
   1. **Switch variant** on existing instances: `instance.setProperties({ State: 'Disabled' })` (use the exact property names read in A1). If the component has no state variant, override its fills/text/icons with the library's state tokens (e.g. the "Disabled" fill/text/icon tokens). Never use layer opacity for a single component's state when tokens exist; a whole group/region being disabled follows the team's group rule (map or Step 4 answer), which may be opacity.
   2. **Swap instance** to another existing component (e.g. result card → existing empty-state component, button → loading button): `instance.swapComponent(component)`.
   3. **Insert existing components** imported from the library (`figma.importComponentByKeyAsync(key)` for library components; local components via their node): toast, banner, inline error, dialog, skeleton.
   4. **Edit text content** for copy (load fonts first: `await figma.loadFontAsync(textNode.fontName)`). Use placeholder copy in `{curly}` or `[brackets]` for unconfirmed rules.
   5. **Toggle visibility** of layers already present (helper text, error text, badges) rather than drawing new ones.
   6. **Only if nothing exists**: build from primitives inside auto layout, bind every fill/stroke/radius/spacing to existing variables (`node.setBoundVariable(...)`, `figma.variables.setBoundVariableForPaint(...)`), use existing text styles (`textStyleId`). Prefix the layer name with `NEW · ` and list it under "New patterns" in the checklist.
3. **Overlays** (dialog, toast, dropdown): add a scrim rectangle using an existing overlay color variable if one exists, then the dialog/toast instance, positioned per the guideline (or centered/bottom as the existing components imply).
4. **Keep auto layout intact**: insert children with `insertChild` in the correct parent; set `layoutSizingHorizontal/Vertical` to match siblings; never detach instances unless unavoidable (if detached, note it in the annotation).
   - Children cannot be appended inside an instance. Prefer overrides that need no insertion (variant, boolean prop, instance swap of a nested icon, text, visibility). When new content must be inserted (helper text, inline error), detach only the nearest region instance **in the state frame** (`instance.detachInstance()`); nested instances stay linked. Name it `<name> (detached for state)` and say so in the annotation.
   - For overlays on top of an instance (thumbnail uploading/failed, scrims), add a frame as a direct child of the state frame, positioned from `absoluteBoundingBox` deltas, rather than modifying the instance.
   - In freshly cloned frames, locate nodes by walking `children` by name from the clone root; deep `findOne`/`findAllWithCriteria` on a new clone can miss nested instance children.
   - New text inside product UI clones an existing text node of the right role (keeps font/style), then binds its fill to a semantic text variable.
   - For a NEW component (e.g. a Toast chosen in Step 4 that the library lacks), take colors from tokens already used by a similar surface in the source (a dark pill → the token of the active tab), not from token names — "Inverse" can resolve to white. Check the screenshot.
5. **Annotate** for review and RD inspect:
   - Preferred: Dev Mode annotation on the frame (`frame.annotations = [{ label: 'Trigger: …\nExpected: …\nPriority: P0\nConfirm: PM — …' }]`) when the API is available.
   - Fallback / additionally: a small text block above the frame (not inside it) with ID, trigger, priority, confirmation flag. Keep annotation layers outside the state frame so Inspect shows only real UI.
   - Mark changed layers with a clear layer name suffix (`… (state)`) only if the file has no naming convention against it.

## A5. Checklist frame

Create `00 Checklist` at the start of the section: a table built with auto layout rows (text styles from the file) containing ID, category, state name, trigger, priority, confirm, status. Add the "Open questions" and "New patterns" lists. If the file has a table component, use it.

## A6. Verify

- `get_screenshot` each built frame (or the whole section at lower scale) and compare with the source screenshot: layout, spacing and typography unchanged outside the delta.
- `get_metadata` on the source frame again — confirm it is unchanged (same child count / names).
- Audit in a read-only `use_figma` script over every state frame: nodes with `opacity < 1` that the source does not have (except regions dimmed by the team's group-disabled rule), fills/strokes without `boundVariables`, and local components created in this run. Each must be either fixed (variant/token) or listed as `NEW` that the user confirmed.
- Fix issues, then report: Figma link to the section (`https://www.figma.com/design/<fileKey>/?node-id=<sectionId>`), counts, open questions, new patterns, anything not built.

## Web input → Figma output

If the source is a web page and delivery is Figma: analyse the web UI per `web-workflow.md` "Read", then get it into Figma as the base (if the user has not already) using the Figma MCP's capture/import capability (`figma-generate-design` / `figma-code-workflows` skills), confirm the target file with the user, and continue from A1 on the imported frame.
