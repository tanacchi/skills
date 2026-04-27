# Debug Issue

## Objective

不具合や失敗ログを調査し、再現条件、原因候補、修正案を整理する。

## Context To Gather

- error message
- reproduction steps
- recent changes
- logs and traces
- related tests

## Steps

1. symptom と expected behavior を分ける。
2. 再現条件を確認する。
3. related code path を追う。
4. 仮説を検証する。
5. 最小修正と test を提案する。

## Output Format

- Symptom
- Reproduction
- Root cause or hypotheses
- Fix
- Tests

## Safety

原因が未確定なら断定せず、次に確認すべき事実を書く。
