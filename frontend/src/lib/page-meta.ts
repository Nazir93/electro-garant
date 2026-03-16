import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export async function getPageMeta(
  path: string,
  defaults: {
    title?: string;
    description?: string;
    keywords?: string[];
  } = {}
): Promise<Metadata> {
  let meta: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
    noindex?: boolean;
  } = {};

  try {
    const dbMeta = await prisma.pageMeta.findUnique({ where: { path } });
    if (dbMeta) meta = dbMeta;
  } catch {
    // DB unavailable
  }

  const title = meta.title || defaults.title;
  const description = meta.description || defaults.description;
  const keywordsStr = meta.keywords;
  const keywords = keywordsStr
    ? keywordsStr.split(",").map((k) => k.trim())
    : defaults.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: meta.ogTitle || title || SITE_NAME,
      description: meta.ogDescription || description,
      ...(meta.ogImage && { images: [{ url: meta.ogImage }] }),
      url: `${SITE_URL}${path}`,
    },
    ...(meta.noindex && {
      robots: { index: false, follow: false },
    }),
    alternates: {
      canonical: `${SITE_URL}${path}`,
    },
  };
}
