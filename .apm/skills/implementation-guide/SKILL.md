---
name: implementation-guide
description: Use when implementing features from design documents in a layered (DDD/Clean Architecture) codebase — covering skeleton scaffolding, domain-first entity implementation, Result/Either error handling, and test-first development cycles. Triggers on requests to scaffold, implement entities/aggregates/use-cases, set up layered architecture, or progress from BDD skeletons to production code.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# 実装ガイド

## 利用タイミング

- 設計ドキュメント（BDDシナリオ、仕様書）からスケルトンコードを起こすとき
- ドメインエンティティ・集約・値オブジェクトを実装するとき
- ドメイン → アプリケーション → インフラの順に層を実装するとき
- Result/Either 型によるエラーハンドリングを統一するとき
- TDDサイクル（Red → Green → Refactor）で本実装を進めるとき

## 確認する入力

- BDDシナリオまたは仕様書が実行可能状態になっているか
- プロジェクトの技術スタック・TypeScript 設定（strict mode）
- 既存のエンティティ・ベースクラスパターン（EntityBase, DraftBase 等）
- エラー型の共通定義（Result/Either の採用ライブラリ）
- ディレクトリ構成と命名規則

## Workflow

1. **スケルトン構築**（`references/skeleton-and-scaffold.md` を参照）
   - DDD 層ディレクトリを作成し、各層の index.ts でエクスポートを管理する
   - エンティティ・値オブジェクト・リポジトリIF・コマンド/クエリ型を表形式で設計する
   - 空実装でコンパイル可能・BDD 実行可能な状態にする（"Method not found" → "Assertion failed"）
   - スケルトン完成後にレビューを依頼する

2. **ドメイン層実装**（`references/layered-implementation-patterns.md` を参照）
   - エンティティをスキーマ → パッチ → エンティティ本体の順に実装する
   - 値オブジェクトはイミュータブルかつファクトリメソッドで検証する
   - Result 型でエラーを型付きで返し、例外 throw を避ける
   - ビジネスルール（不変条件）はドメイン層のメソッドに閉じ込める

3. **アプリケーション層実装**
   - コマンド/クエリ型を定義し、ハンドラー（ユースケース）に注入するリポジトリIF を使う
   - 入力バリデーション → ドメインオブジェクト生成 → 永続化 → レスポンス DTO の順に実装する
   - TDDサイクル（Red → Green）で各ユースケースを実装する

4. **インフラ層実装**
   - リポジトリ実装は具体的な永続化技術を隠蔽し、ドメインエラーに変換する
   - コントローラーはリクエスト解析 → バリデーション → ユースケース呼び出し → レスポンスマッピングのみに責務を限定する

5. **品質確認**
   - 全単体テスト Green、カバレッジ 95%以上
   - TypeScript strict モードで型エラーゼロ
   - BDD テスト Green で仕様との整合性確認
   - lint・型チェック通過後にレビューを依頼する

## 出力形式

- 実装したファイル一覧（層別）
- 残る未実装箇所・リスク
- 実行したコマンドと結果（テスト・lint・型チェック）
- レビュー依頼事項

## ガードレール

- `any` 型・型アサーション（`as`）・Non-null assertion（`!`）を使用しない
- 上位層（プレゼンテーション/インフラ）からドメイン層への逆方向依存を作らない
- テストが通らないからといってスキップ・削除しない。根本原因を調査して修正する
- ビジネスロジックをコントローラーやリポジトリ実装に書かない
- 問題が3回の試行で解決しない場合は状況を説明してユーザーに判断を仰ぐ

## 評価シナリオ

- 「UserAggregate のスケルトンを作成して BDD テストを実行可能にして」
- 「Order エンティティを DDD パターンで実装して」
- 「CreateOrderUseCase を TDD で実装して」
- 「インフラ層のリポジトリ実装をドメイン層と分離した形でレビューして」

## 関連リファレンス

- `references/skeleton-and-scaffold.md`
- `references/layered-implementation-patterns.md`
