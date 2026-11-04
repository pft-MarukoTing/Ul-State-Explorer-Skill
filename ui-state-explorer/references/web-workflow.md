# Mode B — Web Output

Deliverable: the existing web project/prototype with every missing state implemented in product code, plus a **State Explorer** toggle (bottom-right) that previews each state. With the explorer closed the page behaves exactly as before. The explorer never ships to production.

## B1. Read (inventory)

1. Find the entry point and the UI code: single HTML file, or framework project (look at `package.json`, `index.html`, `src/`). Identify how UI is rendered (static DOM, vanilla render functions, React/Vue/Svelte components) and where state lives (variables, store, component state, URL).
2. Run it. Use the project's dev command if it has one; for a static file serve the folder (`python3 -m http.server`) — opening via `file://` breaks fetch. Open it in the browser and take a screenshot of the default state.
3. Exercise the happy path once (click the main action, fill the form) and note every interaction, network call and data dependency.
4. Read the team's `design-system-map.md` if the project has one. Note the styling system: CSS variables/tokens (including state tokens such as `--color-disabled`), utility classes, component library, existing feedback components (toast, spinner, skeleton, alert, dialog) and existing state classes (`:disabled`, `.is-error`, `aria-invalid` styles).
5. If a Figma design is also provided as reference, read it per `figma-workflow.md` A1 for visual intent, but implement in the web project.

