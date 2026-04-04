"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ServiceItem } from "@/lib/get-services";
import { resolveServiceCardMedia } from "@/lib/service-card-media";
import { useModal } from "@/lib/modal-context";

function ServiceCard({
  service,
  index,
}: {
  service: ServiceItem;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const media = resolveServiceCardMedia(service);

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
        href={service.slug.startsWith("/") ? service.slug : `/services/${service.slug}`}
        className="group block relative overflow-hidden transition-transform duration-500 hover:scale-[0.98]"
        style={{
          border: "1px solid var(--border)",
          borderRadius: "24px",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="aspect-[16/9] flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          {media.videoUrl ? (
            <video
              src={media.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden
            />
          ) : media.coverImage ? (
            <Image
              src={media.coverImage}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
              Фото услуги
            </span>
          )}
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

function CostBanner() {
  const { openModal } = useModal();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="mb-14 md:mb-20 p-6 sm:p-8 md:p-10 rounded-2xl relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="font-heading text-xl sm:text-2xl md:text-3xl mb-2">
            Рассчитать стоимость проектных работ
          </h3>
          <p className="text-sm max-w-lg" style={{ color: "var(--text-muted)" }}>
            Подберём оптимальное решение под ваш бюджет и задачи. Бесплатная консультация инженера.
          </p>
        </div>
        <button
          onClick={openModal}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="shrink-0 flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 font-heading text-base sm:text-lg relative overflow-hidden transition-all duration-500"
          style={{ border: "1px solid var(--border)", borderRadius: "60px" }}
        >
          <div
            className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ backgroundColor: "var(--accent)", transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
          />
          <span className="relative z-10 transition-colors duration-700" style={{ color: hovered ? "#0A0A0A" : "var(--text)" }}>
            Рассчитать
          </span>
          <ArrowRight size={18} className="relative z-10 transition-colors duration-700" style={{ color: hovered ? "#0A0A0A" : "var(--text)" }} />
        </button>
      </div>
    </div>
  );
}

export function ServicesPageContent({ services }: { services: ServiceItem[] }) {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto">
        {/* Title */}
        <h1
          className="font-heading text-[clamp(40px,14vw,180px)] leading-[0.85] tracking-tighter mb-6"
          style={{ color: "var(--text)" }}
        >
          УСЛУГИ
        </h1>
        <p className="text-base md:text-lg mb-10 md:mb-14 max-w-xl" style={{ color: "var(--text-muted)" }}>
          Полный спектр электромонтажных работ — от проектирования и поставки оборудования до монтажа и пусконаладки
        </p>

        {/* Cost banner */}
        <CostBanner />

        {/* Grid — те же данные, что и на главной: из БД (админка) или fallback из constants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
