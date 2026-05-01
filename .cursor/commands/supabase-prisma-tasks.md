# Supabase / Prisma 関連作業

Supabase（認証・Postgres）と Prisma を使う前提の作業を行ってください。「$ARGUMENTS」を参照して対応します。

## 参照パス

- **Supabase クライアント**: `src/utils/supabase/client.ts`（ブラウザ）、`src/utils/supabase/server.ts`（サーバー）
- **認証 Server Actions**: `src/app/login/actions.ts`、`src/app/signup/actions.ts`、`src/app/confirm-sign-up/actions.ts`
- **セッション更新・ルート保護**: `src/proxy.ts`（Next.js 16 の Proxy 規約）。認可の単一ソースはここ。**`/admin` のみ未ログインを `/login` へ**、認証済みがログイン系パスに来た場合は `/admin` へ。公開パスは `src/lib/auth/public-paths.ts`（`isPublicAuthPath` / `isAdminPath`）
- **メールリンク完了**: `src/app/auth/callback/route.ts`
- **Prisma**: `prisma/schema.prisma`、`src/lib/prisma.ts`
- **環境変数**: `.env.example`（実値は Vercel / ローカル `.env` にのみ）

## よくある作業

1. **スキーマ変更**: `prisma/schema.prisma` を編集 → `npx prisma migrate dev`（ローカルで DB 接続が必要）
2. **本番マイグレーション**: `npx prisma migrate deploy`（`DATABASE_URL` / `DIRECT_URL` が必要）
3. **Supabase ダッシュボード**: Auth の Redirect URLs に `http://localhost:3000/auth/callback` と本番 URL を追加

## 注意

- クライアントでユーザー表示が必要なときは、`pathname` 依存で繰り返し `getUser()` するより `onAuthStateChange` など 1 本の購読を検討（無駄な往復を避ける）
- `.env*` は `.gitignore` 対象（機密情報を含む可能性）
- `NEXT_PUBLIC_*` はクライアントに露出するため、anon key のみ使用（service role はサーバーのみ・リポジトリに含めない）
