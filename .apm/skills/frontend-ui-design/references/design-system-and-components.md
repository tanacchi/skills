# デザインシステムとコンポーネント: Your Quiz

## デザインシステム

- primary styling mechanism は Tailwind CSS。
- primary、success/correct、error/incorrect、warning、neutral、state color には文書化された color token を使う。
- spacing は文書化された scale に揃え、mobile grid constraint を保つ。
- motion は state を隠さずに swipe、feedback、progress、transition を明確にする。
- text が関わる箇所の contrast は WCAG 2.1 AA を満たす。

## コンポーネント分類

- Atoms: Button、TextInput、Icon、Badge、ProgressBar などの primitive。
- Molecules: QuizCard、FormField、SwipeFeedback、FilterChipGroup。
- Organisms: SwipeableQuizCard、QuizCreationForm、AnswerHistoryList、ApprovalQueue。
- Templates/pages: app layout と page-level composition。
- component name と props は domain language を反映する。ただし、すべての UI primitive に domain model を直接 import しない。

## Storybook と品質

- 必要に応じて default、loading、empty、error、disabled、validation、offline、edge-content state の story を作る。
- 主要 flow には mobile 375px viewport story を用意する。
- Storybook example は mock-only の架空 state ではなく API/DDD state と揃える。
- shared component には visual regression と accessibility check を優先する。

## UI 統合と自動化

- DDD integration docs は component を domain concept と API contract に対応付けるときに役立つ。
- MCP/LLM automation docs は generation workflow の参考資料であり、すべての task に automation を追加する要求ではない。
- generated component も accessibility、token use、state coverage の manual review が必要。

## 出典ドキュメント
- `../your-quiz/docs/project/ui-design/4.01_components/design-system.md`
- `../your-quiz/docs/project/ui-design/4.01_components/component-inventory.md`
- `../your-quiz/docs/project/ui-design/4.01_components/storybook-setup.md`
- `../your-quiz/docs/project/ui-design/5.01_integration/ddd-integration.md`
- `../your-quiz/docs/project/ui-design/5.01_integration/mcp-automation.md`
