import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditProjectForm } from "./edit-project-form";

export const dynamic = "force-dynamic";

interface AdminProjectEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectEditPage({ params }: AdminProjectEditPageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            プロジェクトを編集
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{project.title}</p>
        </div>
        <Link
          href="/admin/projects"
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          一覧に戻る
        </Link>
      </div>
      <EditProjectForm project={project} />
    </div>
  );
}
