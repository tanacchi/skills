# パッケージ管理とバージョン管理

## pnpm（必須パッケージマネージャー）

- `package.json` があるプロジェクトでは必ず pnpm を使う。
- `npm`・`yarn` の使用は禁止。

### 基本コマンド

```bash
# 依存関係インストール
pnpm install
pnpm install --frozen-lockfile   # CI 環境

# パッケージ追加・削除
pnpm add <package>
pnpm add -D <package>            # 開発依存
pnpm remove <package>

# スクリプト実行
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm format
```

### lockfile 管理

- `pnpm-lock.yaml` は必ずコミットする（reproducible builds の保証）。
- lockfile を手動編集しない（自動生成ファイル）。
- コンフリクト時は `pnpm install` で解決を試みる。

### Git 管理対象

```gitignore
# .gitignore に追加
node_modules/
.pnpm-store/
dist/
build/
.env
.env.local
```

### package.json 推奨設定

```json
{
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

## mise（ツールバージョン管理）

- プロジェクト直下に `mise.toml` を必ず配置してコミットする。
- すべてのツールは mise.toml で管理されたバージョンを使う。
- グローバルインストールされたツールの使用は禁止。

### mise.toml 基本テンプレート

```toml
[tools]
node = "20.10.0"
pnpm = "8.15.0"
gh = "2.40.1"
```

### 主要コマンド

```bash
mise install          # mise.toml に基づく一括インストール
mise list             # インストール済みツール一覧
mise current          # 現在有効なツールバージョン確認
mise doctor           # 環境診断
```

### .gitignore 設定

```gitignore
.mise.toml            # 個人設定は除外
.tool-versions        # asdf 互換ファイルも除外
# mise.toml は除外しない（チーム共有）
```

### ツール更新手順

```bash
# 1. mise.toml を更新
# 2. mise install でインストール
mise install
# 3. 動作確認
mise exec node -- --version
# 4. コミット
git add mise.toml
git commit -m "Node.js を 20.11.0 に更新\n\nセキュリティアップデートのため更新。"
```

## Markdown lint

- Markdown ファイルは `markdownlint-cli2` でチェックし、エラー・警告が出ない状態でコミットする。
- コミット・PR 前に必ず実行する。

```bash
pnpm run lint:md
```

## CI/CD 品質ゲート

- PR 作成・更新時に lint・format・型チェック・テストを実行する。
- `pnpm install --frozen-lockfile` で再現可能なビルドを保証する。
- pre-commit フックでコミット前チェックを自動化する。
- pre-push フックでビルドとテストを自動化する。

```yaml
# GitHub Actions 例
- uses: pnpm/action-setup@v2
  with:
    version: 8
- uses: jdx/mise-action@v2
- run: pnpm install --frozen-lockfile
- run: pnpm lint && pnpm build && pnpm test
```

## トラブルシューティング

```bash
# lockfile 不整合
rm pnpm-lock.yaml && pnpm install

# キャッシュ問題
pnpm store prune
rm -rf node_modules pnpm-lock.yaml && pnpm install

# mise ツールが見つからない
mise install
mise doctor
```
