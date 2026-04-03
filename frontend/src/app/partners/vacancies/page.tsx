import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { Section, SectionTitle } from "@/components/ui/section";
import { BackNavLink } from "@/components/ui/back-nav";
import { Briefcase } from "lucide-react";

export async function generateMetadata() {
  return getPageMeta({
    title: `Вакансии | ${SITE_NAME}`,
    description: `Вакансии ${SITE_NAME} в ${CITY}. Актуальные предложения о работе.`,
    path: "/partners/vacancies",
    keywords: ["вакансии", "работа", SITE_NAME, CITY],
  });
}

export default function PartnersVacanciesPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      <Section dark className="!pt-8 md:!pt-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <BackNavLink href="/">На главную</BackNavLink>
          </div>

          <SectionTitle subtitle="Карьера в компании" className="!mb-8 md:!mb-10">
            Вакансии
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
                <Briefcase size={26} style={{ color: "var(--accent)" }} aria-hidden />
              </div>
            </div>
            <p className="font-heading text-xl sm:text-2xl mb-2" style={{ color: "var(--text)" }}>
              Нет свободных вакансий
            </p>
            <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
              Следите за обновлениями на сайте или напишите нам через раздел «Тех поддержка» в контактах.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
