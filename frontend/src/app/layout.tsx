import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/lib/theme-context";
import { ModalProvider } from "@/lib/modal-context";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ContactModal } from "@/components/ui/contact-modal";
import { SITE_NAME, CITY, SITE_URL } from "@/lib/constants";
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
  description: `Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир в ${CITY}. 280+ объектов. Гарантия 5 лет. Допуск СРО.`,
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
    description: `Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир. 280+ объектов, гарантия 5 лет.`,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={montserrat.variable} data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className="font-body antialiased theme-bg theme-text transition-colors duration-500">
        <ThemeProvider>
          <ModalProvider>
            <CustomCursor />
            <ContactModal />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
