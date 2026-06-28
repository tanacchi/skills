---
name: testing-quality
description: Your Quiz のテスト計画、実装、レビューで、PactumJS BDD/API specs、Vitest unit tests、TDD flow、mutation testing、Playwright E2E、coverage quality、test gaps、project test guardrails を扱うときに使う。
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: PactumJS、Vitest、Stryker、Playwright を利用できる環境であること。
---

# テスト品質

## 利用タイミング

Your Quiz の BDD/API、unit、mutation、E2E、test gap 分析、品質ゲート確認を行うときに使う。

## 確認する入力

- 対象 user story、API contract、domain invariant、UI flow
- 既存 test pyramid と CI constraints
- 変更リスク、failure mode、regression area
- 使用する test env、fixture、mock/stub boundary

## ワークフロー

1. `references/bdd-and-e2e.md` で business scenario と E2E scope を決める。
2. `references/unit-and-mutation-testing.md` で unit/mutation の狙いと品質ゲートを決める。
3. `references/quiz-development-rules.md` で restricted test docs と workflow safety rules を確認する。
4. 最も低コストで defect を検出できる test level を選ぶ。
5. 実行結果だけでなく、何を検出できるようになったかと残る test gap を報告する。

## 出力形式

- test strategy と選択した layer
- 追加/更新した test と covered behavior
- 実行した command と結果
- 関連する場合は coverage/mutation result
- 残る gap と risk

## ガードレール

- ユーザーが明示しない限り、`../your-quiz/docs/instructions/shared/tests/` の quiz files は README 以外読まない。
- coverage number だけに依存せず、behavior と contract を test する。
- mock は system boundary に置き、test 対象の contract を mock で消さない。
- DB-backed test には test environment / D1 test binding を使う。
- 現在の変更で mutation score または coverage target が現実的でない場合は、理由と residual risk を報告する。

## 評価シナリオ

- success/error scenario を PactumJS API test に変換する。
- aggregate invariant の unit test を追加し、surviving mutant をレビューする。
- 必要な offline/error coverage を含め、UI、API、persistence を通した quiz answering E2E を検証する。

## 関連リファレンス
- `references/bdd-and-e2e.md`
- `references/unit-and-mutation-testing.md`
- `references/quiz-development-rules.md`
- `references/v8-ignore-placement.md` — v8 coverage の `/* v8 ignore next N */` 位置ルールと exhaustive switch の正解パターン
