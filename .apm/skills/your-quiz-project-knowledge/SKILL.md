---
name: your-quiz-project-knowledge
description: Use this skill when working on Your Quiz and you need project-wide context: product goals, ADR decisions, architecture, domain/API/UI mapping, non-functional constraints, or consistency checks before design, implementation, or review.
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Requires access to ../your-quiz/docs or the checked-in project knowledge references.
---

# Your Quiz Project Knowledge

## 利用タイミング

Your Quiz の設計、実装、レビュー、調査で、プロダクト固有の前提を確認するときに使う。特に ADR、境界づけられたコンテキスト、API catalog、UI flow、非機能要件との整合性確認に使う。

## 確認する入力

- 変更対象の機能、画面、API、ドメインオブジェクト
- 関連する ADR、DDD context、API catalog、UI flow
- 性能、可用性、オフライン、匿名利用などの制約
- 既存方針と衝突しそうな提案や実装

## Workflow

1. `references/project-facts.md` でプロダクト価値、対象ユーザー、技術スタック、非機能目標を確認する。
2. `references/adr-index.md` で関連 ADR と superseded decision を確認する。
3. `references/domain-api-ui-map.md` で DDD context、API、UI の対応関係を確認する。
4. 既存方針と衝突する場合は、衝突する ADR/設計文書と代替案を明示する。
5. 詳細が references にない場合だけ `../your-quiz/docs/project/...` の原典を読む。

## Output Format

- 関連する project facts / ADR / DDD context / API / UI
- 既存方針との整合性
- 衝突や未決事項がある場合の具体的な指摘
- 実装またはレビューで守るべき制約

## Guardrails

- ADR-0023 により BDD は PactumJS 方針。Cucumber.js は ADR-0020 の superseded decision として扱う。
- docs にない前提を project fact として断定しない。
- コンテキスト境界を跨ぐ場合は API、event、ACL、変換 layer の必要性を確認する。
- secrets、tokens、machine-specific paths を project knowledge に追加しない。

## Evaluation Scenarios

- 新しい API endpoint がどの bounded context に属するか確認する。
- 既存 ADR と矛盾する技術提案をレビューする。
- UI flow、API catalog、DDD model の対応漏れを探す。

## Related References
- `references/project-facts.md`
- `references/adr-index.md`
- `references/domain-api-ui-map.md`
