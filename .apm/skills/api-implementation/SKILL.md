---
name: api-implementation
description: Use this skill when implementing or reviewing Your Quiz Hono APIs with TypeScript, TypeSpec-generated types, Zod validation, neverthrow Result flows, Cloudflare Workers, D1/Drizzle persistence, API scripts, or runtime error handling.
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Requires access to the Your Quiz API implementation project and generated API contracts.
---

# API Implementation

## 利用タイミング

Your Quiz の Hono API 実装、TypeSpec 生成型との整合、Zod validation、neverthrow error handling、D1/Drizzle persistence、API scripts を扱うときに使う。

## 確認する入力

- TypeSpec/OpenAPI/generated types の現状
- Hono route、handler、bindings、environment
- Zod schema、use case、domain service、repository
- pnpm scripts、typecheck、BDD/unit test commands

## Workflow

1. `references/hono-typespec-neverthrow.md` で standard handler, validation, error handling rules を確認する。
2. `references/api-implementation-checklist.md` で実装前、実装中、レビュー前の確認項目を追う。
3. TypeSpec 生成型と Zod schema の整合を `satisfies` などで担保する。
4. Request parsing、validation、use case、repository、response mapping を明確に分離する。
5. Typecheck、unit/API tests、BDD tests を変更リスクに応じて実行する。

## Output Format

- 変更した route/handler/use case/repository
- Contract and validation alignment
- Error mapping and status codes
- Commands/tests run
- Remaining risks or assertions

## Guardrails

- Avoid `as any`, `@ts-ignore`, and unchecked non-null assertions.
- Do not bypass TypeSpec contracts by inventing parallel request/response types.
- Convert expected failures to typed error results and map them to documented HTTP responses.
- Keep Cloudflare Workers/D1 bindings typed and environment-specific data out of source.
- Do not edit generated files manually unless the project explicitly treats them as checked-in outputs.

## Evaluation Scenarios

- Implement a create quiz endpoint from TypeSpec through Hono and Zod validation.
- Fix a handler that throws runtime errors by converting expected failures into Result flow.
- Review whether D1 repository code leaks persistence details into domain logic.

## Related References
- `references/hono-typespec-neverthrow.md`
- `references/api-implementation-checklist.md`
