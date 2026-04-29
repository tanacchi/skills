# BDD & E2E Testing Strategy: Your Quiz

## BDD/API With PactumJS

- PactumJS is the BDD/API test direction for new scenarios.
- Focus on executable business specifications: setup, action, expected API/domain result.
- Keep scenarios tied to user stories, success scenarios, error scenarios, and API contracts.
- Prefer data-driven examples for boundary/error permutations when they improve readability.
- Verify OpenAPI/API catalog consistency where tooling supports it.

## E2E With Playwright

- Use E2E for key user journeys, not every branch.
- Priority flows: quiz answering, quiz creation, approval if available, answer history, offline sync, search.
- Include degraded states where product value depends on them: offline, network failure, validation, empty data.
- Use stable selectors and page objects only when they reduce duplication and brittleness.

## Mock And Environment Boundaries

- Use real API contracts where possible.
- Mock external services at boundaries, not the behavior being validated.
- Use project test env / D1 test binding for DB-backed tests.
- Control time/randomness only where it makes assertions deterministic.

## Acceptance Signals

- BDD tests fail before implementation when they describe new behavior.
- E2E tests cover a representative happy path and at least one meaningful failure/degraded path for critical flows.
- Test names describe user-visible behavior, not internal implementation details only.

## Source Docs
- `../your-quiz/docs/instructions/shared/workflow/07.01_bdd-implementation.md`
- `../your-quiz/docs/instructions/shared/workflow/11.01_e2e-testing.md`
- `../your-quiz/docs/project/specifications/success-scenarios/success-quiz.md`
- `../your-quiz/docs/project/specifications/error-scenarios/error-quiz.md`
