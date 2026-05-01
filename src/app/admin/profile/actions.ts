"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

function emptyToNull(s: string): string | null {
  const t = s.trim();
  return t.length > 0 ? t : null;
}

export async function upsertSiteProfileAction(formData: FormData) {
  await requireAdminUser();

  const displayName = emptyToNull(String(formData.get("displayName") ?? ""));
  const title = emptyToNull(String(formData.get("title") ?? ""));
  const bio = emptyToNull(String(formData.get("bio") ?? ""));
  const avatarUrl = emptyToNull(String(formData.get("avatarUrl") ?? ""));
  const githubUrl = emptyToNull(String(formData.get("githubUrl") ?? ""));
  const twitterUrl = emptyToNull(String(formData.get("twitterUrl") ?? ""));
  const emailPublic = emptyToNull(String(formData.get("emailPublic") ?? ""));

  await prisma.siteProfile.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      displayName,
      title,
      bio,
      avatarUrl,
      githubUrl,
      twitterUrl,
      emailPublic,
    },
    update: {
      displayName,
      title,
      bio,
      avatarUrl,
      githubUrl,
      twitterUrl,
      emailPublic,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/projects");
  revalidatePath("/admin/profile");
}
