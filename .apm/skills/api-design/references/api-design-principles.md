# API Design Principles: Your Quiz

## Contract Source

- TypeSpec is the schema-first source for API contracts.
- Generated OpenAPI and generated TypeScript types must be treated as derived artifacts.
- API catalog markdown describes design intent and must stay aligned with TypeSpec.
- ADR-0022 prefers direct TypeSpec generated types with Hono integration over Chanfana.

## URL And Resource Design

- Group APIs by bounded context and resource ownership.
- Use REST resources for CRUD-like operations.
- Use action/workflow endpoints only when the operation is domain behavior rather than resource replacement.
- Keep resource names plural and stable; version public contracts deliberately.

## HTTP Methods And Status

| Method | 用途 | 成功コード | 失敗（代表） |
| :--- | :--- | :--- | :--- |
| **GET** | 取得 | 200 OK | 404 Not Found |
| **POST** | 作成・動詞API | 201 Created | 400 Bad Request, 409 Conflict |
| **PUT** | 全体更新 | 200 OK | 400, 404 |
| **PATCH** | 部分更新 | 200 OK | 400, 404 |
| **DELETE** | 削除 | 204 No Content | 404 |

## Response And Error Model

```json
{
  "success": true,
  "data": { ... },
  "error": { "code": "STRING", "message": "readable", "details": {} },
  "meta": { "requestId": "UUID", "version": "v1" }
}
```

- Error families: `AUTH_*`, `VALIDATION_*`, `RESOURCE_*`, `RATE_LIMIT_*`, and operation-specific domain errors.
- Include request id/version metadata where the common spec requires it.
- Validate request and response examples against schema where possible.

## Compatibility

- Additive fields are preferred over breaking response shape changes.
- For polymorphic quiz solution response shapes, follow ADR-0021 status and source docs before implementation.
- SDK generation must not require manual fixes after OpenAPI generation.

## Source Docs
- `../your-quiz/docs/project/api-design/design-principles.md`
- `../your-quiz/docs/project/api-design/api-catalog/07-common-specs.md`
- `../your-quiz/docs/project/api-design/sdk-generation-strategy.md`
- `../your-quiz/docs/project/adr/0021-quiz-solution-api-response-strategy.md`
- `../your-quiz/docs/project/adr/0022-typespec-schema-first-hono-integration-strategy.md`
