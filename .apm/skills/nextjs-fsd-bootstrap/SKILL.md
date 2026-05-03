---
name: nextjs-fsd-bootstrap
description: Use this skill when bootstrapping a new Next.js App Router repository with Feature Sliced Design, jotai, Storybook with Playwright-backed render tests, Vitest unit tests with high coverage thresholds, Playwright E2E plus visual regression tests, Biome, Steiger, and a CI pipeline that gates merges to main. Also use when retrofitting an existing repo with FSD layering, Storybook addon-vitest, Playwright VRT baselines, or a Vercel + GitHub Actions release gate.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires pnpm, mise, gh CLI, and Node 24+. Targets Next.js 16, React 19, jotai 2, Storybook 10 (nextjs-vite), Vitest 4, Playwright 1.59+, Biome 2, Steiger 0.5.
---

# Next.js × FSD bootstrap

Next.js (App Router) のリポジトリを Feature Sliced Design で立ち上げ、 Storybook / Vitest / Playwright VRT / Biome / Steiger / CI / Vercel まで一気に整える skill。再現済みリファレンスは `tanacchi/escape` (`https://github.com/tanacchi/escape`)。

## 利用タイミング

- 空のディレクトリから Next.js + jotai + FSD のフロントエンドリポジトリを新規構築するとき。
- 既存リポジトリに Storybook + addon-vitest や Playwright VRT、Steiger を後から追加するとき。
- 「PR 緑 = リリース可」を成立させる CI pipeline を組み直すとき。
- Next.js 16 / Storybook 10 / Vitest 4 / Biome 2 への移行で互換性のギャップを埋めるとき。

## 確認する入力

着手前に以下を AskUserQuestion などで明確化する。

1. **VRT 手法**: Playwright snapshot 単独 / Storybook test runner / 両方併用。
2. **デプロイ連携**: Vercel Git Integration / GitHub Actions + Vercel CLI。
3. **toolchain pin**: mise + .tool-versions / .nvmrc + corepack / packageManager フィールドのみ。
4. **data-testid 規約**: 意味的 ElementType (`button` / `link` / ...) / FSD レイヤ別 / HTML タグ準拠。
5. **GitHub repo 作成と push 範囲**: ローカル init のみ / `gh repo create` で push まで。
6. **Vercel 連携の有無**: 必要なら `vercel.json` を入れて Dashboard で import を案内。

設計判断の詳細は `references/architecture.md` を参照。

## Workflow

> **IMPORTANT**: このセクションは概要。実コマンド・ファイル雛形・落とし穴の全文は `references/` に分割している。各ステップ着手時に該当 reference を読むこと。

1. **toolchain を固定する** — `references/toolchain.md`
   - mise で Node 24 系最新 / pnpm 10 系最新を pin。 `.tool-versions` と `package.json#engines` / `packageManager` を一致させる。
   - 各 Bash 呼び出しでは mise shims を `PATH` に追加するか `mise exec --` を使う (一発の cd では activate が効かない)。

2. **ディレクトリを scaffold する** — `references/architecture.md`
   - `/app/` (Next.js router 専用 shell) / `/pages/README.md` のみ / `/src/{app,pages,widgets,features,entities,shared}/` (FSD)。
   - `/pages/` には Markdown 以外を置かないことを README で宣言する。Next.js は TS/JS のみをルートとして拾うので Markdown はルート登録されない。
   - alias は `@/*` に加えて `@app/* @pages/* @widgets/* @features/* @entities/* @shared/*` を生やす。

3. **核となる共有コードを置く** — `references/architecture.md`
   - `src/shared/lib/testid.ts` で意味的 `ElementType` と `testId(prefix, suffix)` ヘルパを用意。
   - `src/app/providers/AppProviders.tsx` に `'use client'` の jotai `<Provider>` を集約し、`/app/layout.tsx` から呼ぶ。

4. **Vitest / Storybook / Playwright を組む** — `references/test-stack.md`
   - Vitest 4: `defineConfig({ test: { projects: [...] } })` で unit と storybook を分割。`defineWorkspace` は廃止。
   - Storybook 10: `@storybook/nextjs-vite` + `@storybook/addon-vitest` を使う。webpack 版 (`@storybook/nextjs`) は addon-vitest と組み合わせると `virtual:/@storybook/builder-vite/...` を解決できず落ちる。
   - browser provider は文字列 `'playwright'` ではなく `@vitest/browser-playwright` の `playwright()` を渡す (Vitest 4 の型変更)。
   - Playwright config は `process.env['CI']` (索引アクセス) を使い、 `workers: undefined` を避けるため条件 spread で組む (strictest の `exactOptionalPropertyTypes`)。
   - VRT の `toHaveScreenshot` は `maxDiffPixelRatio: 0.05` (≒ 95% 一致)。

5. **lint / format を組む** — `references/test-stack.md`
   - Biome 2: `files.includes` (除外は先頭 `!`)、`assist.actions.source.organizeImports`、`overrides[].includes` に注意。1.x の旧 schema (`files.ignore`, `organizeImports`) は通らない。
   - Steiger 0.5: `defineConfig` は `steiger` から import する (`steiger/config` ではない)。空 layer での `fsd/insignificant-slice` と `fsd/segments-by-purpose` は `'off'` にする。
   - 共有 util は `src/shared/types/` ではなく `src/shared/lib/` に置く (segments-by-purpose 規約)。

