# レイヤード実装パターン

## ドメイン層: エンティティ実装順序

1. `{entity-name}-schema.ts` — Brand 型 + Zod スキーマ + ビジネスルール制約
2. `{entity-name}-patches.ts` — バリデーション失敗時の自動修正候補
3. `{EntityName}.ts` — エンティティクラス + `parse` 関数 + Draft クラス
4. `{EntityName}.spec.ts` — Brand 型・Entity 作成・ビジネスロジック・Draft テスト

### エンティティ設計原則

- **完全イミュータブル**: 変更操作はすべて新インスタンスを返す
- **Result 型**: ビジネスロジックメソッドは `Result<T, Error>` を返す。例外 throw なし
- **ファクトリメソッド**: `Entity.from(unknown)` で外部入力を検証して生成
- **Brand 型**: ID 等のプリミティブは Brand 型でランタイム検証も兼ねる

```typescript
// parse 関数 — 統一エントリポイント
export function parseUser(input: unknown): UserParseResult {
  const parsed = UserSchema.safeParse(input);
  if (parsed.success) return ok(User.build(parsed.data));
  const issues = toIssues(parsed.error);
  const patches = suggestUserPatches(input, issues);
  return err({ kind: 'parse', issues, patches });
}

// ビジネスロジックメソッド例
changeName(newName: UserName): UserParseResult {
  if (!this.canBeUpdated()) {
    return err({ kind: 'parse', issues: [{ path: ['status'], code: 'custom', message: '...' }], patches: [] });
  }
  return this.with({ name: newName.value });
}
```

## アプリケーション層: ユースケース実装

```
入力バリデーション → ドメインオブジェクト生成 → ビジネスロジック → 永続化 → DTO 変換
```

- コンストラクタでリポジトリIF・外部サービスIFを受け取る（DI）
- 具体的な永続化技術・フレームワークへの依存を持たない
- トランザクション境界はアプリケーション層で管理する

```typescript
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(cmd: RegisterUserCommand): Promise<Result<UserId, DomainError>> {
    const emailResult = Email.from(cmd.email);
    if (emailResult.isErr()) return err(emailResult.error);

    const user = User.create(UserId.generate(), emailResult.value);
    await this.userRepository.save(user);
    return ok(user.id);
  }
}
```

## インフラ層: リポジトリ実装

- 永続化例外はドメインエラー（`PersistenceError` 等）に変換して返す
- N+1 クエリ・トランザクション管理はインフラ層に閉じ込める
- ドメインオブジェクト ↔ DB レコードの変換もインフラ層で完結させる

## エラー階層設計

| エラー分類 | 基底クラス | 用途 |
|---|---|---|
| バリデーション | `DomainError` | 入力不正・業務ルール違反 |
| Not Found | `DomainError` | リソース未存在 |
| 永続化 | `InfrastructureError` | DB/外部サービス障害 |

```typescript
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;
}

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  readonly httpStatus = 404;
  constructor(userId: string) {
    super(`User not found: ${userId}`);
  }
}
```

## TDD サイクル

1. **Red**: ユースケースのテストを書く（失敗を確認）
2. **Green**: テストを通す最小実装を書く
3. **Refactor**: 重複排除・可読性向上
4. カバレッジ 95% 以上達成後に BDD テストで統合確認
