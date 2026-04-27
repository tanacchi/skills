---
name: creating-prs-from-diffs
description: Use this skill when turning uncommitted git changes into well-scoped commits and draft pull requests, including diff grouping, branch naming, PR title/body drafting, and safe publish flow.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access. Publishing requires a GitHub remote and authenticated GitHub tooling.
---

# Creating PRs From Diffs

## 利用タイミング

未コミット差分から、適切な単位の commit と draft PR を作るときに使う。単に PR 本文案だけを作る場合にも使える。

## 確認する入力

- `git status --short` と current branch
- unstaged / staged diff
- 変更ファイルの意図と関連性
- remote、default branch、PR ごとの base branch 候補
- 利用可能な validation command
- PR 間の依存関係、parallel / stacked の可否

## Workflow

1. 差分全体を読み、変更意図ごとに group 化する。
2. unrelated change、生成物、機密情報、作業途中ファイルを分離する。
3. group 間の依存関係を調べ、PR dependency graph を作る。
4. PR tree を作り、parallel PR と stacked PR の構造、base branch、merge order を user に確認してもらう。
5. user が PR tree を確認した後で、各 PR の branch 名、commit message、title、body を作る。
6. staging 対象を明示し、mixed worktree では `git add -A` を避ける。
7. commit、push、draft PR 作成の前に scope と base branch を再確認する。
8. validation を実行し、失敗時は原因と残リスクを PR body に反映する。
9. draft PR の URL、branch、base branch、commit、validation 結果を要約する。

## Output Format

- Diff grouping
- PR dependency graph
- PR tree for user confirmation
- Recommended PR split
- Parallelizable PRs and stacked PRs
- Branch and commit plan
- Base branch per PR and merge order
- Draft PR title/body
- Validation plan
- Confirmation points before publish

## Guardrails

- unrelated user changes を silent staging しない。
- default は draft PR とする。
- branch 作成、commit、push、PR 作成の前に PR tree を提示し、user の確認を得る。
- 依存がない PR は default branch から並列作成する。
- 前段変更なしに成立しない PR だけ stacked PR にし、base branch と merge order を PR body に書く。
- stacked PR は reviewer が依存関係を追えるように、前提 PR、後続 PR、rebase/update 方針を明示する。
- destructive command は明示承認なしに実行しない。
- GitHub remote や authentication が不明な場合は publish せず、blocker を説明する。
- PR が大きすぎる場合は分割案を先に提示する。

## Related References

- `references/diff-grouping.md`
- `references/pr-publish-checklist.md`
