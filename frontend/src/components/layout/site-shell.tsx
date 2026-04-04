"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { DesktopSideNav } from "./desktop-side-nav";
import { ConditionalNavBar } from "./conditional-navbar";
import { Footer } from "./footer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { FixedStatsBar } from "./fixed-stats-bar";
import { SmoothScroll } from "./smooth-scroll";
import { PageTransition } from "./page-transition";
import { CustomCursor } from "../ui/custom-cursor";
import { ContactModal } from "../ui/contact-modal";
import { CookieBanner } from "../ui/cookie-banner";
import { SmartCaptchaGate } from "../smartcaptcha-provider";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  /** Оффер: полноэкранная воронка — без header/footer/навигации (переход с «Обсудить проект») */
  const isOffer =
    pathname === "/offer" || pathname.startsWith("/offer/");

  if (isAdmin) {
    return <>{children}</>;
  }

  if (isOffer) {
    return (
      <SmartCaptchaGate>
        <>
          <CustomCursor />
          <ContactModal />
          <main
            className="theme-bg theme-text fixed inset-0 z-[85] h-[100dvh] max-h-[100dvh] overflow-hidden overflow-x-hidden overscroll-none border-0 bg-[var(--bg)] outline-none ring-0 transition-colors duration-500"
          >
            {/* без PageTransition — иначе лишний fade и ощущение «лоадера» */}
            {children}
          </main>
        </>
      </SmartCaptchaGate>
    );
  }

  return (
    <SmartCaptchaGate>
    <>
      <SmoothScroll />
      <CustomCursor />
      <ContactModal />
      <Header />
      {isHome ? <DesktopSideNav /> : null}
      <ConditionalNavBar />
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FixedStatsBar />
      <MobileBottomNav />
      <CookieBanner />
      <div className="h-14 lg:hidden" />
    </>
    </SmartCaptchaGate>
  );
}
