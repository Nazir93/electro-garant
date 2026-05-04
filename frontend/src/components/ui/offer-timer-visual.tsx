"use client";

import { Percent } from "lucide-react";

/** Визуал таймера оффера (вместо пиццы) — акцент на скидку. */
export function OfferTimerVisual({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const box =
    size === "sm"
      ? "h-[5.5rem] w-[5.5rem] sm:h-28 sm:w-28"
      : size === "lg"
        ? "h-44 w-44 sm:h-52 sm:w-52"
        : "h-36 w-36 sm:h-40 sm:w-40";
  const icon = size === "lg" ? 96 : size === "sm" ? 56 : 80;

  return (
    <div
      className={`relative z-20 flex shrink-0 items-center justify-center overflow-hidden rounded-full ${box}`}
      style={{
        backgroundColor: "var(--bg)",
        boxShadow: "0 0 0 2px rgba(201,168,76,0.45)",
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center animate-[spin_22s_linear_infinite]"
        style={{ color: "var(--accent)", filter: "drop-shadow(0 0 18px rgba(201,168,76,0.85))" }}
      >
        <Percent size={icon} strokeWidth={1.75} className="select-none" />
      </div>
    </div>
  );
}
