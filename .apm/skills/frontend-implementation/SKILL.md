---
name: frontend-implementation
description: Use this skill when implementing or reviewing React and TypeScript frontend features, routing, accessibility, state management, UI behavior, and frontend tests.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# Frontend Implementation

## 利用タイミング

React / TypeScript の UI 実装、frontend feature、routing、state management、accessibility、frontend test を扱うときに使う。

## 確認する入力

- 既存 component と design pattern
- routing、data fetching、state 管理の境界
- form、loading、empty、error state
- accessibility requirement

## Workflow

1. 既存 UI と component pattern を確認する。
2. data flow を明示し、不要な shared state を避ける。
3. interaction state を網羅する。
4. keyboard 操作、focus、label、contrast を確認する。
5. 重要な user flow は test を追加する。

## Output Format

- 実装概要
- 変更した UI behavior
- accessibility considerations
- test coverage
- 残課題

## Guardrails

- 新しい UI abstraction は必要性が明確な場合だけ追加する。
- 表示文言、validation、loading/error state を後回しにしない。
- CSS は既存の design system と spacing scale を優先する。

## Related References

- `references/react-guidelines.md`
- `references/accessibility-guidelines.md`
