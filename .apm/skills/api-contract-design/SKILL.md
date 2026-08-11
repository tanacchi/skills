---
name: api-contract-design
description: Use this skill when designing or reviewing API contracts, REST endpoint modeling, request/response/error schemas, versioning strategy, non-functional API requirements, or authoring OpenAPI/TypeSpec specifications. Triggers on phrases like "API設計", "エンドポイント設計", "TypeSpec", "OpenAPI", "スキーマ定義", "API仕様書", "contract-first", or any request to define, review, or evolve an API interface.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# API コントラクト設計

## 利用タイミング

以下のいずれかに該当するとき:

- 新規エンドポイントを設計する（リソース、操作、スキーマ定義）
- リクエスト/レスポンス/エラーモデルをレビュー・改善する
- TypeSpec で API 仕様を作成・更新する
- OpenAPI 生成パイプラインを構築・確認する
- API バージョニング・後方互換性を判断する
- 認証、ページネーション、レート制限などの非機能要件を定義する

## 確認する入力

- 対象リソースと API 利用者（BFF、モバイル、SDK、外部パートナー等）
- ドメインの bounded context とリソース所有者
- 既存 API catalog や TypeSpec / OpenAPI の現状
- 互換性制約（破壊的変更を許容できるか）
- 認証方式・セキュリティ要件
- パフォーマンス・可用性の非機能要件

## ワークフロー

1. **リソース設計**: ドメインモデルに基づきリソース境界を特定し、URL 体系（`/api/{domain}/v{N}/{resource}`）を決定する。
2. **HTTP メソッド決定**: `references/api-design-principles.md` の HTTPメソッド方針表に従い、各操作の method とステータスコードを割り当てる。
3. **スキーマ定義**: TypeSpec で model（リクエスト・レスポンス・エラー）を contract-first で作成する。OpenAPI は生成物として扱い、直接編集しない。
4. **エラーモデル統一**: 統一エラーレスポンス形式（`code`, `message`, `details`）で全エンドポイントを網羅し、エラーファミリーを分類する。
5. **非機能要件定義**: ページネーション、フィルタリング、認証スコープ、レート制限、キャッシュ戦略を各エンドポイントに明示する。
6. **互換性評価**: 変更が additive か破壊的かを判定し、破壊的なら versioning 戦略を決定する。
7. **OpenAPI 生成・検証**: `tsp compile` を実行し、生成結果を前回 diff と比較して破壊的変更を早期検出する。
8. **レビュー依頼**: 設計成果物（TypeSpec、生成 OpenAPI、エラーモデル）をユーザーに提示してレビューを受ける。

## 出力形式

- エンドポイント一覧（method, path, 用途、成功/失敗コード）
- TypeSpec model/operation 方針（ファイル構成含む）
- 統一エラーモデルとエラーコード体系
- 互換性への影響と versioning 判断
- 非機能要件チェックリスト（認証・ページネーション・レート制限・ドキュメント生成）

## ガードレール

- 生成された OpenAPI YAML を contract の source として手編集してはならない。TypeSpec を source of truth とすること。
- 動詞API（`/create`, `/update`）は、単純な CRUD を HTTP メソッドで表現できる場合には使わない。
- エラーモデルは success shape だけでなく、明示的な失敗パターンを設計すること。
- 後方互換性を壊す変更には、versioning の明示、または設計者の明示承認が必要。
- セキュリティ設計を確認せずに、認証や個人情報関連フィールドをエンドポイントに追加しない。
- API 境界はドメイン境界と一致させる。異なる bounded context の責務を同一エンドポイントに混在させない。

## 評価シナリオ

- 「新規リソース `Order` の CRUD エンドポイントを TypeSpec で設計して」→ スキルが起動し、URL 体系・HTTPメソッド・エラーモデルを含む TypeSpec 仕様を出力する。
- 「既存エンドポイントのレスポンスに `status` フィールドを追加したい。互換性は大丈夫か確認して」→ additive 変更として安全と判定し、TypeSpec 修正と OpenAPI 再生成手順を提示する。
- 「ページネーション方式を offset から cursor に変えたい」→ 破壊的変更と判定し、versioning 戦略（v2 namespace または header versioning）のオプションを提示する。
- 「TypeSpec ファイルの分割方針を教えて」→ `references/typespec-authoring-guide.md` の推奨分割（models, operations, shared_traits, examples）を説明する。

## 関連リファレンス

- `references/api-design-principles.md`
- `references/typespec-authoring-guide.md`
