# type-fest catalog

TypeScript の型システムを補強する型ユーティリティ集。**runtime コードはゼロ**（型定義のみ）。

```typescript
import type { PartialDeep, CamelCase } from 'type-fest';
```

---

## Basic（基本型）

| 型名 | 説明 |
| --- | --- |
| `Primitive` | `string \| number \| bigint \| boolean \| symbol \| null \| undefined` |
| `Class<T>` | コンストラクタ型 |
| `Constructor<T>` | `new (...args: any[]) => T` |
| `AbstractClass<T>` | abstract クラス |
| `AbstractConstructor<T>` | abstract コンストラクタ |
| `TypedArray` | TypedArray の union |
| `ObservableLike` | `.subscribe()` を持つ型 |
| `LowercaseLetter` | `'a'\|'b'\|...\|'z'` |
| `UppercaseLetter` | `'A'\|'B'\|...\|'Z'` |
| `DigitCharacter` | `'0'\|...\|'9'` |
| `Alphanumeric` | letter か digit |

---

## Utility（汎用ユーティリティ）— 最頻出

### オブジェクト変換

| 型名 | signature | 説明 |
| --- | --- | --- |
| `Simplify<T>` | `Simplify<{a: 1} & {b: 2}>` → `{a:1;b:2}` | 交差型を 1 つのオブジェクト型に展開 |
| `SimplifyDeep<T>` | — | ネストも展開 |
| `Merge<A, B>` | `Merge<{a:1;c:2}, {b:3;c:4}>` → `{a:1;b:3;c:4}` | B でオーバーライドしながら結合 |
| `MergeDeep<A, B>` | — | 深い結合 |
| `MergeExclusive<A, B>` | — | A か B のどちらか一方のみ |
| `Except<T, K>` | `Except<User, 'id'>` | Omit の型安全版（存在しない key でエラー） |
| `OverrideProperties<T, U>` | — | 既存 key の型をオーバーライド |
| `Spread<T, U>` | — | `{...T, ...U}` の型 |
| `PartialDeep<T>` | `PartialDeep<User>` | 全プロパティを再帰的に optional に | 
| `RequiredDeep<T>` | — | 全プロパティを再帰的に required に |
| `ReadonlyDeep<T>` | — | 全プロパティを再帰的に readonly に |
| `WritableDeep<T>` | — | readonly を再帰的に除去 |
| `Writable<T>` | — | readonly を 1 段除去 |
| `PickDeep<T, K>` | `PickDeep<Config, 'db.host'>` | ネストした key を path 文字列で pick |
| `OmitDeep<T, K>` | — | ネストした key を path 文字列で omit |
| `OmitIndexSignature<T>` | — | index signature を除いた型 |
| `PickIndexSignature<T>` | — | index signature のみ残す |
| `PartialOnUndefinedDeep<T>` | — | undefined になりうるプロパティを optional に |
| `SetOptional<T, K>` | `SetOptional<User, 'name'>` | 指定キーを optional に |
| `SetRequired<T, K>` | `SetRequired<User, 'id'>` | 指定キーを required に |
| `SetRequiredDeep<T, K>` | — | 再帰的に required に |
| `SetReadonly<T, K>` | — | 指定キーを readonly に |
| `SetNonNullable<T, K>` | — | 指定キーから null/undefined を除去 |
| `SetNonNullableDeep<T, K>` | — | 再帰的に non-nullable に |
| `NonNullableDeep<T>` | — | 全プロパティを再帰的に non-nullable |
| `SetFieldType<T, K, V>` | — | 指定キーの型を変更 |

### キー・値操作

