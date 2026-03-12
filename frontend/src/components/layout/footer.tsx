"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SITE_NAME, PHONE, PHONE_RAW, EMAIL, SOCIAL_LINKS } from "@/lib/constants";
import { useModal } from "@/lib/modal-context";

export function Footer() {
  const { openModal } = useModal();
  const [btnHovered, setBtnHovered] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative"
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      {/* CTA Button */}
      <div className="container mx-auto py-8 sm:py-12 md:py-16">
        <button
          onClick={openModal}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          className="group relative w-full flex items-center justify-between px-5 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 overflow-hidden transition-colors duration-700"
          style={{ border: "1px solid var(--border)", borderRadius: "28px" }}
        >
          <div
            className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              backgroundColor: "var(--text)",
              transform: btnHovered ? "scaleX(1)" : "scaleX(0)",
            }}
          />

          <span
            className="relative z-10 font-heading text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-wide transition-colors duration-700"
            style={{ color: btnHovered ? "var(--bg)" : "var(--text)" }}
          >
            Обсудить проект
          </span>

          <ArrowRight
            size={22}
            className="relative z-10 transition-colors duration-700 shrink-0 ml-3"
            style={{ color: btnHovered ? "var(--bg)" : "var(--text)" }}
          />
        </button>
      </div>

      {/* Large company name */}
      <div className="container mx-auto pb-3 sm:pb-4 md:pb-6">
        <h2
          className="font-heading text-[13vw] sm:text-[14vw] md:text-[14vw] lg:text-[12vw] leading-[0.85] tracking-tight select-none"
          style={{ color: "var(--text)" }}
        >
          {SITE_NAME.toUpperCase().replace(" ", "\n").split("\n").map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </h2>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="container mx-auto py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 safe-bottom">
          <p
            className="text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em]"
            style={{ color: "var(--text-subtle)" }}
          >
            &copy; {currentYear} {SITE_NAME}
          </p>

          <div
            className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-[10px] sm:text-xs uppercase tracking-[0.1em]"
            style={{ color: "var(--text-muted)" }}
          >
            {SOCIAL_LINKS.vk && (
              <a
                href={SOCIAL_LINKS.vk}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                VK
              </a>
            )}
            {SOCIAL_LINKS.telegram && (
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                Telegram
              </a>
            )}
            {SOCIAL_LINKS.whatsapp && (
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                WhatsApp
              </a>
            )}
            <a
              href={`mailto:${EMAIL}`}
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_RAW}`}
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              {PHONE}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
