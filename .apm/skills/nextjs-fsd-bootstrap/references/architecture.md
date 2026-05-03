# Architecture: Next.js App Router × Feature Sliced Design

## ディレクトリ構成

```
.
├─ app/                      # Next.js App Router (router 専用 shell)
│   ├─ layout.tsx            # AppProviders + global CSS だけを wrap
│   └─ page.tsx              # FSD pages slice を return するだけ
├─ pages/
│   └─ README.md             # 「Pages Router は使わない」宣言。コードは置かない
├─ src/                      # FSD レイヤ群 (Steiger 監視対象)
│   ├─ app/                  # FSD app: providers, theme, jotai store, global CSS
│   ├─ pages/                # FSD pages: ページ単位 composition
│   ├─ widgets/              # 複合 UI ブロック
│   ├─ features/             # ユースケース単位の機能
│   ├─ entities/             # ビジネスエンティティ
│   └─ shared/               # ui / lib / config (純粋 util、testid もここ)
├─ e2e/                      # Playwright E2E + VRT
│   ├─ playwright.config.ts
│   ├─ tests/                # *.e2e.ts (機能検証)
│   └─ vrt/                  # *.vrt.ts (toHaveScreenshot)
└─ public/                   # 静的アセット (空でも .gitkeep を必ず置く)
```

### なぜ `/app/` と `/src/app/` を二重に持つのか

- `/app/` は Next.js が router segment として強制的に解釈するディレクトリ。
- `/src/app/` は FSD の最上位層 (Providers / theme / store)。
- App Router はロジックを置きやすいが、FSD と混ぜると依存方向が崩れる。 `/app/` を **配線専用** に絞り、UI / 状態 / 機能は `/src/` 側に集約することで二者を同居させる。

### `/pages/README.md` の役割

Next.js は同時に `app/` と `pages/` が存在しても **TS / JS ファイルが置かれている場合のみ** Pages Router を有効化する。Markdown は無視される。これを利用して `/pages/README.md` だけ置き、 FSD の pages 層と Next の Pages Router を名前衝突なく分離する。 README には「ここに `.ts/.tsx/.js/.jsx` を置くな」を書く。

## TypeScript パス

`tsconfig.json`:

```jsonc
{
  "extends": "@tsconfig/strictest/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*":         ["src/*"],
      "@app/*":      ["src/app/*"],
      "@pages/*":    ["src/pages/*"],
      "@widgets/*":  ["src/widgets/*"],
      "@features/*": ["src/features/*"],
      "@entities/*": ["src/entities/*"],
      "@shared/*":   ["src/shared/*"]
    },
    "plugins": [{ "name": "next" }],
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "noEmit": true,
    "verbatimModuleSyntax": false,
    "types": ["node", "vitest/globals", "@testing-library/jest-dom"]
  }
}
```

- `@tsconfig/strictest` を extend するだけで `noPropertyAccessFromIndexSignature` / `exactOptionalPropertyTypes` 等の厳格設定が一括で入る。これらが入ると以下の罠が発生する:
  - `process.env.CI` → 索引アクセス強制。 `process.env['CI']` を使う。
  - `workers: undefined` のようなオプショナル props → 条件 spread (`...(isCI ? { workers: 1 } : {})`) で書く。

## FSD レイヤ依存ルール

```
shared ← entities ← features ← widgets ← pages ← app
```

- 単方向のみ。同層 cross-import 禁止。Public API (各 slice の `index.ts`) 経由のみ許容。
- 違反は Steiger (`fsd/no-cross-imports`, `fsd/no-public-api-sidestep`, `fsd/no-higher-level-imports`) が拾う。

## Public API パターン

各 slice は `ui/` `model/` `api/` 等のセグメントで分け、 `index.ts` で公開対象だけ export する。

```ts
// File: src.pages.landing.index.ts (= src/pages/landing/index.ts)
export { LandingPage } from './ui/LandingPage';
```

```ts
// File: app.page.tsx (= app/page.tsx)
import { LandingPage } from '@pages/landing';
export default function Page() { return <LandingPage />; }
```

## 共通の核

### `src/shared/lib/testid.ts`

```ts
export type ElementType =
  | 'button' | 'link' | 'input' | 'form'
  | 'nav'    | 'region' | 'dialog'
  | 'list'   | 'item'  | 'heading'
  | 'image'  | 'text';

export type TestId<P extends ElementType, S extends string> = `${P}:${S}`;

export const testId = <P extends ElementType, S extends string>(
  prefix: P,
  suffix: S,
): TestId<P, S> => `${prefix}:${suffix}` as const;
```

- 配置は `src/shared/types/` ではなく **`src/shared/lib/`**。 Steiger の `fsd/segments-by-purpose` が `types` segment を「内容ではなく目的を表す名前にせよ」と弾く。
- 利用例: `data-testid={testId('button', 'submit-login')}` → `"button:submit-login"`。
- E2E では `page.getByTestId(testId('button', 'submit-login'))` のみ使う。XPath / text / role セレクタは i18n 耐性のため使わない。

### `src/app/providers/AppProviders.tsx`

```tsx
'use client';
import { Provider as JotaiProvider, createStore } from 'jotai';
import type { ReactNode } from 'react';

const store = createStore();

export function AppProviders({ children }: { children: ReactNode }): React.JSX.Element {
  return <JotaiProvider store={store}>{children}</JotaiProvider>;
}
```

`/app/layout.tsx` から `<AppProviders>` で `{children}` を wrap する。Storybook の `preview.tsx` でも同じ Providers を decorator として適用する。

## 空 layer の扱い

- 新規 scaffold では `widgets/` `features/` `entities/` が空になる。 `.gitkeep` を置いて Steiger の `fsd/insignificant-slice` を `'off'` に設定する (steiger.config.ts 側で対応)。
- `shared/` は最低 1 segment (例: `lib/`) を持っていれば OK。空 segment (`config/` など) を作らない。必要になってから追加する。
