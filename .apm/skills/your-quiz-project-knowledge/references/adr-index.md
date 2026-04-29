# ADR Index: Your Quiz

Use this as a routing index. Read the source ADR before changing a decision, resolving a conflict, or relying on fine details.

| ADR | Decision | Status | Practical impact |
| --- | --- | --- | --- |
| 0001 | Modular monolith | Accepted | Keep one deployable system with clear internal module boundaries. |
| 0002 | Hexagonal architecture | Accepted | Keep domain logic independent from framework, DB, and transport. |
| 0003 | Next.js 15 App Router | Accepted | Frontend work should assume Next.js App Router and PWA readiness. |
| 0004 | Tailwind CSS | Accepted | UI styling should use Tailwind and the project design tokens. |
| 0005 | Jotai | Accepted | Shared frontend state should use atomic state where local state is insufficient. |
| 0006 | Hono | Accepted | Backend HTTP implementation should use Hono and stay lightweight. |
| 0007 | SQLite + Cloudflare D1 | Accepted | Persistence design should fit D1/SQLite constraints and edge execution. |
| 0008 | API hosting | Accepted | Check source ADR before changing API deployment assumptions. |
| 0009 | Drizzle ORM | Accepted | Repository/persistence implementation should favor Drizzle. |
| 0010 | Zod | Accepted | Runtime validation should use Zod and align with TypeScript types. |
| 0011 | Native fetch | Accepted | Avoid adding HTTP client dependencies without a new decision. |
| 0012 | D1 database hosting | Accepted | Database hosting is Cloudflare D1 unless explicitly revisited. |
| 0013 | Frontend hosting | Accepted | Frontend hosting assumptions follow this ADR. |
| 0014 | API hosting | Accepted | API hosting assumptions follow this ADR. |
| 0015 | REST API | Accepted | API design is REST-first; avoid GraphQL-by-default. |
| 0016 | Bounded context division | Accepted | Keep Quiz Management, Quiz Learning, User Session, Offline Sync boundaries clear. |
| 0017 | Aggregate design | Accepted | Keep four main aggregate boundaries unless a new ADR supersedes them. |
| 0018 | Domain service extraction | Accepted | Use domain services for cross-aggregate or complex domain decisions. |
| 0019 | Repository pattern | Accepted | Keep persistence behind repository interfaces. |
| 0020 | Cucumber.js + Vitest BDD | Superseded | Do not choose Cucumber.js for new BDD work; see ADR-0023. |
| 0021 | Quiz solution response strategy | Proposed | Union type + optional field selection strategy; confirm status before relying on it. |
| 0022 | TypeSpec schema-first Hono integration | Accepted | TypeSpec is the API contract source; generated types feed Hono implementation. |
| 0023 | PactumJS BDD migration | Accepted | New BDD/API tests should use PactumJS rather than Cucumber.js. |

## Use In Reviews

- If a task proposes a different framework, database, API style, test framework, or state library, cite the relevant ADR and ask for an ADR update instead of silently drifting.
- If an ADR is `Proposed`, treat it as a design candidate, not a settled rule.
- If source docs conflict, prefer the newest accepted ADR over older workflow examples.

## Source Docs
- `../your-quiz/docs/project/adr/*.md`
