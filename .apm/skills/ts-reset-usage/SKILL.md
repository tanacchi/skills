---
name: ts-reset-usage
description: Use this skill when adopting, configuring, or auditing @total-typescript/ts-reset in a TypeScript project — deciding whether to apply it (app vs library), wiring reset.d.ts, choosing recommended vs a-la-carte rules (json-parse, fetch, filter-boolean, is-array, array-includes/index-of, set-has, map-has, storage, dom, promise-catch, map-groupby, object-groupby, clone-node, map-constructor, recommended), and avoiding global-scope leakage. Trigger when code uses JSON.parse / fetch().json() / .filter(Boolean) / Array.isArray and the result is any, or when reset.d.ts is being added/modified, or when the user asks about ts-reset. Carries an embedded compact catalog with a snapshot date; verify via plugin:context7 before relying on bleeding-edge rules and request a /en-skill refresh on drift.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: TypeScript 4.1+ project. tsconfig moduleResolution NodeNext / Node16 / Bundler when using a-la-carte imports. plugin:context7 recommended for catalog freshness checks.
---

# ts-reset-usage

`@total-typescript/ts-reset` の導入判断・setup・rule 選択・self-maintenance を一貫して扱うための skill。rule カタログをスナップショットとして内蔵し、必要時に context7 で freshness を検証する。

## 利用タイミング

- `@total-typescript/ts-reset` を新規プロジェクトに導入する、または既存 `reset.d.ts` を変更するとき
- `JSON.parse` / `fetch().json()` / `.filter(Boolean)` / `Array.isArray` の戻り値が `any` になっていてバグの温床になっているとき
- 既存のコードで `.filter(Boolean)` 後に型が絞り込まれない、readonly 配列で `.includes()` がエラーになるなど、標準型定義の制限にぶつかったとき
- app か library かの判断が必要なとき（library への誤った組み込みを防ぐ）
- `recommended` バンドルから a-la-carte 形式への切り替えを検討するとき
- ユーザーが ts-reset について質問したとき

## 確認する入力

- TypeScript バージョン（`pnpm exec tsc --version` 等で確認）
- project の種別: **app**（アプリケーション本体）/ **library**（npm publish する package）/ **monorepo 内の package** のいずれか
- 既存 `reset.d.ts` の有無とその内容
- `tsconfig.json` の `moduleResolution` 設定（a-la-carte import に NodeNext / Node16 / Bundler が必要）
- test 用 `tsconfig` が別に存在するか（`reset.d.ts` の `include` 漏れが発生しやすい）

## Workflow

1. **症状から rule を引く**
   `references/use-cases.md` で症状 → 推奨 rule を確認し、候補を 1 つ以上ピックする。
   - 例: `fetch().json()` が `any` → `fetch` rule
   - 例: `.filter(Boolean)` で narrowing が効かない → `filter-boolean` rule

2. **rule カタログで詳細確認**
   `references/rules-catalog.md` の表で、候補 rule の個別 import path・`recommended` 同梱可否・副作用範囲・Before/After を確認する。
   - **freshness check が必要なとき**: 新規 rule を使う、`recommended` 同梱内容に依存する、catalog の Snapshot 日付から半年以上経過している場合は context7 で最新 docs と照合する。差分があったら `references/caveats-and-maintenance.md` の Self-maintenance loop に従ってユーザーに `/en-skill` 更新を提案する。

3. **setup と適用範囲を決定する**
   `references/setup-and-config.md` を参照し、`reset.d.ts` の配置・`tsconfig.json` の `include` 整合・`moduleResolution` 要件・monorepo での per-package 配置・a-la-carte vs `recommended` の判断軸を確認する。

4. **落とし穴と self-maintenance を確認する**
   `references/caveats-and-maintenance.md` で library 不可の理由・対象外領域・stale 検知時の更新フローを確認する。

## Output Format

- 適用する rule 一覧（entry 名・import path）
- `reset.d.ts` の配置先と内容（全部入り / `recommended` / a-la-carte のどのパターンか）
- 影響範囲（global scope 変更の説明）
- catalog Snapshot 日付と、context7 で freshness check を実施したか否か
- 残課題（対応できなかった型の問題、対象外領域など）
- stale 検知時は更新提案を出力に含める

## Guardrails

- **rule カタログは snapshot**。bleeding-edge な rule に乗る時、`recommended` の同梱に依存する時、Snapshot から半年以上経過した skill を使う時は context7 で再確認する
- context7 の結果と catalog で差分が出たら適用を止め、ユーザーに `/en-skill` で本 skill の更新を依頼する（依頼文テンプレは `references/caveats-and-maintenance.md`）
- **library として publish する package には絶対に入れない**。`type-only import` でも global scope が汚染される
- `reset.d.ts` を `tsconfig.json` の `include` から外さない（test 用 tsconfig で漏れがち）
- `Object.keys` / `Object.entries` は ts-reset の対象外。zod / type guard / `as const satisfies` で対応し、`as` で誤魔化さない（`typescript-strict-typing` skill 参照）
- secrets / 絶対パスを skill 本文に書かない

## Related References

- `references/use-cases.md` — 症状 → rule の即引きマッピング（Workflow step 1）
- `references/rules-catalog.md` — 全 entry point の compact スナップショット表 + freshness check 手順（Workflow step 2）
- `references/setup-and-config.md` — install・reset.d.ts 配置・tsconfig 整合・monorepo 対応（Workflow step 3）
- `references/caveats-and-maintenance.md` — 落とし穴・対象外領域・自己更新フロー（Workflow step 4）
- 関連 skill: `typescript-strict-typing` — `unknown` 化後の type assertion 禁止・zod / type guard による narrow 方針
- 関連 skill: `en-skill` — 本 skill 自体の更新を依頼する際に使用
