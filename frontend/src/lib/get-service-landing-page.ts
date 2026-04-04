import { prisma } from "@/lib/db";
import type { ServiceType } from "@prisma/client";
import { SITE_NAME } from "@/lib/constants";
import {
  getDefaultMetaForServiceSlug,
  isServicePageSlug,
  resolveServiceLandingDocument,
  type ServicePageSlug,
  SERVICE_PAGE_SLUG_TO_TYPE,
} from "@/lib/service-landing-defaults";
import type { ServiceLandingDocument } from "@/lib/service-landing-schema";
import { ensureDefaultServicesIfNeeded } from "@/lib/seed-default-services";

function mergeHeroBannersFromDb(
  document: ServiceLandingDocument,
  bannerImageDesktop: string | null | undefined,
  bannerImageMobile: string | null | undefined
): ServiceLandingDocument {
  const d = bannerImageDesktop?.trim() || undefined;
  const m = bannerImageMobile?.trim() || undefined;
  if (!d && !m) return document;
  return {
    sections: document.sections.map((section) => {
      if (section.type !== "hero") return section;
      return {
        ...section,
        bannerImageDesktop: section.bannerImageDesktop ?? d,
        bannerImageMobile: section.bannerImageMobile ?? m,
      };
    }),
  };
}

export type ServiceLandingPageData = {
  serviceType: ServiceType;
  published: boolean;
  document: ServiceLandingDocument;
};

type ServiceRowPick = {
  published: boolean;
  landingJson: unknown;
  bannerImageDesktop: string | null;
  bannerImageMobile: string | null;
  serviceType: ServiceType;
};

async function loadServiceRowForSlug(slug: string): Promise<ServiceRowPick | null> {
  try {
    const bySlug = await prisma.service.findUnique({
      where: { slug },
      select: {
        published: true,
        landingJson: true,
        bannerImageDesktop: true,
        bannerImageMobile: true,
        serviceType: true,
      },
    });
    if (bySlug) return bySlug;
  } catch {
    // БД недоступна — ниже не продолжаем
    return null;
  }

  if (isServicePageSlug(slug)) {
    try {
      const serviceType = SERVICE_PAGE_SLUG_TO_TYPE[slug as ServicePageSlug];
      return await prisma.service.findFirst({
        where: { serviceType },
        select: {
          published: true,
          landingJson: true,
          bannerImageDesktop: true,
          bannerImageMobile: true,
          serviceType: true,
        },
      });
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Значения по умолчанию для {@link getPageMeta}: из строки услуги в БД или из шаблона кода.
 * Перекрываются записями в «SEO» (PageMeta) по пути `/services/{slug}`.
 */
export async function getServiceMetadataDefaults(slug: string): Promise<{
  title: string;
  description: string;
  keywords?: string[];
} | null> {
  try {
    const s = await prisma.service.findUnique({
      where: { slug },
      select: { title: true, shortDescription: true },
    });
    if (s) {
      const description = s.shortDescription.replace(/\s+/g, " ").trim();
      return {
        title: `${s.title} | ${SITE_NAME}`,
        description: description.length > 200 ? `${description.slice(0, 197)}…` : description,
        keywords: [s.title, SITE_NAME],
      };
    }
  } catch {
    // БД недоступна — ниже шаблон из кода для известных slug
  }

  if (isServicePageSlug(slug)) {
    return getDefaultMetaForServiceSlug(slug as ServicePageSlug);
  }

  return null;
}

export async function getServiceLandingPageData(slug: string): Promise<ServiceLandingPageData | null> {
  try {
    await ensureDefaultServicesIfNeeded();
  } catch {
    // БД недоступна — ниже шаблон из кода
  }

  const knownType = isServicePageSlug(slug) ? SERVICE_PAGE_SLUG_TO_TYPE[slug as ServicePageSlug] : null;

  const row = await loadServiceRowForSlug(slug);

  if (!row) {
    if (!knownType) return null;
    const document = mergeHeroBannersFromDb(resolveServiceLandingDocument(null, knownType), null, null);
    return { serviceType: knownType, published: true, document };
  }

  let document = resolveServiceLandingDocument(row.landingJson, row.serviceType);
  document = mergeHeroBannersFromDb(document, row.bannerImageDesktop, row.bannerImageMobile);
  return { serviceType: row.serviceType, published: row.published, document };
}
