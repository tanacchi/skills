# アーキテクチャ決定: Your Quiz

## 基本アーキテクチャ

- system architecture: modular monolith。
- application architecture: hexagonal architecture。
- フロントエンド: Next.js 15 App Router。PWA/mobile-first 方針。
- styling/state: Tailwind CSS と Jotai。
- バックエンド: Hono on Cloudflare Workers.
- API style: REST-first、TypeSpec schema-first。
- persistence: SQLite / Cloudflare D1 と Drizzle ORM。
- テスト: PactumJS、Vitest、Playwright、Stryker。

## 通信パターン

- frontend は文書化された contract を通じて Hono API と通信する。
- context 横断の effect は API boundary、domain event、または明示的な transformation layer を使う。
- offline sync は local/offline representation を core domain API から隔離する。
- monitoring/operations API は sensitive internal を漏らさず health と metrics を公開する。

## ADR の扱い

- framework、hosting、DB、validation、HTTP client、API style、bounded context、aggregate design、repository pattern、BDD framework、TypeSpec/Hono integration には既存 ADR を source of truth として使う。
- accepted ADR を変更する場合、黙って矛盾させず superseding decision を作る。
- proposed ADR に依存する場合、status を確認するか assumption として記録する。

## 出典ドキュメント

- `../your-quiz/docs/instructions/shared/workflow/02.01_architecture.md`
- `../your-quiz/docs/instructions/shared/workflow/06.01_tech-selection.md`
- `../your-quiz/docs/project/architecture/README.md`
- `../your-quiz/docs/project/architecture/system-overview.md`
- `../your-quiz/docs/project/architecture/tech-selection.md`
- `../your-quiz/docs/project/architecture/communication-patterns.md`
- `../your-quiz/docs/project/architecture/diagrams/*.md`
- `../your-quiz/docs/project/adr/*.md`
