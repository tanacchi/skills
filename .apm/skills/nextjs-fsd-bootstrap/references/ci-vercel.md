# CI と Vercel

## GitHub Actions ワークフロー

`.github/workflows/ci.yml`:

- トリガ: `pull_request` + `push: branches: [main]`
- 並列 job: `setup` → (`typecheck`, `lint`, `unit`, `storybook`, `build`) 並列、`e2e` は `build` に依存
- 集約 job `ci (required)` で全 job の結果を `contains(needs.*.result, 'failure')` で判定
- ブランチ保護で `ci (required)` を **Required Check** に指定すると「PR 緑 = リリース可」が技術的に成立

### ジョブごとの要点

| job         | 重要なステップ                                                                              |
| ----------- | ------------------------------------------------------------------------------------------ |
| `setup`     | `actions/checkout@v4` → `jdx/mise-action@v2` → `actions/cache@v4` (`pnpm store`) → `pnpm install --frozen-lockfile` |
| `typecheck` | `pnpm typecheck`                                                                           |
| `lint`      | `pnpm lint` (= `biome check . && steiger src`)                                             |
| `unit`      | `pnpm test` (= `vitest run --project=unit --coverage`)。`coverage/` を artifact upload   |
| `storybook` | `pnpm exec playwright install --with-deps chromium` → `pnpm build-storybook` → `pnpm test:storybook` |
| `build`     | `pnpm build`                                                                                |
| `e2e`       | `pnpm exec playwright install --with-deps chromium` → `pnpm e2e`。失敗時 `playwright-report/` を artifact upload |

### 落とし穴

- **`unit` job は Playwright 不要**。 `pnpm test` の中身が `--project=unit` 限定であることを確認する。さもないと storybook プロジェクトも走り `browserType.launch: Executable doesn't exist` で落ちる。
- **`storybook` / `e2e` job では `playwright install --with-deps` が必須**。 `--with-deps` がないと Linux の OS パッケージ (libnss 等) が入らずブラウザが起動しない。
- `setup` job は **`pnpm install` までで止める** (キャッシュを温めるためだけ)。後続 job は同じ cache key で改めて `pnpm install` する。
- `concurrency.cancel-in-progress: true` を入れて新しい push が来たら古い run を止める。
- 集約 `ci` job の `if: always()` を忘れると、上流 job が fail したときに `ci` が skip 扱いになり Required Check が通らない。

### GitHub Actions のセキュリティ注意点

- 不信入力 (PR title / commit message / branch name) を `${{ github.event.* }}` で直接 `run:` に展開しない。 `env:` 経由で受け取り、bash 内で `"$VAR"` で参照する。
- 今回のワークフローは `runner.os` / `hashFiles(...)` / `needs.*.result` のみ使うので安全。

## VRT baseline 運用 (OS 依存)

Playwright の `toHaveScreenshot()` は OS ごとに別ファイル名 (`<test>-chromium-darwin.png` / `-linux.png` / `-win32.png`) で baseline を要求する。CI が ubuntu-latest なら **Linux baseline だけ** をリポジトリに置くのが正しい。

`.gitignore`:

```
e2e/**/*-snapshots/*-actual.png
e2e/**/*-snapshots/*-diff.png
e2e/**/*-snapshots/*-darwin.png
```

### 初回 baseline の作り方

1. ローカルでは `pnpm e2e` が darwin baseline 不在で fail するのは想定内 (README に明記)。
2. CI (Linux) を一度走らせる → VRT が "snapshot doesn't exist" で fail する。
3. `gh run download <run-id> --name playwright-report` で artifact を取得。
4. `data/<hash>.png` (実際にレンダリングされた画像) を `e2e/<spec>.ts-snapshots/<test>-chromium-linux.png` にリネームしてコピー。
5. Read tool で画像を目視確認 (内容が期待通りか) してから commit / push。
6. CI 再走で全 job が緑になるはず。

### より理想的な運用

- ラベル (`update-snapshots`) を付けると CI が `--update-snapshots` フラグで Playwright を実行し、変更を自動 commit するワークフローを別途用意。
- 初期構築時は手動方式で十分。

## Vercel 連携

### 採用形式: Git Integration

- Vercel Dashboard で repo を Import → Production Branch を `main` に設定。
- main へ push で本番、PR で Preview が自動払い出し。
- GitHub Actions からは触らない (token 管理コストとデプロイ二重実行を避ける)。

### `vercel.json` (最小)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build",
  "git": {
    "deploymentEnabled": { "main": true }
  }
}
```

- `pnpm` バージョンは `package.json#packageManager` から corepack 経由で自動検出。
- 環境変数は Vercel Dashboard の Project Settings → Environment Variables で管理。Vercel が自動的に各環境の build 時に注入する。
- `.env.local` などの local 用ファイルは `.gitignore` 済みであることを確認。

## GitHub repo 作成

`gh repo create <owner>/<name> --public --source=. --remote=origin --description "..." --push` で push まで一発。public/private は要件次第で確認する。

push 後の確認:
- `gh run list --limit 3` で CI 状態を見る。
- `gh run view <id> --log-failed` で失敗ログを取得。
- `gh run download <id> --name playwright-report` で artifact を落とし、VRT baseline を生成する (上記参照)。
