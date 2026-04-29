# API Implementation Checklist: Your Quiz

## Before Implementation

- [ ] Relevant TypeSpec/API catalog entry exists or the contract change is part of this task.
- [ ] Endpoint belongs to the correct bounded context.
- [ ] Request/response/error shapes and status codes are documented.
- [ ] D1/Drizzle bindings and environment names are known.
- [ ] Test level is selected: BDD/API, unit, mutation, E2E, or focused regression.

## During Implementation

- [ ] Hono route is thin; application/domain logic is outside the handler.
- [ ] JSON parsing and validation are separate.
- [ ] Zod schemas align with generated TypeSpec types.
- [ ] Expected errors are typed and mapped to common error response format.
- [ ] `as any`, `@ts-ignore`, and broad non-null assertions are avoided.
- [ ] Repository code does not leak SQL/D1 details into domain objects.
- [ ] User content is sanitized where API design requires it.

## Before Review

- [ ] Typecheck passes.
- [ ] Relevant tests pass or skipped tests are justified.
- [ ] Generated artifacts are regenerated through scripts when required.
- [ ] API catalog and TypeSpec contract are consistent.
- [ ] Error response examples cover success, validation, not found, conflict, auth/rate limit where applicable.

## Useful Commands

- Prefer project scripts from `pnpm-scripts.md` over ad hoc commands.
- Use TypeSpec generation commands from shared TypeSpec tooling docs.
- Use test env / D1 test bindings for DB-backed tests.

## Source Docs
- `../your-quiz/docs/instructions/project/README.md`
- `../your-quiz/docs/instructions/project/api-implementation-rules.md`
- `../your-quiz/docs/instructions/project/pnpm-scripts.md`
- `../your-quiz/docs/instructions/shared/tools/typespec.md`
- `../your-quiz/docs/instructions/shared/tools/npm.md`
