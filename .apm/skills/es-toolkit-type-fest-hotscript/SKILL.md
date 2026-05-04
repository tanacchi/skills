---
name: es-toolkit-type-fest-hotscript
description: Use this skill during TypeScript refactoring or new code review to discover existing utilities in es-toolkit (runtime), type-fest (type-level utilities), and hotscript (type-level FP DSL) before reimplementing. Triggers on lodash imports, hand-rolled DeepPartial / CamelCase / PartialDeep / IsEqual style types, complex mapped or conditional types, requests like "lodash を置き換えたい" / "型レベルで書きたい" / "this utility type already exists?". Always reverse-lookup catalog before writing custom code.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: TypeScript >= 5.0. es-toolkit / type-fest / hotscript are optional and added per usage.
---

# es-toolkit-type-fest-hotscript

TypeScript の refactoring や新規実装で、自前ユーティリティを書く前に以下 3 ライブラリの既存定義を発見・活用するための skill。

| ライブラリ | 責務 | 追加コスト |
| --- | --- | --- |
| **es-toolkit** | runtime ユーティリティ（lodash の後継） | runtime bundle に含まれる |
| **type-fest** | 型レベルユーティリティ集 | 型のみ・bundle ゼロ |
| **hotscript** | 型レベル関数型 DSL (`Pipe` / `Compose`) | 型のみ・bundle ゼロ |

## 利用タイミング

- `lodash` / `underscore` の import を見つけたとき（es-toolkit への置き換え候補）
- `DeepPartial<T>` / `DeepReadonly<T>` / `CamelCase<S>` のような utility type を手書きしようとしたとき
- 複雑な mapped type / conditional type の連鎖を型 DSL で整理できるか検討するとき
- `typeof` / `keyof` / `as const` では取れない型変換で型レベル計算が必要なとき
- 既存コードの "手書きユーティリティ" を標準実装で置き換えられないか確認するとき

## 確認する入力

- 対象ファイルまたはコード片
- `package.json` での導入状況（3 ライブラリが dep / devDep に入っているか）
- TypeScript version（`pnpm exec tsc --version`）
- lodash 等既存 dep の有無

## Workflow

1. **Freshness check（必須・最初に実行）**
   `references/freshness-check.md` を読んでプロトコルを実行する。catalog バージョンと最新版に差分があれば `en-skill` で更新を提案し、catalog 更新後に手順 2 へ。

2. **逆引き（最初に参照するファイル）**
   `references/reverse-index.md` を開き、「やりたい操作」の意図カテゴリから該当行を探す。3 ライブラリ横断の 1 表で検索できる。

3. **詳細確認**
   逆引き結果が指す `references/{library}-catalog.md` の該当カテゴリで signature・import path・使用例を確認する。

4. **採用判断**
   以下の観点を確認してユーザに提示する：
   - **bundle 影響**：es-toolkit は runtime に含まれる。type-fest / hotscript は型のみ。
   - **既存 dep**：`package.json` にすでに入っているか。追加なら impact を説明する。
   - **compat vs 通常 entry**：es-toolkit の `compat` は lodash 互換層。新規利用には通常 entry を推奨。

5. **置換 diff 提案**
   `typescript-strict-typing` の規則を併用し、提案コードに `as` キャストを増やさない。

## Output Format

```
| 現状コード | 提案差分 | 採用ライブラリ | 理由 |
| --- | --- | --- | --- |
| custom deepPartial<T> | import { PartialDeep } from 'type-fest' | type-fest | bundle ゼロ、型のみ、既存実装と完全等価 |
```

- import 文の追加差分も必ず含める
- bundle 影響がある場合は「追加サイズ目安」を付記する

## Guardrails

- **再実装より catalog 優先**。既存定義がある場合は catalog へのリンクと理由を示して採用を提案する。
- **hotscript の大規模 Pipe** は TypeScript の compile time に影響しうる。20 段超の Pipe は事前にコンパイル時間を計測するよう注意書きをつける。
- **`compat` は移行用**。`es-toolkit/compat` は既存 lodash コードとの互換のために存在し、新規に書くコードには通常 entry（`es-toolkit/array` 等）を使う。
- **catalog に該当が見つからない = skill が古い**。`freshness-check.md` を再実行し、必要なら `en-skill` で catalog を拡張する。
- **`as` キャストを増やさない**。ライブラリの型定義で解決できない場合は `typescript-strict-typing` の代替手順を参照する。

## Related References

- `references/reverse-index.md` — 意図→ライブラリ 横断逆引き表（最初に参照）
- `references/es-toolkit-catalog.md` — es-toolkit 全カテゴリ catalog
- `references/type-fest-catalog.md` — type-fest 全カテゴリ catalog
- `references/hotscript-catalog.md` — hotscript 全モジュール catalog
- `references/freshness-check.md` — 起動時の freshness check プロトコル
- `typescript-strict-typing` skill — `as` 禁止・strict 型運用との連携
