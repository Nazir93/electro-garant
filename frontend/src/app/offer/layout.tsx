import Link from "next/link";
import { X } from "lucide-react";
import { OfferThemeToggle } from "./offer-theme-toggle";

/**
 * Оффер — отдельный полноэкранный режим (см. SiteShell isOffer):
 * без общего header/footer, только секции страницы + тема и выход на главную.
 */
export default function OfferLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-full">
      <div className="fixed top-0 right-0 z-[95] flex items-start justify-end gap-2 p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pr-[max(0.5rem,env(safe-area-inset-right))] pointer-events-none sm:gap-2.5 sm:p-3">
        <OfferThemeToggle />
        <Link
          href="/"
          className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 hover:border-[var(--accent)]"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg)",
            color: "var(--text-muted)",
          }}
          aria-label="На главную"
        >
          <X size={20} strokeWidth={1.5} />
        </Link>
      </div>
      {children}
    </div>
  );
}
