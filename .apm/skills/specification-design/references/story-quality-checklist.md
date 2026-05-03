# ストーリー品質チェックリスト: Your Quiz

## ストーリーの形

- who: actor/persona が名付けられている。
- what: user-visible action または outcome が明確。
- when: trigger または situation が示されている。
- where: 関連する場合、screen/API/context が分かっている。
- why: learning、creation、quality、history、offline、search の value が明示されている。
- how well: acceptance criteria と non-functional constraint が測定可能。

## 受け入れ条件

- 少なくとも 1 つの success path と関連する error path を含める。
- implementation step だけでなく observable behavior を書く。
- 関連する場合、validation、empty、loading、offline、permission、conflict state を含める。
- data persistence または sync expectation を特定する。
- 後続で期待される API/UI/DDD/test artifact を特定する。

## 将来課題 の分離

- 実在するが延期する capability は 将来課題 に移す。
- 現在の MVP behavior に必要な core acceptance criteria は延期しない。
- assumption と open question は scope exclusion と分けて記録する。
- 将来 enhancement は original story または requirement に追跡できる形に保つ。

## レビュー質問

- この story は BDD または E2E で test できるか。
- story は新しい domain concept または invariant を含意しているか。
- story は新しい API contract を要求するか、それとも UI composition だけか。
- architecture、data retention、security、performance に影響するか。
- 想定 failure behavior は implementation できるほど明確か。

## 出典ドキュメント

- `../your-quiz/docs/instructions/shared/workflow/01.01_specification.md`
- `../your-quiz/docs/project/specifications/README.md`
- `../your-quiz/docs/project/specifications/user-stories/README.md`
- `../your-quiz/docs/project/specifications/future-work.md`
