# React Guidelines

- component は responsibility を小さく保つ。
- props は表示に必要な最小限にする。
- derived state は state にしない。
- async state は loading, success, empty, error を明示する。
- form は validation timing と submit failure を決める。
- test は user-visible behavior を中心に書く。
