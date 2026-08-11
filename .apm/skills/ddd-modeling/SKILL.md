---
name: ddd-modeling
description: Use this skill when performing Domain-Driven Design modeling on any project — covering strategic design (domain understanding, ubiquitous language, event storming, bounded contexts, context mapping) and tactical design (entities, value objects, aggregates, domain services, domain events, invariants). Triggers on requests like "DDD設計をして", "ユビキタス言語を作って", "集約を設計して", "bounded context を定義して", "event storming をやって", or any task that involves modeling a domain, classifying domain objects, or designing aggregate boundaries.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# DDD モデリング

## 利用タイミング

以下の作業を行うときに使う:

- ドメイン理解・業務フロー分析を開始するとき
- ユビキタス言語辞書を作成・更新するとき
- Event Storming でドメインイベントを発見するとき
- 境界づけられたコンテキストを定義・分割するとき
- エンティティ・値オブジェクト・集約・ドメインサービスを設計・分類するとき
- ドメインイベントを設計してコンテキスト間連携を定義するとき
- 不変条件・状態遷移・ビジネスルールをコードに反映する前に整理するとき

## 確認する入力

- 要件定義・ユーザーストーリー・成功/失敗シナリオ（仕様書）
- 対象とするドメインまたはサブドメインの範囲
- 既存のユビキタス言語辞書や DDD 成果物（存在する場合）
- 変更・追加対象の bounded context と aggregate
- API・DB・UI がドメイン境界に与える影響

## Workflow

1. **ドメイン理解** — 仕様書から名詞（オブジェクト候補）・動詞（振る舞い候補）・状態を抽出し、概念理解マトリックスを作成する。詳細: `references/strategic-design-stages.md` §1。
2. **ユーザーフロー分析** — 主要ユースケースを 4W1H で整理し、ビジネス価値・技術難易度で優先度を決める。詳細: `references/strategic-design-stages.md` §2。
3. **ユビキタス言語確立** — 仕様書用語を DDD 分類（Entity / Value Object / State / Action）し、UpperCamelCase 英語名・BDD 表現例を定義する。詳細: `references/strategic-design-stages.md` §3。
4. **Event Storming** — Big Picture → Pivotal Events → Context Candidates → Message Flow → Bounded Context Canvas → Context Map の 6 段階で実施する。詳細: `references/strategic-design-stages.md` §4。
5. **ドメインオブジェクト抽出** — エンティティ/値オブジェクトを「ID 識別か値識別か」「ライフサイクルがあるか」で分類し、表形式で記録する。詳細: `references/tactical-design-patterns.md` §1。
6. **エンティティ関係分析** — 1対1所有・1対多所有・多対多・参照の関係パターンを表形式で整理する。詳細: `references/tactical-design-patterns.md` §2。
7. **ドメインサービス抽出** — 複数集約にまたがる計算・複雑な判定・外部連携ロジックを entity から抽出する。詳細: `references/tactical-design-patterns.md` §3。
8. **集約設計** — Event Storming のアウトプットを入力に集約候補を特定し、整合性境界・集約ルート・2段階イベント発行パターンを定義する。詳細: `references/tactical-design-patterns.md` §4。
9. **境界づけられたコンテキスト定義** — Context Canvas を各コンテキストに作成し、Context Map で統合パターン（Customer-Supplier / ACL / Shared Kernel 等）を定義する。詳細: `references/strategic-design-stages.md` §5。
10. **ドメインイベント設計** — 集約が発行するイベント・購読するイベントを整理し、配信保証・べき等性・エラー処理を定義する。詳細: `references/tactical-design-patterns.md` §5。
11. **成果物整合性確認** — ユビキタス言語・不変条件・コンテキスト境界が相互に整合していることを確認し、後続の API 設計・DB 設計への制約を明示する。

## 出力形式

- **対象 bounded context** と責務の一文要約
- **エンティティ / 値オブジェクト / 集約 / ドメインサービス** の候補と分類根拠（表形式）
- **不変条件・状態遷移・ビジネスルール**（箇条書き）
- **ドメインイベント** の発火条件と下流への影響
- **コンテキスト間統合パターン**（Context Map 形式）
- API / DB / UI へ渡す制約・未決事項

## ガードレール

- ドメインルールを UI ハンドラー・DB トリガー・永続化層だけに閉じ込めない
- 集約境界を UI 画面形状ではなく strong consistency 要件に合わせる
- 他集約への参照は ID を基本とし、直接オブジェクトグラフを持ち込まない
- コンテキスト間の変換は API / event / ACL で扱い、内部モデルを漏らさない
- ユビキタス言語と衝突する命名は仕様書を確認してから変更する
- 集約サイズを推測で大きくせず、不変条件が必要な範囲のみに絞る
- CQRS / Event Sourcing / Saga は必要性を確認してから適用する

## 評価シナリオ

- 「新しい承認ルールは集約の不変条件か、それともドメインサービスか」と問われたとき、正しく判定できる。
- 「2 つのコンテキストで同じ用語が異なる意味を持つ」と報告されたとき、ACL または Shared Kernel どちらを使うか説明できる。
- 「集約 A が集約 B の状態に依存する処理」を設計するとき、ID 参照とドメインイベントによる疎結合パターンを提案できる。
- 「ユーザーストーリーからユビキタス言語辞書を作って」と依頼されたとき、DDD 分類・英語名・BDD 表現例を含む辞書を作成できる。

## 関連リファレンス

- `references/strategic-design-stages.md` — 戦略的設計 5 ステージの詳細手順
- `references/tactical-design-patterns.md` — 戦術的設計パターンの詳細手順
