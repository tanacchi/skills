# プロジェクト基本情報: Your Quiz

## プロダクト

- プロダクト名: Your Quiz。
- vision: いつでもどこでも、手軽にクイズ学習。
- core value: 匿名で手軽に始められ、スワイプ中心の回答体験で学習効率を上げる。
- 主要ユーザー: ログインなしでクイズを解きたい学習者。作成・承認・履歴確認も扱う。
- 主要実行環境: smartphone browser、mobile-first、PWA/offline support。

## 技術スタック

- フロントエンド: Next.js 15 App Router, Tailwind CSS, Jotai.
- バックエンド: Hono on Cloudflare Workers, TypeScript.
- persistence: SQLite / Cloudflare D1、Drizzle ORM。
- API schema: TypeSpec、OpenAPI generation、openapi-typescript SDK/type generation。
- テスト: BDD/API は PactumJS、unit/TDD は Vitest、E2E は Playwright、mutation testing は Stryker。
- API style: REST-first。必要に応じて ADR-0021 の field selection / union response strategy を使う。

## 非機能目標

- API response: API 固有のより狭い target がない限り、core operation は p95 100ms。
- UI: 375px mobile-first、44px 以上の touch target。
- availability: monthly 99.5% target。degraded network condition には offline mode で対応する。
- セキュリティ: anonymous session model, JWT/device identification where applicable, sanitized user content.
- データ保持: 承認済みクイズは永続化し、回答履歴は文書化された保持期間後に匿名化する。

## 共通の設計圧力

- 作成者/セッション権限を保ちながら、匿名利用はシンプルに保つ。
- クイズ回答を高速に保ち、hot path に context 横断 join を追加しない。
- offline sync は全 feature に sync logic を散らさず、specialized context として扱う。
- TypeSpec から runtime validation と domain logic まで TypeScript type safety を保つ。

## 出典ドキュメント
- `../your-quiz/docs/project/specifications/requirements/requirements-quiz.md`
- `../your-quiz/docs/project/specifications/user-stories/user-story-quiz.md`
- `../your-quiz/docs/project/architecture/system-overview.md`
- `../your-quiz/docs/project/architecture/tech-selection.md`
- `../your-quiz/docs/project/architecture/non-functional-requirements.md`
