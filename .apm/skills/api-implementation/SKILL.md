---
name: api-implementation
description: Your Quiz の Hono API を TypeScript、TypeSpec 生成型、Zod validation、neverthrow Result flow、Cloudflare Workers、D1/Drizzle 永続化、API scripts、runtime error handling とともに実装またはレビューするときに使う。
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Your Quiz API implementation project と generated API contract にアクセスできること。
---

# API 実装

## 利用タイミング

Your Quiz の Hono API 実装、TypeSpec 生成型との整合、Zod validation、neverthrow error handling、D1/Drizzle persistence、API scripts を扱うときに使う。

## 確認する入力

- TypeSpec/OpenAPI/generated types の現状
- Hono route、handler、bindings、environment の現状
- Zod schema、use case、domain service、repository
- pnpm scripts、typecheck、BDD/unit test commands

## ワークフロー

1. `references/hono-typespec-neverthrow.md` で standard handler、validation、error handling rule を確認する。
2. `references/api-implementation-checklist.md` で実装前、実装中、レビュー前の確認項目を追う。
3. TypeSpec 生成型と Zod schema の整合を `satisfies` などで担保する。
4. request parsing、validation、use case、repository、response mapping を明確に分離する。
5. Typecheck、unit/API tests、BDD tests を変更リスクに応じて実行する。

## 出力形式

- 変更した route/handler/use case/repository
- 契約と validation の整合性
- error mapping と status code
- 実行した command/test
- 残る risk または assertion

## ガードレール

- `as any`、`@ts-ignore`、未確認の non-null assertion を避ける。
- TypeSpec 契約と並行する独自 request/response 型を作って契約を迂回しない。
- 想定内の失敗は型付き error result に変換し、文書化された HTTP response に対応付ける。
- Cloudflare Workers/D1 binding は型付けし、環境固有データを source に入れない。
- project が明示的に checked-in output と扱う場合を除き、generated file を手編集しない。

## 評価シナリオ

- TypeSpec から Hono と Zod validation まで一貫した quiz 作成 endpoint を実装する。
- runtime error を投げる handler を、想定内の失敗を Result flow に変換する形で修正する。
- D1 repository code が persistence detail を domain logic に漏らしていないかレビューする。

## 関連リファレンス
- `references/hono-typespec-neverthrow.md`
- `references/api-implementation-checklist.md`
