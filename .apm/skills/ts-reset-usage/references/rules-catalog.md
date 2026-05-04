# ts-reset Rules Catalog

> **Snapshot: 2026-05-04** — 出典: `@total-typescript/ts-reset` の `src/entrypoints/` (GitHub) + totaltypescript.com/ts-reset  
> `recommended` の同梱内容や新規 entry に依存するときは下記「Freshness check 手順」を実行する。

## Rule 一覧

| Rule (entry name) | Before — 現状の問題 | After — ts-reset の改善 | Import path | In `recommended`? | 副作用範囲 |
|---|---|---|---|---|---|
| `json-parse` | `JSON.parse()` の戻り値が `any` | `unknown` を返す | `@total-typescript/ts-reset/json-parse` | ✅ | グローバル |
| `fetch` | `Response.json()` の戻り値が `any` | `unknown` を返す | `@total-typescript/ts-reset/fetch` | ✅ | グローバル |
| `filter-boolean` | `.filter(Boolean)` が falsy 値を型で除外しない | falsy を型レベルで除去し narrowing | `@total-typescript/ts-reset/filter-boolean` | ✅ | グローバル |
| `is-array` | `Array.isArray(x)` の guard が `any[]` に widening | `any[]` を排除し元の型を維持 | `@total-typescript/ts-reset/is-array` | ✅ | グローバル |
| `array-includes` | readonly 配列の `.includes(x)` で引数型が strict すぎ | より実用的な引数型を受け付ける | `@total-typescript/ts-reset/array-includes` | ✅ | グローバル |
| `array-index-of` | readonly 配列の `.indexOf(x)` で引数型が strict すぎ | より緩い引数型を受け付ける | `@total-typescript/ts-reset/array-index-of` | ✅ | グローバル |
| `set-has` | `Set#has(x)` の引数型が Set 型パラメータに strict | より広い型の引数を受け付ける | `@total-typescript/ts-reset/set-has` | ✅ | グローバル |
| `map-has` | `Map#has(k)` の引数型がキー型に strict | より広い型のキーを受け付ける | `@total-typescript/ts-reset/map-has` | ✅ | グローバル |
| `promise-catch` | `.catch(e => ...)` の `e` が `any` | `e` が `unknown` になる | `@total-typescript/ts-reset/promise-catch` | ⚠️ 要確認 | グローバル |
| `map-groupby` | `Map.groupBy()` (ES2024) の戻り型が不正確 | 正確なグループ化型を返す | `@total-typescript/ts-reset/map-groupby` | ⚠️ 要確認 | グローバル |
| `object-groupby` | `Object.groupBy()` (ES2024) の戻り型が不正確 | 正確なグループ化型を返す | `@total-typescript/ts-reset/object-groupby` | ⚠️ 要確認 | グローバル |
| `map-constructor` | `new Map([[k, v]])` のキー/値の型推論が弱い | より正確な型を推論する | `@total-typescript/ts-reset/map-constructor` | ⚠️ 要確認 | グローバル |
| `storage` | `localStorage` / `sessionStorage` の index access が `any` 寄り | index access が `unknown` を返す | `@total-typescript/ts-reset/storage` | ❌ DOM 別途 | DOM のみ |
| `clone-node` | `node.cloneNode()` の戻り型が `Node` (元の型を失う) | 呼び出し元の型を維持して返す | `@total-typescript/ts-reset/clone-node` | ❌ DOM 別途 | DOM のみ |
| `dom` | DOM 系 rule のまとめ bundle | storage / clone-node 等の DOM rule を一括有効化 | `@total-typescript/ts-reset/dom` | ❌ 明示 import | DOM のみ |
| `recommended` | — | 非 DOM rule の推奨セットをまとめて有効化 | `@total-typescript/ts-reset` または `@total-typescript/ts-reset/recommended` | — | グローバル |
| `utils` | — | 内部ユーティリティ型 (通常は直接 import しない) | `@total-typescript/ts-reset/utils` | — | なし |

> **⚠️ 要確認**: `promise-catch` / `map-groupby` / `object-groupby` / `map-constructor` は現行 `recommended` 同梱と推定されるが、バージョンによって変わる可能性がある。これらに依存する場合は Freshness check を実行する。

## Freshness check 手順

### context7 で検証する (推奨)

重大な判断をする前 (新規 rule を採用、`recommended` の同梱内容に依存、Snapshot から半年以上経過) に実行する。

1. library を解決する:
   ```
   ツール: mcp__plugin_context7_context7__resolve-library-id
   引数: { "libraryName": "@total-typescript/ts-reset" }
   ```
2. 最新 docs を取得する:
   ```
   ツール: mcp__plugin_context7_context7__query-docs
   引数: { "libraryId": "<取得した ID>", "query": "all entry points rules list recommended bundle contents" }
   ```
3. 取得結果と上記 catalog を照合する。確認観点:
   - entry 一覧に追加/削除がないか
   - `recommended` バンドルの同梱 rule に変化がないか
   - Before/After の挙動説明に変化がないか
4. 差分があった場合 → `caveats-and-maintenance.md` の **Self-maintenance loop** に従い `/en-skill` 更新を提案する

### fallback (context7 が利用不可の場合)

- プロジェクトに `@total-typescript/ts-reset` が install 済みであれば `package.json` の `exports` フィールドを確認する
- GitHub リポジトリの `src/entrypoints/` ディレクトリを WebFetch で確認する
- いずれも不可なら判断を保留してユーザーに context7 確認を依頼する
