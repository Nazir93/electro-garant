"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { EditorialSlide } from "@/components/editorial/editorial-banner";

type MediaLightboxProps = {
  slides: EditorialSlide[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  alt: string;
};

export function ImageLightbox({
  slides,
  index,
  open,
  onClose,
  onIndexChange,
  alt,
}: MediaLightboxProps) {
  const n = slides.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (n <= 1) return;
      onIndexChange((index + dir + n) % n);
    },
    [index, n, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, go]);

  if (!open || n === 0 || typeof document === "undefined") return null;

  const slide = slides[index];
  if (!slide) return null;

  const kindLabel = slide.type === "video" ? "видео" : "фото";

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр медиа"
    >
      <button type="button" className="absolute inset-0 cursor-zoom-out" aria-label="Закрыть" onClick={onClose} />

      <button
        type="button"
        className="absolute top-4 right-4 z-[210] p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Закрыть"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={24} />
      </button>

      {n > 1 && (
        <>
          <button
            type="button"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[210] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Предыдущее"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[210] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Следующее"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div
        className="relative z-[205] w-full max-w-[min(96vw,1400px)] h-[min(85vh,90vw)] pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        {slide.type === "image" ? (
          <Image
            src={slide.url}
            alt={`${alt} — ${kindLabel} ${index + 1}`}
            fill
            className="object-contain pointer-events-auto"
            sizes="100vw"
            priority
            unoptimized={slide.url.startsWith("/uploads/")}
          />
        ) : (
          <video
            key={`${slide.url}-${index}`}
            src={slide.url}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain pointer-events-auto bg-black"
            aria-label={`${alt} — ${kindLabel} ${index + 1}`}
          />
        )}
      </div>

      {n > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[210] text-xs tabular-nums text-white/70">
          {index + 1} / {n}
        </div>
      )}
    </div>,
    document.body
  );
}
