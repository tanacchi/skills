# docs-to-skills Conversion Guide

このガイドはソース： `../your-quiz/docs` 配下の知識を、再現性のある agent skills 体系として `.apm/skills` へ落とし込むための設計指針です。ソースにある指示やプロンプトを１つ残さず skills 化してください。なお、１ファイル１スキルとは限らず、適切にまとめるのもOK.

`docs` をそのままコピーするのではなく、agent が作業時に発火できる単位へ再編集します。既存の `skills` repository では `.apm/` を正本とし、Codex / Claude / Cursor / OpenCode / Gemini などの agent-specific ファイルは薄い wrapper として扱います。

## 1. 変換原則

### Skill の役割

- `SKILL.md` は「いつ使うか」「何を確認するか」「どう進めるか」「何を出力するか」を短く定義する。
- 詳細な知識、チェックリスト、設計判断、元 docs 由来の制約は `references/` に分離する。
- 1つの skill は特定の作業目的に閉じる。工程、成果物、実装対象、レビュー観点が混ざりすぎる場合は分割する。
- Your Quiz 固有知識と汎用ワークフローを混ぜすぎない。再利用可能な手順は workflow 系 skill、プロジェクト固有の事実は project knowledge reference に置く。

### サイズ目安

- `SKILL.md`: 80-180 行程度。
- `references/*.md`: 150-350 行程度。
- 1 skill あたり references は 2-6 ファイル程度。
- 長い docs は、全文移植ではなく「判断基準」「手順」「チェックリスト」「禁止事項」「成果物テンプレート」「関連 source map」に圧縮する。

### 移植してよい内容

- 作業開始時に必ず確認すべき前提。
- 成果物の完成条件。
- 変更時に守るべき制約。
- API、DDD、UI、テストなどの判断基準。
- 実装・レビューで繰り返し使うチェックリスト。
- Your Quiz 固有の採用技術、境界づけられたコンテキスト、主要集約、主要 API 方針、ADR 要約。

### 移植しない内容

- `docs/tmp` 配下の未確定メモ、一時提案、古い TODO。
- 原文の長大な説明、背景説明、重複する表。
- 実行時に agent が判断へ使わないナビゲーション文。
- 具体コード例の全文。代表パターンだけ reference に圧縮し、必要なら元 docs への source map を残す。

## 2. 推奨ディレクトリ構造

```text
.apm/
  skills/
    project-workflow/
      SKILL.md
      references/
        workflow-routing.md
        docs-and-adr-management.md
    specification-design/
      SKILL.md
      references/
        requirements-and-scenarios.md
        story-quality-checklist.md
    architecture-design/
      SKILL.md
      references/
        architecture-decisions.md
        non-functional-checklist.md
    ddd-design/
      SKILL.md
      references/
        strategic-design.md
        tactical-design.md
        bounded-contexts-and-events.md
    api-design/
      SKILL.md
      references/
        api-design-principles.md
        api-catalog-map.md
        api-non-functional.md
    api-implementation/
      SKILL.md
      references/
        hono-typespec-neverthrow.md
        api-implementation-checklist.md
    frontend-ui-design/
      SKILL.md
      references/
        ui-flows-and-wireframes.md
        design-system-and-components.md
    testing-quality/
      SKILL.md
      references/
        bdd-and-e2e.md
        unit-and-mutation-testing.md
        quiz-development-rules.md
    toolchain-operations/
      SKILL.md
      references/
        git-mise-npm-typespec.md
    your-quiz-project-knowledge/
      SKILL.md
      references/
        project-facts.md
        adr-index.md
        domain-api-ui-map.md
```

新規 skill を作成するときは、既存方針に従って以下を満たします。

- directory name と frontmatter の `name` を一致させる。
- `description` には発火条件と支援する作業を具体的に書く。
- `SKILL.md` は workflow と guardrails に集中させる。
- `references/` は agent が必要時に読む補助知識にする。
- 作成後は `scripts/validate.sh` を実行する。

## 3. Skill ごとの設計

### project-workflow

開発工程の判定、作業計画、docs 更新、ADR 管理、スコープ確認を扱う横断 skill。

主な source:

- `docs/instructions/shared/workflow/00.01_common.md`
- `docs/instructions/shared/workflow/00.02_workflow.md`
- `docs/instructions/shared/workflow/00.03_docs.md`
- `docs/instructions/shared/workflow/00.04_adr-management.md`
- `docs/instructions/shared/workflow/00.05_scope-confirmation.md`
- `docs/instructions/shared/README.md`

