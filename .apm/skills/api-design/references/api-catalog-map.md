# API Catalog Map: Your Quiz

Use this as a catalog routing map. Confirm exact operation names and paths in source catalog files before implementation.

## Quiz Management

- Purpose: quiz creation, drafts, approval, publishing, management workflows.
- TypeSpec area: quiz-management operation specs.
- UI flows: quiz creation, preview, created quiz list, approval workflow.
- Watch for: approval state, creator ownership, publication side effects.

## Quiz Learning

- Purpose: deck generation, session start, answer submission, judgement, progress, result.
- TypeSpec area: quiz-learning operation specs.
- UI flows: home/deck selection, quiz list, quiz answer, result/history.
- Watch for: low-latency answer path, published quiz input, progress calculation.

## User Session

- Purpose: anonymous session creation, validation, session lifecycle, ownership.
- TypeSpec area: user-session operation specs.
- UI flows: app bootstrap, my page, creator/history ownership behavior.
- Watch for: privacy, device/session assumptions, permission drift.

## Offline Sync

- Purpose: offline manifest, pending upload/download, reconciliation, conflict status.
- TypeSpec area: sync operation specs.
- UI flows: offline indicator, sync status, offline-capable answering/creation.
- Watch for: idempotency, conflict resolution, local storage shape leakage.

## Search Discovery And Operations

- Search/discovery supports public quiz discovery and learning-specific filtering.
- Integration patterns define cross-context workflows and transformation boundaries.
- Operations APIs cover health, monitoring, metrics, and admin/ops concerns.

## Source Docs
- `../your-quiz/docs/project/api-design/api-catalog/README.md`
- `../your-quiz/docs/project/api-design/api-catalog/01-quiz-management.md`
- `../your-quiz/docs/project/api-design/api-catalog/02-quiz-learning.md`
- `../your-quiz/docs/project/api-design/api-catalog/03-user-session.md`
- `../your-quiz/docs/project/api-design/api-catalog/04-offline-sync.md`
- `../your-quiz/docs/project/api-design/api-catalog/05-search-discovery.md`
- `../your-quiz/docs/project/api-design/api-catalog/06-integration-patterns.md`
- `../your-quiz/docs/project/api-design/api-catalog/08-operations.md`
