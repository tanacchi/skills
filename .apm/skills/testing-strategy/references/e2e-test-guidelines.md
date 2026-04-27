# E2E Test Guidelines

- business-critical flow に絞る。
- selector は user-visible role/name を優先する。
- test data は独立させる。
- retry 前提の flaky test にしない。
- failure screenshot/log を CI artifact に残す。
