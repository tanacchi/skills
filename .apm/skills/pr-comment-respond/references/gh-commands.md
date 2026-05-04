# gh CLI コマンド集 — PR コメント操作

## コメント取得

```bash
# インラインコメント (file/line/body 付き)
gh api repos/{owner}/{repo}/pulls/{N}/comments \
  --jq '.[] | {id, path, line, original_line, body, user: .user.login, created_at}'

# トップレベルのレビューコメント (approval/request-changes も含む)
gh pr view {N} --json reviews,comments \
  --jq '{reviews: .reviews, comments: .comments}'

# PR 番号を現在のブランチから推定
gh pr list --head "$(git branch --show-current)" --json number,url,title
```

## コメントへの返信

backtick 問題を避けるため JSON ファイル経由で渡す。
コミット ID は半角スペースで囲むだけでよい。GitHub PR コメントは SHA を自動リンクするためフル URL は不要。

```bash
SHA=$(git rev-parse --short HEAD)

cat > /tmp/reply.json << JSONEOF
{"body": "対応しました ( ${SHA} )。\n\n変更内容の要点。\n\n全ゲート (typecheck / lint / test / build) グリーン確認済みです。"}
JSONEOF

gh api repos/{owner}/{repo}/pulls/{N}/comments/{comment-id}/replies \
  --method POST \
  --input /tmp/reply.json
```

## PR 情報

```bash
# open / merged / closed を問わず番号指定
gh pr view {N} --json number,title,headRefName,baseRefName

# 現在の CI 状態
gh pr checks {N}

# 失敗ジョブのログを確認
gh run view {run-id} --log-failed
```

## owner/repo の取得

```bash
# remote URL から解析
git remote get-url origin
# 例: https://github.com/tanacchi/escape.git → tanacchi/escape
```
