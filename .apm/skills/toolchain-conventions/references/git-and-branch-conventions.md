# Git・ブランチ規約

## コミット規約

- コミットは最小単位（論理的に独立したまとまり）で細かく行う。
- コミットメッセージは日本語で記載する。
- 1行目はサマリ（50文字以内）、2行目は空行、3行目以降に変更理由・背景を記述する。
- 抽象的なメッセージ（「修正」「wip」「機能追加」）は禁止。

```text
1行目：変更内容のサマリ（50文字以内）

変更理由と背景を記述する。
- 何を・なぜ変更したか
- 関連する制約・影響範囲
```

## ブランチ戦略

- ブランチはユーザー価値・機能要件を基準とした単位で分割する。
- 「〜したい」という要望1つに対して1ブランチ（技術単位での分割は避ける）。
- 独立してデプロイ可能な機能単位を目安にする。

```bash
# 良い例（ユーザー価値単位）
feature/user-profile-image-upload
feature/password-reset-email

# 悪い例（技術単位）
feature/add-multer-dependency
feature/update-user-model
```

## PR サイズ制限

- 1 PR の総差分行数を 500 行以内に制限する。
- 超える場合は機能分割を検討する。

```bash
# PR 作成前の差分行数確認
git diff --numstat origin/main | awk '{sum+=$1+$2} END {print "Total:", sum, "lines"}'
```

## 段階的コミット手順

1. `git status` で変更ファイルを確認する。
2. 関連性の高いファイル群を論理的にグループ化してステージングする。
3. コミット後に `git status` を確認し、unstaged/untracked がなくなるまで繰り返す。
4. 最終的に `nothing to commit, working tree clean` になることを確認する。

```bash
git status
git add src/models/User.ts src/types/UserTypes.ts
git commit -m "ユーザーモデルの型安全性強化\n\n詳細説明"
git status  # 残りを確認して繰り返す
```

## pre-commit フック

- `git commit --no-verify` / `-n` は絶対禁止（lint・format・テストの自動チェックをスキップしない）。
- フックエラー時は問題を修正してから再コミットする。

```bash
# フックエラー時の正しい対応
pnpm format   # フォーマット修正
pnpm test     # テスト修正
git add <files>
git commit -m "修正内容"  # 再コミット（--no-verify は使わない）
```

## GitHub CLI (gh) 活用

```bash
# PR 作成
gh pr create --title "feat: 機能名" --body-file .github/pull_request_template.md

# レビューとマージ
gh pr review 123 --approve
gh pr merge 123 --squash --delete-branch
```

## 禁止事項

- 意味のないコミットメッセージ（「修正」「wip」「バグ修正とリファクタリングと新機能追加」）
- `git commit --no-verify`
- 500 行を超える PR
- 技術単位でのブランチ分割
- destructive コマンド（`reset --hard`、`push --force`）の無承認実行
