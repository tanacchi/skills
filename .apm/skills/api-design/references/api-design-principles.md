# API 設計原則: Your Quiz

## 契約の正本

- TypeSpec を API contract の schema-first source とする。
- generated OpenAPI と generated TypeScript types は派生成果物として扱う。
- API catalog markdown は設計意図を表し、TypeSpec と整合させる。
- ADR-0022 は Chanfana より TypeSpec generated type と Hono integration の直接利用を優先する。

## URL とリソース設計

- API は bounded context と resource ownership で group 化する。
- CRUD 的な operation には REST resource を使う。
- resource replacement ではなく domain behavior の場合だけ action/workflow endpoint を使う。
- resource name は複数形で安定させ、public contract の versioning は意図的に行う。

## HTTP メソッドとステータス

| Method | 用途 | 成功コード | 失敗（代表） |
| :--- | :--- | :--- | :--- |
| **GET** | 取得 | 200 OK | 404 Not Found |
| **POST** | 作成・動詞API | 201 Created | 400 Bad Request, 409 Conflict |
| **PUT** | 全体更新 | 200 OK | 400, 404 |
| **PATCH** | 部分更新 | 200 OK | 400, 404 |
| **DELETE** | 削除 | 204 No Content | 404 |

## レスポンスとエラーモデル

```json
{
  "success": true,
  "data": { ... },
  "error": { "code": "STRING", "message": "readable", "details": {} },
  "meta": { "requestId": "UUID", "version": "v1" }
}
```

- error family は `AUTH_*`、`VALIDATION_*`、`RESOURCE_*`、`RATE_LIMIT_*` と operation-specific domain error。
- common spec が要求する箇所には request id/version metadata を含める。
- 可能な範囲で request/response example を schema に対して validate する。

## 互換性

- response shape を壊す変更より additive field を優先する。
- 多態的な quiz solution response shape は、実装前に ADR-0021 の status と source docs に従う。
- SDK generation は OpenAPI generation 後の manual fix を必要としない形にする。

## 出典ドキュメント
- `../your-quiz/docs/project/api-design/design-principles.md`
- `../your-quiz/docs/project/api-design/api-catalog/07-common-specs.md`
- `../your-quiz/docs/project/api-design/sdk-generation-strategy.md`
- `../your-quiz/docs/project/adr/0021-quiz-solution-api-response-strategy.md`
- `../your-quiz/docs/project/adr/0022-typespec-schema-first-hono-integration-strategy.md`
