import { getHeroGeoSubtitle } from "@/lib/constants";
import { getPageMeta, getPageMetaFields } from "@/lib/get-page-meta";
import { getServicesList } from "@/lib/get-services";
import { getServicesIndexSeo } from "@/lib/seo/service-seo-defaults";
import { ServicesPageContent } from "./content";

export const revalidate = 60;

const SERVICES_INTRO_FALLBACK = `${getHeroGeoSubtitle()} Полный спектр: электромонтаж, умный дом, видеонаблюдение, акустика и слаботочные системы — от проекта до сдачи объекта.`;

export async function generateMetadata() {
  const seo = getServicesIndexSeo();
  return getPageMeta({
    title: seo.title,
    description: seo.description,
    path: "/services",
    keywords: seo.keywords,
  });
}

export default async function ServicesPage() {
  const [services, meta] = await Promise.all([getServicesList(), getPageMetaFields("/services")]);

  const pageH1 = meta.h1 || "Услуги";
  const introText = meta.description || SERVICES_INTRO_FALLBACK;

  return (
    <ServicesPageContent
      services={services}
      pageH1={pageH1}
      introText={introText}
      bannerUrl={meta.ogImage}
      bodyHtml={meta.bodyHtml}
    />
  );
}
