---
name: escape-image-asset-catalog
description: Use this skill when working in the escape (Re-Collect) repository and you need to know which image asset under public/rooms/ to render for a given room direction (north/south/west), puzzle state (locked/released, vault closed/open), or stage transition. Triggers on phrases like "south のドア画像", "vault が開いた状態の画像", "rooms/ のアセット一覧", "どの画像を使えばいい", or any request that involves choosing/displaying a public/rooms/<direction>/*.webp file.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires the escape repository checked out with public/rooms/ assets generated via cwebp from new-images/.
---

# escape-image-asset-catalog

「みりこの記憶泥棒 Re-Collect」(escape リポジトリ) の `public/rooms/` 配下にある画像アセットの完全カタログ。どの方位・どのゲーム状態でどの `.webp` ファイルを表示するかを即答する。

## 利用タイミング

- room-camera の各方位 (north / south / west) に表示する背景画像を選ぶとき
- 鍵の解錠・金庫の開錠などの状態遷移に対応する画像 src を決めるとき
- `state → src` テーブルを実装する前にアセット一覧を確認したいとき
- ホットスポット座標の初期値を参照したいとき

east 方位は画像未提供のため対象外 (将来追加予定)。

## アセット構成の概要

```
public/rooms/
  north/   1 枚  — 木製テーブル + 鉛筆削り + ロウソクの部屋
  south/  11 枚  — 3色南京錠ドアの全景 (5状態) + 個別錠クローズアップ (3色×2状態)
  west/    6 枚  — クローゼット + 電子金庫の段階的開示
```

詳細は `references/` 以下を参照:
- `references/north-assets.md` — north 画像の詳細とホットスポット
- `references/south-door-lock-states.md` — south ドア全景5状態 + 個別錠6枚の詳細と状態遷移マップ
- `references/west-vault-closet-photos.md` — west クローゼット〜金庫〜写真の詳細と状態遷移マップ

## 命名・配置規約

| 項目 | 規則 |
|---|---|
| 配置先 | `public/rooms/<direction>/<purpose>-<state>.webp` |
| フォーマット | WebP (lossy q=80、cwebp 1.5.0) |
| 元 PNG | `new-images/` (.gitignore 管理、commit しない) |
| 解像度 | 元 PNG と同一 (1408×768 または 896×1195) |

## ホットスポット座標の基本方針

- container に `aspect-ratio` を元解像度比で固定し、`<button>` を `position: absolute` + `%` 座標で配置
- 座標の単位はすべて **% (0–100)** — `top / left / width / height`
- 詳細な座標値と決定ロジックは各 reference ファイルを参照

## 使用される widget / feature

| アセット群 | 使用先 |
|---|---|
| north/room_north.webp | `widgets/room-camera/` north panel + `widgets/north-scene/`(将来) |
| south/door-*.webp | `widgets/room-camera/` south panel (state-driven image swap) |
| south/{color}-lock*.webp | `widgets/lock-puzzle/` object-focus クローズアップ |
| west/room_west_paper_removed.webp, open-closet.webp, vault-A-already-vault.webp | `widgets/room-camera/` west panel |
| west/vault-A.webp, open-vault.webp, get-photos-from-vault.webp | `widgets/vault-puzzle/` object-focus クローズアップ |

## Guardrails

- このカタログの座標値はあくまで **推奨初期値**。実際の表示確認後に DevTools で微調整すること
- 画像 src を直書きせず、`state → src` テーブル (`as const satisfies`) にまとめること
- 南京錠クローズアップ画像の数字は CSS の数字 strip で overlay する (写真の数字をそのまま操作しない)
- 金庫 (vault-A.webp) はテンキーパッド UI を CSS/TSX で画像上に overlay する
- 画像の `alt` は `""` (装飾画像)、ホットスポット `<button>` に `aria-label` を必ず付ける

## Related References

- `references/north-assets.md`
- `references/south-door-lock-states.md`
- `references/west-vault-closet-photos.md`
- escape リポジトリの `public/rooms/` (実ファイル)
- 実装パターン: `escape-interactive-image-implementation` skill
