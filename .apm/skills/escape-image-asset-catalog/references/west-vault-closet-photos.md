# West — クローゼット・金庫・写真 詳細

## 状態遷移マップ

```
room_west_paper_removed  (初期: closet-closed)
  │
  ├─ [扉タップ (closet-doors)]
  ▼
open-closet  (closet-open / 中段に電子金庫が見える)
  │         ↑
  │    [扉エッジ/上部タップ (closet-close-edge-left/right / closet-close-top)]
  │    → closet-closed へ戻る (逆遷移あり)
  │
  ├─ [金庫タップ (vault)] → currentView: object-focus / vault
  │
  ▼  [object-focus: vault]
vault-A  (金庫クローズアップ、閉鎖)
  │
  ├─ [正解 PIN 入力 → ENTER]
  ▼
open-vault  (金庫開扉 / 写真あり)
  │
  ├─ [写真タップ] → 収集
  ▼
get-photos-from-vault  (金庫開扉 / 写真取出済)

ルーム全景に戻ったとき:
  open-closet → vault-A-already-vault  (closet-open-vault-seen)

closet-open-vault-seen → [扉エッジ/上部タップ] → closet-closed  (逆遷移有効)
```

---

## 画像一覧 (ルーム全景 3 枚)

| ファイル | サイズ | 解像度 | 状態キー | 用途 |
|---|---|---|---|---|
| `public/rooms/west/room_west_paper_removed.webp` | 16KB | 1408×768 | `closet-closed` | west 方位初期背景 |
| `public/rooms/west/open-closet.webp` | 24KB | 1408×768 | `closet-open` | クローゼット開扉後の全景 |
| `public/rooms/west/vault-A-already-vault.webp` | 24KB | 1408×768 | `closet-open-vault-seen` | 金庫を一度確認した後の全景 (UI 差分として用意) |

### TypeScript 状態型と src テーブル例

```ts
type WestRoomState = 'closet-closed' | 'closet-open' | 'closet-open-vault-seen';

const WEST_ROOM_SRC = {
  'closet-closed':          '/rooms/west/room_west_paper_removed.webp',
  'closet-open':            '/rooms/west/open-closet.webp',
  'closet-open-vault-seen': '/rooms/west/vault-A-already-vault.webp',
} as const satisfies Record<WestRoomState, string>;
```

### ホットスポット座標 (aspect-ratio: 1408 / 768)

```json
{
  "closet-doors":           { "top":  5, "left": 25, "w": 44, "h": 88 },
  "closet-close-edge-left": { "top":  5, "left": 23, "w":  7, "h": 80 },
  "closet-close-edge-right":{ "top":  5, "left": 70, "w":  7, "h": 80 },
  "closet-close-top":       { "top":  0, "left": 25, "w": 50, "h":  8 },
  "vault":                  { "top": 42, "left": 33, "w": 34, "h": 30 }
}
```

- `closet-doors` は `westRoomState === 'closet-closed'` のときのみ active
- `closet-close-edge-left` / `closet-close-edge-right` / `closet-close-top` は `closet-open` または `closet-open-vault-seen` のときのみ active (実扉エッジ左右 2 帯 + 上部帯で閉扉)
- `vault` は `westRoomState === 'closet-open' || 'closet-open-vault-seen'` のときのみ active。`z-index: 1` で閉扉ホットスポット群より手前に配置すること

---

## 画像一覧 (object-focus / クローズアップ 3 枚)

| ファイル | サイズ | 解像度 | 状態 | 説明 |
|---|---|---|---|---|
| `public/rooms/west/vault-A.webp` | 80KB | 896×1195 | 金庫 閉鎖 | テンキーパッド・READY/ERRORランプ・ロータリーダイヤルが見える |
| `public/rooms/west/open-vault.webp` | 52KB | 896×1195 | 金庫 開扉、写真あり | 内部に「おかえりまりえ」プリント + ヴィンテージ写真群 |
| `public/rooms/west/get-photos-from-vault.webp` | 32KB | 896×1195 | 金庫 開扉、写真取得済み | 内部空、写真は棚下段に散らばった状態 |

---

## 金庫のインタラクション詳細 (Archetype A' — テンキーパッド入力)

### 機器の実物

KOBE SAFE CO., MODEL: KS-100D。電子式金庫。

**操作パネル構成** (vault-A.webp での配置):
- 左: 機械式ロータリーダイヤル (装飾。ゲームでは操作しない)
- 右上: `READY` (緑ランプ) / `ERROR` (赤ランプ) 表示
- 右中: テンキーパッド — `1 2 3 / 4 5 6 / 7 8 9 / CLEAR 0 ENTER`
- 下部: 物理ハンドル (解錠後に「扉を開ける」操作のトリガー)

### テンキー overlay の推奨ホットスポット (vault-A.webp, aspect-ratio: 896/1195)

画像内でのテンキーパッドの位置 (概算):

```json
{
  "key-1": { "top": 29, "left": 58, "w": 10, "h":  7 },
  "key-2": { "top": 29, "left": 68, "w": 10, "h":  7 },
  "key-3": { "top": 29, "left": 78, "w": 10, "h":  7 },
  "key-4": { "top": 36, "left": 58, "w": 10, "h":  7 },
  "key-5": { "top": 36, "left": 68, "w": 10, "h":  7 },
  "key-6": { "top": 36, "left": 78, "w": 10, "h":  7 },
  "key-7": { "top": 43, "left": 58, "w": 10, "h":  7 },
  "key-8": { "top": 43, "left": 68, "w": 10, "h":  7 },
  "key-9": { "top": 43, "left": 78, "w": 10, "h":  7 },
  "key-clear": { "top": 50, "left": 58, "w": 10, "h": 7 },
  "key-0":     { "top": 50, "left": 68, "w": 10, "h": 7 },
  "key-enter": { "top": 50, "left": 78, "w": 10, "h": 7 },
  "handle":    { "top": 56, "left": 42, "w": 16, "h": 7 }
}
```

> ※ 上記座標は初期推定値。DevTools または HotspotEditor デバッグツールで実際の表示を見ながら調整すること。

### テンキー操作フロー

1. プレイヤーが数字ボタンをタップ → `inputBuffer` に追記 (最大 N 桁まで)
2. `CLEAR` タップ → `inputBuffer` をリセット
3. `ENTER` タップ → Server Action `openVault({ code: inputBuffer })` を呼び出す
4. Server 側で正解コードと照合:
   - 正解: `UNLOCK_VAULT` Event → `vaultState: 'open'` → `open-vault.webp` 表示
   - 不正解: `VAULT_ERROR` Event → ERROR ランプ点灯演出 (短い red highlight + shake アニメ) → buffer リセット

### 正解コード管理

- 正解コードは `entities/game/api/stages.ts` の server-only 変数で管理
- クライアントサイドに正解コードを露出しない (CLAUDE.md の server-only 正解値ルール)

---

## 写真の内容 (open-vault.webp で確認)

開いた金庫の内部に見える写真:
- **大判プリント** (金庫内部の棚にたてかけ): 空港 (日本) のターミナルで複数人が歩いている場面。手前にスーツケース。「おかえりまりえ」のサインボード (ハート・リボン装飾つき)。
- **ヴィンテージ写真複数枚** (棚下段に散らばる): 家族写真 (4〜5 名)、海外の海辺の写真など。

これらの写真は後続のステージ (写真の並べ替えパズル等) で使用されると推測される。写真収集後は `get-photos-from-vault.webp` を表示する。
