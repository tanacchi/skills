# BDD と E2E テスト戦略: Your Quiz

## PactumJS による BDD/API

- 新しい scenario の BDD/API test には PactumJS を使う方針。
- setup、action、期待する API/domain result を含む executable business specification に集中する。
- scenario は user story、success scenario、error scenario、API contract と紐づける。
- 読みやすさが上がる場合は boundary/error permutation に data-driven example を使う。
- tooling が対応している場合は OpenAPI/API catalog の整合性を検証する。

## Playwright による E2E

- E2E はすべての branch ではなく key user journey に使う。
- 優先 flow は quiz answering、quiz creation、可能なら approval、answer history、offline sync、search。
- product value に関わる degraded state には offline、network failure、validation、empty data を含める。
- duplication と brittleness を下げる場合だけ stable selector と page object を使う。

## Mock と環境境界

- 可能な限り real API contract を使う。
- 検証対象の behavior ではなく、boundary にある external service を mock する。
- DB-backed test には project test env / D1 test binding を使う。
- assertion を deterministic にする必要がある場合だけ time/randomness を制御する。

## 合格シグナル

- 新しい behavior を記述する BDD test は実装前に fail する。
- critical flow では代表的な happy path と、少なくとも 1 つの意味ある failure/degraded path を E2E test で覆う。
- test name は内部 implementation detail だけでなく user-visible behavior を表す。

## 出典ドキュメント
- `../your-quiz/docs/instructions/shared/workflow/07.01_bdd-implementation.md`
- `../your-quiz/docs/instructions/shared/workflow/11.01_e2e-testing.md`
- `../your-quiz/docs/project/specifications/success-scenarios/success-quiz.md`
- `../your-quiz/docs/project/specifications/error-scenarios/error-quiz.md`