6. **品質ゲートを設定する** — `references/test-stack.md`
   - Vitest coverage thresholds は `lines/functions/branches/statements` 全て 95%。
   - `pnpm test` は **unit project のみ**にして CI で Playwright を要求しない構成にする。 `pnpm test:all` を別途用意。
   - 全 story が browser で描画されることを `pnpm test:storybook` (= `vitest run --project=storybook`) で保証。

7. **CI を組む** — `references/ci-vercel.md`
   - `.github/workflows/ci.yml` の jobs: `setup` / `typecheck` / `lint` / `unit` / `storybook` / `build` / `e2e` / `ci (required)`。
   - Storybook と E2E job では `pnpm exec playwright install --with-deps chromium` を必ず実行。
   - `ci (required)` の集約 job をブランチ保護の Required Check に指定すれば「PR 緑 = リリース可」が成立。
   - `public/` ディレクトリが空でも `staticDirs: ['../public']` の解決失敗を避けるため `public/.gitkeep` を commit。

8. **VRT ベースラインを Linux で確定する** — `references/ci-vercel.md`
   - 初回 push 後の CI 失敗時に `playwright-report` artifact を `gh run download` し、PNG を `e2e/<spec>.ts-snapshots/<test-id>-chromium-linux.png` に配置して再 commit する。
   - `.gitignore` で `e2e/**/*-snapshots/*-darwin.png` を除外し、Linux baseline のみを正本にする。
   - macOS でローカル e2e を走らせると baseline 不在でこけるが、これは想定挙動として README に明記。

9. **Vercel と GitHub repo を仕上げる** — `references/ci-vercel.md`
   - `vercel.json` に `"framework": "nextjs"` のみ最小指定。Production Branch = `main`。GH Actions からは触らない。
   - `gh repo create <owner>/<name> --public --source=. --remote=origin --push` で初回 push。

10. **Claude Code 設定を入れる** — `references/claude-code.md`
    - `CLAUDE.md` に FSD 依存方向 / data-testid 規約 / TDD / 95% 閾値 / `/app` と `/pages` の禁則を明記。
    - `.claude/settings.json` で pnpm 系コマンド allow-list と Edit/Write 後の Biome auto-format hook を設定。
    - `.claude/commands/scaffold-feature.md` で feature slice 雛形生成 slash command を定義。

11. **検証する**
    - `pnpm typecheck && pnpm lint && pnpm test && pnpm build` が全部緑。
    - `pnpm test:storybook` がブラウザモードで通る (要 `pnpm exec playwright install chromium`)。
    - `pnpm e2e` は VRT baseline がある OS でのみ全通過。CI Linux 上で全通過することが本番判定。

## Output Format

- 作成 / 更新したパスの一覧。
- 検証コマンドの最終出力 (typecheck / lint / test / build / e2e の各結果サマリ)。
- リポジトリ URL と CI run URL (緑になっていることを示す)。
- 既知の OS 依存事項 (例: VRT は Linux baseline 運用) を README / CLAUDE.md に明記したことの確認。

## Guardrails

- **`/pages/` に TS/JS を置かない**。Markdown のみ許容。FSD pages 層は `/src/pages/` 側。違反すると Next.js が Pages Router を起動してしまう。
- **`/app/` 配下にロジックを書かない**。`page.tsx` は FSD pages slice を return するだけ。
- **data-testid を直書きしない**。 必ず `testId(type, suffix)` ヘルパ経由で、E2E 側も `getByTestId(testId(...))` のみ。XPath / text セレクタ / role セレクタは i18n 耐性のため使わない。
- **カバレッジ 95% 閾値を下げない**。下回る変更は実装簡素化かテスト追加で対処する。skip / 削除で逃げない。
- **Storybook 10 + addon-vitest は Vite 必須**。`@storybook/nextjs` (webpack) は使えない。`@storybook/nextjs-vite` を採用する。
- **Vitest 4 の `defineWorkspace` は廃止**。`test.projects` 配列に書き直す。
- **Biome 2 の schema 変更**: `files.ignore` → `files.includes` (`!` で除外), `organizeImports` → `assist.actions.source.organizeImports`, `overrides[].include` → `overrides[].includes`。
- **`process.env.CI` ではなく `process.env['CI']`**。strictest の `noPropertyAccessFromIndexSignature` を避けるためインデックスアクセスを使う。Biome 側は `complexity/useLiteralKeys: off` で衝突を回避。
- **VRT baseline は Linux 版のみ commit する**。macOS 生成分は `.gitignore` で弾き、CI artifact から取り出して載せる。
- **`pnpm test` は unit project に限定**。CI の unit job が Playwright を要求しないようにする。Storybook テストは別 job で `pnpm test:storybook`。
- **Bash 呼び出しごとに mise の activate は失われる**。`PATH=$HOME/.local/share/mise/shims:$PATH` を毎回前置するか `mise exec --` を使う。
- **VRT 失敗を skip しない**。実 Linux baseline を CI artifact から取り込み、根本対処する。

## Related References

- `references/architecture.md` — FSD と Next.js App Router の共存ルール、ディレクトリ scaffold、testid と Provider の置き場。
- `references/toolchain.md` — mise / pnpm / .tool-versions / engines / Bash 呼び出しの注意点。
- `references/test-stack.md` — Vitest 4 / Storybook 10 (nextjs-vite + addon-vitest) / Playwright / Biome 2 / Steiger 0.5 の正解設定と落とし穴。
- `references/ci-vercel.md` — GitHub Actions 構成 / Required Check / Vercel Git Integration / VRT baseline 運用。
- `references/claude-code.md` — `CLAUDE.md` のルール / `.claude/settings.json` の hook と allow-list / scaffold-feature slash command。
- 検証済みリポジトリ: `https://github.com/tanacchi/escape`
