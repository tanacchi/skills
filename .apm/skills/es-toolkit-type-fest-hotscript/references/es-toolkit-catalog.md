# es-toolkit catalog

lodash の後継 runtime ユーティリティ。Tree-shaking 完全対応、2〜3 倍高速、最大 97% 軽量。

> **import パスの選び方**
> - 通常: `import { fn } from 'es-toolkit'`（バレルエクスポート）
> - カテゴリ直接: `import { fn } from 'es-toolkit/array'`（bundle サイズ最小化）
> - lodash 互換層: `import { fn } from 'es-toolkit/compat'`（移行専用・新規利用非推奨）

---

## Array

| 関数名 | signature（概略） | 説明 | lodash 相当 |
| --- | --- | --- | --- |
| `chunk` | `chunk(arr, size)` | 配列を size ずつ分割 | `_.chunk` |
| `compact` | `compact(arr)` | falsy 値を除去し型からも除外 | `_.compact` |
| `difference` | `difference(a, b)` | a から b の要素を除いた配列 | `_.difference` |
| `differenceBy` | `differenceBy(a, b, fn)` | fn を適用した値で差集合 | `_.differenceBy` |
| `differenceWith` | `differenceWith(a, b, cmp)` | カスタム比較関数で差集合 | `_.differenceWith` |
| `drop` | `drop(arr, n)` | 先頭 n 要素を除いた配列 | `_.drop` |
| `dropRight` | `dropRight(arr, n)` | 末尾 n 要素を除いた配列 | `_.dropRight` |
| `dropWhile` | `dropWhile(arr, pred)` | pred が true の間先頭から除去 | `_.dropWhile` |
| `dropRightWhile` | `dropRightWhile(arr, pred)` | pred が true の間末尾から除去 | `_.dropRightWhile` |
| `fill` | `fill(arr, val, start?, end?)` | 指定範囲を val で埋める（破壊的） | `_.fill` |
| `flatMap` | `flatMap(arr, fn)` | map して 1 段 flatten | `_.flatMap` |
| `flatMapDeep` | `flatMapDeep(arr, fn)` | map して深く flatten | `_.flatMapDeep` |
| `flatten` | `flatten(arr)` | 1 段 flatten | `_.flatten` |
| `flattenDeep` | `flattenDeep(arr)` | 完全に flatten | `_.flattenDeep` |
| `groupBy` | `groupBy(arr, fn)` | fn の結果でグループ化 | `_.groupBy` |
| `head` | `head(arr)` | 先頭要素 | `_.head` |
| `initial` | `initial(arr)` | 末尾を除いた配列 | `_.initial` |
| `intersection` | `intersection(a, b)` | 積集合 | `_.intersection` |
| `intersectionBy` | `intersectionBy(a, b, fn)` | fn 適用後の積集合 | `_.intersectionBy` |
| `intersectionWith` | `intersectionWith(a, b, cmp)` | カスタム比較で積集合 | `_.intersectionWith` |
| `keyBy` | `keyBy(arr, fn)` | fn の結果をキーにした Record | `_.keyBy` |
| `last` | `last(arr)` | 末尾要素 | `_.last` |
| `maxBy` | `maxBy(arr, fn)` | fn の最大要素 | `_.maxBy` |
| `minBy` | `minBy(arr, fn)` | fn の最小要素 | `_.minBy` |
| `orderBy` | `orderBy(arr, keys, orders)` | 複数キーでソート | `_.orderBy` |
| `partition` | `partition(arr, pred)` | pred の true/false で 2 分割 | `_.partition` |
| `pull` | `pull(arr, ...vals)` | 値を取り除く（破壊的） | `_.pull` |
| `pullAt` | `pullAt(arr, idxs)` | インデックスで取り除く（破壊的） | `_.pullAt` |
| `remove` | `remove(arr, pred)` | pred が true の要素を取り除く（破壊的） | `_.remove` |
| `sample` | `sample(arr)` | ランダムに 1 要素 | `_.sample` |
| `sampleSize` | `sampleSize(arr, n)` | ランダムに n 要素 | `_.sampleSize` |
| `shuffle` | `shuffle(arr)` | シャッフル（新配列） | `_.shuffle` |
| `sortBy` | `sortBy(arr, fns[])` | 複数 fn でソート | `_.sortBy` |
| `tail` | `tail(arr)` | 先頭を除いた配列 | `_.tail` |
| `take` | `take(arr, n?)` | 先頭 n 要素（デフォルト 1） | `_.take` |
| `takeRight` | `takeRight(arr, n?)` | 末尾 n 要素 | `_.takeRight` |
| `takeWhile` | `takeWhile(arr, pred)` | pred が true の間先頭から取得 | `_.takeWhile` |
| `takeRightWhile` | `takeRightWhile(arr, pred)` | pred が true の間末尾から取得 | `_.takeRightWhile` |
| `union` | `union(a, b)` | 和集合（重複除去） | `_.union` |
| `unionBy` | `unionBy(a, b, fn)` | fn 適用後の和集合 | `_.unionBy` |
| `unionWith` | `unionWith(a, b, cmp)` | カスタム比較で和集合 | `_.unionWith` |
| `uniq` | `uniq(arr)` | 重複除去 | `_.uniq` |
| `uniqBy` | `uniqBy(arr, fn)` | fn 適用後に重複除去 | `_.uniqBy` |
| `uniqWith` | `uniqWith(arr, cmp)` | カスタム比較で重複除去 | `_.uniqWith` |
| `unzip` | `unzip(arr)` | zip の逆 | `_.unzip` |
| `windowed` | `windowed(arr, size, step?)` | スライディングウィンドウ | — |
| `without` | `without(arr, ...vals)` | 指定値を除いた新配列 | `_.without` |
| `xor` | `xor(a, b)` | 対称差集合 | `_.xor` |
| `zip` | `zip(a, b)` | 2 配列をタプル配列に | `_.zip` |
| `zipObject` | `zipObject(keys, vals)` | keys と vals から Record を生成 | `_.zipObject` |
| `countBy` | `countBy(arr, fn)` | fn 結果ごとの出現数 | `_.countBy` |
| `forEachRight` | `forEachRight(arr, fn)` | 末尾から forEach | `_.forEachRight` |
| `isSubset` | `isSubset(a, b)` | a が b の部分集合か | — |
| `toFilled` | `toFilled(arr, val, start?, end?)` | fill の非破壊版 | — |
| `at` | `at(arr, idxs)` | 複数インデックスで要素取得 | `_.at` |

