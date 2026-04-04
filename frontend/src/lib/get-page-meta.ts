import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface MetaDefaults {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogImage?: string;
}

export async function getPageMeta(defaults: MetaDefaults): Promise<Metadata> {
  let dbMeta: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
    h1?: string | null;
    noindex?: boolean;
  } | null = null;

  try {
    dbMeta = await prisma.pageMeta.findUnique({
      where: { path: defaults.path },
    });
  } catch {
    // DB unavailable — use defaults
  }

  const title = dbMeta?.title || defaults.title;
  const description = dbMeta?.description || defaults.description;
  const keywords = dbMeta?.keywords
    ? dbMeta.keywords.split(",").map((k) => k.trim())
    : defaults.keywords;

  const baseUrl = SITE_URL.replace(/\/$/, "");
  const canonical = `${baseUrl}${defaults.path === "/" ? "" : defaults.path}`;

  return {
    title: { absolute: title },
    description,
    ...(keywords && keywords.length > 0 && { keywords }),
    openGraph: {
      title: dbMeta?.ogTitle || title,
      description: dbMeta?.ogDescription || description,
      type: "website",
      locale: "ru_RU",
      siteName: SITE_NAME,
      url: `${baseUrl}${defaults.path}`,
      ...(dbMeta?.ogImage || defaults.ogImage
        ? { images: [{ url: dbMeta?.ogImage || defaults.ogImage! }] }
        : {}),
    },
    alternates: { canonical },
    ...(dbMeta?.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export async function getPageH1(path: string, fallback: string): Promise<string> {
  try {
    const meta = await prisma.pageMeta.findUnique({
      where: { path },
      select: { h1: true },
    });
    return meta?.h1 || fallback;
  } catch {
    return fallback;
  }
}
