---
name: pr-comment-respond
description: Use this skill when addressing review comments on a pull request — fetching inline and review thread comments, implementing code fixes with quality gates, committing, pushing, and replying to each comment thread with a resolution summary. Triggers on phrases like "PR コメントに対応して", "レビューコメントを直して", "PR コメントの返信をして", "address PR comments", or "respond to review".
license: MIT
metadata:
  author: personal
  version: "0.2.0"
compatibility: Requires git, gh CLI (authenticated), and a project with defined quality-gate commands.
---

# pr-comment-respond

PR のインラインコメント・レビューコメントを取得し、コードを修正して、各スレッドに返信するまでの一連フローを担うスキル。

## 利用タイミング

- PR に届いたレビューコメントへの対応を依頼されたとき。
- 「PR コメントに対応して」「レビューコメントを直して」などのフレーズを受けたとき。
- コード修正・コミット・返信を一気通貫で行いたいとき。

## 確認する入力

- 対象 PR 番号 (未指定なら現在のブランチから `gh pr list` で推定する)。
- プロジェクトの quality-gate コマンド (例: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`)。
- 複数コメントがある場合の優先度・依存関係 (独立なら並列対応可)。
- 不明なコメント内容は AskUserQuestion で確認してから着手する。

## Workflow

### 1. コメント取得

```bash
# インラインコメント (file/line 付き)
gh api repos/{owner}/{repo}/pulls/{N}/comments \
  --jq '.[] | {id, path, line, body, user: .user.login}'

# レビュー全体コメント
gh pr view {N} --json reviews --jq '.reviews[] | {id, state, body, author}'
```

現在のリポジトリが不明な場合は `git remote get-url origin` で取得する。

### 2. コメントの分類と優先順位付け

| 分類 | 判断基準 | 対処 |
|---|---|---|
| 即対応 | コード変更を必要とする明確な指摘 | Workflow 3 へ |
| 確認要 | 意図・設計判断が曖昧 | AskUserQuestion で聞く |
| 議論 | スタイル好みや設計議論 | ユーザーに方針を確認 |

### 3. コード修正 (TDD 順守)

1. 既存テストが失敗しないことを確認する。
2. 指摘への対処として **テストを先に書く** (挙動変化を伴う場合)。
3. 実装を変更する。
4. Quality gates をすべて通す。

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

プロジェクト固有のコマンドがあれば読み替える。gate が 1 つでも赤の場合は次に進まない。

### 4. コミットとプッシュ

**1 コメントスレッド = 1 コミット** を原則とする。複数コメントが同一ファイルに絡む場合は例外的にまとめる。

- コミットメッセージに「Resolves: PR #N review comment on <path>:<line>」を入れて追跡可能にする。
- **コミット後、必ず push してから** 次の返信ステップへ進む。push 前に返信すると SHA がリモートに存在しない状態になる。

```bash
git push origin <current-branch>
```

### 5. コメントへの返信

**push が完了してから** 返信する。各コメントスレッドに対して 1 返信を投稿し、そのスレッドで対応したコミット ID のリンクを必ず添える。

返信本文に含めるべき要素:
- 対応したコミット ID の **GitHub リンク** (バッククォートではなく半角スペースで挟む)
- 変更内容の要点 (何を、なぜ変えたか)
- Quality gates の結果

コミット SHA とリンクの組み立て:

```bash
SHORT_SHA=$(git rev-parse --short HEAD)
FULL_SHA=$(git rev-parse HEAD)
REPO=$(git remote get-url origin | sed 's|.*github.com[/:]||' | sed 's|\.git$||')
LINK="[${SHORT_SHA}](https://github.com/${REPO}/commit/${FULL_SHA})"
```

インラインコメントへの返信は **必ず JSON ファイル経由**で行う (backtick をシェルが解釈するのを防ぐため)。

```bash
cat > /tmp/reply.json << 'EOF'
{"body": "対応しました ( [abc1234](https://github.com/owner/repo/commit/abc1234fullsha) )。\n\n<変更内容の要点>。\n\n全ゲート (typecheck / lint / test / build) グリーン確認済みです。"}
EOF

gh api repos/{owner}/{repo}/pulls/{N}/comments/{comment-id}/replies \
  --method POST \
  --input /tmp/reply.json
```

### 6. 完了報告

すべてのコメントへの対応が終わったら、変更内容・コミット・テスト結果をまとめてユーザーに報告する。

## Output Format

- 取得したコメント一覧 (path / line / 要点)
- 対応内容サマリ (コメントごと)
- Quality gates の結果
- 各コメントへの返信 URL または `gh api` レスポンスの `id`

## Guardrails

- コメント内容が曖昧な場合は **推測で実装しない**。AskUserQuestion で確認する。
- quality gates が赤のままコミット・返信しない。
- **返信は push 後**。push 前のコミット SHA をリンクに含めても GitHub 上でリンク切れになる。
- **1 スレッドに 1 返信**。同一スレッドに複数回返信しない。
- 返信文中の backtick を含む文字列は **JSON ファイル経由**で渡す (`--field body=` では bash がバッククォートを解釈する)。
- コミット ID は `[sha](url)` 形式でリンク化し、半角スペースで囲む。バッククォートは使わない。
- `--no-verify` で commit hook を skip しない。
- テストを skip・削除して gate を通過させない。根本解決のみ。

## Related References

- `references/gh-commands.md`
