"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/constants";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}

export function FixedStatsBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      const footer = document.querySelector("footer");
      if (!aboutSection) return;

      const aboutRect = aboutSection.getBoundingClientRect();
      const reachedAbout = aboutRect.top <= window.innerHeight * 0.5;

      let reachedFooter = false;
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        reachedFooter = footerRect.top <= window.innerHeight;
      }

      setShow(reachedAbout && !reachedFooter);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-[40] border-t transition-all duration-500 lg:right-[60px]"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(100%)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 py-2 sm:py-2.5 md:py-3 gap-y-2 sm:gap-y-2.5">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-2 sm:px-3 md:px-4">
              <div className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl mb-0.5">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p
                className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.15em]"
                style={{ color: "var(--text-muted)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
