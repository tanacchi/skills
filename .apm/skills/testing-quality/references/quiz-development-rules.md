# クイズ開発ルール: 重要チェックリスト

この file は、制限付きの quiz question/answer file を意図的に要約しない。読める workflow/tool/language docs と tests README の警告から、test と workflow の guardrail だけを記録する。

## 制限付きテスト文書

- 明示指示がない限り、`../your-quiz/docs/instructions/shared/tests/` 配下の question、answer、complete files を読まない。
- README warning を読むことは許可されており、行動指針として扱う。
- restricted quiz content を skill の source material にしない。

## ワークフローと品質ガードレール

- new feature behavior では specification/design phase を省略しない。
- domain invariant が不明確な間は DB design より DDD を先にする。
- workflow docs が implementation 前の executable specs を求める場合は TDD/BDD を優先する。
- git、npm/pnpm、mise、TypeSpec、Markdown、TypeScript convention は project tool docs を使う。
- local rule が明示許可し risk を報告した場合を除き、`any`、広すぎる assertion、type error の無視を避ける。
- 長く残る architecture / technology decision には ADR を提案する。

## レビューチェックリスト

- test は business behavior を検証しているか、それとも implementation shape だけを見ているか。
- success path と failure path の両方が覆われているか。
- API test は TypeSpec/OpenAPI contract と揃っているか。
- DB-backed test は production data から隔離されているか。
- deferred case は test gap または 将来課題 として記録されているか。

## 出典ドキュメント
- `../your-quiz/docs/instructions/shared/tests/README.md`
- `../your-quiz/docs/instructions/shared/workflow/00.01_common.md`
- `../your-quiz/docs/instructions/shared/workflow/00.02_workflow.md`
- `../your-quiz/docs/instructions/shared/languages/typescript.md`
- `../your-quiz/docs/instructions/shared/tools/git.md`
- `../your-quiz/docs/instructions/shared/tools/npm.md`
- `../your-quiz/docs/instructions/shared/tools/typespec.md`
