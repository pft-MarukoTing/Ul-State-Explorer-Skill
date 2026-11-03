# Presentation Pattern Questions

The taxonomy decides **which** states are missing. This file decides **how each state looks** — and that is a team decision, not something to guess. The same "loading" can be a skeleton, a spinner or a progress bar; the same "error" can be a toast, an inline banner or a modal alert. Pick the wrong one and every built state has to be redone.

So before building (SKILL.md Step 4), ask the user which pattern their team uses for every pattern family that the kept states touch.

---

## Find the guideline's pattern (before asking)

Recommendations are only as good as this search. Most "NEW" components in past runs already existed under another name.

1. **Map first.** If a Design System Map exists (`design-system-map.md`), use it and skip the search for anything it covers.
2. **Search by role, with synonyms, one query each.** A component's name rarely matches the pattern's name:

   | Pattern | Also search |
   |---------|-------------|
   | Toast | snackbar, alert, message, notification, notice |
   | Inline alert / banner | alert, banner, callout, notice, message |
   | Modal | dialog, popup, sheet |
   | Tooltip | popover, hint, bubble |
   | Spinner | loader, loading, progress circle |
   | Skeleton | placeholder, shimmer, loading card |
   | Progress bar | progress, meter, linear progress |
   | Empty state | empty, no data, zero state, placeholder illustration |
   | Badge | tag, chip, label, pill |

3. **Read the candidates' properties, not just names.** Open each component set's variant and boolean properties: `Tone=Error`, `Tone=Inverse neutral`, `Size=Small`, `Dismissible`, `State=Disabled`. These decide whether a component can serve the pattern (an `Alert` with a small inverse tone *is* a toast). Read the whole set, not only the variant already placed in the screen — "the screen uses Tone=Warning" does not mean "there is no Error tone".
4. **States use variants, then tokens — never raw values.** For disabled / hover / pressed / error / selected:
   1. switch the component's own `State` (or equivalent) variant;
   2. if the component has none, bind the library's state tokens (search the state word: `disabled`, `hover`, `press`, `error`, `selected`, `overlay` → e.g. fill, text, icon and stroke "Disabled" tokens);
   3. only if neither exists: raw opacity/colour, marked `NEW` and asked about (rule 5).

   A **whole group or region** being disabled (a row of controls, a panel section) is different from one component's state: many teams dim the entire region with a fixed opacity. Use the team's group rule from the map; if there is none, ask ("Disable the whole <region> by dimming it? At what opacity, or another treatment?") instead of picking a number.
5. **Not found = ask, never build silently.** Every pattern the user picks that has no component or token found becomes a question in the same round: "I couldn't find a Toast in <library>. Is there one (link), or should I create one as NEW?" Build `NEW` only after the user confirms there is none.
6. **Library scope.** Count only libraries the source already uses (or the map lists). A match in another product's library is not this team's guideline.

## How to ask

