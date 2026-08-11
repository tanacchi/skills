# API 設計原則

## 契約の正本

- TypeSpec を API contract の schema-first source とする。
- 生成された OpenAPI と TypeScript 型定義は派生成果物として扱う。手編集禁止。
- API catalog（markdown）は設計意図を表し、TypeSpec と整合させる。

## URL とリソース設計

推奨パターン: `/api/{domain}/v{N}/{context}/{resource}`

- リソース名は複数形の名詞で安定させる。
- 単純な CRUD は REST resource（名詞API）で表現する。
- 複合操作・ワークフロー・状態遷移は動詞API（`POST /{resource}/{id}/approve` 等）を限定利用する。
- API 境界はドメイン bounded context と一致させる。

### 使い分け基準

| 操作の複雑さ | API 種別 | 判断基準 |
| :--- | :--- | :--- |
| 単純 CRUD | 名詞API | 単一リソースの作成・取得・更新・削除 |
| 関連リソース操作 | 名詞API | 親子関係の明確な操作 |
| 複合・多ステップ | 動詞API | 複数ステップの業務処理 |
| 状態遷移・外部連携 | 動詞API | 承認・同期・変換などのワークフロー |

### 避けるべきパターン

```http
# NG: 動詞のみ（旧スタイル）
POST /api/v1/createUser
GET  /api/v1/getUserById/123

# NG: HTTP メソッドで十分なのに動詞API を使う
POST /api/v1/user/update
POST /api/v1/user/delete
```

## HTTP メソッドとステータスコード

| Method | 用途 | 成功コード | 主な失敗コード |
| :--- | :--- | :--- | :--- |
| GET | 取得 | 200 | 404 |
| POST | 作成・複合操作 | 201 | 400, 409 |
| PUT | 全体更新・置換 | 200, 201 | 400, 404 |
| PATCH | 部分更新 | 200 | 400, 404 |
| DELETE | 削除 | 204 | 404 |

## 統一レスポンスとエラーモデル

```json
{
  "success": true,
  "data": { "..." : "..." },
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found.",
    "details": {}
  },
  "meta": { "requestId": "UUID", "version": "v1" }
}
```

### エラーコードファミリー

| ファミリー | 例 |
| :--- | :--- |
| AUTH_* | UNAUTHORIZED, TOKEN_EXPIRED, FORBIDDEN |
| VALIDATION_* | REQUIRED_FIELD_MISSING, FORMAT_INVALID |
| RESOURCE_* | RESOURCE_NOT_FOUND, RESOURCE_CONFLICT |
| RATE_LIMIT_* | RATE_LIMIT_EXCEEDED |
| SERVER_* | INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE |

## バージョニングと互換性

- additive な変更（フィールド追加）は後方互換で安全。
- レスポンスの shape 変更・フィールド削除・型変更は破壊的変更。
- 破壊的変更はメジャーバージョンアップ（v1 → v2）か、明示的な移行計画が必要。
- URL パスバージョニング（`/v1/`）を基本とし、将来の header versioning は計画段階で文書化する。

## 非機能要件

- **ページネーション**: `page`/`limit`（offset）または cursor-based。`X-Total-Count` ヘッダーを付与する。
- **フィルタリング・ソート**: クエリパラメータで `filter`, `sort` を定義し、enum で許容値を制限する。
- **認証**: JWT Bearer または OAuth2 を選択し、各エンドポイントのスコープ要件を TypeSpec で明示する。
- **レート制限**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` ヘッダーを定義する。
- **入力検証**: 全フィールドのバリデーションルール（required, minLength, maxLength, pattern, minimum, maximum）を TypeSpec で宣言する。
