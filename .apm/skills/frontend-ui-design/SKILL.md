---
name: frontend-ui-design
description: Use this skill when designing or reviewing Your Quiz UI, mobile-first flows, wireframes, sitemap, screen states, design system, components, Storybook, accessibility, DDD/API integration, or UI automation guidance.
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Requires access to Your Quiz UI design docs and, for implementation checks, the frontend project.
---

# Frontend UI Design

## 利用タイミング

Your Quiz の UI 設計、画面遷移、wireframe、component inventory、design system、Storybook、accessibility、DDD/API 連携を扱うときに使う。

## 確認する入力

- 対象 user story、flow、screen、component
- sitemap、wireframe、design token、component inventory
- DDD context/API contract との対応
- loading、empty、error、offline、permission、validation states

## Workflow

1. `references/ui-flows-and-wireframes.md` で user flow、screen states、mobile constraints を確認する。
2. `references/design-system-and-components.md` で token、component taxonomy、Storybook、a11y を確認する。
3. DDD/API map と照合し、画面が扱う domain entity、state transition、API contract を明確にする。
4. Interaction は touch target、keyboard/fallback operation、error/offline state を含めて設計する。
5. Component は design system と existing frontend pattern に沿って Storybook states を揃える。

## Output Format

- Target user flow and screen state map
- Wireframe/component design or implementation notes
- Design token/component usage
- Accessibility and responsive checks
- DDD/API integration notes and test/story coverage

## Guardrails

- Start from 375px mobile-first constraints and preserve 44px minimum touch targets.
- Gesture flows need visible hints and button alternatives.
- Do not create UI states that contradict domain state transitions or API errors.
- Keep repeated domain concepts visually consistent across screens.
- Treat MCP/UI automation docs as implementation aids, not mandatory runtime architecture.

## Evaluation Scenarios

- Review quiz answer swipe UI for touch, fallback controls, and domain state consistency.
- Design quiz creation flow states from user story through API validation errors.
- Check Storybook coverage for loading/error/empty/offline component states.

## Related References
- `references/ui-flows-and-wireframes.md`
- `references/design-system-and-components.md`
