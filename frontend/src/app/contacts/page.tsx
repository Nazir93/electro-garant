import { SITE_NAME, CITY } from "@/lib/constants";
import { getPageMeta } from "@/lib/get-page-meta";
import { ContactsSection } from "@/components/sections/contacts";

export async function generateMetadata() {
  return getPageMeta({
    title: `Контакты | ${SITE_NAME} — электромонтаж в ${CITY}`,
    description: `Свяжитесь с ${SITE_NAME}: телефон, email, адрес в ${CITY}. Оставьте заявку — инженер перезвонит в течение 30 минут.`,
    path: "/contacts",
    keywords: [`контакты ${SITE_NAME}`, `электромонтаж ${CITY} контакты`, "заявка на электромонтаж"],
  });
}

export default function ContactsPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      <ContactsSection />
    </div>
  );
}
