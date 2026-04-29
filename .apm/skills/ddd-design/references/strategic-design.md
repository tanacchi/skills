# 戦略的設計: Your Quiz

## ドメイン理解

- 先に requirements と scenario を読み、名詞を object candidate、動詞を behavior/event candidate として抽出する。
- business term と technical implementation term を分離する。
- code、API、docs、UI label の命名では日本語/英語 term を一貫して記録する。
- user-flow analysis と event storming は UI documentation だけでなく context boundary の入力として扱う。

## 境界づけられたコンテキスト

| context | 主要責務 | 境界の目印 |
| --- | --- | --- |
| Quiz Management | quiz creation、draft、approval、quality control、master data | approval と publishing rule が中心。 |
| Quiz Learning | deck、answering、judgement、progress | high-frequency answer flow と learning outcome が中心。 |
| User Session | anonymous identity、session lifecycle、permission | security/privacy と session ownership が中心。 |
| Offline Sync | offline storage、pending change、conflict handling | technical sync と reconciliation complexity が中心。 |

## コンテキストマッピング

- Quiz Management は Quiz Learning が使う approved quiz language を公開する。
- User Session は learning/creation flow に identity/session verification を提供する。
- Offline Sync は cached/local data が domain API に影響する前に anti-corruption boundary で変換する。
- Search/discovery は context 横断で read してよいが、無境界な domain model にしない。

## 戦略的設計の完了チェック

- context responsibility が cohesive で重複していない。
- term は ubiquitous language で定義されるか、open question として特定されている。
- context 横断 communication には API call、event、published language、customer/supplier、ACL などの named pattern がある。
- team/API/UI boundary を context map から導ける。

## 出典ドキュメント
- `../your-quiz/docs/instructions/shared/workflow/03.01_ddd-design.md`
- `../your-quiz/docs/instructions/shared/workflow/03.02_domain-understanding-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.02.5_user-flow-analysis-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.03_ubiquitous-language-creation-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.04_event-storming-workshop-guide.md`
- `../your-quiz/docs/instructions/shared/workflow/03.09_bounded-context-definition-guide.md`
- `../your-quiz/docs/project/ddd-design/2.02_domain-understanding/domain-knowledge-base.md`
- `../your-quiz/docs/project/ddd-design/2.03_ubiquitous-language/ubiquitous-language-dictionary.md`
