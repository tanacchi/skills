# Hono-TypeSpec-neverthrow 実装: Your Quiz

## 必須スタック

- HTTP routing on Cloudflare Workers には Hono を使う。
- strict type checking 付き TypeScript を使う。
- contract source には TypeSpec-generated OpenAPI/types を使う。
- runtime validation には Zod を使う。
- expected application/domain error には neverthrow を使う。
- persistence が関わる場合は Cloudflare D1/SQLite と Drizzle を使う。

## 標準ハンドラー構造

```typescript
const handler = async (c: AppContext) => {
  const id = c.req.param("id");
  if (!id) return c.json(errorResponse, 400);

  const jsonResult = await parseJsonSafe(c.req);
  if (jsonResult.isErr()) return c.json(errorResponse, 400);

  const validationResult = validateWithZod(schema, jsonResult.value);
  if (validationResult.isErr()) return c.json(errorResponse, 400);

  const result = await businessLogic(validationResult.value);
  return result.match(
    (value) => c.json(value, 200),
    (error) => c.json(toErrorResponse(error), error.status),
  );
};
```

## 実装ルール

- JSON parsing と Zod validation を分離する。
- safe JSON parse、Zod validation、error response 作成などの shared helper がある場合は優先する。
- generated type がある場合は `satisfies z.ZodType<GeneratedType>` pattern を使う。
- unknown external failure には `tryCatch`/conversion boundary を使い、想定済み validation/domain failure は throw しない。
- use case は Hono context から独立させ、Hono request/response は edge で map する。
- repository interface は aggregate と DDD boundary に揃える。

## エラーマッピング

- validation error は文書化された 400/422 response に map する。
- missing resource は 404 に map する。
- conflict と invariant violation は文書化された domain error status code に map する。
- unexpected infrastructure failure は log に残し、internal を漏らさない safe server error として返す。

## ライブラリ境界

- 既存 stack で足りる場合、未承認の validation、HTTP client、ORM、test library を導入しない。
- browser storage と frontend-only library は API runtime code に入れない。

## 出典ドキュメント
- `../your-quiz/docs/instructions/project/README.md`
- `../your-quiz/docs/instructions/project/api-implementation-rules.md`
- `../your-quiz/docs/instructions/project/api-implementation-samples.md`
- `../your-quiz/docs/instructions/project/api-libraries-guide.md`
- `../your-quiz/docs/instructions/shared/languages/typescript.md`
- `../your-quiz/docs/instructions/shared/languages/typespec.md`
