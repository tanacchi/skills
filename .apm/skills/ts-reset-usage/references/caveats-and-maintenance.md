# ts-reset Caveats & Self-Maintenance

## Caveats — 落とし穴と注意点

### library には絶対に入れない

`@total-typescript/ts-reset` は **型定義の augmentation** で動作する。`reset.d.ts` を library の `tsconfig.json` に含めると、その library を install した consumer プロジェクト全体のグローバル型定義が汚染される。`type-only` な import であっても同様の副作用が発生する。

- **NG**: npm publish する package で `reset.d.ts` を `tsconfig.json` の `include` に含める
- **OK**: アプリケーション本体、internal tool、テスト用 app などの非公開プロジェクト

monorepo の場合、`packages/app/` には入れてよいが `packages/ui-lib/` / `packages/shared/` など publish 対象には入れない。

### 対象外の領域

ts-reset は以下を**意図的にサポートしていない**:

- `Object.keys(obj)` の戻り値を `(keyof typeof obj)[]` にする → zod / `as const satisfies` / 自作 helper で対応
- `Object.entries(obj)` の戻り値を正確なタプル型にする → 同上
- generic `JSON.parse<T>()` のような汎用型パラメータ → Zod / valibot の `parse()` を使う

これらを `as` キャストで誤魔化さない。`typescript-strict-typing` skill の Guardrails を参照。

### `unknown` 化による既存コードの破損

`json-parse` / `fetch` / `promise-catch` を有効にすると、既存コードで `any` として扱っていた箇所が `unknown` になりコンパイルエラーが発生する。

移行手順:
1. `pnpm typecheck`（または `tsc --noEmit`）でエラー箇所を列挙する
2. 各エラー箇所を以下のいずれかで対応する:
   - **Zod / valibot**: `z.object({...}).parse(data)` で型を確定させる
   - **type guard 関数**: `function isFoo(x: unknown): x is Foo { ... }` を書く
   - **`instanceof` 検査**: エラーオブジェクトには `e instanceof Error` で判定する
3. `as` でキャストして逃げない（`typescript-strict-typing` skill 参照）

### `recommended` に含まれない DOM rule

`storage` / `clone-node` / `dom` は `recommended` バンドルに含まれない。DOM 環境でも `import "@total-typescript/ts-reset"` だけでは有効にならない。

DOM 系 rule が必要な場合は明示的に追加する:

```typescript
import "@total-typescript/ts-reset";
import "@total-typescript/ts-reset/dom"; // または個別 rule
```

### `@types/node` / `lib.dom.d.ts` のバージョン差

ts-reset は TypeScript 標準の型定義を augment するため、`@types/node` や `lib.dom.d.ts` のバージョンによって挙動が異なる場合がある。TypeScript または `@types/node` をアップグレードした後は、ts-reset の期待する Before/After が変わっていないか確認する。

---

## Self-Maintenance Loop

### stale 検知のトリガー

以下の状況で catalog が古くなった可能性がある:

- context7 で取得した entry 一覧と `rules-catalog.md` の表の entry 名が一致しない
- context7 の結果で `recommended` の同梱内容が変わっていた
- `⚠️ 要確認` とマークされている rule の同梱状況が判明した
- `rules-catalog.md` の Snapshot から 6 ヶ月以上経過した

### agent がユーザーに提示する更新依頼テンプレ

```
ts-reset-usage skill の rules-catalog.md が現行 npm と差分があります。

検知した差分:
- <追加された entry>: rules-catalog.md に未掲載
- <削除された entry>: rules-catalog.md に残っている
- recommended 同梱変更: <変更内容>

/en-skill で ts-reset-usage skill を更新しますか？
その場合、以下の情報を渡してください:
- 差分内容: <上記の差分リスト>
- 観測日: <today の日付>
- context7 取得結果の要旨: <library ID と query-docs のレスポンスサマリ>
```

### `/en-skill` 起動時に渡す情報

1. **更新対象**: `.apm/skills/ts-reset-usage/references/rules-catalog.md`
2. **差分内容**: 追加/削除/変更されたルール名と詳細
3. **context7 のリクエスト/レスポンス要旨**: library ID、クエリ、取得した entry 一覧
4. **観測日**: 確認した日付（Snapshot 行の更新に使う）

### version bump 方針

| 変更種別 | `metadata.version` |
|---|---|
| rule の追加/削除など breaking な catalog 変更 | minor (例: `0.1.0` → `0.2.0`) |
| `recommended` 同梱の変更 | minor |
| Before/After 説明の修正・⚠️ 要確認 を解消 | patch (例: `0.1.0` → `0.1.1`) |
| Snapshot 日付の更新のみ | patch |

### rules-catalog.md の Snapshot 行の更新方法

`rules-catalog.md` の先頭にある以下の行を更新する:

```
> **Snapshot: <新しい日付>** — 出典: ...
```

### 代替・競合アプローチ

| アプローチ | 特徴 |
|---|---|
| `type-fest` | utility types 集。ts-reset の global augmentation とは別の方向性。併用可 |
| `zod` / `valibot` | 実行時バリデーション + 型推論。`json-parse` / `fetch` 対応で推奨される narrow 手段 |
| 自作 utility types | `ObjectKeys<T>` など型パラメータ版。ts-reset の対象外領域を自力で補う場合に使う |
| TypeScript の `strict: true` + `noUncheckedIndexedAccess` | コンパイラオプションで型安全を高める。ts-reset とは直交して使える |
