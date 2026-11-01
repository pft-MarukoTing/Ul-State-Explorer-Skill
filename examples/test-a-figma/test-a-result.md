# Test A — Figma Tool Page (Mode A) Result

- Source: https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=0-6172 (frame "1366", AI Auto Edit)
- Output: Section "UI States — 1366 · AI Auto Edit" — https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=6-1158
- Checklist: `ui-states-checklist.md` (same folder) + `00 Checklist` frame in the section
- Date: 2026-10-23

## Mode decision
Figma input + Figma delivery → Mode A. No web prototype produced.

## What the skill did
1. Inventory — read the layer tree, variants and boolean props of every visible instance (all from the `[Comp]YCO_web_components_2025` library).
2. Coverage discovery — previewed container variants in throwaway clones: `canvas=Upload` (empty upload), `canvas=histories` (job in progress with %), `Show Alert` (material warning). Marked as Covered (9 items total).
3. Analysis — 14 missing states across 8 categories, 1 not built (responsive, no guideline).
4. Build — 14 editable frames, each a clone of the source with only the delta changed, in priority order per category, with annotation (trigger / expected UI / reuse / priority / confirm) above each frame and as Dev Mode annotation.

## Reuse vs. new
| Technique | States |
|-----------|--------|
| Variant switch on existing instances | EMP-01, EMP-02, ERR-03, DIS-02 |
| Boolean prop (Show Alert) + text override | ERR-01, ERR-02, EDGE-01 |
| Instance swap (credit icon → ic-loader-circle; modal icon → ic-trash) | LOAD-01, DEST-01 |
| Library component inserted (Modal Tone=Destructive) | DEST-01 |
| Library variables bound (Stroke/Error strong, Text/Error, Text/Weak, Text/Brand, Fill/Overlay, Text/Inverse strong) | VAL-01, VAL-02, DIS-01, PERM-01, LOAD-02, ERR-01 |
| NEW (flagged for design review) | Generate disabled opacity, thumbnail upload/failed overlay, dimmed voice row |

## Verification
- Source frame "1366": same position/size, same 7 children incl. hidden layers — untouched. ✅
- 14 state frames present, named `<ID> · <State name>`. ✅
- 9 new UI nodes inside product UI: 0 unbound solid fills (all bound to library variables). ✅
- Visual check of every state; one fix applied (VAL-02 sample text overlapped the counter → shortened). ✅
- Panel instance detached in 4 frames (VAL-01, VAL-02, DIS-01, PERM-01) to insert helper text; noted in each annotation. Nested components stay linked.

## Open items for PM / RD / Design
See "Open questions" in `ui-states-checklist.md` (8 questions). Biggest: credit refund on failure (ERR-02/03), disable-vs-validate policy (DIS-01 vs VAL-01), Alert has no Error tone.

## Skill improvements made from this test (generic, no page logic)
Added to `references/figma-workflow.md`: check BOOLEAN/VARIANT props on container instances for hidden state coverage (preview via throwaway clones); treat hidden leftover layers with caution; rules for insertion into instances (detach nearest region only, in the state frame), overlays as state-frame children, locating nodes in fresh clones by child path, and the board/card layout.
