import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta, getPageMetaFields } from "@/lib/get-page-meta";
import { getServicesList } from "@/lib/get-services";
import { ServicesPageContent } from "./content";

export const dynamic = "force-dynamic";

const SERVICES_INTRO_FALLBACK = `Полный спектр электромонтажных работ в ${CITY}: электромонтаж, умный дом, видеонаблюдение, акустика и слаботочные системы — от проекта до сдачи объекта.`;

export async function generateMetadata() {
  return getPageMeta({
    title: `Услуги — электромонтаж, умный дом, слаботочные системы в ${CITY} | ${SITE_NAME}`,
    description: `Электромонтаж под ключ, умный дом, видеонаблюдение, коммерческая акустика и СКС в ${CITY}. Проектирование, монтаж, гарантия. Список услуг на странице.`,
    path: "/services",
    keywords: [
      `услуги электромонтаж ${CITY}`,
      `электромонтажные работы ${CITY}`,
      "умный дом монтаж",
      "видеонаблюдение установка",
      "слаботочные системы СКС",
      "коммерческая акустика",
      SITE_NAME,
    ],
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
