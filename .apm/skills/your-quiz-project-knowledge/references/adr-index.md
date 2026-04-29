# ADR インデックス: Your Quiz

これは振り分け用 index として使う。決定変更、衝突解決、詳細依存の前に source ADR を読む。

| ADR | 決定 | 状態 | 実務上の影響 |
| --- | --- | --- | --- |
| 0001 | モジュラーモノリス | Accepted | 1つの deployable system の中で module boundary を明確に保つ。 |
| 0002 | ヘキサゴナルアーキテクチャ | Accepted | domain logic を framework、DB、transport から独立させる。 |
| 0003 | Next.js 15 App Router | Accepted | frontend work は Next.js App Router と PWA readiness を前提にする。 |
| 0004 | Tailwind CSS | Accepted | UI styling は Tailwind と project design token を使う。 |
| 0005 | Jotai | Accepted | local state で足りない shared frontend state には atomic state を使う。 |
| 0006 | Hono | Accepted | backend HTTP implementation は Hono を使い軽量に保つ。 |
| 0007 | SQLite + Cloudflare D1 | Accepted | persistence design は D1/SQLite constraints と edge execution に合わせる。 |
| 0008 | API hosting | Accepted | API deployment assumption を変える前に source ADR を確認する。 |
| 0009 | Drizzle ORM | Accepted | repository/persistence implementation は Drizzle を優先する。 |
| 0010 | Zod | Accepted | runtime validation は Zod を使い TypeScript type と整合させる。 |
| 0011 | Native fetch | Accepted | 新しい decision なしに HTTP client dependency を追加しない。 |
| 0012 | D1 database hosting | Accepted | 明示的に再検討されない限り database hosting は Cloudflare D1。 |
| 0013 | frontend hosting | Accepted | frontend hosting の前提 はこの ADR に従う。 |
| 0014 | API hosting | Accepted | API hosting assumption はこの ADR に従う。 |
| 0015 | REST API | Accepted | API design は REST-first とし、GraphQL を default にしない。 |
| 0016 | 境界づけられたコンテキスト分割 | Accepted | Quiz Management、Quiz Learning、User Session、Offline Sync の境界を明確に保つ。 |
| 0017 | 集約設計 | Accepted | 新しい ADR が supersede しない限り、4つの主要 aggregate boundary を保つ。 |
| 0018 | ドメインサービス抽出 | Accepted | aggregate 横断または複雑な domain decision には domain service を使う。 |
| 0019 | Repository pattern | Accepted | persistence は repository interface の背後に置く。 |
| 0020 | Cucumber.js + Vitest BDD | Superseded | 新規 BDD work では Cucumber.js を選ばず、ADR-0023 を参照する。 |
| 0021 | Quiz solution response strategy | Proposed | Union type + optional field selection strategy。依存前に status を確認する。 |
| 0022 | TypeSpec schema-first Hono integration | Accepted | TypeSpec を API contract source とし、generated type を Hono implementation に渡す。 |
| 0023 | PactumJS BDD migration | Accepted | 新規 BDD/API test は Cucumber.js ではなく PactumJS を使う。 |

## レビューでの使い方

- task が別の framework、database、API style、test framework、state library を提案する場合、黙って方針をずらさず関連 ADR を示して ADR update を求める。
- ADR が `Proposed` の場合は、確定ルールではなく設計候補として扱う。
- source docs が衝突する場合は、古い workflow example より新しい accepted ADR を優先する。

## 出典ドキュメント
- `../your-quiz/docs/project/adr/*.md`
