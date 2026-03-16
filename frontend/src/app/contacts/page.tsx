import type { Metadata } from "next";
import { SITE_NAME, CITY } from "@/lib/constants";
import { ContactsSection } from "@/components/sections/contacts";

export const metadata: Metadata = {
  title: `Контакты | ${SITE_NAME} — электромонтаж в ${CITY}`,
  description: `Свяжитесь с ${SITE_NAME}: телефон, email, адрес в ${CITY}. Оставьте заявку — инженер перезвонит в течение 30 минут.`,
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      <ContactsSection />
    </div>
  );
}
