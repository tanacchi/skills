---
name: api-design
description: Your Quiz の API 契約、TypeSpec スキーマ、OpenAPI 生成、API catalog 変更、REST endpoint 境界、レスポンス/エラーモデル、SDK 生成、Pub/Sub 統合、API 非機能要件を設計またはレビューするときに使う。
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: API design docs and, for implementation checks, TypeSpec tooling にアクセスできること。
---

# API 設計

## 利用タイミング

Your Quiz の API 設計、TypeSpec 契約、API catalog、OpenAPI 生成、SDK 方針、Pub/Sub 連携、API 非機能を扱うときに使う。

## 確認する入力

- 対象 bounded context と API 利用者
- TypeSpec / OpenAPI / API catalog の現状
- DDD aggregate boundary、UI flow、SDK 生成への影響
- 認証、エラー、pagination、rate limit、field selection、versioning 要件

## ワークフロー

1. `references/api-catalog-map.md` で endpoint の context と既存 catalog との重複を確認する。
2. `references/api-design-principles.md` で REST resource、action API、error model、compatibility を決める。
3. `references/api-non-functional.md` で performance、security、availability、monitoring、SDK 影響を確認する。
4. Contract-first で TypeSpec を source of truth にし、OpenAPI は生成物として扱う。
5. API catalog と generated contract の差分が出る場合は、どちらを source とするかを明示して揃える。

## 出力形式

- 対象 context と endpoint/resource design
- TypeSpec model/operation 方針
- response/error model と互換性への影響
- SDK/OpenAPI/API catalog 更新要否
- Non-functional checks and open questions

## ガードレール

- generated OpenAPI を contract source として手編集しない。
- API 境界は DDD context と揃え、management、learning、session、sync の意味を不用意に混ぜない。
- success shape だけでなく、明示的な error response を設計する。
- 後方互換性を壊す変更には versioning、migration、または明示承認が必要。
- session/security design を確認せずに authentication や privacy-sensitive field を追加しない。

## 評価シナリオ

- quiz 回答 endpoint を追加し、Quiz Management ではなく Quiz Learning に属することを確認する。
- response union/field selection の変更を SDK compatibility 観点でレビューする。
- API catalog 更新に TypeSpec と OpenAPI の再生成が必要か確認する。

## 関連リファレンス
- `references/api-design-principles.md`
- `references/api-catalog-map.md`
- `references/api-non-functional.md`
