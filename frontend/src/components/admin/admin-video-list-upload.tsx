"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { uploadAdminMedia } from "@/lib/admin-upload";

export function AdminVideoListUpload({
  urls,
  onChange,
  label,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);
    const res = await uploadAdminMedia(file);
    setUploading(false);
    if (res.error) setError(res.error);
    else if (res.url) onChange([...urls, res.url]);
  }

  function remove(i: number) {
    onChange(urls.filter((_, j) => j !== i));
  }

  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">{label}</span>
      {urls.map((url, i) => (
        <div
          key={`${url}-${i}`}
          className="flex gap-2 items-start rounded-xl border border-white/[0.08] p-2 bg-white/[0.02]"
        >
          <video src={url} controls className="max-h-40 flex-1 rounded-lg bg-black/40 w-full max-w-lg" />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 text-red-400 hover:bg-white/5 rounded-lg shrink-0"
            aria-label="Удалить видео"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A84C]/20 hover:bg-[#C9A84C]/30 text-[#C9A84C] text-sm font-medium cursor-pointer transition-colors border border-[#C9A84C]/25">
        <Plus size={16} />
        {uploading ? "Загрузка…" : "Добавить видео"}
        <input
          type="file"
          accept="video/*,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {error ? <p className="text-red-400 text-xs mt-1">{error}</p> : null}
      <p className="text-[11px] text-white/25 mt-1">
        Несколько роликов показываются в карусели баннера после фото. MP4, WebM, MOV.
      </p>
    </div>
  );
}
