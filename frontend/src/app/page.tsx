import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { PortfolioSection } from "@/components/sections/portfolio";
import { AboutSection } from "@/components/sections/about";
import { BlogSection } from "@/components/sections/blog";
import { PartnersSection } from "@/components/sections/partners";
import { JsonLd } from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <BlogSection />
      <PartnersSection />
    </>
  );
}
