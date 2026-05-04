# freshness-check

> **skill 起動の最初に必ず実行すること。** catalog が古いままだと誤情報を提供するリスクがある。

---

## プロトコル

### Step 1: プロジェクトのインストール版を確認

```bash
# package.json の dependencies / devDependencies を確認
cat package.json | grep -E '"(es-toolkit|type-fest|hotscript)"'

# または npm view で registry 最新版を取得
pnpm view es-toolkit version
pnpm view type-fest version
# hotscript は scoped package ではないため
pnpm view hotscript version
```

### Step 2: Context7 で最新版をクエリ

Context7 MCP ツールで以下を実行して最新の追加 API・非推奨変更を確認する：

```
# es-toolkit
resolve-library-id: "es-toolkit"  → /toss/es-toolkit
query-docs: query = "latest additions, new functions, breaking changes in recent versions"

# type-fest
resolve-library-id: "type-fest"  → /sindresorhus/type-fest
query-docs: query = "latest additions, new types, breaking changes"
```

### Step 3: GitHub releases を WebFetch で確認

```
# es-toolkit releases
WebFetch: https://github.com/toss/es-toolkit/releases
prompt: "latest 3 releases: new functions and breaking changes summary"

# type-fest releases
WebFetch: https://github.com/sindresorhus/type-fest/releases
prompt: "latest 3 releases: new types and breaking changes summary"

# hotscript (context7 未収録のため WebFetch のみ)
WebFetch: https://raw.githubusercontent.com/gvergnaud/hotscript/main/README.md
prompt: "list all modules and functions. highlight any additions since the catalog was created"
```

### Step 4: catalog バージョンとの差分を評価

各 catalog の末尾にある `_Last verified_` 行と Step 1 の実際のバージョンを比較する。

| 差分の種類 | 対応 |
| --- | --- |
| 新しい関数 / 型が追加された | Step 5 へ：en-skill で catalog を更新 |
| 関数名が変更 / 削除された | Step 5 へ：en-skill で catalog を更新 |
| minor patch のみ（API 変更なし） | `_Last verified_` 日付のみ更新を提案 |
| catalog と最新版が一致 | freshness check 完了、手順 2（逆引き）へ進む |

### Step 5: 差分がある場合 — en-skill で catalog 更新

1. ユーザに差分サマリを提示し、更新要否を確認する。
2. 承認を得たら `en-skill` を使って `claude/update-skill-es-toolkit-type-fest-hotscript` ブランチで更新。
3. 変更対象ファイル：`references/{library}-catalog.md` の該当カテゴリ行 + `_Last verified_` 日付 + SKILL.md `metadata.version` をインクリメント。
4. `scripts/validate.sh` が exit 0 であることを確認。
5. PR を作成して main にマージ後、当初の refactoring 作業に戻る。

---

## catalog の最終確認版スタンプ形式

各 catalog ファイルの末尾には以下の行を記載する：

```
_Last verified: YYYY-MM-DD against es-toolkit@X.Y.Z, type-fest@X.Y.Z, hotscript@X.Y.Z_
```

この行の日付とバージョンが Step 1 の実際のインストール版と異なっていたら必ず Step 5 を実行する。
