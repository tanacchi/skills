# East アセット詳細

East 方位は生成済み。ベッド、壁時計、赤金庫、窓 QR の close-up を含む。

## ルーム全景

| ファイル | 解像度 | 状態 | 説明 |
|---|---:|---|---|
| `public/rooms/east/room_east.webp` | 1408x768 | 常時背景 | ベッド、壁時計、机、右壁窓、赤金庫 |

## Hotspots

Aspect ratio: `1408 / 768`

```json
{
  "clock": { "top": 10, "left": 8, "w": 22, "h": 38 },
  "bed-under-pencil": { "top": 70, "left": 42, "w": 20, "h": 18 },
  "bed-under-deep": { "top": 75, "left": 60, "w": 15, "h": 15 },
  "pillow-back": { "top": 40, "left": 55, "w": 18, "h": 20 },
  "red-safe": { "top": 35, "left": 18, "w": 18, "h": 22 },
  "window": { "top": 20, "left": 82, "w": 14, "h": 50 }
}
```

- `clock` → 時計縁文字 close-up
- `bed-under-pencil` → ベッド下の鉛筆
- `bed-under-deep` → ベッド下奥の QR1
- `pillow-back` → 枕裏の炙り出し紙
- `red-safe` → 赤金庫 close-up
- `window` → QR1 と QR2 の両方を取得済みのとき完成 QR close-up

## Close-up 画像

| ファイル | 解像度 | 説明 | Prompt |
|---|---:|---|---|
| `public/rooms/east/clock-closeup.webp` | 896x1195 | 時計縁 12 文字 | E-02 |
| `public/rooms/east/bed-pencil.webp` | 1024x1024 | ベッド下の鉛筆 | E-03 |
| `public/rooms/east/bed-deep-qr1.webp` | 1024x1024 | ベッド下奥の QR1 | E-04 |
| `public/rooms/east/pillow-aburi-paper.webp` | 1024x1024 | 枕裏の炙り出し紙 | E-05 |
| `public/rooms/east/red-vault-locked.webp` | 896x1195 | 赤金庫 locked | E-06 |
| `public/rooms/east/red-vault-open.webp` | 896x1195 | 赤金庫 open、写真あり | E-07 |
| `public/rooms/east/red-vault-empty.webp` | 896x1195 | 赤金庫 empty、写真取得済み | E-08 |
| `public/rooms/east/window-qr-overlay.webp` | 896x1195 | 右壁窓の完成 QR | E-09 |

## TypeScript src テーブル例

```ts
type EastVaultState = 'locked' | 'open' | 'empty';

const EAST_VAULT_SRC = {
  locked: '/rooms/east/red-vault-locked.webp',
  open: '/rooms/east/red-vault-open.webp',
  empty: '/rooms/east/red-vault-empty.webp',
} as const satisfies Record<EastVaultState, string>;
```

## Notes

- `docs/asset-prompts/east/README.md` が「未生成」と書いている場合でも、現行実体は `public/rooms/east/` に 9 枚生成済み。
- 時計文字や QR は画像生成だけに頼らず、必要なら後合成または UI overlay で精度を担保する。
