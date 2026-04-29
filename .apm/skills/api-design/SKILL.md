---
name: api-design
description: Use this skill when designing or reviewing Your Quiz API contracts, TypeSpec schemas, OpenAPI generation, API catalog changes, REST endpoint boundaries, response/error models, SDK generation, Pub/Sub integration, or API non-functional requirements.
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Requires access to API design docs and, for implementation checks, TypeSpec tooling.
---

# API Design

## 利用タイミング

Your Quiz の API 設計、TypeSpec 契約、API catalog、OpenAPI 生成、SDK 方針、Pub/Sub 連携、API 非機能を扱うときに使う。

## 確認する入力

- 対象 bounded context と API 利用者
- TypeSpec / OpenAPI / API catalog の現状
- DDD aggregate boundary、UI flow、SDK 生成への影響
- 認証、エラー、pagination、rate limit、field selection、versioning 要件

## Workflow

1. `references/api-catalog-map.md` で endpoint の context と既存 catalog との重複を確認する。
2. `references/api-design-principles.md` で REST resource、action API、error model、compatibility を決める。
3. `references/api-non-functional.md` で performance、security、availability、monitoring、SDK 影響を確認する。
4. Contract-first で TypeSpec を source of truth にし、OpenAPI は生成物として扱う。
5. API catalog と generated contract の差分が出る場合は、どちらを source とするかを明示して揃える。

## Output Format

- 対象 context と endpoint/resource design
- TypeSpec model/operation 方針
- Response/error model と compatibility impact
- SDK/OpenAPI/API catalog 更新要否
- Non-functional checks and open questions

## Guardrails

- Do not hand-edit generated OpenAPI as the contract source.
- Keep API boundaries aligned with DDD contexts; do not merge management, learning, session, and sync semantics casually.
- Design explicit error responses, not only success shapes.
- Backward-incompatible changes need versioning, migration, or explicit approval.
- Do not add authentication or privacy-sensitive fields without checking session/security design.

## Evaluation Scenarios

- Add a quiz answer endpoint and verify it belongs to Quiz Learning, not Quiz Management.
- Review a response union/field selection change for SDK compatibility.
- Check whether an API catalog update needs TypeSpec and OpenAPI regeneration.

## Related References
- `references/api-design-principles.md`
- `references/api-catalog-map.md`
- `references/api-non-functional.md`
