"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadAdminMedia } from "@/lib/admin-upload";

type Accept = "image" | "video";

export function AdminMediaUpload({
  label,
  accept,
  value,
  onChange,
  className = "",
}: {
  label: string;
  accept: Accept;
  value: string;
  onChange: (url: string) => void;
  className?: string;
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
    else if (res.url) onChange(res.url);
  }

  const acceptAttr =
    accept === "image"
      ? "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif,.jpg,.jpeg,.png,.webp,.gif,.svg,.avif"
      : "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.mkv,.m4v";

  const btnLabel =
    uploading ? "Загрузка…" : accept === "image" ? "Выбрать изображение" : "Выбрать видеофайл";

  return (
    <div className={className}>
      <span className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A84C]/20 hover:bg-[#C9A84C]/30 text-[#C9A84C] text-sm font-medium cursor-pointer transition-colors border border-[#C9A84C]/25">
          <Upload size={16} />
          {btnLabel}
          <input
            type="file"
            accept={acceptAttr}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/[0.06] text-white/50 hover:text-red-400 text-xs transition-colors"
          >
            <X size={14} /> Убрать файл
          </button>
        ) : null}
      </div>
      {error ? <p className="text-red-400 text-xs mt-1.5">{error}</p> : null}
      <p className="text-[11px] text-white/25 mt-1.5">
        {accept === "image"
          ? "JPG, PNG, WebP, GIF, SVG, AVIF — по возможности конвертируется в WebP."
          : "MP4, WebM, MOV и др. Файл сохраняется на сервере; для фона карточек нужен прямой URL к видео."}
      </p>
      {value && accept === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element -- админ-превью по произвольному URL
        <img
          src={value}
          alt=""
          className="mt-2 max-h-44 rounded-lg border border-white/[0.08] object-contain bg-black/20"
        />
      ) : null}
      {value && accept === "video" ? (
        <video
          src={value}
          controls
          className="mt-2 max-h-52 rounded-lg border border-white/[0.08] w-full max-w-lg bg-black/40"
        />
      ) : null}
    </div>
  );
}
