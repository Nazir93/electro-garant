"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/lib/modal-context";
import { useTheme } from "@/lib/theme-context";

const ANNOTATIONS = [
  {
    id: "security",
    label: "Видеонаблюдение",
    desc: "IP-камеры, контроль доступа",
    href: "/services/security",
    dotX: 33, dotY: 33,
    labelX: 15, labelY: 24,
    align: "left" as const,
    icon: "eye",
  },
  {
    id: "acoustics",
    label: "Акустика",
    desc: "Звуковые системы для бизнеса",
    href: "/services/acoustics",
    dotX: 37, dotY: 50,
    labelX: 8, labelY: 28,
    align: "right" as const,
    icon: "speaker",
  },
  {
    id: "electrical",
    label: "Электромонтаж",
    desc: "Силовые сети, освещение",
    href: "/services/electrical",
    dotX: 53, dotY: 46,
    labelX: 10, labelY: 55,
    align: "right" as const,
    icon: "zap",
  },
  {
    id: "smart-home",
    label: "Умный дом",
    desc: "Автоматизация и управление",
    href: "/services/smart-home",
    dotX: 58, dotY: 60,
    labelX: 20, labelY: 64,
    align: "left" as const,
    icon: "home",
  },
  {
    id: "cabling",
    label: "Слаботочные системы",
    desc: "СКС, интернет, телефония",
    href: "/services/structured-cabling",
    dotX: 28, dotY: 60,
    labelX: 8, labelY: 64,
    align: "right" as const,
    icon: "network",
  },
  {
    id: "lighting",
    label: "Архитектурная подсветка",
    desc: "LED-подсветка фасадов и интерьеров",
    href: "/services/electrical",
    dotX: 55, dotY: 34,
    labelX: 40, labelY: 25,
    align: "left" as const,
    icon: "light",
  },
];

const ICONS: Record<string, React.ReactNode> = {
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  speaker: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  light: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
};

