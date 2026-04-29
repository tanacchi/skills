---
name: architecture-design
description: Your Quiz のアーキテクチャ、技術選定、システム境界、データアーキテクチャ、DB 設計、通信方式、非機能要件、ホスティング、監視、ADR レベルの判断を設計またはレビューするときに使う。
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Your Quiz の architecture、ADR、workflow docs にアクセスできること。
---

# アーキテクチャ設計

## 利用タイミング

Your Quiz の architecture、tech selection、communication、data/DB design、non-functional requirements、hosting、monitoring、ADR 判断を扱うときに使う。

## 確認する入力

- 変更対象の capability、context、API/UI/data flow
- 既存 architecture docs、ADR、tech selection
- performance、availability、security、operability、cost constraint
- DDD aggregate boundary と persistence need

## ワークフロー

1. `references/architecture-decisions.md` で accepted ADR と technical baseline を確認する。
2. `references/non-functional-checklist.md` で performance/security/availability/operations/cost impact を確認する。
3. `references/db-and-data-design.md` で aggregate boundary、data ownership、D1/SQLite constraints、migration impact を確認する。
4. 選択肢、tradeoff、decision、impact、rollback/migration consideration を整理する。
5. Durable decision なら ADR 作成または更新を提案する。

## 出力形式

- アーキテクチャ判断またはレビュー結果
- alternative と tradeoff
- 影響を受ける context/component/data flow
- non-functional impact
- ADR/docs update recommendation

## ガードレール

- Accepted ADR と矛盾する設計変更は、実装だけで進めず ADR 更新を提案する。
- DB design は DDD aggregate と transaction boundary を確認してから確定する。
- Non-functional targets を曖昧にしたまま technology decision を確定しない。
- `docs/tmp` を採用済み architecture source として扱わない。

## 評価シナリオ

- new storage requirement が D1/SQLite 方針に合うか確認する。
- API latency target を満たす communication/data flow をレビューする。
- framework/library change proposal が既存 ADR と衝突しないか確認する。

## 関連リファレンス

- `references/architecture-decisions.md`
- `references/non-functional-checklist.md`
- `references/db-and-data-design.md`
