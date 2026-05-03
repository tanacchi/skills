# typescript-version-tracking

TypeScript の最新版を把握し、必要に応じてプロジェクトへ追従するための手順。

---

## 現在のバージョン確認

```bash
# プロジェクトにインストールされている版
pnpm exec tsc --version          # または npx tsc --version

# npm registry 上の最新版
npm view typescript version

# リリース一覧（GitHub）
# https://github.com/microsoft/TypeScript/releases
```

---

## 追従頻度の目安

| リリース種別 | 目安 | 対応レベル |
| --- | --- | --- |
| patch (5.x.y) | 気づいたとき / 依存解決の副産物 | 自動 / passive |
| minor (5.x) | 気づいたとき（月 1〜2 回確認） | 提案して判断 |
| major (6.0) | ADR を起票してチームで検討 | 承認が必要 |

---

## Upgrade 時の checklist

### 1. Breaking Changes を確認する

```
https://github.com/microsoft/TypeScript/releases の "What's New" / "Breaking Changes"
```

確認項目:
- `strictNullChecks` / `noImplicitAny` の挙動変更
- 型推論の精度向上による既存コードへの影響（narrowing が厳しくなることがある）
- 削除・非推奨になった組み込み型や型ユーティリティ

### 2. `tsc --noEmit` で回帰確認

```bash
pnpm exec tsc --noEmit
```

新しい TS バージョンで型エラーが増える場合は内容を確認し、assertion で黙らせず根本修正する。

### 3. 新 syntax で既存コードを簡素化できるか確認

過去の主要な追加 syntax と、それで解決できるパターン:

| TS バージョン | 追加 syntax | このスキルとの関連 |
| --- | --- | --- |
| 4.9 | `satisfies` | `as` キャスト → `satisfies` に置き換えられる箇所を探す |
| 5.0 | `const` type parameter | 呼び出し側の `as const` を generic 側に吸収できる |
| 5.0 | `@satisfies` JSDoc tag | JS ファイルでも satisfies を使える |
| 5.5 | inferred type predicates | 型ガード関数の戻り値型を手書きしなくて良くなる |
| 5.7 | `import ... with` | アセット import の型安全化 |

最新の追加はリリースノートの "What's New" セクションを確認する。

### 4. `package.json` の peerDependencies / engines フィールドを更新

TypeScript をバージョン指定している箇所をすべて確認して更新する。

---

## 古いバージョンを長期間維持するリスク

- セキュリティ修正が含まれる場合がある（稀だが存在する）
- 新しい TS syntax を使うライブラリとの型互換性が失われる
- `satisfies`（4.9）/ `const` type parameter（5.0）等の恩恵を受けられない
- エディタの IntelliSense が古い型情報で動作する

バージョンギャップが大きい（2 major 以上）場合は優先度を上げてアップグレードを提案する。

---

## 自動追従の設定（任意）

Renovate や Dependabot を使っている場合は `typescript` を minor auto-merge の対象に含める。
patch は自動マージ、minor は `pnpm typecheck` が green なら自動マージが推奨設定。
major は常に手動確認を要求する設定にする。
