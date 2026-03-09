"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Section, SectionTitle } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { leadFormSchema, type LeadFormData } from "@/lib/schemas";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle, Loader2 } from "lucide-react";
import { PHONE, PHONE_RAW, EMAIL, ADDRESS, WORKING_HOURS, SOCIAL_LINKS } from "@/lib/constants";

export function ContactsSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    if (data.honeypot) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data, source: "contacts", pageUrl: window.location.href,
          utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign"),
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.redirectUrl) { window.location.href = result.redirectUrl; }
        else { setSubmitted(true); reset(); }
      }
    } catch { alert("Произошла ошибка. Позвоните нам по телефону."); }
    finally { setLoading(false); }
  };

  return (
    <Section id="contacts" dark>
      <SectionTitle subtitle="Оставьте заявку — инженер свяжется с вами в течение 30 минут">
        Контакты
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl">
        <div>
          <div className="space-y-8 mb-10">
            {[
              { icon: Phone, label: "Телефон", value: PHONE, href: `tel:${PHONE_RAW}` },
              { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
              { icon: MapPin, label: "Адрес", value: ADDRESS },
              { icon: Clock, label: "Режим работы", value: WORKING_HOURS },
            ].map(({ icon: Icon, label, value, href }) => {
              const Wrapper = href ? "a" : "div";
              return (
                <Wrapper key={label} {...(href ? { href } : {})} className="flex items-center gap-4 group">
                  <Icon size={18} style={{ color: "var(--accent)" }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "var(--text-subtle)" }}>{label}</p>
                    <p className="text-base" style={{ color: "var(--text-muted)" }}>{value}</p>
                  </div>
                </Wrapper>
              );
            })}
          </div>

          <div className="flex gap-3">
            {[
              { href: SOCIAL_LINKS.telegram, icon: Send, label: "Telegram" },
              { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: "WhatsApp" },
            ].map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--text)"; e.currentTarget.style.color = "var(--bg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <Icon size={14} />{label}
              </a>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10" style={{ border: "1px solid var(--border)" }}>
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <CheckCircle size={40} style={{ color: "var(--accent)" }} className="mb-4" />
              <h3 className="font-heading text-2xl mb-2">Заявка отправлена</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="font-heading text-2xl mb-1">Оставить заявку</h3>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Заполните форму и мы перезвоним в течение 30 минут</p>

              {[
                { id: "name", label: "Ваше имя", placeholder: "Иван", type: "text", error: errors.name?.message },
                { id: "phone", label: "Телефон", placeholder: "+7 (999) 000-00-00", type: "tel", error: errors.phone?.message },
                { id: "email", label: "Email (необязательно)", placeholder: "ivan@mail.ru", type: "email", error: errors.email?.message },
              ].map((field) => {
                const registered = register(field.id as keyof LeadFormData);
                return (
                  <div key={field.id} className="w-full">
                    <label htmlFor={field.id} className="block text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-subtle)" }}>{field.label}</label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-0 py-3.5 bg-transparent border-b text-sm focus:outline-none transition-colors"
                      style={{ borderColor: field.error ? "#ef4444" : "var(--border)", color: "var(--text)" }}
                      {...registered}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => {
                        registered.onBlur(e);
                        e.currentTarget.style.borderColor = field.error ? "#ef4444" : "var(--border)";
                      }}
                    />
                    {field.error && <p className="mt-1.5 text-xs text-red-400">{field.error}</p>}
                  </div>
                );
              })}

              <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
                <input tabIndex={-1} autoComplete="off" {...register("honeypot")} />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                {loading ? "Отправка..." : "Получить консультацию"}
              </Button>

              <p className="text-[10px] text-center uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
                Нажимая на кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" className="underline" style={{ color: "var(--text-muted)" }}>политикой конфиденциальности</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
