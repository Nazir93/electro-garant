"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ArrowRight, ArrowLeft, Paperclip, Loader2, CheckCircle, FileText, Eye, Calculator } from "lucide-react";
import { useModal } from "@/lib/modal-context";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { PHONE, PHONE_RAW } from "@/lib/constants";

type WizardStep =
  | "q1"
  | "q2"
  | "form-project"
  | "form-inspection"
  | "form-calculator"
  | "success";

/* ───── Schemas ───── */

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

const inspectionFormSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер"),
  objectType: z.string().min(1, "Выберите тип объекта"),
  address: z.string().min(5, "Укажите адрес"),
  area: z.string().optional(),
  description: z.string().optional(),
  preferredTime: z.string().optional(),
  privacy: z.literal(true, { errorMap: () => ({ message: "Необходимо согласие" }) }),
  honeypot: z.string().max(0).optional(),
});
type InspectionFormData = z.infer<typeof inspectionFormSchema>;

const calculatorSchema = z.object({
  objectType: z.string().min(1, "Выберите тип объекта"),
  area: z.string().min(1, "Укажите площадь"),
  rooms: z.string().optional(),
  services: z.array(z.string()).min(1, "Выберите хотя бы одну услугу"),
  name: z.string().min(2, "Минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер"),
  privacy: z.literal(true, { errorMap: () => ({ message: "Необходимо согласие" }) }),
  honeypot: z.string().max(0).optional(),
});
type CalculatorFormData = z.infer<typeof calculatorSchema>;

/* ───── Constants ───── */

const BUDGET_OPTIONS = [
  "Планируемый бюджет",
  "до 500 000 ₽",
  "500 000 – 1 000 000 ₽",
  "1 000 000 – 3 000 000 ₽",
  "3 000 000 – 5 000 000 ₽",
  "от 5 000 000 ₽",
];

const OBJECT_TYPES = [
  "Квартира",
  "Частный дом",
  "Ресторан / Кафе",
  "Офис",
  "Магазин",
  "Склад / Производство",
  "Другое",
];

const SERVICE_OPTIONS = [
  { id: "electrical", label: "Электромонтажные работы" },
  { id: "lighting", label: "Освещение" },
  { id: "acoustics", label: "Коммерческая акустика" },
  { id: "cabling", label: "Слаботочные системы (СКС)" },
  { id: "smart-home", label: "Умный дом" },
  { id: "security", label: "Видеонаблюдение и безопасность" },
  { id: "design", label: "Проектирование" },
];

const PRICE_MAP: Record<string, number> = {
  electrical: 2500,
  lighting: 1200,
  acoustics: 1800,
  cabling: 1500,
  "smart-home": 3500,
  security: 1400,
  design: 800,
};

/* ───── Shared UI ───── */

function FillButton({
  children,
  onClick,
  type = "button",
  disabled,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6 text-lg sm:text-xl md:text-2xl font-heading transition-all duration-500 relative overflow-hidden"
      style={{ border: "1px solid var(--border)", borderRadius: "20px" }}
    >
      <div
        className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          backgroundColor: "var(--text)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          borderRadius: "20px",
        }}
      />
      <span
        className="relative z-10 transition-colors duration-700 flex items-center gap-3"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      >
        {icon}
        {children}
      </span>
      <ArrowRight
        size={22}
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      />
    </button>
  );
}

