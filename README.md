# ポートフォリオテンプレート

Next.js 16（App Router）・[Vercel](https://vercel.com)・[Supabase](https://supabase.com)（認証・PostgreSQL）・[Prisma](https://www.prisma.io) を組み合わせた、エンジニア向けポートフォリオのひな型です。

- **公開サイト**: トップ・プロジェクト一覧・詳細は **ログインなしで閲覧可能**
- **管理画面**: **`/admin` 以下はログイン必須** — サイトプロフィールとプロジェクトを編集

## スタック

| 領域         | 利用技術                           |
| ------------ | ---------------------------------- |
| フレーム     | Next.js 16 / React 19              |
| ホスティング | Vercel（任意・ローカルのみでも可） |
| 認証・DB     | Supabase Auth + PostgreSQL         |
| ORM          | Prisma                             |

## 前提

- Node.js と npm
- Supabase プロジェクト（Auth と Database を利用）
- （任意）Vercel プロジェクト

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数

ルートに `.env` を作成し、次を設定します。

**Supabase（クライアント用・Supabase Dashboard → Project Settings → API）**

- **NEXT_PUBLIC_SUPABASE_URL**
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**

**Prisma / PostgreSQL**

- **DATABASE_URL** — Transaction pooler（例: ポート `6543`）。アプリ実行時の接続。**開発・本番・プレビューいずれでも必須**
- **DIRECT_URL** — 直結（例: ポート `5432`）。`prisma migrate` などマイグレーション用

**任意**

- **NEXT_PUBLIC_SITE_URL** — メール確認リンクなどのベース URL（未設定時はリクエストヘッダから推定）。公開ページの Open Graph 用 `metadataBase` にも利用
- **ADMIN_EMAIL** または **ADMIN_EMAILS** — カンマ区切り。**指定時はそのメールのユーザーのみ** が管理画面にアクセス可能。**未設定時はログイン済みユーザー全員が編集可能**になるため、本番では設定を推奨

### 3. マイグレーション

```bash
npx prisma migrate deploy
```

ローカルでスキーマを変更する開発時は `npx prisma migrate dev` を使います。

### 4. Supabase の URL 設定

**Authentication → URL Configuration** に次を追加します。

| 用途             | URL の例                                                     |
| ---------------- | ------------------------------------------------------------ |
| 開発時サイト URL | `http://localhost:3000`                                      |
| コールバック     | `http://localhost:3000/auth/callback`                        |
| 本番             | デプロイ先のオリジンと `https://<your-domain>/auth/callback` |

### 5. 開発サーバー

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開きます。

### 6. 初回データの登録

1. [http://localhost:3000/signup](http://localhost:3000/signup) でアカウントを作成
2. [http://localhost:3000/admin](http://localhost:3000/admin) で **プロフィール** と **プロジェクト** を登録

公開ページはデータベースの内容をそのまま表示します。

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

## 開発コマンド

| コマンド        | 説明                     |
| --------------- | ------------------------ |
| `npm run dev`   | 開発サーバー             |
| `npm run build` | 本番ビルド               |
| `npm run start` | 本番サーバー（ビルド後） |
| `npm run lint`  | oxlint + ESLint          |
| `npm run fmt`   | oxfmt で整形             |

`postinstall` で `prisma generate` が実行されます。

## Vercel にデプロイする場合

1. リポジトリを接続し、**Environment Variables** にローカルと同様の変数を設定する（本番とプレビューで Supabase を分けると安全です）。
2. ビルドコマンドは `npm run build`。
3. **初回デプロイ前**に本番 DB へ `prisma migrate deploy` を適用する（CI または手動）。

## アーキテクチャメモ

- **認可の集約**: ルート保護とセッション更新は [`src/proxy.ts`](./src/proxy.ts)。閲覧は匿名可、`/admin` のみ未ログイン時は `/login` へ。公開パスの一覧は [`src/lib/auth/public-paths.ts`](./src/lib/auth/public-paths.ts)。
- **管理画面の検証**: [`src/lib/auth/require-user.ts`](./src/lib/auth/require-user.ts) の `requireAdminUser()` を admin レイアウトおよび Server Actions で利用し、書き込み前に必ず再検証する。
- **クライアントの認証状態**: `pathname` のたびに `getUser()` を繰り返すより、`supabase.auth.onAuthStateChange` で一括購読する方が無駄なリクエストを減らせます。
- **Prisma**: [`src/lib/prisma.ts`](./src/lib/prisma.ts) から利用します。

## ライセンス

リポジトリルートに `LICENSE` を置いてください（例: MIT）。未設定の場合は GitHub のライセンス表示が付きません。

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
