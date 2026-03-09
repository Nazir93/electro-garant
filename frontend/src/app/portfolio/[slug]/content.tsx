"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PortfolioCase, PORTFOLIO_CASES } from "@/lib/portfolio-data";

function useScrollVisible(threshold = 0.15) {
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
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function ParallaxShowcase({ label, dark = true }: { label: string; dark?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = (windowH - rect.top) / (windowH + rect.height);
      setOffset(progress * 60 - 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        backgroundColor: dark ? "#0a0a0a" : "var(--bg-secondary)",
        height: "60vh",
        minHeight: "350px",
        maxHeight: "600px",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translateY(${offset}px) scale(1.1)` }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: dark ? "rgba(255,255,255,0.3)" : "var(--text-subtle)" }}
        >
          {label}
        </span>
      </div>
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{
          background: dark
            ? "linear-gradient(to bottom, #0a0a0a, transparent)"
            : "linear-gradient(to bottom, var(--bg-secondary), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{
          background: dark
            ? "linear-gradient(to top, #0a0a0a, transparent)"
            : "linear-gradient(to top, var(--bg-secondary), transparent)",
        }}
      />
    </section>
  );
}

function TextBlock({ leftText, rightText, accent }: { leftText: string; rightText: string; accent?: boolean }) {
  const { ref, visible } = useScrollVisible(0.2);

  return (
    <section
      ref={ref}
      className="py-20 md:py-28"
      style={{
        backgroundColor: accent ? "var(--bg-secondary)" : "var(--bg)",
        borderTop: accent ? "1px solid var(--border)" : undefined,
        borderBottom: accent ? "1px solid var(--border)" : undefined,
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
            }}
          >
            <p className="text-sm md:text-base leading-[1.8]" style={{ color: "var(--text-muted)" }}>
              {leftText}
            </p>
          </div>
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transitionDelay: "100ms",
            }}
          >
            <p className="text-sm md:text-base leading-[1.8]" style={{ color: "var(--text-muted)" }}>
              {rightText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NavLink({ href, label, direction }: { href: string; label: string; direction: "prev" | "next" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-1 flex items-center gap-4 px-6 py-6 md:py-8 rounded-2xl relative overflow-hidden transition-all duration-500"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          backgroundColor: "var(--text)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      {direction === "prev" && (
        <ArrowLeft
          size={20}
          className="relative z-10 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        />
      )}
      <div className="relative z-10 flex-1">
        <span
          className="text-[10px] uppercase tracking-[0.15em] block mb-1 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text-muted)" }}
        >
          {direction === "prev" ? "Предыдущий проект" : "Следующий проект"}
        </span>
        <span
          className="font-heading text-lg md:text-xl transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        >
          {label}
        </span>
      </div>
      {direction === "next" && (
        <ArrowRight
          size={20}
          className="relative z-10 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        />
      )}
    </Link>
  );
}

export function CaseContent({ project }: { project: PortfolioCase }) {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  const currentIndex = PORTFOLIO_CASES.findIndex((c) => c.id === project.id);
  const prevCase = currentIndex > 0 ? PORTFOLIO_CASES[currentIndex - 1] : null;
  const nextCase = currentIndex < PORTFOLIO_CASES.length - 1 ? PORTFOLIO_CASES[currentIndex + 1] : null;

  return (
    <article>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20" style={{ backgroundColor: "var(--bg)" }}>
        <div className="container mx-auto">
          {/* Back link */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] mb-10 transition-colors duration-200 hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={14} />
              Все проекты
            </Link>
          </div>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <h1
              className="font-heading text-[14vw] sm:text-[10vw] md:text-[7vw] lg:text-[5.5vw] leading-[0.9] tracking-tight transition-all duration-1000 ease-out"
              style={{
                color: "var(--text)",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(40px)",
                transitionDelay: "100ms",
              }}
            >
              {project.title}
            </h1>
            <span
              className="font-heading text-lg md:text-xl transition-all duration-1000 ease-out italic"
              style={{
                color: "var(--text-muted)",
                opacity: heroVisible ? 1 : 0,
                transitionDelay: "200ms",
              }}
            >
              ({project.tag})
            </span>
          </div>

          {/* Divider */}
          <div className="h-px mb-10" style={{ backgroundColor: "var(--border)" }} />

          {/* Meta row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 transition-all duration-1000 ease-out"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "250ms",
            }}
          >
            {[
              { label: "Отрасль", value: project.industry },
              { label: "Услуга", value: project.type },
              { label: "Площадь", value: project.area },
              { label: "Год", value: project.year },
            ].map((item) => (
              <div key={item.label}>
                <span
                  className="text-[10px] uppercase tracking-[0.15em] block mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.label}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Two columns: description + features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div
              className="transition-all duration-1000 ease-out"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "300ms",
              }}
            >
              <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {project.heroDescription}
              </p>
            </div>
            <div
              className="transition-all duration-1000 ease-out"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "400ms",
              }}
            >
              <ul className="space-y-3 mb-8">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
                <p
                  className="text-[10px] uppercase tracking-[0.15em] font-bold mb-2"
                  style={{ color: "var(--text)" }}
                >
                  Ключевые задачи:
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {project.goals}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase 1 */}
      <ParallaxShowcase label={project.showcaseLabel1} />

      {/* Text block 1 */}
      <TextBlock leftText={project.leftText1} rightText={project.rightText1} />

      {/* Showcase 2 */}
      <ParallaxShowcase label={project.showcaseLabel2} dark={false} />

      {/* Text block 2 (accent) */}
      <TextBlock leftText={project.leftText2} rightText={project.rightText2} accent />

      {/* Navigation between cases */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {prevCase && (
              <NavLink href={`/portfolio/${prevCase.slug}`} label={prevCase.title} direction="prev" />
            )}
            {nextCase && (
              <NavLink href={`/portfolio/${nextCase.slug}`} label={nextCase.title} direction="next" />
            )}
          </div>
        </div>
      </section>
    </article>
  );
}
