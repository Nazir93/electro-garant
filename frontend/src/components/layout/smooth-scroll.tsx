"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { isLowPerfDevice } from "@/lib/use-perf";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (isLowPerfDevice()) return;

    const coarsePointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      /** Тач-скролл через Lenis — иначе scroll-события и rAF-синхронизация секций (about, hero) на мобилке «теряются» */
      syncTouch: coarsePointer,
      syncTouchLerp: coarsePointer ? 0.12 : undefined,
    });

    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleAnchor = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href?.startsWith("#")) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
      document.removeEventListener("click", handleAnchor);
    };
  }, []);

  return null;
}
