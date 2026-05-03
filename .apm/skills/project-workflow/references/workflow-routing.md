# ワークフロー振り分け: Your Quiz

## 工程マップ

| 工程 | 主 skill | 主成果物 | 完了シグナル |
| --- | --- | --- | --- |
| 共通方針 / scope | `project-workflow` | 作業分類、scope、確認事項 | 必須入力と scope 境界が明確。 |
| 仕様整理 | `specification-design` | 要件、user story、success/error scenario | 5W1H、acceptance criteria、open question が明確。 |
| アーキテクチャ/技術選定 | `architecture-design` | architecture、NFR、ADR proposal | tradeoff、selected stack、NFR impact が文書化されている。 |
| DDD 設計 | `ddd-design` | ubiquitous language、BC、aggregate、event | context 境界と invariant を test 可能にする。 |
| UI 設計 | `frontend-ui-design` | sitemap、flow、wireframe、component | mobile-first state と DDD/API alignment が明確。 |
| API 設計 | `api-design` | TypeSpec、API catalog、OpenAPI | contract が schema-first で context と揃っている。 |
| DB / data 設計 | `architecture-design` | data model、migration 方針、constraint | aggregate 境界と persistence 境界が対応付けられている。 |
| BDD/API test | `testing-quality` | PactumJS executable spec | business scenario が実装前に red になる。 |
| skeleton / implementation | `api-implementation` or implementation-specific skill | compile 可能な構造と production code | typecheck が通り、contract が守られている。 |
| unit / mutation test | `testing-quality` | Vitest test、mutation analysis | coverage と mutation quality gate が満たされるか、未達理由が明示されている。 |
| E2E test | `testing-quality` / `frontend-ui-design` | Playwright scenario | 主要 journey の UI/API/DB flow が検証されている。 |

## 振り分けルール

- user が local fix と明示しない限り、新機能は specification から始める。
- 前工程の成果物がある場合、または不足分を assumption として記録した場合だけ次へ進む。
- task が複数工程にまたがる場合は作業を分け、いま実行している工程名を明示する。
- user が implementation を求めていても API/DDD/contract が不足している場合は、coding 前に不足している design artifact を特定する。
- 作業は story-sized に保ち、広すぎる multi-feature design や implementation batch を避ける。

## 完了チェック

- requirement が scenario、API、UI state、test へ追跡できる。
- DDD context と aggregate boundary が API や DB design と矛盾していない。
- generated artifact は generated と分かるようにし、generated OpenAPI の手編集を避ける。
- 長く残る architecture / technology decision には ADR が提案されている。
- deferred scope は implementation note に隠さず 将来課題 に記録する。

## 出典ドキュメント
- `../your-quiz/docs/instructions/shared/workflow/00.01_common.md`
- `../your-quiz/docs/instructions/shared/workflow/00.02_workflow.md`
- `../your-quiz/docs/instructions/shared/workflow/00.05_scope-confirmation.md`
- `../your-quiz/docs/instructions/shared/workflow/README.md`
