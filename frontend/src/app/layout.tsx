import type { Metadata } from "next";
import localFont from "next/font/local";

/** Чтобы Метрика/контакты из БД подставлялись при каждом запросе, а не при сборке. */
export const dynamic = "force-dynamic";
import { SiteShell } from "@/components/layout/site-shell";
import { ThemeProvider } from "@/lib/theme-context";
import { ModalProvider } from "@/lib/modal-context";
import { SITE_NAME, CITY, SITE_URL, getDefaultSiteGeoDescription } from "@/lib/constants";
import { AnalyticsScripts } from "@/components/seo/analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactConfigProvider } from "@/lib/contact-config-context";
import { loadContactConfig } from "@/lib/load-contact-config";
import "./globals.css";

const montserrat = localFont({
  src: [
    { path: "../../public/fonts/montserrat-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/montserrat-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/montserrat-latin-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/montserrat-cyrillic-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/montserrat-cyrillic-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/montserrat-cyrillic-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/montserrat-cyrillic-ext-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/montserrat-cyrillic-ext-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/montserrat-cyrillic-ext-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — электромонтаж премиум-класса в ${CITY} под ключ`,
    template: `%s | ${SITE_NAME}`,
  },
  description: getDefaultSiteGeoDescription(),
  keywords: [
    "электромонтаж",
    CITY,
    "электрик",
    "электромонтажные работы",
    "умный дом",
    "видеонаблюдение",
    "слаботочные системы",
    "акустика для ресторана",
    "Гарант Монтаж",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — электромонтаж премиум-класса в ${CITY}`,
    description: `Проектирование, поставка и монтаж электрики. Офис в ${CITY}, проекты в нескольких регионах. 280+ объектов, гарантия 2 года.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactConfig = await loadContactConfig();
  return (
    <html lang="ru" className={montserrat.variable} data-theme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5" />
        <meta name="theme-color" content="#0A0A0A" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Постер блока «О нас» на главной — раньше картинка, меньше «пустого» видео при скролле */}
        <link rel="preload" href="/panel-assembly-poster.jpg" as="image" />
        <JsonLd />
      </head>
      <body className="font-body antialiased theme-bg theme-text transition-colors duration-500">
        <ThemeProvider>
          <ContactConfigProvider value={contactConfig}>
            <ModalProvider>
              <SiteShell>{children}</SiteShell>
            </ModalProvider>
          </ContactConfigProvider>
        </ThemeProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
