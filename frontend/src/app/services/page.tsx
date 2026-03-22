import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { ServicesPageContent } from "./content";

export async function generateMetadata() {
  return getPageMeta({
    title: `Услуги — электромонтаж и автоматизация в ${CITY} | ${SITE_NAME}`,
    description: `Полный спектр электромонтажных работ в ${CITY}: электромонтаж, умный дом, видеонаблюдение, акустика, слаботочные системы. От проекта до сдачи объекта.`,
    path: "/services",
    keywords: [`услуги электромонтаж ${CITY}`, "электромонтажные работы", "умный дом", "видеонаблюдение", SITE_NAME],
  });
}

export default function ServicesPage() {
  return <ServicesPageContent />;
}
