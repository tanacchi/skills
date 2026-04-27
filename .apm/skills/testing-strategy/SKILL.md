---
name: testing-strategy
description: Use this skill when planning, implementing, or reviewing unit, integration, contract, and end-to-end tests, including deciding what not to over-test.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# Testing Strategy

## 利用タイミング

test plan、unit/integration/contract/E2E test、regression test、test gap 分析を行うときに使う。

## 確認する入力

- 変更目的と risk
- 既存 test pyramid
- 境界条件と failure mode
- CI の実行時間と安定性

## Workflow

1. 変更の失敗しやすい箇所を特定する。
2. 最も低コストで defect を検出できる test level を選ぶ。
3. public behavior と contract を優先して test する。
4. brittle な implementation detail test を避ける。
5. CI で安定して実行できる形にする。

## Output Format

- Risk areas
- Recommended tests
- Tests not worth adding
- CI considerations
- Acceptance criteria

## Guardrails

- coverage number だけを目的にしない。
- mock が多すぎる test は contract value を疑う。
- E2E は重要 flow に絞る。

## Related References

- `references/unit-test-guidelines.md`
- `references/e2e-test-guidelines.md`
