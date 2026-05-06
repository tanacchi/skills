# North アセット詳細

## 画像一覧

| ファイル | 解像度 | サイズ | 状態 |
|---|---|---|---|
| `public/rooms/north/room_north.webp` | 1408×768 | 28KB | 初期状態・常時使用 |

## 被写体

白い壁の部屋。フローリング。右側に窓とラジエーター。中央に木製テーブル。

テーブル上のオブジェクト:
- **赤い手動式鉛筆削り** (hand-crank pencil sharpener) — 左寄り
- **ロウソク** (ガラスホルダー付き、点灯) — 右寄り

## ホットスポット座標 (aspect-ratio: 1408 / 768)

```json
{
  "sharpener": { "top": 52, "left": 24, "w": 10, "h": 20 },
  "candle":    { "top": 40, "left": 44, "w":  6, "h": 22 }
}
```

## インタラクション

| オブジェクト | タップ後の遷移 | 対応 Archetype |
|---|---|---|
| 鉛筆削り | `currentView: { kind: 'object-focus', objectId: 'sharpener' }` へ | A (Discrete Toggle) |
| ロウソク | 演出 (ゲーム進行には影響なし、または謎ヒント表示) | A (optional) |

## 注意

- north には状態差替え画像はない (背景は常に同じ 1 枚)
- 鉛筆削りのフォーカスビュー用画像は別途用意が必要 (現時点で `public/rooms/north/` に未存在)
