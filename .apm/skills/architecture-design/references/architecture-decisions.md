# Architecture Decisions: Your Quiz

## Baseline Architecture

- System architecture: modular monolith.
- Application architecture: hexagonal architecture.
- Frontend: Next.js 15 App Router with PWA/mobile-first direction.
- Styling/state: Tailwind CSS and Jotai.
- Backend: Hono on Cloudflare Workers.
- API style: REST-first, TypeSpec schema-first.
- Persistence: SQLite / Cloudflare D1 with Drizzle ORM.
- Testing: PactumJS, Vitest, Playwright, Stryker.

## Communication Patterns

- Frontend communicates with Hono APIs through documented contracts.
- Cross-context effects should use API boundaries, domain events, or explicit transformation layers.
- Offline sync should isolate local/offline representations from core domain APIs.
- Monitoring/operations APIs should expose health and metrics without leaking sensitive internals.

## ADR Handling

- Use existing ADRs as source of truth for framework, hosting, DB, validation, HTTP client, API style, bounded contexts, aggregate design, repository pattern, BDD framework, and TypeSpec/Hono integration.
- If changing an accepted ADR, create a superseding decision rather than silently contradicting it.
- If relying on a proposed ADR, confirm status or record the assumption.

## Source Docs

- `../your-quiz/docs/instructions/shared/workflow/02.01_architecture.md`
- `../your-quiz/docs/instructions/shared/workflow/06.01_tech-selection.md`
- `../your-quiz/docs/project/architecture/README.md`
- `../your-quiz/docs/project/architecture/system-overview.md`
- `../your-quiz/docs/project/architecture/tech-selection.md`
- `../your-quiz/docs/project/architecture/communication-patterns.md`
- `../your-quiz/docs/project/architecture/diagrams/*.md`
- `../your-quiz/docs/project/adr/*.md`
