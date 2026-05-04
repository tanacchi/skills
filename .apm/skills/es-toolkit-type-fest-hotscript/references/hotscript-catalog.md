# hotscript catalog

Higher-Order TypeScript — 型レベルの関数型 DSL。**runtime コードはゼロ**（型定義のみ）。  
TypeScript の型を「型レベル関数」として合成・パイプラインで変換する。

```typescript
import { Pipe, Call, Fn, Tuples, Strings, Objects, Numbers, Unions, Booleans, Functions, Match } from 'hotscript';
```

> **注意**: hotscript の大規模 Pipe（20 段超）は TypeScript のコンパイル時間に影響することがある。  
> 使用前にコンパイル時間を計測することを推奨。

---

## Core — パイプラインと関数合成

### `Pipe<Input, [Fn1, Fn2, ...]>` — 最重要

左から右へ Input を型変換の連鎖に通す。

```typescript
type Result = Pipe<
  [1, 2, 3, 4, 5],
  [
    Tuples.Filter<Numbers.GreaterThan<2>>,  // [3, 4, 5]
    Tuples.Map<Numbers.Multiply<10>>,       // [30, 40, 50]
    Tuples.Sum                              // 120
  ]
>;
// Result = 120
```

### その他の Core

| 型名 | 説明 |
| --- | --- |
| `PipeRight<Input, [Fn1, ...]>` | 右から左へ（数学的合成順） |
| `Call<Fn, Arg>` | 型レベル関数を 1 回呼び出す |
| `Compose<[Fn1, Fn2, ...]>` | 関数を合成して新しい Fn を作る（右から左） |
| `ComposeLeft<[Fn1, Fn2, ...]>` | 関数を合成（左から右、Pipe と同じ評価順） |
| `Apply<Fn, Args>` | 複数引数で Fn を呼び出す |
| `PartiallyApply<Fn, Arg>` | 部分適用 |

### カスタム型レベル関数の定義

```typescript
interface Double extends Fn {
  return: this['arg0'] extends number
    ? Numbers.Multiply<2, this['arg0']>
    : never;
}

type Result = Call<Double, 5>; // 10
```

---

## Tuples — タプル操作

型レベル配列（タプル）に対して map / filter / reduce 等を適用する。

| 型名 | 説明 |
| --- | --- |
| `Tuples.Map<Fn>` | 各要素に Fn を適用 |
| `Tuples.Filter<Fn>` | Fn が true の要素のみ残す |
| `Tuples.FlatMap<Fn>` | Map して 1 段 flatten |
| `Tuples.Reduce<Fn, Init>` | 累積して 1 値に |
| `Tuples.ReduceRight<Fn, Init>` | 右から Reduce |
| `Tuples.Every<Fn>` | 全要素が Fn を満たすか |
| `Tuples.Some<Fn>` | 一部要素が Fn を満たすか |
| `Tuples.Find<Fn>` | Fn が最初に true になる要素 |
| `Tuples.FindIndex<Fn>` | Fn が最初に true になるインデックス |
| `Tuples.At<N>` | インデックス N の要素 |
| `Tuples.Head` | 先頭要素 |
| `Tuples.Tail` | 末尾要素 |
| `Tuples.Last` | 最後の要素 |
| `Tuples.Init` | 末尾を除いたタプル |
| `Tuples.Drop<N>` | 先頭 N 要素を除く |
| `Tuples.Take<N>` | 先頭 N 要素を取得 |
| `Tuples.TakeWhile<Fn>` | Fn が true の間取得 |
| `Tuples.DropWhile<Fn>` | Fn が true の間除く |
| `Tuples.Partition<Fn>` | Fn の true / false で 2 分割 |
| `Tuples.GroupBy<Fn>` | Fn 結果でグループ化 |
| `Tuples.Zip<T>` | 2 つのタプルをペアに |
| `Tuples.ZipWith<T, Fn>` | Zip しながら Fn を適用 |
| `Tuples.Sort<Fn?>` | ソート |
| `Tuples.Reverse` | 逆順 |
| `Tuples.Flat` | 1 段 flatten |
| `Tuples.FlatDeep` | 深く flatten |
| `Tuples.Append<T>` | 末尾に追加 |
| `Tuples.Prepend<T>` | 先頭に追加 |
| `Tuples.Concat<T>` | タプルを結合 |
| `Tuples.Join<Sep>` | タプル → 文字列型 |
| `Tuples.Range<Start, End>` | 数値範囲のタプル生成 |
| `Tuples.Sum` | 数値タプルの合計 |
| `Tuples.Min` | 最小値 |
| `Tuples.Max` | 最大値 |
| `Tuples.Includes<T>` | T を含むか |
| `Tuples.Intersect<T>` | 積集合 |
| `Tuples.Difference<T>` | 差集合 |
| `Tuples.ToUnion` | タプル → union |
| `Tuples.ToIntersection` | タプル → intersection |
| `Tuples.IsEmpty` | 空か |
| `Tuples.Length` | 長さ（数値型） |
| `Tuples.Chunk<N>` | N 要素ずつ分割 |
| `Tuples.Uniq` | 重複除去 |
| `Tuples.UniqBy<Fn>` | Fn 適用後の重複除去 |
| `Tuples.Flatten` | 1 段 flatten（= Flat） |