1. **Only ask about families the checklist actually triggers.** No LOAD states → no loading questions. One question per *family*, not per state (one answer covers LOAD-01…LOAD-04 if they are the same kind).
2. **Lead with evidence.** If the search above found a pattern in the guideline (a `Skeleton` component, a `Toast` in the library, an existing 2-line clamp on cards), make it option 1, label it `(Recommended — found in <where>)`. Still ask: the user may know it is deprecated or wrong for this case. If nothing was found, mark the most common practice for this kind of product as Recommended.
3. **List the common options, never a yes/no.** Use the option lists below. Pick the 3–4 most plausible for this UI; the user can always type "Other". In a text fallback, list all relevant options.
4. **Allow multi-select where patterns combine** (empty state = illustration **+** CTA; error = toast **+** inline field error).
5. **Ask in rounds, P0 families first.** With the `AskUserQuestion` tool: ≤ 4 questions per call, ≤ 4 options each, ≤ 3 rounds. Without it: one numbered message, grouped by family, each option lettered, so the user can answer `1b, 2a+c, 3 default`.
6. **Ask in the user's language** and use concrete examples from *their* screen ("Result area while generating", not "loading region").
7. **Always offer an escape hatch**: "Use the recommended defaults for the rest". Defaults chosen this way are recorded as `default (unconfirmed)` in the checklist so review can catch them.
8. **Never re-ask** a decision already answered in this conversation, in the user's request, or as a `Product`-scope `Decided` row in the decision log — apply it and list it in one line so the user can overrule it. A `Page`-scope row from another page, another page's checklist, or the as-built UI is a labelled option, not an answer: `(Decided — auto-edit, 2026-11-02)`, `(Built today on this page)`. When they disagree, show both.
9. **Evidence comes only from libraries the source uses.** A design-system search may return components from other products' libraries. Count something as "found in the guideline" only if it is in a library already used by the source frame/page (read from its instances); otherwise the pattern is `NEW`.
10. **Resolve multi-select answers.** If the user picks several options for a family that covers different states (e.g. errors: toast + inline alert + failed card), follow up in the next round with one question per state type — "Generate request failed → which?", "Import failed → which?" — so every state maps to exactly one pattern.
11. **Check decisions against each other before building.** Some answers interact: "after Generate, jump to History" + "request failed → toast, stay on page" raises *when* the jump happens. Mutually exclusive answers (disabled-with-reason vs click-then-validate) remove states from the checklist. Ask about real conflicts in the last round; list the rest under Open questions.
12. **Answers can settle earlier open questions** (disable vs validate, confirm vs undo). Remove them from Open questions and drop or merge the states they make obsolete.

Text fallback example:

```
Before I build the 14 states, a few pattern choices for this screen:

1. Result area while generating (LOAD-01, LOAD-02)
   a) Skeleton of the result card  ← recommended, Skeleton exists in the library
   (Decided — Search page, 2026-10-12: skeleton; Built today on this page: spinner)
   b) Centered spinner
   c) Progress bar with % + Cancel
   d) Blurred placeholder that sharpens as it streams in

2. Generate failed (ERR-01, ERR-03) — where does the error appear?
   a) Toast, auto-dismiss   b) Inline banner in the result area + Retry  ← recommended
   c) Modal alert dialog    d) Text under the button

3. Prompt title / description length — how many lines before truncating, and how to reveal the rest?
   Title: a) 1 line  b) 2 lines  ← recommended (cards already clamp to 2)  c) no limit, wrap
   Overflow: a) "…" + tooltip on hover  b) "…" + expand arrow (Show more)  c) "Read more" → detail/modal  d) fade-out mask

Reply like "1a, 2b, 3 b+b" — or "use recommended for the rest".
```

---

## Pattern families and options

Each family: when to ask · the question · common options · follow-ups (ask only if the chosen option needs them).

### F1. Initial / page load — `LOAD`
**Ask when:** a page or region fetches data on entry.
**Question:** "While <region> loads for the first time, what should the user see?"
- Skeleton matching the real layout (shimmer / static)
- Centered spinner (region or full page)
- Top progress bar (thin, page-level) + content appears when ready
- Blank then fade in (only for very fast loads < ~300 ms)
- Branded / logo splash (app start only)

**Follow-ups:** skeleton shimmer animation or static? Minimum display time to avoid flicker? Delay before showing spinner (e.g. only after 300 ms)?

### F2. Refresh / reload of existing content — `LOAD`
**Ask when:** filters, pagination, pull-to-refresh, re-fetch after an action.
- Keep old content, small spinner in header/corner
- Keep old content dimmed + overlay spinner
- Replace with skeleton
- Infinite scroll: spinner row at bottom / "Load more" button

### F3. Action in progress (button) — `LOAD`
**Ask when:** a primary action waits on the server (save, submit, generate, pay).
- Spinner inside the button, button disabled, label kept
- Label changes ("Generating…"), button disabled
- Button disabled + whole form / panel locked
- Optimistic UI: show result immediately, roll back on failure

