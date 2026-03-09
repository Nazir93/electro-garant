"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";

function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <Link
        href={service.slug}
        className="group block relative overflow-hidden transition-transform duration-500 hover:scale-[0.98]"
        style={{
          border: "1px solid var(--border)",
          borderRadius: "24px",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image placeholder */}
        <div
          className="aspect-[16/9] flex items-center justify-center"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
            Фото услуги
          </span>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <span
              className="font-heading text-5xl md:text-6xl leading-none"
              style={{ color: "var(--text-subtle)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: hovered ? "var(--text)" : "transparent",
              }}
            >
              <ArrowRight
                size={20}
                className="transition-all duration-300 group-hover:translate-x-0.5"
                style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
              />
            </div>
          </div>

          <h3
            className="font-heading text-2xl md:text-3xl leading-[1.05] mb-3 transition-colors duration-200 group-hover:text-[var(--accent)]"
            style={{ color: "var(--text)" }}
          >
            {service.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {service.shortDescription}
          </p>
        </div>
      </Link>
    </div>
  );
}

export function ServicesPageContent() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto">
        {/* Title */}
        <h1
          className="font-heading text-[20vw] md:text-[14vw] lg:text-[12vw] leading-[0.85] tracking-tighter mb-6"
          style={{ color: "var(--text)" }}
        >
          УСЛУГИ
        </h1>
        <p className="text-base md:text-lg mb-14 md:mb-20 max-w-xl" style={{ color: "var(--text-muted)" }}>
          Полный спектр электромонтажных работ — от проектирования и поставки оборудования до монтажа и пусконаладки
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
