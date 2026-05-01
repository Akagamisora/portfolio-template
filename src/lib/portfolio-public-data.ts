import { cache } from "react";
import { prisma } from "@/lib/prisma";

/** 同一リクエスト内で generateMetadata とページ本体の取得を共有する */
export const getSiteProfile = cache(async () => {
  return prisma.siteProfile.findUnique({ where: { id: 1 } });
});

export const getHomeProjects = cache(async () => {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 6,
  });
});

export const getAllPublishedProjects = cache(async () => {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
});

export const getPublishedProjectBySlug = cache(async (slug: string) => {
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project?.published) return null;
  return project;
});
