# Strategic Design: Your Quiz

## Domain Understanding

- Read requirements and scenarios first; extract nouns as object candidates and verbs as behavior/event candidates.
- Separate business terms from technical implementation terms.
- Record Japanese and English terms consistently when naming code, APIs, docs, and UI labels.
- Treat user-flow analysis and event storming as inputs to context boundaries, not just UI documentation.

## Bounded Contexts

| Context | Core responsibility | Boundary indicator |
| --- | --- | --- |
| Quiz Management | Quiz creation, drafts, approval, quality control, master data | Approval and publishing rules dominate. |
| Quiz Learning | Decks, answering, judgement, progress | High-frequency answer flow and learning outcome dominate. |
| User Session | Anonymous identity, session lifecycle, permissions | Security/privacy and session ownership dominate. |
| Offline Sync | Offline storage, pending changes, conflict handling | Technical sync and reconciliation complexity dominate. |

## Context Mapping

- Quiz Management publishes approved quiz language consumed by Quiz Learning.
- User Session supplies identity/session verification to learning and creation flows.
- Offline Sync should translate cached/local data through an anti-corruption boundary before it affects domain APIs.
- Search/discovery may read across contexts but should not become an unbounded domain model.

## Strategic Completion Checks

- Context responsibilities are cohesive and non-overlapping.
- Terms are defined in the ubiquitous language or identified as open questions.
- Cross-context communication has a named pattern: API call, event, published language, customer/supplier, or ACL.
- Team/API/UI boundaries can be derived from the context map.

## Source Docs
- `../your-quiz/docs/instructions/shared/workflow/03.01_ddd-design.md`
- `../your-quiz/docs/instructions/shared/workflow/03.02_domain-understanding-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.02.5_user-flow-analysis-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.03_ubiquitous-language-creation-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.04_event-storming-workshop-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.09_bounded-context-definition-guide.md`
- `../your-quiz/docs/project/ddd-design/2.02_domain-understanding/domain-knowledge-base.md`
- `../your-quiz/docs/project/ddd-design/2.03_ubiquitous-language/ubiquitous-language-dictionary.md`
