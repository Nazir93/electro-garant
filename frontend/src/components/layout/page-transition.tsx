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

    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = "1";
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
