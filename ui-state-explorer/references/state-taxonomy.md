# State Taxonomy

Walk each category against the inventory from Step 2. A state is kept only when a **specific element** in the source UI triggers it — name that element in the state's Scope. Skip categories that have no trigger.

Each category lists: code (used in state IDs), detection questions, typical expected UI, and common confirmation questions.

---

## 1. Default / Success — `DEF`
**Detect:** Is the provided design the steady default only, or does an action complete with a visible result? Is there a "just succeeded" moment (saved, sent, generated, uploaded, copied)?
**Typical UI:** success toast/banner, inline check, updated result with "Done" affordance, next-step CTA.
**Notes:** The original happy path is `DEF-00` and is never modified. Only add success *feedback* states that are missing.
**Confirm:** success copy, auto-dismiss timing, where the user lands next.

## 2. Empty / No Data — `EMP`
**Detect:** Every list, table, grid, gallery, history, result area, search result, notification panel, counter. Can it be empty on first use? After filtering/searching? After the user deletes everything?
**Distinguish:** first-use empty (educate + primary CTA) vs. no-results (suggest clearing filters) vs. cleared (confirm + undo where relevant).
**Typical UI:** existing empty-state pattern; otherwise the region's own container with icon + one-line message + one CTA using existing button.
**Confirm:** empty-state copy and illustration, whether sample/demo content should show instead.

## 3. Loading / Processing — `LOAD`
**Detect:** Any data fetched on entry; any action that waits on a server or heavy processing (generate, upload, export, analyse, pay, save). Long tasks (> ~3 s) need progress; very long tasks need cancel/background.
**Typical UI:** initial page load → skeleton matching the real layout; region refresh → inline spinner keeping content; action in progress → button loading state + disabled re-submit; long task → progress (determinate if % known) + cancel.
**Confirm:** whether progress % is available from backend, whether task can be cancelled or continues in background, expected durations.

## 4. Error / Failed / Timeout — `ERR`
**Detect:** Every server call and every user action that can fail. Separate: network offline, timeout, server error (5xx), not found / deleted resource, unsupported input (file type, size, format), third-party failure, rate limit.
**Typical UI:** page-level failure (load failed) → region error with retry; action failure → inline/toast error, inputs preserved; field-specific → see Validation; offline → banner.
**Rule:** never lose user input on error. Retry should be offered where safe.
**Confirm:** error copy, which errors are distinguishable by backend, whether retry is idempotent.

## 5. Disabled / Unavailable — `DIS`
**Detect:** Primary actions that require prerequisites (input filled, file selected, option chosen, terms accepted); features unavailable by context (offline, region, device, maintenance, feature flag, quota used up).
**Typical UI:** existing disabled variant; reason surfaced via helper text or tooltip — a disabled control should explain why when the reason is not obvious.
**Confirm:** prerequisites for enabling, whether to disable vs. allow click and explain.

## 6. Validation — `VAL`
**Detect:** Every input, select, upload, date, number, password, URL, email, and any multi-field rule (e.g. end date after start date).
**States per field as relevant:** required-missing, invalid format, out of range (min/max/length), unsupported file type/size/dimension, server-side rejection (duplicate, taken), valid/confirmed.
**Typical UI:** existing field error variant + helper text under the field; form-level summary only if the form is long; submit stays available or disabled per guideline.
**Confirm:** exact limits (length, size, types), validation timing (on blur / on submit / live).

## 7. Hover / Focus / Active / Selected — `INT`
**Detect:** Interactive components whose variants for these states are missing in the source (check component variants first — if the design system already defines them, mark Covered). Selectable items (cards, list rows, tabs, chips, thumbnails), multi-select, drag targets.
**Typical UI:** existing variant; otherwise token-based hover fill, visible focus ring, pressed state, selected indicator; multi-select bar with count.
**Confirm:** usually none; flag only new patterns.

## 8. Boundary / Edge Cases — `EDGE`
**Detect:** Every data value. Extremes: 0, 1, many (e.g. 999+), very long text, very short text, missing optional field, missing image/avatar, broken media, special characters / emoji / RTL, large numbers / currency / decimals, timezones, dates far past/future, max items reached.
**Typical UI:** truncation with tooltip, line clamp, number abbreviation, image placeholder, singular/plural copy, max-reached message.
**Confirm:** truncation rules, number formatting, max counts.

## 9. Permission / Subscription — `PERM`
**Detect:** Signs of accounts, roles, plans, credits, quotas, premium badges, locked icons, "Pro" labels, usage counters, sharing/ownership, sign-in.
**States:** signed-out, insufficient role (view-only), feature locked by plan, quota/credit exhausted, trial expiring/expired, access revoked.
**Typical UI:** locked badge on the control, upsell or request-access prompt using existing dialog/banner, view-only variant with editing controls hidden or disabled.
**Confirm:** always PM — plan names, which features are gated, upgrade destination, quota numbers. Use placeholders.

## 10. Responsive / Overflow — `RESP`
**Detect:** Target breakpoints in the source (frame width, CSS breakpoints). Regions that can overflow: toolbars, tab bars, button groups, tables, long titles, chip lists, side panels.
**States:** narrow/mobile layout of the screen (only if the product targets it), content overflow (scroll, wrap, "More" menu), extreme zoom/large text.
**Typical UI:** reuse existing responsive patterns; do not invent a new mobile layout if the product has no mobile guideline — flag instead.
**Confirm:** supported breakpoints, whether mobile is in scope.

## 11. Partial Success / Retry — `PART`
**Detect:** Batch actions (multi-upload, bulk edit, batch generate, multi-recipient send), multi-step processes, results composed of several independent parts.
**States:** some items succeeded and some failed, per-item retry, retry all failed, resumed after interruption.
**Typical UI:** per-item status (success / failed / pending) in existing list rows, summary line "8 of 10 done", retry actions.
**Confirm:** whether partial results are saved, retry limits.

## 12. Destructive / Recovery — `DEST`
**Detect:** Delete, remove, reset, discard, overwrite, clear, leave-with-unsaved-changes, cancel long task, sign out of unsaved work.
**States:** confirmation dialog, undo toast after action, unsaved-changes warning, restored state after undo, irreversible warning.
**Typical UI:** existing dialog component with destructive button variant; undo toast.
**Confirm:** whether undo is supported (soft delete) vs. confirm-only.

## 13. Business-specific — `BIZ`
**Detect:** Rules visible in the UI that are unique to this product: e.g. a credit cost on a button, a processing queue, a review/approval step, content-moderation, region/locale restrictions, a version or draft status, expiring links, model/engine selection. Derive only from what the source shows or what the user stated.
**Typical UI:** composed from existing components.
**Confirm:** nearly always PM. Never assume the rule — describe the state and ask.

---

## Priority guide (summary — full definitions in `checklist-format.md`)
- **P0** — user is blocked or loses data without it (load/action error, required validation, empty first use of the main area, loading of the main action, destructive confirmation).
- **P1** — common and confusing without it (disabled reasons, no-results, permission, partial success, overflow of key content).
- **P2** — polish / rare (hover detail, extreme edge values, rare errors).