`SKILL.md` には「作業分類」「実行前確認」「成果物に応じた参照先」「docs/ADR 更新判断」を置く。工程別の詳細チェックは `references/workflow-routing.md` へまとめる。

### specification-design

要件、ユーザーストーリー、成功シナリオ、エラーシナリオを整理・レビューする skill。

主な source:

- `docs/instructions/shared/workflow/01.01_specification.md`
- `docs/project/specifications/requirements/requirements-quiz.md`
- `docs/project/specifications/user-stories/user-story-quiz.md`
- `docs/project/specifications/success-scenarios/success-quiz.md`
- `docs/project/specifications/error-scenarios/error-quiz.md`
- `docs/project/specifications/future-work.md`

`references/requirements-and-scenarios.md` には Your Quiz の要求、ユーザー価値、正常系/異常系の要約を置く。`references/story-quality-checklist.md` には 5W1H、受け入れ条件、未決事項の抽出観点を置く。

### architecture-design

アーキテクチャ、技術選定、通信方式、データ構造、非機能要件、ADR 反映を扱う skill。

主な source:

- `docs/instructions/shared/workflow/02.01_architecture.md`
- `docs/instructions/shared/workflow/06.01_tech-selection.md`
- `docs/project/architecture/README.md`
- `docs/project/architecture/system-overview.md`
- `docs/project/architecture/tech-selection.md`
- `docs/project/architecture/communication-patterns.md`
- `docs/project/architecture/data-architecture.md`
- `docs/project/architecture/non-functional-requirements.md`
- `docs/project/architecture/diagrams/*.md`
- `docs/project/adr/*.md`

`references/architecture-decisions.md` には採用技術と ADR の要約を置く。`references/non-functional-checklist.md` には性能、可用性、セキュリティ、保守性、コストの判断基準を置く。

### ddd-design

DDD の戦略的設計、戦術的設計、境界づけられたコンテキスト、集約、ドメインイベントを扱う skill。

主な source:

- `docs/instructions/shared/workflow/03.01_ddd-design.md`
- `docs/instructions/shared/workflow/03.02_domain-understanding-guide.md`
- `docs/instructions/shared/workflow/03.02.5_user-flow-analysis-guide.md`
- `docs/instructions/shared/workflow/03.03_ubiquitous-language-creation-guide.md`
- `docs/instructions/shared/workflow/03.04_event-storming-workshop-guide.md`
- `docs/instructions/shared/workflow/03.05_domain-object-extraction-guide.md`
- `docs/instructions/shared/workflow/03.06_entity-relationship-analysis-guide.md`
- `docs/instructions/shared/workflow/03.07_domain-service-extraction-guide.md`
- `docs/instructions/shared/workflow/03.08_aggregate-design-guide.md`
- `docs/instructions/shared/workflow/03.09_bounded-context-definition-guide.md`
- `docs/instructions/shared/workflow/03.10_domain-events-catalog-guide.md`
- `docs/instructions/shared/workflow/03.11_ontology-creation-guide.md`
- `docs/project/ddd-design/**/*.md`

`references/strategic-design.md` にはドメイン理解、ユビキタス言語、イベントストーミング、コンテキスト境界を置く。`references/tactical-design.md` にはエンティティ、値オブジェクト、ドメインサービス、集約、不変条件を置く。`references/bounded-contexts-and-events.md` には 4 コンテキスト、主要集約、ドメインイベント、コンテキスト間関係を置く。

### api-design

API 設計、API catalog、契約、SDK、Pub/Sub、API 非機能を扱う skill。

主な source:

- `docs/instructions/shared/workflow/04.02_api-design.md`
- `docs/project/api-design/README.md`
- `docs/project/api-design/design-principles.md`
- `docs/project/api-design/api-catalog/*.md`
- `docs/project/api-design/sdk-generation-strategy.md`
- `docs/project/api-design/pub-sub-integration.md`
- `docs/project/api-design/non-functional-requirements.md`
- `docs/project/api-design/implementation-migration-plan.md`

`references/api-design-principles.md` には API 分割、REST/GraphQL、認証、エラー、互換性の基準を置く。`references/api-catalog-map.md` には catalog 全文ではなく、ドメイン別 endpoint 群と参照元 map を置く。`references/api-non-functional.md` には性能、可用性、セキュリティ、監視の API 固有基準を置く。

### api-implementation

Your Quiz の API 実装作業で、Hono、TypeSpec、neverthrow、Zod、Cloudflare Workers、pnpm scripts を扱う skill。

主な source:

