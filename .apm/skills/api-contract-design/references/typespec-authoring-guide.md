# TypeSpec 作成ガイド

## 概要

TypeSpec（`.tsp`）は API コントラクトを型安全に定義し、OpenAPI 等を自動生成するための DSL。
OpenAPI YAML の直接編集は禁止し、TypeSpec を source of truth とする。

## 推奨ファイル構成

```text
specs/
├── main.tsp              # import と namespace の集約エントリ
├── models/
│   └── {resource}.tsp    # データモデル定義
├── operations/
│   └── {feature}.tsp     # API 操作定義
├── shared_traits.tsp     # 認可・共通デコレータ / trait
└── examples/
    └── {resource}.tsp    # @example / @opExample を集約
docs/api/
├── openapi.yaml          # 生成成果物（手編集禁止）
└── openapi.json
```

## 主要要素チートシート

### import / using

```ts
import "@typespec/http";
using Http;
```

`import` は外部パッケージ読み込み、`using` でその機能を短く使えるようにする。

### namespace（バージョニング）

```ts
namespace MyService.V1 {
  // ...
}
```

URL バージョン（`/v1/`）と namespace バージョンを一致させる。

### scalar（意味を持たせた基本型）

```ts
scalar UtcDateTime is string;  // UTC 日時であることを意図として明示
```

### model（データ構造）

```ts
model ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

model PaginatedResult<T> {
  items: T[];
  totalCount: int32;
  continuationToken?: string;
}

model Item extends BaseEntity {
  name: string;
  status: "active" | "archived";
}
```

- 共通フィールドは継承（`extends`）で DRY に保つ。
- 成功/失敗は `union` で返す: `Item | ErrorResponse`

### operation（エンドポイント）

```ts
@doc("アイテムを取得する")
@opExample(
  { parameters: #{ id: "item-1" }, returnType: #{ id: "item-1", name: "Widget" } },
  title: "取得例"
)
operation getItem(id: string): Item | ErrorResponse;
```

### trait（共通認可ルール）

```ts
@trait
decorator requireAuth() { /* 実装側で検証 */ }

@requireAuth()
operation listItems(): Item[] | ErrorResponse;
```

## OpenAPI 生成コマンド

```bash
# 標準生成
tsp compile specs/main.tsp --emit @typespec/openapi3

# 出力先指定
tsp compile specs/main.tsp --emit @typespec/openapi3 --output-dir docs/api
```

**重要**: プロジェクトによって `package.json` の scripts に独自コマンドが定義されている場合がある。
必ず `package.json` を確認してからコマンドを実行すること。

## Git 管理方針

| 対象 | 管理方針 |
| :--- | :--- |
| `specs/` | コミット必須（source of truth） |
| `docs/api/openapi.yaml` | コミット必須（生成成果物・差分検出用） |
| `tsp-output/` | `.gitignore` で除外 |

## CI での破壊的変更検出

```bash
# 生成前後の diff を確認
git diff docs/api/openapi.yaml
```

- `@opExample` を全 operation に必須化し、CI でチェックする。
- example がモデルと不一致なら警告を投げるパイプラインを整備する。
- OpenAPI 生成結果を前回コミットと比較し、破壊的変更（フィールド削除・型変更）を早期検出する。

## よくある誤りと対処

| 問題 | 対処 |
| :--- | :--- |
| `@example` が生成に反映されない | 例の型がモデル定義と一致しているか確認する |
| 名前空間で型が衝突する | フルネーム指定か `using` の範囲を確認する |
| OpenAPI diff が大きすぎる | 生成前に `tsp format` を実行し、フォーマット差分を除去する |

## 公式ドキュメント

- 公式サイト: https://typespec.io/
- Getting Started: https://typespec.io/docs/getting-started
- REST API 定義: https://typespec.io/docs/libraries/rest
- OpenAPI 生成: https://typespec.io/docs/emitters/openapi3
