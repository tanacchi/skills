---
name: workflow-orchestration
description: Use this skill when planning or reviewing a development workflow: determining the current phase, verifying prerequisites, confirming scope boundaries, deciding whether docs/ADR updates are needed, and gating phase transitions with user approval. Triggers on requests like "次の工程に進んでいいか", "どの工程から始めるべきか", "ADR を作るべきか", "スコープ確認したい", "工程を整理して", or any multi-phase dev planning that spans design → implementation → test.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# 開発ワークフロー・オーケストレーション

## 利用タイミング

以下の状況でこの skill を使う：

- 現在どの開発工程にいるかを判定したいとき
- 工程の前提条件が満たされているか確認したいとき
- 工程間のスコープ境界を整理・確認したいとき
- docs や ADR の更新要否を判断したいとき
- 工程完了後の承認・次工程への移行を判断したいとき
- 複数工程にまたがる作業の分解・順序付けをしたいとき

## 確認する入力

- 現在の依頼内容と期待する成果物の種類
- 前工程の成果物（設計文書、テスト、実装）の有無と状態
- ユーザーが明示したスコープと承認状況
- 変更が新規機能・設計更新・実装・テスト・レビューのいずれか
- git の差分・既存ドキュメント・ADR の状態

## Workflow

1. `references/phase-routing.md` で現在工程と必要な前提成果物を照合する。
2. 前提成果物が揃っていない場合は、どの artifact が不足しているかを明示してユーザーに確認する。
3. スコープ確認：今回の工程で扱う範囲と除外する範囲を明文化し、境界が曖昧な場合はユーザーに問い合わせる。
4. `references/docs-adr-management.md` で docs・ADR の更新要否を判断する。
5. 更新が必要な場合は、新規作成なのか既存更新なのかを区別して作業する（新規 ADR は `Proposed` のみ）。
6. 工程完了時は acceptance criteria を確認し、未充足項目を残課題として明示する。
7. ユーザーにレビューを依頼し、明示的な承認を得てから次工程へ進む。

## 出力形式

- **現在工程**: 工程名と前提条件の充足状況
- **実施すべき成果物**: 今工程の完了判定基準
- **スコープ外または未決事項**: 次工程または将来課題として記録する項目
- **docs / ADR 更新要否**: 必要な場合は対象ファイルとステータスを明示
- **次工程への移行条件**: ユーザー確認が必要な事項の一覧

## ガードレール

- 新機能は必ず仕様整理から開始する。局所修正であっても仕様への影響がある場合は差分を明示する。
- 前工程の成果物がないまま次工程の詳細を確定しない。assumption を立てる場合は明示してユーザーに承認を得る。
- 工程完了前にユーザーの明示的承認を得ずに次工程に進まない。
- ADR を作成者が直接 `Accepted` にしない。`Proposed` で提出しユーザー承認後に変更する。
- 複数工程にまたがる作業は分解し、いま実行中の工程名を常に明示する。
- 未確定メモを source of truth として扱わない。open question として記録する。
- destructive コマンド・secrets・マシン固有パスを追加しない。

## 評価シナリオ

- 「API 実装を始めたいが、API 設計ドキュメントがまだない」と言われたとき、どの工程から実施すべきか整理する。
- 「DB スキーマを変更したが、ADR は必要か?」と問われたとき、ADR 作成の要否を判断する。
- 「DDD 設計中に具体的なエンドポイント仕様を書いてしまった」という状況で、スコープ逸脱を検出し対処する。
- 「BDD テストが全 Green になったので次へ進みたい」という依頼で、完了条件の充足を確認し承認ゲートを通過させる。

## 関連リファレンス

- `references/phase-routing.md`
- `references/docs-adr-management.md`
