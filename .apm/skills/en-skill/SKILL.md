---
name: en-skill
description: Use this skill when the user asks to create or update a skill under .apm/skills/ in the tanacchi/skills repository. Wraps the /skill-creator workflow and adds repo-specific install and PR steps. Triggers on phrases like "skill を作って", "新しい skill", "skill を更新", "<name> skill を直して", or any request that targets .apm/skills/ skill authoring.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git, gh CLI, and the /skill-creator skill (Anthropic skill-creator plugin) available in the session.
---

# en-skill

`/skill-creator` の wrapper として、このリポジトリ (`tanacchi/skills`) の `.apm/skills/` 配下に skill を新規作成または更新し、global install と PR 作成までを一気通貫で行うための skill。

## 利用タイミング

- `.apm/skills/` 配下に新しい skill を追加してほしいと頼まれたとき。
- 既存 skill (`.apm/skills/<name>/SKILL.md` および `references/`) の更新を頼まれたとき。
- `/skill-creator` を素のまま起動したいわけではなく、このリポジトリの規約 (frontmatter shape, install.sh 経由の global symlink, claude/* ブランチでの PR) に乗せたいとき。

## 確認する入力

- 新規作成か既存更新か。
- skill 名 (kebab-case、ディレクトリ名と一致させる)。
- skill の目的、発火条件 (英語 description で agent triggering に使う文言)。
- 参考になる既存 skill (例: `code-review`, `your-quiz-project-knowledge`)。
- 補助 reference を `references/` に分けたいか。
- skill-creator の eval/iteration loop までやるか、draft → install → PR の最短ルートで進めるか。

曖昧な部分は AskUserQuestion で先に確認する。

## Workflow

1. **入力確認と衝突チェック**
   - 上記の入力を整理する。
   - `.apm/skills/<name>/` がすでに存在するかを `ls` で確認する。新規依頼なのに存在する場合は停止して、更新でよいか / 別名にするかを聞く。更新依頼なら現行 SKILL.md と `references/` を読んでから次へ進む。
   - 作業前に `git status` がクリーンであることを確認する。クリーンでなければ先にユーザーに状況を伝える。

2. **ブランチを切る**
   - 新規: `git checkout -b claude/add-skill-<name>`
   - 更新: `git checkout -b claude/update-skill-<name>`
   - main を base にする。既存の作業ブランチ上に重ねない。

3. **`/skill-creator` に委譲する**
   - Skill tool で `skill-creator:skill-creator` を呼び、書き込み先を `.apm/skills/<name>/` に指定する。
   - frontmatter は必ずこのリポジトリの 5 フィールド固定形式に揃える:

     ```yaml
     ---
     name: <name>
     description: <英語、agent triggering 用、具体的に発火条件を書く>
     license: MIT
     metadata:
       author: personal
       version: "0.1.0"
     compatibility: <必要な前提を 1 行で>
     ---
     ```

   - 本文は日本語。既存 skill の節構成 (利用タイミング / 確認する入力 / Workflow / Output Format / Guardrails / Related References) を踏襲する。
   - 補助情報は `references/<topic>.md` に分ける。SKILL.md 本体は短く、概念的な手順とポインタに絞る。

4. **eval/iteration をどこまでやるか確認する**
   - skill-creator が evals 提案フェーズに入ったタイミングで、ユーザーに「test prompts → 評価 → 改善ループまで回すか / 一旦 install と PR まで進めるか」を聞く。
   - 軽量タスクや既存 skill の小さな更新では、フルループは不要なことが多い。新規 skill で挙動が読めない場合は回す価値が高い。判断はユーザーに委ねる。

5. **`scripts/validate.sh` を実行する**
   - リポジトリ root から `scripts/validate.sh` を実行する。
   - 失敗したら出力された file path と理由を読み、frontmatter / ディレクトリ名整合 / 必須ファイルを直してから再実行する。skip や削除で逃げない。

6. **Global install を実行する**
   - 実行前に diff (作成された `.apm/skills/<name>/` の中身) と install 先 (`~/.claude/skills/<name>` 他 4 つの agent dir) をユーザーに見せて承認を得る。これはこのリポジトリの maintenance policy「global install command は実行前に確認する」を守るため。
   - 確認後、`scripts/install.sh --scope global --mode symlink --yes` を実行する。
   - 既存 symlink が別 target を指している場合、install.sh は上書きせず skip する。skip メッセージは無視せずユーザーに共有する。

7. **commit、push、PR を作成する**
   - `git add .apm/skills/<name>/` のみを stage する (`git add -A` や `git add .` は使わない)。
   - commit message は imperative の短文に揃える: `Add <name> skill` / `Update <name> skill`。必要なら 1 行で意図を補足する。
   - `git push -u origin <branch>` でリモートに push する。
   - `gh pr create --base main --title "<title>" --body "<body>"` で公開 PR を開く。draft フラグは付けない。本文はこの skill が何を増やす/変えるか、影響範囲、検証ステップを 3〜5 行で書く。HEREDOC を使う。
   - 完成したら PR URL を返す。

## Output Format

- 作成・更新した skill のパス (`.apm/skills/<name>/`)。
- `validate.sh` の結果 (passed / failed と要点)。
- global install で作成された symlink (`~/.claude/skills/<name>` など、`~/.codex/`, `~/.gemini/`, `~/.config/opencode/`, `~/.agents/` も含む)。
- PR URL。

## Guardrails

- `description` は英語で書く。本文は日本語で書く。これは既存 19 skill の暗黙規約。
- `name` field とディレクトリ名は必ず一致させる (`scripts/validate.sh` が落ちる)。
- secrets、API key、token、ユーザー home 配下から始まる絶対パスを skill 本文や references に書かない。`scripts/validate.sh` の `rg` チェックでも検出される。skill のリファレンスにファイルを示すときはリポジトリ root からの相対パス (例: `scripts/validate.sh`) を使う。
- `~/.claude/skills/<name>` がすでに別 target を指していたら、install.sh の skip メッセージに従い手動上書きはしない。ユーザーに状況を伝える。
- destructive な git 操作 (`git reset --hard`, `git push --force`, `git branch -D` 等) はユーザーの明示承認なしには使わない。
- `--no-verify` で commit hook を skip しない。hook が落ちたら原因を直す。
- skill 削除依頼はこの skill のスコープ外。別タスクとして扱う。
- skill-creator の `package_skill.py` (`.skill` ファイル生成) は使わない。`.apm/skills/` を直接編集する運用が正本。
- `apm install` (project scope への展開) は今回の global install フローには含めない。必要なら別途実施する。

## Related References

- `README.md` の "How To Add A Skill" セクション
- `scripts/validate.sh`
- `scripts/install.sh`
- 既存 skill のリファレンス: `.apm/skills/code-review/SKILL.md`, `.apm/skills/your-quiz-project-knowledge/SKILL.md`