export function BannerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [cursorIn, setCursorIn] = useState(false);
  const [cursorDown, setCursorDown] = useState(false);
  const { openModal } = useModal();
  const { isDark } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!cursorRef.current || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    cursorRef.current.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -50%)`;
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        height: "100dvh",
        minHeight: "600px",
        backgroundColor: "#000000",
        cursor: "none",
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setCursorIn(true)}
      onMouseLeave={() => { setCursorIn(false); setCursorDown(false); }}
      onMouseDown={() => setCursorDown(true)}
      onMouseUp={() => setCursorDown(false)}
    >
      {/* Custom cursor — circle + lightning */}
      <div
        ref={cursorRef}
        className="absolute z-[20] pointer-events-none hidden md:block"
        style={{
          top: 0,
          left: 0,
          width: cursorDown ? "48px" : "56px",
          height: cursorDown ? "48px" : "56px",
          opacity: cursorIn ? 1 : 0,
          transition: "width 0.15s, height 0.15s, opacity 0.2s",
          willChange: "transform",
        }}
      >
        <svg viewBox="0 0 56 56" fill="none" className="w-full h-full">
          <circle
            cx="28" cy="28" r="26"
            stroke="rgba(201,168,76,1)" strokeWidth="2"
            fill="rgba(0,0,0,0.25)"
          />
          <path
            d="M29 13L19 29h8l-2 14 10-16h-8l2-14z"
            fill="rgba(201,168,76,1)"
          />
        </svg>
      </div>
      {/* ============== Mobile + Tablet: title at top ============== */}
      <div
        className="absolute md:hidden top-16 sm:top-20 left-0 right-0 z-[6] flex justify-center transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
        }}
      >
        <h1 className="font-heading font-bold leading-[0.92] tracking-tight text-white text-center">
          <span
            className="block text-[clamp(36px,10vw,70px)] sm:text-[clamp(44px,8vw,72px)]"
            style={{ color: "rgba(201,168,76,1)" }}
          >
            ГАРАНТ
          </span>
          <span className="block text-[clamp(36px,10vw,70px)] sm:text-[clamp(44px,8vw,72px)]">МОНТАЖ</span>
        </h1>
      </div>

      {/* ============== LAYOUT: left text (desktop) + house ============== */}
      <div className="relative z-[2] h-full flex items-center md:flex-row">

        {/* ---- LEFT: Title (desktop only) ---- */}
        <div className="hidden md:flex flex-shrink-0 w-[25%] lg:w-[32%] h-full flex-col items-start justify-end pl-[12%] lg:pl-[16%] pr-4 pb-[22%] z-[5]">
          <div
            className="transition-all duration-1000"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <h1 className="font-heading font-bold leading-[0.92] tracking-tight text-white">
              <span
                className="block text-[clamp(36px,7vw,90px)]"
                style={{ color: "rgba(201,168,76,1)" }}
              >
                ГАРАНТ
              </span>
              <span className="block text-[clamp(36px,7vw,90px)]">МОНТАЖ</span>
            </h1>
          </div>
        </div>

        {/* ---- Mobile/Tablet: spinning circle as main element ---- */}
        <div className="flex-1 md:hidden h-full flex items-center justify-center relative">
          <div
            className="relative transition-all duration-1000 delay-300"
            style={{
              width: "clamp(200px, 55vw, 320px)",
              height: "clamp(200px, 55vw, 320px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.85)",
            }}
          >
            {/* Rotating text ring */}
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 w-full h-full"
              style={{ animation: "spin-slow 12s linear infinite" }}
            >
              <defs>
                <path
                  id="circlePathMobile"
                  d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
                />
              </defs>
              <text
                className="uppercase"
                style={{
                  fill: isDark ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.95)",
                  fontSize: "14.5px",
                  fontWeight: 600,
                  transition: "fill 0.5s",
                }}
              >
                <textPath
                  href="#circlePathMobile"
                  startOffset="0%"
                  textLength={2 * Math.PI * 82 * 0.88}
                  lengthAdjust="spacing"
                >
                  НАЧАТЬ РАБОТАТЬ С ГАРАНТ МОНТАЖ
                </textPath>
              </text>
            </svg>

            {/* Center: lightning + glow */}
            <button
              onClick={openModal}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Начать работать с Гарант Монтаж"
            >
              <div
                className="w-[50%] h-[50%] rounded-full flex items-center justify-center transition-all duration-700"
                style={{
                  backgroundColor: isDark ? "rgba(201,168,76,0.08)" : "rgba(201,168,76,0.12)",
                  border: `1.5px solid ${isDark ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.7)"}`,
                  boxShadow: isDark
                    ? "0 0 20px 5px rgba(201,168,76,0.15)"
                    : "0 0 30px 8px rgba(255,255,255,0.3), inset 0 0 15px rgba(255,255,255,0.15)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-[40%] h-[40%]">
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    fill="rgba(201,168,76,1)"
                  />
                </svg>
              </div>
            </button>

            {/* Outer ring */}
            <div
              className="absolute inset-[2px] rounded-full pointer-events-none transition-all duration-700"
              style={{
                border: `1px solid ${isDark ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.5)"}`,
                boxShadow: isDark
                  ? "none"
                  : "0 0 30px 6px rgba(255,255,255,0.2), inset 0 0 15px 3px rgba(255,255,255,0.08)",
              }}
            />
          </div>
        </div>

        {/* ---- House image + annotation dots + label cards (desktop only) ---- */}
        <div className="hidden md:flex flex-1 h-full items-center justify-center relative px-0">
          <div
            className="relative w-[85%] sm:w-[70%] max-w-[500px] md:max-w-none md:w-[105%] lg:w-[100%] aspect-square transition-all duration-1000 delay-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.92)",
            }}
          >
            {/* House image */}
            <Image
              src="/IMG_0980.PNG"
              alt="Гарант Монтаж — полный цикл электромонтажных работ"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 0vw, 60vw"
            />

            {/* ---- SVG: dots + connecting lines ---- */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 2 }}
            >
              {ANNOTATIONS.map((a) => {
                const isHov = hoveredId === a.id;
                return (
                  <g
                    key={a.id}
                    className="transition-opacity duration-500"
                    style={{ opacity: visible ? 1 : 0 }}
                  >
                    {/* Line from dot to label */}
                    <line
                      x1={a.dotX}
                      y1={a.dotY}
                      x2={a.labelX}
                      y2={a.labelY}
                      stroke={isHov ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.25)"}
                      strokeWidth="0.2"
                      strokeDasharray="0.8 0.6"
                      className="transition-all duration-300"
                    />

                    {/* Center dot */}
                    <circle
                      cx={a.dotX}
                      cy={a.dotY}
                      r={isHov ? 1.2 : 0.8}
                      fill={isHov ? "rgba(201,168,76,1)" : "rgba(201,168,76,0.8)"}
                      className="transition-all duration-300"
                    />

                    {/* Label endpoint dot */}
                    <circle
                      cx={a.labelX}
                      cy={a.labelY}
                      r="0.5"
                      fill="rgba(201,168,76,0.6)"
                    />
                  </g>
                );
              })}
            </svg>

            {/* ---- Floating label cards around the house (desktop) ---- */}
            {ANNOTATIONS.map((a, i) => {
              const isHov = hoveredId === a.id;
              const isLeft = a.align === "left";
              return (
                <div
                  key={a.id}
                  className="absolute hidden md:flex items-center gap-1.5 z-[3] transition-all duration-500 cursor-none"
                  style={{
                    top: `${a.labelY}%`,
                    left: isLeft ? `${a.labelX}%` : undefined,
                    right: !isLeft ? `${100 - a.labelX}%` : undefined,
                    opacity: visible ? 1 : 0,
                    transitionDelay: `${700 + i * 120}ms`,
                  }}
                  onMouseEnter={() => setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Link
                    href={a.href}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-300 cursor-none"
                    style={{
                      backgroundColor: isHov ? "rgba(201,168,76,0.15)" : "rgba(0,0,0,0.75)",
                      border: `1px solid ${isHov ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: isHov ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.1)",
                        color: isHov ? "rgba(201,168,76,1)" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {ICONS[a.icon]}
                    </span>
                    <span
                      className="text-[9px] lg:text-[10px] tracking-wide uppercase whitespace-nowrap transition-colors duration-300 pr-1"
                      style={{ color: isHov ? "rgba(201,168,76,1)" : "rgba(255,255,255,0.7)" }}
                    >
                      {a.label}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ---- Bottom center: slogan ---- */}
      <div
        className="absolute bottom-10 sm:bottom-14 md:bottom-16 left-0 right-0 z-[7] flex items-center justify-center px-4 transition-all duration-1000 delay-[1000ms]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <p
          className="text-[12px] sm:text-[clamp(14px,1.8vw,22px)] md:text-[clamp(16px,1.8vw,24px)] font-light tracking-wide whitespace-nowrap"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          Мы не создаём проблем — мы их решаем
        </p>
      </div>

      {/* ---- Circular CTA: spinning text + lightning center (desktop only) ---- */}
      <button
        onClick={openModal}
        onMouseEnter={() => setCtaHovered(true)}
        onMouseLeave={() => setCtaHovered(false)}
        className="absolute z-[10] cursor-none transition-all duration-700 hidden md:block"
        style={{
          bottom: "clamp(80px, 15%, 160px)",
          right: "clamp(40px, 8%, 120px)",
          width: "clamp(130px, 18vw, 190px)",
          height: "clamp(130px, 18vw, 190px)",
        }}
        aria-label="Начать работать с Гарант Монтаж"
      >
        {/* Rotating text ring */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={{
            animation: "spin-slow 12s linear infinite",
          }}
        >
          <defs>
            <path
              id="circlePath"
              d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
            />
          </defs>
          <text
            className="uppercase"
            style={{
              fill: ctaHovered
                ? "rgba(201,168,76,1)"
                : isDark
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.95)",
              fontSize: "14.5px",
              fontWeight: 600,
              transition: "fill 0.5s",
            }}
          >
            <textPath
              href="#circlePath"
              startOffset="0%"
              textLength={2 * Math.PI * 82 * 0.95}
              lengthAdjust="spacing"
            >
              НАЧАТЬ РАБОТАТЬ С ГАРАНТ МОНТАЖ
            </textPath>
          </text>
        </svg>

        {/* Center: lightning icon + glow */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
          style={{ transform: ctaHovered ? "scale(1.12)" : "scale(1)" }}
        >
          <div
            className="w-[52%] h-[52%] rounded-full flex items-center justify-center transition-all duration-700"
            style={{
              backgroundColor: ctaHovered
                ? "rgba(201,168,76,0.25)"
                : isDark
                  ? "rgba(201,168,76,0.08)"
                  : "rgba(201,168,76,0.12)",
              border: `1.5px solid ${
                ctaHovered
                  ? "rgba(201,168,76,0.8)"
                  : isDark
                    ? "rgba(201,168,76,0.35)"
                    : "rgba(255,255,255,0.7)"
              }`,
              boxShadow: ctaHovered
                ? "0 0 30px 8px rgba(201,168,76,0.35), inset 0 0 15px rgba(201,168,76,0.15)"
                : isDark
                  ? "0 0 15px 3px rgba(201,168,76,0.1)"
                  : "0 0 25px 6px rgba(255,255,255,0.3), inset 0 0 12px rgba(255,255,255,0.15)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-[45%] h-[45%]">
              <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    fill="rgba(201,168,76,1)"
                  />
            </svg>
          </div>
        </div>

        {/* Outer ring border */}
        <div
          className="absolute inset-[2px] rounded-full pointer-events-none transition-all duration-700"
          style={{
            border: `1px solid ${
              ctaHovered
                ? "rgba(201,168,76,0.6)"
                : isDark
                  ? "rgba(201,168,76,0.2)"
                  : "rgba(255,255,255,0.5)"
            }`,
            boxShadow: ctaHovered
              ? "0 0 20px 4px rgba(201,168,76,0.15)"
              : isDark
                ? "none"
                : "0 0 30px 6px rgba(255,255,255,0.2), inset 0 0 15px 3px rgba(255,255,255,0.08)",
          }}
        />
      </button>

      {/* ---- Glowing frame border — reacts to theme ---- */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-all duration-1000"
        style={{
          border: isDark ? "1px solid rgba(201,168,76,0.15)" : "1px solid rgba(255,255,255,0.6)",
          margin: "10px",
          borderRadius: "4px",
          boxShadow: isDark
            ? "0 0 15px 2px rgba(201,168,76,0.08)"
            : "0 0 30px 6px rgba(255,255,255,0.3)",
        }}
      />

      {/* Subtle vignette — lightweight */}
      <div
        className="absolute inset-0 z-[0] pointer-events-none"
        style={{ boxShadow: "inset 0 0 40px 15px rgba(0,0,0,0.3)" }}
      />
    </section>
  );
}