function InputField({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-subtle)" }}>
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-8 transition-colors"
      style={{ color: "var(--text-muted)" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
    >
      <ArrowLeft size={14} />
      Назад
    </button>
  );
}

/* ───── Question Steps ───── */

function Question1({ onAnswer }: { onAnswer: (hasProject: boolean) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <p className="text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: "var(--text-muted)" }}>
        Шаг 1 из 2
      </p>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-12 sm:mb-16 leading-[1]">
        Есть проект?
      </h2>
      <div className="w-full max-w-md flex flex-col gap-4">
        <FillButton onClick={() => onAnswer(true)} icon={<FileText size={20} />}>
          Да, есть проект
        </FillButton>
        <FillButton onClick={() => onAnswer(false)}>
          Нет
        </FillButton>
      </div>
    </div>
  );
}

function Question2({ onAnswer, onBack }: { onAnswer: (answer: "yes" | "no" | "unsure") => void; onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-md">
        <BackButton onClick={onBack} />
      </div>
      <p className="text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: "var(--text-muted)" }}>
        Шаг 2 из 2
      </p>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-12 sm:mb-16 leading-[1]">
        Планируете<br />делать проект?
      </h2>
      <div className="w-full max-w-md flex flex-col gap-4">
        <FillButton onClick={() => onAnswer("yes")} icon={<FileText size={20} />}>
          Да
        </FillButton>
        <FillButton onClick={() => onAnswer("no")} icon={<Eye size={20} />}>
          Нет
        </FillButton>
        <FillButton onClick={() => onAnswer("unsure")} icon={<Calculator size={20} />}>
          Не уверен
        </FillButton>
      </div>
    </div>
  );
}

/* ───── Form: Project (existing) ───── */

function ProjectForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (data.honeypot) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name, phone: data.phone, email: data.email,
          source: "project-form", pageUrl: window.location.href,
          utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign"),
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.redirectUrl) { window.location.href = result.redirectUrl; }
        else { reset(); onSuccess(); }
      }
    } catch { alert("Произошла ошибка. Позвоните нам: " + PHONE); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-start md:items-center">
      <div className="container mx-auto py-20 md:py-16">
        <div className="max-w-3xl mx-auto">
          <BackButton onClick={onBack} />
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl leading-[1.05] mb-8">
            ОПИШИТЕ<br />ВАШ ПРОЕКТ
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative" style={{ border: "1px solid var(--border)" }}>
                <input type="text" placeholder="Имя*" className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-transparent text-sm focus:outline-none" style={{ color: "var(--text)" }} {...register("name")} />
                {errors.name && <span className="absolute bottom-1 right-3 text-[10px] text-red-400">{errors.name.message}</span>}
              </div>
              <div className="relative border-phone-field" style={{ border: "1px solid var(--border)", borderTop: "none", borderLeft: "none" }}>
                <input type="tel" placeholder="Телефон*" inputMode="tel" autoComplete="tel" className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-transparent text-sm focus:outline-none" style={{ color: "var(--text)" }} {...register("phone")} />
                {errors.phone && <span className="absolute bottom-1 right-3 text-[10px] text-red-400">{errors.phone.message}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative" style={{ border: "1px solid var(--border)", borderTop: "none" }}>
                <input type="email" placeholder="E-mail*" className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-transparent text-sm focus:outline-none" style={{ color: "var(--text)" }} {...register("email")} />
                {errors.email && <span className="absolute bottom-1 right-3 text-[10px] text-red-400">{errors.email.message}</span>}
              </div>
              <div className="border-phone-field" style={{ border: "1px solid var(--border)", borderTop: "none", borderLeft: "none" }}>
                <input type="text" placeholder="Компания" className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-transparent text-sm focus:outline-none" style={{ color: "var(--text)" }} {...register("company")} />
              </div>
            </div>
            <div style={{ border: "1px solid var(--border)", borderTop: "none" }}>
              <select className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-sm focus:outline-none cursor-pointer appearance-none" style={{ color: "var(--text-muted)", backgroundColor: "var(--bg)" }} {...register("budget")}>
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt === BUDGET_OPTIONS[0] ? "" : opt} style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="relative" style={{ border: "1px solid var(--border)", borderTop: "none" }}>
              <textarea placeholder="Описание проекта*" rows={3} className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-transparent text-sm focus:outline-none resize-none" style={{ color: "var(--text)" }} {...register("description")} />
              {errors.description && <span className="absolute bottom-3 right-3 text-[10px] text-red-400">{errors.description.message}</span>}
            </div>
            <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--text-muted)" }}>
                <Paperclip size={14} />
                <span>{fileName || "Загрузить файл"}</span>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png,.dwg,.zip" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
              </label>
            </div>
            <div className="flex items-center gap-2 px-5 py-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: "var(--text-muted)" }}>
                <input type="checkbox" className="w-4 h-4 accent-[var(--accent)]" {...register("privacy")} />
                <span>Я согласен с <a href="/privacy" className="underline" target="_blank">политикой конфиденциальности</a></span>
                {errors.privacy && <span className="text-red-400 text-[10px] ml-1">*</span>}
              </label>
            </div>
            <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
              <input tabIndex={-1} autoComplete="off" {...register("honeypot")} />
            </div>
            <FillButton type="submit" disabled={loading}>
              {loading ? "Отправка..." : "Отправить заявку"}
            </FillButton>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ───── Form: Inspection (site visit) ───── */

function InspectionForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionFormSchema),
  });

  const onSubmit = async (data: InspectionFormData) => {
    if (data.honeypot) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name, phone: data.phone, source: "inspection-request",
          objectType: data.objectType, address: data.address, area: data.area,
          description: data.description, preferredTime: data.preferredTime,
          pageUrl: window.location.href,
          utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign"),
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.redirectUrl) { window.location.href = result.redirectUrl; }
        else { reset(); onSuccess(); }
      }
    } catch { alert("Произошла ошибка. Позвоните нам: " + PHONE); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-start md:items-center">
      <div className="container mx-auto py-20 md:py-16">
        <div className="max-w-2xl mx-auto">
          <BackButton onClick={onBack} />
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl leading-[1.05] mb-3">
            ОПИСАНИЕ ОБЪЕКТА
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Заполните информацию — инженер свяжется для согласования выезда на осмотр
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Ваше имя" error={errors.name?.message}>
                <input type="text" placeholder="Иван" className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none" style={{ borderColor: errors.name ? "#ef4444" : "var(--border)", color: "var(--text)" }} {...register("name")} />
              </InputField>
              <InputField label="Телефон" error={errors.phone?.message}>
                <input type="tel" placeholder="+7 (999) 000-00-00" inputMode="tel" autoComplete="tel" className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none" style={{ borderColor: errors.phone ? "#ef4444" : "var(--border)", color: "var(--text)" }} {...register("phone")} />
              </InputField>
            </div>
            <InputField label="Тип объекта" error={errors.objectType?.message}>
              <select className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none cursor-pointer appearance-none" style={{ borderColor: errors.objectType ? "#ef4444" : "var(--border)", color: "var(--text)", backgroundColor: "transparent" }} {...register("objectType")}>
                <option value="" style={{ backgroundColor: "var(--bg)" }}>Выберите тип</option>
                {OBJECT_TYPES.map((t) => <option key={t} value={t} style={{ backgroundColor: "var(--bg)" }}>{t}</option>)}
              </select>
            </InputField>
            <InputField label="Адрес объекта" error={errors.address?.message}>
              <input type="text" placeholder="г. Сочи, ул. ..." className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none" style={{ borderColor: errors.address ? "#ef4444" : "var(--border)", color: "var(--text)" }} {...register("address")} />
            </InputField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Площадь (м²)">
                <input type="text" placeholder="100" inputMode="numeric" className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none" style={{ borderColor: "var(--border)", color: "var(--text)" }} {...register("area")} />
              </InputField>
              <InputField label="Удобное время для звонка">
                <select className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none cursor-pointer appearance-none" style={{ borderColor: "var(--border)", color: "var(--text)", backgroundColor: "transparent" }} {...register("preferredTime")}>
                  <option value="" style={{ backgroundColor: "var(--bg)" }}>Любое</option>
                  <option value="morning" style={{ backgroundColor: "var(--bg)" }}>Утро (9–12)</option>
                  <option value="afternoon" style={{ backgroundColor: "var(--bg)" }}>День (12–17)</option>
                  <option value="evening" style={{ backgroundColor: "var(--bg)" }}>Вечер (17–20)</option>
                </select>
              </InputField>
            </div>
            <InputField label="Комментарий">
              <textarea placeholder="Опишите что нужно сделать..." rows={3} className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none resize-none" style={{ borderColor: "var(--border)", color: "var(--text)" }} {...register("description")} />
            </InputField>
            <label className="flex items-center gap-2 cursor-pointer text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              <input type="checkbox" className="w-4 h-4 accent-[var(--accent)]" {...register("privacy")} />
              <span>Я согласен с <a href="/privacy" className="underline" target="_blank">политикой конфиденциальности</a></span>
              {errors.privacy && <span className="text-red-400 text-[10px] ml-1">*</span>}
            </label>
            <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
              <input tabIndex={-1} autoComplete="off" {...register("honeypot")} />
            </div>
            <FillButton type="submit" disabled={loading}>
              {loading ? "Отправка..." : "Заказать выезд инженера"}
            </FillButton>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ───── Form: Calculator ───── */

function CalculatorForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<number | null>(null);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: { services: [] },
  });

  const watchArea = watch("area");
  const watchServices = watch("services");

  useEffect(() => {
    const area = parseFloat(watchArea || "0");
    if (area > 0 && watchServices?.length > 0) {
      const pricePerSqm = watchServices.reduce((sum, s) => sum + (PRICE_MAP[s] || 0), 0);
      setEstimate(Math.round(area * pricePerSqm));
    } else {
      setEstimate(null);
    }
  }, [watchArea, watchServices]);

  const onSubmit = async (data: CalculatorFormData) => {
    if (data.honeypot) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name, phone: data.phone, source: "calculator",
          objectType: data.objectType, area: data.area, rooms: data.rooms,
          services: data.services, estimate,
          pageUrl: window.location.href,
          utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign"),
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.redirectUrl) { window.location.href = result.redirectUrl; }
        else { reset(); onSuccess(); }
      }
    } catch { alert("Произошла ошибка. Позвоните нам: " + PHONE); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-start md:items-center">
      <div className="container mx-auto py-20 md:py-16">
        <div className="max-w-2xl mx-auto">
          <BackButton onClick={onBack} />
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl leading-[1.05] mb-3">
            ОРИЕНТИРОВОЧНЫЙ<br />РАСЧЁТ
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Заполните параметры объекта — мы рассчитаем примерную стоимость
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <InputField label="Тип объекта" error={errors.objectType?.message}>
              <select className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none cursor-pointer appearance-none" style={{ borderColor: errors.objectType ? "#ef4444" : "var(--border)", color: "var(--text)", backgroundColor: "transparent" }} {...register("objectType")}>
                <option value="" style={{ backgroundColor: "var(--bg)" }}>Выберите тип</option>
                {OBJECT_TYPES.map((t) => <option key={t} value={t} style={{ backgroundColor: "var(--bg)" }}>{t}</option>)}
              </select>
            </InputField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Площадь (м²)" error={errors.area?.message}>
                <input type="text" placeholder="100" inputMode="numeric" className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none" style={{ borderColor: errors.area ? "#ef4444" : "var(--border)", color: "var(--text)" }} {...register("area")} />
              </InputField>
              <InputField label="Кол-во комнат / зон">
                <input type="text" placeholder="5" inputMode="numeric" className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none" style={{ borderColor: "var(--border)", color: "var(--text)" }} {...register("rooms")} />
              </InputField>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: "var(--text-subtle)" }}>
                Необходимые услуги
              </p>
              {errors.services && <p className="text-[11px] text-red-400 mb-2">{errors.services.message}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_OPTIONS.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <input
                      type="checkbox"
                      value={service.id}
                      className="w-4 h-4 accent-[var(--accent)] shrink-0"
                      {...register("services")}
                    />
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{service.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Estimate display */}
            {estimate !== null && (
              <div
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-muted)" }}>
                  Ориентировочная стоимость
                </p>
                <p className="font-heading text-3xl sm:text-4xl" style={{ color: "var(--accent)" }}>
                  от {estimate.toLocaleString("ru-RU")} ₽
                </p>
                <p className="text-[10px] mt-2" style={{ color: "var(--text-subtle)" }}>
                  Точная стоимость определяется после выезда инженера
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Ваше имя" error={errors.name?.message}>
                <input type="text" placeholder="Иван" className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none" style={{ borderColor: errors.name ? "#ef4444" : "var(--border)", color: "var(--text)" }} {...register("name")} />
              </InputField>
              <InputField label="Телефон" error={errors.phone?.message}>
                <input type="tel" placeholder="+7 (999) 000-00-00" inputMode="tel" autoComplete="tel" className="w-full px-0 py-3 bg-transparent border-b text-base sm:text-sm focus:outline-none" style={{ borderColor: errors.phone ? "#ef4444" : "var(--border)", color: "var(--text)" }} {...register("phone")} />
              </InputField>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              <input type="checkbox" className="w-4 h-4 accent-[var(--accent)]" {...register("privacy")} />
              <span>Я согласен с <a href="/privacy" className="underline" target="_blank">политикой конфиденциальности</a></span>
              {errors.privacy && <span className="text-red-400 text-[10px] ml-1">*</span>}
            </label>
            <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
              <input tabIndex={-1} autoComplete="off" {...register("honeypot")} />
            </div>
            <FillButton type="submit" disabled={loading}>
              {loading ? "Отправка..." : "Получить точный расчёт"}
            </FillButton>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ───── Success Screen ───── */

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <CheckCircle size={56} style={{ color: "var(--accent)" }} className="mb-8" />
      <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-6">Заявка отправлена</h2>
      <p className="text-base md:text-lg mb-4 max-w-md" style={{ color: "var(--text-muted)" }}>
        Мы свяжемся с вами в ближайшее время
      </p>
      <p className="text-sm mb-10" style={{ color: "var(--text-subtle)" }}>
        Или позвоните нам: <a href={`tel:${PHONE_RAW}`} className="underline" style={{ color: "var(--text-muted)" }}>{PHONE}</a>
      </p>
      <button
        onClick={onClose}
        className="text-xs uppercase tracking-[0.15em] underline underline-offset-4 transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        Закрыть
      </button>
    </div>
  );
}