6. Classify every state the taxonomy finds as **Implemented & reachable**, **Implemented but hard/impossible to reach** (needs many steps, real devices, failures the mocks never produce, data the fixtures don't have), or **Missing**. Mature or ported code is often mostly the second kind: then the work is reachability, not new UI.
7. The existing implementation is guideline evidence, not an answer: it becomes the `(Built today on this page)` option in the Step 4 questions, which still run before anything is built, even when every state is already implemented. If it differs from an earlier pattern decision (the decision log, a Figma run), do not change it to match — list the conflict in the checklist and ask. To help the team decide, offer to build both: the decided pattern goes behind a dev-only variant (a context or prop defaulting to the as-built design), and the state gets `variants: [{ id: 'rd', label: 'RD' }, { id: 'figma', label: 'Figma' }]` so the explorer shows a switch. Production keeps the as-built design until the team chooses.
8. Look for existing review tooling (a "Demo" / scenario / debug panel, query-string flags). Ask whether to fold it into the State Explorer so reviewers have one bottom-right entry; if removed, every option it had must become a state.
9. If generated code is guarded (write hooks, "regenerate from sources" rules), follow the repo's workflow for product changes; in a throwaway test copy, say that edits are for testing only.

Then run SKILL.md Steps 3–5 (analysis, pattern questions, checklist) and save `ui-states-checklist.md` in the project root.

## B2. Implement the states in product code

Each state is real UI that the product needs in real use (a real failed request must show the real error state). Implement them where the happy path is implemented:

- Model the state, don't paint it: add explicit status to the existing state model (`status: 'idle' | 'loading' | 'success' | 'error'`, `items: []`, `errors: { field: msg }`, `quota`, `role`…). Render from it.
- Reuse existing components, classes and tokens. New styles use existing CSS variables; never hard-code new colors if a token exists. States use the component's own state props/classes (`disabled`, `variant="error"`) before any custom style; no `opacity` hacks when a disabled token exists.
- Happy-path rendering must produce the same DOM/visual output as before for the default data. Refactor only as much as needed to add a status branch.
- Wire real triggers where they already exist (fetch failure → error state, empty response → empty state, invalid input → validation). For triggers that depend on unconfirmed rules (quota, plan), add the state behind a clearly named input (`quota.remaining`) with placeholder copy and a `// TODO(PM): …` comment referencing the checklist ID.
- Accessibility: `aria-busy` on loading regions, `role="alert"`/live region for errors and toasts, `aria-invalid` + `aria-describedby` for field errors, real `disabled` attribute (plus visible reason), visible focus.

## B3. Choose the seam for the explorer

The explorer must drive the app's own state — not overwrite DOM. Pick the least invasive seam that exists:

1. **App state setter / store** (best): expose it to the explorer in dev only, e.g.
   `if (import.meta.env.DEV) window.__APP_STATE__ = { set, reset, submit }`.
   For a reducer, expose `dispatch` and wrap the product reducer with one dev-only patch action (`{ type: '__dev', patch }`) for states no action reaches. Timers that stand in for an engine get a dev-only hold switch, so a state can stay on processing and then finish through the real completion action.
   For plain-script prototypes, attach `window.__APP_STATE__` inside the explorer-include block (see B5) or have the app expose it only when `window.StateExplorer` exists.
2. **Data layer stub**: `ctx.mockFetch()` or `ctx.stub(service, 'method', fn)` then trigger the real action. Good for loading/error/empty/partial states because the full real flow runs.
3. **Injected dependencies**: props or options the app already accepts for data and services (catalog status, metadata readers, device/runtime adapters, submit handlers). Override them through a dev-only object that is empty in production, so the props are byte-identical outside dev.
4. **The real flow with synthetic input**: dispatch files with valid headers into the real `<input type=file>`, combined with a fake metadata reader for durations/sizes, to reach import errors and limits without real media. Also feed it bad input (a non-image, an unsupported type): the real handler shows whether the error state exists at all, or fails silently.
5. **Static markup with no state model**: first refactor the region into `render(state)` with the original markup as the default output, then use seam 1.

Interaction states (hover/focus/active) can't be forced by script. Implement them in CSS, and in the explorer add a state that applies a preview class (`ctx.addClass(el, 'is-hover')`) only if the CSS defines matching `.is-hover` rules alongside `:hover`; otherwise list them as "verify manually" in the checklist.

## B4. Add the State Explorer

1. Copy `assets/state-explorer/state-explorer.js` to `<project>/state-explorer/state-explorer.js` unchanged.
2. Create `<project>/state-explorer/states.js` from `states.example.js`: one entry per built checklist item, same ID, name, trigger, expected UI, priority and confirmation text as the checklist.
3. `reset()` must restore the exact default, including side effects the app runs on its own when state changes (e.g. auto-switching to a History tab when the newest job changes) — re-apply those defaults after the app settles. Check by selecting each state and then the default: prefer the app's own reset; otherwise snapshot the initial state object when `states.js` loads and restore it. Use `location.reload()` only as a last resort.
4. Each `apply(ctx)` sets state through the seam and may use `ctx.mockFetch / ctx.stub / ctx.addClass / ctx.onCleanup` — all automatically undone when leaving the state. Never write fixtures to `localStorage`, cookies or a real backend.

Explorer behavior (provided by the runtime, don't rebuild it):
- Toggle button ("States"), bottom-right by default, keyboard shortcut Alt+Shift+S. Reviewers can drag it anywhere (mouse or touch) when it covers product UI; the position is remembered per site and "Reset position" in the panel header puts it back. The panel opens toward the middle of the screen from wherever the button sits.
- Open → menu grouped by category, filterable, with ID, name, P0/P1/P2 badge and "?" badge for states needing confirmation; selecting shows trigger, expected UI and open question.
- Selecting a state runs cleanup + `reset()` first, so states never stack.
- States with `variants` show an A/B switch in the detail area; `apply(ctx)` reads `ctx.variant`, and `<html data-ui-variant>` is set for CSS or screenshots.
- A state that renders exactly like the default (e.g. an empty section that is hidden until first use) is not its own entry — switching to it shows no change. List it in `defaultCovers: [{ id, name }]`; DEF-00's detail shows it, and the checklist marks it `Covered by default`. A state with variants is never covered this way, since one of its variants differs.
- `DEF-00` returns to the original happy path; closing the panel (×, toggle, Esc) resets and returns to normal use.
- Rendered in Shadow DOM, highest z-index; doesn't change product styles or focus order when closed.

## B5. Isolation from production

The explorer and `states.js` are dev/prototype tooling. Apply **all** that fit the project:

- **Bundled projects (Vite, Next, CRA, etc.)**: load via a dynamic import behind a build-time flag so it is tree-shaken out of production:
  ```js
  if (import.meta.env.DEV || import.meta.env.VITE_STATE_EXPLORER === 'true') {
    import('../state-explorer/state-explorer.js').then(() => import('../state-explorer/states.js'));
  }
  ```
  (`process.env.NODE_ENV !== 'production'` for webpack/Next.) The dev-only seam (`window.__APP_STATE__`) uses the same guard.
- **Plain HTML prototypes**: add one clearly delimited include block before `</body>`:
  ```html
  <!-- STATE-EXPLORER:START — prototype only, delete this block for production -->
  <script src="state-explorer/state-explorer.js"></script>
  <script src="state-explorer/states.js"></script>
  <!-- STATE-EXPLORER:END -->
  ```
  Removing the block + the `state-explorer/` folder must leave a working product page.
- **Runtime guard**: the runtime refuses to mount when `<html data-env="production">` or `window.__STATE_EXPLORER_DISABLED__ = true`; pass a `guard` option for project-specific checks.
- Product code must never import from `state-explorer/`, and must work if the folder is absent.
- States use stubs restored on cleanup — no persistent side effects.

## B6. Verify (in the browser)

1. Explorer closed: run the original happy path end to end; compare with the B1 screenshot; console has no errors.
2. Open the explorer, click through **every** state: correct UI appears, nothing from the previous state remains, no console errors. Screenshot each P0 state.
3. Return to `DEF-00` and close the panel: page identical to default and fully usable.
4. Isolation check: with `data-env="production"` on `<html>` (or a production build) the toggle doesn't appear. For bundled projects run the production build and grep the output for `StateExplorer`.
5. Update the checklist Status column, then report: run command / file paths, counts, screenshots of key states, open questions, items not built.

## Figma input → web output

Read the Figma frame for analysis and visual intent (`figma-workflow.md` A1), implement in the web project following B2–B6. Do not create Figma frames.
