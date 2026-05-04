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

## Non-empty tuple — `noUncheckedIndexedAccess` と戦わない

`noUncheckedIndexedAccess` を有効にすると `arr[0]` の型が `T | undefined` になる。
配列に要素が必ず存在する場合、**non-empty tuple** で型付けすると `[0]` が `T` 確定になる。

```ts
// NG: string[] では arr[0] が string | undefined
type LinesMap = Record<string, string[]>;
const LINES: LinesMap = { intro: ['Hello'] };
function getFirst(key: string): string {
  return LINES[key]![0] as string; // assertion が必要
}

// OK: readonly [string, ...string[]] なら [0] は string
type NonEmptyStrings = readonly [string, ...string[]];
type LinesMap = Record<string, NonEmptyStrings>;
const LINES: LinesMap = { intro: ['Hello'] };
function getFirst(key: string): string {
  const lines = LINES[key]!;
  return lines[index % lines.length] ?? lines[0]; // lines[0] は string — assertion 不要
}
```

配列に空の状態がありえない設計上の保証がある場合（静的 enum マップなど）に有効。
空配列が来る可能性があるなら `if (arr.length === 0) throw` のガードを先に書く。

---

## CSS カスタムプロパティ — `as string` なしの inline style

React の `CSSProperties` は `--*` カスタムプロパティを含まない。
`['--glow-x' as string]` や `style={{ '--glow-x': x } as CSSProperties}` を避けるには
**intersection type のヘルパ** を一箇所に定義する。

```ts
// src/shared/lib/css.ts（ヘルパ定義）
import type { CSSProperties } from 'react';

export type CSSWithVars = CSSProperties & {
  readonly [key: `--${string}`]: string | number | undefined;
};
```

```tsx
// コンポーネント側 — as 不要
import type { CSSWithVars } from '@shared/lib';

const style: CSSWithVars = { '--glow-x': `${x}%`, '--glow-y': `${y}%` };
return <div style={style} />;

// inline style でも型付き変数経由なら同様に as 不要
const markers = [
  { dir: 'N', style: { '--mark-rot': '0deg' } satisfies CSSWithVars },
];
```

**注意**: `satisfies CSSWithVars` はオブジェクトリテラルを JSX `style` prop に直接渡すと
"型が CSSProperties に合わない" エラーになる。必ず **型付き変数に代入してから渡す**こと。

---

## Discriminated Union の内部キー相関 — `event.key` で switch

DU のバリアントが `key` と `value` の相関を持つ場合、動的キーアクセス `{ [event.key]: event.value }` では
TypeScript が narrowing できず `as` が必要になる。**`event.key` で switch** すれば各ブランチで型が確定する。

```ts
type Event =
  | { type: 'SET_OUTPUT'; key: 'A'; value: string }
  | { type: 'SET_OUTPUT'; key: 'C'; value: string[] }
  | { type: 'SET_OUTPUT'; key: 'G'; value: number[] };

// NG: 動的キーアクセス — TS が相関を narrowing できないため as が必要
case 'SET_OUTPUT':
  return { ...state, outputs: { ...state.outputs, [event.key]: event.value } as Outputs };

// OK: key で switch → 各ブランチで event が具体的なバリアントに narrowing
case 'SET_OUTPUT': {
  switch (event.key) {
    case 'A': return { ...state, outputs: { ...state.outputs, A: event.value } }; // string
    case 'C': return { ...state, outputs: { ...state.outputs, C: event.value } }; // string[]
    case 'G': return { ...state, outputs: { ...state.outputs, G: event.value } }; // number[]
    /* v8 ignore next 4 */
    default: { const _e: never = event; return _e; }
  }
}
```

DU 設計の改善点: `key: 'A' | 'C' | 'G'` のような broad union よりも、
key ごとに variant を分離した DU のほうが narrowing が自然に機能する。

---

## lib.dom 標準型の活用 — 自前型の二重管理を避ける

TypeScript の `lib.dom.d.ts` は頻繁に更新されている。自前で型を再定義する前に
**lib.dom に既に定義されていないか確認**する。

```ts
// NG: Navigator.wakeLock が lib.dom にあるのに自前で再定義
type WakeLockApi = { request: (type: 'screen') => Promise<WakeLockSentinel> };
type NavigatorWithWakeLock = Navigator & { wakeLock?: WakeLockApi };
function getApi() {
  return (navigator as NavigatorWithWakeLock).wakeLock; // assertion が必要
}

// OK: TS 5.9+ の lib.dom では Navigator.wakeLock: WakeLock が定義済み
function getApi(): WakeLock | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const api = navigator.wakeLock;
  if (!api) return undefined; // Safari < 16.4 等では runtime undefined になる
  return api;
}
```

確認コマンド:
```bash
grep -n "wakeLock\|WakeLock" node_modules/typescript/lib/lib.dom.d.ts
```

実際のブラウザの実装状況と lib.dom 定義の乖離 (optional vs required など) には
runtime ガード (`if (!api)`) で対処し、型の二重管理は避ける。

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
