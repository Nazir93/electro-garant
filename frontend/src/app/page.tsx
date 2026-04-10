import { SITE_NAME, CITY, getDefaultSiteGeoDescription } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { getServicesList } from "@/lib/get-services";
import { getHomePortfolioProjects } from "@/lib/get-projects";
import { BannerSection } from "@/components/sections/banner";
import { NavBar } from "@/components/layout/header";
import { ViewAllServices } from "@/components/layout/view-all-services";
import { HeroSection } from "@/components/sections/hero";
import { PriceBannerSection } from "@/components/sections/price-banner";
import { AboutSection } from "@/components/sections/about";
import { PortfolioSection } from "@/components/sections/portfolio";
import { PartnersSection } from "@/components/sections/partners";

export const revalidate = 60;

export async function generateMetadata() {
  return getPageMeta({
    title: `${SITE_NAME} — электромонтаж премиум-класса в ${CITY} под ключ`,
    description: getDefaultSiteGeoDescription(),
    path: "/",
    keywords: ["электромонтаж", CITY, "электрик", "умный дом", "видеонаблюдение", SITE_NAME],
  });
}

export default async function HomePage() {
  const [services, projects] = await Promise.all([
    getServicesList(),
    getHomePortfolioProjects(),
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
