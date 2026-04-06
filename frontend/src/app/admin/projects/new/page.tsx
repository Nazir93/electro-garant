"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Plus, Image as ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { AdminVideoListUpload } from "@/components/admin/admin-video-list-upload";
import { RichEditor } from "@/components/admin/rich-editor";
import { uploadAdminMedia } from "@/lib/admin-upload";

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
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "OTHER",
    service: "ELECTRICAL",
    area: "",
    description: "",
    videoUrls: [] as string[],
    location: "",
    year: new Date().getFullYear().toString(),
    industry: "",
    projectType: "",
    published: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function addGalleryImage(file: File) {
    setUploadingGallery(true);
    setGalleryError("");
    const { url, error } = await uploadAdminMedia(file);
    setUploadingGallery(false);
    if (error) { setGalleryError(error); return; }
    if (url) setGalleryUrls((prev) => [...prev, url]);
  }

  function removeGalleryImage(index: number) {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coverImage: galleryUrls[0] || "",
          galleryUrls,
        }),
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
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value} className="bg-[#111111]">{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Услуга</label>
            <select value={form.service} onChange={(e) => set("service", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors">
              {SERVICES.map((s) => <option key={s.value} value={s.value} className="bg-[#111111]">{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Площадь (м²)</label>
          <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            placeholder="150" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Локация</label>
            <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="Сочи, Курортный проспект" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Год</label>
            <input type="text" value={form.year} onChange={(e) => set("year", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="2026" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Отрасль</label>
            <input type="text" value={form.industry} onChange={(e) => set("industry", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="РЕСТОРАН, HORECA" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Тип проекта</label>
            <input type="text" value={form.projectType} onChange={(e) => set("projectType", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="ЭЛЕКТРОМОНТАЖ, АКУСТИКА" />
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

        <label className="flex items-center gap-2 text-sm text-white/60">
          <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="rounded" />
          Опубликовать сразу
        </label>
      </div>

      {/* Фото проекта */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Фото проекта ({galleryUrls.length})</p>
            <p className="text-[11px] text-white/30 mt-0.5">Первое фото станет обложкой. Все фото отображаются в баннере.</p>
          </div>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold cursor-pointer hover:bg-[#C9A84C]/20 transition-colors">
            <Plus size={14} /> {uploadingGallery ? "Загрузка..." : "Добавить фото"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploadingGallery}
              onChange={(e) => {
                const files = e.target.files;
                if (files) void Promise.all(Array.from(files).map((f) => addGalleryImage(f)));
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {galleryError && <p className="text-red-400 text-xs">{galleryError}</p>}
        {galleryUrls.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon size={32} className="mx-auto mb-2 text-white/10" />
            <p className="text-xs text-white/20">Нет изображений</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {galleryUrls.map((url, i) => (
              <div key={`${url}-${i}`} className="relative group rounded-lg overflow-hidden aspect-square bg-white/[0.03]">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#C9A84C] text-black">
                    Обложка
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Видео */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
        <AdminVideoListUpload
          label="Видео проекта (в баннере после фото)"
          urls={form.videoUrls}
          onChange={(videoUrls) => setForm((prev) => ({ ...prev, videoUrls }))}
        />
      </div>
    </div>
  );
}
