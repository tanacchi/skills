# West — クローゼット・金庫・写真 詳細

> **重要**: inventory PR (2026-05) 以降、状態キーが短縮形に変更された。
> `'closet-closed'` → `'closed'`、`'closet-open'` → `'open'`、`'closet-open-vault-seen'` → `'open-vault-seen'`
> 旧キーを書いたコードは Biome/TypeScript で型エラーになる。

## 状態遷移マップ

```
room_west_paper_removed  (初期: west-closet = 'closed')
  │
  ├─ [扉タップ (closet-doors)]
  ▼
open-closet  (west-closet = 'open' / 中段に電子金庫が見える)
  │         ↑
  │    [扉エッジ/上部タップ (closet-close-edge-left/right / closet-close-top)]
  │    → 'closed' へ戻る (逆遷移あり)
  │
  ├─ [金庫タップ (focus-vault)] → westFocusAtom = 'vault'
  │    ↳ closet 状態を 'open-vault-seen' に昇格 (markVaultSeenAtom)
  │
  ▼  [VaultCloseup フォーカス中]
vault-A  (west-yellow-vault = 'locked')
  │
  ├─ [正解 PIN 入力 → ENTER → SUBMIT_VAULT_PIN]
  ▼
open-vault  (west-yellow-vault = 'open')
  │
  ├─ [写真タップ → COLLECT_ITEM { itemId: 'photos-yellow' }]
  ▼
get-photos-from-vault  (west-yellow-vault = 'empty' / photos-yellow が inventory へ移動)

ルームに戻ったとき:
  west-closet = 'open-vault-seen' → vault-A-already-vault.webp

west-closet = 'open-vault-seen' → [扉エッジ/上部タップ] → 'closed' (逆遷移有効)
```

---

## Fixture / Item 状態型 (entities/game/world/schema.ts)

```ts
// west-closet: FixtureState<'west-closet'>
'closed' | 'open' | 'open-vault-seen'

// west-yellow-vault: FixtureState<'west-yellow-vault'>
'locked' | 'open' | 'empty'

// photos-yellow: ItemState<'photos-yellow'>
'default'
// location: { kind: 'fixture', fixtureId: 'west-yellow-vault' } → { kind: 'inventory' }
```

状態→画像 src の解決は `FIXTURES[id].views[state].image` で行う:

```ts
// src/entities/game/world/definitions.ts の FIXTURES テーブルより
'west-closet': {
  room: 'W',
  views: {
    'closed':          { image: '/rooms/west/room_west_paper_removed.webp' },
    'open':            { image: '/rooms/west/open-closet.webp' },
    'open-vault-seen': { image: '/rooms/west/vault-A-already-vault.webp' },
  },
},
'west-yellow-vault': {
  room: 'W',
  views: {
    'locked': { image: '/rooms/west/vault-A.webp' },
    'open':   { image: '/rooms/west/open-vault.webp' },
    'empty':  { image: '/rooms/west/get-photos-from-vault.webp' },
  },
},
```

実装側では `getFixtureView(fixtureId, state).image` を使う:

```ts
// west-closet/model.ts
export const westRoomImageAtom = atom((get) =>
  getFixtureView('west-closet', get(closetStateAtom)).image,
);

export const vaultCloseupImageAtom = atom((get) =>
  getFixtureView('west-yellow-vault', get(yellowVaultStateAtom)).image,
);
```

---

## 画像一覧 (ルーム全景 3 枚)

| ファイル | サイズ | 解像度 | 状態キー | 用途 |
|---|---|---|---|---|
| `public/rooms/west/room_west_paper_removed.webp` | 16KB | 1408×768 | `'closed'` | west 方位初期背景 |
| `public/rooms/west/open-closet.webp` | 24KB | 1408×768 | `'open'` | クローゼット開扉後の全景 |
| `public/rooms/west/vault-A-already-vault.webp` | 24KB | 1408×768 | `'open-vault-seen'` | 金庫を一度確認した後の全景 |

### ホットスポット座標 (aspect-ratio: 1408 / 768)

```json
{
  "closet-doors":           { "top":  5, "left": 25, "w": 44, "h": 88 },
  "closet-close-edge-left": { "top":  5, "left": 23, "w":  7, "h": 80 },
  "closet-close-edge-right":{ "top":  5, "left": 70, "w":  7, "h": 80 },
  "closet-close-top":       { "top":  0, "left": 25, "w": 50, "h":  8 },
  "focus-vault":            { "top": 42, "left": 33, "w": 34, "h": 30 }
}
```

- `closet-doors` は `closetState === 'closed'` のときのみ active
- `closet-close-edge-*` / `closet-close-top` は `'open'` または `'open-vault-seen'` のとき active
- `focus-vault` は `closetState !== 'closed'` のとき active

