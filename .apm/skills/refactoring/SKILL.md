---
name: refactoring
description: Use this skill when planning, implementing, or reviewing safe incremental refactoring while preserving behavior and reducing complexity.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# Refactoring

## 利用タイミング

既存 behavior を保ったまま、構造改善、重複削減、命名整理、責務分離を行うときに使う。

## 確認する入力

- 現在の behavior と test
- 呼び出し元と public contract
- refactor の目的
- 変更範囲と rollback path

## Workflow

1. baseline behavior を確認する。
2. public contract を変えるかどうかを明示する。
3. 小さな mechanical change に分ける。
4. 途中で test を実行できる状態を保つ。
5. unrelated cleanup を混ぜない。

## Output Format

- Refactor goal
- Behavior preservation notes
- Change steps
- Tests run
- Remaining risks

## Guardrails

- feature change と refactor を混ぜない。
- test がない critical path は先に characterization test を検討する。
- 大きな rename や move は impact を確認してから行う。

## Related References

- `references/safe-refactoring.md`
