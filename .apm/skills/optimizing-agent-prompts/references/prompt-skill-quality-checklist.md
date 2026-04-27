# Prompt And Skill Quality Checklist

- `description` は何をするか、いつ使うか、関連 keyword を含む。
- skill name は lowercase letters, numbers, hyphens のみ。
- `SKILL.md` は workflow と guardrails に集中している。
- 詳細 reference は one level deep で、名前から内容が分かる。
- agent に選択肢を出しすぎず、default を示している。
- destructive action、secret、external write の境界が明確。
- output format が user の意思決定に使いやすい。
- evaluation scenario が最低 2-3 個ある。
- stale な practice は latest check workflow に逃がしている。
