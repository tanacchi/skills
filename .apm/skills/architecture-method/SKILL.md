---
name: architecture-method
description: Use when designing or reviewing system architecture from scratch or significantly evolving it — covers system boundary definition, component decomposition, architecture style selection (monolith/modular-monolith/microservices/hexagonal/clean), tech stack comparison, data/communication architecture, DB design patterns, NFR analysis, and ADR writing. Triggers on phrases like "アーキテクチャを設計して", "技術選定をして", "DB設計の方針を決めて", "ADRを書いて", "システム構成を決めたい", or any request to document architecture decisions with tradeoffs.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# アーキテクチャ設計メソッド

## 利用タイミング

以下のいずれかに該当するときに使う。

- システム全体のアーキテクチャスタイル（モノリス / モジュラーモノリス / マイクロサービス）を決める
- アプリケーションアーキテクチャパターン（ヘキサゴナル / クリーン / レイヤード）を選定する
- 技術スタック（フレームワーク / ORM / バリデーション / テスト）を比較検討する
- データストア戦略・通信方式・非機能要件への対応方針を文書化する
- DB 設計（集約マッピング / インデックス / 移行戦略）を行う
- アーキテクチャ決定記録（ADR）を作成または更新する

## 確認する入力

- 機能要件の概要（何を作るか、主要ユースケース）
- 非機能要件：性能目標 / 可用性 SLA / セキュリティ要件 / 運用コスト制約
- チーム規模・技術力・学習コスト許容範囲
- 既存システムとの連携・移行制約
- ライセンス・コンプライアンス要件
- DDD 設計成果物（集約境界、ユビキタス言語）— DB 設計フェーズの場合は必須

## ワークフロー

1. **前提確認**: 要件・制約・既存 ADR を把握し、設計の入力を揃える。
2. **アーキテクチャスタイル選定**: `references/architecture-style-guide.md` の比較基準で候補を評価し、採用パターンとトレードオフを明記する。
3. **システムコンテキスト設計**: 外部システム境界と連携方式（同期 REST / 非同期 Queue / Event）を決定する。
4. **データアーキテクチャ方針**: RDBMS / NoSQL / Cache の役割分担、ACID vs BASE、CQRS 適用要否を決める。
5. **通信パターン設計**: ユースケースごとに同期 / 非同期を選択し、API Gateway / Service Mesh の要否を判断する。
6. **技術スタック選定**: `references/tech-selection-criteria.md` の評価軸で各カテゴリを表形式で比較し、判定根拠を記録する。
7. **DB 設計**（対象フェーズの場合）: 集約-テーブルマッピング → 主キー / データ型 / 制約 → インデックス → 移行戦略の順に詳細化する。
8. **非機能要件対応方針**: スケーリング / 可用性 / セキュリティ / 性能 各方針を定義する。
9. **ADR 作成**: 重要決定をすべて ADR として記録し、代替案・選定理由・後続工程への制約を明示する。
10. **成果物レビュー依頼**: 生成した全ファイルをリストアップしてレビューを求める。

## 出力形式

```
docs/project/architecture/
├── system-overview.md              # システム全体俯瞰・方針
├── patterns/
│   ├── architecture-decision.md    # アーキテクチャ判断・選定理由
│   ├── communication-patterns.md   # 通信パターン（方針のみ、エンドポイント詳細は含めない）
│   └── data-flow-design.md
├── technology/
│   ├── tech-stack-overview.md
│   └── comparison-tables/
│       └── tech-comparison-matrix.md
└── constraints/
    ├── technical-constraints.md
    └── development-guidelines.md
```

各技術選定は以下の表形式で整理する（詳細は `references/tech-selection-criteria.md` 参照）:

| 選択肢 | メリット | デメリット | 適用場面 | コスト | 学習曲線 | チーム適合性 | 判定 |

## ガードレール

- **抽象度を守る**: アーキテクチャフェーズでは具体的な API エンドポイント・SQL クエリ・TypeScript interface 定義・ドメインエンティティ名を含めない。これらは後続フェーズで決定する。
- **表形式の比較を省略しない**: 全技術選定は必ず代替案との比較表を作成する。根拠なき選定は禁止。
- **DDD 整合性**: DB 設計は DDD 集約境界と一致させ、集約をまたぐトランザクションを避ける。
- **ADR との矛盾禁止**: 既存 ADR と矛盾する変更を黙って実装せず、superseding ADR の作成を提案する。
- **ドメインロジックの DB 移譲禁止**: ビジネスルールをストアドプロシージャ / トリガーに実装しない。
- **NFR を数値で定義**: パフォーマンス目標・可用性 SLA を曖昧なまま技術決定しない。

## 評価シナリオ

- 「新機能のデータストアをどう選ぶか検討して」— データストア選定表と ACID/BASE 判断が生成される。
- 「モノリスとモジュラーモノリスのどちらにすべきか比較して」— アーキテクチャスタイル比較表と選定根拠が生成される。
- 「DB 設計の集約マッピングをレビューして」— 集約境界・トランザクション境界・インデックス戦略の確認が行われる。
- 「この技術選定の ADR を書いて」— 代替案・選定理由・後続制約を含む ADR が生成される。

## 関連リファレンス

- `references/architecture-style-guide.md`
- `references/tech-selection-criteria.md`