**非同期バリアント**（async 版）: `filterAsync`, `flatMapAsync`, `forEachAsync`, `limitAsync`, `mapAsync`, `reduceAsync`

---

## Function

| 関数名 | signature（概略） | 説明 | lodash 相当 |
| --- | --- | --- | --- |
| `debounce` | `debounce(fn, wait, opts?)` | 連続呼び出しを遅延・間引き | `_.debounce` |
| `throttle` | `throttle(fn, wait, opts?)` | 一定期間に 1 回に制限 | `_.throttle` |
| `memoize` | `memoize(fn, resolver?)` | 結果をキャッシュ | `_.memoize` |
| `curry` | `curry(fn)` | カリー化 | `_.curry` |
| `curryRight` | `curryRight(fn)` | 右からカリー化 | `_.curryRight` |
| `partial` | `partial(fn, ...args)` | 部分適用（左から） | `_.partial` |
| `partialRight` | `partialRight(fn, ...args)` | 部分適用（右から） | `_.partialRight` |
| `flow` | `flow(fns[])` | 関数を左から合成 | `_.flow` |
| `flowRight` | `flowRight(fns[])` | 関数を右から合成（compose） | `_.flowRight` |
| `once` | `once(fn)` | 1 度だけ実行 | `_.once` |
| `before` | `before(n, fn)` | n 回未満のみ実行 | `_.before` |
| `after` | `after(n, fn)` | n 回目以降で実行 | `_.after` |
| `negate` | `negate(pred)` | 述語を反転 | `_.negate` |
| `ary` | `ary(fn, n)` | 引数を n 個に制限 | `_.ary` |
| `unary` | `unary(fn)` | 引数を 1 個に制限 | `_.unary` |
| `rest` | `rest(fn, start?)` | 残余引数を配列に変換 | `_.rest` |
| `spread` | `spread(fn, start?)` | 配列を引数に展開 | `_.spread` |
| `identity` | `identity(val)` | 受け取った値をそのまま返す | `_.identity` |
| `noop` | `noop()` | 何もしない関数 | `_.noop` |
| `asyncNoop` | `asyncNoop()` | 何もしない async 関数 | — |
| `retry` | `retry(fn, opts)` | 失敗時にリトライ | — |

