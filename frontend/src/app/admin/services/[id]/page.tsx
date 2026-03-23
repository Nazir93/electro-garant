"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { AdminMediaUpload } from "@/components/admin/admin-media-upload";

const SERVICE_TYPES = [
  { value: "ELECTRICAL", label: "Электромонтаж" },
  { value: "ACOUSTICS", label: "Акустика" },
  { value: "STRUCTURED_CABLING", label: "Слаботочные системы" },
  { value: "SMART_HOME", label: "Умный дом" },
  { value: "SECURITY", label: "Безопасность" },
];

const ICONS = ["zap", "speaker", "network", "home", "shield"];

export default function AdminEditServicePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [icon, setIcon] = useState("zap");
  const [coverImage, setCoverImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetch(`/api/admin/services/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError("Услуга не найдена");
        } else {
          setTitle(data.title);
          setSlug(data.slug);
          setShortDescription(data.shortDescription);
          setServiceType(data.serviceType);
          setIcon(data.icon);
          setCoverImage(data.coverImage || "");
          setVideoUrl(data.videoUrl || "");
          setPublished(data.published);
          setOrder(data.order);
        }
      })
      .catch(() => setError("Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/services/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, shortDescription, serviceType, icon, coverImage: coverImage || null, videoUrl: videoUrl || null, published, order }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      router.push("/admin/services");
    } catch {
      setError("Ошибка сохранения");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Удалить услугу?")) return;
    await fetch(`/api/admin/services/${params.id}`, { method: "DELETE" });
    router.push("/admin/services");
  }

  if (loading) return <div className="p-12 text-center text-white/30">Загрузка...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft size={16} /> Услуги
        </Link>
        <button onClick={handleDelete} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <h1 className="text-2xl font-bold">Редактировать услугу</h1>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Название</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">URL (slug)</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/60 focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Тип</label>
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors">
              {SERVICE_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#111111]">{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Порядок</label>
            <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Иконка</label>
          <div className="flex gap-2">
            {ICONS.map((ic) => (
              <button key={ic} type="button" onClick={() => setIcon(ic)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  icon === ic ? "border-[#C9A84C]/40 text-[#C9A84C] bg-[#C9A84C]/10" : "border-white/[0.08] text-white/40"}`}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        <AdminMediaUpload
          label="Изображение услуги"
          accept="image"
          value={coverImage}
          onChange={setCoverImage}
        />

        <AdminMediaUpload
          label="Видео для карточки (фон)"
          accept="video"
          value={videoUrl}
          onChange={setVideoUrl}
        />

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Краткое описание</label>
          <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white resize-none focus:outline-none focus:border-[#C9A84C]/40 transition-colors" />
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setPublished(!published)}
            className={`relative w-10 h-5 rounded-full transition-colors ${published ? "bg-[#C9A84C]" : "bg-white/10"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${published ? "left-5" : "left-0.5"}`} />
          </button>
          <span className="text-sm text-white/60">{published ? "Опубликовано" : "Скрыто"}</span>
        </div>

        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#B8933F] text-black font-semibold text-sm transition-colors disabled:opacity-50">
          <Save size={16} />
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
