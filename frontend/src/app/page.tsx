import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { getServicesList } from "@/lib/get-services";
import { getProjectsList } from "@/lib/get-projects";
import { BannerSection } from "@/components/sections/banner";
import { NavBar } from "@/components/layout/header";
import { ViewAllServices } from "@/components/layout/view-all-services";
import { HeroSection } from "@/components/sections/hero";
import { PriceBannerSection } from "@/components/sections/price-banner";
import { AboutSection } from "@/components/sections/about";
import { PortfolioSection } from "@/components/sections/portfolio";
import { PartnersSection } from "@/components/sections/partners";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMeta({
    title: `${SITE_NAME} — электромонтаж премиум-класса в ${CITY} под ключ`,
    description: `Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир в ${CITY}. 280+ объектов. Гарантия 5 лет. Допуск СРО.`,
    path: "/",
    keywords: ["электромонтаж", CITY, "электрик", "умный дом", "видеонаблюдение", SITE_NAME],
  });
}

export default async function HomePage() {
  const [services, projects] = await Promise.all([
    getServicesList(),
    getProjectsList(),
  ]);

  return (
    <>
      <BannerSection />
      <HeroSection services={services} />
      <ViewAllServices />
      <div className="lg:hidden">
        <NavBar />
      </div>
      <PriceBannerSection />
      <AboutSection />
      <PortfolioSection projects={projects} />
      <PartnersSection />
    </>
  );
}