---

## Math

| 関数名 | signature | 説明 | lodash 相当 |
| --- | --- | --- | --- |
| `clamp` | `clamp(n, min, max)` | min〜max に収める | `_.clamp` |
| `inRange` | `inRange(n, start, end)` | 範囲内かチェック | `_.inRange` |
| `mean` | `mean(arr)` | 平均 | `_.mean` |
| `meanBy` | `meanBy(arr, fn)` | fn 適用後の平均 | `_.meanBy` |
| `median` | `median(arr)` | 中央値 | — |
| `medianBy` | `medianBy(arr, fn)` | fn 適用後の中央値 | — |
| `random` | `random(min, max, floating?)` | 乱数 | `_.random` |
| `randomInt` | `randomInt(min, max)` | 整数乱数 | — |
| `range` | `range(start, end, step?)` | 数列生成 | `_.range` |
| `rangeRight` | `rangeRight(start, end, step?)` | 逆順数列 | `_.rangeRight` |
| `round` | `round(n, precision?)` | 丸め | `_.round` |
| `sum` | `sum(arr)` | 合計 | `_.sum` |
| `sumBy` | `sumBy(arr, fn)` | fn 適用後の合計 | `_.sumBy` |

---

## Object

| 関数名 | signature（概略） | 説明 | lodash 相当 |
| --- | --- | --- | --- |
| `clone` | `clone(obj)` | 浅いコピー | `_.clone` |
| `cloneDeep` | `cloneDeep(obj)` | 深いコピー | `_.cloneDeep` |
| `cloneDeepWith` | `cloneDeepWith(obj, customizer)` | カスタマイザ付き深いコピー | `_.cloneDeepWith` |
| `omit` | `omit(obj, keys[])` | 指定キーを除いたオブジェクト | `_.omit` |
| `omitBy` | `omitBy(obj, pred)` | pred が true のキーを除外 | `_.omitBy` |
| `pick` | `pick(obj, keys[])` | 指定キーのみ抽出 | `_.pick` |
| `pickBy` | `pickBy(obj, pred)` | pred が true のキーのみ抽出 | `_.pickBy` |
| `merge` | `merge(obj, ...sources)` | 深い結合（破壊的） | `_.merge` |
| `mergeWith` | `mergeWith(obj, src, customizer)` | カスタマイザ付き深い結合 | `_.mergeWith` |
| `toMerged` | `toMerged(obj, ...sources)` | 深い結合（非破壊） | — |
| `invert` | `invert(obj)` | key↔value を反転 | `_.invert` |
| `mapKeys` | `mapKeys(obj, fn)` | キーを変換 | `_.mapKeys` |
| `mapValues` | `mapValues(obj, fn)` | 値を変換 | `_.mapValues` |
| `flattenObject` | `flattenObject(obj)` | ネストをドット区切りに平坦化 | — |
| `findKey` | `findKey(obj, pred)` | pred が true の最初のキー | `_.findKey` |
| `toCamelCaseKeys` | `toCamelCaseKeys(obj)` | 全キーを camelCase に変換 | — |
| `toSnakeCaseKeys` | `toSnakeCaseKeys(obj)` | 全キーを snake_case に変換 | — |

---

## Predicate

主に型ガード関数。返り値は `x is T` 形式で型推論に利用できる。

```typescript
import { isString, isNil, isPlainObject } from 'es-toolkit/predicate';

const val: unknown = 'hello';
if (isString(val)) {
  val.toUpperCase(); // val: string
}
```

