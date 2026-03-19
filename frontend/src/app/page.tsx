import { BannerSection } from "@/components/sections/banner";
import { NavBar } from "@/components/layout/header";
import { DesktopSideNav } from "@/components/layout/desktop-side-nav";
import { ViewAllServices } from "@/components/layout/view-all-services";
import { HeroSection } from "@/components/sections/hero";
import { PriceBannerSection } from "@/components/sections/price-banner";
import { PortfolioSection } from "@/components/sections/portfolio";
import { AboutSection } from "@/components/sections/about";

import { PartnersSection } from "@/components/sections/partners";
import { JsonLd } from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <BannerSection />
      <HeroSection />
      <ViewAllServices />
      <DesktopSideNav />
      <div className="lg:hidden">
        <NavBar />
      </div>
      {/* 3rd section: price banner (parallax — stays fixed while scrolling) */}
      <div className="relative z-[1]">
        <PriceBannerSection />
      </div>
      {/* 4th section: overlaps on top of price banner */}
      <div className="relative z-[2] -mt-[100vh]">
        <AboutSection />
        <PortfolioSection />

        <PartnersSection />
      </div>
    </>
  );
}
