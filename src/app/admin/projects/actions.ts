"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function assertSlug(slug: string): void {
  if (!slug || !SLUG_REGEX.test(slug)) {
    throw new Error(
      "スラッグは英小文字・数字・ハイフンのみ（先頭末尾ハイフン不可）にしてください。",
    );
  }
}

export async function createProjectAction(formData: FormData) {
  await requireAdminUser();

  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim();
  const demoUrl = String(formData.get("demoUrl") ?? "").trim();
  const repoUrl = String(formData.get("repoUrl") ?? "").trim();
  const published = String(formData.get("published") ?? "false") === "true";
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10);
  const tags = parseTags(String(formData.get("tags") ?? ""));

  assertSlug(slug);
  if (!title) throw new Error("タイトルは必須です。");
  if (!summary) throw new Error("概要は必須です。");

  try {
    await prisma.project.create({
      data: {
        slug,
        title,
        summary,
        body: body.length > 0 ? body : null,
        thumbnailUrl: thumbnailUrl.length > 0 ? thumbnailUrl : null,
        demoUrl: demoUrl.length > 0 ? demoUrl : null,
        repoUrl: repoUrl.length > 0 ? repoUrl : null,
        published,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
        tags,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new Error("このスラッグは既に使われています。");
    }
    throw e;
  }

  revalidatePath("/", "layout");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  await requireAdminUser();

  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim();
  const demoUrl = String(formData.get("demoUrl") ?? "").trim();
  const repoUrl = String(formData.get("repoUrl") ?? "").trim();
  const published = String(formData.get("published") ?? "false") === "true";
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10);
  const tags = parseTags(String(formData.get("tags") ?? ""));

  assertSlug(slug);
  if (!title) throw new Error("タイトルは必須です。");
  if (!summary) throw new Error("概要は必須です。");

  const existing = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existing) throw new Error("プロジェクトが見つかりません。");

  if (slug !== existing.slug) {
    const clash = await prisma.project.findUnique({ where: { slug } });
    if (clash) throw new Error("そのスラッグは既に使われています。");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      slug,
      title,
      summary,
      body: body.length > 0 ? body : null,
      thumbnailUrl: thumbnailUrl.length > 0 ? thumbnailUrl : null,
      demoUrl: demoUrl.length > 0 ? demoUrl : null,
      repoUrl: repoUrl.length > 0 ? repoUrl : null,
      published,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      tags,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/projects");
  revalidatePath(`/projects/${existing.slug}`);
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteProjectAction(projectId: string) {
  await requireAdminUser();

  const existing = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existing) return;

  await prisma.project.delete({ where: { id: projectId } });

  revalidatePath("/", "layout");
  revalidatePath("/projects");
  revalidatePath(`/projects/${existing.slug}`);
  revalidatePath("/admin/projects");
}
