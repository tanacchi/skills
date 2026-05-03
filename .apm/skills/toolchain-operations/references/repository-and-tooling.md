# リポジトリとツール: Your Quiz

## リポジトリセットアップ

- onboarding や tool assumption を変える前に repository setup docs を確認する。
- global な one-off command より、既存 package manager と script を優先する。
- runtime/tool version assumption には mise docs を参照する。
- setup step は再現可能にし、machine-specific path を避ける。

## Git

- file を変更する前に `git status` を確認する。
- commit を求められた場合、commit は scoped かつ reviewable に保つ。
- unrelated user change を破棄しない。
- 明示承認なしに destructive command を避ける。

## npm / pnpm Scripts

- dev、build、typecheck、test、TypeSpec generation、BDD、mutation、deployment operation には文書化された script を使う。
- project docs の workspace-aware command を優先する。
- script が generated artifact を書き換える場合は、実行前に想定される file を明示する。

## TypeSpec ツール

- TypeSpec は OpenAPI と TypeScript 向け contract の生成に使う。
- generated OpenAPI を手編集せず、文書化された `tsp compile` / generation script を使う。
- schema command 実行後は generated diff を確認する。

## 出典ドキュメント

- `../your-quiz/docs/instructions/shared/repository-setup.md`
- `../your-quiz/docs/instructions/shared/tools/git.md`
- `../your-quiz/docs/instructions/shared/tools/mise.md`
- `../your-quiz/docs/instructions/shared/tools/npm.md`
- `../your-quiz/docs/instructions/shared/tools/typespec.md`
- `../your-quiz/docs/instructions/project/pnpm-scripts.md`
