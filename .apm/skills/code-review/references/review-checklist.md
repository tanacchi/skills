# Review Checklist

- 変更目的と差分が一致しているか。
- null, empty, error, permission, timeout の扱いが妥当か。
- API/schema の backward compatibility が保たれているか。
- 既存テストが変更意図を守っているか。
- 新しい分岐や副作用に test gap がないか。
- secrets や過剰な log が入っていないか。
- rollback しやすい変更になっているか。
