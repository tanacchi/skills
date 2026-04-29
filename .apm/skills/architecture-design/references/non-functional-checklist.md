# 非機能チェックリスト: Your Quiz

## パフォーマンス

- architecture を選ぶ前に、operation ごとの p95 target を特定する。
- 不要な cross-context work から quiz answering と judgement latency を守る。
- 文書化されている場合は cache、index、pagination、generated contract を使う。
- mobile-first flow の UI interaction performance を確認する。

## 可用性と信頼性

- 不安定な network support が user value に関わる場合は offline-capable behavior を設計する。
- sync と event-driven operation には retry/idempotency を定義する。
- failure mode は recoverable state として UI/API consumer に見える形にする。

## セキュリティとプライバシー

- anonymous usage model と session ownership rule を守る。
- user-generated quiz content を sanitize する。
- secrets、device fingerprint、salt、internal id、operational detail を漏らさない。
- creation、search、high-volume answer flow には rate limiting と abuse prevention を適用する。

## 運用性

- API common specs が要求する箇所には structured error/request id を含める。
- API operation には health、metrics、logs を検討する。
- generated artifact と script は再現可能に保つ。

## コストと保守性

- 新しい ADR が変更しない限り、既存の Cloudflare/Vercel/GitHub Actions 前提の stack を優先する。
- 選定済み stack の責務と重複する library を導入しない。
- module boundary は小規模 team が理解できる形に保つ。

## 出典ドキュメント

- `../your-quiz/docs/project/architecture/non-functional-requirements.md`
- `../your-quiz/docs/project/api-design/non-functional-requirements.md`
- `../your-quiz/docs/project/api-design/api-catalog/08-operations.md`
- `../your-quiz/docs/instructions/shared/workflow/02.01_architecture.md`
