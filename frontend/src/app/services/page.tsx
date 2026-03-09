import type { Metadata } from "next";
import { SITE_NAME, CITY } from "@/lib/constants";
import { ServicesPageContent } from "./content";

export const metadata: Metadata = {
  title: `Услуги — электромонтаж и автоматизация в ${CITY} | ${SITE_NAME}`,
  description: `Полный спектр электромонтажных работ в ${CITY}: электромонтаж, умный дом, видеонаблюдение, акустика, слаботочные системы. От проекта до сдачи объекта.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
