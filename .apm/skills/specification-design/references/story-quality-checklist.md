# Story Quality Checklist: Your Quiz

## Story Shape

- Who: actor/persona is named.
- What: user-visible action or outcome is clear.
- When: trigger or situation is stated.
- Where: screen/API/context is known where relevant.
- Why: learning, creation, quality, history, offline, or search value is explicit.
- How well: acceptance criteria and non-functional constraints are measurable.

## Acceptance Criteria

- Include at least one success path and relevant error paths.
- State observable behavior, not only implementation steps.
- Include validation, empty, loading, offline, permission, and conflict states when relevant.
- Identify data persistence or sync expectations.
- Identify API/UI/DDD/test artifacts expected downstream.

## Future Work Split

- Move real but deferred capabilities to Future Work.
- Do not defer core acceptance criteria needed for the current MVP behavior.
- Mark assumptions and open questions separately from scope exclusions.
- Keep future enhancements traceable to the original story or requirement.

## Review Questions

- Can this story be tested by BDD or E2E?
- Does the story imply a new domain concept or invariant?
- Does the story require a new API contract or just UI composition?
- Does it affect architecture, data retention, security, or performance?
- Is the expected failure behavior clear enough for implementation?

## Source Docs

- `../your-quiz/docs/instructions/shared/workflow/01.01_specification.md`
- `../your-quiz/docs/project/specifications/README.md`
- `../your-quiz/docs/project/specifications/user-stories/README.md`
- `../your-quiz/docs/project/specifications/future-work.md`
