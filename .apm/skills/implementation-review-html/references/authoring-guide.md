# 本文（doc.html）の書き方 — CSS コンポーネント図鑑と作法

`doc.html` はこのレビュー成果物で唯一プロジェクト固有の部分。`index.template.html` の
インライン CSS が用意している語彙を使って「読めば構造と設計が伝わる」ページを書く。
雛形は `assets/doc.skeleton.html`。

## 鉄則

1. **各 `<section>` に安定した `id` と `data-title` を付ける。**
   - `id` はコメントのアンカー（再読込時の復元キー）。`data-title` は書き出す JSON の `section` フィールドになる。
   - コメントが付いた後に `id` を変えると再アンカーが外れる。章立ては最初に確定させる。
2. **文章だけにしない。** 表・図・コード抜粋・スクショで具体を見せる。レビュアーが範囲選択して指摘できる「物」を置く。
3. **コードは実ファイルからの抜粋**。要点だけを残し、長い部分は `// …（中略）` で省く。丸ごと貼らない。
4. **「なぜそうしたか」を書く。** 非自明な設計判断・トレードオフこそレビューの主戦場。`architecture` と `review-points` に厚く。
5. **HTML として妥当に**。`<` 等を本文に出す場合はエスケープ（`&lt;`）。テンプレートの `__TITLE__` 以外のプレースホルダ（`__DOC__`/`__SCRIPT__`/`__IMAGES__`/`__CONFIG__`）を doc.html 内に書かない。

## 標準の章立て（実装レビュー）

`0 概要 / 1 技術スタック / 2 アーキテクチャ / 3 ディレクトリ構成 / 4 ドメインモデル /
5 中核ロジック / 6 状態管理 / 7 主要フロー / 8 デザイン / 9 UI コンポーネント /
10 テスト & 品質 / 11 レビュー観点`

プロジェクト次第で足し引きしてよい（API なら「エンドポイント設計」、CLI なら「コマンド体系」等）。
ただし **0 概要（使い方を含む）と 末尾のレビュー観点（書き出し導線）は必ず残す** — レビュアーの入口と出口だから。

UI も状態も持たない極小ライブラリなら、`デザイン`（スクショ）と `状態管理` は丸ごと落として
`概要 / スタック / アーキテクチャ / ディレクトリ / ドメイン型 / 中核ロジック / フロー / テスト / レビュー観点`
の最小セットでよい。無関係な空章を無理に埋めない。

## CSS コンポーネント図鑑

見出し:
```html
<h2><span class="no">2</span> アーキテクチャ</h2>   <!-- .no は章番号を緑で揃える -->
<h3>サブ見出し</h3>
```

ヒーロー（概要の導入ブロック）と導入文・タグ:
```html
<div class="hero">
  <h2><span class="no">0</span> 概要</h2>
  <p class="lead">大きめの導入文。</p>
  <p>
    <span class="tag ok">CI 緑</span>     <!-- 緑系（良い状態） -->
    <span class="tag">中立タグ</span>      <!-- 既定（グレー） -->
    <span class="tag cta">注目</span>      <!-- コーラル系 -->
    <span class="tag flag">注意</span>     <!-- 赤系 -->
  </p>
</div>
```

表（最頻出。仕様表・データ表・ゲート表すべてこれ）:
```html
<table class="grid">
  <tr><th>見出し</th><th>値</th></tr>
  <tr><td>行</td><td>値</td></tr>
  <tr class="good"><td>強調行</td><td>緑背景で目立たせる</td></tr>
</table>
```

レイヤー図（依存方向。上が上位）:
```html
<div class="fsd">
  <div class="lyr"><b>pages</b><span>ページ composition</span></div>
  <div class="arrow">▲ 依存</div>
  <div class="lyr"><b>shared</b><span>ui / lib</span></div>
</div>
```

横並びフロー図:
```html
<div class="flow">
  <span class="step">一覧</span><span class="sep">→</span>
  <span class="step">詳細</span><span class="sep">→</span>
  <span class="step alt">分岐</span>      <!-- .alt は特殊/バッド経路をコーラルで -->
</div>
```

コードブロック / インラインコード:
```html
<pre><code>export function score(input) {
  // 実ファイルからの抜粋
}</code></pre>
<p>関数 <code>score()</code> は…</p>
```

カラースウォッチ:
```html
<div class="swatches">
  <span class="sw"><i style="background:#1f7a5a"></i> brand 信頼グリーン</span>
</div>
```