- `docs/instructions/project/README.md`
- `docs/instructions/project/api-implementation-rules.md`
- `docs/instructions/project/api-implementation-samples.md`
- `docs/instructions/project/api-libraries-guide.md`
- `docs/instructions/project/pnpm-scripts.md`
- `docs/instructions/shared/languages/typescript.md`
- `docs/instructions/shared/languages/typespec.md`
- `docs/instructions/shared/tools/typespec.md`
- `docs/instructions/shared/tools/npm.md`

`references/hono-typespec-neverthrow.md` には必須スタック、禁止事項、エラーハンドリング、validation、schema-first の実装規約を置く。`references/api-implementation-checklist.md` には実装開始前、実装中、テスト前、レビュー前の確認項目を置く。

### frontend-ui-design

UI 設計、画面遷移、wireframe、component inventory、design system、Storybook を扱う skill。

主な source:

- `docs/instructions/shared/workflow/04.01_ui-design.md`
- `docs/project/ui-design/1.00_overview.md`
- `docs/project/ui-design/1.01_sitemap.yaml`
- `docs/project/ui-design/1.02_user-stories/*.md`
- `docs/project/ui-design/2.01_user-flows/*.md`
- `docs/project/ui-design/3.01_wireframes/*.md`
- `docs/project/ui-design/4.01_components/*.md`
- `docs/project/ui-design/5.01_integration/*.md`

`references/ui-flows-and-wireframes.md` には主要画面、ユーザーフロー、状態遷移、エラー/空状態を置く。`references/design-system-and-components.md` には design token、component 分類、Storybook 方針、DDD/API 連携観点を置く。

### testing-quality

BDD、unit、mutation、E2E、品質ゲート、quiz development rules を扱う skill。

主な source:

- `docs/instructions/shared/workflow/07.01_bdd-implementation.md`
- `docs/instructions/shared/workflow/09.01_unit-testing.md`
- `docs/instructions/shared/workflow/09.02_mutation-testing.md`
- `docs/instructions/shared/workflow/11.01_e2e-testing.md`
- `docs/instructions/shared/tests/*.md`
- `docs/tmp/動的apiテスト導入提案_dredd_pactum_schemathesis.md` は採用判断済みの場合のみ参照
- `docs/tmp/pactum-mock-strategy.md` は採用判断済みの場合のみ参照

`references/bdd-and-e2e.md` には BDD と E2E の対象範囲、シナリオ化、API/UI 境界を置く。`references/unit-and-mutation-testing.md` には unit test と mutation test の品質基準を置く。`references/quiz-development-rules.md` には development-rules quiz 由来の必須確認事項だけを圧縮する。

### toolchain-operations

git、mise、npm、TypeSpec、repository setup、Markdown/TypeScript の基礎ルールを扱う skill。

主な source:

- `docs/instructions/shared/repository-setup.md`
- `docs/instructions/shared/tools/git.md`
- `docs/instructions/shared/tools/mise.md`
- `docs/instructions/shared/tools/npm.md`
- `docs/instructions/shared/tools/typespec.md`
- `docs/instructions/shared/languages/markdown.md`
- `docs/instructions/shared/languages/typescript.md`
- `docs/instructions/shared/languages/typespec.md`

既存の generic engineering instructions と重複しやすいため、Your Quiz で実際に必要な command policy、package manager、version management、schema tooling に絞る。

### your-quiz-project-knowledge

Your Quiz 固有の横断知識を格納する参照用 skill。単独作業 skill というより、他 skill から併用される project context として設計する。

主な source:

- `docs/project/specifications/**/*.md`
- `docs/project/architecture/**/*.md`
- `docs/project/ddd-design/**/*.md`
- `docs/project/api-design/**/*.md`
- `docs/project/ui-design/**/*.md`
- `docs/project/adr/*.md`

`references/project-facts.md` にはプロダクト概要、対象ユーザー、主要フロー、技術スタック、非機能目標を置く。`references/adr-index.md` には ADR の決定結果と影響範囲を 1 件数行で要約する。`references/domain-api-ui-map.md` には DDD コンテキスト、API catalog、UI flow の対応関係を置く。

## 4. 変換手順

1. 対象 docs を工程または作業目的で分類する。
2. skill の発火条件を 1 文で書けるか確認する。書けない場合は分割する。
3. `SKILL.md` には以下の章だけを置く。
   - `利用タイミング`
   - `確認する入力`
   - `Workflow`
   - `Output Format`
   - `Guardrails`
   - `Related References`
