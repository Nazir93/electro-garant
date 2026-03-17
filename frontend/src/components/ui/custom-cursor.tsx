"use client";

import { useEffect, useRef, useState } from "react";

const HOVER_SELECTOR = "a, button, [role='button'], input, textarea, select, [data-cursor-hover]";

function isHoverTarget(el: Element | null): boolean {
  if (!el) return false;
  return el.closest(HOVER_SELECTOR) !== null;
}

export function CustomCursor() {
  const blobRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: -100, y: -100 });
  const hoveringRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      prevMouse.current = { ...target.current };
      target.current = { x: e.clientX, y: e.clientY };

      velocity.current = {
        x: target.current.x - prevMouse.current.x,
        y: target.current.y - prevMouse.current.y,
      };

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
      pos.current.x += (target.current.x - pos.current.x) * 0.35;
      pos.current.y += (target.current.y - pos.current.y) * 0.35;

      const vx = velocity.current.x;
      const vy = velocity.current.y;
      const speed = Math.sqrt(vx * vx + vy * vy);

      const stretch = Math.min(speed / 30, 0.7);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      const sx = 1 + stretch;
      const sy = 1 - stretch * 0.4;

      velocity.current.x *= 0.88;
      velocity.current.y *= 0.88;

      if (blobRef.current) {
        blobRef.current.style.transform =
          `translate(-50%, -50%) rotate(${angle}deg) scale(${sx}, ${sy})`;
        blobRef.current.style.left = `${pos.current.x}px`;
        blobRef.current.style.top = `${pos.current.y}px`;
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

  const size = hovering ? 64 : 36;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

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
          mixBlendMode: "difference",
          transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), height 0.4s cubic-bezier(0.22,1,0.36,1), background 0.3s",
        }}
      />
    </>
  );
}
