# 生成した index.html の検証手順

`review/index.html` を生成したら、ブラウザで実機確認してから渡す。レビュアーの環境で
「描画される・コメントできる・JSON が出る」を保証するのが目的。`chrome-devtools` MCP が
あれば自動で、無ければ `open review/index.html` で目視。

## まず静的チェック（ビルド直後）

```sh
# 未置換プレースホルダが無いこと（0 のはず）
grep -c "__DOC__\|__IMAGES__\|__SCRIPT__\|__CONFIG__\|__TITLE__" review/index.html
# data-img のキーが全て埋め込まれたか（doc.html のキーと config の images が一致しているか）
grep -o 'data-img="[a-z_]*"' review/doc.html | sort -u
grep -oc 'data:image' review/index.html       # 画像枚数
```

## ブラウザ検証（chrome-devtools MCP）

`file://` で開いてから、`evaluate_script` で機械的に確認する。手で範囲ドラッグする代わりに、
Selection API で Range を作り `mouseup` を発火 → `floatBtn` をクリックする流れを再現できる。

確認する観点:

1. **コンソールエラーが無い**（`list_console_messages`）。
2. **本文と画像が描画**: 各 `<section>` が出ている／`img.shot` が `naturalWidth > 0`（base64 が解けた）。
2.5. **mermaid 図が描画**: `.mermaid` が全て `data-processed` 属性を持ち中に `<svg>` がある。`Syntax error` テキストが出ていない。コンソールに mermaid のパースエラーが無い。図の中を範囲選択しても `floatBtn` が出ない（図はコメント対象外）。
2.6. **コードに構文ハイライト**: `#doc pre code` が全て `.hljs` クラスを持ち、`[class^="hljs-"]` のトークン span が色付きで存在する。コンテナ背景は淡色（`#f3f6f4`）のまま。ハイライト済みコードを範囲選択してもコメントが作れる（span を跨いでも `wrapRange` が機能する）。
3. **範囲選択 → コメント生成**: 選択して `mouseup` → `floatBtn` 表示 → クリックで `<mark class="cmt">` が付き、`localStorage[storeKey]` に 1 件入る。
4. **カテゴリ/優先度/本文の入力が保存**: カード内の `select`/`textarea` を変更 → `input` 発火 → localStorage に反映。
5. **再読込で復元**: reload 後、引用テキストで再アンカーされハイライト・カード・件数が戻る。
6. **書き出し JSON のスキーマ**: `submitBtn` の出力が
   `{project, generatedAt, source, count, comments:[{id, section, anchorId, quote, category, priority, comment, createdAt}]}`。
   `URL.createObjectURL` を一時的に差し替えれば Blob の中身を読める。
7. **全消去 / 読み込み**が動く（submit→import のラウンドトリップ）。

検証で localStorage に書いたテストコメントは最後に `localStorage.removeItem(storeKey)` で掃除し、
成果物を初期状態（0 件）で渡す。

### evaluate_script の型（コメント生成の再現）

```js
async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const doc = document.getElementById('doc');
  // 適当な長さのテキストノードを選ぶ
  const w = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.nodeValue.trim().length > 10 ? 1 : 2 // ACCEPT : REJECT
  });
  const t = w.nextNode();
  const r = document.createRange();
  r.setStart(t, 0); r.setEnd(t, 8);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  doc.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  await sleep(20);
  document.getElementById('floatBtn').click();      // コメント確定
  await sleep(10);
  // ここで localStorage / mark / panel / submit JSON を検査
};
```

注意: `evaluate_script` の return オブジェクトはプロパティが**最後に評価される**ので、
`clearBtn.click()` のような破壊操作より**前に** `const` で値を確定させてから return する。
（件数を return 内でインライン取得すると clear 後の値を拾って誤判定する。）

## 目視（MCP が無い場合）

`open review/index.html` → 本文を範囲選択して「💬 コメント」→ カテゴリ/優先度/本文を入れる →
再読込で残る → 「すべて書き出す」で `review-comments.json` が落ちる、を手で一通り。
