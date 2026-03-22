import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { PricePageContent } from "./content";

export async function generateMetadata() {
  return getPageMeta({
    title: `Прайс-лист на электромонтажные работы в ${CITY} | ${SITE_NAME}`,
    description: `Актуальные цены на электромонтажные работы, слаботочные системы, умный дом, видеонаблюдение и акустику в ${CITY}. Скачайте прайс-лист.`,
    path: "/price",
    keywords: [`прайс электромонтаж ${CITY}`, `цены электрик ${CITY}`, "стоимость электромонтажных работ", SITE_NAME],
  });
}

export default function PricePage() {
  return <PricePageContent />;
}
