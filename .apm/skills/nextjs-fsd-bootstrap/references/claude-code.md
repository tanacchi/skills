# Claude Code 設定

このセクションは、 bootstrap 後にリポジトリで Claude Code を継続的に使うための設定。Claude が一貫したルールで動けるようにする。

## `CLAUDE.md`

ルールはトップに集約する。最低限カバーする項目:

- **FSD レイヤ依存方向** (下位 → 上位のみ、同層 cross-import 禁止、Public API 経由のみ)
- **data-testid 規約** (`testId(type, suffix)` ヘルパ経由のみ、prefix は意味的 ElementType 限定、E2E は `getByTestId` 限定)
- **`/app/` と `/pages/` の禁則** (`/app/` 配下にロジックを書かない、`/pages/` には Markdown 以外置かない)
- **TDD** (失敗するテストを先に書く)
- **カバレッジ 95% 閾値を下げない** (skip / 削除は禁止、根本対処)
- **コマンド早見表** (`pnpm dev / lint / test / e2e / storybook` …)
- **作業フロー** (計画 → テスト → 実装 → `pnpm typecheck && pnpm lint && pnpm test && pnpm build` 全緑 → 報告)
- **import エイリアス一覧** (`@app/*` `@pages/*` `@widgets/*` `@features/*` `@entities/*` `@shared/*`)
- **新規 slice の作り方** (`/scaffold-feature` slash command への誘導)

## `.claude/settings.json`

```jsonc
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(pnpm install)",
      "Bash(pnpm install --frozen-lockfile)",
      "Bash(pnpm dev)",
      "Bash(pnpm build)",
      "Bash(pnpm start)",
      "Bash(pnpm typecheck)",
      "Bash(pnpm lint)",
      "Bash(pnpm lint:fix)",
      "Bash(pnpm format)",
      "Bash(pnpm test)",
      "Bash(pnpm test:watch)",
      "Bash(pnpm test:storybook)",
      "Bash(pnpm storybook)",
      "Bash(pnpm build-storybook)",
      "Bash(pnpm e2e)",
      "Bash(pnpm e2e:vrt)",
      "Bash(pnpm e2e:update)",
      "Bash(pnpm e2e:install)",
      "Bash(pnpm exec playwright:*)",
      "Bash(pnpm exec biome:*)",
      "Bash(pnpm exec vitest:*)",
      "Bash(pnpm exec steiger:*)",
      "Bash(pnpm exec tsc:*)",
      "Bash(pnpm exec next:*)",
      "Bash(mise install)",
      "Bash(mise exec:*)",
      "Bash(mise ls:*)",
      "Bash(git status)",
      "Bash(git status:*)",
      "Bash(git diff)",
      "Bash(git diff:*)",
      "Bash(git log)",
      "Bash(git log:*)",
      "Bash(git show:*)",
      "Bash(git branch)",
      "Bash(git branch:*)",
      "Bash(ls)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(rg:*)",
      "Bash(find:*)"
    ],
    "deny": [
      "Bash(rm -rf /:*)",
      "Bash(git push --force:*)",
      "Bash(git push -f:*)",
      "Bash(git reset --hard:*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=\"$(jq -r '.tool_input.file_path // empty' <<<\"$CLAUDE_HOOK_PAYLOAD\")\"; if [[ \"$FILE\" == *.ts || \"$FILE\" == *.tsx || \"$FILE\" == *.js || \"$FILE\" == *.jsx || \"$FILE\" == *.json ]] && [[ \"$FILE\" != */node_modules/* && \"$FILE\" != */.next/* ]]; then pnpm exec biome check --write \"$FILE\" 2>/dev/null || true; fi"
          }
        ]
      }
    ]
  }
}
```

ポイント:

- `Bash(<cmd>:*)` の suffix は引数も許可するため。 `Bash(pnpm test)` だけでは `pnpm test --coverage` が拒否される。
- `deny` は明らかな破壊操作のみ。`git push --force-with-lease` などの安全側を全否定しないようワイルドカードに注意。
- PostToolUse hook で Biome を自動実行するときは **lint エラーで commit を止めず** に `|| true` で握る。Lint エラー本体は `pnpm lint` で別途検出される。
- Edit/Write 後の Biome 実行は `node_modules/` `.next/` を除外してからにする (重い解析回避)。

## `.claude/commands/scaffold-feature.md`

`/scaffold-feature <name>` で `src/features/<name>/` 配下に `ui/<PascalCase>.tsx`, `*.test.tsx`, `*.stories.tsx`, `index.ts` の雛形を作る slash command。

```markdown
---
description: 新しい FSD feature slice の雛形を生成する
argument-hint: <feature-name (kebab-case)>
---
```

中身は以下を伝える:

- 引数は kebab-case の検証
- ファイル雛形 4 種 (UI / test / story / index)
- testid は必ず `testId('region', '<kebab>-root')` で開始
- 生成後 `pnpm lint:fix && pnpm test --run src/features/$1` で動作確認
- FSD ルール (同層 cross-import 禁止 / index 経由のみ) を再掲

## 仕上げの確認

- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` が全部緑であること。
- CI が **新しい push に対して** 緑になること。
- VRT baseline が Linux 版で commit されていること。
- `CLAUDE.md` `.claude/settings.json` `.claude/commands/` が repo にコミットされていること。
- README に「Vercel Import 手順 / VRT baseline は Linux のみ commit / 必要環境」が書いてあること。
