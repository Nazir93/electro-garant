"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useContactConfig } from "@/lib/contact-config-context";

/**
 * Быстрый звонок: тот же номер, что в шапке (phone2Raw / phone2).
 * Скрыта на главной. z-[115] — поверх ContactModal (z-[100]–110), ниже кастомного курсора.
 */
export function FloatingCallButton() {
  const pathname = usePathname();
  const contact = useContactConfig();

  if (pathname === "/") return null;

  const raw = contact.phone2Raw?.trim();
  if (!raw) return null;

  const isOffer = pathname === "/offer" || pathname.startsWith("/offer/");

  const positionClasses = isOffer
    ? "bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] lg:bottom-10 lg:right-10"
    : "bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] lg:bottom-10 lg:right-[calc(60px+1rem)]";

  return (
    <a
      href={`tel:${raw}`}
      className={
        "fixed z-[115] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 touch-manipulation " +
        positionClasses
      }
      style={{
        backgroundColor: "var(--accent)",
        color: "#0A0A0A",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.12)",
      }}
      aria-label={`Позвонить: ${contact.phone2}`}
    >
      <Image
        src="/images/floating-call-smartphone.png"
        alt=""
        width={42}
        height={42}
        className="h-[42px] w-[42px] object-contain select-none pointer-events-none"
        aria-hidden
      />
    </a>
  );
}
