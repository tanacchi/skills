---
name: typescript-strict-typing
description: Use this skill whenever TypeScript code is added, modified, or reviewed — treat this as a default companion for all TypeScript work. Enforces strict type-safety at every step: prefers `as const` and `as const satisfies` for literal narrowing and shape validation; forbids ALL type assertions (`as any`, `as never`, `as unknown`, `as SpecificType`) with zero in-line exceptions — exceptions require a formal ADR. Recommends Vitest `expectTypeOf` tests when type inference is non-trivial. Triggers broadly on: editing `.ts` or `.tsx` files, designing types or generics, reviewing code that contains `as`, discriminated unions, conditional types, branded types, TypeScript version upgrades, or any question about "is this typed correctly". Always apply this skill when writing new TypeScript code, not just when there is an obvious type problem.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires TypeScript project with Vitest (for expectTypeOf). ESLint with @typescript-eslint recommended but not mandatory.
---

# typescript-strict-typing

TypeScript コードに対して、リテラル narrowing・`satisfies` による shape 検証・型推論テスト・型アサーション完全禁止を一貫して適用するための skill。

## 利用タイミング

- `.ts` / `.tsx` ファイルを新規作成・修正するとき
- `as any` / `as never` / `as unknown` / `as <型>` を含むコードをレビューするとき
- リテラル定数、設定オブジェクト、DU の variant tag を定義するとき（`as const` / `as const satisfies` の出番）
- generic 関数・conditional type・mapped type など複雑な型推論の正しさを保証したいとき（`expectTypeOf` の出番）
- TypeScript のバージョンアップを検討するとき（新 syntax で既存コードを簡素化できるか確認）
- 型設計や型エラーについて相談を受けたとき

## 確認する入力

- 対象ファイルまたはコード片
- TypeScript バージョン（`pnpm exec tsc --version` 等で確認）
- Vitest のセットアップ状況（型テストが書けるか）
- `tsconfig.json` の `strict` / `noUncheckedIndexedAccess` 等の設定状況
- ESLint に `@typescript-eslint/consistent-type-assertions` が設定されているか

## Workflow

1. **不正な `as` を検出する**
   ```bash
   # unsafe assertion を含む行を列挙
   rg "\bas (any|never|unknown|[A-Z][a-zA-Z]*)" --type ts -n
   ```
   さらに `noImplicitAny` が未設定なら暗黙 `any` も `rg ": any"` で確認する。

2. **リテラル・設定値を `as const` / `as const satisfies T` で置き換える**
   - 定数オブジェクト・配列 → `as const` で literal 型に freeze
   - 型契約が必要な設定・スキーマ → `as const satisfies T` で shape を検証しつつ literal を保持
   - 詳細なパターンは `references/strict-typing-patterns.md` を参照

3. **禁止 assertion を正しい代替に置き換える**
   - `as any` → `unknown` + 型ガード関数 / Zod parse
   - `as unknown as T` → Zod / valibot などで parse する（double assertion は使わない）
   - `as never` → `const _exhaustive: never = value` パターン（代入で exhaustive check）
   - `as <SpecificType>` → `satisfies T` / 型ガード関数 / generic 制約
   - 詳細は `references/forbidden-assertions.md` を参照

4. **複雑な型推論に `expectTypeOf` テストを追加する**
   - 対象: generic 戻り値推論・conditional type・DU narrowing・公開 API の型
   - `references/type-tests.md` の API 早見と判断基準を参照

5. **型チェックとテストを実行し、TS バージョンを確認する**
   ```bash
   pnpm typecheck && pnpm test   # または tsc --noEmit && vitest run
   ```
   TypeScript のバージョンが古い場合は最新版と比較し、新 syntax が使えるか提案する。
   確認手順は `references/typescript-version-tracking.md` を参照。

## Output Format

- 変更した箇所の一覧（ファイル名・行番号・変更前後）
- 追加した `expectTypeOf` テストの一覧と確認した型推論
- 残るリスクや型安全性が保証できない境界の明記
- 禁止 assertion を残す必要があると判断した場合は「ADR 起票が必要」と明記する（skill のスコープでは承認できない）

## Guardrails

- **`as any` / `as never` / `as unknown` / `as <SpecificType>` は完全禁止**。skill 内で ESLint disable コメントや `// @ts-ignore` による個別許可はしない。例外が必要な場合は ADR を起票してリポジトリ単位で承認する。
- **`as const` と `as const satisfies T` はこの禁止の対象外**。型 widening を防ぐためのリテラル freeze であり、type assertion（値キャスト）ではない。
- `// @ts-ignore` は禁止。`// @ts-expect-error <理由>` のみ許可（修正されたら自動でビルドエラーになる）。
- `expectTypeOf` の overuse を避ける。`const x: number = 1` のような自明な型はテスト不要。複雑な generic・conditional type・公開 API に絞る。
- TS バージョンの major 変更は ADR レベル。skill として強制せず「提案」にとどめる。
- `tsconfig.json` の `strict: true` が前提。緩い config に合わせて型安全性を妥協しない。

## Related References

- `references/strict-typing-patterns.md` — `as const` / `satisfies` / `as const satisfies` の使い分けとパターン集
- `references/forbidden-assertions.md` — 各 assertion の禁止理由と正しい代替
- `references/type-tests.md` — `expectTypeOf` 活用と `@ts-expect-error` との使い分け
- `references/typescript-version-tracking.md` — 最新版確認手順と upgrade 時 checklist