4. docs 原文から repeated knowledge を抽出し、references に以下の形で再編集する。
   - 決定済み事実
   - 判断基準
   - 作業手順
   - 完了条件
   - 禁止事項
   - source docs
5. reference の末尾に `Source Docs` を置き、元 docs の path を列挙する。
6. `docs/tmp` の内容を使う場合は、採用済みか未確定かを reference 内で明示する。
7. skill 作成後、`scripts/validate.sh` を実行する。

## 5. Source Map

| docs area | primary skill | secondary skill |
| --- | --- | --- |
| `docs/instructions/shared/workflow/00.*` | `project-workflow` | `toolchain-operations` |
| `docs/instructions/shared/workflow/01.01_specification.md` | `specification-design` | `project-workflow` |
| `docs/instructions/shared/workflow/02.01_architecture.md` | `architecture-design` | `your-quiz-project-knowledge` |
| `docs/instructions/shared/workflow/03.*` | `ddd-design` | `specification-design` |
| `docs/instructions/shared/workflow/04.01_ui-design.md` | `frontend-ui-design` | `your-quiz-project-knowledge` |
| `docs/instructions/shared/workflow/04.02_api-design.md` | `api-design` | `api-implementation` |
| `docs/instructions/shared/workflow/05.01_db-design.md` | `architecture-design` | `ddd-design` |
| `docs/instructions/shared/workflow/06.01_tech-selection.md` | `architecture-design` | `toolchain-operations` |
| `docs/instructions/shared/workflow/07.01_bdd-implementation.md` | `testing-quality` | `api-implementation` |
| `docs/instructions/shared/workflow/08.01_skeleton.md` | `api-implementation` | `frontend-ui-design` |
| `docs/instructions/shared/workflow/09.*` | `testing-quality` | `api-implementation` |
| `docs/instructions/shared/workflow/10.*` | `api-implementation` | `ddd-design` |
| `docs/instructions/shared/workflow/11.01_e2e-testing.md` | `testing-quality` | `frontend-ui-design` |
| `docs/instructions/project/*` | `api-implementation` | `api-design` |
| `docs/instructions/shared/languages/*` | `toolchain-operations` | `api-implementation` |
| `docs/instructions/shared/tools/*` | `toolchain-operations` | `api-implementation` |
| `docs/instructions/shared/tests/*` | `testing-quality` | `project-workflow` |
| `docs/project/specifications/*` | `specification-design` | `your-quiz-project-knowledge` |
| `docs/project/architecture/*` | `architecture-design` | `your-quiz-project-knowledge` |
| `docs/project/architecture/diagrams/*` | `architecture-design` | `ddd-design` |
| `docs/project/adr/*` | `architecture-design` | `your-quiz-project-knowledge` |
| `docs/project/ddd-design/*` | `ddd-design` | `your-quiz-project-knowledge` |
| `docs/project/api-design/*` | `api-design` | `api-implementation` |
| `docs/project/api-design/api-catalog/*` | `api-design` | `your-quiz-project-knowledge` |
| `docs/project/ui-design/*` | `frontend-ui-design` | `your-quiz-project-knowledge` |
| `docs/tmp/*` | none by default | use only after adoption decision |

## 6. Quality Bar

各 skill は次の条件を満たしたら作成完了とする。

- 発火条件が `description` だけで判断できる。
- `SKILL.md` を読むだけで作業の進め方がわかる。
- 詳細知識は `references/` に分離されている。
- references は元 docs の path を追跡できる。
- Your Quiz 固有の決定事項と汎用ルールが混ざりすぎていない。
- 既存 skill と重複する場合は、既存 skill を拡張するか、発火条件を明確に分けている。
- `scripts/validate.sh` が通る。

## 7. 初回作成の推奨順

1. `your-quiz-project-knowledge`: 他 skill が参照する共通知識を先に整える。
2. `project-workflow`: 工程判定と docs/ADR 管理を安定させる。
3. `ddd-design`: ドメイン境界と集約を agent が誤解しないようにする。
4. `api-design`: DDD と UI から API 契約へつなぐ。
5. `api-implementation`: TypeSpec / Hono / neverthrow / Zod の実装規約を固める。
6. `frontend-ui-design`: UI flow、wireframe、component 方針を実装可能な形にする。
7. `testing-quality`: 実装後の品質ゲートを補強する。
8. `architecture-design`, `specification-design`, `toolchain-operations`: 作業頻度に応じて追加または統合を判断する。

初回は 10 skill すべてを一度に作らず、上位 5-7 skill から始める。実作業で発火条件が曖昧になった skill は分割し、ほとんど使われない skill は project knowledge reference に吸収する。
