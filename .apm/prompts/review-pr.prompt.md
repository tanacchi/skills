# Review PR

## Objective

変更差分を correctness、regression risk、security、maintainability、test coverage の観点でレビューする。

## Context To Gather

- PR の目的
- changed files
- 関連する tests
- 既存 API/schema/behavior

## Steps

1. diff と関連ファイルを読む。
2. 変更意図を要約する。
3. blocking issue を優先して探す。
4. test gap を確認する。
5. severity 順に指摘する。

## Output Format

- Blocking issues
- Non-blocking issues
- Nit
- Test gaps
- Summary

## Safety

根拠のない断定を避け、file reference と再現条件を添える。
