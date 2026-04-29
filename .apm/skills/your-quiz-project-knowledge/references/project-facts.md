# Project Facts: Your Quiz

## Product

- Product name: Your Quiz.
- Vision: いつでもどこでも、手軽にクイズ学習。
- Core value: 匿名で手軽に始められ、スワイプ中心の回答体験で学習効率を上げる。
- Primary user: ログインなしでクイズを解きたい学習者。作成・承認・履歴確認も扱う。
- Primary environment: smartphone browser, mobile-first, PWA/offline support.

## Technology

- Frontend: Next.js 15 App Router, Tailwind CSS, Jotai.
- Backend: Hono on Cloudflare Workers, TypeScript.
- Persistence: SQLite / Cloudflare D1, Drizzle ORM.
- API schema: TypeSpec, OpenAPI generation, openapi-typescript SDK/type generation.
- Testing: PactumJS for BDD/API, Vitest for unit/TDD, Playwright for E2E, Stryker for mutation testing.
- API style: REST-first, with ADR-0021 field selection / union response strategy where needed.

## Non-Functional Targets

- API response: p95 100ms for core operations unless a narrower API-specific target exists.
- UI: 375px mobile-first, 44px minimum touch targets.
- Availability: monthly 99.5% target with offline mode for degraded network conditions.
- Security: anonymous session model, JWT/device identification where applicable, sanitized user content.
- Data retention: approved quizzes are durable; answer history is anonymized after the documented retention period.

## Common Design Pressure

- Keep anonymous use simple while preserving creator/session permissions.
- Keep quiz answering fast; avoid adding cross-context joins to the hot path.
- Treat offline sync as a specialized context instead of scattering sync logic across all features.
- Preserve TypeScript type safety from TypeSpec through runtime validation and domain logic.

## Source Docs
- `../your-quiz/docs/project/specifications/requirements/requirements-quiz.md`
- `../your-quiz/docs/project/specifications/user-stories/user-story-quiz.md`
- `../your-quiz/docs/project/architecture/system-overview.md`
- `../your-quiz/docs/project/architecture/tech-selection.md`
- `../your-quiz/docs/project/architecture/non-functional-requirements.md`
