# Hono-TypeSpec-neverthrow Implementation: Your Quiz

## Required Stack

- Hono for HTTP routing on Cloudflare Workers.
- TypeScript with strict type checking.
- TypeSpec-generated OpenAPI/types as contract source.
- Zod for runtime validation.
- neverthrow for expected application/domain errors.
- Cloudflare D1/SQLite and Drizzle where persistence is involved.

## Standard Handler Shape

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

## Implementation Rules

- Separate JSON parsing from Zod validation.
- Prefer shared helpers such as safe JSON parse, Zod validation, and error response creation when present.
- Use `satisfies z.ZodType<GeneratedType>` patterns where generated types are available.
- Use `tryCatch`/conversion boundaries for unknown external failures; do not throw expected validation/domain failures.
- Keep use cases independent from Hono context; map Hono request/response at the edge.
- Keep repository interfaces aligned with aggregates and DDD boundaries.

## Error Mapping

- Validation errors map to documented 400/422 responses.
- Missing resources map to 404.
- Conflicts and invariant violations map to documented domain error status codes.
- Unexpected infrastructure failures should be logged and returned as safe server errors without leaking internals.

## Library Boundaries

- Do not introduce unapproved validation, HTTP client, ORM, or test libraries when the existing stack covers the need.
- Browser storage and frontend-only libraries do not belong in API runtime code.

## Source Docs
- `../your-quiz/docs/instructions/project/README.md`
- `../your-quiz/docs/instructions/project/api-implementation-rules.md`
- `../your-quiz/docs/instructions/project/api-implementation-samples.md`
- `../your-quiz/docs/instructions/project/api-libraries-guide.md`
- `../your-quiz/docs/instructions/shared/languages/typescript.md`
- `../your-quiz/docs/instructions/shared/languages/typespec.md`
