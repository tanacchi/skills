# API カタログマップ: Your Quiz

これは catalog routing map として使う。実装前に source catalog file で正確な operation name と path を確認する。

## Quiz Management

- purpose: quiz creation、draft、approval、publishing、management workflow。
- TypeSpec area: quiz-management operation spec。
- UI flow: quiz creation、preview、created quiz list、approval workflow。
- watch point: approval state、creator ownership、publication side effect。

## Quiz Learning

- purpose: deck generation、session start、answer submission、judgement、progress、result。
- TypeSpec area: quiz-learning operation spec。
- UI flow: home/deck selection、quiz list、quiz answer、result/history。
- watch point: low-latency answer path、published quiz input、progress calculation。

## User Session

- purpose: anonymous session creation、validation、session lifecycle、ownership。
- TypeSpec area: user-session operation spec。
- UI flow: app bootstrap、my page、creator/history ownership behavior。
- watch point: privacy、device/session assumption、permission drift。

## Offline Sync

- purpose: offline manifest、pending upload/download、reconciliation、conflict status。
- TypeSpec area: sync operation spec。
- UI flow: offline indicator、sync status、offline-capable answering/creation。
- watch point: idempotency、conflict resolution、local storage shape leakage。

## Search Discovery と Operations

- search/discovery は public quiz discovery と learning-specific filtering を支援する。
- integration pattern は cross-context workflow と transformation boundary を定義する。
- operations API は health、monitoring、metrics、admin/ops concern を覆う。

## 出典ドキュメント
- `../your-quiz/docs/project/api-design/api-catalog/README.md`
- `../your-quiz/docs/project/api-design/api-catalog/01-quiz-management.md`
- `../your-quiz/docs/project/api-design/api-catalog/02-quiz-learning.md`
- `../your-quiz/docs/project/api-design/api-catalog/03-user-session.md`
- `../your-quiz/docs/project/api-design/api-catalog/04-offline-sync.md`
- `../your-quiz/docs/project/api-design/api-catalog/05-search-discovery.md`
- `../your-quiz/docs/project/api-design/api-catalog/06-integration-patterns.md`
- `../your-quiz/docs/project/api-design/api-catalog/08-operations.md`
