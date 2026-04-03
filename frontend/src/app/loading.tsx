import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center gap-6 px-6 supports-[height:100dvh]:min-h-[100dvh]"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-muted)",
      }}
      role="status"
      aria-live="polite"
      aria-label="Загрузка страницы"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center text-[var(--accent)]" aria-hidden>
          <span className="loader-lightning-glow" />
          <div className="loader-lightning-vibrate relative z-[1]">
            <Zap
              className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem]"
              strokeWidth={1.35}
              fill="currentColor"
              fillOpacity={0.12}
            />
          </div>
        </div>
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-heading text-[var(--text-subtle)]">
          Загрузка
        </p>
      </div>
    </div>
  );
}
