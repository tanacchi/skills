---
name: toolchain-operations
description: Use this skill when operating Your Quiz repository tooling: setup, git workflow, mise, npm/pnpm scripts, TypeSpec commands, Markdown/TypeScript/TypeSpec conventions, generated artifacts, validation commands, or safe command boundaries.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires access to Your Quiz tooling docs and the target repository.
---

# Toolchain Operations

## 利用タイミング

Your Quiz の repository setup、git、mise、npm/pnpm、TypeSpec、Markdown、TypeScript、generated artifact、validation command、安全なコマンド実行方針を扱うときに使う。

## 確認する入力

- 作業対象 repo と package/workspace location
- 利用する scripts、tool versions、generated output
- Git state and uncommitted changes
- Whether a command writes files, hits network, or needs approval

## Workflow

1. `references/repository-and-tooling.md` で setup、git、mise、npm/pnpm、TypeSpec command policy を確認する。
2. `references/language-and-command-rules.md` で Markdown、TypeScript、TypeSpec、generated artifacts の扱いを確認する。
3. 既存 scripts を優先し、ad hoc command は必要性を説明する。
4. Mutating command、network access、destructive command、secret exposure の risk を確認する。
5. 実行後は relevant validation と git diff/status を確認する。

## Output Format

- Commands selected and why
- Files/artifacts expected to change
- Validation results
- Risks, approvals, or skipped checks

## Guardrails

- Secrets、tokens、machine-specific paths を追加しない。
- Generated files は documented command で更新する。
- Destructive command は明示承認なしに実行しない。
- Existing user changes を revert しない。
- Tool docs と project scripts を優先する。

## Evaluation Scenarios

- TypeSpec を変更した後に OpenAPI/types を再生成する手順を確認する。
- pnpm script の選択と CI 相当 validation を決める。
- Dirty worktree で安全に git diff/status を確認して作業範囲を分ける。

## Related References

- `references/repository-and-tooling.md`
- `references/language-and-command-rules.md`
