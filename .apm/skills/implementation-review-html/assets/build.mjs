// レビュー用 HTML を組み立てる依存なしビルド。
//
// 同じディレクトリの index.template.html / doc.html / review.js と、
// review.config.json（タイトル・localStorage キー・カテゴリ/優先度・画像マップ）を読み、
// スクショを base64 で埋め込んだ単一ファイル index.html を生成する。
//
// 使い方:  node build.mjs            （このスクリプトと同じ階層で実行）
//          node <review-dir>/build.mjs   （どこから実行しても自分の階層を基準にする）
//
// review.config.json の形:
// {
//   "title": "プロジェクト名",                       // <title> と上部見出しに使う
//   "project": "プロジェクト名",                      // 任意。書き出す JSON の "project"。省略時は title
//   "storeKey": "myproject-review-comments",         // localStorage キー（プロジェクト毎に固有に）
//   "categories": ["バグ","設計","デザイン","文言","提案"],  // 任意。省略時は既定値
//   "priorities": ["高","中","低"],                  // 任意。省略時は既定値
//   "imageBase": "..",                               // 任意。画像パスの基準（既定: このファイルの親=リポジトリ root 想定）
//   "images": {                                       // doc.html の data-img のキー → 画像ファイルの相対パス
//     "home_desktop": "e2e/vrt/home.vrt.ts-snapshots/home-desktop-darwin.png"
//   }
// }
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));

function readConfig() {
  const p = join(dir, 'review.config.json');
  if (!existsSync(p)) {
    console.warn('[build] review.config.json が無いため既定値で進めます（画像なし）。');
    return {};
  }
  return JSON.parse(readFileSync(p, 'utf8'));
}

const config = readConfig();
const imageBase = join(dir, config.imageBase ?? '..');

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' };

function dataUri(relPath) {
  const buf = readFileSync(join(imageBase, relPath));
  const mime = MIME[extname(relPath).toLowerCase()] ?? 'image/png';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const imageEntries = Object.entries(config.images ?? {})
  .map(([key, rel]) => {
    try {
      return `${JSON.stringify(key)}: ${JSON.stringify(dataUri(rel))}`;
    } catch {
      console.warn(`[build] 画像が見つかりません: ${rel}（${key} はスキップ）`);
      return null;
    }
  })
  .filter(Boolean);

const title = config.title ?? '実装レビュー';

const runtimeConfig = {
  // 書き出す JSON の "project" に使う。後続でコメントを取り込む際の対象識別子。
  project: config.project ?? config.title ?? '実装レビュー',
  storeKey: config.storeKey ?? 'review-comments',
  categories: config.categories ?? ['バグ', '設計', 'デザイン', '文言', '提案'],
  priorities: config.priorities ?? ['高', '中', '低'],
};

const template = readFileSync(join(dir, 'index.template.html'), 'utf8');
const docHtml = readFileSync(join(dir, 'doc.html'), 'utf8');
const script = readFileSync(join(dir, 'review.js'), 'utf8');

// vendor をオフライン同梱。使う時だけ載せて軽さを保つ。<script>/<style> の閉じタグ文字列だけ無害化する。
function inlineVendor(file, used, label, guard) {
  if (!used) return '';
  const p = join(dir, 'vendor', file);
  if (!existsSync(p)) {
    console.warn(`[build] doc.html は ${label} を使っていますが vendor/${file} がありません。`);
    return '';
  }
  return readFileSync(p, 'utf8').replaceAll(guard, '<\\/' + guard.slice(2));
}

// mermaid: doc が .mermaid を使う時だけ（約 3MB）
const usesMermaid = /class="mermaid"/.test(docHtml);
const mermaidJs = inlineVendor('mermaid.min.js', usesMermaid, 'mermaid', '</script');

// highlight.js: doc にコードブロック <pre><code> がある時だけ（約 130KB + テーマ CSS）
const usesCode = /<pre>\s*<code/.test(docHtml) || /<code class="language-/.test(docHtml);
const hljsJs = inlineVendor('highlight.min.js', usesCode, 'コードハイライト', '</script');
const hljsCss = inlineVendor('highlight-theme.css', usesCode, 'コードハイライト', '</style');

const out = template
  .replaceAll('__TITLE__', title)
  .replace('<!--__DOC__-->', () => docHtml)
  .replace('/*__MERMAID__*/', () => mermaidJs)
  .replace('/*__HLJS__*/', () => hljsJs)
  .replace('/*__HLJS_CSS__*/', () => hljsCss)
  .replace('{/*__CONFIG__*/}', () => JSON.stringify(runtimeConfig))
  .replace('{/*__IMAGES__*/}', () => `{\n${imageEntries.join(',\n')}\n}`)
  .replace('/*__SCRIPT__*/', () => script);

writeFileSync(join(dir, 'index.html'), out);
const mb = (Buffer.byteLength(out) / 1024 / 1024).toFixed(2);
console.log(`[build] index.html を生成しました（${mb} MB, 画像 ${imageEntries.length} 点, mermaid ${usesMermaid ? '同梱' : 'なし'}, ハイライト ${usesCode ? '同梱' : 'なし'}, title="${title}"）`);
