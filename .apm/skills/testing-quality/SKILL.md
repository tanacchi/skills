---
name: testing-quality
description: Use this skill when planning, implementing, or reviewing Your Quiz tests: PactumJS BDD/API specs, Vitest unit tests, TDD flow, mutation testing, Playwright E2E, coverage quality, test gaps, or project test guardrails.
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Requires an environment supporting PactumJS, Vitest, Stryker, and Playwright.
---

# Testing Quality

## 利用タイミング

Your Quiz の BDD/API、unit、mutation、E2E、test gap 分析、品質ゲート確認を行うときに使う。

## 確認する入力

- 対象 user story、API contract、domain invariant、UI flow
- 既存 test pyramid と CI constraints
- 変更リスク、failure mode、regression area
- 使用する test env、fixture、mock/stub boundary

## Workflow

1. `references/bdd-and-e2e.md` で business scenario と E2E scope を決める。
2. `references/unit-and-mutation-testing.md` で unit/mutation の狙いと品質ゲートを決める。
3. `references/quiz-development-rules.md` で restricted test docs と workflow safety rules を確認する。
4. 最も低コストで defect を検出できる test level を選ぶ。
5. 実行結果だけでなく、何を検出できるようになったかと残る test gap を報告する。

## Output Format

- Test strategy and chosen layers
- Added/updated tests and covered behavior
- Commands run and result
- Coverage/mutation results if relevant
- Remaining gaps and risks

## Guardrails

- Do not read `../your-quiz/docs/instructions/shared/tests/` quiz files except README unless the user explicitly instructs it.
- Do not rely on coverage number alone; test behavior and contracts.
- Keep mocks at system boundaries; avoid mocking away the contract under test.
- Use test environment / D1 test binding for DB-backed tests.
- If mutation score or coverage target is not practical for the current change, report the reason and residual risk.

## Evaluation Scenarios

- Convert a success/error scenario into PactumJS API tests.
- Add unit tests for aggregate invariants and then review surviving mutants.
- Verify quiz answering E2E through UI, API, and persistence with offline/error coverage where needed.

## Related References
- `references/bdd-and-e2e.md`
- `references/unit-and-mutation-testing.md`
- `references/quiz-development-rules.md`