| 型名 | 説明 |
| --- | --- |
| `ValueOf<T>` | オブジェクト型の値の union |
| `Entry<T>` | `[K, T[K]]` タプル型 |
| `Entries<T>` | 全 `[K, T[K]]` の union |
| `KeyAsString<K>` | string キーのみに絞る |
| `ConditionalKeys<T, Cond>` | 値が Cond に extends するキーの union |
| `ConditionalPick<T, Cond>` | 値が Cond に extends するプロパティのみ pick |
| `ConditionalPickDeep<T, Cond>` | 再帰版 ConditionalPick |
| `ConditionalExcept<T, Cond>` | 値が Cond に extends するプロパティを除外 |
| `OptionalKeysOf<T>` | optional キーの union |
| `RequiredKeysOf<T>` | required キーの union |
| `ReadonlyKeysOf<T>` | readonly キーの union |
| `WritableKeysOf<T>` | writable キーの union |
| `SharedUnionFields<U>` | union 型の共通フィールド |
| `SharedUnionFieldsDeep<U>` | 再帰版 SharedUnionFields |
| `AllUnionFields<U>` | union 型の全フィールド（optional に） |
| `DistributedOmit<U, K>` | union 型の各メンバーから K を omit |
| `DistributedPick<U, K>` | union 型の各メンバーから K を pick |
| `KeysOfUnion<U>` | union 型の全キーの union |

### その他ユーティリティ

| 型名 | 説明 |
| --- | --- |
| `LiteralUnion<T, Base>` | `'foo' \| 'bar' \| string` の IDE 補完を維持 |
| `Tagged<T, Tag>` | 同じ primitive 型に nominal tag を付与（branded type） |
| `UnwrapTagged<T>` | Tagged の tag を除去 |
| `InvariantOf<T>` | 不変（invariant）の wrapper |
| `Stringified<T>` | 全値を `string` に変換 |
| `Get<T, Path>` | ドット区切りパスで型を取得 `Get<Config, 'db.host'>` |
| `Paths<T>` | オブジェクトの全ネストパスの union |
| `Schema<T>` | 全値を T 型に変換したスキーマ型 |
| `Exact<T, Shape>` | T が Shape を超過しないか検証 |
| `UnionToIntersection<U>` | union → intersection に変換 |
| `LiteralToPrimitive<T>` | literal → primitive 型に widening |
| `LiteralToPrimitiveDeep<T>` | 再帰版 |
| `IterableElement<T>` | Iterable の要素型 |
| `RequireAtLeastOne<T, K>` | K のうち少なくとも 1 つを必須に |
| `RequireExactlyOne<T, K>` | K のうちちょうど 1 つを必須に |
| `RequireAllOrNone<T, K>` | K の全指定か全省略かのみ許可 |
| `RequireOneOrNone<T, K>` | K のうち 1 つ以下のみ許可 |
| `SingleKeyObject<T>` | キーが 1 つのみのオブジェクト |
| `EmptyObject` | `Record<never, never>`（空オブジェクト） |
| `NonEmptyObject<T>` | 少なくとも 1 プロパティを持つ |
| `UnknownRecord` | `Record<PropertyKey, unknown>` |
| `UnknownArray` | `ReadonlyArray<unknown>` |
| `SetReturnType<T, R>` | 関数の戻り値型を変更 |
| `SetParameterType<T, N, P>` | 関数の指定番目の引数型を変更 |
| `IsEqual<A, B>` | 2 つの型が等しければ `true`、違えば `false` |
| `TaggedUnion<K, M>` | discriminant key K を使った tagged union を簡単に定義 |
| `IntRange<F, T>` | F〜T の整数 union（半開区間） |
| `IntClosedRange<F, T>` | F〜T の整数 union（閉区間） |
| `ArrayIndices<T>` | 配列の有効インデックスの union |
| `ArrayValues<T>` | 配列の要素型 |
| `ArraySplice<T, S, D, I>` | 型レベル Array.splice |
| `NonEmptyTuple<T>` | 最低 1 要素のタプル |
| `NonEmptyString` | `string & {readonly _: unique symbol}` 相当 |

---

## Type Guard（型述語）

