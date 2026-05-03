# Toolchain: mise + pnpm + Node 24

## 固定するもの

- **Node**: 24 系の最新 (例: `24.15.0`)
- **pnpm**: 10 系の最新 (例: `10.33.2`)
- 両方 mise で pin。`packageManager` フィールドにも同じ pnpm バージョンを書く (Vercel / corepack が参照)。

## ファイル

`.tool-versions`:

```
node 24.15.0
pnpm 10.33.2
```

`package.json` (抜粋):

```jsonc
{
  "packageManager": "pnpm@10.33.2",
  "engines": {
    "node": ">=24.15.0",
    "pnpm": ">=10.33.0"
  }
}
```

`.npmrc`:

```
strict-peer-dependencies=false
auto-install-peers=true
shamefully-hoist=false
public-hoist-pattern[]=*storybook*
public-hoist-pattern[]=@storybook/*
```

`*storybook*` の hoist は Storybook 内部の preset 解決 (`@storybook/builder-vite` など) を pnpm の strict isolation 下で機能させるため。これがないと `Cannot find module ./node_modules/.../@storybook/builder-vite/dist/preset.js` 系のエラーが出る。

## Bash 呼び出しでの mise の罠

- `mise install` でツールをインストールしても、**新しいシェルプロセスごとに activate が必要**。Claude Code の各 Bash ツール呼び出しは独立シェルなので毎回 activate が必要。
- 解決:
  - 毎回 `export PATH="$HOME/.local/share/mise/shims:$PATH" && <command>` を前置する、または
  - `mise exec -- <command>` を使う。
- これを忘れると system Node (古いバージョン) で動いてしまい、Next.js 16 や Vitest 4 が "engine not satisfied" や ESM 解決失敗で落ちる。

## install 手順

```bash
mise install                                 # .tool-versions に従って Node/pnpm を入れる
export PATH="$HOME/.local/share/mise/shims:$PATH"
node --version && pnpm --version             # 期待バージョンを確認
pnpm install                                  # 依存解決
pnpm exec playwright install chromium         # Playwright バイナリ (e2e と storybook test の両方で使う)
```

## Vercel 側の整合

- Vercel は `package.json` の `packageManager` フィールドから pnpm バージョンを自動検出する (corepack 経由)。
- `vercel.json` には `installCommand: "pnpm install --frozen-lockfile"` を明記しておくと build 失敗の切り分けがしやすい。
- Node バージョンは Vercel Project Settings → Node.js Version で指定する。`.tool-versions` は Vercel では参照されない。
