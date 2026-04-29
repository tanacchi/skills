# Docs と ADR 管理: Your Quiz

## ドキュメントルール

- project fact は `docs/project/` に置き、再利用可能な instruction は `docs/instructions/` に置く。
- 工程固有の成果物は workflow guide が示す工程ディレクトリに置く。
- requirement から DDD、API、UI、test、ADR までの traceability を保つ。
- behavior、interface、context boundary、non-functional target、public workflow が変わる場合は docs を更新する。
- 長い source docs を複数箇所にコピーしない。一度だけ要約し、source docs へ link する。

## ADR ルール

- architecture pattern、technology selection、data/storage strategy、API style、hosting、non-functional strategy、長く残る cross-team rule には ADR を作成または更新する。
- 新規 ADR は `Proposed` から始め、明示承認または既存文書上の status がある場合だけ `Accepted` にする。
- ADR file name は zero-padded number と短い English slug を使う。
- ADR の追加または status 変更時は ADR index/readme を更新する。
- 現在の作業が accepted ADR と矛盾する場合、判断を黙って上書きしない。superseding ADR を提案する。

## 将来課題 ルール

- 実在するが今回 scope 外の要求は 将来課題 に移す。
- 現在の story に必要な未完了 acceptance criteria を 将来課題 に隠さない。
- 不確実な内容は project fact ではなく open question として記録する。

## 安全ルール

- secrets、tokens、machine-specific absolute paths を追加しない。
- 採用判断が文書化されていない限り、`docs/tmp` を source of truth にしない。
- ユーザーが明示しない限り、`docs/instructions/shared/tests/` 配下の制限付き quiz file を読んだり要約したりしない。skill guidance には README の警告で十分。

## 出典ドキュメント
- `../your-quiz/docs/instructions/shared/workflow/00.03_docs.md`
- `../your-quiz/docs/instructions/shared/workflow/00.04_adr-management.md`
- `../your-quiz/docs/project/adr/README.md`
- `../your-quiz/docs/project/adr/templates/adr-template.md`
