---
name: spec-authoring
description: Use when authoring or reviewing specifications — user stories, 5W1H requirements, success/error scenarios, acceptance criteria, functional vs non-functional separation, scope boundaries, future-work isolation, or tracing specs to tests and design. Triggers on phrases like "仕様を書いて", "ユーザーストーリーを作って", "要件を整理して", "シナリオを定義して", "acceptance criteria を作って", or any request to produce spec documents before API/architecture design begins.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# 仕様書作成

## 利用タイミング

新機能・改善の要件整理、ユーザーストーリー、成功/失敗シナリオ、受け入れ条件の作成またはレビューを行うとき。API設計・実装着手前の仕様定義フェーズが主な対象。

## 確認する入力

- 対象機能の目的・背景とターゲットユーザー
- MVP 範囲と将来課題の境界
- 既存の要件・ストーリー・シナリオドキュメントの有無
- 後続工程（DDD・API・UI・テスト）への受け渡し要件
- 未確定事項・決定待ちの判断

## Workflow

1. `references/spec-authoring-checklist.md` を参照し、5W1H・受け入れ条件・将来課題分離の観点を確認する。
2. 対象機能の要件を「user-visible outcome」と「system constraint」に分類する。
3. ユーザーストーリーを 5W1H（Who/What/When/Where/Why）形式で記述する。
4. 成功シナリオを「前提条件 → 実行手順 → 期待結果（ユーザー体験 + 技術分類）」の構造で定義する。
5. 失敗シナリオを同構造で定義し、エラー種別（バリデーション/認証認可/ビジネスルール/システム/リソース）を明記する。
6. 機能要件（何をするか）と非機能要件（品質特性・制約）を分離してそれぞれのファイルに出力する。
7. MVP 外の要望は `future-work.md` へ分離し、現工程から除外する。
8. 成果物を一覧化してレビューを依頼する。

## 出力形式

```text
docs/project/specifications/
├── user-stories/user-story-<feature>.md
├── success-scenarios/success-<feature>.md
├── error-scenarios/error-<feature>.md
├── requirements/requirements-<feature>.md
└── future-work.md
```

各ファイルの構成は `references/spec-authoring-checklist.md` のテンプレートに従う。

## ガードレール

- **工程境界を守る**: エンドポイントURL・JSONスキーマ・DBスキーマ・フレームワーク選定は次工程（API/技術設計）で扱う。本工程で記載しない。
- **ユーザー体験中心**: エラー時も「ユーザーが何を見てどう操作できるか」を主語にする。内部ログや技術エラーコードを主語にしない。
- **測定可能にする**: 曖昧な表現（「早い」「使いやすい」）は数値化するか非機能要件として定義する。
- **未確定事項を断定しない**: 決まっていない設計判断を仕様として記載しない。未決質問として明示する。
- **将来課題の混入防止**: 「後で」「将来的に」を含む内容は即座に `future-work.md` に移動する。

## 評価シナリオ

- 新機能の要件をユーザーストーリーと受け入れ条件に分解してほしい。
- 成功シナリオと失敗シナリオを、テストケースに変換できる粒度でまとめてほしい。
- MVP 範囲と将来課題の境界を整理し、スコープを確定したい。
- 既存の仕様ドキュメントを機能要件と非機能要件に分離してほしい。

## 関連リファレンス

- `references/spec-authoring-checklist.md`
- `references/scenario-templates.md`
