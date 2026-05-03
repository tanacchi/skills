# API 非機能要件: Your Quiz

## パフォーマンス

- 各 context/operation について、API 非機能 docs の p95 latency target を使う。
- answer/judgement path は軽量に保ち、hot path での context 横断 read を避ける。
- search、sync、operations endpoint は answer submission と異なる latency budget を持ち得る。
- 増大しやすい list endpoint には pagination/cursor を追加する。

## 信頼性とスケール

- sync と event-driven integration operation には冪等性を設計する。
- retry により request が重複し得る箇所には conflict semantic を定義する。
- context 内の整合性を優先し、context 横断の副作用には event/workflow を使う。
- write-heavy endpoint を設計するときは D1/SQLite constraint を考慮する。

## セキュリティとプライバシー

- user-generated quiz content を validate/sanitize する。
- 匿名 session identity と creator permission を明示する。
- creation、search、answer、その他 abuse-prone operation には rate limiting を含める。
- public response shape で device fingerprint、salt、internal id、operational detail を露出しない。

## 可観測性

- operations API と metrics は sensitive data を漏らさずに health と performance を公開する。
- common specs が要求する箇所には request id と structured error code を含める。
- API latency は global average だけでなく、context と operation ごとに monitor する。

## 出典ドキュメント
- `../your-quiz/docs/project/api-design/non-functional-requirements.md`
- `../your-quiz/docs/project/api-design/api-catalog/07-common-specs.md`
- `../your-quiz/docs/project/api-design/api-catalog/08-operations.md`
- `../your-quiz/docs/project/api-design/pub-sub-integration.md`
