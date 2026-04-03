"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { useContactConfig } from "@/lib/contact-config-context";

export function Footer() {
  const contact = useContactConfig();
  const [btnHovered, setBtnHovered] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative"
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      {/* CTA Button */}
      <div className="container mx-auto py-8 sm:py-12 md:py-16 pr-5 lg:pr-[80px]">
        <Link
          href="/offer"
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
        </Link>
      </div>

      {/* Large company name */}
      <div className="container mx-auto pb-3 sm:pb-4 md:pb-6 pr-5 lg:pr-[80px]">
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
        <div className="container mx-auto py-4 sm:py-6 pr-5 lg:pr-[80px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
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
            {contact.social.max && (
              <a
                href={contact.social.max}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                Max
              </a>
            )}
            {contact.social.telegram && (
              <a
                href={contact.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                Telegram
              </a>
            )}
            <a
              href={`mailto:${contact.email}`}
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phoneRaw}`}
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              {contact.phone}
            </a>
            <a
              href={`tel:${contact.phone2Raw}`}
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              {contact.phone2}
            </a>
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>

      {/* Developer credit */}
      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="container mx-auto px-5 sm:px-6 lg:pr-[80px] py-4 sm:py-5 safe-bottom flex justify-center">
          <p
            className="max-w-3xl text-center text-[10px] sm:text-xs leading-relaxed tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            Визуальная концепция, интерфейс и техническая реализация этого сайта выполнены{" "}
            <a
              href="https://www.code1618.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading font-semibold transition-colors duration-300 hover:text-[var(--accent)]"
              style={{ color: "var(--text)" }}
            >
              студией CODE1618
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
