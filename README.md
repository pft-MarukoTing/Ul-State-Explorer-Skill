# UI State Explorer Skill

一個可重複使用的 Claude Skill：分析現有 UI，找出 Design Guideline 尚未涵蓋的狀態（Loading、Empty、Error、Disabled、Validation、Edge Cases…），並依交付方式產生對應的 UI。

- **Mode A — Figma Output**：在原 Figma 檔中建立可編輯、可交付 RD 的狀態 Frames（沿用原有 Components / Variables / Auto Layout）。
- **Mode B — Web Output**：在原 Web Project 中實作各狀態，並加入右下角 **State Explorer** 切換面板（與 Production 隔離）。

兩種模式共用同一套 State Analysis 與 Missing State Checklist，只有產出步驟不同。

在動手做之前，Skill 一定會先**問你每一類狀態要用哪種呈現方式**，並列出常見做法讓你選，例如：

- Loading：Skeleton／Spinner／Progress bar＋取消／串流漸進顯示
- Error：Toast／區塊內 Inline banner＋Retry／Alert dialog／按鈕下方文字
- 文字長度：Title / Description 各幾行，超出用 hover tooltip、展開箭頭（Show more）、Read more 還是漸層遮罩
- Empty：插圖／Icon／純文字，是否加 CTA 引導下一步
- 以及表單驗證時機、上傳失敗、Disabled 原因、刪除確認 vs Undo、權限/額度、數字縮寫等共 19 類

設計系統裡已有的元件會標成「Recommended」；不想逐一回答時可選「其餘用建議預設」，這些項目會在 Checklist 標為 `default (unconfirmed)` 供 Review。

## 安裝

**Claude Code**

```bash
git clone https://github.com/pft-MarukoTing/Ul-State-Explorer-Skill.git
cp -R Ul-State-Explorer-Skill/ui-state-explorer ~/.claude/skills/
```

**claude.ai**：將 `ui-state-explorer/` 資料夾壓縮成 zip，在 claude.ai 的 Skills 設定中上傳。

## 使用方式

提供 Figma Frame 連結或 Web 專案路徑，並說明交付方式，例如：

- 「幫這個 Figma frame 補齊缺少的 UI states，交付 Figma」→ Mode A
- 「幫這個網頁加上 loading / empty / error states 和 State Explorer」→ Mode B

Mode A 需要已連線的 Figma MCP server（含 `use_figma` 寫入能力）。

## 結構

```
ui-state-explorer/
├── SKILL.md                         # 主流程：模式判斷、盤點、分析、詢問呈現方式、設計原則、驗證
├── references/
│   ├── state-taxonomy.md            # 12 類狀態的偵測問題與預期 UI
│   ├── pattern-questions.md         # 19 類呈現方式（Pattern）的常見做法、找元件的方法與提問方式
│   ├── design-system-map.md         # 團隊自己的元件／Token 對照表格式（放在各團隊專案，不放進 skill）
│   ├── checklist-format.md          # Missing State Checklist 格式、優先級定義、JSON schema
│   ├── figma-workflow.md            # Mode A 工作流程
│   └── web-workflow.md              # Mode B 工作流程（含 Production 隔離規則）
└── assets/state-explorer/
    ├── state-explorer.js            # 可直接放入專案的 State Explorer（無依賴、Shadow DOM）
    └── states.example.js            # 專案狀態註冊範本
examples/
├── design-system-maps/              # 對照表範例（YCO），不會隨 skill 安裝
├── test-a-figma/                    # Test A：Figma Tool Page 實測結果
├── test-a2-pattern-questions/       # Test A2：加上呈現方式提問後重跑
├── test-b-web/                      # Test B：網頁版（auto-edit）
└── test-c-web-ai-background/        # Test C：網頁版（ai-background）
```

## 測試結果

| 測試 | 模式 | 結果 |
|------|------|------|
| Test A — Figma Tool Page（AI Auto Edit） | A | ✅ 14 個缺少狀態建立為 Figma Frames，9 個既有狀態標為 Covered，原 Frame 未變動 — 見 [examples/test-a-figma](examples/test-a-figma) |
| Test A2 — 同一頁面＋呈現方式提問 | A | ✅ 3 輪 12 題，6 題答案與推薦不同；5 個狀態依回答重做／新增、移除 VAL-01、新增 NEW Toast — 見 [examples/test-a2-pattern-questions](examples/test-a2-pattern-questions) |
| Test B — yco-collab-space auto-edit（同一頁面的網頁版） | B | ✅ 右下角 State Explorer 收 29 個狀態、逐一在瀏覽器驗證；狀態本身 RD 都已實作，主要補「到得了」；與 Figma 決定有 4 處衝突待決定 — 見 [examples/test-b-web](examples/test-b-web) |
| Test C — yco-collab-space ai-background | B | ✅ 29 個狀態收進 State Explorer、逐一驗證；對照表抓到 1 處與團隊規則衝突（停用區塊 60% vs 30%，已做切換）；發現 1 個無提示的上傳錯誤；3 個缺少狀態待決定呈現方式 — 見 [examples/test-c-web-ai-background](examples/test-c-web-ai-background) |
