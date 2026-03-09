"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CITY, PHONE, PHONE_RAW, EMAIL, SERVICES } from "@/lib/constants";
import { useModal } from "@/lib/modal-context";

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

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { openModal } = useModal();
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
  const textOpacity = 1;
  const textScale = 1 - progress * 0.3;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "250vh", backgroundColor: "var(--bg)" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="h-full flex flex-col"
          style={{ padding: `${gap}px`, gap: `${gap}px` }}
        >
          {/* Top row: service1 | HERO | service2 */}
          <div className="flex flex-1 min-h-0" style={{ gap: `${gap}px` }}>
            {/* Service 1: Акустика */}
            <div
              className="hidden md:flex h-full"
              style={{ flex: `0 0 ${progress * 20}%` }}
            >
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
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
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
                className="relative z-10 container mx-auto px-4"
                style={{
                  transform: `translate(${mouse.x * 8}px, ${mouse.y * 5}px) scale(${textScale})`,
                  transition: "transform 0.2s ease-out",
                }}
              >
                <h1 className="font-heading text-[11vw] sm:text-[9vw] md:text-[8vw] leading-[0.9] tracking-tight">
                  <span style={{ color: "var(--text)" }}>ЭЛЕКТРОМОНТАЖ</span>
                  <br />
                  <span style={{ color: "var(--accent)" }}>ПРЕМИУМ-КЛАССА</span>
                </h1>
              </div>

              {/* Subtitle */}
              <div
                className="absolute bottom-12 left-0 container mx-auto px-4 z-10"
                style={{ transform: `scale(${textScale})`, transformOrigin: "bottom left" }}
              >
                <p className="text-xs uppercase tracking-[0.3em] max-w-md" style={{ color: "var(--text-muted)" }}>
                  Проектирование, поставка и монтаж электрики<br />для ресторанов, офисов и квартир в {CITY}
                </p>
              </div>

              {/* Contacts */}
              <div
                className="absolute bottom-12 right-0 container mx-auto px-4 z-10 hidden md:flex justify-end"
                style={{ transform: `scale(${textScale})`, transformOrigin: "bottom right" }}
              >
                <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                  <span style={{ color: "var(--text-subtle)" }}>/</span>
                  <a href={`tel:${PHONE_RAW}`}>{PHONE}</a>
                </div>
              </div>

              {/* CTA */}
              <div
                className="absolute right-4 sm:right-8 md:right-16 top-1/2 z-20"
                style={{
                  transform: `translate(${mouse.x * -12}px, calc(-50% + ${mouse.y * -8}px)) scale(${textScale})`,
                  transition: "transform 0.25s ease-out",
                }}
              >
                <button
                  onClick={openModal}
                  className="group w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all duration-500 hover:scale-105"
                  style={{ borderColor: "var(--border)", backgroundColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--accent)";
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "#0A0A0A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text)";
                  }}
                >
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] font-medium">
                    Обсудить<br />проект
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* Service 2: Электромонтаж */}
            <div
              className="hidden md:flex h-full"
              style={{ flex: `0 0 ${progress * 22}%` }}
            >
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
            className="hidden md:flex min-h-0"
            style={{
              flex: `0 0 ${progress * 35}%`,
              gap: `${gap}px`,
              opacity: sideOpacity,
            }}
          >
            <div className="flex-1 flex">
              <ServiceCard
                title={SERVICES[2].title}
                slug={SERVICES[2].slug}
                opacity={sideOpacity}
                scale={sideScale}
                borderRadius={borderRadius}
              />
            </div>
            <div className="flex-1 flex">
              <ServiceCard
                title={SERVICES[3].title}
                slug={SERVICES[3].slug}
                opacity={sideOpacity}
                scale={sideScale}
                borderRadius={borderRadius}
              />
            </div>
            <div className="flex-1 flex">
              <ServiceCard
                title={SERVICES[4].title}
                slug={SERVICES[4].slug}
                opacity={sideOpacity}
                scale={sideScale}
                borderRadius={borderRadius}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
