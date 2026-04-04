"use client";

import { Calculator, Download, Sparkles } from "lucide-react";
import { FunnelLinkRow, FunnelPanelButton } from "@/components/ui/funnel-ui";
import { BackNavLink } from "@/components/ui/back-nav";
import { SITE_NAME } from "@/lib/constants";
import { useModal } from "@/lib/modal-context";

export function OfferCalculateContent() {
  const { openModalToEstimate } = useModal();

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-x-hidden overflow-hidden box-border pl-4 pr-[3.25rem] pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pl-6 md:pr-16"
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

      <main className="relative z-10 mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col justify-center overflow-y-auto px-1 py-6 sm:px-2 sm:py-8">
        <p
          className="mb-1 text-center text-[10px] uppercase tracking-[0.22em] font-heading sm:text-xs"
          style={{ color: "var(--accent)" }}
        >
          {SITE_NAME}
        </p>
        <h1 className="font-heading text-center text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl">
          Рассчитать стоимость самостоятельно
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm leading-snug" style={{ color: "var(--text-muted)" }}>
          Калькулятор сметы на сайте, быстрый ориентировочный расчёт или скачайте актуальный прайс — выберите удобный
          вариант.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:gap-4">
          <FunnelLinkRow href="/price#price-calculator" compact icon={<Calculator size={20} strokeWidth={2} />}>
            Калькулятор сметы
          </FunnelLinkRow>
          <FunnelPanelButton onClick={() => openModalToEstimate()} compact icon={<Sparkles size={20} strokeWidth={2} />}>
            Ориентировочный расчёт
          </FunnelPanelButton>
          <FunnelLinkRow href="/price-list.pdf" download compact icon={<Download size={20} strokeWidth={2} />}>
            Скачать прайс
          </FunnelLinkRow>
        </div>
      </main>
    </div>
  );
}
