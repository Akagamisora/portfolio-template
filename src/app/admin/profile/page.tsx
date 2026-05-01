import { prisma } from "@/lib/prisma";
import { SiteProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await prisma.siteProfile.findUnique({ where: { id: 1 } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">プロフィール</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          公開サイトに表示されるプロフィールを編集します。
        </p>
      </div>
      <SiteProfileForm
        initial={{
          displayName: profile?.displayName ?? "",
          title: profile?.title ?? "",
          bio: profile?.bio ?? "",
          avatarUrl: profile?.avatarUrl ?? "",
          githubUrl: profile?.githubUrl ?? "",
          twitterUrl: profile?.twitterUrl ?? "",
          emailPublic: profile?.emailPublic ?? "",
        }}
      />
    </div>
  );
}
