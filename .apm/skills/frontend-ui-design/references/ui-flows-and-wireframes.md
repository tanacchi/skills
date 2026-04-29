# UI Flows & Wireframes: Your Quiz

## Mobile Constraints

- Baseline viewport: 375px mobile-first.
- Minimum touch target: 44px by 44px.
- Design key flows for smartphone use before desktop expansion.
- Include offline, loading, empty, error, validation, and permission states where relevant.

## Primary Flows

- Quiz answering: quiz display, swipe/button answer, immediate feedback, explanation, next question/result.
- Quiz creation: staged input for question, choices/answer, explanation, tags, preview, submit, draft/offline handling.
- Approval: review queue, approve/reject, quality information, batch or next-item flow.
- Answer history: history list, statistics, wrong-question review, empty and data error states.
- Offline sync: offline notice, pending changes, sync progress, conflict/error recovery.
- Search/discovery: filters, tag search, results, empty state, deck creation.

## Wireframe And State Rules

- Wireframes should show structure, primary controls, navigation, feedback, and state transitions.
- Swipe UI must also provide visible affordance and non-gesture controls.
- API validation errors should map to visible form errors, not generic failure messages.
- Offline-capable screens should distinguish local saved state from server-synced state.
- UI state names should align with DDD/API terms where possible.

## Source Docs
- `../your-quiz/docs/instructions/shared/workflow/04.01_ui-design.md`
- `../your-quiz/docs/project/ui-design/1.00_overview.md`
- `../your-quiz/docs/project/ui-design/1.01_sitemap.yaml`
- `../your-quiz/docs/project/ui-design/1.02_user-stories/*.md`
- `../your-quiz/docs/project/ui-design/2.01_user-flows/*.md`
- `../your-quiz/docs/project/ui-design/3.01_wireframes/*.md`
