# 新規コンポーネント作成

「$ARGUMENTS」という要件のUIコンポーネントを作成してください。

## このプロジェクトの構成

- **フレームワーク**: Next.js 16 + React 19
- **UIライブラリ**: shadcn/ui 系（Base UI、Radix UI、Tailwind CSS）
- **コンポーネント配置**: `src/components/ui/`
- **スタイリング**: Tailwind CSS v4、`tw-animate-css`
- **ユーティリティ**: `src/lib/utils.ts` の `cn()` を使用

## 作成手順

1. 既存の `src/components/ui/` 配下のコンポーネント構成を参考にする
2. 各コンポーネントは `コンポーネント名/` フォルダに `コンポーネント名.tsx` と `index.ts` を配置
3. 必要に応じて `components.json` を確認し、shadcn/ui の規約に従う
4. 作成後、`npm run lint` と `npm run fmt` で問題がないか確認する

## 注意事項

- サーバーコンポーネントとクライアントコンポーネントの使い分けに注意（`'use client'`）
- インタラクティブな要素には適切なアクセシビリティ属性を付与する
