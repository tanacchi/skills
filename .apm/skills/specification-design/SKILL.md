---
name: specification-design
description: Use this skill when creating or reviewing Your Quiz requirements, user stories, 5W1H analysis, success scenarios, error scenarios, acceptance criteria, future work, or specification-to-test/design traceability.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires access to Your Quiz specification and workflow docs.
---

# Specification Design

## 利用タイミング

Your Quiz の要件整理、ユーザーストーリー、成功/失敗シナリオ、受け入れ条件、Future Work 分離、後続設計への入力整理を行うときに使う。

## 確認する入力

- ユーザー依頼、対象 persona、目的、制約
- 既存 requirements、user stories、success/error scenarios
- MVP と Future Work の境界
- 後続の DDD、API、UI、test で使える acceptance criteria

## Workflow

1. `references/requirements-and-scenarios.md` で既存要求、主要価値、正常系/異常系を確認する。
2. `references/story-quality-checklist.md` で 5W1H、受け入れ条件、未決事項、Future Work 分離を確認する。
3. 要求を user-visible outcome と system constraint に分ける。
4. Success scenario と error scenario を後続テストへ変換できる粒度にする。
5. DDD/API/UI へ渡す入力と、未確定で止めるべき判断を明示する。

## Output Format

- Requirements summary
- User story and acceptance criteria
- Success/error scenarios
- Out of scope / Future Work
- Open questions and downstream design inputs

## Guardrails

- 実装都合を要件として混ぜない。
- 未確定事項を project fact として断定しない。
- MVP 外の価値ある要望は Future Work へ分離する。
- シナリオはテスト可能な観察結果まで落とす。

## Evaluation Scenarios

- 新しい quiz search 要件を user story と acceptance criteria に分解する。
- Offline support の MVP 範囲と Future Work を分ける。
- Error scenario が API/UI/test に渡せる粒度かレビューする。

## Related References

- `references/requirements-and-scenarios.md`
- `references/story-quality-checklist.md`
