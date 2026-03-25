import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Форум | ${SITE_NAME}`,
  description: "Форум скоро откроется.",
};

export default function ForumPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20">
      <h1 className="font-heading text-2xl md:text-3xl mb-4" style={{ color: "var(--text)" }}>
        Форум
      </h1>
      <p className="text-sm text-center max-w-md mb-8" style={{ color: "var(--text-muted)" }}>
        Раздел в разработке. Скоро здесь можно будет обсуждать проекты и задавать вопросы.
      </p>
      <Link
        href="/"
        className="text-xs font-heading uppercase tracking-wider"
        style={{ color: "var(--accent)" }}
      >
        На главную
      </Link>
    </div>
  );
}
