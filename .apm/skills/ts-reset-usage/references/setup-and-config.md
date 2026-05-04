# ts-reset Setup & Configuration

## Install

```bash
npm i -D @total-typescript/ts-reset
# or
pnpm add -D @total-typescript/ts-reset
```

## reset.d.ts の作成パターン

プロジェクト root（または `src/` 直下）に `reset.d.ts` を置き、適用したい rule を import する。

### パターン A: 全 recommended rule を一括有効化

```typescript
// reset.d.ts
import "@total-typescript/ts-reset";
```

### パターン B: recommended バンドルを明示 import

```typescript
// reset.d.ts
import "@total-typescript/ts-reset/recommended";
```

### パターン C: a-la-carte（個別 rule を選択）

```typescript
// reset.d.ts
import "@total-typescript/ts-reset/json-parse";
import "@total-typescript/ts-reset/fetch";
import "@total-typescript/ts-reset/filter-boolean";
```

### パターン D: recommended + DOM rule を追加

```typescript
// reset.d.ts
import "@total-typescript/ts-reset";        // 非 DOM rule 一括
import "@total-typescript/ts-reset/dom";    // storage / clone-node 等 DOM rule を追加
```

## tsconfig.json の設定

### `moduleResolution` (a-la-carte 使用時に必須)

a-la-carte import (`@total-typescript/ts-reset/json-parse` のような deep import) を使う場合、`tsconfig.json` に以下のいずれかが必要:

```json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext"
  }
}
```

`Node16` / `Bundler` でも可。`Node` (旧来) や `Classic` では deep import が解決されない。

### `include` に reset.d.ts を含める

```json
{
  "include": ["src", "reset.d.ts"]
}
```

`reset.d.ts` が `include` に含まれていないと、コンパイラが型定義を読まず ts-reset の効果が出ない。

## test 用 tsconfig の漏れ対策

Vitest / Jest 等の test 専用 `tsconfig.test.json` を持つ場合、そちらにも `reset.d.ts` を含める。

```json
{
  "extends": "./tsconfig.json",
  "include": ["src", "reset.d.ts", "test"]
}
```

test tsconfig で漏れると、テスト内だけ型が古い挙動になり、型エラーを見落とすリスクがある。

## monorepo (pnpm workspace 等) での per-package 配置

- `@total-typescript/ts-reset` は **各 package で個別 install** する（root install だけでは機能しない場合がある）
- 各 package の `tsconfig.json` に `reset.d.ts` を置き、その package のファイルだけに効果を閉じる
- library package では install **しない**（`caveats-and-maintenance.md` 参照）

## a-la-carte vs recommended の選択基準

| 条件 | 推奨パターン |
|------|------------|
| app で全体的に型安全を高めたい | パターン A (recommended 一括) |
| DOM を使うアプリで `localStorage` 等も改善したい | パターン D (recommended + dom) |
| 特定の問題だけ解決したい / 影響範囲を絞りたい | パターン C (a-la-carte) |
| `moduleResolution` が `Node` (旧来) で変更できない | パターン A のみ使用可 |

## 既存 reset.d.ts の差分適用手順

1. 現行 `reset.d.ts` の import 一覧を確認する
2. `references/rules-catalog.md` で各 rule の最新 import path を照合する
3. 追加したい rule があれば import を追加し、不要な rule があれば削除する
4. `pnpm typecheck`（または `tsc --noEmit`）を実行して型エラーがないか確認する
5. `unknown` 化によって既存コードが壊れた箇所は `caveats-and-maintenance.md` の移行手順で対応する
