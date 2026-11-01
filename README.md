# UI State Explorer Skill

一個可重複使用的 Claude Skill：分析現有 UI，找出 Design Guideline 尚未涵蓋的狀態（Loading、Empty、Error、Disabled、Validation、Edge Cases…），並依交付方式產生對應的 UI。

- **Mode A — Figma Output**：在原 Figma 檔中建立可編輯、可交付 RD 的狀態 Frames（沿用原有 Components / Variables / Auto Layout）。
- **Mode B — Web Output**：在原 Web Project 中實作各狀態，並加入右下角 **State Explorer** 切換面板（與 Production 隔離）。

兩種模式共用同一套 State Analysis 與 Missing State Checklist，只有產出步驟不同。

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
├── SKILL.md                         # 主流程：模式判斷、盤點、分析、設計原則、驗證
├── references/
│   ├── state-taxonomy.md            # 13 類狀態的偵測問題與預期 UI
│   ├── checklist-format.md          # Missing State Checklist 格式、優先級定義、JSON schema
│   ├── figma-workflow.md            # Mode A 工作流程
│   └── web-workflow.md              # Mode B 工作流程（含 Production 隔離規則）
└── assets/state-explorer/
    ├── state-explorer.js            # 可直接放入專案的 State Explorer（無依賴、Shadow DOM）
    └── states.example.js            # 專案狀態註冊範本
examples/
└── test-a-figma/                    # Test A：Figma Tool Page 實測結果
```

## 測試結果

| 測試 | 模式 | 結果 |
|------|------|------|
| Test A — Figma Tool Page（AI Auto Edit） | A | ✅ 14 個缺少狀態建立為 Figma Frames，9 個既有狀態標為 Covered，原 Frame 未變動 — 見 [examples/test-a-figma](examples/test-a-figma) |
| Test B — Claude Web Tool Page | B | 待測 |
