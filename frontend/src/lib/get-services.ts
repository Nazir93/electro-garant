import { prisma } from "@/lib/db";
import { SERVICES } from "@/lib/constants";
import { ensureDefaultServicesIfNeeded } from "@/lib/seed-default-services";

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  coverImage: string | null;
  videoUrl: string | null;
}

const SERVICE_TYPE_TO_SLUG: Record<string, string> = {
  ELECTRICAL: "/services/electrical",
  ACOUSTICS: "/services/acoustics",
  STRUCTURED_CABLING: "/services/structured-cabling",
  SMART_HOME: "/services/smart-home",
  SECURITY: "/services/security",
  ARCHITECTURAL_LIGHTING: "/services/architectural-lighting",
};

export async function getServicesList(): Promise<ServiceItem[]> {
  try {
    await ensureDefaultServicesIfNeeded();
    const dbServices = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });

    if (dbServices.length > 0) {
      return dbServices.map((s) => ({
        id: s.id,
        slug: SERVICE_TYPE_TO_SLUG[s.serviceType] || `/services/${s.slug}`,
        title: s.title,
        shortDescription: s.shortDescription,
        icon: s.icon,
        coverImage: s.coverImage,
        videoUrl: s.videoUrl,
      }));
    }
  } catch {
    // DB unavailable
  }

  return SERVICES.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    shortDescription: s.shortDescription,
    icon: s.icon,
    coverImage: s.coverImage,
    videoUrl: s.videoUrl,
  }));
}