### F4. Long task (> ~3 s) — `LOAD`
**Ask when:** generate, upload, export, render, analyse, AI processing.
- Determinate progress bar with %
- Indeterminate bar + step text ("Uploading → Analysing → Rendering")
- Estimated time remaining / queue position
- Streaming / progressive result (text streams in, image sharpens)
- Runs in background: user can leave, notified (toast / badge / email) when done

**Follow-ups:** cancel allowed? What happens to partial output on cancel? Does backend provide % (→ RD)?

### F5. Action / request error — `ERR`
**Ask when:** any server call or user action can fail.
- Toast / snackbar (auto-dismiss)
- Toast that persists until dismissed, with Retry
- Inline banner / alert in the affected region, with Retry
- Modal alert dialog (blocking, needs OK)
- Inline text under the button / control
- Full-page error with illustration + Retry (page-load failure only)

**Follow-ups:** toast position (top-center / top-right / bottom-center / bottom-left)? Auto-dismiss duration? Stack multiple toasts or replace? Show error code / "details" for support? Distinguish error types (offline vs timeout vs server) or one generic message?

### F6. Offline / connection — `ERR`
**Ask when:** the product depends on network after load.
- Persistent top/bottom banner until reconnected
- Toast on disconnect + toast on reconnect
- Full-page offline screen
- Disable network actions with tooltip "You're offline"

### F7. Form validation — `VAL`
**Ask when:** any input, select, upload, multi-field rule.
**Question A — timing:**
- On blur (leaving the field)
- On submit only
- Live while typing
- On submit first, then live after the first attempt (common hybrid)

**Question B — display:**
- Red border + message under the field
- Message in a tooltip / popover on the field
- Form-level summary at top (+ field highlight) — long forms
- Toast only (generally discouraged; ask anyway if the product does it)

**Question C — submit button:**
- Disabled until form is valid
- Always enabled; validate on click and scroll/focus to first error

**Follow-ups:** character counter shown (always / near limit / never)? Success check on valid fields?

### F8. Upload / file rejection — `VAL` `ERR`
**Ask when:** an uploader / dropzone exists.
- Inline error inside the dropzone, file not added
- File added to the list with an error badge + Remove/Replace
- Toast
- Modal dialog listing rejected files

**Follow-ups:** auto-compress/resize oversized images instead of rejecting? Upload progress per file or overall?

### F9. Empty state — `EMP`
**Ask when:** any list, grid, history, result area, search result can be empty. Ask separately for **first-use empty** and **no results** if both exist.
**Question A — visual (multi-select):**
- Illustration
- Icon only
- Text only
- Sample / demo content or templates instead of empty

**Question B — guidance (multi-select):**
- Primary CTA button to the next step ("Upload your first photo")
- Secondary text link
- Short tips / onboarding steps
- No-results only: "Clear filters" / search suggestions
- None

**Follow-ups:** illustration exists in the library or is NEW? Copy owner (PM / UX writer)?

### F10. Text length / overflow — `EDGE` `RESP`
**Ask when:** any user- or server-provided text: titles, descriptions, names, filenames, labels in buttons/chips/tabs, table cells. Ask **per text role**, not once for everything.
**Question A — max lines** (per role, e.g. title / description / card subtitle):
- 1 line
- 2 lines
- 3 lines
- No clamp, wrap fully (container grows)
- Character limit at input time instead (→ also a VAL state)

**Question B — how the rest is revealed:**
- Ellipsis "…" + full text in tooltip on hover (desktop; needs a tap alternative on touch)
- Ellipsis + expand arrow / "Show more" toggle inline
- "Read more" link → detail page or modal
- Fade-out gradient mask (+ optional expand)
- Not revealed (truncate only)
- Horizontal scroll (tables, code)
- Shrink font to fit (rare; short labels only)

