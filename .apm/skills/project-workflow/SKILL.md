---
name: project-workflow
description: Use this skill when planning or checking Your Quiz development workflow, phase order, scope confirmation, documentation updates, ADR management, approval gates, or transitions between specification, architecture, DDD, API, DB, BDD, implementation, unit, mutation, and E2E work.
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Requires access to ../your-quiz/docs workflow documents and repository state.
---

# Project Workflow

## 利用タイミング

Your Quiz の工程判定、作業計画、docs/ADR 更新判断、スコープ確認、完了前セルフチェックを行うときに使う。

## 確認する入力

- 現在の依頼内容と成果物の種類
- 既存 docs、ADR、git diff、前工程の成果物
- ユーザーが明示したスコープと承認状況
- 変更が新規機能、設計更新、実装、テスト、レビューのどれか

## Workflow

1. `references/workflow-routing.md` で現在工程と前提成果物を確認する。
2. `references/docs-and-adr-management.md` で docs/ADR 更新が必要か判断する。
3. 工程外の作業が混ざっている場合は、分離するか scope change として明示する。
4. 完了前に工程ごとの acceptance criteria を確認し、未充足項目を残課題として示す。
5. 新しい技術決定、設計方針、非機能方針が発生したら ADR 提案を検討する。

## Output Format

- 現在工程と前提条件
- 実施すべき成果物と完了条件
- docs/ADR/Future Work 更新要否
- スコープ外または未決事項
- 次工程へ進むための確認事項

## Guardrails

- 新機能は仕様整理から始める。既存機能の局所修正でも、変更が仕様に影響する場合は仕様差分を明示する。
- 前工程の成果物がないまま次工程の詳細を確定しない。
- docs/tmp は未確定メモとして扱い、採用済み根拠がない限り source of truth にしない。
- destructive command、secret 追加、machine-specific path 追加は禁止。必要なら明示承認を取る。

## Evaluation Scenarios

- API 実装依頼が来たが TypeSpec/API 設計が未確定か確認する。
- 新しい DB 方針が出たため ADR が必要か判断する。
- DDD 設計中に UI/DB 詳細へ踏み込みすぎていないかレビューする。

## Related References
- `references/workflow-routing.md`
- `references/docs-and-adr-management.md`
