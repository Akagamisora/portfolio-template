import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          管理ダッシュボード
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          ポートフォリオの表示内容を編集できます。
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/profile">
          <Card className="h-full transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
            <CardHeader>
              <CardTitle>プロフィール</CardTitle>
              <CardDescription>名前・肩書き・自己紹介・リンクを編集</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/projects">
          <Card className="h-full transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
            <CardHeader>
              <CardTitle>プロジェクト</CardTitle>
              <CardDescription>作品の追加・公開設定・並び順</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
