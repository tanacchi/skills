# Inventory / Photos / Mocha アセット詳細

## Inventory

`public/inventory/` 配下。インベントリパネル、item detail、取得済みアイテム一覧で使う。

| ファイル | 解像度 | 説明 | Prompt |
|---|---:|---|---|
| `public/inventory/pencil-new.webp` | 1024x1024 | 新品鉛筆、未削り | I-01 |
| `public/inventory/pencil-sharpened.webp` | 1024x1024 | 削り済み鉛筆 | I-02 |
| `public/inventory/aburi-paper-rolled.webp` | 1024x1024 | 丸めた炙り出し紙 | I-03 |
| `public/inventory/qr1-closeup.webp` | 1024x1024 | QR1 close-up | I-04 |
| `public/inventory/aburi-paper-heated.webp` | 1024x1024 | 炙り後の炙り出し紙 | I-05 |
| `public/inventory/photos-blue.webp` | 1024x1024 | 青金庫の写真束 | I-06 |
| `public/inventory/photos-red.webp` | 1024x1024 | 赤金庫の写真束 | I-07 |

```ts
type InventoryAssetId =
  | 'pencil-new'
  | 'pencil-sharpened'
  | 'aburi-paper-rolled'
  | 'aburi-paper-heated'
  | 'qr1'
  | 'photos-blue'
  | 'photos-red';

const INVENTORY_SRC = {
  'pencil-new': '/inventory/pencil-new.webp',
  'pencil-sharpened': '/inventory/pencil-sharpened.webp',
  'aburi-paper-rolled': '/inventory/aburi-paper-rolled.webp',
  'aburi-paper-heated': '/inventory/aburi-paper-heated.webp',
  qr1: '/inventory/qr1-closeup.webp',
  'photos-blue': '/inventory/photos-blue.webp',
  'photos-red': '/inventory/photos-red.webp',
} as const satisfies Record<InventoryAssetId, string>;
```

## Photos

`public/photos/<box>/` 配下。各金庫の取得写真セット。箱別の読み順は時計の短針に従う。

| ファイル | 日付 | シーン | 短針 | 文字 | 箱 |
|---|---|---|---:|---|---|
| `public/photos/A/01-banksy.webp` | 2023-02-13 | バンクシー展 | 8 | C | A |
| `public/photos/A/02-usj.webp` | 2023-03-27 | USJ | 5 | H | A |
| `public/photos/A/03-yahoo-festival.webp` | 2023-08-06 | Yahoo 法被お祭り | 12 | A | A |
| `public/photos/A/04-tenjin-halloween.webp` | 2023-10-28 | 天神ハロウィン | 7 | M | A |
| `public/photos/A/05-disney.webp` | 2024-02-10 | ディズニー | 4 | O | A |
| `public/photos/B/06-huistenbosch.webp` | 2023-12-23 | ハウステンボス | 7 | M | B |
| `public/photos/B/07-yakushima.webp` | 2024-04-28 | 屋久島 | 4 | O | B |
| `public/photos/B/08-diet.webp` | 2024-06-23 | 国会議事堂 | 10 | N | B |
| `public/photos/B/09-summer-sonic.webp` | 2024-08-18 | SUMMER SONIC | 6 | I | B |
| `public/photos/B/10-iki.webp` | 2024-09-15 | 壱岐島 | 1 | ! | B |
| `public/photos/C/11-okunoshima.webp` | 2024-12-07 | 大久野島 | 10 | N | C |
| `public/photos/C/12-suginoi.webp` | 2024-12-21 | 杉の井ホテル | 11 | Y | C |
| `public/photos/C/13-airport.webp` | 2025-05-05 | 空港お出迎え | 4 | O | C |
| `public/photos/C/14-balcony.webp` | 2025-05-18 | ベランダパーティー | 4 | O | C |
| `public/photos/C/15-sanpuchang.webp` | 2026-03-14 | サンプーチャン | 4 | O | C |

箱別の答え:

- A: `CHAMO`
- B: `MONI!`
- C: `NYOOO`

```ts
type PhotoBox = 'A' | 'B' | 'C';

const PHOTO_SRC = {
  A: [
    '/photos/A/01-banksy.webp',
    '/photos/A/02-usj.webp',
    '/photos/A/03-yahoo-festival.webp',
    '/photos/A/04-tenjin-halloween.webp',
    '/photos/A/05-disney.webp',
  ],
  B: [
    '/photos/B/06-huistenbosch.webp',
    '/photos/B/07-yakushima.webp',
    '/photos/B/08-diet.webp',
    '/photos/B/09-summer-sonic.webp',
    '/photos/B/10-iki.webp',
  ],
  C: [
    '/photos/C/11-okunoshima.webp',
    '/photos/C/12-suginoi.webp',
    '/photos/C/13-airport.webp',
    '/photos/C/14-balcony.webp',
    '/photos/C/15-sanpuchang.webp',
  ],
} as const satisfies Record<PhotoBox, readonly string[]>;
```

## Mocha

`public/mocha/` 配下。ナビゲーターキャラクターの表情差分。透過 PNG のまま扱う。

| ファイル | mood | 説明 |
|---|---|---|
| `public/mocha/normal.png` | `normal`, `happy` | デフォルト顔 |
| `public/mocha/normal2.png` | `normal` | normal の揺らぎ |
| `public/mocha/sad.png` | `sad` | 誤答時 |
| `public/mocha/hint.png` | `hint` | ヒント表示時 |
| `public/mocha/surprise.png` | `surprise` | 大きな状態遷移 |
| `public/mocha/stone.png` | `stone` | 石化演出 |

```ts
const MOCHA_AVATAR_SRC = {
  normal: ['/mocha/normal.png', '/mocha/normal2.png'],
  happy: '/mocha/normal.png',
  sad: '/mocha/sad.png',
  hint: '/mocha/hint.png',
  surprise: '/mocha/surprise.png',
  stone: '/mocha/stone.png',
} as const;
```
