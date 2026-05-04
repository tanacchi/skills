# reverse-index — やりたいこと → ライブラリ逆引き

**最初に参照するファイル。** やりたい操作をカテゴリから探し、該当行の提案ライブラリを確認する。  
詳細な signature・使用例は各 `{library}-catalog.md` を参照。

> 凡例: `—` は該当なし / `→` は catalog の参照先

---

## 配列操作

| やりたいこと | es-toolkit (runtime) | type-fest (型のみ) | hotscript (型 DSL) |
| --- | --- | --- | --- |
| 配列を N 個ずつ分割 | `chunk(arr, n)` | — | `Tuples.Chunk<N>` |
| falsy 値を除去 | `compact(arr)` | — | — |
| 差集合（除外） | `difference / differenceBy / differenceWith` | — | `Tuples.Difference<T>` |
| 先頭 N 要素を除く | `drop(arr, n)` | — | `Tuples.Drop<N>` |
| 末尾 N 要素を除く | `dropRight(arr, n)` | — | — |
| 条件を満たす間除く | `dropWhile / dropRightWhile` | — | `Tuples.DropWhile<Fn>` |
| 1 段 flatten | `flatten(arr)` | — | `Tuples.Flatten` |
| 深く flatten | `flattenDeep(arr)` | — | `Tuples.FlatDeep` |
| map + flatten | `flatMap(arr, fn)` | — | `Tuples.FlatMap<Fn>` |
| キーでグループ化 | `groupBy(arr, fn)` | — | `Tuples.GroupBy<Fn>` |
| 先頭要素を取得 | `head(arr)` | — | `Tuples.Head` |
| 末尾要素を取得 | `last(arr)` | — | `Tuples.Last` |
| 積集合 | `intersection / intersectionBy / intersectionWith` | — | `Tuples.Intersect<T>` |
| fn 結果をキーに Record 化 | `keyBy(arr, fn)` | — | `Tuples.GroupBy` |
| fn で最大要素を取得 | `maxBy(arr, fn)` | — | `Tuples.Max` |
| fn で最小要素を取得 | `minBy(arr, fn)` | — | `Tuples.Min` |
| 複数キーでソート | `orderBy / sortBy` | — | `Tuples.Sort` |
| 述語で 2 分割 | `partition(arr, pred)` | — | `Tuples.Partition<Fn>` |
| ランダムに 1 要素 | `sample(arr)` | — | — |
| ランダムに N 要素 | `sampleSize(arr, n)` | — | — |
| シャッフル | `shuffle(arr)` | — | — |
| 先頭 N 要素を取得 | `take(arr, n)` | — | `Tuples.Take<N>` |
| 末尾 N 要素を取得 | `takeRight(arr, n)` | — | — |
| 条件を満たす間取得 | `takeWhile / takeRightWhile` | — | `Tuples.TakeWhile<Fn>` |
| 和集合（重複除去） | `union / unionBy / unionWith` | — | — |
| 重複除去 | `uniq / uniqBy / uniqWith` | — | `Tuples.Uniq` |
| zip の逆 | `unzip(arr)` | — | — |
| 対称差集合（XOR） | `xor / xorBy / xorWith` | — | — |
| 2 配列をペアに | `zip(a, b)` | — | `Tuples.Zip<T>` |
| keys + values から Record | `zipObject(keys, vals)` | — | — |
| スライディングウィンドウ | `windowed(arr, size)` | — | — |
| 出現数カウント | `countBy(arr, fn)` | — | `Tuples.GroupBy<Fn>` |
| 配列の末尾を除いた部分 | `initial(arr)` | `ArraySlice<T, 0, -1>` | `Tuples.Init` |
| 部分集合チェック | `isSubset(a, b)` | — | — |
| タプル → union 型 | — | `TupleToUnion<T>` | `Tuples.ToUnion` |
| union → タプル型 | — | `UnionToTuple<U>` | `Unions.ToTuple` |
| 配列の要素型を取得 | — | `ArrayElement<T>` | — |
| 配列の最後の要素型 | — | `LastArrayElement<T>` | `Tuples.Last` |
| 固定長配列型 | — | `FixedLengthArray<T, N>` | — |
| タプルの長さ（型） | — | `ArrayLength<T>` | `Tuples.Length` |
| タプルを逆順に（型） | — | `ArrayReverse<T>` | `Tuples.Reverse` |

---

## オブジェクト操作

