"use client";

import { useState, useRef, useLayoutEffect } from "react";
import {
  Phone,
  Send,
  Mail,
  Calculator,
  Download,
  UserCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { MaxMessengerIcon } from "@/components/icons/max-messenger-icon";
import { FunnelLinkRow, FunnelPanelButton } from "@/components/ui/funnel-ui";
import { SITE_NAME } from "@/lib/constants";
import { useContactConfig } from "@/lib/contact-config-context";
import { useModal } from "@/lib/modal-context";
import { useTheme } from "@/lib/theme-context";

const OFFER_HERO_VIDEO = "/videos/offer-hero.mp4";

export function OfferPageContent() {
  const contact = useContactConfig();
  const { isDark } = useTheme();
  const { openModalToEstimate } = useModal();
  const [costSectionsOpen, setCostSectionsOpen] = useState(false);
  /** Первый кадр загружен — плавно показываем видео вместо «пустого» чёрного кадра плеера */
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.readyState >= 2) setVideoReady(true);
    el.play().catch(() => {
      /* автозапуск может быть заблокирован до взаимодействия */
    });
  }, []);

  return (
    <div
      className="relative flex h-[100dvh] max-h-[100dvh] flex-col box-border overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        style={{
          background:
            "linear-gradient(165deg, var(--bg-secondary) 0%, transparent 50%, var(--bg) 100%)",
        }}
        aria-hidden
      />

      {/* Видео + тёмная плёнка; контент в одном экране (при нехватке места — прокрутка только внутри блока) */}
      <header className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          {/* Фон до первого кадра видео — тот же характер, что и с плёнкой, без «пустого» чёрного */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: isDark
                ? "linear-gradient(180deg, #1a1612 0%, #12100e 38%, #0e0c0a 72%, #0a0908 100%), radial-gradient(ellipse 95% 65% at 50% 12%, rgba(201,168,76,0.14), transparent 55%)"
                : "linear-gradient(180deg, #f5f2ed 0%, #ebe8e3 38%, var(--bg) 72%, var(--bg-secondary) 100%), radial-gradient(ellipse 95% 65% at 50% 12%, rgba(201,168,76,0.12), transparent 55%)",
            }}
          />
          <video
            ref={videoRef}
            className={`absolute inset-0 z-[1] h-full min-h-full w-full min-w-full object-cover transition-opacity duration-500 ease-out motion-reduce:duration-0 ${
              !videoReady ? "opacity-0" : isDark ? "opacity-100" : "opacity-40"
            }`}
            src={OFFER_HERO_VIDEO}
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
            aria-hidden
          />
          {/* Плёнка: тёмная — под белый текст; светлая — под тёмный текст */}
          <div className={isDark ? "absolute inset-0 bg-black/80" : "absolute inset-0 bg-white/75"} />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.78) 40%, rgba(0,0,0,0.92) 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.65) 40%, rgba(245,243,240,0.92) 100%)",
            }}
          />
          <div
            className={isDark ? "absolute inset-0 opacity-[0.06]" : "absolute inset-0 opacity-[0.09]"}
            style={{
              background: "radial-gradient(ellipse 90% 60% at 50% 18%, rgba(201,168,76,0.4), transparent 58%)",
            }}
          />
        </div>

        <div
          className={`relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden overflow-x-hidden px-4 pt-[max(1.25rem,calc(env(safe-area-inset-top)+0.75rem))] pr-[3.25rem] pb-[max(0.35rem,env(safe-area-inset-bottom))] md:px-6 md:pt-[max(0.75rem,env(safe-area-inset-top))] md:pr-16 md:pb-[max(0.5rem,env(safe-area-inset-bottom))] ${isDark ? "text-white" : "text-[var(--text)]"}`}
        >
          <div
            className={`flex min-h-0 w-full flex-1 flex-col gap-2 rounded-2xl px-3 py-3 backdrop-blur-md transition-colors duration-500 md:gap-3 md:px-5 md:py-4 ${
              isDark
                ? "bg-[rgba(0,0,0,0.85)] shadow-[0_10px_28px_-4px_rgba(0,0,0,0.55)]"
                : "border border-[var(--border)] bg-[rgba(255,255,255,0.88)] shadow-[0_10px_28px_-4px_rgba(0,0,0,0.1)]"
            }`}
          >
          <div className="shrink-0">
            <p
              className="mb-0.5 text-[10px] uppercase tracking-[0.22em] font-heading sm:text-xs"
              style={{ color: "var(--accent)" }}
            >
              {SITE_NAME}
            </p>
            <h1
              className={`font-heading text-lg font-bold leading-[1.08] tracking-tight sm:text-xl md:text-2xl lg:text-3xl ${
                isDark ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" : "text-[var(--text)]"
              }`}
            >
              <span style={{ color: "var(--accent)" }}>Спасибо за интерес</span>
              <span className={`block ${isDark ? "text-white" : "text-[var(--text)]"}`}>к нашей компании</span>
            </h1>
          </div>

          <p
            className={`shrink-0 text-[11px] leading-snug sm:text-xs md:text-sm md:leading-relaxed ${
              isDark ? "text-white/95" : "text-[var(--text-muted)]"
            }`}
          >
            Мы знаем, что Ваше время стоит очень дорого, поэтому предлагаем связаться прямо сейчас. Звонок займёт всего
            лишь 3 минуты, а сэкономит до 100% вашего времени на поиск подрядчика. Звоните любым удобным для Вас способом
            — и команда профессионалов {SITE_NAME} возьмётся за дело.
          </p>

        <section
          className={`shrink-0 border-t pt-2 ${isDark ? "border-white/20" : "border-[var(--border)]"}`}
        >
          <p
            className={`mb-2 text-center text-[10px] uppercase tracking-[0.2em] sm:mb-2.5 ${
              isDark ? "text-white/70" : "text-[var(--text-subtle)]"
            }`}
          >
            Позвонить
          </p>
          <div className="mb-3 grid w-full grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:gap-3">
            <PhoneLinkCompact phone={contact.phone} raw={contact.phoneRaw} isDark={isDark} />
            <PhoneLinkCompact phone={contact.phone2} raw={contact.phone2Raw} isDark={isDark} />
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 pt-1">
            <ContactChip
              href={contact.social.max}
              icon={<MaxMessengerIcon className="h-4 w-4 shrink-0" />}
              label="Max"
              large
            />
            <ContactChip
              href={contact.social.telegram}
              icon={<Send size={16} strokeWidth={2} />}
              label="Telegram"
              large
            />
            <ContactChip
              href={`mailto:${contact.email}`}
              icon={<Mail size={16} strokeWidth={2} />}
              label="Почта"
              large
            />
          </div>
        </section>

        <section className="mt-auto flex shrink-0 flex-col gap-2 pb-0.5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            <FunnelLinkRow href="/offer/form" onVideo compact icon={<UserCircle size={18} strokeWidth={2} />}>
              Форма заявки
            </FunnelLinkRow>
            <FunnelPanelButton
              ariaExpanded={costSectionsOpen}
              onClick={() => setCostSectionsOpen((o) => !o)}
              onVideo
              compact
              icon={<Calculator size={18} strokeWidth={2} />}
              trailing={
                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  className={`shrink-0 transition-transform duration-200 ${costSectionsOpen ? "rotate-180" : ""}`}
                />
              }
            >
              <span className="flex flex-col gap-0.5 leading-tight">
                <span>Рассчитать стоимость</span>
                <span className="text-[10px] font-normal normal-case tracking-normal text-[var(--text-muted)] sm:text-[11px]">
                  Калькулятор, ориентировочный расчёт или скачать прайс
                </span>
              </span>
            </FunnelPanelButton>
          </div>

          {costSectionsOpen && (
            <div
              className={`grid grid-cols-1 gap-2 border-t pt-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)_minmax(0,0.8fr)] sm:gap-2 ${
                isDark ? "border-white/20" : "border-[var(--border)]"
              }`}
            >
              <FunnelLinkRow
                href="/price#price-calculator"
                onVideo
                compact
                icon={<Calculator size={18} strokeWidth={2} />}
              >
                Калькулятор сметы
              </FunnelLinkRow>
              <FunnelPanelButton onClick={() => openModalToEstimate()} onVideo compact icon={<Sparkles size={18} strokeWidth={2} />}>
                <span className="inline-block whitespace-nowrap">Ориентировочный</span>{" "}
                <span className="inline-block whitespace-nowrap">расчёт</span>
              </FunnelPanelButton>
              <FunnelLinkRow
                href="/price-list.pdf"
                download
                onVideo
                compact
                narrow
                icon={<Download size={16} strokeWidth={2} />}
              >
                Скачать прайс
              </FunnelLinkRow>
            </div>
          )}
        </section>
          </div>
        </div>
      </header>
    </div>
  );
}

