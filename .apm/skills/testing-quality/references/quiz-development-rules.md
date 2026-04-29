# Quiz Development Rules: Essential Checklist

This file intentionally does not summarize restricted quiz question/answer files. It captures test and workflow guardrails from readable workflow/tool/language docs plus the tests README warning.

## Restricted Test Docs

- Do not read quiz question, answer, or complete files under `../your-quiz/docs/instructions/shared/tests/` unless explicitly instructed.
- Reading the README warning is allowed and should guide behavior.
- Do not use restricted quiz content as source material for skills.

## Workflow And Quality Guardrails

- Do not skip specification/design phases for new feature behavior.
- Keep DDD before DB design when domain invariants are still unclear.
- Prefer TDD/BDD where workflow docs require executable specs before implementation.
- Use project tool docs for git, npm/pnpm, mise, TypeSpec, Markdown, and TypeScript conventions.
- Avoid `any`, broad assertions, and ignored type errors unless a local rule explicitly permits and the risk is reported.
- Propose ADRs for durable architecture or technology decisions.

## Review Checklist

- Does the test validate business behavior or only implementation shape?
- Are both success and failure paths covered?
- Are API tests aligned with TypeSpec/OpenAPI contracts?
- Are DB-backed tests isolated from production data?
- Are deferred cases recorded as test gaps or Future Work?

## Source Docs
- `../your-quiz/docs/instructions/shared/tests/README.md`
- `../your-quiz/docs/instructions/shared/workflow/00.01_common.md`
- `../your-quiz/docs/instructions/shared/workflow/00.02_workflow.md`
- `../your-quiz/docs/instructions/shared/languages/typescript.md`
- `../your-quiz/docs/instructions/shared/tools/git.md`
- `../your-quiz/docs/instructions/shared/tools/npm.md`
- `../your-quiz/docs/instructions/shared/tools/typespec.md`
