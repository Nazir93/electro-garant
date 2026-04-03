import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center gap-6 px-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(201, 168, 76, 0.08) 0%, transparent 55%), var(--bg)",
        color: "var(--text-muted)",
      }}
      role="status"
      aria-live="polite"
      aria-label="Загрузка страницы"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="loader-lightning-vibrate text-[var(--accent)]" aria-hidden>
          <Zap
            className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem]"
            strokeWidth={1.35}
            fill="currentColor"
            fillOpacity={0.12}
          />
        </div>
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-heading text-[var(--text-subtle)]">
          Загрузка
        </p>
      </div>
    </div>
  );
}
