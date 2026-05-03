# type-tests

Vitest の `expectTypeOf` を使った型推論テストのパターンと使い分け指針。

---

## expectTypeOf の基本

Vitest 0.23+ に組み込まれている型テスト API。実行時のテストと同じファイル・同じ `it()` ブロックに書ける。

```ts
import { expectTypeOf } from 'vitest';

// 型が完全に一致することを確認
expectTypeOf(someValue).toEqualTypeOf<ExpectedType>();

// 部分的な互換性（assignable であること）を確認
expectTypeOf(someValue).toMatchTypeOf<SuperType>();
```

主要な API:

| メソッド | 用途 |
| --- | --- |
| `.toEqualTypeOf<T>()` | 型が T と完全一致（推奨） |
| `.toMatchTypeOf<T>()` | T のサブタイプであること |
| `.not.toEqualTypeOf<T>()` | 型が T でないこと |
| `.parameter(n)` | 関数の n 番目の引数の型を検査 |
| `.returns` | 関数の戻り値の型を検査 |
| `.resolves` | Promise の解決値の型を検査 |
| `.items` | 配列要素の型を検査 |

---

## テストすべきケース

### 1. Generic 関数の戻り値推論

入力の型によって戻り値が変わる generic 関数。

```ts
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // ...
}

it('returns picked type', () => {
  const user = { id: 1, name: 'Alice', email: 'a@example.com' };
  const result = pick(user, ['id', 'name']);
  expectTypeOf(result).toEqualTypeOf<{ id: number; name: string }>();
});
```

### 2. Conditional type の評価

```ts
type IsArray<T> = T extends unknown[] ? true : false;

expectTypeOf<IsArray<string[]>>().toEqualTypeOf<true>();
expectTypeOf<IsArray<string>>().toEqualTypeOf<false>();
```

### 3. Discriminated union の narrowing

型ガード関数やスイッチ後の型が正しく絞り込まれているか。

```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

it('returns T when ok', () => {
  expectTypeOf(unwrap<number>).returns.toEqualTypeOf<number>();
});
```

### 4. `as const satisfies T` 後の推論

`satisfies` 後もリテラル型が保たれているか確認する。

```ts
const CONFIG = {
  maxRetries: 3,
  timeout: 5000,
} as const satisfies Record<string, number>;

it('preserves literal types after satisfies', () => {
  expectTypeOf(CONFIG.maxRetries).toEqualTypeOf<3>();      // literal — OK
  expectTypeOf(CONFIG.timeout).toEqualTypeOf<5000>();     // literal — OK
});
```

### 5. 公開 API の型契約

外部に公開する関数・hook の型シグネチャ。破壊的変更を検出するためのリグレッション防止。

```ts
import { useUserStore } from '@entities/user';

it('useUserStore returns expected shape', () => {
  expectTypeOf(useUserStore).returns.toMatchTypeOf<{
    user: User | null;
    setUser: (user: User) => void;
  }>();
});
```

---

## テストしない（overuse を避ける）ケース

| 状況 | 理由 |
| --- | --- |
| `const x: number = 1` のような自明な型 | TypeScript 自体がチェックするため冗長 |
| ライブラリ関数の型（axios, zod 等） | ライブラリ自身のテストに任せる |
| `string`・`number` など広い型の確認 | 推論が正しく働いていることを示せない |
| 実装と 1:1 対応するだけの型 | テスト価値がない、維持コストだけかかる |

---

## `@ts-expect-error` — 意図的な型エラーのテスト

型エラーが起きることを期待するケースに使う。`@ts-ignore` の代わり。

```ts
// NG: @ts-ignore は理由が不明で、修正しても気づかない
// @ts-ignore
const x: string = 123;

// OK: @ts-expect-error + 理由（修正されたらビルドエラーになる）
// @ts-expect-error string は number に代入できないことを確認
const x: string = 123;
```

型エラーが発生しなくなった（バグが修正された）場合、
`@ts-expect-error` を付けたままにするとビルドが失敗する → 自動的に除去を促す。

テストでの使い方:

```ts
it('rejects invalid input at type level', () => {
  function requireString(s: string): void { /* */ }
  // @ts-expect-error 数値は渡せないことをコンパイル時に検証
  requireString(123);
});
```

---

## 型テストの置き場所

- **同一テストファイル推奨**: `Component.test.tsx` に runtime test と並べて書く
- 型テストのみのファイルが必要なら `Component.types.test.ts` を作る
- `vitest.config.ts` の `typecheck` オプションを有効にすると型テストのみを別途実行できる
