"use client";

import { useRef, useEffect, useState } from "react";

interface LandingShowcaseProps {
  label?: string;
  dark?: boolean;
}

export function LandingShowcase({ label = "Фото / Видео объекта", dark = true }: LandingShowcaseProps) {
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
        height: "clamp(220px, 50vh, 700px)",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
        style={{
          transform: `translateY(${offset}px) scale(1.1)`,
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: dark ? "rgba(255,255,255,0.3)" : "var(--text-subtle)" }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Gradient fades */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{
          background: dark
            ? "linear-gradient(to bottom, #0a0a0a, transparent)"
            : "linear-gradient(to bottom, var(--bg-secondary), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background: dark
            ? "linear-gradient(to top, #0a0a0a, transparent)"
            : "linear-gradient(to top, var(--bg-secondary), transparent)",
        }}
      />
    </section>
  );
}
