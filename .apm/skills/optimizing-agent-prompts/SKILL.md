---
name: optimizing-agent-prompts
description: Use this skill when creating or improving prompts, skills, instructions, commands, or agentic coding workflows using current best practices for concise structure, trigger descriptions, context management, guardrails, and evaluation.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires access to the target prompt or skill files. For latest best practices, use web access or official documentation available at execution time.
---

# Optimizing Agent Prompts

## 利用タイミング

prompt、skill、instruction、command、agentic coding workflow を新規作成または改善するときに使う。既存 prompt/skill を、実行時点の best practice に照らして改善する場合も含む。

## 確認する入力

- 対象ファイルと用途
- 実行 agent と環境
- 現在の failure mode または改善したい出力
- 参照すべき official docs や trusted source
- 評価方法または acceptance criteria

## Workflow

1. 対象の目的、trigger、利用者、成功条件を確認する。
2. 実行時点の official docs と信頼できる一次情報を確認する。
3. 既存 content を、発火条件、workflow、context budget、guardrails、evaluation に分解する。
4. model が既に知っている説明を削り、作業固有の判断基準を残す。
5. `SKILL.md` は短く保ち、詳細は one-level `references/` に分離する。
6. concrete example、output format、validation loop を必要最小限だけ入れる。
7. 改善後に、想定 task で発火するか、過発火しないか、実行手順が曖昧でないかを確認する。

## Output Format

- Objective and trigger
- Proposed structure
- Rewritten prompt or skill content
- Rationale with sources checked
- Evaluation scenarios
- Remaining assumptions

## Guardrails

- 最新情報が必要な場合は、古い記憶だけで断定しない。
- vendor-specific すぎる内容は wrapper に閉じ込め、portable workflow は `.apm/` に置く。
- 長い背景説明より、実行時に必要な判断基準を優先する。
- prompt injection、secret leakage、destructive action の guardrail を必要に応じて入れる。
- 改善対象の本来の用途を変える場合は、別 skill/prompt として分離する。

## Related References

- `references/current-practice-research.md`
- `references/prompt-skill-quality-checklist.md`
