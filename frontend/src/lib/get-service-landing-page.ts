import { prisma } from "@/lib/db";
import type { ServiceType } from "@prisma/client";
import {
  isServicePageSlug,
  resolveServiceLandingDocument,
  type ServicePageSlug,
  SERVICE_PAGE_SLUG_TO_TYPE,
} from "@/lib/service-landing-defaults";
import type { ServiceLandingDocument } from "@/lib/service-landing-schema";

export type ServiceLandingPageData = {
  serviceType: ServiceType;
  published: boolean;
  document: ServiceLandingDocument;
};

export async function getServiceLandingPageData(slug: string): Promise<ServiceLandingPageData | null> {
  if (!isServicePageSlug(slug)) return null;
  const serviceType = SERVICE_PAGE_SLUG_TO_TYPE[slug as ServicePageSlug];

  let published = true;
  let landingJson: unknown = null;

  try {
    const row = await prisma.service.findFirst({
      where: { serviceType },
      select: { published: true, landingJson: true },
    });
    if (row) {
      published = row.published;
      landingJson = row.landingJson;
    }
  } catch {
    // DB недоступна — показываем шаблон из кода
  }

  const document = resolveServiceLandingDocument(landingJson, serviceType);
  return { serviceType, published, document };
}
