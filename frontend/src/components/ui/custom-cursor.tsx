"use client";

import { useEffect, useRef, useState } from "react";
import { isLowPerfDevice } from "@/lib/use-perf";

const HOVER_SELECTOR = "a, button, [role='button'], input, textarea, select, [data-cursor-hover]";

function isHoverTarget(el: Element | null): boolean {
  if (!el) return false;
  return el.closest(HOVER_SELECTOR) !== null;
}

export function CustomCursor() {
  const blobRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const hoveringRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (isLowPerfDevice()) return;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };

      const isHover = isHoverTarget(e.target as Element);
      if (isHover !== hoveringRef.current) {
        hoveringRef.current = isHover;
        setHovering(isHover);
      }
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    let animationId: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.25;
      pos.current.y += (target.current.y - pos.current.y) * 0.25;

      if (blobRef.current) {
        blobRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!visible) return null;

  const size = hovering ? 56 : 32;

  return (
    <>
      <style>{`@media (hover: hover) and (pointer: fine) { * { cursor: none !important; } }`}</style>

      <div
        ref={blobRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          background: hovering
            ? "radial-gradient(circle, var(--accent) 0%, rgba(201,168,76,0.3) 60%, transparent 100%)"
            : "radial-gradient(circle, var(--text) 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
          opacity: 1,
          transition: "width 0.3s ease, height 0.3s ease, background 0.3s",
          willChange: "transform",
        }}
      />
    </>
  );
}