---

## Objects — オブジェクト型操作

| 型名 | 説明 |
| --- | --- |
| `Objects.MapValues<Fn>` | 値に Fn を適用 |
| `Objects.MapKeys<Fn>` | キーに Fn を適用 |
| `Objects.MapEntries<Fn>` | `[key, value]` エントリに Fn を適用 |
| `Objects.Assign<...Obj>` | オブジェクトを結合 |
| `Objects.Pick<K>` | キー K のみ抽出 |
| `Objects.Omit<K>` | キー K を除外 |
| `Objects.Get<K>` | キー K の値型を取得 |
| `Objects.FromEntries` | エントリからオブジェクト型を生成 |
| `Objects.Entries` | `[K, V]` タプルの union に変換 |
| `Objects.Keys` | キーの union に変換 |
| `Objects.Values` | 値の union に変換 |
| `Objects.PickBy<Fn>` | Fn が true の値を持つキーのみ pick |
| `Objects.OmitBy<Fn>` | Fn が true の値を持つキーを omit |
| `Objects.SnakeCaseDeep` | 全キーを再帰的に snake_case に |
| `Objects.CamelCaseDeep` | 全キーを再帰的に camelCase に |
| `Objects.KebabCaseDeep` | 全キーを再帰的に kebab-case に |
| `Objects.PascalCaseDeep` | 全キーを再帰的に PascalCase に |
| `Objects.ConstantCaseDeep` | 全キーを再帰的に CONSTANT_CASE に |
| `Objects.Readonly` | 全プロパティを readonly に |
| `Objects.Required` | 全プロパティを required に |
| `Objects.Partial` | 全プロパティを optional に |
| `Objects.DeepReadonly` | 再帰的に readonly に |
| `Objects.DeepRequired` | 再帰的に required に |
| `Objects.DeepPartial` | 再帰的に optional に |
| `Objects.Record<K, V>` | Record 型を生成 |
| `Objects.Merge<T>` | Merge（後方オーバーライド） |
| `Objects.Intersect<T>` | intersection 型 |
| `Objects.Update<K, Fn>` | キー K の値に Fn を適用して更新 |
| `Objects.Create<T>` | 型をそのまま返す（identity） |

---

## Unions — Union 型操作

| 型名 | 説明 |
| --- | --- |
| `Unions.Map<Fn>` | union の各メンバーに Fn を適用 |
| `Unions.Extract<T>` | union から T を抽出（Extract） |
| `Unions.Exclude<T>` | union から T を除外（Exclude） |
| `Unions.ExcludeBy<Fn>` | Fn が true のメンバーを除外 |
| `Unions.ExtractBy<Fn>` | Fn が true のメンバーを抽出 |
| `Unions.Filter<Fn>` | ExcludeBy の逆（true のメンバーを残す） |
| `Unions.ToTuple` | union → タプル（順序不定） |
| `Unions.ToIntersection` | union → intersection |
| `Unions.Includes<T>` | T が union のメンバーか |
| `Unions.Size` | union のメンバー数 |

---

## Strings — 文字列型操作

| 型名 | 説明 |
| --- | --- |
| `Strings.Split<Sep>` | 区切り文字で分割してタプルに |
| `Strings.Join<Sep>` | タプルを文字列型に結合 |
| `Strings.Replace<From, To>` | 文字列を置換 |
| `Strings.Repeat<N>` | N 回繰り返し |
| `Strings.Reverse` | 逆順 |
| `Strings.Trim` | 両端の空白を除去 |
| `Strings.TrimLeft` | 左端の空白を除去 |
| `Strings.TrimRight` | 右端の空白を除去 |
| `Strings.StartsWith<S>` | S で始まるか |
| `Strings.EndsWith<E>` | E で終わるか |
| `Strings.Includes<S>` | S を含むか |
| `Strings.Slice<Start, End?>` | 文字列のスライス |
| `Strings.Head` | 先頭文字 |
| `Strings.Tail` | 先頭を除いた残り |
| `Strings.Last` | 最後の文字 |
| `Strings.Init` | 末尾を除いた残り |
| `Strings.Length` | 文字列の長さ（数値型） |
| `Strings.ToNumber` | 数値文字列 → 数値型 |
| `Strings.ToString` | 数値 → 文字列型 |
| `Strings.Capitalize` | 先頭を大文字に |
| `Strings.Uncapitalize` | 先頭を小文字に |
| `Strings.Uppercase` | 全て大文字に |
| `Strings.Lowercase` | 全て小文字に |
| `Strings.CamelCase` | → camelCase |
| `Strings.KebabCase` | → kebab-case |
| `Strings.SnakeCase` | → snake_case |
| `Strings.PascalCase` | → PascalCase |
| `Strings.ConstantCase` | → CONSTANT_CASE |
| `Strings.Words` | 単語分割してタプルに |
| `Strings.RemovePrefix<P>` | プレフィックスを除去 |
| `Strings.RemoveSuffix<S>` | サフィックスを除去 |
| `Strings.At<N>` | インデックス N の文字 |
| `Strings.Prepend<S>` | 先頭に S を追加 |
| `Strings.Append<S>` | 末尾に S を追加 |

