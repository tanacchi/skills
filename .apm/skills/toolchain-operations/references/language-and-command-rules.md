# 言語とコマンドルール: Your Quiz

## Markdown

- workflow docs が求める場合、downstream agent 向けに purpose、constraints、output、completion criteria が分かる構造にする。
- 長い説明のコピーより、簡潔な checklist と追跡可能な source link を優先する。
- docs を skill に要約するときは 出典ドキュメント reference を正確に保つ。

## TypeScript

- strict typing と project convention を優先する。
- local justification がない限り、`any`、広すぎる assertion、ignored type error、non-null assertion を避ける。
- domain、application、API、persistence の concern を分離する。
- API contract が shape を定義済みの場合は generated type を使う。

## TypeSpec

- schema-first API definition は TypeSpec に置く。
- generated OpenAPI と generated TypeScript types は手 patch ではなく再生成する。
- namespace/model/operation の構成は bounded context と揃える。

## コマンド安全性

- mutating command 実行前に docs を読み、状態を確認する。
- Distinguish validation commands from rewriting commands.
- Network or install commands may require approval in restricted environments.
- Never expose secrets in command output, test fixtures, or docs.

## 出典ドキュメント

- `../your-quiz/docs/instructions/shared/languages/markdown.md`
- `../your-quiz/docs/instructions/shared/languages/typescript.md`
- `../your-quiz/docs/instructions/shared/languages/typespec.md`
- `../your-quiz/docs/instructions/shared/tools/npm.md`
- `../your-quiz/docs/instructions/shared/tools/typespec.md`
