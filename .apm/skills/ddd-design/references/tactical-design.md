# Tactical Design: Your Quiz

## Object Classification

| 分類 | 判定基準 | 実装上の特徴 |
| :--- | :--- | :--- |
| Entity | IDで識別し、状態とライフサイクルがある。 | ID equality, lifecycle behavior, invariant checks. |
| Value Object | 値で識別し、immutable。 | Brand/Zod schema candidates; update by replacement. |
| Domain Service | 複数 aggregate に跨る計算、評価、調整。 | Stateless behavior; named around domain language. |
| Aggregate | Consistency and transaction boundary. | Root controls internal entity/value updates. |

## Aggregate Design Rules

- Aggregate root is the only mutation entry point for internal members.
- Aggregate boundary should match strong consistency needs, not UI screen shape.
- Keep aggregate small enough for reasoning and testing.
- Reference other aggregates by ID; coordinate by application service or domain event.
- Record invariants as behavior, not only field validation.

## Your Quiz Invariant Examples

- Quiz: question/options/explanation/tag rules, sanitization, approval state, published availability.
- LearningSession: started session, answer submission lifecycle, progress, completion state.
- UserSession: anonymous session validity, device/session association, ownership checks.
- SyncSession: pending item state, conflict resolution status, idempotent sync completion.

## Implementation Handoff

- Use TypeScript types, Brand types, and Zod schemas where they express domain invariants at boundaries.
- Use `Result`-style errors for domain failures when implementation follows neverthrow conventions.
- Keep persistence-specific constraints in repository/DB layer unless they are true business invariants.

## Source Docs
- `../your-quiz/docs/instructions/shared/workflow/03.05_domain-object-extraction-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.06_entity-relationship-analysis-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.07_domain-service-extraction-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.08_aggregate-design-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/10.02_entity-implementation-guide.md`
- `../your-quiz/docs/project/ddd-design/2.05_domain-object-extraction/domain-object-analysis.md`
- `../your-quiz/docs/project/ddd-design/2.08_aggregate-design/README.md`