---

## Numbers — 数値型の算術

| 型名 | 説明 |
| --- | --- |
| `Numbers.Add<N>` | 加算 |
| `Numbers.Subtract<N>` | 減算 |
| `Numbers.Multiply<N>` | 乗算 |
| `Numbers.Divide<N>` | 除算 |
| `Numbers.Modulo<N>` | 剰余 |
| `Numbers.Power<N>` | べき乗 |
| `Numbers.Negate` | 符号反転 |
| `Numbers.Absolute` | 絶対値 |
| `Numbers.Compare<N>` | 比較（`-1 \| 0 \| 1`） |
| `Numbers.GreaterThan<N>` | > N か |
| `Numbers.GreaterThanOrEqual<N>` | >= N か |
| `Numbers.LessThan<N>` | < N か |
| `Numbers.LessThanOrEqual<N>` | <= N か |
| `Numbers.IsZero` | 0 か |
| `Numbers.IsPositive` | 正か |
| `Numbers.IsNegative` | 負か |
| `Numbers.Min<T>` | 2 つの最小値 |
| `Numbers.Max<T>` | 2 つの最大値 |

---

## Booleans — 論理演算

| 型名 | 説明 |
| --- | --- |
| `Booleans.And<T>` | AND（`true & T`） |
| `Booleans.Or<T>` | OR（`true \| T`） |
| `Booleans.Not` | NOT |
| `Booleans.Xor<T>` | XOR |
| `Booleans.Equals<T>` | 型等価（`IsEqual`） |
| `Booleans.Extends<T>` | サブタイプチェック |
| `Booleans.DoesNotExtend<T>` | サブタイプ否定チェック |
| `Booleans.IsTrue` | `true` か |
| `Booleans.IsFalse` | `false` か |

---

## Functions — 関数型の操作

| 型名 | 説明 |
| --- | --- |
| `Functions.ReturnType` | 関数の戻り値型 |
| `Functions.Parameters` | 関数の引数型（タプル） |
| `Functions.MapReturnType<Fn>` | 戻り値型に Fn を適用 |
| `Functions.MapParameters<Fn>` | 各引数型に Fn を適用 |
| `Functions.ParameterAt<N>` | N 番目の引数型 |

---

## Match — パターンマッチング

条件分岐を宣言的に記述する。

```typescript
import { Pipe, Match, Booleans, Strings, Numbers } from 'hotscript';

type Test<T> = Pipe<
  T,
  [
    Match<[
      Match.With<string, 'is string'>,
      Match.With<number, 'is number'>,
      Match.With<boolean, 'is boolean'>,
      Match.With<_, 'unknown'>   // _ は wildcard
    ]>
  ]
>;

type R1 = Test<'hello'>;  // 'is string'
type R2 = Test<42>;       // 'is number'
type R3 = Test<true>;     // 'is boolean'
type R4 = Test<null>;     // 'unknown'
```

| 型名 | 説明 |
| --- | --- |
| `Match<Cases>` | パターンマッチ |
| `Match.With<Pattern, Result>` | ケースの定義 |
| `_` | ワイルドカード（任意の型にマッチ） |

---

## 実用的なパイプライン例

### API レスポンスの型変換（snake_case → camelCase）

```typescript
import { Pipe, Objects } from 'hotscript';

type ApiResponse = { user_name: string; created_at: string };
type ClientModel = Pipe<ApiResponse, [Objects.CamelCaseDeep]>;
// { userName: string; createdAt: string }
```

### 配列フィルタ + 変換

```typescript
import { Pipe, Tuples, Numbers } from 'hotscript';

type Nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type EvenDoubled = Pipe<
  Nums,
  [
    Tuples.Filter<Numbers.IsPositive>,
    Tuples.Map<Numbers.Multiply<2>>,
    Tuples.Filter<Numbers.LessThanOrEqual<12>>
  ]
>;
// [2, 4, 6, 8, 10, 12]
```

### カスタム型関数の定義と合成

```typescript
import { Fn, Call, Pipe, ComposeLeft } from 'hotscript';

interface ToString extends Fn {
  return: `${Extract<this['arg0'], string | number>}`;
}

interface WithPrefix extends Fn {
  return: `prefix_${Extract<this['arg0'], string>}`;
}

type Pipeline = ComposeLeft<[ToString, WithPrefix]>;
type Result = Call<Pipeline, 42>; // 'prefix_42'
```

---

_Last verified: 2026-05-04 against hotscript (latest at time of authoring — run freshness-check.md Step 3 WebFetch to confirm)_
