# 境界づけられたコンテキストとイベント: Your Quiz

## コンテキストと集約

| BC 名 | 主要集約 | 主な責務 |
| :--- | :--- | :--- |
| Quiz Management | Quiz | creation、draft、approval、quality control、publication。 |
| Quiz Learning | LearningSession | deck/session lifecycle、answering、judgement、progress。 |
| User Session | UserSession | anonymous identity、session validity、creator/session permission。 |
| Offline Sync | SyncSession | offline pending change、sync lifecycle、conflict handling。 |

## ドメインイベントカタログ

| イベント名 | 発生条件 | 下流への影響 |
| :--- | :--- | :--- |
| QuizSubmitted | user が quiz を submit する | approval queue、quality check。 |
| QuizPublished | quiz が approved/published になる | learning/search availability、cache/index update。 |
| AnswerSubmitted | learner が answer を submit する | progress/statistics update、history entry。 |
| LearningSessionCompleted | session が完了する | result summary、history/stat aggregation。 |
| SyncCompleted | pending offline data が reconciliation される | local cleanup、history persistence、conflict status update。 |

## イベント設計ルール

- event name は past tense で domain-significant にする。
- payload には event id、aggregate id、occurred time、version、最小限の domain data を含める。
- validation 前ではなく aggregate invariant 成功後に emit する。
- downstream handler は idempotent にする。
- context 横断の副作用には direct aggregate mutation ではなく domain event を優先する。

## コンテキスト境界チェック

- Quiz Learning は published quiz data を consume するが、approval rule を所有しない。
- Offline Sync は local change を reconcile するが、すべての domain behavior の source にしない。
- User Session は identity を validate する。個別 feature で anonymous identity rule を再発明しない。

## 出典ドキュメント
- `../your-quiz/docs/project/ddd-design/2.00_domain-model-overview.md`
- `../your-quiz/docs/project/ddd-design/2.09_bounded-context-definition/README.md`
- `../your-quiz/docs/project/ddd-design/2.09_bounded-context-definition/quiz-learning-context.md`
- `../your-quiz/docs/project/ddd-design/2.09_bounded-context-definition/quiz-management-context.md`
- `../your-quiz/docs/project/ddd-design/2.10_domain-events-catalog/domain-events-catalog.md`
- `../your-quiz/docs/project/ddd-design/2.11_ontology-creation/domain-ontology.md`
