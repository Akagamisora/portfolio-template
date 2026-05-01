import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { getAllPublishedProjects } from "@/lib/portfolio-public-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  return {
    title: "プロジェクト一覧",
    description: "公開中のプロジェクト一覧です。",
  };
}

export default async function ProjectsPage() {
  await connection();
  const projects = await getAllPublishedProjects();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
        <div>
          <Link
            href="/"
            className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            トップへ戻る
          </Link>
          <h1 className="mt-4 text-3xl font-semibold text-black dark:text-zinc-50">
            プロジェクト一覧
          </h1>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            公開中のプロジェクトはまだありません。
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{p.title}</span>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{p.summary}</p>
                  {p.tags.length > 0 ? (
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                      {p.tags.join(" · ")}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
