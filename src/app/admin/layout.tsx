import Link from "next/link";
import { requireAdminUser } from "@/lib/auth/require-user";
import { AdminSignOutButton } from "./admin-sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/admin" className="font-medium text-zinc-900 dark:text-zinc-50">
              管理
            </Link>
            <Link
              href="/admin/profile"
              className="text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
            >
              プロフィール
            </Link>
            <Link
              href="/admin/projects"
              className="text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
            >
              プロジェクト
            </Link>
            <Link
              href="/"
              className="text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
            >
              サイトを表示
            </Link>
          </nav>
          <AdminSignOutButton />
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
