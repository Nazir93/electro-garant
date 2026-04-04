import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { OfferFormPageContent } from "./content";

export async function generateMetadata() {
  return getPageMeta({
    title: `Форма обратной связи — ${SITE_NAME}`,
    description: `Свяжемся за 5 минут. Электромонтаж в ${CITY}.`,
    path: "/offer/form",
    keywords: ["обратная связь", "заявка", SITE_NAME, CITY],
  });
}

export default function OfferFormPage() {
  return <OfferFormPageContent />;
}
