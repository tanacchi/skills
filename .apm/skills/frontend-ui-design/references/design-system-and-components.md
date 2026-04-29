# Design System & Components: Your Quiz

## Design System

- Tailwind CSS is the primary styling mechanism.
- Use documented color tokens for primary, success/correct, error/incorrect, warning, neutral, and state colors.
- Keep spacing on the documented scale; preserve mobile grid constraints.
- Motion should clarify swipe, feedback, progress, and transitions without hiding state.
- Contrast should meet WCAG 2.1 AA where text is involved.

## Component Taxonomy

- Atoms: Button, TextInput, Icon, Badge, ProgressBar and similar primitives.
- Molecules: QuizCard, FormField, SwipeFeedback, FilterChipGroup.
- Organisms: SwipeableQuizCard, QuizCreationForm, AnswerHistoryList, ApprovalQueue.
- Templates/pages: App layout and page-level compositions.
- Component names and props should reflect domain language without importing domain models directly into every UI primitive.

## Storybook And Quality

- Create stories for default, loading, empty, error, disabled, validation, offline, and edge-content states as relevant.
- Use mobile 375px viewport stories for main flows.
- Keep Storybook examples aligned with API/DDD states instead of mock-only fantasy states.
- Visual regression and accessibility checks are preferred for shared components.

## UI Integration And Automation

- DDD integration docs are useful for mapping components to domain concepts and API contracts.
- MCP/LLM automation docs are reference material for generation workflows, not a requirement to add automation to every task.
- Generated components still need manual review for accessibility, token use, and state coverage.

## Source Docs
- `../your-quiz/docs/project/ui-design/4.01_components/design-system.md`
- `../your-quiz/docs/project/ui-design/4.01_components/component-inventory.md`
- `../your-quiz/docs/project/ui-design/4.01_components/storybook-setup.md`
- `../your-quiz/docs/project/ui-design/5.01_integration/ddd-integration.md`
- `../your-quiz/docs/project/ui-design/5.01_integration/mcp-automation.md`
