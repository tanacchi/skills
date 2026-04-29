# Repository And Tooling: Your Quiz

## Repository Setup

- Use repository setup docs before changing onboarding or tool assumptions.
- Prefer existing package manager and scripts over global one-off commands.
- Use mise docs for runtime/tool version assumptions.
- Keep setup steps reproducible and avoid machine-specific paths.

## Git

- Inspect `git status` before mutating files.
- Keep commits scoped and reviewable when committing is requested.
- Do not discard unrelated user changes.
- Avoid destructive commands unless explicitly approved.

## npm / pnpm Scripts

- Use documented scripts for dev, build, typecheck, test, TypeSpec generation, BDD, mutation, and deployment operations.
- Prefer workspace-aware commands from project docs.
- If a script rewrites generated artifacts, mention expected files before running.

## TypeSpec Tooling

- TypeSpec is used to generate OpenAPI and TypeScript-facing contracts.
- Use documented `tsp compile` / generation scripts rather than hand-editing generated OpenAPI.
- Check generated diffs after running schema commands.

## Source Docs

- `../your-quiz/docs/instructions/shared/repository-setup.md`
- `../your-quiz/docs/instructions/shared/tools/git.md`
- `../your-quiz/docs/instructions/shared/tools/mise.md`
- `../your-quiz/docs/instructions/shared/tools/npm.md`
- `../your-quiz/docs/instructions/shared/tools/typespec.md`
- `../your-quiz/docs/instructions/project/pnpm-scripts.md`
