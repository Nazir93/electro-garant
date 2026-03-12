"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CITY, PHONE, PHONE_RAW, EMAIL, SERVICES } from "@/lib/constants";

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function ServiceCard({
  title,
  slug,
  opacity,
  scale,
  borderRadius,
}: {
  title: string;
  slug: string;
  opacity: number;
  scale: number;
  borderRadius: number;
}) {
  return (
    <Link
      href={slug}
      className="w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-300 group"
      style={{
        opacity,
        transform: `scale(${scale})`,
        borderRadius: `${borderRadius}px`,
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <span
        className="text-xs md:text-sm uppercase tracking-[0.1em] text-center px-3 transition-colors duration-300 group-hover:text-[var(--accent)]"
        style={{ color: "var(--text-muted)", opacity }}
      >
        {title}
      </span>
    </Link>
  );
}

/* ── Mobile service link ── */
function MobileServiceLink({ title, slug }: { title: string; slug: string }) {
  return (
    <Link
      href={slug}
      className="flex items-center justify-between py-4 border-b group"
      style={{ borderColor: "var(--border)" }}
    >
      <span
        className="text-sm uppercase tracking-[0.08em] transition-colors duration-200 group-hover:text-[var(--accent)]"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </span>
      <ArrowRight size={14} style={{ color: "var(--text-subtle)" }} />
    </Link>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = -rect.top;
      const scrollRange = sectionHeight - viewportH;
      const p = clamp(scrolled / scrollRange, 0, 1);
      setProgress(p);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scale = 1 - progress * 0.15;
  const borderRadius = progress * 24;
  const gap = progress * 16;
  const sideOpacity = clamp(progress * 2.5 - 0.5, 0, 1);
  const sideScale = 0.85 + sideOpacity * 0.15;
  const textScale = 1 - progress * 0.2;

  return (
    <>
      {/* Desktop: scroll-driven grid animation */}
      <section
        ref={sectionRef}
        className="relative hidden md:block"
        style={{ height: "250vh", backgroundColor: "var(--bg)" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="h-full flex flex-col"
            style={{ padding: `${gap}px`, gap: `${gap}px` }}
          >
            {/* Top row: service1 | HERO | service2 */}
            <div className="flex flex-1 min-h-0" style={{ gap: `${gap}px` }}>
              <div style={{ flex: `0 0 ${progress * 20}%` }}>
                <ServiceCard
                  title={SERVICES[0].title}
                  slug={SERVICES[0].slug}
                  opacity={sideOpacity}
                  scale={sideScale}
                  borderRadius={borderRadius}
                />
              </div>

              {/* Center — main hero */}
              <div
                className="relative flex-1 overflow-hidden flex items-center justify-center"
                style={{
                  borderRadius: `${borderRadius}px`,
                  transform: `scale(${scale})`,
                  backgroundColor: "var(--bg)",
                  boxShadow: progress > 0.1 ? "0 0 0 1px var(--border)" : "none",
                }}
              >
                {/* Ghost text */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  style={{
                    transform: `translate(${mouse.x * -15}px, ${mouse.y * -10}px) scale(${textScale})`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <h2
                    className="font-heading text-[12vw] leading-[0.85] text-center whitespace-nowrap opacity-[0.03]"
                    style={{ color: "var(--text)" }}
                  >
                    ГАРАНТ<br />МОНТАЖ
                  </h2>
                </div>

                {/* Main heading */}
                <div
                  className="relative z-10 container mx-auto"
                  style={{
                    transform: `translate(${mouse.x * 8}px, ${mouse.y * 5}px) scale(${textScale})`,
                    transition: "transform 0.2s ease-out",
                    transformOrigin: "center center",
                  }}
                >
                  <h1 className="font-heading text-[clamp(40px,6.5vw,140px)] leading-[0.9] tracking-tight">
                    <span style={{ color: "var(--text)" }}>ЭЛЕКТРОМОНТАЖ</span>
                    <br />
                    <span style={{ color: "var(--accent)" }}>ПРЕМИУМ-КЛАССА</span>
                  </h1>
                </div>

                {/* Subtitle */}
                <div
                  className="absolute bottom-12 left-0 right-0 container mx-auto z-10"
                  style={{ transform: `scale(${textScale})`, transformOrigin: "bottom left" }}
                >
                  <p className="text-xs uppercase tracking-[0.3em] max-w-md leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир в {CITY}
                  </p>
                </div>

                {/* Contacts */}
                <div
                  className="absolute bottom-12 right-0 container mx-auto z-10 flex justify-end"
                  style={{ transform: `scale(${textScale})`, transformOrigin: "bottom right" }}
                >
                  <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    <span style={{ color: "var(--text-subtle)" }}>/</span>
                    <a href={`tel:${PHONE_RAW}`}>{PHONE}</a>
                  </div>
                </div>
              </div>

              <div style={{ flex: `0 0 ${progress * 22}%` }}>
                <ServiceCard
                  title={SERVICES[1].title}
                  slug={SERVICES[1].slug}
                  opacity={sideOpacity}
                  scale={sideScale}
                  borderRadius={borderRadius}
                />
              </div>
            </div>

            {/* Bottom row: 3 services */}
            <div
              className="flex min-h-0"
              style={{
                flex: `0 0 ${progress * 35}%`,
                gap: `${gap}px`,
                opacity: sideOpacity,
              }}
            >
              {SERVICES.slice(2).map((s) => (
                <div key={s.id} className="flex-1 flex">
                  <ServiceCard
                    title={s.title}
                    slug={s.slug}
                    opacity={sideOpacity}
                    scale={sideScale}
                    borderRadius={borderRadius}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: static hero + service links */}
      <section
        className="md:hidden relative overflow-hidden"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Hero content */}
        <div className="min-h-[70vh] flex flex-col justify-center px-5 sm:px-8 py-12">
          {/* Ghost text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <h2
              className="font-heading text-[28vw] leading-[0.85] text-center whitespace-nowrap opacity-[0.03]"
              style={{ color: "var(--text)" }}
            >
              ГАРАНТ<br />МОНТАЖ
            </h2>
          </div>

          <div className="relative z-10">
            <h1 className="font-heading text-[clamp(28px,9vw,60px)] leading-[0.92] tracking-tight mb-6">
              <span style={{ color: "var(--text)" }}>ЭЛЕКТРОМОНТАЖ</span>
              <br />
              <span style={{ color: "var(--accent)" }}>ПРЕМИУМ-КЛАССА</span>
            </h1>
            <p
              className="text-[11px] uppercase tracking-[0.2em] max-w-xs leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир в {CITY}
            </p>
          </div>
        </div>

        {/* Mobile services list */}
        <div className="px-5 sm:px-8 pb-8">
          <p
            className="text-[9px] uppercase tracking-[0.25em] mb-4"
            style={{ color: "var(--text-subtle)" }}
          >
            Наши услуги
          </p>
          <div className="border-t" style={{ borderColor: "var(--border)" }}>
            {SERVICES.map((service) => (
              <MobileServiceLink
                key={service.id}
                title={service.title}
                slug={service.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
