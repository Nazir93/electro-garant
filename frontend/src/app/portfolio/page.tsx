import { getPageMeta } from "@/lib/get-page-meta";
import { getProjectsList } from "@/lib/get-projects";
import { SITE_NAME } from "@/lib/constants";
import { PortfolioPageContent } from "./content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMeta({
    title: `Портфолио — реализованные проекты | ${SITE_NAME}`,
    description: `Реализованные проекты ${SITE_NAME}: электромонтаж, умный дом, видеонаблюдение, акустика для ресторанов, офисов и квартир.`,
    path: "/portfolio",
    keywords: ["портфолио электромонтаж", "реализованные проекты", "кейсы электрики", SITE_NAME],
  });
}

export default async function PortfolioPage() {
  const projects = await getProjectsList();
  return <PortfolioPageContent projects={projects} />;
}
