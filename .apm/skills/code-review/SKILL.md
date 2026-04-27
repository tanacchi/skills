---
name: code-review
description: Use this skill when reviewing code changes, pull requests, diffs, or implementation quality for correctness, regressions, maintainability, security, tests, and architecture.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# Code Review

## 利用タイミング

コードレビュー、PR レビュー、diff review、実装品質の確認を依頼されたときに使う。

## 確認する入力

- 変更差分と関連ファイル
- 変更の目的
- 既存テストと失敗ログ
- 影響する API、schema、設定

## Workflow

1. 変更意図を把握する。
2. correctness と regression risk を最優先で確認する。
3. security、データ整合性、互換性、error handling を見る。
4. test coverage と不足している scenario を確認する。
5. maintainability と architecture consistency を見る。
6. 指摘は severity 順に、file reference 付きで出す。

## Output Format

- Blocking issues
- Non-blocking issues
- Nit
- Test gaps
- Summary

## Guardrails

- style preference だけの指摘を blocking にしない。
- 根拠のない推測で defect と断定しない。
- 可能なら再現条件、入力、期待値を明示する。

## Related References

- `references/review-checklist.md`
