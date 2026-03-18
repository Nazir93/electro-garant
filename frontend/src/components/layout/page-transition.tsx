"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";

    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div ref={containerRef} style={{ willChange: "opacity, transform" }}>
      {children}
    </div>
  );
}
