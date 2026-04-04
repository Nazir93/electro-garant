import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { OfferCalculateContent } from "./content";

export async function generateMetadata() {
  return getPageMeta({
    title: `Рассчитать стоимость — ${SITE_NAME}`,
    description: `Калькулятор сметы, ориентировочный расчёт или прайс. Электромонтаж в ${CITY}.`,
    path: "/offer/calculate",
    keywords: ["расчёт стоимости электромонтаж", "калькулятор сметы", "прайс", SITE_NAME, CITY],
  });
}

export default function OfferCalculatePage() {
  return <OfferCalculateContent />;
}
