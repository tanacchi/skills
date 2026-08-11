---
name: toolchain-conventions
description: Use when setting up or operating a coding project's toolchain — git workflow (commit messages, branch naming, hook policy), package manager (pnpm/npm), version manager (mise), markdown linting, CI/CD quality gates, or repository bootstrap. Triggers on requests about commit conventions, branch strategy, pnpm commands, mise.toml, pre-commit hooks, lockfile management, or repository initialization.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# ツールチェーン規約

## 利用タイミング

- git コミット・ブランチ・PR 操作の規約を確認・適用するとき
- pnpm / npm コマンドを選択・実行するとき
- mise.toml でツールバージョンを管理・更新するとき
- Markdown ファイルの lint チェックを行うとき
- pre-commit フックや CI/CD パイプラインを設定・修正するとき
- 新規リポジトリのセットアップを行うとき

## 確認する入力

- 対象リポジトリと package.json / mise.toml の位置
- 現在の git state（`git status`）と uncommitted changes
- 使用するスクリプト名・ツールバージョン
- コマンドがファイルを書き換えるか、ネットワークにアクセスするか

## ワークフロー

1. `references/git-and-branch-conventions.md` でコミット・ブランチ・PR ルールを確認する。
2. `references/package-and-version-management.md` で pnpm コマンド選択と mise.toml 管理方針を確認する。
3. 既存の package.json scripts を優先し、ad hoc コマンドは理由を明示してから実行する。
4. mutating / destructive / network アクセスコマンドはリスクを確認してから実行する。
5. 実行後は `git status` と validation コマンドの終了ステータスを確認する。
6. Markdown を編集した場合は `pnpm run lint:md` でエラーがないことを確認する。

## 出力形式

- 選択したコマンドと選択理由
- 変更が予想されるファイル・成果物
- validation 結果（終了ステータスとエラー内容）
- リスク・承認事項・スキップしたチェックの明示

## ガードレール

- `git commit --no-verify` / `-n` は絶対に使わない（pre-commit フックをスキップしない）。
- npm / yarn コマンドを使わない（pnpm を使う）。
- lockfile（pnpm-lock.yaml）を手動編集しない。
- secrets・tokens・マシン固有パスをコードやログに含めない。
- destructive コマンド（`git reset --hard`、`git push --force` 等）は明示承認なしに実行しない。
- グローバルインストールされたツールを使用せず、mise 管理下のバージョンを使う。

## 評価シナリオ

- 「コミットして」と言われたとき、`git status` で変更ファイルを確認し、最小単位に分割してコミットするフローを実行できるか。
- pnpm でパッケージを追加する際、`npm install` ではなく `pnpm add` を選択できるか。
- 新規プロジェクトで mise.toml が存在しない場合、作成して `mise install` を実行する手順を案内できるか。
- pre-commit フックが失敗したとき、`--no-verify` を使わずエラーを修正して再コミットできるか。

## 関連リファレンス

- `references/git-and-branch-conventions.md`
- `references/package-and-version-management.md`
