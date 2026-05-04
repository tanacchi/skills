# forbidden-assertions

`as any` / `as never` / `as unknown` / `as <SpecificType>` の禁止理由と、正しい代替パターン。

このリポジトリのポリシー: **type assertion は完全禁止**。
例外が必要な場合は ADR を起票し、リポジトリ単位の承認を得る。

---

## なぜ type assertion は危険か

TypeScript の type assertion は「コンパイラの型チェックを黙らせる」だけであり、
実行時の安全性は一切保証しない。assertion が通っても、値の実際の型が assertion と
異なれば実行時に壊れる。型安全性の恩恵（エディタ補完・回帰検出）を無効化する最大の要因。

---

## `as any`

**禁止理由**: any は型システムを局所的に無効化する。any が伝播するとその周辺の型チェックが
すべて意味を失い、バグが静かに混入する。

**代替**:

```ts
// NG
function parseUser(raw: unknown) {
  return (raw as any).name; // 実行時エラーの温床
}

// OK: Zod などで runtime parse
import { z } from 'zod';
const UserSchema = z.object({ name: z.string() });
function parseUser(raw: unknown) {
  return UserSchema.parse(raw).name; // 型も安全、例外も明示的
}

// OK: 型ガード関数
function isUser(value: unknown): value is { name: string } {
  return typeof value === 'object' && value !== null && 'name' in value;
}
```

---

## `as unknown`（および `as unknown as T`）

**禁止理由**: `unknown` へのキャストは通常意味がない。
`as unknown as T` は「型システムを2段階で騙す」最も危険なパターン。

**代替**:

```ts
// NG: double assertion で型システムを完全に騙している
function coerce(x: string): number {
  return x as unknown as number;
}

// OK: 本当に unknown な境界（外部 API レスポンスなど）では Zod で parse
const RawResponseSchema = z.object({ count: z.number() });
function parseResponse(raw: unknown) {
  return RawResponseSchema.parse(raw); // { count: number }
}
```

---

## `as never`

**禁止理由**: `never` へのキャストは exhaustive check 以外に使い道がなく、
大抵は型が正しく絞り込めていないことを隠蔽している。

**注意**: `const _exhaustive: never = value` パターン（変数代入）は OK。
これは assertion ではなく、型の代入互換性をコンパイラに検証させる慣用句。

```ts
// NG: assertion で黙らせる
function handleEvent(event: AEvent | BEvent) {
  if (event.type === 'A') { /* ... */ }
  const _: never = event as never; // assertion — 禁止
}

// OK: 代入で exhaustive check（assertion ではない）
function handleEvent(event: AEvent | BEvent) {
  if (event.type === 'A') { /* ... */ }
  if (event.type === 'B') { /* ... */ }
  /* v8 ignore next 3 */
  const _exhaustive: never = event; // CEventが追加されたらコンパイルエラー
  return _exhaustive;
}
```

---

## `as <SpecificType>`（任意の具体型）

**禁止理由**: 型の不一致をコンパイラに黙認させている。
ライブラリの型定義とコードが噛み合わないときの "一時しのぎ" が永続化しがち。

**代替**:

```ts
// NG: HTMLInputElement かどうかは実行時に分からない
const el = document.querySelector('#email') as HTMLInputElement;

// OK: 型ガード or null チェック
const el = document.querySelector('#email');
if (el instanceof HTMLInputElement) {
  el.value; // 安全
}
```

```ts
// NG: ライブラリの型と微妙に合わない
const config = loadConfig() as MyConfig;

// OK: satisfies で shape を検証（推論を保ちつつ契約を確認）
const config = loadConfig() satisfies MyConfig;
// — または Zod で parse —
const config = MyConfigSchema.parse(loadConfig());
```

---

## 唯一の ADR なし例外: Branded type の constructor

```ts
declare const _brand: unique symbol;
type Brand<T, B> = T & { readonly [_brand]: B };
type UserId = Brand<string, 'UserId'>;

// Brand constructor 内部の 1 行のみ許可
// 理由: TypeScript に nominal typing の組み込み構文がないため
function toUserId(id: string): UserId {
  return id as UserId;
}
```

