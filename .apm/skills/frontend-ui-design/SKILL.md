---
name: frontend-ui-design
description: Your Quiz の UI、モバイルファースト flow、wireframe、sitemap、画面状態、design system、component、Storybook、accessibility、DDD/API 統合、UI automation guidance を設計またはレビューするときに使う。
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Your Quiz の UI design docs と、実装確認時は frontend project にアクセスできること。
---

# フロントエンド UI 設計

## 利用タイミング

Your Quiz の UI 設計、画面遷移、wireframe、component inventory、design system、Storybook、accessibility、DDD/API 連携を扱うときに使う。

## 確認する入力

- 対象 user story、flow、screen、component
- sitemap、wireframe、design token、component inventory
- DDD context/API contract との対応
- loading、empty、error、offline、permission、validation states

## ワークフロー

1. `references/ui-flows-and-wireframes.md` で user flow、screen states、mobile constraints を確認する。
2. `references/design-system-and-components.md` で token、component taxonomy、Storybook、a11y を確認する。
3. DDD/API map と照合し、画面が扱う domain entity、state transition、API contract を明確にする。
4. Interaction は touch target、keyboard/fallback operation、error/offline state を含めて設計する。
5. Component は design system と existing frontend pattern に沿って Storybook states を揃える。

## 出力形式

- 対象ユーザーフローと画面状態マップ
- wireframe/component design または implementation notes
- design token と component の利用方針
- accessibility と responsive の確認結果
- DDD/API integration notes と test/story coverage

## ガードレール

- 375px mobile-first constraint から始め、44px 以上の touch target を保つ。
- gesture flow には visible hint と button alternative が必要。
- ドメイン状態遷移や API エラーと矛盾する UI 状態を作らない。
- 複数画面に出る同じドメイン概念は視覚表現を一貫させる。
- MCP/UI automation docs は implementation aid として扱い、必須の runtime architecture としない。

## 評価シナリオ

- クイズ回答の swipe UI について、タッチ操作、代替操作、ドメイン状態の整合性をレビューする。
- ユーザーストーリーから API validation error までを含めて、クイズ作成 flow の状態を設計する。
- loading/error/empty/offline component state の Storybook coverage を確認する。

## 関連リファレンス
- `references/ui-flows-and-wireframes.md`
- `references/design-system-and-components.md`
