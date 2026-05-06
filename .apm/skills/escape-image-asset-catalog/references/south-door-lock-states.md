# South — ドア全景 & 個別南京錠 詳細

## ドア全景 (room-camera south の背景として使用)

### 状態遷移マップ

```
door-with-3-locks  (初期: 全3錠 施錠)
  │
  ├─ [赤錠の正解コード入力]
  ▼
door-red-lock-released  (赤 解錠 / 青・黄 施錠)
  │
  ├─ [青錠の正解コード入力]
  ▼
door-red-and-blue-lock-released  (赤・青 解錠 / 黄 施錠)
  │
  ├─ [黄錠の正解コード入力]
  ▼
all-lock-just-released  (全3錠 解錠 / ドア 閉)
  │
  ├─ [ドアをタップ]
  ▼
all-lock-released-and-open-door  (全3錠 解錠 + ドア開扉 / 向こうに暖色光)
```

### 画像一覧

| ファイル | サイズ | 解像度 | 状態キー |
|---|---|---|---|
| `public/rooms/south/door-with-3-locks.webp` | 24KB | 1380×752 | `all-locked` |
| `public/rooms/south/door-red-lock-released.webp` | 24KB | 1380×752 | `red-released` |
| `public/rooms/south/door-red-and-blue-lock-released.webp` | 24KB | 1380×752 | `red-blue-released` |
| `public/rooms/south/all-lock-just-released.webp` | 24KB | 1380×752 | `all-released` |
| `public/rooms/south/all-lock-released-and-open-door.webp` | 24KB | 1380×752 | `door-open` |

### TypeScript 状態型と src テーブル例

```ts
type SouthDoorState =
  | 'all-locked'
  | 'red-released'
  | 'red-blue-released'
  | 'all-released'
  | 'door-open';

const SOUTH_DOOR_SRC = {
  'all-locked':        '/rooms/south/door-with-3-locks.webp',
  'red-released':      '/rooms/south/door-red-lock-released.webp',
  'red-blue-released': '/rooms/south/door-red-and-blue-lock-released.webp',
  'all-released':      '/rooms/south/all-lock-just-released.webp',
  'door-open':         '/rooms/south/all-lock-released-and-open-door.webp',
} as const satisfies Record<SouthDoorState, string>;
```

### ホットスポット座標 (aspect-ratio: 1380 / 752)

```json
{
  "red-lock":   { "top": 22, "left": 25, "w": 7, "h": 14 },
  "blue-lock":  { "top": 46, "left": 24, "w": 8, "h": 14 },
  "yellow-lock":{ "top": 60, "left": 24, "w": 8, "h": 12 },
  "door-body":  { "top":  5, "left": 32, "w": 52, "h": 90 }
}
```

- `door-body` ホットスポットは `southDoorState === 'all-released'` のときのみ `pointer-events: auto` にする
- 各錠のホットスポットはその錠がまだ施錠中のときのみ active

---

## 個別南京錠クローズアップ (object-focus ビュー)

プレイヤーがドア全景の錠をタップすると `currentView: { kind: 'object-focus', objectId: 'red-lock' }` 等に遷移し、close-up 画像を表示する。

### 南京錠の物理的構造

- **3桁ダイヤル式**: 3列 × 4行が見える (現在値 + 上下の隣接数字が透けて見える)
- 錠の上端に小さな **▼ 矢印** がありその行の数字が「現在の組合せ」
- 各列を **上下スワイプ** で 0–9 を循環
- 正解コードを揃えると解錠

### 画像一覧

| ファイル | サイズ | 解像度 | 状態 | ▼行の数字 |
|---|---|---|---|---|
| `public/rooms/south/red-lock.webp` | 28KB | 556×740 (縦長) | 施錠 | 5–8–1 |
| `public/rooms/south/red-lock-released.webp` | 40KB | 556×740 | 解錠 (シャックル開) | 5–8–1 |
| `public/rooms/south/blue-lock.webp` | 28KB | 560×756 (縦長) | 施錠 | 7–4–9 |
| `public/rooms/south/blue-lock-released.webp` | 40KB | 560×756 | 解錠 | 7–4–9 |
| `public/rooms/south/yellow-lock.webp` | 24KB | 532×808 (縦長) | 施錠 | 1–6–8 |
| `public/rooms/south/yellow-lock-released.webp` | 36KB | 532×808 | 解錠 | 1–6–8 |

> 正解コード写真内の数字は「正解が揃った状態で撮影した写真」のため実際のゲーム正解値とは無関係。
> ゲームの正解コードはサーバ側 (`entities/game/api/stages.ts` 等) で server-only 管理する。

### 実装方針: 写真 + CSS overlay

close-up 画像は **lock 本体写真 + CSS の数字 strip overlay** で動かす:

```
[lock-body 画像]  ← 金属ボディ・シャックルの見た目
    ↑ 上に重ねる
[CSS 数字 strip × 3列]  ← 実際にスワイプで動く
```

数字 strip の構造 (各列):
- `0`〜`9`〜`0` を縦に並べた要素 (`height: 10 * 1行高さ`)
- `transform: translateY(-(current * 1行高さ))`
- `overflow: hidden` した window で「1行分だけ表示」
- 上下に隣接数字が見えるよう window 高さ = 3行分、translateY で中央行が current

施錠状態から解錠へは:
1. `currentDigits` が正解コードに一致したら Server Action 送信
2. 応答で `UNLOCK_LOCK` Event 受信
3. lock src を施錠画像 → 解錠画像 (released) に切替 (AnimatePresence crossfade)
4. `currentView` を object-focus から door 全景に戻す (ドア画像も更新済み)

### 各錠の TypeScript 型例

```ts
type LockColor = 'red' | 'blue' | 'yellow';
type LockState = 'locked' | 'released';

const LOCK_SRC = {
  red:    { locked: '/rooms/south/red-lock.webp',    released: '/rooms/south/red-lock-released.webp'    },
  blue:   { locked: '/rooms/south/blue-lock.webp',   released: '/rooms/south/blue-lock-released.webp'   },
  yellow: { locked: '/rooms/south/yellow-lock.webp', released: '/rooms/south/yellow-lock-released.webp' },
} as const satisfies Record<LockColor, Record<LockState, string>>;
```
