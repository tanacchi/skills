---
name: escape-image-asset-catalog
description: Use this skill when working in the escape (Re-Collect) repository and you need to choose or document image assets under public/rooms/, public/inventory/, public/photos/, or public/mocha/. Triggers on requests about room direction images, vault/lock states, inventory thumbnails, photo sets, hotspot coordinates, or state-to-src tables for Re-Collect assets.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires the escape repository checked out with generated WebP assets under public/rooms/, public/inventory/, and public/photos/.
---

# escape-image-asset-catalog

「みりこの記憶泥棒 Re-Collect」(escape リポジトリ) の画像アセット SSOT。`public/rooms/`、`public/inventory/`、`public/photos/`、`public/mocha/` のどの画像を、どの方位・状態・UI で表示するかを即答する。

## 利用タイミング

- room-camera の north / south / east / west 背景画像を選ぶとき
- 南京錠、金庫、ロウソク、鉛筆削り、ベッド、時計などの状態差分画像を選ぶとき
- インベントリの item id から thumbnail src を決めるとき
- 写真束や写真 15 枚の箱別構成を確認するとき
- hotspot 座標、`state → src` テーブル、実装時の guardrail を確認するとき

## アセット構成の概要

| 区分 | 現状 | 内容 | 追加生成 |
|---|---:|---|---|
| `public/rooms/north/` | 10 | north 全景 2 枚 + close-up 8 枚 | 不要 |
| `public/rooms/south/` | 11 | 3 色南京錠ドア全景 5 状態 + 個別錠 6 枚 | 不要 |
| `public/rooms/east/` | 9 | east 全景 1 枚 + close-up 8 枚 | 不要 |
| `public/rooms/west/` | 11 | west 全景 5 枚 + 金庫/紙/QR close-up 6 枚 | 不要 |
| `public/inventory/` | 7 | 鉛筆、炙り出し紙、QR1、写真束 2 色 | 不要 |
| `public/photos/` | 15 | A/B/C 各 5 枚の思い出写真 | 不要 |
| `public/mocha/` | 6 PNG | ﾓﾁｬ の表情差分 | 不要 |

`docs/skill-feedback/2026-05-06-north-implementation-feedback.md` に記載された north / inventory の不足画像は生成済み。実装時は既存 WebP を正として扱う。

## 参照ファイル

- `references/north-assets.md` — north 全景、鉛筆削り、ロウソク、青金庫、炙り出し紙
- `references/south-door-lock-states.md` — south ドア全景、個別南京錠、状態遷移
- `references/east-assets.md` — east 全景、時計、ベッド、赤金庫、窓 QR
- `references/west-vault-closet-photos.md` — west クローゼット、黄金庫、凸凹紙、QR2
- `references/inventory-photos-mocha.md` — inventory、写真 15 枚、ﾓﾁｬ 表情差分

## 命名・配置規約

| 対象 | 規則 | 例 |
|---|---|---|
| room 全景 | `public/rooms/<direction>/room_<direction>[_with_<modifier>].webp` | `room_north_with_blue_vault.webp` |
| close-up | `public/rooms/<direction>/<object>[-<state>].webp` | `blue-vault-locked.webp` |
| inventory | `public/inventory/<item>[-<state>].webp` | `pencil-sharpened.webp` |
| photos | `public/photos/<box>/<NN>-<scene>.webp` | `photos/B/10-iki.webp` |
| mocha | `public/mocha/<mood>.png` | `mocha/surprise.png` |

画像は WebP lossy q=80 が基本。ﾓﾁｬは透過 PNG のため WebP 変換しない。

## 実装 Guardrails

- 画像 src は直書きせず、`state → src` テーブルまたは world definition の `views[state].image` に集約する
- hotspot は `%` 座標で `position: absolute` overlay にする
- 画像の `alt` は装飾用途なら `""`、操作対象は重ねる `<button aria-label="...">` に意味を持たせる
- 南京錠の数字は CSS の数字 strip で overlay し、写真の数字を直接操作しない
- 金庫 PIN と南京錠正解コードは server-only に置き、client に露出しない
- QR や時計文字など生成画像上の文字精度が必要なものは、後合成または UI overlay を優先する

## Related References

- escape リポジトリの `public/rooms/`, `public/inventory/`, `public/photos/`, `public/mocha/`
- escape リポジトリの `docs/asset-prompts/`
- 実装パターン: `escape-interactive-image-implementation` skill
