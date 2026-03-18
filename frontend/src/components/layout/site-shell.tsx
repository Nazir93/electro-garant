"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { ConditionalNavBar } from "./conditional-navbar";
import { Footer } from "./footer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { FixedStatsBar } from "./fixed-stats-bar";
import { SmoothScroll } from "./smooth-scroll";
import { PageTransition } from "./page-transition";
import { CustomCursor } from "../ui/custom-cursor";
import { ContactModal } from "../ui/contact-modal";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <ContactModal />
      <Header />
      <ConditionalNavBar />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FixedStatsBar />
      <MobileBottomNav />
      <div className="h-14 lg:hidden" />
    </>
  );
}
