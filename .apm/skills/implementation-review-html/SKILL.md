---
name: implementation-review-html
description: Use this skill whenever the user wants to turn the current implementation, architecture, or design into a self-contained HTML review artifact that a reviewer can read and comment on by selecting text — with per-comment category and priority, localStorage persistence, and a "submit all" button that downloads every comment as JSON to drive follow-up improvements. Trigger this for requests like 「実装をレビューできるHTMLに起こして」「構造・設計をHTMLでレビューできるように」「範囲選択してコメントできるレビュー成果物を作って」「submit allでコメントをJSONダウンロードしたい」, or any time someone asks to package a codebase walkthrough (stack, architecture, domain, core logic, state, flow, design with screenshots, components, testing, open questions) into a single reviewable file. Also use it to regenerate or extend an existing review/ artifact, and afterwards to apply the returned comments JSON by priority.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires Node (for the dependency-free build.mjs) and a browser for verification (chrome-devtools MCP preferred, otherwise `open`). Screenshots are optional; Playwright VRT snapshots or MCP screenshots both work.
---

# 実装レビュー用インタラクティブ HTML 成果物

現在の実装の**構造と設計を 1 枚の HTML に起こし**（依存グラフ・コンポーネント構成・シーケンス・ドメイン・状態遷移などの
**mermaid 図**を含む設計書として）、レビュアーが本文を**範囲選択してコメント**でき
（カテゴリ＋優先度つき）、**「すべて書き出す」で全コメントを JSON ダウンロード**できる成果物を作る skill。
その JSON を元に、後続で優先度順に改善する。検証済みリファレンスは `what-the-house` の `review/`。

中核の仕掛け（範囲選択コメント・テキストノード分割・再アンカー・localStorage 永続化・JSON 書き出し・mermaid 図描画・コード構文ハイライト）は
**`assets/` の `review.js` / `index.template.html` / `build.mjs` / `vendor/` に完成済み**。これらは**そのままコピーして使う**。
プロジェクト毎に書くのは **`doc.html`（本文）と `review.config.json`（設定）の 2 つだけ**。これが再現性の肝。

## 利用タイミング

- 実装・設計のレビューを受けたいが、PR diff やドキュメントではなく「読みながら箇所を選んでコメントできる」形が欲しいとき。
- コードベースのウォークスルー（技術スタック / アーキテクチャ / ドメイン / 中核ロジック / 状態 / フロー / デザイン+スクショ / コンポーネント / テスト / 論点）を 1 ファイルにまとめたいとき。
- 既存の `review/` 成果物を作り直す・章を足すとき。
- レビュアーから返ってきた `review-comments.json` を読み、優先度順に改善を反映するとき（末尾参照）。

## 成果物の構成

対象リポジトリに `review/` を作り、次を置く（`review/` は gitignore 推奨。base64 埋め込みで巨大かつ成果物だから）:

| ファイル | 由来 | 役割 |
| --- | --- | --- |
| `index.template.html` | **assets からコピー（そのまま）** | シェル + インライン CSS。`__TITLE__` 等のプレースホルダを持つ |
| `review.js` | **assets からコピー（そのまま）** | コメント機能本体（範囲選択・再アンカー・localStorage・書き出し・mermaid 描画起動） |
| `build.mjs` | **assets からコピー（そのまま）** | 設定・画像・mermaid を注入して `index.html` を生成する依存なしビルド |
| `vendor/mermaid.min.js` | **assets からコピー（そのまま）** | オフライン同梱の mermaid。図を使う時だけ build がインライン化（約 3MB） |
| `vendor/highlight.min.js` + `vendor/highlight-theme.css` | **assets からコピー（そのまま）** | オフライン同梱の構文ハイライト。コードブロックがある時だけ build がインライン化（約 130KB） |
| `doc.html` | **毎回書く** | レビュー本文（章ごとの `<section>`）。雛形 `assets/doc.skeleton.html`。設計図は mermaid、コードは `<pre><code>` で書く |
| `review.config.json` | **毎回書く** | タイトル / localStorage キー / カテゴリ・優先度 / 画像マップ。例 `assets/review.config.example.json` |
| `index.html` | build が生成 | レビュアーに渡す単一ファイル（画像 base64 込み） |

## ワークフロー

### 1. 対象を理解する
`docs/` や `CLAUDE.md`、主要な `entities`/`features`/`pages`、中核ロジック（純粋関数・配点・schema）、
ルーティング、テスト構成、デザイントークンを読む。**本文に載せるコード抜粋は実ファイルから正確に取る**（記憶で書かない）。
広い調査は subagent に投げ、結論だけ持ち帰ると速い。

### 2. 雛形を配置する
このスキルの `assets/` から `review/` へ:
- `index.template.html` / `review.js` / `build.mjs` をそのままコピー。
- `vendor/` 一式（`mermaid.min.js` / `highlight.min.js` / `highlight-theme.css`）を `review/vendor/` にコピー（build がここから読む。図やコードを使うなら必須。丸ごとコピーで可）。
- `doc.skeleton.html` を `review/doc.html` としてコピー（これから埋める）。
- `review.config.example.json` を `review/review.config.json` としてコピー（これから書き換える）。

