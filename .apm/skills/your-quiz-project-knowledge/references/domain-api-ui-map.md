# Domain API UI Map: Your Quiz

Use this map to keep feature work vertically aligned from domain model to API to UI. Endpoint names are catalog-level routing hints; confirm exact paths in the API catalog before implementation.

## Quiz Management

- Aggregate: Quiz.
- Responsibility: quiz creation, draft handling, approval, publishing, quality checks, master data.
- API area: quiz-management catalog, management operations for quiz submission and approval.
- UI: quiz creation flow, created quiz management, approval flow/admin-like views.
- Boundary risk: approval and publishing affect learning/search availability; publish via API/event boundary instead of direct model coupling.

## Quiz Learning

- Aggregate: LearningSession.
- Responsibility: deck generation, quiz answering, answer judgement, explanation display, progress calculation.
- API area: quiz-learning catalog, learning sessions, answers, deck/search-derived workflows.
- UI: home/deck selection, quiz list, quiz answer page, result/history entry points.
- Boundary risk: do not embed management approval rules in UI-only logic; consume published quiz language.

## User Session

- Aggregate: UserSession.
- Responsibility: anonymous identity, session lifecycle, device identification, creator/session permissions.
- API area: user-session catalog.
- UI: app launch/session bootstrap, my page, answer history ownership behavior.
- Boundary risk: session identity should be validated through application/API boundaries, not duplicated in each feature.

## Offline Sync

- Aggregate: SyncSession.
- Responsibility: offline cache, pending changes, sync, conflict handling, local-to-server reconciliation.
- API area: offline-sync catalog.
- UI: offline indicators, sync status, offline-capable answer/create flows.
- Boundary risk: sync format is an anti-corruption layer; avoid leaking internal storage shape into domain APIs.

## Cross-Cutting Maps

- Search/discovery reads published quiz data and supports learning-oriented discovery.
- Operations endpoints support monitoring, health, metrics, and operational visibility.
- UI integration docs connect DDD models, API contracts, components, Storybook, and automation.

## Source Docs
- `../your-quiz/docs/project/ddd-design/2.09_bounded-context-definition/README.md`
- `../your-quiz/docs/project/api-design/api-catalog/README.md`
- `../your-quiz/docs/project/api-design/design-principles.md`
- `../your-quiz/docs/project/ui-design/1.01_sitemap.yaml`
- `../your-quiz/docs/project/ui-design/5.01_integration/ddd-integration.md`