| 型名 | 説明 |
| --- | --- |
| `If<Cond, Then, Else>` | Cond が `true` なら Then、`false` なら Else |
| `IsLiteral<T>` | リテラル型か |
| `IsStringLiteral<T>` | 文字列リテラルか |
| `IsNumericLiteral<T>` | 数値リテラルか |
| `IsBooleanLiteral<T>` | boolean リテラルか |
| `IsSymbolLiteral<T>` | symbol リテラルか |
| `IsAny<T>` | `any` か |
| `IsNever<T>` | `never` か |
| `IsUnknown<T>` | `unknown` か |
| `IsEmptyObject<T>` | `{}` か |
| `IsNull<T>` | `null` か |
| `IsUndefined<T>` | `undefined` か |
| `IsTuple<T>` | タプル型か |
| `IsUnion<T>` | union 型か |
| `IsLowercase<T>` | 小文字文字列リテラルか |
| `IsUppercase<T>` | 大文字文字列リテラルか |
| `IsOptional<T>` | optional か（`undefined` を含むか） |
| `IsNullable<T>` | nullable か（`null` を含むか） |
| `IsOptionalKeyOf<T, K>` | K が T の optional キーか |
| `IsRequiredKeyOf<T, K>` | K が T の required キーか |
| `IsReadonlyKeyOf<T, K>` | K が T の readonly キーか |
| `IsWritableKeyOf<T, K>` | K が T の writable キーか |
| `HasOptionalKeys<T>` | T に optional キーがあるか |
| `HasRequiredKeys<T>` | T に required キーがあるか |
| `HasReadonlyKeys<T>` | T に readonly キーがあるか |
| `HasWritableKeys<T>` | T に writable キーがあるか |

---

## JSON

| 型名 | 説明 |
| --- | --- |
| `JsonPrimitive` | `string \| number \| boolean \| null` |
| `JsonObject` | `Record<string, JsonValue>` |
| `JsonArray` | `JsonValue[]` |
| `JsonValue` | 全 JSON 値の union |
| `Jsonify<T>` | T を JSON シリアライズした後の型 |
| `Jsonifiable` | JSON.stringify 可能な型 |

### 使用例

```typescript
import type { Jsonify } from 'type-fest';

type ApiRequest = { createdAt: Date; count: number };
type JsonApiRequest = Jsonify<ApiRequest>;
// { createdAt: string; count: number }
```

---

## Structured Clone

| 型名 | 説明 |
| --- | --- |
| `StructuredCloneable` | structuredClone でコピー可能な型 |

---

## Async

| 型名 | 説明 |
| --- | --- |
| `Promisable<T>` | `T \| Promise<T>` |
| `AsyncReturnType<T>` | async 関数の戻り値型（Awaited<ReturnType<T>>） |
| `Asyncify<T>` | 関数を async 化した型 |

---

## String（文字列型操作）

| 型名 | 説明 |
| --- | --- |
| `Trim<S>` | 両端の空白除去 |
| `Split<S, Sep>` | 区切り文字で分割してタプルに |
| `Words<S>` | 単語分割してタプルに |
| `Replace<S, From, To>` | 文字列置換 |
| `StringSlice<S, Start, End>` | 型レベル slice |
| `StringRepeat<S, N>` | N 回繰り返し |
| `RemovePrefix<S, P>` | プレフィックス除去 |

---

## Array（配列型操作）

| 型名 | 説明 |
| --- | --- |
| `Arrayable<T>` | `T \| T[]` |
| `Includes<T, V>` | 型レベル includes |
| `Join<T, Sep>` | タプルを文字列型に結合 |
| `ArraySlice<T, Start, End>` | 型レベル slice |
| `ArrayElement<T>` | 配列の要素型（= `T[number]`） |
| `LastArrayElement<T>` | 最後の要素型 |
| `FixedLengthArray<T, N>` | 固定長配列型 |
| `MultidimensionalArray<T, N>` | N 次元配列型 |
| `ReadonlyTuple<T, N>` | 固定長 readonly タプル |
| `TupleToUnion<T>` | タプル → union |
| `UnionToTuple<U>` | union → タプル（順序不定） |
| `TupleToObject<T>` | インデックスをキーにしたオブジェクト型 |
| `TupleOf<T, N>` | 型 T の N 要素タプル |
| `ArrayReverse<T>` | タプルを逆順に |
| `ArrayLength<T>` | タプルの長さの数値型 |
| `NonEmptyTuple<T>` | 最低 1 要素タプル |

---

## Numeric（数値型）

