# スケルトン実装ガイド

## 目的

BDD シナリオを実行可能にしつつ、本実装の基盤となる型安全な骨格を構築する。
ビジネスロジックは空実装だが、コンパイルとテスト実行が通る状態を作る。

## ディレクトリ構造

```text
src/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── aggregates/
│   ├── repositories/   # インターフェースのみ
│   └── services/
├── application/
│   ├── commands/
│   ├── queries/
│   └── handlers/
├── infrastructure/
│   ├── persistence/
│   └── external/
└── presentation/
    ├── controllers/
    └── routes/
```

各ディレクトリに `index.ts` を作成してエクスポートを管理する。

## 段階的実装手順

### Phase 1: コア型定義とインターフェース

1. エンティティ・値オブジェクトを**表形式**でプロパティとメソッドを列挙する
2. リポジトリインターフェースを Result 型で定義する
3. ドメインエラー型を定義する（エラー名・コード・HTTPステータス）

**エンティティ設計表の必須列**:

| エンティティ名 | プロパティ | 型 | 必須 | バリデーション |
|---|---|---|---|---|

**メソッド設計表の必須列**:

| エンティティ名 | メソッド名 | 引数 | 戻り値 | 責務 |
|---|---|---|---|---|

### Phase 2: アプリケーション層の骨組み

- コマンド・クエリの型定義
- ハンドラーの空実装（`throw new Error('Not implemented')`）
- レスポンス DTO の型定義

### Phase 3: インフラ層の空実装

- リポジトリの空実装（固定値返却 or `Promise.resolve(ok(undefined))`）
- 外部サービスの空実装

### Phase 4: プレゼンテーション層の接続

- コントローラーのシグネチャ定義とハンドラー呼び出し骨格
- ルーティング設定

## 完了判定

- `any` 型・型アサーション・Non-null assertion なし
- BDD テストが "Method not found" ではなく "Assertion failed" になる
- TypeScript コンパイルエラーゼロ
- スケルトン完成後にユーザーへレビュー依頼

## 表形式設計書サンプル

```typescript
// 値オブジェクト実装例
export class Email {
  private static readonly REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private readonly _value: string) {
    if (!Email.REGEX.test(_value)) throw new InvalidEmailError(_value);
  }

  get value(): string { return this._value; }
  equals(other: Email): boolean { return this._value === other._value; }
}

// リポジトリインターフェース例
export interface IUserRepository {
  findById(id: UserId): Promise<Result<User, NotFoundError>>;
  save(user: User): Promise<Result<void, PersistenceError>>;
}
```
