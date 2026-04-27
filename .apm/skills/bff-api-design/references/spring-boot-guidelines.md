# Spring Boot Guidelines

- controller は transport concern に集中させる。
- validation は request boundary で行う。
- service は business flow と downstream coordination を持つ。
- exception mapping は一貫した response に寄せる。
- integration test で serialization と validation を確認する。
