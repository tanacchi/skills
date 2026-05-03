# Test stack: Vitest 4 / Storybook 10 / Playwright / Biome 2 / Steiger 0.5

## 全体像

| 役割              | ツール                                                            |
| ----------------- | ----------------------------------------------------------------- |
| 型チェック        | `tsc --noEmit` (`@tsconfig/strictest` 拡張)                       |
| 静的解析 / format | Biome 2 (recommended)                                             |
| FSD 規約          | Steiger 0.5 + `@feature-sliced/steiger-plugin`                    |
| ユニット          | Vitest 4 (jsdom, coverage v8, **95% 閾値**)                       |
| Story 描画保証    | Vitest 4 browser mode + `@storybook/addon-vitest` + Playwright    |
| E2E               | Playwright 1.59+, `data-testid` をセレクタ属性に固定               |
| VRT               | Playwright `toHaveScreenshot()` (`maxDiffPixelRatio: 0.05`)        |

## Vitest 4

```ts
// vitest.config.ts
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const alias = { '@shared': r('./src/shared') /* ...他レイヤも同様 */ };

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.ts',
      ],
      thresholds: { lines: 95, functions: 95, branches: 95, statements: 95 },
    },
    projects: [
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          css: true,
        },
      },
      {
        plugins: [react(), storybookTest({ configDir: '.storybook' })],
        resolve: { alias },
        test: {
          name: 'storybook',
          setupFiles: ['./.storybook/vitest.setup.ts'],
          browser: {
            enabled: true,
            provider: playwright(),     // ← 文字列 'playwright' は型エラー
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
```

### 落とし穴

- `defineWorkspace` は **Vitest 4 で削除**。 `defineConfig({ test: { projects: [...] } })` に書き換える。
- `browser.provider` は文字列 `'playwright'` を受け付けない。`@vitest/browser-playwright` の `playwright()` 関数を呼び出した戻り値 (`BrowserProviderOption` オブジェクト) を渡す。
- `setupFiles` の `setProjectAnnotations` 呼び出しは Storybook 10.3 + addon-vitest では不要 (auto-applied)。残すと "Skipping automatic provisioning" の警告が出る。空 `export {};` で OK。
- `pnpm test` を **unit project 限定** にする (`vitest run --project=unit --coverage`)。 全プロジェクトを対象にすると CI の unit job が Playwright バイナリを要求して落ちる。

```jsonc
// package.json scripts
{
  "test":           "vitest run --project=unit --coverage",
  "test:all":       "vitest run --coverage",
  "test:storybook": "vitest run --project=storybook"
}
```

## Storybook 10 + addon-vitest

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  framework: { name: '@storybook/nextjs-vite', options: {} },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-vitest'],
  staticDirs: ['../public'],
  typescript: { check: false },
};

export default config;
```

```tsx
// .storybook/preview.tsx
import type { Preview } from '@storybook/react';
import { AppProviders } from '../src/app/providers';
import '../src/app/styles/globals.css';

const preview: Preview = {
  decorators: [(Story) => <AppProviders><Story /></AppProviders>],
};
export default preview;
```

```ts
// .storybook/vitest.setup.ts
// Storybook 10.3+ の addon-vitest は preview annotations を自動適用するので空でよい
export {};
```

### 落とし穴

- **`@storybook/nextjs` (webpack) は addon-vitest と一緒に動かない**。addon-vitest は `virtual:/@storybook/builder-vite/project-annotations.js` を解決しに行くため、 framework 側も Vite 版 (`@storybook/nextjs-vite`) でないと "Failed to fetch dynamically imported module" でこける。
- `@storybook/addon-essentials` は Storybook 10 で組み込み化されたため `addons` から削除する。残すと resolution エラー。
- `staticDirs: ['../public']` を指定するなら **`public/.gitkeep` を必ず commit** する。さもないと CI の `pnpm build-storybook` が `Failed to load static files, no such directory: ./public` で落ちる。
- pnpm の strict isolation 下で Storybook の preset が見つからない場合は `.npmrc` で `public-hoist-pattern[]=*storybook*` を追加。

## Playwright (E2E + VRT)

```ts
// e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const baseURL = `http://127.0.0.1:${PORT}`;
const isCI = !!process.env['CI'];          // 索引アクセス必須

export default defineConfig({
  testDir: '.',
  testMatch: ['**/*.e2e.ts', '**/*.vrt.ts'],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 1 } : {}),         // exactOptionalPropertyTypes 対策
  reporter: isCI ? [['html', { open: 'never' }], ['github']] : 'list',
  use: { baseURL, trace: 'on-first-retry', testIdAttribute: 'data-testid' },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.05, threshold: 0.2, animations: 'disabled' },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm build && pnpm start --port=3000',
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
    cwd: '..',
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
```

### 落とし穴

- `process.env.CI` だと `noPropertyAccessFromIndexSignature` で TS が落ちる → `process.env['CI']`。 Biome 側は `complexity/useLiteralKeys: off` で衝突を回避。
- `workers: undefined` を直接渡すと `exactOptionalPropertyTypes` で型エラー → 条件 spread で回避。
- VRT の baseline は **OS 別ファイル** (`*-chromium-darwin.png` / `*-chromium-linux.png`) になる。 macOS で生成したものを CI (Linux) にコミットすると毎回 fail する。Linux baseline のみ commit する運用にする (詳細は `ci-vercel.md`)。

## Biome 2

```jsonc
// biome.json (抜粋)
{
  "$schema": "https://biomejs.dev/schemas/2.4.14/schema.json",
  "files": {
    "ignoreUnknown": true,
    "includes": [
      "**",
      "!**/.next",
      "!**/node_modules",
      "!**/storybook-static",
      "!**/coverage",
      "!**/playwright-report",
      "!**/test-results",
      "!**/*-snapshots",
      "!**/.vercel",
      "!next-env.d.ts"
    ]
  },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2, "lineWidth": 100 },
  "assist": {
    "enabled": true,
    "actions": { "source": { "organizeImports": "on" } }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": { "noExplicitAny": "error" },
      "style": { "useImportType": "error" },
      "correctness": { "noUnusedImports": "error", "noUnusedVariables": "error" },
      "complexity": { "useLiteralKeys": "off" }
    }
  }
}
```

### 1.x → 2.x の移行差分

| 1.x                                | 2.x                                                    |
| ---------------------------------- | ------------------------------------------------------ |
| `files.ignore: [...]`              | `files.includes: ["**", "!..."]`                       |
| `organizeImports: { enabled }`     | `assist.actions.source.organizeImports: "on"`          |
| `overrides[].include`              | `overrides[].includes`                                 |

`useLiteralKeys` を off にしないと `process.env['CI']` 表記が biome で警告 → tsc 厳格設定との板挟みになる。

## Steiger 0.5

```ts
// steiger.config.ts
import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';   // 'steiger/config' ではない

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'src/**/*.stories.{ts,tsx}',
      '**/.gitkeep',
    ],
  },
  {
    files: ['**/*'],
    rules: {
      'fsd/insignificant-slice': 'off',     // 空 layer を許容
      'fsd/segments-by-purpose': 'off',     // shared/lib/ への testid 配置を許容
    },
  },
]);
```

- `defineConfig` の import 元は `steiger` package 直下。 `steiger/config` は存在しない (1.x の名残ドキュメントが残っているので注意)。
- `fsd/insignificant-slice` を on にしたまま空 `widgets/` などを残すと毎回 fail する。新規 scaffold では off。
- `fsd/segments-by-purpose` は `shared/types` のような汎用名 segment を弾くので `shared/lib/` を使う。
