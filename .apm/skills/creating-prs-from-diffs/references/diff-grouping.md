# Diff Grouping

- 同じ user-visible behavior を変える差分は同じ PR 候補にする。
- refactor と feature change は分ける。
- generated file、lockfile、snapshot は原因となる変更と一緒に扱う。
- docs/test-only change は実装変更と関係が明確な場合だけ同じ PR にする。
- review しやすい PR は、目的、影響範囲、validation が一文で説明できる。
- 分割すると壊れる依存関係がある場合は、PR body に理由を書く。

## PR Dependency Planning

- 依存がない group は default branch から並列作成できる PR として扱う。
- public API、schema、shared helper、migration、基盤 refactor などを前提にする group は stacked PR として扱う。
- stacked PR は、前提 PR を parent、後続 PR を child とする tree で表す。
- 同じ parent から独立して派生できる child PR は sibling として並列作成できる。
- tree を分けると conflict しやすい同一 file 編集がある場合は、競合リスクを PR body に書く。
- branch 作成、commit、push、PR 作成の前に、PR tree を user に確認してもらう。

## Branch / Commit Naming

- Branch: `codex/<short-kebab-summary>`
- Commit: imperative または短い過去形ではなく、変更内容が分かる現在形にする。
- PR title: user-visible impact が分かる短い文にする。
