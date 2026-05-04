"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, CheckCircle2, Percent } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { OFFER_FIVE_MIN_DISCOUNT_LINE } from "@/lib/offer-promo";
import { FunnelFillButton, FunnelInputField } from "@/components/ui/funnel-ui";
import { BackNavLink } from "@/components/ui/back-nav";
import { OfferTimerVisual } from "@/components/ui/offer-timer-visual";

const contactFormSchema = z.object({
  phone: z
    .string()
    .min(10, "Введите корректный номер")
    .max(30)
    .regex(/^[\d\s+\-()]+$/, "Некорректный формат"),
  name: z.string().min(2, "Введите имя").max(100),
  honeypot: z.string().max(0).optional(),
});
type ContactForm = z.infer<typeof contactFormSchema>;

export function OfferFormPageContent() {
  const [stage, setStage] = useState<"form" | "timer" | "done">("form");
  const [timerSec, setTimerSec] = useState(300);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setTimerSec(300);
    setStage("timer");
    timerRef.current = setInterval(() => {
      setTimerSec((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStage("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  useEffect(() => {
    const titles: Record<typeof stage, string> = {
      form: `Форма обратной связи — ${SITE_NAME}`,
      timer: `Заявка принята — ${SITE_NAME}`,
      done: `Скидка 15% — ${SITE_NAME}`,
    };
    document.title = titles[stage];
  }, [stage]);

  return (
    <div
      className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden box-border pl-4 pr-[3.25rem] pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pl-6 md:pr-16"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="fixed top-0 left-0 z-[96] flex justify-start p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pl-[max(0.5rem,env(safe-area-inset-left))] sm:p-3 pointer-events-none">
        <span className="pointer-events-auto">
          <BackNavLink href="/offer">Назад</BackNavLink>
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,168,76,0.12), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 min-h-0 flex-col justify-center">
        {stage === "form" && <FormSection onSubmitted={startTimer} />}
        {stage === "timer" && <TimerSection seconds={timerSec} />}
        {stage === "done" && <DoneSection />}
      </div>
    </div>
  );
}

function TrustLine() {
  return (
    <p
      className="mb-6 text-center text-[10px] uppercase tracking-[0.2em] leading-relaxed sm:text-left"
      style={{ color: "var(--text-subtle)" }}
    >
      Защита данных · без спама · не передаём третьим лицам
    </p>
  );
}

function FormSection({ onSubmitted }: { onSubmitted: () => void }) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (data: ContactForm) => {
    setFormError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          service: "Оффер: обратная связь",
          source: "offer-page",
          honeypot: data.honeypot,
        }),
      });
      const json = (await res.json()) as { leadId?: string; error?: string };
      if (!res.ok) {
        setFormError(json.error || "Не удалось отправить заявку");
        return;
      }
      onSubmitted();
    } catch {
      setFormError("Ошибка сети. Проверьте подключение.");
    }
  };

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-col justify-center py-1">
      <TrustLine />

      <h2 className="font-heading text-xl sm:text-2xl md:text-3xl leading-[1.08] mb-3 text-center sm:text-left">
        ФОРМА ОБРАТНОЙ СВЯЗИ
      </h2>
      <p className="text-sm mb-8 text-center sm:text-left" style={{ color: "var(--text-muted)" }}>
        Оставьте телефон и имя — перезвоним за 5 минут. {OFFER_FIVE_MIN_DISCOUNT_LINE}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <input type="text" className="sr-only" tabIndex={-1} autoComplete="off" {...register("honeypot")} />

        <FunnelInputField label="Телефон" error={errors.phone?.message}>
          <input
            placeholder="+7 (999) 000-00-00"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className="funnel-text-input w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none"
            style={{
              borderColor: errors.phone ? "#ef4444" : "var(--border)",
              color: "var(--text)",
            }}
            {...register("phone")}
          />
        </FunnelInputField>

        <FunnelInputField label="Имя" error={errors.name?.message}>
          <input
            placeholder="Как к вам обращаться"
            autoComplete="name"
            className="funnel-text-input w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none"
            style={{
              borderColor: errors.name ? "#ef4444" : "var(--border)",
              color: "var(--text)",
            }}
            {...register("name")}
          />
        </FunnelInputField>

        {formError && (
          <p className="text-sm text-center" style={{ color: "#f87171" }}>
            {formError}
          </p>
        )}
        <FunnelFillButton type="submit" disabled={isSubmitting} icon={<Clock size={20} strokeWidth={2} />}>
          {isSubmitting ? "Отправка..." : "Связаться за 5 минут"}
        </FunnelFillButton>
      </form>
    </div>
  );
}

function TimerSection({ seconds }: { seconds: number }) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <div className="flex min-h-0 w-full flex-col items-stretch justify-center gap-4 py-2 md:flex-row md:items-center md:gap-6">
      <div className="flex shrink-0 justify-center md:w-[140px]">
        <OfferTimerVisual size="md" />
      </div>

      <div className="min-w-0 flex-1 text-center md:text-left">
        <div className="mb-3 flex items-center justify-center gap-2 md:justify-start">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
          >
            <CheckCircle2 size={24} strokeWidth={2} style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="font-heading text-lg sm:text-xl md:text-2xl" style={{ color: "var(--text)" }}>
            Заявка принята!
          </h2>
        </div>

        <p className="mb-4 text-xs leading-snug sm:text-sm" style={{ color: "var(--text-muted)" }}>
          Наш специалист свяжется с вами в течение 5 минут.
        </p>

        <div
          className="mb-4 inline-flex w-full flex-col items-center rounded-2xl border px-6 py-4 sm:inline-flex sm:max-w-none md:items-start"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
            Осталось
          </p>
          <div
            className="font-heading text-4xl tabular-nums tracking-wider sm:text-5xl"
            style={{ color: "var(--accent)" }}
          >
            {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            <Clock size={16} strokeWidth={2} style={{ color: "var(--accent)" }} />
            Ожидание
          </span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            <Percent size={16} strokeWidth={2} style={{ color: "var(--accent)" }} />
            Скидка 15%
          </span>
        </div>

        <p className="mt-3 text-[11px] leading-snug sm:text-xs" style={{ color: "var(--text-muted)" }}>
          {OFFER_FIVE_MIN_DISCOUNT_LINE}
        </p>
      </div>
    </div>
  );
}

function DoneSection() {
  return (
    <div className="flex min-h-0 w-full flex-col items-center justify-center gap-6 py-4 text-center md:text-left md:items-start">
      <OfferTimerVisual size="lg" />
      <div>
        <h2 className="font-heading text-xl sm:text-2xl mb-2" style={{ color: "var(--accent)" }}>
          Время ожидания истекло
        </h2>
        <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text)" }}>
          {OFFER_FIVE_MIN_DISCOUNT_LINE}
        </p>
        <p className="text-xs leading-snug" style={{ color: "var(--text-muted)" }}>
          Менеджер свяжется с вами в ближайшее время и подтвердит условия.
        </p>
      </div>
      <BackNavLink href="/offer">← Назад к офферу</BackNavLink>
    </div>
  );
}
