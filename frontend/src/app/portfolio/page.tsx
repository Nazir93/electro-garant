import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { PortfolioPageContent } from "./content";

export const metadata: Metadata = {
  title: `Портфолио — реализованные проекты`,
  description: `Реализованные проекты ${SITE_NAME}: электромонтаж, умный дом, видеонаблюдение, акустика для ресторанов, офисов и квартир.`,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