| 型名 | 説明 |
| --- | --- |
| `Integer<T>` | 整数型 |
| `Float<T>` | 浮動小数点型 |
| `Negative<T>` | 負数型 |
| `NonNegative<T>` | 非負数型 |
| `NegativeInteger<T>` | 負の整数型 |
| `NonNegativeInteger<T>` | 非負の整数型 |
| `IsNegative<T>` | 負か |
| `IsFloat<T>` | 浮動小数点か |
| `IsInteger<T>` | 整数か |
| `GreaterThan<A, B>` | A > B か |
| `GreaterThanOrEqual<A, B>` | A >= B か |
| `LessThan<A, B>` | A < B か |
| `LessThanOrEqual<A, B>` | A <= B か |
| `Sum<A, B>` | 型レベル加算 |
| `Subtract<A, B>` | 型レベル減算 |
| `Absolute<T>` | 絶対値型 |
| `Finite<T>` | 有限数型 |
| `PositiveInfinity` | `number & {readonly _tag: 'PositiveInfinity'}` |
| `NegativeInfinity` | `number & {readonly _tag: 'NegativeInfinity'}` |

---

## Change Case（ケース変換）

| 型名 | 説明 |
| --- | --- |
| `CamelCase<S>` | `'foo-bar'` → `'fooBar'` |
| `CamelCasedProperties<T>` | オブジェクトの全キーを camelCase に |
| `CamelCasedPropertiesDeep<T>` | 再帰版 |
| `KebabCase<S>` | `'fooBar'` → `'foo-bar'` |
| `KebabCasedProperties<T>` | 全キーを kebab-case に |
| `KebabCasedPropertiesDeep<T>` | 再帰版 |
| `PascalCase<S>` | `'foo-bar'` → `'FooBar'` |
| `PascalCasedProperties<T>` | 全キーを PascalCase に |
| `PascalCasedPropertiesDeep<T>` | 再帰版 |
| `SnakeCase<S>` | `'fooBar'` → `'foo_bar'` |
| `SnakeCasedProperties<T>` | 全キーを snake_case に |
| `SnakeCasedPropertiesDeep<T>` | 再帰版 |
| `ScreamingSnakeCase<S>` | `'fooBar'` → `'FOO_BAR'` |
| `DelimiterCase<S, D>` | 任意区切り文字でケース変換 |
| `DelimiterCasedProperties<T, D>` | 全キーに適用 |
| `DelimiterCasedPropertiesDeep<T, D>` | 再帰版 |

### 使用例

```typescript
import type { CamelCasedPropertiesDeep } from 'type-fest';

type SnakeConfig = { user_name: string; is_admin: boolean };
type CamelConfig = CamelCasedPropertiesDeep<SnakeConfig>;
// { userName: string; isAdmin: boolean }
```

---

## Improved Built-in（組み込み型の改善版）

| 型名 | 説明 |
| --- | --- |
| `ExtendsStrict<T, U>` | 厳密な extends チェック（`any` を `unknown` として扱う） |
| `ExtractStrict<T, U>` | `any` 混入を防いだ Extract |
| `ExcludeStrict<T, U>` | `any` 混入を防いだ Exclude |
| `ExcludeExactly<T, U>` | 完全一致のみ除外 |

---

## Miscellaneous

| 型名 | 説明 |
| --- | --- |
| `PackageJson` | package.json の型定義 |
| `TsConfigJson` | tsconfig.json の型定義 |
| `GlobalThis` | `globalThis` の型 |
| `FindGlobalType<T>` | グローバル型から T を検索 |
| `FindGlobalInstanceType<T>` | グローバルコンストラクタのインスタンス型 |

---

## よく使う組み合わせパターン

```typescript
import type { Simplify, PartialDeep, SetOptional, LiteralUnion, Tagged } from 'type-fest';

// 交差型を展開してエディタに表示しやすく
type Flat = Simplify<A & B>;

// ID のブランド型
type UserId = Tagged<string, 'UserId'>;
type PostId = Tagged<string, 'PostId'>;

// 補完が効くリテラル union
type Theme = LiteralUnion<'light' | 'dark', string>;

// deep partial（テストのモックデータ作成に便利）
type TestUser = PartialDeep<User>;

// 特定キーだけ optional に
type UserForm = SetOptional<User, 'createdAt' | 'updatedAt'>;
```

---

_Last verified: 2026-05-04 against type-fest@4.x (latest at time of authoring — run freshness-check.md Step 1 to confirm)_
