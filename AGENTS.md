# Agent Operating Guide

この repository は、個人用の AI coding agent 設定を portable に管理するためのものです。

## Source Of Truth

- `.apm/` を正本とする。
- `.codex/`, `.claude/`, `.cursor/`, `.opencode/`, `.gemini/` は wrapper として扱う。
- 同じ内容を複数箇所に長く重複させない。

## Adding Skills

- skill は `.apm/skills/<name>/SKILL.md` を単位にする。
- `name` は directory name と一致させる。
- `description` は発火条件と支援する作業を具体的に書く。
- 詳細チェックリストは `references/` に分離する。

## Safety Rules

- destructive command は明示承認なしに実行しない。
- secrets, tokens, machine-specific paths を追加しない。
- 既存ファイルを変更する前に内容を確認する。
- 変更後は `scripts/validate.sh` を実行する。

## Review Checklist

- 正しさと regression risk を最優先に見る。
- test gap を明示する。
- 指摘は severity と file reference を付ける。
- vague advice より concrete patch を優先する。

## Commands

```sh
scripts/bootstrap.sh
scripts/validate.sh
scripts/sync-skills.sh
```

## Expected Workflow

- Codex: repository context を読んでから最小差分で編集する。
- Claude Code: relevant `SKILL.md` を読んでから設計・レビュー・refactor を行う。
- Cursor: `.cursor/rules/` の原則に従う。
- OpenCode/Gemini: `.apm/` の正本を参照して second opinion や調査を行う。
