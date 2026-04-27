# PR Publish Checklist

- `git status --short` で staging 対象を確認した。
- `git diff` と `git diff --staged` の両方を見た。
- secrets、token、local path、debug log が入っていない。
- validation command を実行したか、未実行理由を説明できる。
- branch が default branch 直作業でない。
- PR tree を user に提示し、parallel / stacked の構造と base branch を確認してもらった。
- 各 PR の base branch、parent PR、child PR、merge order を確認した。
- parallel PR は互いに独立しているか、conflict risk を説明できる。
- push 前に remote と branch 名を確認した。
- PR body に what, why, validation, risk がある。
- stacked PR の body に前提 PR、後続 PR、merge order、rebase/update 方針がある。
- draft PR として作成する。ただし user が ready-for-review を明示した場合だけ例外。