---

## 画像一覧 (VaultCloseup / クローズアップ 3 枚)

| ファイル | サイズ | 解像度 | 状態 | 説明 |
|---|---|---|---|---|
| `public/rooms/west/vault-A.webp` | 80KB | 896×1195 | `'locked'` | テンキーパッド・READY/ERRORランプが見える |
| `public/rooms/west/open-vault.webp` | 52KB | 896×1195 | `'open'` | 内部に写真群が見える |
| `public/rooms/west/get-photos-from-vault.webp` | 32KB | 896×1195 | `'empty'` | 内部空、写真取得済み |

---

## 金庫のインタラクション詳細

### 機器の実物

KOBE SAFE CO., MODEL: KS-100D。電子式金庫。

**操作パネル構成** (vault-A.webp での配置):
- 左: 機械式ロータリーダイヤル (装飾。ゲームでは操作しない)
- 右上: `READY` (緑ランプ) / `ERROR` (赤ランプ) 表示
- 右中: テンキーパッド — `1 2 3 / 4 5 6 / 7 8 9 / CLEAR 0 ENTER`
- 下部: 物理ハンドル (解錠後に「扉を開ける」操作のトリガー)

### テンキー overlay ホットスポット (vault-A.webp, aspect-ratio: 896/1195)

```json
{
  "keypad-1": { "top": 29, "left": 58, "w": 10, "h":  7 },
  "keypad-2": { "top": 29, "left": 68, "w": 10, "h":  7 },
  "keypad-3": { "top": 29, "left": 78, "w": 10, "h":  7 },
  "keypad-4": { "top": 36, "left": 58, "w": 10, "h":  7 },
  "keypad-5": { "top": 36, "left": 68, "w": 10, "h":  7 },
  "keypad-6": { "top": 36, "left": 78, "w": 10, "h":  7 },
  "keypad-7": { "top": 43, "left": 58, "w": 10, "h":  7 },
  "keypad-8": { "top": 43, "left": 68, "w": 10, "h":  7 },
  "keypad-9": { "top": 43, "left": 78, "w": 10, "h":  7 },
  "keypad-clear": { "top": 50, "left": 58, "w": 10, "h": 7 },
  "keypad-0":     { "top": 50, "left": 68, "w": 10, "h": 7 },
  "keypad-enter": { "top": 50, "left": 78, "w": 10, "h": 7 },
  "handle":       { "top": 56, "left": 42, "w": 16, "h": 7 }
}
```

> ※ 上記座標は初期推定値。DevTools で実際の表示を見ながら調整すること。

### テンキー操作フロー

1. 数字ボタンタップ → `vaultPinInputAtom` に追記 (最大 4 桁)
2. CLEAR タップ → `vaultPinInputAtom` リセット
3. ENTER タップ → `dispatch({ type: 'SUBMIT_VAULT_PIN', pin })`
4. Server 側 `resolveVaultPin()` で正解照合:
   - 正解: `SET_FIXTURE_STATE { fixtureId: 'west-yellow-vault', state: 'open' }` + SE + Mocha
   - 不正解: PLAY_SE ('wrong') + MOCHA_SAY (sad)

### 正解コード管理

- 正解 PIN は `entities/game/api/stages.ts` (server-only) の `CORRECT_VAULT_PIN` で管理
- クライアントに露出しない。INTERACTIONS テーブルで参照する

---

## 写真アイテムの詳細

### アイテム ID と在処

| ItemId | 在処 | 取得元 |
|---|---|---|
| `photos-yellow` | west-yellow-vault (初期) → inventory (取得後) | 黄色い金庫 |
| `photos-red` | east-red-vault (初期) → inventory | 赤い金庫 (east, 将来実装) |
| `photos-blue` | north-blue-vault (初期) → inventory | 青い金庫 (north, 将来実装) |

### 取得フロー (photos-yellow の例)

```ts
// COLLECT_ITEM を dispatch
dispatch({ type: 'COLLECT_ITEM', itemId: 'photos-yellow' });

// INTERACTIONS テーブルが返すイベント列:
[
  { type: 'MOVE_ITEM', itemId: 'photos-yellow', to: { kind: 'inventory' } },
  { type: 'SET_FIXTURE_STATE', fixtureId: 'west-yellow-vault', state: 'empty' },
  { type: 'PLAY_SE', soundId: 'pickup' },
  { type: 'MOCHA_SAY', text: '写真をゲットしたﾓﾁｬ！', mood: 'happy' },
]
```

open-vault.webp に写る写真の内容:
- **大判プリント**: 空港ターミナルで複数人が歩く場面。「おかえりまりえ」のサインボード。
- **ヴィンテージ写真複数枚**: 家族写真・海外の海辺など。これらは後続ステージで使用。
