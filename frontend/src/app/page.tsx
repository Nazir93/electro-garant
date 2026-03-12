import { BannerSection } from "@/components/sections/banner";
import { NavBar } from "@/components/layout/header";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { PortfolioSection } from "@/components/sections/portfolio";
import { AboutSection } from "@/components/sections/about";
import { TechnologySection } from "@/components/sections/technology";

import { PartnersSection } from "@/components/sections/partners";
import { JsonLd } from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <BannerSection />
      <NavBar />
      <AboutSection />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <TechnologySection />
      <PartnersSection />
    </>
  );
}
