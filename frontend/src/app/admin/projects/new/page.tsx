"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminMediaUpload } from "@/components/admin/admin-media-upload";
import { AdminVideoListUpload } from "@/components/admin/admin-video-list-upload";
import { RichEditor } from "@/components/admin/rich-editor";

const CATEGORIES = [
  { value: "RESTAURANT", label: "Ресторан" },
  { value: "OFFICE", label: "Офис" },
  { value: "APARTMENT", label: "Квартира" },
  { value: "SHOP", label: "Магазин" },
  { value: "OTHER", label: "Другое" },
];

const SERVICES = [
  { value: "ELECTRICAL", label: "Электрика" },
  { value: "ACOUSTICS", label: "Акустика" },
  { value: "STRUCTURED_CABLING", label: "СКС" },
  { value: "SMART_HOME", label: "Умный дом" },
  { value: "SECURITY", label: "Безопасность" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "OTHER",
    service: "ELECTRICAL",
    area: "",
    description: "",
    coverImage: "",
    videoUrls: [] as string[],
    location: "",
    year: new Date().getFullYear().toString(),
    industry: "",
    projectType: "",
    features: "",
    goals: "",
    leftText1: "",
    rightText1: "",
    leftText2: "",
    rightText2: "",
    showcaseLabel1: "",
    showcaseLabel2: "",
    showcaseImage1: "",
    showcaseImage2: "",
    published: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const project = await res.json();
        router.push(`/admin/projects/${project.id}`);
      }
    } catch { /* */ }
    setSaving(false);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Новый проект</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !form.title.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#B8933F] text-black text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Сохранение..." : "Создать"}
        </button>
      </div>

      <div className="space-y-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Название проекта</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            placeholder="Ресторан «Олива»"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Категория</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#111111]">{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Услуга</label>
            <select
              value={form.service}
              onChange={(e) => set("service", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            >
              {SERVICES.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#111111]">{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Площадь (м²)</label>
          <input
            type="number"
            value={form.area}
            onChange={(e) => set("area", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            placeholder="150"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Локация</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="Сочи, Курортный проспект"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Год</label>
            <input
              type="text"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="2026"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Отрасль</label>
            <input
              type="text"
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="РЕСТОРАН, HORECA"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Тип проекта</label>
            <input
              type="text"
              value={form.projectType}
              onChange={(e) => set("projectType", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="ЭЛЕКТРОМОНТАЖ, АКУСТИКА"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Описание</label>
          <RichEditor
            value={form.description}
            onChange={(v) => set("description", v)}
            placeholder="Подробное описание проекта..."
            minHeight="150px"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Особенности (каждая с новой строки)</label>
          <textarea
            value={form.features}
            onChange={(e) => set("features", e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            placeholder={"Электромонтаж силовых сетей\nМультизональная акустика\nДиммируемое освещение"}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Ключевые задачи</label>
          <RichEditor
            value={form.goals}
            onChange={(v) => set("goals", v)}
            placeholder="Создание надёжной электрической инфраструктуры..."
            minHeight="80px"
          />
        </div>

        <div className="pt-5 mt-2 border-t border-white/[0.08] space-y-4">
          <p className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider">Страница кейса</p>
          <p className="text-[11px] text-white/35 leading-relaxed">
            Галерею можно добавить после создания проекта. Фото для широких полос, если не указать здесь, возьмутся из 1-го и 2-го снимка галереи.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Текст слева (под 1-й полосой)</label>
              <RichEditor value={form.leftText1} onChange={(v) => set("leftText1", v)} minHeight="120px" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Текст справа (под 1-й полосой)</label>
              <RichEditor value={form.rightText1} onChange={(v) => set("rightText1", v)} minHeight="120px" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Текст слева (под 2-й полосой)</label>
              <RichEditor value={form.leftText2} onChange={(v) => set("leftText2", v)} minHeight="120px" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Текст справа (под 2-й полосой)</label>
              <RichEditor value={form.rightText2} onChange={(v) => set("rightText2", v)} minHeight="120px" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Подпись на 1-й полосе</label>
              <input type="text" value={form.showcaseLabel1} onChange={(e) => set("showcaseLabel1", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1">Подпись на 2-й полосе</label>
              <input type="text" value={form.showcaseLabel2} onChange={(e) => set("showcaseLabel2", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
            </div>
          </div>
          <AdminMediaUpload label="Фото 1-й полосы (опционально)" accept="image" value={form.showcaseImage1} onChange={(url) => set("showcaseImage1", url)} />
          <AdminMediaUpload label="Фото 2-й полосы (опционально)" accept="image" value={form.showcaseImage2} onChange={(url) => set("showcaseImage2", url)} />
        </div>

        <AdminMediaUpload
          label="Обложка проекта"
          accept="image"
          value={form.coverImage}
          onChange={(url) => set("coverImage", url)}
        />

        <AdminVideoListUpload
          label="Видео в баннере (опционально, после фото)"
          urls={form.videoUrls}
          onChange={(videoUrls) => setForm((prev) => ({ ...prev, videoUrls }))}
        />

        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="rounded"
          />
          Опубликовать сразу
        </label>
      </div>
    </div>
  );
}
