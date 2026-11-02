# Missing State Checklist — AI Auto Edit (frame "1366")

- Source: https://www.figma.com/design/g5gX97VnaFezWBAF2a0Mz4/Untitled?node-id=0-6172
- Output mode: A — Figma (input is a Figma frame; the user asked to test Figma output)
- Analysed: 2026-10-23
- Summary: 14 states missing · P0 7 · P1 5 · P2 2 · 14 need confirmation · 9 already covered · 1 not built

## Inventory (short)
- Regions: Navigation header (credits 500), side navigation, Auto-Edit panel (left), Media / History canvas (right)
- Key components ([Comp]YCO_web_components_2025): Auto-Edit-panel, Button with creadits (Generate · 30), Thumbnail, Tag, YCO_toggle, DemoVideo › Tabs (History=no/yes), canvas (Media / Upload / histories / demo / Portrait, Show Alert), Thumbnail-media (Default/Hover), Alert (Warning), Modal (Default/Destructive)
- Interactions: type prompt (required, 2,500-character max, clear), pick style, voice-over on/off and pick a voice, edit settings, Generate (costs 30 credits), switch tabs between Media and History, Import media, reorder, edit and delete media
- Data dependencies: credit balance, prompt length, media count (videos /60, photos /300), material duration (max 30:00), generation jobs (History)

## Missing states

| ID | Category | State name | Scope | Trigger | Expected UI | Reuse | Priority | Confirm | Status |
|----|----------|-----------|-------|---------|-------------|-------|----------|---------|--------|
| EMP-01 | Empty | Media — no media yet | Media canvas | First visit, no media has been imported | canvas switches to the Upload variant: empty illustration, title, supported formats, Import media button; the example row is hidden | canvas / Property 1=Upload | P0 | PM: copy, formats, limits | Built (placeholder copy) |
| EMP-02 | Empty | History — no videos yet | History canvas | History tab while no video has been generated | Tabs History=yes; Upload layout with the button removed, explaining that results will appear here | Tabs History=yes, canvas=Upload | P1 | PM: copy, whether to link to My Gallery | Built (placeholder copy) |
| LOAD-01 | Loading | Generate — submitting | Generate button | Generate clicked; request not yet confirmed | Label "Generating…", credit icon swapped for the loader, credit count hidden | Button with creadits, ic-loader-circle | P1 | RD: time until the job appears in History | Built |
| LOAD-02 | Loading | Media — importing | Media grid | User imports a file; upload in progress | Uploading thumbnail shows a dark overlay with loader and %; Import media still available | Thumbnail-media, Fill/Overlay, ic-loader-circle | P0 | RD: whether upload % is available; multi-file queue | Built |
| ERR-01 | Error | Media — import failed | Media grid | Unsupported format, file too large, or network error | Failed thumbnail shows error icon, "Upload failed", Retry; warning bar explains why | Alert, Fill/Overlay, ic-circle-alert, Refresh cw | P0 | PM+RD: which error reasons are distinguishable; copy | Built (placeholder copy) |
| ERR-02 | Error | Generate — request failed | Media canvas | Generate request fails or times out | Alert bar: request failed, try again; all inputs kept | Alert (Warning tone; no Error tone exists) | P0 | PM: copy, whether credits are refunded; no Error tone in the Alert set | Built (placeholder copy) |
| ERR-03 | Error | History — generation failed | History job card | Background generation job fails | Generating card switches to "Generation failed" with a reason and next step; progress bar hidden | canvas=histories card | P0 | PM: refund rule, whether retry is offered | Built (placeholder copy) |
| DIS-01 | Disabled | Generate — requirements not met | Generate button | Prompt empty, no media, or not enough material | Generate dimmed and unclickable; the reason is shown below | Button with creadits (no Disabled variant → NEW), Text/Weak | P1 | PM: disabled vs. allow click and show validation (mutually exclusive with VAL-01) | Built — NEW needs design review |
| DIS-02 | Disabled | Voice-over — off | Voice-over row | Toggle switched to OFF | YCO_toggle open=no; voice selector dimmed | YCO_toggle open=no | P2 | PM: hide or dim | Built — NEW (dimmed treatment) |
| VAL-01 | Validation | Prompt — required | Prompt field | Generate clicked with an empty prompt | Field border Stroke/Error strong, inline error in Text/Error, counter 0/2500 | Stroke/Error strong, Text/Error | P0 | PM: copy | Built (placeholder copy) |
| VAL-02 | Validation | Prompt — character limit | Prompt field | Prompt reaches 2,500 characters | Counter 2500/2500 in Text/Error, hint below | Text/Error | P2 | PM: hard stop or truncate | Built |
| PERM-01 | Permission | Credits — not enough | Generate button / header | Credit balance < cost (30) | Header shows the low balance; Generate dimmed; "Not enough credits" with a Get credits link below | Text/Error, Text/Brand | P0 | PM: upgrade destination, plan copy | Built (placeholder copy) |
| EDGE-01 | Edge | Media — limit reached | Media header | 60 videos / 300 photos / 30:00 of material reached | Counters full, storage bar full, Import media dimmed, warning explains | Alert, Button | P1 | PM: which limit blocks import | Built (placeholder copy) |
| DEST-01 | Destructive | Media — delete confirmation | Media item | Delete icon clicked on a thumbnail | Destructive Modal over the page: title, explanation, Cancel / Delete | Modal Tone=Destructive | P1 | PM: confirm dialog vs. undo toast | Built |

