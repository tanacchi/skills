# strict-typing-patterns

`as const` / `satisfies` / `as const satisfies` の使い分けと、strictな型付けを支える主要パターン。

---

## `as const` — リテラル型への freeze

```ts
// NG: string[] に広まる
const ROUTES = ['/home', '/about'];

// OK: readonly ["/home", "/about"] に narrow
const ROUTES = ['/home', '/about'] as const;
```

効果:
- プリミティブ値 → literal type（`"home"` など）
- 配列 → `readonly` tuple
- オブジェクト → 全プロパティが `readonly` + 値が literal type

---

## `satisfies T` — 推論を保ちつつ shape 検証

```ts
type ColorMap = Record<string, string>;

// NG: 型注釈 `: ColorMap` だと推論が string に広まる
const COLORS: ColorMap = { primary: '#3b82f6', danger: '#ef4444' };
COLORS.primary; // string — literal 型が失われている

// OK: satisfies で shape を検証しつつ literal を保持
const COLORS = {
  primary: '#3b82f6',
  danger: '#ef4444',
} satisfies ColorMap;
COLORS.primary; // "#3b82f6" — literal 型が保たれている
```

使い分けの判断軸:
- 型の検証だけ必要 → `satisfies T`
- リテラル freeze だけ必要 → `as const`
- 両方必要 → `as const satisfies T`（後述）

---

## `as const satisfies T` — 検証 + freeze の二重保証

```ts
type StageConfig = { readonly id: string; readonly label: string };

// NG: どちらか片方だと不完全
const STAGES = { intro: { id: 'intro', label: 'Intro' } } as const;         // shape 検証なし
const STAGES = { intro: { id: 'intro', label: 'Intro' } } satisfies ...;    // freeze なし

// OK: 組み合わせで「型契約を守りつつリテラル保持」
const STAGES = {
  intro: { id: 'intro', label: 'Intro' },
  final: { id: 'final', label: 'Final' },
} as const satisfies Record<string, StageConfig>;
// STAGES.intro.id は "intro" — literal 型
// StageConfig に反するプロパティを書けばコンパイルエラー
```

典型的なユースケース:
- アプリ全体で使うルート定数
- 多言語ラベルマップ
- 設定オブジェクト（環境変数のパース結果など）
- DU の variant tag 一覧

---

## Discriminated Union の variant tag

```ts
// NG: string に広まる
const ACTION_TYPES = { SET_USER: 'SET_USER', CLEAR: 'CLEAR' };

// OK: literal union として DU と整合させる
const ACTION_TYPES = {
  SET_USER: 'SET_USER',
  CLEAR: 'CLEAR',
} as const satisfies Record<string, string>;

type Action =
  | { type: typeof ACTION_TYPES.SET_USER; payload: User }
  | { type: typeof ACTION_TYPES.CLEAR };
```

---

## Branded types / Opaque types

同じプリミティブで意味が異なる値（UserId と OrderId など）を区別する。

```ts
// nominal typing を型レベルで模倣
declare const _brand: unique symbol;
type Brand<T, B> = T & { readonly [_brand]: B };

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

// 作成は専用 constructor 関数で
function toUserId(id: string): UserId {
  return id as UserId; // ← 唯一許可される例外：Brand constructor 内部のみ
}

// 以後は UserId を期待する関数に OrderId を渡すとコンパイルエラー
```

Brand constructor 関数の内部で使う `as Brand<T, B>` は branded type の慣用実装であり、
**ADR なしで使える唯一の type assertion の例外**として記録しておく（範囲は constructor 内部 1 行に限定）。

---

## Tuple 型の明示

```ts
// NG: number[] に広まる
function getRange() {
  return [0, 100];
}

// OK: readonly [number, number] として返す
function getRange(): readonly [number, number] {
  return [0, 100] as const;
}
```

---

## `const` type parameter (TypeScript 5.0+)

`as const` を引数に渡す代わりに、generic 関数で narrowing を強制できる。

```ts
// TS 5.0+ の const type parameter
function identity<const T>(value: T): T {
  return value;
}

const result = identity({ x: 1, y: 2 });
// result の型: { readonly x: 1; readonly y: 2 } — as const 不要
```

ライブラリ API を設計するときに有用。呼び出し側に `as const` を強いなくて済む。
