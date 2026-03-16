"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

const CATEGORIES = [
  "Электромонтаж",
  "Умный дом",
  "Безопасность",
  "Акустика",
  "Слаботочные системы",
  "Новости компании",
];

export default function AdminEditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/posts/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError("Запись не найдена");
        } else {
          setTitle(data.title);
          setSlug(data.slug);
          setExcerpt(data.excerpt);
          setContent(data.content);
          setCategory(data.category);
          setPublished(data.published);
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
      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, excerpt, content, category, published }),
      });

      if (!res.ok) throw new Error("Ошибка сохранения");
      router.push("/admin/posts");
    } catch {
      setError("Ошибка сохранения");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Удалить запись? Это действие необратимо.")) return;
    await fetch(`/api/admin/posts/${params.id}`, { method: "DELETE" });
    router.push("/admin/posts");
  }

  if (loading) return <div className="p-12 text-center text-white/30">Загрузка...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/posts" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft size={16} /> Новости
        </Link>
        <button onClick={handleDelete} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Удалить">
          <Trash2 size={16} />
        </button>
      </div>

      <h1 className="text-2xl font-bold">Редактировать запись</h1>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Заголовок</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">URL (slug)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/60 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Категория</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#111111]">{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Краткое описание</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white resize-none focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Содержание</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={14}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white resize-y focus:outline-none focus:border-[#C9A84C]/40 transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`relative w-10 h-5 rounded-full transition-colors ${published ? "bg-[#C9A84C]" : "bg-white/10"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${published ? "left-5" : "left-0.5"}`} />
          </button>
          <span className="text-sm text-white/60">{published ? "Опубликовано" : "Черновик"}</span>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#B8933F] text-black font-semibold text-sm transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
