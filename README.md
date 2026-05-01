# vercel-next-template

Next.js 16（App Router）を [Vercel](https://vercel.com) にデプロイし、[Supabase](https://supabase.com) で認証・PostgreSQL、[Prisma](https://www.prisma.io) で DB アクセスするテンプレートです。

## 前提

- Node.js / npm
- Supabase プロジェクト（Auth + Database を有効化）
- Vercel プロジェクト（任意。ローカルのみでも可）

## セットアップ

1. 依存関係をインストールします。

   ```bash
   npm install
   ```

2. ルートに `.env` を作成し、[`.env.example`](./.env.example) を参考に値を設定します。

   - **NEXT_PUBLIC_SUPABASE_URL** / **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase の Project Settings → API
   - **DATABASE_URL**: Transaction pooler（例: ポート 6543）の接続文字列。Prisma の実行時接続に使用
   - **DIRECT_URL**: 直結（ポート 5432）の接続文字列。`prisma migrate` などに使用

3. データベースにマイグレーションを適用します。

   ```bash
   npx prisma migrate deploy
   ```

   開発時にローカルでスキーマを変える場合は `npx prisma migrate dev` を使います。

4. Supabase の **Authentication → URL Configuration** で、次を Site URL / Redirect URLs に追加します。

   - 開発: `http://localhost:3000`
   - コールバック: `http://localhost:3000/auth/callback`
   - 本番: デプロイ先のオリジンと `https://<your-domain>/auth/callback`

5. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) を開きます。

## Vercel

1. リポジトリを接続し、**Environment Variables** に `.env.example` と同じキーを設定します（本番・プレビューごとに Supabase プロジェクトを分けると安全です）。
2. ビルドは `npm run build`。`postinstall` で `prisma generate` が実行されます。
3. 本番 DB へのマイグレーションは CI または手動で `prisma migrate deploy` を実行する運用にしてください（初回デプロイ前に必須）。

## その他

- **認可の単一ソース**: ルート保護とセッション更新は Next.js 16 の [`src/proxy.ts`](./src/proxy.ts) に集約しています。公開パス一覧は [`src/lib/auth/public-paths.ts`](./src/lib/auth/public-paths.ts) で共有できます（RSC などから import 可能）。
- クライアントでログイン状態を表示する場合は、`pathname` が変わるたびに `getUser()` を繰り返すより **`supabase.auth.onAuthStateChange` で 1 本購読**する方が無駄な往復を減らせます（Vercel の React / Next ベストプラクティスでも推奨されるパターンです）。
- Prisma クライアントは [`src/lib/prisma.ts`](./src/lib/prisma.ts) から利用します。

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
