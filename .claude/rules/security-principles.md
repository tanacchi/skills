# Security Principles

- secrets, tokens, credentials を repository に入れない。
- input validation と authorization boundary を確認する。
- log に個人情報や secret を出さない。
- dependency や external call の trust boundary を意識する。
- destructive command は明示承認を得る。
