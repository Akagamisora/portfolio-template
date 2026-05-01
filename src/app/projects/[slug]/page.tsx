import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

function linesToParagraphs(text: string | null | undefined): ReactNode {
  if (!text?.trim()) return null;
  return text.split("\n").map((line, i) => (
    <p key={i} className="text-zinc-700 dark:text-zinc-300">
      {line}
    </p>
  ));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project || !project.published) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
        <div>
          <Link
            href="/projects"
            className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            プロジェクト一覧
          </Link>
          <h1 className="mt-4 text-3xl font-semibold text-black dark:text-zinc-50">
            {project.title}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{project.summary}</p>
          {project.tags.length > 0 ? (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
              {project.tags.join(" · ")}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                className="text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                デモ
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                className="text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                リポジトリ
              </a>
            ) : null}
          </div>
        </div>
        {project.body ? (
          <section className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">詳細</h2>
            <div className="flex flex-col gap-2 text-sm">{linesToParagraphs(project.body)}</div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
