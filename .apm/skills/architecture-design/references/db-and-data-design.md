# DB とデータ設計: Your Quiz

## データ所有

- table と repository は bounded context と aggregate boundary に揃える。
- aggregate の transaction boundary を明示する。
- aggregate 間は ID reference を優先し、意図しない cross-aggregate object graph を避ける。
- 必要に応じて read model/search projection を command-side invariant から分離する。

## 永続化の基本方針

- SQLite / Cloudflare D1 は accepted persistence direction。
- Drizzle ORM は accepted ORM direction。
- schema と migration plan は再現可能で reviewable にする。
- DB constraint は domain invariant を補助できるが、domain rule が存在する唯一の場所にしない。

## オフラインと同期データ

- local/offline data は specialized representation として扱う。
- sync item lifecycle、conflict resolution、idempotency、cleanup を定義する。
- transformation layer なしで IndexedDB/local cache schema を public domain API に漏らさない。

## レビューチェック

- DB design は DDD aggregate ownership に従っているか。
- write consistency を損なわずに required query pattern を支えられるか。
- migration、rollback、seed/test data、retention/anonymization need は明確か。
- D1 limit と edge runtime constraint は考慮されているか。

## 出典ドキュメント

- `../your-quiz/docs/instructions/shared/workflow/05.01_db-design.md`
- `../your-quiz/docs/project/architecture/data-architecture.md`
- `../your-quiz/docs/project/architecture/communication-patterns.md`
- `../your-quiz/docs/project/adr/0007-database.md`
- `../your-quiz/docs/project/adr/0009-orm-selection.md`
- `../your-quiz/docs/project/adr/0012-database-hosting.md`
- `../your-quiz/docs/project/adr/0017-aggregate-design.md`
- `../your-quiz/docs/project/adr/0019-repository-pattern-adoption.md`
