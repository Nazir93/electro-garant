import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { Section, SectionTitle } from "@/components/ui/section";
import { BackNavLink } from "@/components/ui/back-nav";
import Link from "next/link";
import { Construction } from "lucide-react";

export async function generateMetadata() {
  return getPageMeta({
    title: `Аренда и ремонт | ${SITE_NAME}`,
    description: `Раздел в разработке. ${SITE_NAME}, ${CITY}.`,
    path: "/partners/rent-repair",
    keywords: ["аренда", "ремонт", SITE_NAME, CITY],
  });
}

export default function PartnersRentRepairPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      <Section dark className="!pt-8 md:!pt-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <BackNavLink href="/">На главную</BackNavLink>
          </div>

          <SectionTitle subtitle="Оборудование и сервис" className="!mb-8 md:!mb-10">
            Аренда и ремонт
          </SectionTitle>

          <div
            className="rounded-2xl px-6 py-10 sm:px-10 sm:py-12 text-center"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-secondary)",
            }}
          >
            <div className="flex justify-center mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                <Construction size={26} style={{ color: "var(--accent)" }} aria-hidden />
              </div>
            </div>
            <p className="font-heading text-xl sm:text-2xl mb-2" style={{ color: "var(--text)" }}>
              Страница в разработке
            </p>
            <p className="text-sm sm:text-base max-w-md mx-auto mb-6" style={{ color: "var(--text-muted)" }}>
              Скоро здесь появится информация об аренде и ремонте. По срочным вопросам свяжитесь с нами.
            </p>
            <Link
              href="/contacts"
              className="inline-flex text-xs uppercase tracking-[0.15em] underline underline-offset-4"
              style={{ color: "var(--accent)" }}
            >
              Перейти в контакты
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
