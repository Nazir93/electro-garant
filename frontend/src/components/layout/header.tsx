"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { PHONE, PHONE_RAW, EMAIL, SERVICES } from "@/lib/constants";
import { useTheme } from "@/lib/theme-context";
import { useModal } from "@/lib/modal-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#about", label: "О нас" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/services", label: "Услуги", hasDropdown: true },
  { href: "/blog", label: "Блог" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toggleTheme, isDark } = useTheme();
  const { openModal } = useModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => setServicesOpen(false), 200);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "py-3 backdrop-blur-md" : "py-4 md:py-5",
        scrolled && "border-b",
      )}
      style={{
        backgroundColor: scrolled
          ? isDark ? "rgba(10,10,10,0.9)" : "rgba(255,255,255,0.9)"
          : "transparent",
        borderColor: scrolled ? "var(--border)" : "transparent",
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo + contacts */}
        <div className="flex items-center gap-6">
          <Link href="/" className="block shrink-0" aria-label="Гарант Монтаж">
            <div className="relative flex items-center select-none" style={{ height: "36px", width: "68px" }}>
              <span
                className="absolute left-0 leading-none"
                style={{
                  fontFamily: "var(--font-main), sans-serif",
                  fontSize: "40px",
                  fontWeight: 700,
                  color: "var(--text)",
                  top: "-3px",
                }}
              >
                Г
              </span>
              <span
                className="absolute right-0 leading-none"
                style={{
                  fontFamily: "var(--font-main), sans-serif",
                  fontSize: "40px",
                  fontWeight: 700,
                  color: "var(--text)",
                  top: "-3px",
                }}
              >
                М
              </span>
              <div
                className="absolute left-0 right-0 flex items-center justify-center z-10"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: scrolled
                    ? isDark ? "rgba(10,10,10,0.9)" : "rgba(255,255,255,0.9)"
                    : "var(--bg)",
                  padding: "2px 0",
                  transition: "background-color 0.5s",
                }}
              >
                <span
                  className="text-[5px] uppercase tracking-[0.2em] font-bold whitespace-nowrap"
                  style={{ color: "var(--text)" }}
                >
                  Гарант Монтаж
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <a href={`tel:${PHONE_RAW}`} className="hover:opacity-100 transition-opacity">
              {PHONE}
            </a>
            <span style={{ color: "var(--text-subtle)" }}>/</span>
            <a href={`mailto:${EMAIL}`} className="hover:opacity-100 transition-opacity">
              {EMAIL}
            </a>
          </div>
        </div>

        {/* Center: Navigation (desktop) */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={link.hasDropdown ? handleDropdownEnter : undefined}
              onMouseLeave={link.hasDropdown ? handleDropdownLeave : undefined}
            >
              <Link
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] transition-colors hover:opacity-100"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              >
                {link.label}
              </Link>

              {link.hasDropdown && servicesOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                >
                  <div
                    className="min-w-[280px] py-3 backdrop-blur-xl"
                    style={{
                      backgroundColor: isDark ? "rgba(20,20,20,0.95)" : "rgba(255,255,255,0.95)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                    }}
                  >
                    {SERVICES.map((service) => (
                      <Link
                        key={service.id}
                        href={service.slug}
                        className="flex items-center gap-3 px-5 py-3 transition-colors duration-200"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--text)";
                          e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-muted)";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <span className="text-xs uppercase tracking-[0.1em]">
                          {service.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: CTA + Theme toggle + mobile menu */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={openModal}
            className="hidden lg:block text-xs uppercase tracking-[0.15em] px-5 py-2.5 transition-all duration-300"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--text)";
              e.currentTarget.style.color = "var(--bg)";
              e.currentTarget.style.borderColor = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            Обсудить проект
          </button>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border"
            style={{ borderColor: "var(--border)" }}
            aria-label="Переключить тему"
          >
            {isDark ? (
              <Sun size={16} style={{ color: "var(--text-muted)" }} />
            ) : (
              <Moon size={16} style={{ color: "var(--text-muted)" }} />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isOpen ? (
              <X size={22} style={{ color: "var(--text)" }} />
            ) : (
              <Menu size={22} style={{ color: "var(--text)" }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu — fullscreen overlay */}
      <div
        className="lg:hidden fixed inset-0 top-0 z-40 transition-all duration-500"
        style={{
          backgroundColor: "var(--bg)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transform: isOpen ? "translateY(0)" : "translateY(-10px)",
        }}
      >
        <nav className="container mx-auto pt-24 pb-8 flex flex-col gap-1 h-full overflow-y-auto safe-bottom">
          {/* Main links */}
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="py-4 text-2xl sm:text-3xl font-heading border-b"
            style={{ color: "var(--text)", borderColor: "var(--border)" }}
          >
            О нас
          </Link>
          <Link
            href="/portfolio"
            onClick={() => setIsOpen(false)}
            className="py-4 text-2xl sm:text-3xl font-heading border-b"
            style={{ color: "var(--text)", borderColor: "var(--border)" }}
          >
            Портфолио
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className="py-4 text-2xl sm:text-3xl font-heading border-b"
            style={{ color: "var(--text)", borderColor: "var(--border)" }}
          >
            Блог
          </Link>

          {/* Services list */}
          <div className="py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <Link
              href="/services"
              onClick={() => setIsOpen(false)}
              className="text-2xl sm:text-3xl font-heading block mb-4"
              style={{ color: "var(--text)" }}
            >
              Услуги
            </Link>
            <div className="flex flex-col gap-3 pl-4" style={{ borderLeft: "2px solid var(--accent)" }}>
              {SERVICES.map((service) => (
                <Link
                  key={service.id}
                  href={service.slug}
                  onClick={() => setIsOpen(false)}
                  className="text-sm py-1 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-8" />

          {/* CTA + contacts */}
          <div className="pt-4">
            <button
              onClick={() => { setIsOpen(false); openModal(); }}
              className="w-full py-4 text-lg font-heading text-center rounded-full mb-6"
              style={{ backgroundColor: "var(--accent)", color: "#0A0A0A" }}
            >
              Обсудить проект
            </button>
            <div className="flex flex-col gap-3">
              <a href={`tel:${PHONE_RAW}`} className="text-base" style={{ color: "var(--text-muted)" }}>
                {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="text-base" style={{ color: "var(--text-muted)" }}>
                {EMAIL}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
