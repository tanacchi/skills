---
name: ddd-design
description: Use this skill when designing or reviewing Your Quiz domain models, ubiquitous language, bounded contexts, entities, value objects, aggregates, domain services, domain events, invariants, or DDD-to-implementation constraints.
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Requires access to Your Quiz specifications and DDD design docs.
---

# DDD Design

## 利用タイミング

Your Quiz のドメイン理解、ユビキタス言語、イベントストーミング、境界づけられたコンテキスト、集約、値オブジェクト、ドメインサービス、ドメインイベントを扱うときに使う。

## 確認する入力

- 要件、ユーザーストーリー、成功/失敗シナリオ
- 既存の DDD 成果物とユビキタス言語
- 変更対象の bounded context と aggregate
- API、DB、UI がドメイン境界へ与える影響

## Workflow

1. `references/strategic-design.md` で言語、業務フロー、context map を確認する。
2. `references/tactical-design.md` で entity/value object/domain service/aggregate の分類と不変条件を決める。
3. `references/bounded-contexts-and-events.md` で context 間連携と domain events を確認する。
4. 集約ルートが守る振る舞い、不変条件、エラー、イベントを明示する。
5. 実装へ渡す場合は Brand/Zod/Result などの型表現方針を、実装詳細に寄りすぎない粒度で示す。

## Output Format

- 対象 bounded context と責務
- Entity / Value Object / Aggregate / Domain Service の候補と理由
- 不変条件、状態遷移、エラー、イベント
- API/DB/UI へ渡す制約
- 未決事項と確認すべき source docs

## Guardrails

- ドメインルールを UI、DB trigger、Hono handler だけに閉じ込めない。
- 他 aggregate への参照は ID を基本とし、直接 object graph を持ち込まない。
- Context 間の変換は API/event/ACL で扱い、内部 model を漏らさない。
- Existing ubiquitous language と衝突する命名は source docs を確認してから変更する。

## Evaluation Scenarios

- 新しい quiz creation rule が Quiz aggregate の不変条件か domain service か判定する。
- Offline Sync の都合が Quiz Learning model に漏れていないか確認する。
- Domain event の発火条件と downstream impact をレビューする。

## Related References
- `references/strategic-design.md`
- `references/tactical-design.md`
- `references/bounded-contexts-and-events.md`
