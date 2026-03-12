import type { Metadata } from "next";
import { SITE_NAME, CITY } from "@/lib/constants";
import { PricePageContent } from "./content";

export const metadata: Metadata = {
  title: `Прайс-лист на электромонтажные работы в ${CITY} | ${SITE_NAME}`,
  description: `Актуальные цены на электромонтажные работы, слаботочные системы, умный дом, видеонаблюдение и акустику в ${CITY}. Скачайте прайс-лист ${SITE_NAME}.`,
  alternates: { canonical: "/price" },
};

export default function PricePage() {
  return <PricePageContent />;
}
