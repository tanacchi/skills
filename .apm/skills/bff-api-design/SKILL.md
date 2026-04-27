---
name: bff-api-design
description: Use this skill when designing or reviewing Spring Boot BFF APIs, OpenAPI contracts, schema compatibility, request validation, error handling, and backend-for-frontend boundaries.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# BFF API Design

## 利用タイミング

Spring Boot / BFF / OpenAPI / API schema / error handling / frontend 向け backend contract を設計・レビューするときに使う。

## 確認する入力

- existing endpoint と schema
- frontend が必要とする view model
- downstream API の制約
- authentication / authorization
- error contract

## Workflow

1. frontend requirement と BFF の責務を分離する。
2. backward-compatible な schema evolution を優先する。
3. validation と error response を明確にする。
4. downstream failure の扱いを決める。
5. OpenAPI と実装・test の整合性を確認する。

## Output Format

- API shape
- request / response schema
- error handling
- compatibility notes
- test scenarios

## Guardrails

- frontend 都合を domain API に漏らしすぎない。
- breaking change は明示し、migration path を提示する。
- error を opaque にしすぎない。

## Related References

- `references/spring-boot-guidelines.md`
- `references/openapi-guidelines.md`
