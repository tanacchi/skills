# North アセット詳細

## ルーム全景

| ファイル | 解像度 | 状態 | 用途 |
|---|---:|---|---|
| `public/rooms/north/room_north.webp` | 1408x768 | 旧版 | 参照 base のみ |
| `public/rooms/north/room_north_with_blue_vault.webp` | 1408x768 | 現行版 | north room-camera 背景 |

ゲーム表示では常に `room_north_with_blue_vault.webp` を使う。`room_north.webp` は青金庫追加前の旧版で、通常実装では参照しない。

## Hotspots

Aspect ratio: `1408 / 768`

```json
{
  "sharpener": { "top": 52, "left": 24, "w": 10, "h": 20 },
  "candle": { "top": 40, "left": 44, "w": 6, "h": 22 },
  "blue-vault": { "top": 30, "left": 65, "w": 20, "h": 30 }
}
```

- `sharpener` → object-focus: `north-sharpener`
- `candle` → object-focus: `north-candle`
- `blue-vault` → object-focus: `north-blue-vault`
- ルーム全景自体は状態差し替えしない。状態差分は close-up 側で表現する。

## Close-up 画像

| ファイル | 解像度 | 状態 / 説明 | Prompt |
|---|---:|---|---|
| `public/rooms/north/pencil-sharpener-closeup.webp` | 1024x1024 | 鉛筆削り idle | N-01 |
| `public/rooms/north/pencil-sharpener-closeup-used.webp` | 1024x1024 | 鉛筆削り used、削りカスあり | N-01b |
| `public/rooms/north/candle-closeup-unlit.webp` | 1024x1024 | ロウソク unlit、炎なし | N-02b |
| `public/rooms/north/candle-closeup.webp` | 1024x1024 | ロウソク lit、炎あり | N-02 |
| `public/rooms/north/paper-aburi-revealed.webp` | 1024x1024 | 炙り出し後の紙 | N-03 |
| `public/rooms/north/blue-vault-locked.webp` | 896x1195 | 青金庫 locked | N-04 |
| `public/rooms/north/blue-vault-open.webp` | 896x1195 | 青金庫 open、写真あり | N-05 |
| `public/rooms/north/blue-vault-empty.webp` | 896x1195 | 青金庫 empty、写真取得済み | N-06 |

## TypeScript src テーブル例

```ts
type NorthSharpenerState = 'idle' | 'used';
type NorthCandleState = 'unlit' | 'lit' | 'paper-revealed';
type NorthBlueVaultState = 'locked' | 'open' | 'empty';

const NORTH_SHARPENER_SRC = {
  idle: '/rooms/north/pencil-sharpener-closeup.webp',
  used: '/rooms/north/pencil-sharpener-closeup-used.webp',
} as const satisfies Record<NorthSharpenerState, string>;

const NORTH_CANDLE_SRC = {
  unlit: '/rooms/north/candle-closeup-unlit.webp',
  lit: '/rooms/north/candle-closeup.webp',
  'paper-revealed': '/rooms/north/paper-aburi-revealed.webp',
} as const satisfies Record<NorthCandleState, string>;

const NORTH_BLUE_VAULT_SRC = {
  locked: '/rooms/north/blue-vault-locked.webp',
  open: '/rooms/north/blue-vault-open.webp',
  empty: '/rooms/north/blue-vault-empty.webp',
} as const satisfies Record<NorthBlueVaultState, string>;
```

## Notes

- `docs/asset-prompts/north/README.md` は north の prompt ID と生成済み状態の対応表。
- 炙り出し紙の inventory thumbnail は `public/inventory/aburi-paper-heated.webp` を使う。north close-up の `paper-aburi-revealed.webp` はロウソク使用後の scene 表示用。
