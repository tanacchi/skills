---
name: iterating-pr-quality
description: Use this skill when repeatedly self-reviewing, improving, re-reviewing, and zero-base reviewing a pull request to optimize correctness, tests, reviewability, scope, and PR structure.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access. GitHub metadata is optional but useful for existing pull requests.
---

# Iterating PR Quality

## 利用タイミング

PR を提出前または提出後に、反復的にセルフレビューして品質と構成を最適化するときに使う。

## 確認する入力

- PR diff または current branch diff
- PR title/body
- commit list
- test と CI 結果
- review comments があればその内容

## Workflow

1. PR の意図、scope、user impact を要約する。
2. 1 回目のセルフレビューで correctness、regression、security、test gap を見る。
3. 改善 patch を小さく入れ、validation を実行する。
4. 再レビューで直した箇所と副作用を確認する。
5. ゼロベースレビューとして「この PR を初見で受け取った reviewer が理解できるか」を見る。
6. 必要なら PR 分割、commit 整理、title/body 補強、test 追加を提案する。
7. 最終的な PR 構成と残リスクをまとめる。

## Output Format

- Current PR assessment
- Self-review findings
- Improvements made or proposed
- Zero-base review findings
- Final PR structure recommendation
- Validation and residual risk

## Guardrails

- code change と GitHub comment/review submit は別操作として扱う。
- review comment の投稿や thread resolve は明示依頼なしに行わない。
- 大きな rewrite より reviewability を改善する小さな修正を優先する。
- PR 分割が望ましい場合は、なぜ分けるべきかを具体的に説明する。

## Related References

- `references/iterative-review-checklist.md`
- `references/pr-structure-checklist.md`
