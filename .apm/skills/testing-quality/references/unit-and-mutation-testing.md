# Unit と Mutation テスト: Your Quiz

## Vitest による unit test

- aggregate invariant、value object validation、domain service、use case、helper、response mapping には unit test を使う。
- boundary value と error case には parameterized test を優先する。
- public behavior と contract を test し、偶発的な implementation detail を固定する test は避ける。
- fixture/builder は読みやすく、domain language に近く保つ。
- coverage target は高めだが、line-count を稼ぐことより意味ある behavior coverage を優先する。

## Stryker による mutation testing

- risk の高い domain/API logic で unit coverage を整えた後に mutation testing を実行する。
- surviving mutant は不足している assertion または equivalent mutation を示す。
- condition、branch、validation、error handling の意味ある survivor には test を追加する。
- output が変わらない behavior に brittle test を追加するのではなく、equivalent mutant として記録する。

## TDD フロー

- new behavior では、可能な範囲で green の前に red を確認する。
- test が通った後、domain/API behavior を保ちながら refactor する。
- 既存 behavior を変える場合は、先に bug または contract 周辺の regression test を書く。

## テストデータ

- normal、boundary、invalid、conflict case には fixture/builder を使う。
- test fixture に production data と secret を入れない。
- D1/DB test は test env で隔離する。

## 出典ドキュメント
- `../your-quiz/docs/instructions/shared/workflow/09.01_unit-testing.md`
- `../your-quiz/docs/instructions/shared/workflow/09.02_mutation-testing.md`
- `../your-quiz/docs/instructions/shared/workflow/10.01_implementation.md`
