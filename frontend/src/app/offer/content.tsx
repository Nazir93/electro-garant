"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Phone, Send, Mail, Calculator, UserCircle } from "lucide-react";
import { MaxMessengerIcon } from "@/components/icons/max-messenger-icon";
import { FunnelLinkRow } from "@/components/ui/funnel-ui";
import { SITE_NAME } from "@/lib/constants";
import { useContactConfig } from "@/lib/contact-config-context";
import { useTheme } from "@/lib/theme-context";

const OFFER_HERO_VIDEO = "/videos/offer-hero.mp4";

export function OfferPageContent() {
  const contact = useContactConfig();
  const { isDark } = useTheme();
  /** Первый кадр загружен — плавно показываем видео вместо «пустого» чёрного кадра плеера */
  const [videoReady, setVideoReady] = useState(false);
  const [videoUi, setVideoUi] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setVideoUi(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
      className="relative flex h-full min-h-0 flex-col box-border overflow-x-hidden overflow-hidden overscroll-none transition-colors duration-500"
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

      {/* Видео + тёмная плёнка; один экран без прокрутки страницы */}
      <header className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-hidden bg-[var(--bg)] py-3 transition-colors duration-500 sm:py-5 md:py-7 lg:bg-transparent lg:py-0">
        <div className="absolute inset-0 z-0 overflow-hidden max-lg:hidden" aria-hidden>
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
          className="relative z-10 mx-auto box-border flex min-h-0 max-h-full w-full min-w-0 flex-col overflow-x-hidden overflow-y-hidden pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(3.25rem,calc(env(safe-area-inset-right)+2.75rem))] pt-[max(0.25rem,calc(env(safe-area-inset-top)+0.15rem))] pb-[max(0.5rem,env(safe-area-inset-bottom))] text-[var(--text)] sm:max-w-lg sm:pl-5 sm:pr-14 sm:pt-1 md:max-w-xl md:pl-6 md:pr-16 md:pb-2 lg:max-w-2xl lg:pt-0 xl:max-w-3xl"
        >
          <div
            className={`flex w-full shrink-0 flex-col overflow-hidden transition-colors duration-500 max-lg:rounded-none max-lg:border-0 max-lg:bg-transparent max-lg:shadow-none max-lg:backdrop-blur-none rounded-[1.125rem] backdrop-blur-md sm:rounded-2xl ${
              isDark
                ? "lg:rounded-2xl lg:border lg:border-[var(--border)] lg:bg-[rgba(0,0,0,0.88)]"
                : "lg:rounded-2xl lg:border lg:border-[var(--border)] lg:bg-[rgba(255,255,255,0.92)]"
            }`}
          >
          <div className="flex w-full min-w-0 flex-col gap-3 px-4 py-4 sm:gap-3.5 sm:px-5 sm:py-5 md:gap-4 md:px-6 md:py-6 lg:gap-3 lg:px-5 lg:py-4">
          <div className="shrink-0">
            <p
              className="mb-1 text-[10px] uppercase tracking-[0.2em] font-heading sm:mb-1.5 sm:text-xs sm:tracking-[0.22em] lg:mb-1"
              style={{ color: "var(--accent)" }}
            >
              {SITE_NAME}
            </p>
            <h1 className="font-heading text-lg font-bold leading-[1.12] tracking-tight text-[var(--text)] sm:text-xl sm:leading-[1.1] md:text-2xl">
              <span style={{ color: "var(--accent)" }}>Спасибо за интерес</span>
              <span className="mt-0.5 block text-[var(--text)]">к нашей компании</span>
            </h1>
          </div>

          <p className="shrink-0 text-xs leading-relaxed text-[var(--text-muted)] sm:text-[0.8125rem] sm:leading-relaxed md:text-sm">
            Мы знаем, что Ваше время стоит очень дорого, поэтому предлагаем связаться прямо сейчас. Звонок займёт всего лишь 3
            минуты, а сэкономит до 100% вашего времени на поиск подрядчика. Звоните любым удобным для Вас способом — и команда
            профессионалов {SITE_NAME} возьмётся за дело.
          </p>

          <section
            className="shrink-0 space-y-4 border-t border-[var(--border)] pt-4 sm:space-y-5 sm:pt-5 lg:space-y-3 lg:pt-3"
          >
            <div className="flex w-full flex-col gap-2 sm:gap-2.5">
              <PhoneLinkCompact phone={contact.phone} raw={contact.phoneRaw} isDark={isDark} />
              <PhoneLinkCompact phone={contact.phone2} raw={contact.phone2Raw} isDark={isDark} />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:gap-y-2 md:gap-x-10">
              <div className="flex min-h-[48px] items-center justify-center sm:min-h-0">
                <ContactChip
                  href={contact.social.max}
                  icon={<MaxMessengerIcon className="h-5 w-5 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem] md:h-5 md:w-5" />}
                  label="Max"
                />
              </div>
              <div className="flex min-h-[48px] items-center justify-center sm:min-h-0">
                <ContactChip
                  href={contact.social.telegram}
                  icon={<Send size={20} strokeWidth={2} className="h-5 w-5 sm:h-[1.125rem] sm:w-[1.125rem] md:h-5 md:w-5" />}
                  label="Telegram"
                />
              </div>
              <div className="flex min-h-[48px] items-center justify-center sm:min-h-0">
                <ContactChip
                  href={`mailto:${contact.email}`}
                  icon={<Mail size={20} strokeWidth={2} className="h-5 w-5 sm:h-[1.125rem] sm:w-[1.125rem] md:h-5 md:w-5" />}
                  label="Почта"
                />
              </div>
            </div>
          </section>

          <section className="flex shrink-0 flex-col gap-2.5 border-t border-[var(--border)] pt-4 sm:gap-3 sm:pt-5 lg:gap-2 lg:pt-3">
            <FunnelLinkRow href="/offer/form" onVideo={videoUi} compact icon={<UserCircle size={20} strokeWidth={2} />}>
              Заполнить форму обратной связи
            </FunnelLinkRow>
            <FunnelLinkRow href="/offer/calculate" onVideo={videoUi} compact icon={<Calculator size={20} strokeWidth={2} />}>
              <span className="flex flex-col gap-1 leading-snug">
                <span className="text-[0.8125rem] text-[var(--text)] sm:text-sm md:text-base">Рассчитать стоимость самостоятельно</span>
                <span className="text-[11px] font-normal normal-case leading-snug tracking-normal text-[var(--text-muted)] sm:text-xs">
                  Калькулятор, ориентировочный расчёт или скачать прайс
                </span>
              </span>
            </FunnelLinkRow>
          </section>
          </div>
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
      className={`group flex w-full min-w-0 touch-manipulation items-center justify-center rounded-xl px-3 py-2.5 transition-colors active:scale-[0.99] max-lg:min-h-[52px] max-lg:bg-[var(--bg-secondary)]/55 max-lg:active:bg-[var(--bg-secondary)] lg:min-h-0 lg:bg-transparent lg:px-2 lg:py-2 ${
        isDark
          ? "lg:hover:bg-white/[0.06] lg:active:bg-white/[0.1]"
          : "lg:hover:bg-black/[0.05] lg:active:bg-black/[0.08]"
      }`}
    >
      <span className="inline-flex max-w-full items-center gap-2.5 sm:gap-3 md:gap-3.5">
        <Phone
          size={24}
          strokeWidth={2}
          className="shrink-0 text-[#e8c96a] transition-transform group-hover:scale-105 group-active:scale-105 sm:h-6 sm:w-6 md:h-7 md:w-7"
          aria-hidden
        />
        <span className="font-heading text-[1.0625rem] font-semibold leading-none tracking-wide text-[var(--text)] tabular-nums sm:text-lg md:text-xl">
          {phone}
        </span>
      </span>
    </a>
  );
}

function ContactChip({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const [hovered, setHovered] = useState(false);
  const isMailto = href.startsWith("mailto:");

  return (
    <a
      href={href}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
      className="touch-manipulation border-b border-transparent pb-0.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors active:opacity-80 sm:text-[13px] sm:tracking-[0.16em]"
      style={{
        color: hovered ? "var(--accent)" : "var(--text-muted)",
        borderColor: hovered ? "var(--accent)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="inline-flex items-center gap-2">
        <span className="shrink-0 text-[#e8c96a] [&_svg]:text-current">{icon}</span>
        {label}
      </span>
    </a>
  );
}
