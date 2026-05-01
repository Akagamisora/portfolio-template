import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { connection } from "next/server";
import { getHomeProjects, getSiteProfile } from "@/lib/portfolio-public-data";

export const revalidate = 3600;

function firstBioLine(bio: string | null | undefined): string | undefined {
  const line = bio
    ?.split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  return line || undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const profile = await getSiteProfile();
  const displayName = profile?.displayName?.trim() || "Your Name";
  const roleTitle = profile?.title?.trim() || "エンジニア";
  const bioLine = firstBioLine(profile?.bio ?? undefined);
  const description = bioLine ?? `${displayName} — ${roleTitle}`;
  const avatar = profile?.avatarUrl?.trim();

  return {
    title: displayName,
    description,
    openGraph: {
      title: displayName,
      description,
      ...(avatar ? { images: [{ url: avatar }] } : {}),
    },
    twitter: {
      card: avatar ? "summary_large_image" : "summary",
      title: displayName,
      description,
      ...(avatar ? { images: [avatar] } : {}),
    },
  };
}

function linesToParagraphs(text: string | null | undefined): ReactNode {
  if (!text?.trim()) return null;
  return text.split("\n").map((line, i) => (
    <p key={i} className="text-zinc-700 dark:text-zinc-300">
      {line}
    </p>
  ));
}

export default async function HomePage() {
  await connection();
  const profile = await getSiteProfile();
  const projects = await getHomeProjects();

  const displayName = profile?.displayName?.trim() || "Your Name";
  const title = profile?.title?.trim() || "エンジニア";

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">{displayName}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{title}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            {profile?.githubUrl ? (
              <a
                href={profile.githubUrl}
                className="text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                GitHub
              </a>
            ) : null}
            {profile?.twitterUrl ? (
              <a
                href={profile.twitterUrl}
                className="text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                X
              </a>
            ) : null}
            {profile?.emailPublic ? (
              <a
                href={`mailto:${profile.emailPublic}`}
                className="text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                メール
              </a>
            ) : null}
          </div>
        </header>

        {profile?.bio ? (
          <section className="flex flex-col gap-2">{linesToParagraphs(profile.bio)}</section>
        ) : null}

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">プロジェクト</h2>
            <Link
              href="/projects"
              className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
            >
              すべて表示
            </Link>
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
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {p.summary}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="border-t border-zinc-200 pt-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          <Link href="/login" className="underline-offset-4 hover:underline">
            管理者ログイン
          </Link>
        </footer>
      </main>
    </div>
  );
}
