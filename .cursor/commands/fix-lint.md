# Lint・Format 修正

プロジェクトのLintとFormatを実行し、エラーを修正してください。

## 手順

1. `npm run lint` を実行してエラーを確認
2. `npm run fmt:check` でフォーマット差分を確認
3. エラーがあれば該当ファイルを修正
4. `npm run fmt` でフォーマットを適用
5. 再度 `npm run lint` でエラー解消を確認

## 補足

- このプロジェクトでは `oxlint`、`eslint`、`oxfmt` を使用
- ルールファイル: `eslint.config.mjs`、`.oxfmtrc.json`、`.oxlintrc.json`
