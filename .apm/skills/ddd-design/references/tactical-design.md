# 戦術的設計: Your Quiz

## オブジェクト分類

| 分類 | 判定基準 | 実装上の特徴 |
| :--- | :--- | :--- |
| Entity | IDで識別し、状態とライフサイクルがある。 | ID equality、lifecycle behavior、invariant check。 |
| Value Object | 値で識別し、immutable。 | Brand/Zod schema candidate。更新は replacement で行う。 |
| Domain Service | 複数 aggregate に跨る計算、評価、調整。 | stateless behavior。domain language で命名する。 |
| Aggregate | consistency と transaction boundary。 | root が internal entity/value update を制御する。 |

## 集約設計ルール

- aggregate root は internal member の唯一の mutation entry point。
- aggregate boundary は UI screen shape ではなく strong consistency need に合わせる。
- aggregate は reasoning と testing がしやすい大きさに保つ。
- 他 aggregate は ID で reference し、application service または domain event で coordinate する。
- invariant は field validation だけでなく behavior として記録する。

## Your Quiz の不変条件例

- Quiz: question/options/explanation/tag rule、sanitization、approval state、published availability。
- LearningSession: started session、answer submission lifecycle、progress、completion state。
- UserSession: anonymous session validity、device/session association、ownership check。
- SyncSession: pending item state、conflict resolution status、idempotent sync completion。

## 実装への引き渡し

- boundary で domain invariant を表せる場合は TypeScript type、Brand type、Zod schema を使う。
- implementation が neverthrow convention に従う場合、domain failure には `Result` style error を使う。
- 真の business invariant でない限り、persistence 固有制約は repository/DB layer に置く。

## 出典ドキュメント
- `../your-quiz/docs/instructions/shared/workflow/03.05_domain-object-extraction-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.06_entity-relationship-analysis-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.07_domain-service-extraction-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.08_aggregate-design-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/10.02_entity-implementation-guide.md`
- `../your-quiz/docs/project/ddd-design/2.05_domain-object-extraction/domain-object-analysis.md`
- `../your-quiz/docs/project/ddd-design/2.08_aggregate-design/README.md`
