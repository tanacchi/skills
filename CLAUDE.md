# Claude Code Guidance

`.apm/skills` が canonical source です。作業前に関連する `SKILL.md` を読み、必要な reference だけを追加で確認してください。

`.claude/commands` は command wrapper です。内容を複製しすぎず、`.apm/skills` と `.apm/prompts` への参照を優先してください。

## Rules

- project-specific convention を推測で作らない。
- destructive command は事前に確認する。
- 既存の設計と命名を優先する。
- 可能な限り concrete diff で提案する。
- 変更後は `scripts/validate.sh` を実行する。
