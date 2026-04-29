# Language And Command Rules: Your Quiz

## Markdown

- Keep docs structured for downstream agents: purpose, constraints, output, completion criteria where workflow docs require it.
- Prefer concise checklists and traceable source links over copied long explanations.
- Keep Source Docs references accurate when summarizing docs into skills.

## TypeScript

- Prefer strict typing and project conventions.
- Avoid `any`, broad assertions, ignored type errors, and non-null assertions unless locally justified.
- Keep domain, application, API, and persistence concerns separated.
- Use generated types where API contracts already define shapes.

## TypeSpec

- Keep schema-first API definitions in TypeSpec.
- Generated OpenAPI and generated TypeScript types should be regenerated, not manually patched.
- Keep namespace/model/operation organization aligned with bounded contexts.

## Command Safety

- Read docs and inspect state before running mutating commands.
- Distinguish validation commands from rewriting commands.
- Network or install commands may require approval in restricted environments.
- Never expose secrets in command output, test fixtures, or docs.

## Source Docs

- `../your-quiz/docs/instructions/shared/languages/markdown.md`
- `../your-quiz/docs/instructions/shared/languages/typescript.md`
- `../your-quiz/docs/instructions/shared/languages/typespec.md`
- `../your-quiz/docs/instructions/shared/tools/npm.md`
- `../your-quiz/docs/instructions/shared/tools/typespec.md`
