# Non-Functional Checklist: Your Quiz

## Performance

- Identify the operation-specific p95 target before choosing architecture.
- Protect quiz answering and judgement latency from unnecessary cross-context work.
- Use caching, indexes, pagination, and generated contracts where documented.
- Confirm UI interaction performance for mobile-first flows.

## Availability And Reliability

- Design offline-capable behavior where user value depends on unstable network support.
- Define retry/idempotency for sync and event-driven operations.
- Keep failure modes visible to UI/API consumers with recoverable states.

## Security And Privacy

- Preserve anonymous usage model and session ownership rules.
- Sanitize user-generated quiz content.
- Avoid leaking secrets, device fingerprints, salts, internal ids, or operational details.
- Apply rate limiting and abuse prevention for creation, search, and high-volume answer flows.

## Operability

- Include structured errors/request ids where API common specs require them.
- Consider health, metrics, and logs for API operations.
- Keep generated artifacts and scripts reproducible.

## Cost And Maintainability

- Prefer the existing Cloudflare/Vercel/GitHub Actions oriented stack unless a new ADR changes it.
- Avoid introducing libraries that duplicate selected stack responsibilities.
- Keep module boundaries understandable for a small team.

## Source Docs

- `../your-quiz/docs/project/architecture/non-functional-requirements.md`
- `../your-quiz/docs/project/api-design/non-functional-requirements.md`
- `../your-quiz/docs/project/api-design/api-catalog/08-operations.md`
- `../your-quiz/docs/instructions/shared/workflow/02.01_architecture.md`