この例外は constructor 関数の return 文 1 行のみに限定する。
それ以外の箇所で同様の assertion を使う場合は ADR が必要。

---

## テストコード固有の `as` — 代替パターン集

テストで頻出する `as` キャストにも必ず代替がある。
「テストだから `as` OK」はポリシー違反。

### ブラウザ API のモック (`navigator as unknown as T`)

```ts
// NG: double assertion で型システムを完全に騙している
const nav = navigator as unknown as { vibrate?: (p: number[]) => boolean };
nav.vibrate = vi.fn();

// OK: vi.stubGlobal は value: unknown を受け取るため assertion 不要
vi.stubGlobal('navigator', { ...navigator, vibrate: vi.fn().mockReturnValue(true) });
afterEach(() => vi.unstubAllGlobals());
```

**ポイント**: `vi.stubGlobal(name, value: unknown)` は任意の値を受け付けるため、
navigator / window など読み取り専用グローバルの mock にキャスト不要で対応できる。

---

### `it.each` のタプル narrowing (`[...] as [T, U][]`)

```ts
// NG: タプル型への assertion
it.each([
  ['tap', [10]],
  ['success', [20, 40, 20]],
] as [HapticPattern, number[]][])(...)

// OK: 型付き const として宣言
const cases: ReadonlyArray<readonly [HapticPattern, readonly number[]]> = [
  ['tap', [10]],
  ['success', [20, 40, 20]],
];
it.each(cases)('forwards %s', (label, ms) => { ... });
```

---

### DOM クエリ結果のキャスト (`element as HTMLElement`)

```ts
// NG: getByTestId は Element を返すが getAttribute は HTMLElement のメソッドとして as で黙らせる
const style = (screen.getByTestId('x') as HTMLElement).getAttribute('style');

// OK: @testing-library の getByTestId は既に HTMLElement を返す — キャスト不要
const style = screen.getByTestId('x').getAttribute('style');

// もし Element しか返ってこない API を使う場合 → instanceof で narrowing
const el = document.getElementById('root');
if (el instanceof HTMLInputElement) {
  el.value; // 安全
}
```

---

### Zod バリデーション境界テスト (`{...} as Action`)

Server Action などランタイムバリデーションを行う関数に**意図的に不正な値**を渡してテストしたいとき、
呼び出し側の型を widening することで `as` が不要になる。

```ts
// NG: テスト専用の double assertion でコンパイラを欺く
await dispatch(state, { type: 'SUBMIT_OUTPUT_A', letters: 'too-long' } as Action);

// OK: シグネチャに generic + extends 境界を加え、tests はキャスト不要にする
// dispatch.ts
type DispatchInput = Action | { readonly type: string };
export async function dispatch<T extends DispatchInput>(state: GameState, raw: T): Promise<Event[]> {
  const parsed = ActionSchema.safeParse(raw); // Zod が SSOT
  // ...
}

// dispatch.spec.ts — キャスト不要
await dispatch(state, { type: 'SUBMIT_OUTPUT_A', letters: 'too-long' }); // Zod が実行時に弾く
await dispatch(state, { type: 'UNKNOWN' });                               // { type: string } 側にマッチ
```

**使いどころ**: `raw` を Zod で検証するため型上の `Action` 制約は `as` で黙らせる必要がない。
`generic + extends (UnionType | { type: string })` で呼び出し側の型安全性 (Action の補完) と
テストの柔軟性 (不正値の注入) を両立する。

---

## ADR 起票時の記載項目

ADR を起票する場合、以下を記載する:

1. `as` を使わなければならない技術的理由（型ガード・Zod・satisfies で解決できないことの説明）
2. 影響範囲（ファイル名、行番号、assertion の件数）
3. 代替案の検討結果とそれを採用しない理由
4. 受け入れるリスクとモニタリング方法
5. 将来の解消見込み（ライブラリ upgrade 待ち等）
