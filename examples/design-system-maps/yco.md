# Design System Map — YCO (YouCam Online Editor web)

- Libraries: [Comp]YCO_web_components_2025 (components in other products' libraries — ycv, YCE, YCP… — are not YCO's guideline)
- Library file: https://www.figma.com/design/JXNIQPJT9I9qFrgtiaCn4i/-Comp-YCO_web_components_2025
- Updated: 2026-11-02 from Test A2 (AI Auto Edit) answers — fill in the empty links

## Patterns
| Pattern (family) | Use | Variant / props | Notes |
|------------------|-----|-----------------|-------|
| Toast (F5, F8) | Alert — https://www.figma.com/design/JXNIQPJT9I9qFrgtiaCn4i/-Comp-YCO_web_components_2025?node-id=3482-58557 | Errors: Tone=Error, Size=Small, Heading=off | Named "Alert", not "Toast". Top center, auto-dismiss |
| Inline alert / banner (F5) | Alert (same set) or Alert global | Size=Large; tone by meaning | Alert has Error, Warning, Success, Information, Neutral, Brand, Inverse neutral, Inverse brand |
| Modal / confirm (F15) | Modal | Tone=Destructive for delete | |
| Empty state (F9) | Empty State | | Newer than canvas=Upload; prefer it |
| Tooltip (F10, F13) | Tooltip | Size=Tiny, Heading=off, Dismissible=off for hover hints | Arrow side via Type |
| Spinner / loader (F1–F4) | Spinner 1, Spinner 2, ic-loader-circle | | |
| Skeleton (F1) | none | | Known gap |
| Progress (F4) | canvas=histories generating card | | Only inside History |

## State tokens and variants
| State | Components with a State variant | Tokens when there is no variant |
|-------|--------------------------------|---------------------------------|
| Disabled (one component) | Button (State=Disabled) | Fill/Disabled, Text/Disabled, Icon/Disabled, Stroke/Disabled (e.g. "Button with creadits" has no Disabled variant) |
| Disabled (whole group / region) | — | Dim the whole region to **30% opacity** (e.g. voice selector when Voice-Over is off) |
| Error (field) | | Stroke/Error strong, Text/Error, Icon/Error |
| Hover / Pressed | Button, Thumbnail-media (Hover), Tag | Fill/Hover, Fill/Press |
| Overlay / scrim | | Fill/Overlay, Fill/Overlay Weak |

## Decided patterns (from AI Auto Edit, check before reusing on other pages)
- After a generate action: switch to History; the generating card shows progress.
- Requirements not met: disabled + persistent helper text, no click-then-error.
- Import failed: file not added, Toast only.
- Long single-line names: "…" + hover Tooltip.
- Delete: confirm Modal.

## Known gaps
- No Skeleton component.
