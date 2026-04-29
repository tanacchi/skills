# UI フローとワイヤーフレーム: Your Quiz

## モバイル制約

- 基準 viewport は 375px mobile-first。
- minimum touch target は 44px x 44px。
- desktop expansion より先に smartphone use 向けの key flow を設計する。
- 関連する箇所には offline、loading、empty、error、validation、permission state を含める。

## 主要フロー

- quiz answering: quiz display、swipe/button answer、immediate feedback、explanation、next question/result。
- quiz creation: question、choices/answer、explanation、tag、preview、submit、draft/offline handling の段階入力。
- approval: review queue、approve/reject、quality information、batch または next-item flow。
- answer history: history list、statistics、wrong-question review、empty/data error state。
- offline sync: offline notice、pending change、sync progress、conflict/error recovery。
- search/discovery: filter、tag search、result、empty state、deck creation。

## ワイヤーフレームと状態ルール

- wireframe は structure、primary control、navigation、feedback、state transition を示す。
- swipe UI には visible affordance と non-gesture control も用意する。
- API validation error は generic failure message ではなく visible form error に対応付ける。
- offline-capable screen は local saved state と server-synced state を区別する。
- UI state name は可能な範囲で DDD/API term と揃える。

## 出典ドキュメント
- `../your-quiz/docs/instructions/shared/workflow/04.01_ui-design.md`
- `../your-quiz/docs/project/ui-design/1.00_overview.md`
- `../your-quiz/docs/project/ui-design/1.01_sitemap.yaml`
- `../your-quiz/docs/project/ui-design/1.02_user-stories/*.md`
- `../your-quiz/docs/project/ui-design/2.01_user-flows/*.md`
- `../your-quiz/docs/project/ui-design/3.01_wireframes/*.md`
