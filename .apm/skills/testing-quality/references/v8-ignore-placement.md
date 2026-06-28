# v8 coverage の `/* v8 ignore */` 位置ルール

Vitest + v8 coverage では、`/* v8 ignore next N */` コメントの **位置** が
ブランチカバレッジ除外の対象を決定する。位置を間違えると coverage 除外が効かない。

## 基本ルール

`/* v8 ignore next N */` は「次の N 行」を除外する。
コメントを書いた行の次の行から N 行がスコープになる。

## exhaustive default switch の正解パターン

```ts
// OK: default: の直前行にコメントを置く → ブロック全体が除外される
switch (action.type) {
  case 'COLLECT_ITEM':
    return resolveCollectItem(action.itemId, state.world);
  /* v8 ignore next 3 */
  default: {
    const _exhaustive: never = action;
    return _exhaustive;
  }
}
```

```ts
// NG: ブロック内に置くと default: 行が除外されない (カバレッジ計測対象のまま)
switch (action.type) {
  case 'COLLECT_ITEM':
    return resolveCollectItem(action.itemId, state.world);
  default: {
    /* v8 ignore next 3 */  // ← ここに置いても default: 行は除外されない
    const _exhaustive: never = action;
    return _exhaustive;
  }
}
```

## 実証: NG パターンの症状

NG パターンでは `default:` の行だけがカバレッジ上で「未実行」として残る。
coverage report に `default: {` が赤くなる状態がこれ。
exhaustive check のために意図的に dead code にしているため、除外が必要。

## インライン ignore (1 行の場合)

```ts
// 1 行の三項演算子は "next 1" の代わりにインライン形式が使いやすい
transition={{ duration: /* v8 ignore next */ reduceMotion ? 0 : 0.15 }}
```

ただし `/* v8 ignore next */` の省略形 (N を書かない) は「次の 1 行」の意。
複数行にまたがる場合は `/* v8 ignore next 3 */` のように N を明示する。

## カバレッジ目標との関係

escape リポジトリでは `lines/functions/branches/statements 全て 95%` が必須 (`CLAUDE.md`)。
exhaustive switch の dead code branch はゲームの全 action type を網羅するのに必要なため、
除外は正当。skip や削除で逃げず、v8 ignore で正確に除外する。

## 参考: なぜ `/* v8 ignore */` が必要か

TypeScript の exhaustive check は:
```ts
const _exhaustive: never = action; // never 型への代入で型チェック
return _exhaustive;                 // ランタイムでは絶対到達しない
```
`never` 型なので実行時に到達できないが、
JavaScript レベルでは実行可能なコードとして存在するため v8 がカバレッジ未達とみなす。
