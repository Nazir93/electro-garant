"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";

function FillLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between mt-8 px-8 py-6 md:py-7 rounded-2xl font-heading text-xl md:text-2xl relative overflow-hidden transition-all duration-500"
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
}: {
  index: number;
  title: string;
  description: string;
  slug: string;
}) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

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
      style={{
        zIndex: index + 1,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center rounded-full transition-all duration-500 group cursor-pointer relative"
        style={{
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg)",
          height: isOpen ? "auto" : "80px",
          minHeight: "80px",
          overflow: isOpen ? "visible" : "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--bg)";
        }}
      >
        {/* Large number */}
        <span
          className="font-heading shrink-0 pl-3 sm:pl-4 md:pl-6 select-none transition-all duration-500"
          style={{
            color: "var(--text)",
            fontSize: isOpen ? "clamp(50px, 10vw, 80px)" : "clamp(60px, 14vw, 110px)",
            lineHeight: isOpen ? "1" : "0.75",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title */}
        <span
          className="font-heading text-base md:text-xl lg:text-2xl tracking-wide flex-1 text-center"
          style={{ color: "var(--text)" }}
        >
          {title}
        </span>

        {/* Plus icon */}
        <div className="shrink-0 pr-4 md:pr-6">
          <Plus
            size={22}
            className="transition-transform duration-300"
            style={{
              color: "var(--text)",
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-[height] duration-500 ease-in-out"
        style={{ height: `${contentHeight}px` }}
      >
        <div ref={contentRef} className="px-8 md:px-12 pt-6 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 max-w-3xl mx-auto">
            <p className="text-sm md:text-base leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>
              {description}
            </p>
            <Link
              href={slug}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] shrink-0 transition-colors duration-200 hover:text-[var(--accent)]"
              style={{ color: "var(--text)" }}
            >
              <span className="underline underline-offset-4">Подробнее</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="container mx-auto">
        {/* Title */}
        <h2
          className="font-heading text-[18vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] tracking-tighter mb-4"
          style={{ color: "var(--text)" }}
        >
          УСЛУГИ
        </h2>
        <p
          className="text-base md:text-lg mb-14 md:mb-20 max-w-xl"
          style={{ color: "var(--text-muted)" }}
        >
          Полный спектр электромонтажных работ — от проектирования до пусконаладки
        </p>

        {/* Service rows — bottom overlaps top */}
        <div className="flex flex-col">
          {SERVICES.map((service, i) => (
            <div key={service.id} style={{ marginTop: i > 0 ? "-16px" : "0" }}>
              <ServiceRow
                index={i}
                title={service.title}
                description={service.shortDescription}
                slug={service.slug}
              />
            </div>
          ))}
        </div>

        {/* View all */}
        <FillLink href="/services" label="Смотреть все услуги" />
      </div>
    </section>
  );
}