/* ───── Main Modal ───── */

export function ContactModal() {
  const { isOpen, closeModal } = useModal();
  const [step, setStep] = useState<WizardStep>("q1");
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setStep("q1");
  }, [isOpen]);

  const handleClose = () => {
    setStep("q1");
    closeModal();
  };

  const handleQ1 = (hasProject: boolean) => {
    if (hasProject) setStep("form-project");
    else setStep("q2");
  };

  const handleQ2 = (answer: "yes" | "no" | "unsure") => {
    if (answer === "yes") {
      handleClose();
      router.push("/services");
    } else if (answer === "no") {
      setStep("form-inspection");
    } else {
      setStep("form-calculator");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain safe-bottom"
      style={{ backgroundColor: "var(--bg)", WebkitOverflowScrolling: "touch" }}
    >
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[110] w-12 h-12 flex items-center justify-center transition-colors duration-200"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
        aria-label="Закрыть"
      >
        <X size={28} />
      </button>

      {step === "q1" && <Question1 onAnswer={handleQ1} />}
      {step === "q2" && <Question2 onAnswer={handleQ2} onBack={() => setStep("q1")} />}
      {step === "form-project" && <ProjectForm onBack={() => setStep("q1")} onSuccess={() => setStep("success")} />}
      {step === "form-inspection" && <InspectionForm onBack={() => setStep("q2")} onSuccess={() => setStep("success")} />}
      {step === "form-calculator" && <CalculatorForm onBack={() => setStep("q2")} onSuccess={() => setStep("success")} />}
      {step === "success" && <SuccessScreen onClose={handleClose} />}
    </div>
  );
}
