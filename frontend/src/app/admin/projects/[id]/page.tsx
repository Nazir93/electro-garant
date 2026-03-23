"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { AdminMediaUpload } from "@/components/admin/admin-media-upload";
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

interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "OTHER",
    service: "ELECTRICAL",
    area: "",
    description: "",
    coverImage: "",
    videoUrl: "",
    location: "",
    year: "",
    industry: "",
    projectType: "",
    features: "",
    goals: "",
    published: false,
    order: 0,
  });

  const loadProject = useCallback(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          category: data.category || "OTHER",
          service: data.service || "ELECTRICAL",
          area: data.area?.toString() || "",
          description: data.description || "",
          coverImage: data.coverImage || "",
          videoUrl: data.videoUrl || "",
          location: data.location || "",
          year: data.year || "",
          industry: data.industry || "",
          projectType: data.projectType || "",
          features: data.features || "",
          goals: data.goals || "",
          published: data.published ?? false,
          order: data.order ?? 0,
        });
        setImages(data.images || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { loadProject(); }, [loadProject]);

  function set(field: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function addGalleryImage(file: File) {
    setUploadingGallery(true);
    const { url } = await uploadAdminMedia(file);
    if (url) {
      const res = await fetch(`/api/admin/projects/${id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt: "", order: images.length }),
      });
      if (res.ok) {
        const img = await res.json();
        setImages((prev) => [...prev, img]);
      }
    }
    setUploadingGallery(false);
  }

  async function removeImage(imageId: string) {
    await fetch(`/api/admin/projects/${id}/images?imageId=${imageId}`, { method: "DELETE" });
    setImages((prev) => prev.filter((i) => i.id !== imageId));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) router.push("/admin/projects");
    } catch { /* */ }
    setSaving(false);
  }

  if (loading) return <div className="p-12 text-center text-white/30">Загрузка...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Редактирование</h1>
          <p className="text-sm text-white/40 mt-0.5">{form.title}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#B8933F] text-black text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      <div className="space-y-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Название</label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Slug (URL)</label>
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white font-mono focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
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
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Площадь (м²)</label>
            <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Локация</label>
            <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="Сочи, Курортный проспект" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Год</label>
            <input type="text" value={form.year} onChange={(e) => set("year", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="2026" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Отрасль</label>
            <input type="text" value={form.industry} onChange={(e) => set("industry", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="РЕСТОРАН, HORECA" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Тип проекта</label>
            <input type="text" value={form.projectType} onChange={(e) => set("projectType", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              placeholder="ЭЛЕКТРОМОНТАЖ, АКУСТИКА" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Описание</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white resize-none focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Особенности (каждая с новой строки)</label>
          <textarea value={form.features} onChange={(e) => set("features", e.target.value)} rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white resize-none focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            placeholder={"Электромонтаж силовых сетей\nМультизональная акустика"} />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/40 mb-1">Ключевые задачи</label>
          <textarea value={form.goals} onChange={(e) => set("goals", e.target.value)} rows={2}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white resize-none focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
            placeholder="Создание надёжной электрической инфраструктуры..." />
        </div>

        <AdminMediaUpload
          label="Обложка проекта"
          accept="image"
          value={form.coverImage}
          onChange={(url) => set("coverImage", url)}
        />

        <AdminMediaUpload
          label="Видео по проекту"
          accept="video"
          value={form.videoUrl}
          onChange={(url) => set("videoUrl", url)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Порядок</label>
            <input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm text-white/60">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="rounded" />
              Опубликован
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Галерея ({images.length})</h2>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold cursor-pointer hover:bg-[#C9A84C]/20 transition-colors">
            <Plus size={14} /> {uploadingGallery ? "Загрузка..." : "Добавить фото"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
              const files = e.target.files;
              if (files) Array.from(files).forEach((f) => addGalleryImage(f));
            }} />
          </label>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon size={32} className="mx-auto mb-2 text-white/10" />
            <p className="text-xs text-white/20">Нет изображений</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square bg-white/[0.03]">
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
