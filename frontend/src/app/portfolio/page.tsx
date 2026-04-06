import { getPageMeta, getPageMetaFields } from "@/lib/get-page-meta";
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

const PORTFOLIO_INTRO_FALLBACK =
  "Реализованные проекты: электромонтаж, умный дом, видеонаблюдение, акустика для ресторанов, офисов и квартир.";

export default async function PortfolioPage() {
  const [projects, meta] = await Promise.all([getProjectsList(), getPageMetaFields("/portfolio")]);

  return (
    <PortfolioPageContent
      projects={projects}
      pageH1={meta.h1 || "Портфолио"}
      introText={meta.description || PORTFOLIO_INTRO_FALLBACK}
      bannerUrl={meta.ogImage}
    />
  );
}
