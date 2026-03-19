"use client";

import { useState } from "react";
import { Section, SectionTitle } from "@/components/ui/section";
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle,
  Building2, CreditCard, ChevronDown,
} from "lucide-react";
import { PHONE, PHONE_RAW, PHONE2, PHONE2_RAW, EMAIL, ADDRESS, WORKING_HOURS, SOCIAL_LINKS, COMPANY } from "@/lib/constants";

function RequisitesBlock() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mt-8 rounded-2xl overflow-hidden transition-colors"
      style={{ border: "1px solid var(--border)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left group"
      >
        <div className="flex items-center gap-3">
          <CreditCard size={18} style={{ color: "var(--accent)" }} />
          <span className="font-heading text-sm sm:text-base" style={{ color: "var(--text)" }}>
            Реквизиты компании
          </span>
        </div>
        <ChevronDown
          size={16}
          className="transition-transform duration-300"
          style={{
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? "600px" : "0", opacity: open ? 1 : 0 }}
      >
        <div
          className="px-5 sm:px-6 pb-5 sm:pb-6 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4">
            {[
              { label: "Полное наименование", value: COMPANY.fullName },
              { label: "Сокращённое", value: COMPANY.shortName },
              { label: "ИНН", value: COMPANY.inn },
              { label: "ОГРНИП", value: COMPANY.ogrnip },
              { label: "Юридический адрес", value: COMPANY.postalAddress },
              { label: "Банк", value: COMPANY.bank.name },
              { label: "Расчётный счёт", value: COMPANY.bank.account },
              { label: "Корр. счёт", value: COMPANY.bank.corrAccount },
              { label: "БИК", value: COMPANY.bank.bic },
            ].map(({ label, value }) => (
              <div key={label} className="py-1">
                <p
                  className="text-[10px] uppercase tracking-[0.15em] mb-1"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs sm:text-sm font-mono tabular-nums break-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactsSection() {
  return (
    <Section id="contacts" dark className="!pt-8 md:!pt-12">
      <SectionTitle subtitle="Свяжитесь с нами любым удобным способом" className="!mb-8 md:!mb-12">
        Контакты
      </SectionTitle>

      <div className="max-w-3xl">
        {/* Company badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            backgroundColor: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <Building2 size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-heading" style={{ color: "var(--accent)" }}>
            {COMPANY.shortName}
          </span>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {[
            { icon: Phone, label: "Телефон", value: `${PHONE} / ${PHONE2}`, href: `tel:${PHONE_RAW}` },
            { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
            { icon: MapPin, label: "Адрес", value: ADDRESS },
            { icon: Clock, label: "Режим работы", value: WORKING_HOURS },
          ].map(({ icon: Icon, label, value, href }) => {
            const Wrapper = href ? "a" : "div";
            return (
              <Wrapper
                key={label}
                {...(href ? { href } : {})}
                className="flex items-start gap-4 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.15)",
                  }}
                >
                  <Icon size={16} style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] mb-1"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-sm sm:text-base transition-colors group-hover:text-[var(--accent)]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {value}
                  </p>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Messengers */}
        <div className="flex gap-3">
          {[
            { href: SOCIAL_LINKS.telegram, icon: Send, label: "Telegram" },
            { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: "WhatsApp" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.02]"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
                e.currentTarget.style.color = "#000";
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <Icon size={14} />{label}
            </a>
          ))}
        </div>

        {/* Requisites accordion */}
        <RequisitesBlock />
      </div>
    </Section>
  );
}
