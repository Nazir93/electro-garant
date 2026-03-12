"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";

function FillLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between mt-6 sm:mt-8 px-5 sm:px-8 py-5 sm:py-6 md:py-7 rounded-2xl font-heading text-lg sm:text-xl md:text-2xl relative overflow-hidden transition-all duration-500"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] rounded-2xl"
        style={{
          backgroundColor: "var(--text)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      <span
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      >
        {label}
      </span>
      <ArrowRight
        size={22}
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      />
    </Link>
  );
}

function ServiceRow({
  index,
  title,
  description,
  slug,
  onHover,
  isActive,
}: {
  index: number;
  title: string;
  description: string;
  slug: string;
  onHover: (i: number | null) => void;
  isActive: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="relative transition-all duration-700 ease-out"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      style={{
        zIndex: isActive ? 20 : index + 1,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <Link
        href={slug}
        className="w-full flex items-center rounded-full cursor-pointer relative"
        style={{
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg)",
          height: "clamp(56px, 10vw, 80px)",
        }}
      >
        <span
          className="font-heading shrink-0 pl-2 sm:pl-4 md:pl-6 select-none"
          style={{
            color: "var(--text)",
            fontSize: "clamp(40px, 12vw, 110px)",
            lineHeight: "0.75",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className="font-heading text-xs sm:text-sm md:text-xl lg:text-2xl tracking-wide flex-1 text-center px-2"
          style={{ color: "var(--text)" }}
        >
          {title}
        </span>

        <div className="shrink-0 pr-3 sm:pr-4 md:pr-6">
          <ArrowRight size={20} style={{ color: "var(--text)" }} />
        </div>
      </Link>

      {/* Popup card — appears above the row (desktop only) */}
      <div
        className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[90%] max-w-lg pointer-events-none"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
          transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)",
          ...(index === 0 ? { top: "100%", marginTop: "12px" } : { bottom: "100%", marginBottom: "12px" }),
        }}
      >
        <div
          className="flex flex-col sm:flex-row items-stretch gap-4 rounded-2xl p-4 sm:p-5 relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 30px rgba(0,0,0,0.1)",
          }}
        >
          {/* Smoke/glow effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
            }}
          />

          <div
            className="w-full sm:w-[200px] shrink-0 aspect-[4/3] rounded-xl flex items-center justify-center overflow-hidden relative z-10"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          >
            <span className="text-[8px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
              Фото — {title}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center relative z-10">
            <h4 className="font-heading text-sm sm:text-base mb-2" style={{ color: "var(--text)" }}>
              {title}
            </h4>
            <p className="text-[11px] sm:text-xs leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
              {description}
            </p>
            <span
              className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em]"
              style={{ color: "var(--accent)" }}
            >
              <span className="underline underline-offset-4">Подробнее</span>
              <ArrowRight size={10} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link href="/price" className="block mt-10 sm:mt-14 group">
      <div
        ref={ref}
        className="relative rounded-2xl overflow-hidden transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
        }}
      >
        {/* Pulsing gold border glow */}
        <div
          className="absolute inset-0 rounded-2xl price-pulse-border"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.05), rgba(201,168,76,0.2), rgba(201,168,76,0.05))",
            backgroundSize: "300% 300%",
            padding: "1px",
          }}
        />

        {/* Inner content */}
        <div
          className="relative m-[1px] rounded-2xl px-6 sm:px-10 md:px-14 py-8 sm:py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {/* Subtle glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none price-pulse-glow"
            style={{
              background: "radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)",
            }}
          />

          {/* Left */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-1.5 h-1.5 rounded-full price-pulse-dot"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span
                className="text-[10px] sm:text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--accent)" }}
              >
                Актуальные цены
              </span>
            </div>
            <h3
              className="font-heading text-xl sm:text-2xl md:text-3xl mb-2"
              style={{ color: "var(--text)" }}
            >
              Прайс-лист
            </h3>
            <p
              className="text-xs sm:text-sm max-w-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Ориентировочные цены на все виды электромонтажных работ
            </p>
          </div>

          {/* Right */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            <span
              className="font-heading text-xs sm:text-sm uppercase tracking-[0.12em] group-hover:tracking-[0.18em] transition-all duration-500"
              style={{ color: "var(--text)" }}
            >
              Смотреть цены
            </span>
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-500 group-hover:scale-110"
              style={{ borderColor: "var(--accent)" }}
            >
              <ArrowRight
                size={16}
                className="transition-transform duration-500 group-hover:translate-x-0.5"
                style={{ color: "var(--accent)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="py-16 sm:py-20 md:py-28"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="container mx-auto">
        <h2
          className="font-heading text-[15vw] sm:text-[18vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] tracking-tighter mb-3 sm:mb-4"
          style={{ color: "var(--text)" }}
        >
          УСЛУГИ
        </h2>
        <p
          className="text-sm sm:text-base md:text-lg mb-10 sm:mb-14 md:mb-20 max-w-xl"
          style={{ color: "var(--text-muted)" }}
        >
          Полный спектр электромонтажных работ — от проектирования до пусконаладки
        </p>

        <div className="flex flex-col">
          {SERVICES.map((service, i) => (
            <div key={service.id} style={{ marginTop: i > 0 ? "-10px" : "0" }}>
              <ServiceRow
                index={i}
                title={service.title}
                description={service.shortDescription}
                slug={service.slug}
                onHover={setHoveredIndex}
                isActive={hoveredIndex === i}
              />
            </div>
          ))}
        </div>

        <FillLink href="/services" label="Смотреть все услуги" />

        {/* Price banner */}
        <PriceBanner />
      </div>
    </section>
  );
}
