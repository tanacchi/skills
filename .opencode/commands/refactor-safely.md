---
{}
---

# Refactor Safely

## Objective

外部 behavior を維持しながら、構造・命名・責務を改善する。

## Context To Gather

- current behavior
- public contract
- call sites
- existing tests

## Steps

1. baseline behavior を確認する。
2. 変更を small step に分ける。
3. semantic change を混ぜない。
4. test を実行する。
5. diff を確認して不要変更を取り除く。

## Output Format

- Refactor goal
- Behavior preservation notes
- Tests run
- Remaining risks

## Safety

public API/schema を変える場合は refactor ではなく feature change として扱う。