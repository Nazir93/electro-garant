import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import TechnologyContent from "./content";

export async function generateMetadata() {
  return getPageMeta({
    title: `Технология монтажа — 13 этапов | ${SITE_NAME}`,
    description: `Собственная технология электромонтажа: 13 этапов от заявки до гарантийного обслуживания. Каждый шаг задокументирован и отработан на 280+ объектах.`,
    path: "/technology",
    keywords: [`технология монтажа ${CITY}`, "этапы электромонтажа", "методология установки", SITE_NAME],
  });
}

export default function TechnologyPage() {
  return <TechnologyContent />;
}
