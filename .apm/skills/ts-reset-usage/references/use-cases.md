# ts-reset Use Cases — 症状 → Rule マッピング

各症状から推奨 rule を即座に引けるよう整理。rule 名は `rules-catalog.md` の entry name に揃えている。

---

## 1. `fetch().json()` / `JSON.parse()` の戻り値が `any`

**Before**: `fetch` / `JSON.parse` の結果を `any` として受け取り、型エラーが起きずにランタイムで壊れる。

```typescript
const data = await fetch("/api").then(r => r.json()); // data: any
const parsed = JSON.parse(text);                       // parsed: any
```

**After**: `unknown` が返り、使う前に型を検証するよう強制される。

```typescript
// zod などで narrow する必要がある
const data: unknown = await fetch("/api").then(r => r.json());
const parsed: unknown = JSON.parse(text);
```

**推奨 rule**: `fetch` + `json-parse`  
**選択**: どちらも `recommended` に同梱されているので全体導入で自動適用。個別に絞るなら a-la-carte で両方を import する。

---

## 2. `.filter(Boolean)` 後に narrowing が効かない

**Before**: `filter(Boolean)` を使っても TypeScript が `undefined` / `null` を型から除去しない。

```typescript
const items = [1, null, 2, undefined].filter(Boolean); // items: (number | null | undefined)[]
```

**After**: `filter(Boolean)` が falsy 型を型レベルで除去する。

```typescript
const items = [1, null, 2, undefined].filter(Boolean); // items: number[]
```

**推奨 rule**: `filter-boolean`  
**選択**: `recommended` に同梱。個別 import は `@total-typescript/ts-reset/filter-boolean`。

---

## 3. `Array.isArray(x)` 後に `x` が `any[]` に変わる

**Before**: `Array.isArray` の型ガードが `any[]` を挿入し、後続で型安全性が失われる。

```typescript
function process(value: string | string[]) {
  if (Array.isArray(value)) {
    value.forEach(v => v.toUpperCase()); // v: any (本来 string のはず)
  }
}
```

**After**: 元の型を維持したまま絞り込む。

```typescript
// 上記コードで v: string に正しく推論される
```

**推奨 rule**: `is-array`  
**選択**: `recommended` に同梱。

---

## 4. readonly const 配列の `.includes()` / `.indexOf()` で TS エラー

**Before**: `as const` で作成した配列に対して `.includes()` / `.indexOf()` を呼ぶと、引数の型が広すぎるとエラーになる。

```typescript
const STATUSES = ["active", "inactive"] as const;
function check(s: string) {
  return STATUSES.includes(s); // Argument of type 'string' is not assignable to...
}
```

**After**: より実用的な引数型を受け付ける。

```typescript
return STATUSES.includes(s); // OK
```

**推奨 rule**: `array-includes`（includes 用）/ `array-index-of`（indexOf 用）  
**選択**: 両方 `recommended` に同梱。

---

## 5. `Set#has()` / `Map#has()` の引数型が strict すぎ

**Before**: `Set<"a" | "b">` に対して `string` を渡すとエラーになる。

```typescript
const set = new Set(["a", "b"] as const);
function contains(s: string) {
  return set.has(s); // Argument of type 'string' is not assignable...
}
```

**After**: より広い型の引数を受け付ける。

```typescript
return set.has(s); // OK
```

**推奨 rule**: `set-has` / `map-has`  
**選択**: 両方 `recommended` に同梱。

---

## 6. `localStorage` / `sessionStorage` の index access が `any`

**Before**: `localStorage["key"]` や `sessionStorage["unknownKey"]` が `any` を返し、型チェックが効かない。

```typescript
const value = localStorage["userToken"]; // value: any
```

**After**: index access が `unknown` を返し、使う前の検証が必要になる。

```typescript
const value = localStorage["userToken"]; // value: unknown
```

**推奨 rule**: `storage`（DOM rule、`recommended` には含まれない）  
**選択**: 個別 import `@total-typescript/ts-reset/storage` または `dom` バンドル。DOM を使う環境でのみ適用する。

---

## 7. `.catch(e => ...)` の `e` が `any`

**Before**: Promise の `.catch` コールバックで受け取る引数が `any` で、型チェックが無効になる。

```typescript
fetch("/api").catch((e) => {
  console.log(e.message); // e: any — .message を確認しても TS は警告しない
});
```

**After**: `e` が `unknown` になり、使う前に型チェックが必要になる。

```typescript
fetch("/api").catch((e: unknown) => {
  if (e instanceof Error) console.log(e.message); // 型を確認してから使う
});
```

**推奨 rule**: `promise-catch`  
**選択**: `recommended` に同梱と推定。不明な場合は freshness check を実行する（`rules-catalog.md` 参照）。

---

## 8. `Object.groupBy()` / `Map.groupBy()` の戻り型が不正確 (ES2024)

**Before**: ES2024 の groupBy 関連メソッドの戻り型が TypeScript 標準では不正確。

```typescript
const groups = Object.groupBy(items, item => item.type);
// groups の型が期待通りにならない
```

**After**: 正確なグループ化型を返す。

**推奨 rule**: `object-groupby` / `map-groupby`  
**選択**: `recommended` に同梱と推定。TypeScript 5.4+ を対象とするプロジェクトで有効。freshness check 推奨。

---

## 9. `node.cloneNode()` の戻り型が `Node` になる

**Before**: `element.cloneNode(true)` が `Node` を返すため、元の型（例: `HTMLDivElement`）に戻すのに `as` が必要になる。

```typescript
const div = document.querySelector("div")!;
const clone = div.cloneNode(true); // clone: Node — HTMLDivElement に戻すために as が必要
```

**After**: 呼び出し元の型を維持して返す。

```typescript
const clone = div.cloneNode(true); // clone: HTMLDivElement
```

**推奨 rule**: `clone-node`（DOM rule、`recommended` には含まれない）  
**選択**: 個別 import `@total-typescript/ts-reset/clone-node` または `dom` バンドル。

---

## 10. `new Map([[k, v]])` の型推論が弱い

**Before**: リテラル配列を渡した `new Map()` のキー/値が正確に推論されない。

**After**: より正確な型を推論する。

**推奨 rule**: `map-constructor`  
**選択**: `recommended` に同梱と推定。freshness check 推奨。

---

## rule 選択の判断フロー

```
症状が 1〜2 個の known rule に収まる  →  a-la-carte (影響範囲最小)
症状が広くて app 全体に適用したい    →  recommended 一括 (import "@total-typescript/ts-reset")
DOM 環境で localStorage / cloneNode も直したい  →  recommended + dom
```
