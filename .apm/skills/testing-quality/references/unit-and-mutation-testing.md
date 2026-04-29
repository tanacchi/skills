# Unit & Mutation Testing: Your Quiz

## Unit Tests With Vitest

- Use unit tests for aggregate invariants, value object validation, domain services, use cases, helpers, and response mapping.
- Prefer parameterized tests for boundary values and error cases.
- Test public behavior and contracts; avoid tests that lock incidental implementation details.
- Keep fixtures/builders readable and close to domain language.
- Coverage target is high, but meaningful behavior coverage matters more than line-count gaming.

## Mutation Testing With Stryker

- Run mutation testing after unit coverage is in place for risk-heavy domain/API logic.
- Surviving mutants identify missing assertions or equivalent mutations.
- Add tests for meaningful survivors in conditions, branches, validation, and error handling.
- Document equivalent mutants rather than adding brittle tests for behavior that cannot change outputs.

## TDD Flow

- For new behavior, confirm red before green when feasible.
- Refactor after tests pass while preserving domain/API behavior.
- When changing existing behavior, write regression tests around the bug or contract first.

## Test Data

- Use fixture/builders for normal, boundary, invalid, and conflict cases.
- Avoid production data and secrets in test fixtures.
- Keep D1/DB tests isolated through test env.

## Source Docs
- `../your-quiz/docs/instructions/shared/workflow/09.01_unit-testing.md`
- `../your-quiz/docs/instructions/shared/workflow/09.02_mutation-testing.md`
- `../your-quiz/docs/instructions/shared/workflow/10.01_implementation.md`