スクリーンショット（`data-img` キーは `review.config.json` の `images` と一致必須）:
```html
<figure>
  <img class="shot" data-img="home_desktop" alt="一覧（PC）" />
  <figcaption>説明</figcaption>
</figure>
<div class="shots">                          <!-- 2 カラムで並べる -->
  <figure class="sp"><img class="shot" data-img="detail_mobile" alt="詳細（SP）" /><figcaption>…</figcaption></figure>
  <figure class="sp"><img class="shot" data-img="home_mobile" alt="一覧（SP）" /><figcaption>…</figcaption></figure>
</div>
```

補足ノート:
```html
<div class="note">中立の補足（左に緑のライン）。</div>
<div class="note pt">行動を促すノート（コーラル）。書き出し導線などに。</div>
```

## mermaid 図（設計書の図）

設計書に必要な図は **mermaid** で描く。`<pre class="mermaid">…</pre>` と書くだけ。mermaid v10 は
**オフライン同梱**されていて、`doc.html` が `.mermaid` を 1 つでも使うと build が約 3MB を `index.html` に
インライン化する（使わなければ載らないので軽いまま）。CDN 不要・`file://` で描画される。

設計書に一通り欲しい図と mermaid の種別:

| 目的 | mermaid | 例 |
| --- | --- | --- |
| 依存グラフ / レイヤー | `flowchart TD` / `graph TD` | `flowchart TD` → `app --> pages --> shared` |
| モジュール・コンポーネント構成 | `graph LR` | `UI[View] --> Core[logic]` |
| 処理の呼び出し順 | `sequenceDiagram` | `U->>V: 操作` / `V-->>U: 結果` |
| ドメイン（型構造・関連） | `classDiagram` | `Cart o-- LineItem` |
| ドメイン（テーブル/関連） | `erDiagram` | `CART ||--o{ LINE_ITEM : contains` |
| 状態遷移 | `stateDiagram-v2` | `[*] --> Idle --> Running` |
| 工程・分岐判断など | `gantt` / 判断 `flowchart` | 必要に応じて |

書き方の作法:

- **図の直後に必ず説明文の段落を置く。** 図（描画後は SVG）は**範囲選択コメントの対象外**（コメント機能が図内の選択をブロックする）。レビュアーは図そのものではなく、図を説明する文に指摘を貼る。だから「何を表す図か・読みどころ」を 1〜2 文添える。
- `securityLevel: 'strict'` で描画する設定。ラベルに HTML やクリックを仕込まない。
- ノード ID やラベルに記号（`()[]{}:` 等）を生で入れない。ラベルに使いたいときは `node["費用 (税込)"]` のように `["…"]` で囲う。日本語ラベルはそのまま使える。
- `<pre>` 内のインデントはソースとして読まれる。**行頭を余計に字下げしない**（mermaid 構文はインデントに敏感）。
- 構文を誤ると**その図だけ**「Syntax error」表示になり他は壊れない。**ビルド後に必ずブラウザで全図の描画を確認**する（`verification.md` 参照）。

## スクリーンショットの集め方

- **画像は `data-img` キー → ファイルパス**で `review.config.json` の `images` に書く。パスは `imageBase`（既定はリポジトリ root）からの相対。
- Next.js + Playwright VRT 構成なら、ローカル生成の `e2e/**/*-snapshots/*-darwin.png` が手頃な実画面。Linux CI baseline（`*-linux.png`）でもよい。
- VRT が無いプロジェクトでは、`playwright`/`chrome-devtools` MCP で主要画面をスクショして任意の場所に保存し、そのパスを `images` に書く。PC は横長、SP は縦長を選ぶと図 8 がきれいに収まる。
- 画像が見つからないキーは build がスキップし、HTML 側は「画像未取得」プレースホルダになる（壊れない）。

## コード抜粋の選び方

- 「設計が現れる」場所を選ぶ: 中核ロジック（純粋関数・配点）、状態の schema と永続化、フローのオーケストレーション、重要な型定義。
- 1 抜粋 5〜25 行が目安。インポートや定型は削り、要点に `// …` を挿む。
- 抜粋は**実ファイルからコピー**して正確に。記憶で書かない。

### 構文ハイライト

`<pre><code>…</code></pre>` は**同梱の highlight.js でオフライン構文ハイライト**される（doc が
コードブロックを 1 つでも持つと build が約 130KB をインライン。無ければ載らない）。淡色背景の上に
トークン色が乗る。コメント機能とも両立する（ハイライト後のコードを範囲選択して指摘できる）。

- **言語を明示すると正確**: `<code class="language-ts">`（他に `language-tsx` / `js` / `json` / `bash` / `css` / `yaml` / `sql` / `python` など）。省略すると自動判定（TS が JS と判定される程度の差はあるが実害は小さい）。
- **ハイライト不要なブロック**（ディレクトリツリー等）は `class="language-plaintext"` を付ける。
- 図と同じく、コードブロック自体に長い指摘は付けづらいので、要点は本文の段落でも補足する。
