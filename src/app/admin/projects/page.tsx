import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">プロジェクト</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            一覧から編集するか、新規作成してください。
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">新規作成</Link>
        </Button>
      </div>
      {projects.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">まだプロジェクトがありません。</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {projects.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  {p.title}
                </Link>
                <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">/{p.slug}</p>
              </div>
              <Badge variant={p.published ? "default" : "secondary"}>
                {p.published ? "公開" : "下書き"}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
