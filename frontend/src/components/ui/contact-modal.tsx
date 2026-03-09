"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ArrowRight, Paperclip, Loader2, CheckCircle } from "lucide-react";
import { useModal } from "@/lib/modal-context";
import { z } from "zod";

function SubmitButton({ loading }: { loading: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between px-6 py-5 sm:px-8 sm:py-8 md:py-10 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-heading transition-all duration-500 relative overflow-hidden mt-4"
      style={{ border: "1px solid var(--border)", borderRadius: "40px" }}
    >
      <div
        className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          backgroundColor: "var(--text)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      <span
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      >
        {loading ? "Отправка..." : "Отправить заявку"}
      </span>
      {loading ? (
        <Loader2 size={28} className="relative z-10 animate-spin" style={{ color: "var(--text)" }} />
      ) : (
        <ArrowRight
          size={28}
          className="relative z-10 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        />
      )}
    </button>
  );
}

const projectFormSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер"),
  email: z.string().email("Введите корректный email"),
  company: z.string().optional(),
  budget: z.string().optional(),
  description: z.string().min(10, "Опишите проект подробнее"),
  privacy: z.literal(true, { errorMap: () => ({ message: "Необходимо согласие" }) }),
  honeypot: z.string().max(0).optional(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

const BUDGET_OPTIONS = [
  "Планируемый бюджет",
  "до 500 000 ₽",
  "500 000 – 1 000 000 ₽",
  "1 000 000 – 3 000 000 ₽",
  "3 000 000 – 5 000 000 ₽",
  "от 5 000 000 ₽",
];

export function ContactModal() {
  const { isOpen, closeModal } = useModal();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeModal]);

  const onSubmit = async (data: ProjectFormData) => {
    if (data.honeypot) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          source: "project-form",
          pageUrl: window.location.href,
          utmSource: params.get("utm_source"),
          utmMedium: params.get("utm_medium"),
          utmCampaign: params.get("utm_campaign"),
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          setSubmitted(true);
          reset();
        }
      }
    } catch {
      alert("Произошла ошибка. Позвоните нам по телефону.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
      style={{ backgroundColor: "var(--bg)", WebkitOverflowScrolling: "touch" }}
    >
      {/* Close button */}
      <button
        onClick={closeModal}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[110] w-12 h-12 flex items-center justify-center transition-colors duration-200"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
        aria-label="Закрыть"
      >
        <X size={28} />
      </button>

      {submitted ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <CheckCircle size={56} style={{ color: "var(--accent)" }} className="mb-8" />
          <h2 className="font-heading text-4xl md:text-6xl mb-6">Заявка отправлена</h2>
          <p className="text-base md:text-lg mb-10 max-w-md" style={{ color: "var(--text-muted)" }}>
            Мы свяжемся с вами в ближайшее время
          </p>
          <button
            onClick={() => { setSubmitted(false); closeModal(); }}
            className="text-xs uppercase tracking-[0.15em] underline underline-offset-4 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            Закрыть
          </button>
        </div>
      ) : (
        <div className="min-h-screen flex items-start md:items-center">
          <div className="container mx-auto py-20 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-12 max-w-6xl mx-auto">
              {/* Left: title + logo */}
              <div className="flex flex-col items-start pt-2 gap-6 md:gap-8">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.05]">
                  ОПИШИТЕ
                  <br />
                  ВАШ ПРОЕКТ
                </h2>
                {/* CSS Logo — hidden on very small screens */}
                <div className="relative items-center select-none hidden sm:flex" style={{ height: "64px", width: "120px" }}>
                  <span
                    className="absolute left-0 leading-none"
                    style={{
                      fontFamily: "var(--font-main), sans-serif",
                      fontSize: "72px",
                      fontWeight: 700,
                      color: "var(--text)",
                      top: "-5px",
                    }}
                  >
                    Г
                  </span>
                  <span
                    className="absolute right-0 leading-none"
                    style={{
                      fontFamily: "var(--font-main), sans-serif",
                      fontSize: "72px",
                      fontWeight: 700,
                      color: "var(--text)",
                      top: "-5px",
                    }}
                  >
                    М
                  </span>
                  <div
                    className="absolute left-0 right-0 flex items-center justify-center z-10"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "var(--bg)",
                      padding: "3px 0",
                    }}
                  >
                    <span
                      className="text-[8px] uppercase tracking-[0.25em] font-bold whitespace-nowrap"
                      style={{ color: "var(--text)" }}
                    >
                      Гарант Монтаж
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: form */}
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Row 1: Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div
                      className="relative"
                      style={{ border: "1px solid var(--border)" }}
                    >
                      <input
                        type="text"
                        placeholder="Имя*"
                        className="w-full px-5 py-4 bg-transparent text-sm focus:outline-none"
                        style={{ color: "var(--text)" }}
                        {...register("name")}
                      />
                      {errors.name && (
                        <span className="absolute bottom-1 right-3 text-[10px] text-red-400">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                    <div
                      className="relative"
                      style={{ border: "1px solid var(--border)", borderLeft: "none" }}
                    >
                      <input
                        type="tel"
                        placeholder="Телефон*"
                        inputMode="tel"
                        autoComplete="tel"
                        className="w-full px-5 py-4 bg-transparent text-base sm:text-sm focus:outline-none"
                        style={{ color: "var(--text)" }}
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <span className="absolute bottom-1 right-3 text-[10px] text-red-400">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email + Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div
                      className="relative"
                      style={{ border: "1px solid var(--border)", borderTop: "none" }}
                    >
                      <input
                        type="email"
                        placeholder="E-mail*"
                        className="w-full px-5 py-4 bg-transparent text-sm focus:outline-none"
                        style={{ color: "var(--text)" }}
                        {...register("email")}
                      />
                      {errors.email && (
                        <span className="absolute bottom-1 right-3 text-[10px] text-red-400">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                    <div
                      style={{ border: "1px solid var(--border)", borderTop: "none", borderLeft: "none" }}
                    >
                      <input
                        type="text"
                        placeholder="Компания"
                        className="w-full px-5 py-4 bg-transparent text-sm focus:outline-none"
                        style={{ color: "var(--text)" }}
                        {...register("company")}
                      />
                    </div>
                  </div>

                  {/* Row 3: Budget */}
                  <div style={{ border: "1px solid var(--border)", borderTop: "none" }}>
                    <select
                      className="w-full px-5 py-4 text-sm focus:outline-none cursor-pointer appearance-none"
                      style={{
                        color: "var(--text-muted)",
                        backgroundColor: "var(--bg)",
                      }}
                      {...register("budget")}
                    >
                      {BUDGET_OPTIONS.map((opt) => (
                        <option
                          key={opt}
                          value={opt === BUDGET_OPTIONS[0] ? "" : opt}
                          style={{
                            backgroundColor: "var(--bg)",
                            color: "var(--text)",
                          }}
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 4: Description */}
                  <div
                    className="relative"
                    style={{ border: "1px solid var(--border)", borderTop: "none" }}
                  >
                    <textarea
                      placeholder="Описание проекта*"
                      rows={6}
                      className="w-full px-5 py-4 bg-transparent text-sm focus:outline-none resize-none"
                      style={{ color: "var(--text)" }}
                      {...register("description")}
                    />
                    {errors.description && (
                      <span className="absolute bottom-3 right-3 text-[10px] text-red-400">
                        {errors.description.message}
                      </span>
                    )}
                  </div>

                  {/* File upload */}
                  <div
                    className="px-5 py-3"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--text-muted)" }}>
                      <Paperclip size={14} />
                      <span>{fileName || "Загрузить файл"}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.png,.dwg,.zip"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: "var(--text-muted)" }}>
                      <input type="checkbox" className="w-4 h-4 accent-[var(--accent)]" />
                      <span>Беспроцентная рассрочка от банка Тинькофф</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: "var(--text-muted)" }}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[var(--accent)]"
                        {...register("privacy")}
                      />
                      <span>
                        Я согласен с{" "}
                        <a href="/privacy" className="underline" target="_blank">
                          политикой конфиденциальности
                        </a>
                      </span>
                      {errors.privacy && (
                        <span className="text-red-400 text-[10px] ml-1">*</span>
                      )}
                    </label>
                  </div>

                  {/* Honeypot */}
                  <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
                    <input tabIndex={-1} autoComplete="off" {...register("honeypot")} />
                  </div>

                  {/* Submit */}
                  <SubmitButton loading={loading} />
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
