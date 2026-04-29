# DB And Data Design: Your Quiz

## Data Ownership

- Align tables and repositories with bounded contexts and aggregate boundaries.
- Keep aggregate transaction boundaries explicit.
- Prefer ID references across aggregates; avoid accidental cross-aggregate object graphs.
- Keep read models/search projections separate from command-side invariants when needed.

## Persistence Baseline

- SQLite / Cloudflare D1 is the accepted persistence direction.
- Drizzle ORM is the accepted ORM direction.
- Schema and migration plans should be reproducible and reviewable.
- DB constraints can support domain invariants but should not be the only place domain rules live.

## Offline And Sync Data

- Treat local/offline data as a specialized representation.
- Define sync item lifecycle, conflict resolution, idempotency, and cleanup.
- Do not leak IndexedDB/local cache schema into public domain APIs without a transformation layer.

## Review Checks

- Does the DB design follow DDD aggregate ownership?
- Does it support required query patterns without compromising write consistency?
- Are migration, rollback, seed/test data, and retention/anonymization needs clear?
- Are D1 limits and edge runtime constraints considered?

## Source Docs

- `../your-quiz/docs/instructions/shared/workflow/05.01_db-design.md`
- `../your-quiz/docs/project/architecture/data-architecture.md`
- `../your-quiz/docs/project/architecture/communication-patterns.md`
- `../your-quiz/docs/project/adr/0007-database.md`
- `../your-quiz/docs/project/adr/0009-orm-selection.md`
- `../your-quiz/docs/project/adr/0012-database-hosting.md`
- `../your-quiz/docs/project/adr/0017-aggregate-design.md`
- `../your-quiz/docs/project/adr/0019-repository-pattern-adoption.md`
