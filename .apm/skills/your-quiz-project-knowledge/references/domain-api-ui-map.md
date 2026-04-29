# Domain/API/UI マップ: Your Quiz

この map は feature 作業を domain model、API、UI で縦に揃えるために使う。endpoint name は catalog 上の routing hint なので、実装前に API catalog で正確な path を確認する。

## Quiz Management

- aggregate: Quiz。
- responsibility: quiz creation、draft handling、approval、publishing、quality check、master data。
- API area: quiz-management catalog、quiz submission と approval の management operation。
- UI: quiz creation flow、created quiz management、approval flow/admin-like view。
- boundary risk: approval と publishing は learning/search availability に影響する。direct model coupling ではなく API/event boundary で publish する。

## Quiz Learning

- aggregate: LearningSession。
- responsibility: deck generation、quiz answering、answer judgement、explanation display、progress calculation。
- API area: quiz-learning catalog、learning session、answer、deck/search-derived workflow。
- UI: home/deck selection、quiz list、quiz answer page、result/history entry point。
- boundary risk: management approval rule を UI-only logic に埋め込まず、published quiz language を consume する。

## User Session

- aggregate: UserSession。
- responsibility: anonymous identity、session lifecycle、device identification、creator/session permission。
- API area: user-session catalog。
- UI: app launch/session bootstrap、my page、answer history ownership behavior。
- boundary risk: session identity は application/API boundary で validate し、各 feature で重複実装しない。

## Offline Sync

- aggregate: SyncSession。
- responsibility: offline cache、pending change、sync、conflict handling、local-to-server reconciliation。
- API area: offline-sync catalog。
- UI: offline indicator、sync status、offline-capable answer/create flow。
- boundary risk: sync format は anti-corruption layer。internal storage shape を domain API に漏らさない。

## 横断マップ

- search/discovery は published quiz data を read し、learning-oriented discovery を支援する。
- operations endpoint は monitoring、health、metrics、operational visibility を支援する。
- UI integration docs は DDD model、API contract、component、Storybook、automation をつなぐ。

## 出典ドキュメント
- `../your-quiz/docs/project/ddd-design/2.09_bounded-context-definition/README.md`
- `../your-quiz/docs/project/api-design/api-catalog/README.md`
- `../your-quiz/docs/project/api-design/design-principles.md`
- `../your-quiz/docs/project/ui-design/1.01_sitemap.yaml`
- `../your-quiz/docs/project/ui-design/5.01_integration/ddd-integration.md`
