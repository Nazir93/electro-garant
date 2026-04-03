import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { OfferPageContent } from "./content";

export async function generateMetadata() {
  return getPageMeta({
    title: `Связаться с ${SITE_NAME} — электромонтаж в ${CITY}`,
    description: `Оставьте заявку или позвоните — команда ${SITE_NAME} свяжется с вами за 5 минут. Бесплатная консультация и расчёт стоимости.`,
    path: "/offer",
    keywords: ["заявка электромонтаж", "связаться", "консультация", SITE_NAME, CITY],
  });
}

export default function OfferPage() {
  return (
    <>
      <link rel="preload" href="/videos/offer-hero.mp4" as="video" type="video/mp4" />
      <OfferPageContent />
    </>
  );
}
