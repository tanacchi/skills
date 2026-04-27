# Safe Refactoring

- 変更前に current behavior を説明できる状態にする。
- public API, schema, event, file format を不用意に変えない。
- mechanical change と semantic change を分ける。
- diff が大きい場合は commit を分割できる単位にする。
- validation command を最初と最後で揃える。