一覧: `isArrayBuffer`, `isBlob`, `isBoolean`, `isBrowser`, `isBuffer`, `isDate`, `isEmptyObject`, `isEqual`, `isEqualWith`, `isError`, `isFile`, `isFunction`, `isJSON`, `isJSONArray`, `isJSONObject`, `isJSONValue`, `isLength`, `isMap`, `isNil`, `isNode`, `isNotNil`, `isNull`, `isNumber`, `isPlainObject`, `isPrimitive`, `isPromise`, `isRegExp`, `isSet`, `isString`, `isSymbol`, `isTypedArray`, `isUndefined`, `isWeakMap`, `isWeakSet`

---

## Promise

| 関数名 | signature | 説明 |
| --- | --- | --- |
| `delay` | `delay(ms)` | ms ミリ秒待機する Promise | `_.delay` 相当 |
| `timeout` | `timeout(ms)` | ms 後に reject する Promise | — |
| `withTimeout` | `withTimeout(promise, ms)` | タイムアウト付きで Promise をラップ | — |
| `Mutex` | `new Mutex()` | 排他制御クラス | — |
| `Semaphore` | `new Semaphore(n)` | 同時実行数制限クラス | — |

---

## String

| 関数名 | 説明 | lodash 相当 |
| --- | --- | --- |
| `camelCase` | スペース/記号区切り → camelCase | `_.camelCase` |
| `kebabCase` | → kebab-case | `_.kebabCase` |
| `snakeCase` | → snake_case | `_.snakeCase` |
| `pascalCase` | → PascalCase | — |
| `constantCase` | → CONSTANT_CASE | — |
| `lowerCase` | → lower case（単語区切り） | `_.lowerCase` |
| `upperCase` | → UPPER CASE（単語区切り） | `_.upperCase` |
| `startCase` | → Start Case | `_.startCase` |
| `capitalize` | 先頭だけ大文字 | `_.capitalize` |
| `lowerFirst` | 先頭だけ小文字 | `_.lowerFirst` |
| `upperFirst` | 先頭だけ大文字 | `_.upperFirst` |
| `deburr` | アクセント記号を除去 | `_.deburr` |
| `escape` | HTML エスケープ | `_.escape` |
| `unescape` | HTML アンエスケープ | `_.unescape` |
| `escapeRegExp` | 正規表現エスケープ | `_.escapeRegExp` |
| `words` | 単語分割 | `_.words` |
| `pad` | 中央パディング | `_.pad` |
| `trim` / `trimEnd` / `trimStart` | トリム（カスタム文字も可） | `_.trim` 系 |
| `reverseString` | 文字列を逆順に | — |

---

## Utility

| 関数名 | 説明 |
| --- | --- |
| `assert` | 条件が false なら例外（型ガード付き） |
| `invariant` | 条件が false なら InvariantError |
| `attempt` | 例外を Result 形式で捕捉 |
| `attemptAsync` | async 版 attempt |

---

## Error

| クラス | 説明 |
| --- | --- |
| `AbortError` | abort signal 由来の中断エラー |
| `TimeoutError` | timeout 由来のエラー |

---

## Map / Set

`Map` と `Set` に対して配列と同様の操作を提供するユーティリティ。

**Map**: `countBy`, `every`, `filter`, `findKey`, `findValue`, `forEach`, `hasValue`, `keyBy`, `mapKeys`, `mapValues`, `reduce`, `some`

**Set**: `countBy`, `every`, `filter`, `find`, `forEach`, `keyBy`, `map`, `reduce`, `some`

---

## compat（lodash 互換層）

> **移行用途のみ。新規コードには通常 entry を使うこと。**

lodash API と完全互換（引数の型・挙動を含む）。既存 lodash コードを段階的に移行するための一時的な差し替え先として使う。

```typescript
import { chunk } from 'es-toolkit/compat'; // lodash 互換
import { chunk } from 'es-toolkit';         // 推奨（型が厳密）
```

主な追加カバレッジ：`_.get` / `_.set` / `_.has` / `_.invoke` / `_.template` / `_.chain` 等、通常 entry にない lodash API を含む。詳細は `context7: /toss/es-toolkit` の `compat` カテゴリを参照。

---

_Last verified: 2026-05-04 against es-toolkit@2.x (latest at time of authoring — run freshness-check.md Step 1 to confirm)_
