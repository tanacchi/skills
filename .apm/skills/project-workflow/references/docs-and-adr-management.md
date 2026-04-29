# Docs And ADR Management: Your Quiz

## Documentation Rules

- Keep project facts in `docs/project/`; keep reusable instructions in `docs/instructions/`.
- Keep phase-specific output in the phase directory documented by the workflow guide.
- Preserve traceability from requirements to DDD, API, UI, tests, and ADRs.
- Update docs when a behavior, interface, context boundary, non-functional target, or public workflow changes.
- Do not copy long source docs into multiple places. Summarize once and link source docs.

## ADR Rules

- Create or update an ADR for architecture pattern, technology selection, data/storage strategy, API style, hosting, non-functional strategy, or durable cross-team rule.
- New ADRs start as `Proposed`; only mark `Accepted` after explicit approval or existing documented status.
- ADR file names use a zero-padded number and concise English slug.
- Update ADR index/readme when ADRs are added or status changes.
- If current work contradicts an accepted ADR, do not silently overwrite the decision. Propose a superseding ADR.

## Future Work Rules

- Move deferred requirements to Future Work when they are real but outside the current scope.
- Do not use Future Work to hide incomplete acceptance criteria for the current story.
- Mark uncertainty as open questions rather than project facts.

## Safety Rules

- Do not add secrets, tokens, or machine-specific absolute paths.
- Do not use `docs/tmp` as source of truth unless an adoption decision is documented.
- Do not read or summarize restricted test quiz files under `docs/instructions/shared/tests/` unless the user explicitly instructs it; README warnings are enough for skill guidance.

## Source Docs
- `../your-quiz/docs/instructions/shared/workflow/00.03_docs.md`
- `../your-quiz/docs/instructions/shared/workflow/00.04_adr-management.md`
- `../your-quiz/docs/project/adr/README.md`
- `../your-quiz/docs/project/adr/templates/adr-template.md`
