# Bounded Contexts & Events: Your Quiz

## Contexts And Aggregates

| BC 名 | 主要集約 | 主な責務 |
| :--- | :--- | :--- |
| Quiz Management | Quiz | Creation, draft, approval, quality control, publication. |
| Quiz Learning | LearningSession | Deck/session lifecycle, answering, judgement, progress. |
| User Session | UserSession | Anonymous identity, session validity, creator/session permission. |
| Offline Sync | SyncSession | Offline pending changes, sync lifecycle, conflict handling. |

## Domain Event Catalog

| イベント名 | 発生条件 | 下流への影響 |
| :--- | :--- | :--- |
| QuizSubmitted | User submits quiz | Approval queue, quality checks. |
| QuizPublished | Quiz is approved/published | Learning/search availability, cache/index updates. |
| AnswerSubmitted | Learner submits answer | Progress/statistics update, history entry. |
| LearningSessionCompleted | Session finishes | Result summary, history/stat aggregation. |
| SyncCompleted | Pending offline data is reconciled | Local cleanup, history persistence, conflict status update. |

## Event Design Rules

- Event names are past tense and domain-significant.
- Payload contains event id, aggregate id, occurred time, version, and minimal domain data.
- Emit after aggregate invariant success, not before validation.
- Downstream handlers must be idempotent.
- Prefer domain events for cross-context side effects instead of direct aggregate mutation.

## Context Boundary Checks

- Quiz Learning consumes published quiz data; it should not own approval rules.
- Offline Sync reconciles local changes; it should not become the source of all domain behavior.
- User Session validates identity; individual features should not reinvent anonymous identity rules.

## Source Docs
- `../your-quiz/docs/project/ddd-design/2.00_domain-model-overview.md`
- `../your-quiz/docs/project/ddd-design/2.09_bounded-context-definition/README.md`
- `../your-quiz/docs/project/ddd-design/2.09_bounded-context-definition/quiz-learning-context.md`
- `../your-quiz/docs/project/ddd-design/2.09_bounded-context-definition/quiz-management-context.md`
- `../your-quiz/docs/project/ddd-design/2.10_domain-events-catalog/domain-events-catalog.md`
- `../your-quiz/docs/project/ddd-design/2.11_ontology-creation/domain-ontology.md`
