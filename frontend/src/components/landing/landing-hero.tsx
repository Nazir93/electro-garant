"use client";

import { useRef, useEffect, useState } from "react";

interface LandingHeroProps {
  title: string;
  subtitle: string;
  service: string;
  tag: string;
  features: string[];
  goals: string;
}

export function LandingHero({ title, subtitle, tag, features, goals }: LandingHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section ref={ref} className="pt-20 pb-10 sm:pt-28 sm:pb-14 md:pt-40 md:pb-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto">
        {/* Tag */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span
            className="inline-block text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-8"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            {tag}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-heading text-[clamp(24px,8vw,80px)] leading-[0.92] tracking-tight mb-6 sm:mb-10 md:mb-12 max-w-4xl transition-all duration-1000 ease-out"
          style={{
            color: "var(--text)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "100ms",
          }}
        >
          {title}
        </h1>

        {/* Two columns: subtitle + features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-20">
          {/* Left: main description */}
          <div
            className="transition-all duration-1000 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transitionDelay: "200ms",
            }}
          >
            <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          </div>

          {/* Right: features + goals */}
          <div
            className="transition-all duration-1000 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transitionDelay: "300ms",
            }}
          >
            <ul className="space-y-2 mb-8">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                  {f}
                </li>
              ))}
            </ul>
            <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold mb-2" style={{ color: "var(--text)" }}>
                Ключевые задачи:
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {goals}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