## Already covered by the guideline
| State | Where it exists |
|-------|-----------------|
| Generation in progress (progress %) | canvas=histories › "Video Generating…" card |
| Not enough material (warning) | canvas › Show Alert (Alert Tone=Warning) |
| Upload empty pattern | canvas=Upload (copy is from another feature; reused in EMP-01/02) |
| Thumbnail hover | Thumbnail-media State=Hover |
| Tag selected / hover / press | Tag variants |
| Side navigation active / hover | Menu List variants |
| Dropdown open | Dropdown menu Open=True |
| Voice-over on/off control | YCO_toggle open=yes/no |
| Long voice name truncation | Shown truncated in source |

## Open questions
| # | For | Question | Affects |
|---|-----|----------|---------|
| 1 | PM | Copy and supported formats/limits for the empty Media state | EMP-01 |
| 2 | PM | Are credits refunded when generation fails? Offer Retry? | ERR-02, ERR-03 |
| 3 | PM | When requirements are not met, should Generate be disabled or clickable with validation? | DIS-01, VAL-01 |
| 4 | PM | Destination for "Get credits"; balance display when credits run low | PERM-01 |
| 5 | PM | Which media limit blocks import (count or duration)? | EDGE-01 |
| 6 | PM | Delete: confirmation dialog or undo toast? | DEST-01 |
| 7 | RD | Is per-file upload progress available? Which import errors can be told apart? | LOAD-02, ERR-01 |
| 8 | Design | ~~Alert has only a Warning tone~~ — wrong: the Alert set has an Error tone (see Test A2) | ERR-01, ERR-02 |

## New patterns (needs design review)
| Item | Why new | Used by |
|------|---------|---------|
| Generate button disabled treatment (opacity 40%) | "Button with creadits" has no Disabled variant | DIS-01, PERM-01 |
| Thumbnail uploading / failed overlay | Thumbnail-media has only Default/Hover | LOAD-02, ERR-01 |
| Voice selector dimmed | No disabled style for the voice row | DIS-02 |

## Not built
| ID | Reason |
|----|--------|
| RESP-01 | No tablet/mobile guideline for this page (Navigation header only has a Desktop variant) — confirm whether responsive is in scope |

## Notes
- The source frame contains hidden leftover layers from other features (face photo, hairstyle empty state, "Not enough credit. Buy now"). They were not modified and not treated as this page's guideline; consider cleaning them up.