**Follow-ups:** filenames — truncate in the middle to keep the extension (`very-long-na…me.png`)? Buttons/tabs — truncate, wrap to 2 lines, or move to "More" menu? Mixed scripts (CJK vs Latin) — line-based or character-based limit?

### F11. Numbers and counts — `EDGE`
**Ask when:** counters, badges, prices, quotas, stats.
- Abbreviate (1.2K, 3.4M)
- Full with separators (1,234,567)
- Cap badge (99+ / 999+)
- Zero: show "0" / hide the badge / show "—"

**Follow-ups:** decimals and currency format, locale-specific formatting.

### F12. Missing / broken media — `EDGE`
**Ask when:** images, avatars, thumbnails, video.
- Neutral placeholder block + icon
- Avatar: initials on colored background / generic silhouette
- Brand pattern / logo placeholder
- Hide the media slot and reflow
- Broken: retry icon on the thumbnail

### F13. Disabled with a reason — `DIS`
**Ask when:** a control is unavailable until a prerequisite is met, or by context.
- Disabled + tooltip on hover explaining why
- Disabled + helper text always visible below
- Hidden entirely
- Looks enabled; clicking explains (toast / inline message / dialog) — better for discoverability

### F14. Success feedback — `DEF`
**Ask when:** save, send, copy, generate, upload completes.
- Toast / snackbar
- Inline check / "Saved" text near the control, fades out
- Button transient state ("Copied ✓" for 2 s)
- Navigate to the result / next page
- Modal / celebration (milestones only)
- No explicit feedback (result itself is the feedback)

### F15. Destructive actions — `DEST`
**Ask when:** delete, remove, reset, discard, overwrite.
- Confirmation dialog (destructive button style)
- Confirmation dialog requiring typing the name (high-risk, irreversible)
- No confirm; undo toast for N seconds
- Inline confirm (button turns into "Confirm delete?")

**Follow-ups:** soft delete with trash/restore (→ PM/RD)?

### F16. Unsaved changes / leaving — `DEST`
**Ask when:** editable forms, editors, long inputs.
- Custom confirm dialog ("Discard changes?")
- Browser native leave prompt
- Autosave (+ "Saved" indicator) so no warning needed
- Keep draft and restore on return

### F17. Permission / plan / quota — `PERM`
**Ask when:** plans, credits, roles, premium badges, sign-in gates.
- Lock / Pro badge on the control; click opens upsell modal
- Disabled + tooltip "Available on [Plan]"
- Hidden for users without access
- Inline banner in the region with upgrade CTA
- Redirect to pricing / sign-in page

**Follow-ups:** quota exhausted — block before action or fail after click? Show remaining count always / only when low?

### F18. Partial success / batch — `PART`
**Ask when:** multi-upload, bulk actions, batch generate.
- Per-item status icons + per-item Retry
- Summary banner ("8 of 10 done · Retry 2 failed")
- Toast summary
- Separate "Failed" tab / filter

### F19. Selection and hover (only if not in component variants) — `INT`
**Ask when:** cards, rows, thumbnails without defined hover/selected variants.
- Hover: lift (shadow) / border highlight / background tint / overlay with quick actions
- Selected: check badge in corner / thick brand border / filled background
- Multi-select: checkbox always visible / appears on hover / long-press on touch + bulk action bar

### F20. Responsive overflow — `RESP`
**Ask when:** the product targets narrow viewports and has wide regions.
- Tables: horizontal scroll / stack into cards / hide low-priority columns
- Toolbars / tabs: overflow "More" menu / horizontal scroll / wrap
- Side panels: collapse to drawer / bottom sheet / stacked below

---

## Recording the answers

Add a **Pattern decisions** section to `ui-states-checklist.md` (see `checklist-format.md`). Every state's *Expected UI* must follow the decided pattern, and the same family uses the same pattern across the whole screen. If a chosen pattern has no component in the guideline, build it as `NEW — needs design review` (do not silently fall back to a different pattern that does exist).
