# Zod × TypeScript 厳密型付けパターン

## 1. `z.literal` 配列引数で union を 1 行化

zod v4 以降、`z.literal` に配列を渡すことで `z.union` を使わずに literal union を書ける。

```ts
// zod v3: z.union が必要
const schema = z.union([z.literal('locked'), z.literal('open'), z.literal('empty')]);

// zod v4: 配列で union を 1 行化
const schema = z.literal(['locked', 'open', 'empty']);
// → 型は "locked" | "open" | "empty"
```

## 2. `exactOptionalPropertyTypes` と `z.optional()` の違い

`tsconfig.json` に `exactOptionalPropertyTypes: true` が設定されている場合、
`{ key?: string }` と `{ key?: string | undefined }` は異なる型として扱われる。

Zod の `z.optional()` は `T | undefined` を返すため、
`exactOptionalPropertyTypes` 環境では `| undefined` が明示されて
型の整合が崩れることがある。

```ts
// exactOptionalPropertyTypes: true のとき
const schema = z.object({ name: z.string().optional() });
type T = z.infer<typeof schema>; // { name?: string | undefined }
// これは { name?: string } (undefined を明示しない) とは別型

// 解決: z.optional() より z.string().nullish() または型注釈で明示
```

## 3. `satisfies z.ZodType<T>` で readonly/mutable の structural subtype を担保

`as` を使わずに「この schema は T を出力する」ことを型でチェックする。

```ts
// NG: as は型安全でない
const GameStateSchema = z.object({ ... }) as z.ZodType<GameState>;

// OK: satisfies で shape を検証 (cast なし)
export const GameStateSchema = z.object({
  currentView: GameViewSchema,
  // ...
}) satisfies z.ZodType<GameState>;
```

`GameState` が `ReadonlyDeep<...>` の場合、
`z.infer<typeof GameStateSchema>` は mutable な型になるため
structural subtype にならないことがある。
その場合は中間型 `_GameStateMutable` を経由して `Simplify<ReadonlyDeep<_GameStateMutable>>` とする。

```ts
type _GameStateMutable = z.infer<typeof GameStateSchema>;
export type GameState = Simplify<ReadonlyDeep<_GameStateMutable>>;
```

## 4. `atomWithStorage` カスタム storage での safeParse 活用

localStorage から読んだ値は `unknown` 型。`JSON.parse` 直後に Zod `safeParse` を挟むことで
型安全と後方互換性 (破損セーブデータ) の両方を確保する。

```ts
getItem(key: string, initialValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return initialValue;
    const parsed: unknown = JSON.parse(raw);  // unknown で受け取る
    const result = MySchema.safeParse(parsed);
    if (result.success) return result.data;
    console.error('[storage] データが壊れていたため初期値に戻しました', result.error);
    return initialValue;
  } catch {
    return initialValue;
  }
}
```

`JSON.parse` の戻り値を `any` のまま使わず、必ず Zod で narrowing してから利用する。
