---
name: specification-design
description: Your Quiz の要件、ユーザーストーリー、5W1H、成功シナリオ、エラーシナリオ、受け入れ条件、将来課題、仕様からテスト・設計への追跡性を作成またはレビューするときに使う。
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Your Quiz の specification と workflow docs にアクセスできること。
---

# 仕様設計

## 利用タイミング

Your Quiz の要件整理、ユーザーストーリー、成功/失敗シナリオ、受け入れ条件、将来課題 分離、後続設計への入力整理を行うときに使う。

## 確認する入力

- ユーザー依頼、対象 persona、目的、制約
- 既存 requirements、user stories、success/error scenarios
- MVP と 将来課題 の境界
- 後続の DDD、API、UI、test で使える acceptance criteria

## ワークフロー

1. `references/requirements-and-scenarios.md` で既存要求、主要価値、正常系/異常系を確認する。
2. `references/story-quality-checklist.md` で 5W1H、受け入れ条件、未決事項、将来課題 分離を確認する。
3. 要求を user-visible outcome と system constraint に分ける。
4. Success scenario と error scenario を後続テストへ変換できる粒度にする。
5. DDD/API/UI へ渡す入力と、未確定で止めるべき判断を明示する。

## 出力形式

- 要件の要約
- user story と acceptance criteria
- success/error scenario
- スコープ外 / 将来課題
- 未決質問と後続設計への入力

## ガードレール

- 実装都合を要件として混ぜない。
- 未確定事項を project fact として断定しない。
- MVP 外の価値ある要望は 将来課題 へ分離する。
- シナリオはテスト可能な観察結果まで落とす。

## 評価シナリオ

- 新しい quiz search 要件を user story と acceptance criteria に分解する。
- offline support の MVP 範囲と 将来課題 を分ける。
- error scenario が API/UI/test に渡せる粒度かレビューする。

## 関連リファレンス

- `references/requirements-and-scenarios.md`
- `references/story-quality-checklist.md`
