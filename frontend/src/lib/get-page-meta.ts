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

/** Текст под заголовком на странице: `description` из SEO-админки (тот же сниппет для поиска), иначе fallback. */
export async function getPageDescriptionBody(path: string, fallback: string): Promise<string> {
  try {
    const meta = await prisma.pageMeta.findUnique({
      where: { path },
      select: { description: true },
    });
    if (meta?.description?.trim()) return meta.description.trim();
  } catch {
    // DB недоступна
  }
  return fallback;
}

/** Одна выборка полей страницы для разметки и баннера (OG-картинка = баннер на `/services`). */
export async function getPageMetaFields(path: string): Promise<{
  h1: string | null;
  description: string | null;
  ogImage: string | null;
  bodyHtml: string | null;
}> {
  try {
    const meta = await prisma.pageMeta.findUnique({
      where: { path },
      select: { h1: true, description: true, ogImage: true, bodyHtml: true },
    });
    return {
      h1: meta?.h1?.trim() || null,
      description: meta?.description?.trim() || null,
      ogImage: meta?.ogImage?.trim() || null,
      bodyHtml: meta?.bodyHtml?.trim() || null,
    };
  } catch {
    return { h1: null, description: null, ogImage: null, bodyHtml: null };
  }
}
