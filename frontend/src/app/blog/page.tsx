import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { BlogPageContent } from "./content";

export const metadata: Metadata = {
  title: `Блог — статьи и новости | ${SITE_NAME}`,
  description: `Полезные статьи об электромонтаже, умном доме, видеонаблюдении и акустике. Советы экспертов ${SITE_NAME}.`,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogPageContent />;
}
