# Workflow Routing: Your Quiz

## Phase Map

| Phase | Primary skill | Main output | Completion signal |
| --- | --- | --- | --- |
| Common policy / scope | `project-workflow` | Work classification, scope, questions | Required inputs and scope boundaries are explicit. |
| Specification | `specification-design` | Requirements, user stories, success/error scenarios | 5W1H, acceptance criteria, open questions are clear. |
| Architecture / tech selection | `architecture-design` | Architecture, NFR, ADR proposal | Tradeoffs, selected stack, NFR impact are documented. |
| DDD design | `ddd-design` | Ubiquitous language, BCs, aggregates, events | Context boundaries and invariants are testable. |
| UI design | `frontend-ui-design` | Sitemap, flow, wireframe, components | Mobile-first states and DDD/API alignment are clear. |
| API design | `api-design` | TypeSpec, API catalog, OpenAPI | Contract is schema-first and context-aligned. |
| DB / data design | `architecture-design` | Data model, migration direction, constraints | Aggregate boundaries and persistence boundaries are mapped. |
| BDD/API tests | `testing-quality` | PactumJS executable specs | Business scenarios are red before implementation. |
| Skeleton / implementation | `api-implementation` or implementation-specific skill | Compile-ready structure and production code | Typecheck passes and contracts are honored. |
| Unit / mutation tests | `testing-quality` | Vitest tests, mutation analysis | Coverage and mutation quality gates are met or justified. |
| E2E tests | `testing-quality` / `frontend-ui-design` | Playwright scenarios | UI/API/DB flow is verified for key journeys. |

## Routing Rules

- Start new feature work from specification unless the user explicitly scopes it as a local fix.
- Move forward only when the previous phase output is available or the missing output is recorded as an assumption.
- If a task crosses phases, split the work and name the phase currently being executed.
- If the user asks for implementation but API/DDD/contract is missing, identify the missing design artifact before coding.
- Keep work story-sized; avoid broad multi-feature design or implementation batches.

## Completion Checks

- Requirements are traceable to scenarios, APIs, UI states, and tests.
- DDD context and aggregate boundaries are not contradicted by API or DB design.
- Generated artifacts are identified as generated; hand edits to generated OpenAPI are avoided.
- ADRs are proposed for durable architecture or technology decisions.
- Future Work captures deferred scope instead of hiding it inside implementation notes.

## Source Docs
- `../your-quiz/docs/instructions/shared/workflow/00.01_common.md`
- `../your-quiz/docs/instructions/shared/workflow/00.02_workflow.md`
- `../your-quiz/docs/instructions/shared/workflow/00.05_scope-confirmation.md`
- `../your-quiz/docs/instructions/shared/workflow/README.md`
