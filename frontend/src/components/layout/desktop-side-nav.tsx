"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Sun, Moon, ChevronRight } from "lucide-react";
import { useContactConfig } from "@/lib/contact-config-context";
import { NAV_SECTIONS, isNavGroup } from "@/lib/nav-sections";
import { useTheme } from "@/lib/theme-context";
import { useModal } from "@/lib/modal-context";
import { useThrottledScroll } from "@/lib/use-throttled-scroll";

export function DesktopSideNav() {
  const [visible, setVisible] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const { openModal } = useModal();
  const contact = useContactConfig();

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenSection(label);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenSection(null), 200);
  };

  const handleScroll = useCallback(() => {
    const trigger = document.querySelector("[data-navbar]");
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setVisible(rect.top <= 80);
  }, []);

  useThrottledScroll(handleScroll, 50);

  return (
    <>
      {/* ═══ Top horizontal navbar ═══ */}
      <div
        className="fixed top-0 left-0 right-0 lg:right-[60px] z-[52] transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div
          className="border-b"
          style={{
            backgroundColor: isDark ? "rgba(10,10,10,0.96)" : "rgba(255,255,255,0.96)",
            borderColor: "var(--border)",
          }}
        >
          <div className="container mx-auto flex items-center justify-between py-2.5 lg:py-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5 lg:gap-3">
              <Link href="/" className="shrink-0 flex items-center">
                <span
                  className="font-heading select-none flex flex-col leading-[1.05]"
                  style={{
                    color: "var(--text)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>ГАРАНТ</span>
                  <span>МОНТАЖ</span>
                </span>
              </Link>
              <a
                href={`tel:${contact.phone2Raw}`}
                className="shrink-0 font-heading font-semibold tabular-nums tracking-tight transition-opacity hover:opacity-100 text-[13px] sm:text-sm lg:text-[15px] xl:text-base whitespace-nowrap"
                style={{ color: "var(--text)" }}
              >
                {contact.phone2}
              </a>
            </div>

            {/* Mobile: theme + burger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
                style={{ borderColor: "var(--border)" }}
                aria-label="Переключить тему"
              >
                {isDark ? <Sun size={13} style={{ color: "var(--text-muted)" }} /> : <Moon size={13} style={{ color: "var(--text-muted)" }} />}
              </button>
              <button
                onClick={() => window.dispatchEvent(new Event("open-mobile-menu"))}
                className="w-8 h-8 flex flex-col items-center justify-center gap-[4px]"
                aria-label="Открыть меню"
              >
                <span className="block w-4 h-[1.5px]" style={{ backgroundColor: "var(--text)" }} />
                <span className="block w-4 h-[1.5px]" style={{ backgroundColor: "var(--text)" }} />
              </button>
            </div>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 whitespace-nowrap">
              {NAV_SECTIONS.map((section) => (
                <div
                  key={section.label}
                  className="relative"
                  onMouseEnter={() => handleEnter(section.label)}
                  onMouseLeave={handleLeave}
                >
                  <button
                    className="text-[11px] xl:text-xs uppercase tracking-[0.12em] xl:tracking-[0.15em] transition-colors py-2"
                    style={{ color: openSection === section.label ? "var(--text)" : "var(--text-muted)" }}
                  >
                    {section.label}
                  </button>

                  {openSection === section.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                      <div
                        className="min-w-[240px] py-2"
                        style={{
                          backgroundColor: isDark ? "rgba(20,20,20,0.98)" : "rgba(255,255,255,0.98)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                        }}
                      >
                        {section.items.map((item) =>
                          isNavGroup(item) ? (
                            <div key={item.label} className="relative group/sub">
                              <div
                                className="flex w-full cursor-default items-center justify-between gap-2 px-5 py-2.5 text-left text-xs uppercase tracking-[0.08em]"
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
                                {item.label}
                                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
                              </div>
                              <div className="absolute left-full top-0 z-50 hidden min-w-[240px] -ml-2 pl-2 group-hover/sub:block">
                                <div
                                  className="py-2 shadow-lg"
                                  style={{
                                    backgroundColor: isDark ? "rgba(20,20,20,0.98)" : "rgba(255,255,255,0.98)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "12px",
                                  }}
                                >
                                  {item.children.map((child) =>
                                    "action" in child && child.action === "openModal" ? (
                                      <button
                                        key={child.label}
                                        type="button"
                                        onClick={() => { setOpenSection(null); openModal(); }}
                                        className="w-full px-5 py-2.5 text-left text-xs uppercase tracking-[0.08em] transition-colors duration-200"
                                        style={{ color: "var(--text-muted)" }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.color = "var(--accent)";
                                          e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.color = "var(--text-muted)";
                                          e.currentTarget.style.backgroundColor = "transparent";
                                        }}
                                      >
                                        {child.label}
                                      </button>
                                    ) : "href" in child ? (
                                      <Link
                                        key={child.href}
                                        href={child.href}
                                        className="block px-5 py-2.5 text-xs uppercase tracking-[0.08em] transition-colors duration-200"
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
                                        {child.label}
                                      </Link>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : "action" in item && item.action === "openModal" ? (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => { setOpenSection(null); openModal(); }}
                              className="w-full px-5 py-2.5 text-left text-xs uppercase tracking-[0.08em] transition-colors duration-200"
                              style={{ color: "var(--text-muted)" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "var(--accent)";
                                e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "var(--text-muted)";
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              {item.label}
                            </button>
                          ) : "href" in item ? (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block px-5 py-2.5 text-xs uppercase tracking-[0.08em] transition-colors duration-200"
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
                              {item.label}
                            </Link>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={toggleTheme}
                className="ml-2 w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
                style={{ borderColor: "var(--border)" }}
                aria-label="Переключить тему"
              >
                {isDark ? (
                  <Sun size={14} style={{ color: "var(--text-muted)" }} />
                ) : (
                  <Moon size={14} style={{ color: "var(--text-muted)" }} />
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* ═══ Right vertical sidebar (desktop only) ═══ */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[52] hidden lg:flex flex-col items-center justify-between w-[60px] py-6 transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(100%)",
          pointerEvents: visible ? "auto" : "none",
          backgroundColor: isDark ? "rgba(10,10,10,0.96)" : "rgba(255,255,255,0.96)",
          borderLeft: "1px solid var(--border)",
        }}
      >
        {/* Top: messengers + contacts */}
        <div className="flex flex-col items-center gap-3">
          <a
            href={`tel:${contact.phoneRaw}`}
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)" }}
            aria-label={`Позвонить ${contact.phone}`}
            title={contact.phone}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" style={{ color: "var(--text-muted)" }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
          <a
            href={`tel:${contact.phone2Raw}`}
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)" }}
            aria-label={`Позвонить ${contact.phone2}`}
            title={contact.phone2}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" style={{ color: "var(--text-muted)" }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
          {contact.social.telegram && (
            <a
              href={contact.social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 hover:border-[#0088cc]"
              style={{ borderColor: "var(--border)" }}
              aria-label="Telegram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" style={{ color: "var(--text-muted)" }}>
                <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.855.075 1.644.357 1.937.793.825 2.009 1.467 3.097 2.033l.09.044c.397.208.775.406 1.025.607.282.219.435.396.484.52.05.124.065.278-.061.63-.136.38-.396.987-.744 1.773-.56 1.264-1.3 2.934-1.558 3.545-.19.453-.39.905-.078 1.384.156.24.397.44.742.508.346.068.626-.06.953-.217l.098-.046 3.965-2.556c.39 1.276.756 2.475 1.116 3.648.19.612.64.86 1.063.86.425 0 .822-.238 1.062-.86l3.065-10.39L21.198 4.58c.22-.085.468-.228.633-.46.165-.232.224-.544.174-.85a1.12 1.12 0 0 0-.807-.837z" />
              </svg>
            </a>
          )}
        </div>

        {/* Center: vertical text "Обсудить проект" — writing-mode только на тексте, без flex внутри (Safari/WebKit) */}
        <Link
          href="/offer"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          className="relative inline-flex flex-col items-center justify-center gap-2 py-1 transition-all duration-300"
        >
          <span
            className="block text-[10px] uppercase tracking-[0.2em] font-heading transition-colors duration-300"
            style={{
              color: btnHovered ? "var(--accent)" : "var(--text-muted)",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            Обсудить проект
          </span>
          <span className="flex shrink-0 items-center justify-center" aria-hidden>
            <ArrowRight
              size={12}
              className="transition-transform duration-300"
              style={{
                transform: btnHovered ? "rotate(90deg) translateY(2px)" : "rotate(90deg)",
              }}
            />
          </span>
        </Link>

        {/* Bottom: burger + scroll-to-top */}
        <div className="flex flex-col items-center gap-3">
          {/* Vertical burger — opens menu */}
          <button
            onClick={() => window.dispatchEvent(new Event("open-mobile-menu"))}
            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] transition-opacity duration-300 hover:opacity-100"
            style={{ opacity: 0.6 }}
            aria-label="Открыть меню"
          >
            <span className="block w-5 h-[1.5px]" style={{ backgroundColor: "var(--text)" }} />
            <span className="block w-5 h-[1.5px]" style={{ backgroundColor: "var(--text)" }} />
            <span className="block w-3 h-[1.5px]" style={{ backgroundColor: "var(--text)" }} />
          </button>

          {/* Scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)" }}
            aria-label="Наверх"
          >
            <ArrowUp size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>
      </div>
    </>
  );
}
