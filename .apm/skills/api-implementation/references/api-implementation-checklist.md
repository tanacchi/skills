# API 実装チェックリスト: Your Quiz

## 実装前

- [ ] 関連する TypeSpec/API catalog entry がある、または contract change が今回 task に含まれている。
- [ ] endpoint が正しい bounded context に属している。
- [ ] request/response/error shape と status code が文書化されている。
- [ ] D1/Drizzle binding と environment name が分かっている。
- [ ] test level が BDD/API、unit、mutation、E2E、focused regression から選ばれている。

## 実装中

- [ ] Hono route は薄く、application/domain logic は handler の外にある。
- [ ] JSON parsing と validation が分離されている。
- [ ] Zod schema が generated TypeSpec types と揃っている。
- [ ] 想定内の error が型付けされ、common error response format に map されている。
- [ ] `as any`、`@ts-ignore`、広すぎる non-null assertion を避けている。
- [ ] repository code が SQL/D1 detail を domain object に漏らしていない。
- [ ] API design が要求する箇所で user content が sanitized されている。

## レビュー前

- [ ] typecheck が通る。
- [ ] 関連 test が通る、または skip した test の理由が説明されている。
- [ ] 必要な generated artifact は script 経由で再生成されている。
- [ ] API catalog と TypeSpec contract が整合している。
- [ ] error response example が、該当する場合に success、validation、not found、conflict、auth/rate limit を覆っている。

## よく使うコマンド

- ad hoc command より `pnpm-scripts.md` の project script を優先する。
- shared TypeSpec tooling docs の TypeSpec generation command を使う。
- DB-backed test には test env / D1 test binding を使う。

## 出典ドキュメント
- `../your-quiz/docs/instructions/project/README.md`
- `../your-quiz/docs/instructions/project/api-implementation-rules.md`
- `../your-quiz/docs/instructions/project/pnpm-scripts.md`
- `../your-quiz/docs/instructions/shared/tools/typespec.md`
- `../your-quiz/docs/instructions/shared/tools/npm.md`
