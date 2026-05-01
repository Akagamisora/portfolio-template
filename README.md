# vercel-next-template

Next.js 16（App Router）を [Vercel](https://vercel.com) にデプロイし、[Supabase](https://supabase.com) で認証・PostgreSQL、[Prisma](https://www.prisma.io) で DB アクセスするテンプレートです。**エンジニア向けポートフォリオ**（トップ・プロジェクト一覧・詳細）を匿名で閲覧でき、**`/admin` 配下はログイン必須**でプロフィールとプロジェクトを編集できます。

## 前提

- Node.js / npm
- Supabase プロジェクト（Auth + Database を有効化）
- Vercel プロジェクト（任意。ローカルのみでも可）

## セットアップ

1. 依存関係をインストールします。

   ```bash
   npm install
   ```

2. ルートに `.env` を作成し、次の変数を設定します。
   - **NEXT_PUBLIC_SUPABASE_URL** / **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase の Project Settings → API
   - **DATABASE_URL**: Transaction pooler（例: ポート 6543）の接続文字列。Prisma の実行時接続に使用（開発・本番・プレビューの実行時に必須）
   - **DIRECT_URL**: 直結（ポート 5432）の接続文字列。`prisma migrate` などに使用
   - **NEXT_PUBLIC_SITE_URL**（任意）: メール確認などのコールバック組み立てに使用（未設定時はリクエストヘッダから推定）。公開ページの Open Graph などで絶対 URL が必要な `metadataBase` にも使います。
   - **ADMIN_EMAIL** または **ADMIN_EMAILS**（任意）: カンマ区切りでメールアドレスを指定すると、そのメールのユーザーのみが管理画面にアクセスできます。未設定の場合は **ログインできたユーザー全員** が編集可能になるため、本番では指定を推奨します。

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

6. 初回は [http://localhost:3000/signup](http://localhost:3000/signup) でアカウントを作成し、[http://localhost:3000/admin](http://localhost:3000/admin) から **プロフィール** と **プロジェクト** を登録してください（公開ページは DB の内容をそのまま表示します）。

## サイト構成

| パス                                    | 説明                                                        |
| --------------------------------------- | ----------------------------------------------------------- |
| `/`                                     | ポートフォリオトップ（プロフィール + 公開プロジェクト抜粋） |
| `/projects`                             | 公開プロジェクト一覧                                        |
| `/projects/[slug]`                      | 公開プロジェクト詳細（非公開は 404）                        |
| `/login`, `/signup`, `/confirm-sign-up` | Supabase 認証 UI                                            |
| `/admin`                                | 管理ダッシュボード（要ログイン）                            |
| `/admin/profile`                        | サイトプロフィール編集                                      |
| `/admin/projects`                       | プロジェクト CRUD                                           |

## Vercel

1. リポジトリを接続し、**Environment Variables** に上記と同じキーを設定します（本番・プレビューごとに Supabase プロジェクトを分けると安全です）。
2. ビルドは `npm run build`。`postinstall` で `prisma generate` が実行されます。
3. 本番 DB へのマイグレーションは CI または手動で `prisma migrate deploy` を実行する運用にしてください（初回デプロイ前に必須）。

## その他

- **認可の単一ソース**: ルート保護とセッション更新は Next.js 16 の [`src/proxy.ts`](./src/proxy.ts) に集約しています。**閲覧は匿名可**、**`/admin` のみ未ログイン時に `/login` へ**リダイレクトします。認証 UI パスは [`src/lib/auth/public-paths.ts`](./src/lib/auth/public-paths.ts) を参照してください。
- **管理画面の二重チェック**: [`src/lib/auth/require-user.ts`](./src/lib/auth/require-user.ts) の `requireAdminUser()` を `admin` レイアウトおよび管理用 Server Actions で利用し、書き込み前に必ず再検証してください。
- クライアントでログイン状態を表示する場合は、`pathname` が変わるたびに `getUser()` を繰り返すより **`supabase.auth.onAuthStateChange` で 1 本購読**する方が無駄な往復を減らせます（Vercel の React / Next ベストプラクティスでも推奨されるパターンです）。
- Prisma クライアントは [`src/lib/prisma.ts`](./src/lib/prisma.ts) から利用します。

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