| やりたいこと | es-toolkit (runtime) | type-fest (型のみ) | hotscript (型 DSL) |
| --- | --- | --- | --- |
| 浅いコピー | `clone(obj)` | — | — |
| 深いコピー | `cloneDeep(obj)` | — | — |
| 指定キーを除外 | `omit(obj, keys)` | `Except<T, K>` | `Objects.Omit<K>` |
| 述語でキーを除外 | `omitBy(obj, pred)` | `ConditionalExcept<T, V>` | `Objects.OmitBy<Fn>` |
| 指定キーのみ抽出 | `pick(obj, keys)` | `Pick<T, K>` (built-in) | `Objects.Pick<K>` |
| 述語でキーを抽出 | `pickBy(obj, pred)` | `ConditionalPick<T, V>` | `Objects.PickBy<Fn>` |
| 深い結合（破壊的） | `merge(obj, src)` | — | `Objects.Merge<T>` |
| 深い結合（非破壊） | `toMerged(obj, src)` | `MergeDeep<A, B>` | `Objects.Merge<T>` |
| key↔value を反転 | `invert(obj)` | — | — |
| キーを変換 | `mapKeys(obj, fn)` | — | `Objects.MapKeys<Fn>` |
| 値を変換 | `mapValues(obj, fn)` | — | `Objects.MapValues<Fn>` |
| ネストをドット区切りに平坦化 | `flattenObject(obj)` | — | — |
| 条件を満たす最初のキー | `findKey(obj, pred)` | `ConditionalKeys<T, V>` | — |
| 型レベルでキー抽出 | — | `PickDeep<T, Path>` | `Objects.Pick<K>` |
| 型レベルでキー除外 | — | `OmitDeep<T, Path>` | `Objects.Omit<K>` |
| ネストした型にアクセス | — | `Get<T, 'a.b.c'>` | `Objects.Get<K>` |
| オブジェクトの全パス | — | `Paths<T>` | — |
| 値の union 型 | — | `ValueOf<T>` | `Objects.Values` |
| キーの union 型 | — | `keyof T` (built-in) | `Objects.Keys` |
| エントリの型 | — | `Entries<T>` | `Objects.Entries` |
| intersection に変換 | — | `UnionToIntersection<U>` | `Objects.Intersect<T>` |
| deep readonly に | — | `ReadonlyDeep<T>` | `Objects.DeepReadonly` |
| deep partial に | — | `PartialDeep<T>` | `Objects.DeepPartial` |
| deep required に | — | `RequiredDeep<T>` | `Objects.DeepRequired` |
| 特定キーを optional に | — | `SetOptional<T, K>` | — |
| 特定キーを required に | — | `SetRequired<T, K>` | — |
| 特定キーを readonly に | — | `SetReadonly<T, K>` | — |
| 指定キーの型を変更 | — | `SetFieldType<T, K, V>` | `Objects.Update<K, Fn>` |
| index signature を除去 | — | `OmitIndexSignature<T>` | — |
| 全値を別の型に変換 | — | `Schema<T, V>` | `Objects.MapValues<Fn>` |
| Simplify（交差型を展開） | — | `Simplify<T>` | — |
| オブジェクト結合 | — | `Merge<A, B>` | `Objects.Assign` |
| 1 key だけ必須に | — | `RequireAtLeastOne<T, K>` | — |
| ちょうど 1 key を必須に | — | `RequireExactlyOne<T, K>` | — |
| 非空オブジェクトに制約 | — | `NonEmptyObject<T>` | — |

---

## ケース変換（文字列 / キー）

| やりたいこと | es-toolkit (runtime) | type-fest (型のみ) | hotscript (型 DSL) |
| --- | --- | --- | --- |
| 文字列を camelCase に | `camelCase(str)` | `CamelCase<S>` | `Strings.CamelCase` |
| オブジェクトの全キーを camelCase に | `toCamelCaseKeys(obj)` | `CamelCasedPropertiesDeep<T>` | `Objects.CamelCaseDeep` |
| 文字列を kebab-case に | `kebabCase(str)` | `KebabCase<S>` | `Strings.KebabCase` |
| オブジェクトの全キーを kebab-case に | — | `KebabCasedPropertiesDeep<T>` | `Objects.KebabCaseDeep` |
| 文字列を snake_case に | `snakeCase(str)` | `SnakeCase<S>` | `Strings.SnakeCase` |
| オブジェクトの全キーを snake_case に | `toSnakeCaseKeys(obj)` | `SnakeCasedPropertiesDeep<T>` | `Objects.SnakeCaseDeep` |
| 文字列を PascalCase に | `pascalCase(str)` | `PascalCase<S>` | `Strings.PascalCase` |
| オブジェクトの全キーを PascalCase に | — | `PascalCasedPropertiesDeep<T>` | `Objects.PascalCaseDeep` |
| 文字列を CONSTANT_CASE に | `constantCase(str)` | `ScreamingSnakeCase<S>` | `Strings.ConstantCase` |
| 文字列を先頭大文字に | `capitalize(str)` | — | `Strings.Capitalize` |
| 文字列を全大文字に | — | `Uppercase<S>` (built-in) | `Strings.Uppercase` |
| 文字列を全小文字に | — | `Lowercase<S>` (built-in) | `Strings.Lowercase` |

