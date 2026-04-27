# Iterative Review Checklist

## First Pass

- 変更目的と diff が一致している。
- 新しい branch、error path、edge case が検証されている。
- API/schema/behavior の breaking change がない。
- security、authorization、data exposure の risk がない。

## Improvement Pass

- 指摘ごとに最小修正になっている。
- 修正で別の behavior を壊していない。
- test が failure mode を直接守っている。
- obsolete code や debug output が残っていない。

## Zero-base Pass

- PR title/body だけで目的が分かる。
- reviewer が読む順序を迷わない。
- diff size が妥当で、分割不能な理由が説明できる。
- 残リスクと未実行 check が明示されている。