### 3. スクショを用意する（任意だが推奨）
主要画面の PC / SP を撮る。Playwright VRT 構成なら `e2e/**/*-snapshots/*-darwin.png`（or `*-linux.png`）が手頃。
無ければ `playwright` / `chrome-devtools` MCP で撮って任意の場所に保存。撮ったファイルのパスを次の config に書く。

### 4. `review.config.json` を書く
`title`（プロジェクト名）、`storeKey`（**プロジェクト固有**の localStorage キー。他成果物とコメントが混ざらないように）、
必要なら `categories`/`priorities`、そして `images`（`doc.html` の `data-img` キー → 画像の相対パス。`imageBase` 既定はリポジトリ root）。

### 5. `doc.html` を書く
雛形の各 `<section>` を実装内容で埋める。**各 section に安定した `id` と `data-title` を必ず付ける**
（`id`=コメントのアンカー、`data-title`=書き出す JSON の章名。後から変えない）。表・図・コード抜粋・スクショで
「読めば設計が分かる」状態にし、`review-points` に**迷っている設計判断**を厚く書く。

設計書の図は **mermaid** で一通り描く: 依存グラフ（`flowchart`）/ コンポーネント構成（`graph`）/
シーケンス（`sequenceDiagram`）/ ドメイン（`classDiagram` or `erDiagram`）/ 状態遷移（`stateDiagram-v2`）。
`<pre class="mermaid">…</pre>` と書くだけで `file://` でも描画される。**図はコメント対象外なので、各図の直後に説明文の段落を必ず添える**（指摘はその文に付く）。

利用できる CSS コンポーネント（`hero`/`tag`/`grid`/`fsd`/`flow`/`swatches`/`figure img.shot`/`note` 等）と
mermaid の図種別・作法は **`references/authoring-guide.md`** に全部ある。着手前に必ず読むこと。

### 6. ビルドする
```sh
node review/build.mjs
```
`review/index.html` が生成される（未置換プレースホルダ 0・画像枚数・title がログに出る）。

### 7. 検証する
ブラウザで実機確認してから渡す。観点と `chrome-devtools` での自動確認レシピ（範囲選択→コメント→JSON 書き出しの再現）は
**`references/verification.md`** にある。最低限: コンソールエラー無し / 画像 base64 ロード / **mermaid 図が全て SVG 描画される（`Syntax error` が出ていない）** / **コードに構文ハイライトが付く（`pre code.hljs`）** / 範囲選択でコメント生成 /
カテゴリ・優先度・本文の保存 / 再読込で復元 / 書き出し JSON のスキーマ / 全消去・読み込み。検証で作ったコメントは消して 0 件で渡す。

### 8. gitignore に追加する
製品 PR を汚さないよう、対象リポジトリの `.gitignore` に `review/` を追記（既に無ければ）。

## 書き出される JSON（後続改善の入力）

```json
{
  "project": "...",
  "generatedAt": "<ISO8601>",
  "source": "review/index.html",
  "count": 3,
  "comments": [
    { "id": "...", "section": "<data-title>", "anchorId": "<section id>",
      "quote": "<選択テキスト>", "category": "...", "priority": "高|中|低",
      "comment": "...", "createdAt": "<ISO8601>" }
  ]
}
```

## 返ってきたコメントを反映する

レビュアーから `review-comments.json` を受け取ったら:
1. 読んで `priority`（高→中→低）と `section` でグルーピングし、何を直すかを整理する。
2. 高 → 中 → 低 の順に改善を実施。各変更は対象リポジトリの品質ゲート（lint / typecheck / test / build / e2e）を緑に保ち、意味単位でコミットする。
3. 必要なら本文（`doc.html`）も更新して `node review/build.mjs` で作り直し、再レビューに回す。

## ガードレール

- **`review.js` / `index.template.html` / `build.mjs` は編集しない**（プロジェクト間で共通の完成資産）。挙動を変えたくなったらこの skill 側の `assets/` を直す。
- **`storeKey` はプロジェクト毎に固有**にする。`file://` の localStorage は取り違えが起きやすい。
- **section の `id` はコメント付与後に変えない**（再アンカーが外れる）。章立ては最初に確定。
- **コード抜粋は実ファイルから**。古い記憶やそれっぽい再現で書かない。
- **製品コードは変更しない**（このタスクはレビュー成果物の生成のみ）。`review/` は gitignore。
- 機械固有の絶対パス（ホームディレクトリ等）を `doc.html` / config に焼き込まない。画像は `imageBase` 相対で書く。
- **mermaid・highlight.js は同梱（`vendor/`）をインライン化する。CDN 参照に置き換えない**（`file://` オフラインで描画・ハイライトされる単一ファイルを保つため）。図はコメント対象外なので、各図に説明文を添える。