---

## 関数制御

| やりたいこと | es-toolkit (runtime) | type-fest (型のみ) | hotscript (型 DSL) |
| --- | --- | --- | --- |
| 連続呼び出しを遅延 | `debounce(fn, wait)` | — | — |
| 一定期間に 1 回に制限 | `throttle(fn, wait)` | — | — |
| 結果をキャッシュ | `memoize(fn, resolver?)` | — | — |
| カリー化 | `curry(fn)` | — | — |
| 部分適用（左から） | `partial(fn, ...args)` | — | — |
| 関数を左から合成 | `flow(fns)` | — | `ComposeLeft<[Fn1, Fn2]>` |
| 関数を右から合成 | `flowRight(fns)` | — | `Compose<[Fn1, Fn2]>` |
| 1 度だけ実行 | `once(fn)` | — | — |
| N 回目以降で実行 | `after(n, fn)` | — | — |
| N 回未満のみ実行 | `before(n, fn)` | — | — |
| 述語を反転 | `negate(pred)` | — | — |
| 関数の戻り値型を変更（型） | — | `SetReturnType<T, R>` | `Functions.MapReturnType<Fn>` |
| 関数の引数型を変更（型） | — | `SetParameterType<T, N, P>` | `Functions.MapParameters<Fn>` |
| 関数の戻り値型を取得（型） | — | `ReturnType<T>` (built-in) | `Functions.ReturnType` |
| 関数の引数型を取得（型） | — | `Parameters<T>` (built-in) | `Functions.Parameters` |
| async 関数の戻り値型 | — | `AsyncReturnType<T>` | — |
| 関数型を async 化 | — | `Asyncify<T>` | — |
| 失敗時にリトライ | `retry(fn, opts)` | — | — |

---

## 非同期処理

| やりたいこと | es-toolkit (runtime) | type-fest (型のみ) | hotscript (型 DSL) |
| --- | --- | --- | --- |
| N ms 待機 | `delay(ms)` | — | — |
| タイムアウト付き Promise | `withTimeout(promise, ms)` | — | — |
| 排他制御 | `new Mutex()` | — | — |
| 同時実行数制限 | `new Semaphore(n)` | — | — |
| 配列を async で map | `mapAsync(arr, fn)` | — | — |
| 配列を async で filter | `filterAsync(arr, fn)` | — | — |
| 配列を async で reduce | `reduceAsync(arr, fn, init)` | — | — |
| Promise か T を受け取る型 | — | `Promisable<T>` | — |
| JSON シリアライズ後の型 | — | `Jsonify<T>` | — |

---

## 型ガード / 型述語

| やりたいこと | es-toolkit (runtime) | type-fest (型のみ) | hotscript (型 DSL) |
| --- | --- | --- | --- |
| 文字列か確認 | `isString(val)` | `IsStringLiteral<T>` | — |
| 数値か確認 | `isNumber(val)` | `IsNumericLiteral<T>` | — |
| null か確認 | `isNull(val)` | `IsNull<T>` | — |
| undefined か確認 | `isUndefined(val)` | `IsUndefined<T>` | — |
| null / undefined か | `isNil(val)` | — | — |
| 等価チェック（深い） | `isEqual(a, b)` | — | — |
| 型レベル等価チェック | — | `IsEqual<A, B>` | `Booleans.Equals<A>` |
| `any` か確認（型） | — | `IsAny<T>` | — |
| `never` か確認（型） | — | `IsNever<T>` | — |
| union か確認（型） | — | `IsUnion<T>` | — |
| リテラル型か確認（型） | — | `IsLiteral<T>` | — |
| 補完が効く literal union | — | `LiteralUnion<T, Base>` | — |
| optional か確認（型） | — | `IsOptional<T>` | — |
| サブタイプチェック（型） | — | `ExtendsStrict<T, U>` | `Booleans.Extends<T>` |

---

## ブランド型 / Nominal