function PhoneLinkCompact({ phone, raw, isDark }: { phone: string; raw: string; isDark: boolean }) {
  return (
    <a
      href={`tel:${raw}`}
      className={`group flex min-h-[3.25rem] w-full min-w-0 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-colors min-[400px]:min-h-[2.75rem] sm:flex-row sm:gap-2.5 sm:px-3 sm:py-3 md:min-h-0 ${
        isDark
          ? "border-white/15 bg-white/[0.05] hover:border-white/30 hover:bg-white/[0.09]"
          : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]"
      }`}
    >
      <Phone
        size={16}
        strokeWidth={2}
        className="shrink-0 text-[#e8c96a] transition-transform group-hover:scale-105"
      />
      <span
        className={`w-full min-w-0 text-balance font-heading text-[10px] leading-tight tracking-wide tabular-nums sm:text-[11px] md:text-xs ${
          isDark ? "text-white" : "text-[var(--text)]"
        }`}
      >
        {phone}
      </span>
    </a>
  );
}

function ContactChip({
  href,
  icon,
  label,
  large,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  /** Один размер подписи в тёмной и светлой теме */
  large?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-medium uppercase tracking-[0.14em] transition-colors border-b border-transparent ${
        large
          ? "text-xs pb-1 sm:text-[13px] md:tracking-[0.16em]"
          : "text-[10px] pb-0.5 md:text-[11px] tracking-[0.15em]"
      }`}
      style={{
        color: hovered ? "var(--accent)" : "var(--text-muted)",
        borderColor: hovered ? "var(--accent)" : "transparent",
        backgroundColor: hovered ? "rgba(201,168,76,0.08)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={`inline-flex items-center ${large ? "gap-2" : "gap-1.5"}`}>
        {icon}
        {label}
      </span>
    </a>
  );
}
