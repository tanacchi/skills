# API Non-Functional: Your Quiz

## Performance

- Use p95 latency targets from the API non-functional docs for each context/operation.
- Keep answer/judgement paths lightweight; avoid cross-context reads in hot paths.
- Search, sync, and operations endpoints can have different latency budgets than answer submission.
- Add pagination/cursors for list endpoints likely to grow.

## Reliability And Scale

- Design idempotency for sync and event-driven integration operations.
- Define conflict semantics where retries can duplicate requests.
- Prefer context-local consistency; use events/workflows for cross-context effects.
- Consider D1/SQLite constraints when designing write-heavy endpoints.

## Security And Privacy

- Validate and sanitize user-generated quiz content.
- Keep anonymous session identity and creator permissions explicit.
- Include rate limiting for creation, search, answer, and other abuse-prone operations.
- Avoid exposing device fingerprints, salts, internal ids, or operational details in public response shapes.

## Observability

- Operations APIs and metrics should expose health and performance without leaking sensitive data.
- Include request ids and structured error codes where common specs require them.
- Monitor API latency per context and operation, not only global averages.

## Source Docs
- `../your-quiz/docs/project/api-design/non-functional-requirements.md`
- `../your-quiz/docs/project/api-design/api-catalog/07-common-specs.md`
- `../your-quiz/docs/project/api-design/api-catalog/08-operations.md`
- `../your-quiz/docs/project/api-design/pub-sub-integration.md`
