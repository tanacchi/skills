# skills

個人用の AI coding agent 向け skills、prompts、instructions、tool wrapper を管理するリポジトリです。

公開用または長期運用のリポジトリ名としては `agent-skills` を推奨します。現在の repository は `skills` として初期化済みのため、この名前を前提に構成しています。

## このリポジトリの方針

- `.apm/` を正本として扱う。
- ルート直下の `skills` は `.apm/skills` への symlink として置く。
- `.codex/`, `.claude/`, `.cursor/`, `.opencode/`, `.gemini/` は各 agent 用の薄い wrapper として扱う。
- スクリプトはすべて `scripts/` 配下に置く。
- global install や destructive command は自動実行しない。
- secrets、API key、token、machine-specific path は保存しない。

## 初回セットアップ

### 1. リポジトリを確認する

```sh
pwd
git status --short
ls -la
```

この repository は Git 管理下で使う前提です。既存変更がある場合は、先に内容を確認してから作業してください。

### 2. ローカル環境を確認する

```sh
scripts/bootstrap.sh
```

`scripts/bootstrap.sh` は、必要になりやすい CLI が入っているかだけを確認します。ツールの自動 install はしません。

確認対象:

- `git`
- `node`
- `npm`
- `codex`
- `claude`
- `apm`
- `gemini`
- `opencode`

不足しているツールがあれば、表示された install command を確認してから手動で実行してください。

### 3. skills 構成を検証する

```sh
scripts/validate.sh
```

`scripts/validate.sh` は以下を確認します。

- 主要ファイルが存在すること
- 各 `.apm/skills/*/SKILL.md` が YAML frontmatter で始まること
- `SKILL.md` に `name` と `description` があること
- skill directory name と `name:` が一致すること

検証に失敗した場合は、出力された file path と理由を直してから再実行してください。

### 4. skills をインストールする

```sh
scripts/install.sh
```

`scripts/install.sh` は対話式の installer です。次の scope を選べます。

- `project`: この repository 内へ install する。`skills -> .apm/skills` を検証し、APM があれば `apm install` で agent-specific directory へ展開する。
- `global`: user-level の agent skills directory へ install する。
- `both`: `project` と `global` の両方を行う。

global install は default では symlink 方式です。既存ファイルがある場合は上書きせず skip します。

非対話で実行する場合:

```sh
scripts/install.sh --scope project --yes
scripts/install.sh --scope global --mode symlink --yes
scripts/install.sh --scope both --mode symlink --yes
```

事前確認だけしたい場合:

```sh
scripts/install.sh --scope both --dry-run --yes
```

旧来の `scripts/sync-skills.sh` は互換用です。新しい install には `scripts/install.sh` を使ってください。

## 推奨ツールの導入

global install は実行前に内容を確認してください。この repository の script は自動 install しません。

```sh
# Codex
npm i -g @openai/codex
codex

# Claude Code
curl -fsSL https://claude.ai/install.sh | bash
claude --version
claude doctor

# APM
curl -sSL https://aka.ms/apm-unix | sh
apm --version
apm init
apm install

# Gemini CLI
npm install -g @google/gemini-cli

# OpenCode
curl -fsSL https://opencode.ai/install | bash

# Cursor CLI
curl https://cursor.com/install -fsS | bash
```

APM を導入した場合は、まず version を確認してから `apm install` を実行してください。

```sh
apm --version
apm install
```

## Directory Structure

```text
.apm/          portable skills, instructions, prompts; source of truth
skills -> .apm/skills
.codex/       Codex-specific instructions and prompt wrappers
.claude/      Claude Code command wrappers
.cursor/      Cursor rules
.opencode/    OpenCode command wrappers
.gemini/      Gemini command wrappers
evals/         future regression cases
scripts/      bootstrap, validation, sync helpers
```

## Scripts

この repository の実行用 script は `scripts/` 配下に集約します。

- `scripts/bootstrap.sh`: local CLI の有無を確認する。install はしない。
- `scripts/install.sh`: project/global/both を選んで skills を install する。
- `scripts/validate.sh`: skill metadata と必須ファイルを検証する。
- `scripts/sync-skills.sh`: 互換用。`skills -> .apm/skills` symlink と wrapper 同期方針を確認する。

script を追加する場合も `scripts/` 配下に置き、safe, idempotent, readable な実装にしてください。

## How To Add A Skill

1. directory を作る。`skills/` は `.apm/skills/` への symlink なので、どちらの path から作っても同じ場所を編集します。

```sh
mkdir -p skills/<skill-name>/references
```

2. `skills/<skill-name>/SKILL.md` を作る。

3. YAML frontmatter を追加する。

```yaml
---
name: <skill-name>
description: Use this skill when ...
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---
```

4. `SKILL.md` には、利用タイミング、確認する入力、workflow、output format、guardrails、related references を書く。

5. 詳細 checklist や guidelines は `references/` に分ける。

6. 検証する。

```sh
scripts/validate.sh
```

`description` は agent が skill を使うかどうかを判断する重要な field です。曖昧な説明ではなく、発火条件と支援する作業を具体的に書いてください。

## Agent Usage

- Codex: `.codex/instructions.md` を読み、関連する `.apm/skills/*/SKILL.md` を使う。
- Claude Code: `CLAUDE.md` を読み、`.claude/commands/*` を task wrapper として使う。
- APM: `apm.yml` を manifest、`.apm/` を source tree として使う。
- Cursor: `.cursor/rules/*` を project rules として使う。
- OpenCode / Gemini: `.opencode/commands/*` または `.gemini/commands/*` から `.apm/` を参照する。

Recommended agent lineup:

1. Codex for repo setup and implementation.
2. Claude Code for design, refactoring, and review.
3. APM for portable configuration management.
4. Gemini CLI for large-context second opinions.
5. OpenCode for OSS agent experiments.
6. Cursor CLI and Windsurf when IDE integration is useful.

## Maintenance Policy

- 使用頻度の高い skill を少数だけ丁寧に保守する。
- `.apm/` を canonical source として扱う。
- `skills` symlink は人間向けの入口として Git 管理する。
- wrapper に長い内容を重複させない。
- script は `scripts/` 配下に置く。
- global install command は実行前に確認する。
- validation が壊れた状態で変更を放置しない。