| やりたいこと | es-toolkit | type-fest | hotscript |
| --- | --- | --- | --- |
| 同じ primitive に tag を付ける | — | `Tagged<T, Tag>` | — |
| tag を除去 | — | `UnwrapTagged<T>` | — |
| discriminant key で union を定義 | — | `TaggedUnion<K, M>` | — |

---

## 文字列操作

| やりたいこと | es-toolkit (runtime) | type-fest (型のみ) | hotscript (型 DSL) |
| --- | --- | --- | --- |
| アクセント除去 | `deburr(str)` | — | — |
| HTML エスケープ | `escape(str)` | — | — |
| HTML アンエスケープ | `unescape(str)` | — | — |
| 正規表現エスケープ | `escapeRegExp(str)` | — | — |
| 単語分割 | `words(str)` | `Words<S>` | `Strings.Words` |
| パディング | `pad(str, len, char?)` | — | — |
| トリム | `trim / trimEnd / trimStart` | `Trim<S>` | `Strings.Trim` |
| 文字列逆順 | `reverseString(str)` | — | `Strings.Reverse` |
| 文字列分割（型） | — | `Split<S, Sep>` | `Strings.Split<Sep>` |
| 文字列置換（型） | — | `Replace<S, F, T>` | `Strings.Replace<F, T>` |
| 文字列繰り返し（型） | — | `StringRepeat<S, N>` | `Strings.Repeat<N>` |
| プレフィックス除去（型） | — | `RemovePrefix<S, P>` | `Strings.RemovePrefix<P>` |
| 文字列スライス（型） | — | `StringSlice<S, Start, End>` | `Strings.Slice<Start, End>` |

---

## 数値・算術

| やりたいこと | es-toolkit (runtime) | type-fest (型のみ) | hotscript (型 DSL) |
| --- | --- | --- | --- |
| 最小〜最大に収める | `clamp(n, min, max)` | — | — |
| 範囲内か確認 | `inRange(n, start, end)` | — | `Numbers.GreaterThanOrEqual / LessThan` |
| 平均 | `mean / meanBy` | — | — |
| 中央値 | `median / medianBy` | — | — |
| 合計 | `sum / sumBy` | — | `Tuples.Sum` |
| 乱数 | `random / randomInt` | — | — |
| 数列生成 | `range / rangeRight` | — | `Tuples.Range<Start, End>` |
| 丸め | `round(n, precision)` | — | — |
| 型レベル整数範囲 | — | `IntRange<F, T>` | — |
| 型レベル加算 | — | `Sum<A, B>` | `Numbers.Add<N>` |
| 型レベル減算 | — | `Subtract<A, B>` | `Numbers.Subtract<N>` |
| 型レベル比較 | — | `GreaterThan<A, B>` | `Numbers.GreaterThan<N>` |

---

## JSON / シリアライゼーション

| やりたいこと | es-toolkit | type-fest | hotscript |
| --- | --- | --- | --- |
| JSON シリアライズ後の型 | — | `Jsonify<T>` | — |
| JSON に変換可能か検証 | — | `Jsonifiable` | — |
| JSON の型定義 | — | `JsonValue / JsonObject / JsonArray / JsonPrimitive` | — |
| package.json の型 | — | `PackageJson` | — |
| tsconfig.json の型 | — | `TsConfigJson` | — |

---

## Union 型の操作

| やりたいこと | es-toolkit | type-fest | hotscript |
| --- | --- | --- | --- |
| union → intersection に変換 | — | `UnionToIntersection<U>` | `Unions.ToIntersection` |
| union の共通フィールドのみ | — | `SharedUnionFields<U>` | — |
| union の全フィールド（optional）| — | `AllUnionFields<U>` | — |
| union の各メンバーに型変換 | — | `DistributedOmit / DistributedPick` | `Unions.Map<Fn>` |
| union から型を抽出 | — | `Extract<T, U>` (built-in) | `Unions.Extract<T>` |
| union から型を除外 | — | `Exclude<T, U>` (built-in) | `Unions.Exclude<T>` |
| union のメンバー数 | — | — | `Unions.Size` |

---

## エラー / Assert

| やりたいこと | es-toolkit | type-fest | hotscript |
| --- | --- | --- | --- |
| 条件が false なら例外 | `assert(cond, msg)` | — | — |
| 条件が false なら InvariantError | `invariant(cond, msg)` | — | — |
| 例外を Result 形式で捕捉 | `attempt(fn)` | — | — |
| タイムアウトエラー型 | `TimeoutError` | — | — |
| 中断エラー型 | `AbortError` | — | — |
