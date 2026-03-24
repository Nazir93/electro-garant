import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"]);
const VIDEO_EXT = new Set(["mp4", "webm", "mov", "mkv", "m4v"]);

/** Лимиты для self-hosted Node (при необходимости увеличьте в nginx / прокси) */
const MAX_IMAGE_BYTES = 30 * 1024 * 1024;
const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ext) {
      return NextResponse.json({ error: "Нет расширения файла" }, { status: 400 });
    }

    const isImageType = IMAGE_EXT.has(ext);
    const isVideoType = VIDEO_EXT.has(ext);

    if (!isImageType && !isVideoType) {
      return NextResponse.json(
        { error: "Допустимы изображения (jpg, png, webp, gif, avif, svg) или видео (mp4, webm, mov, mkv, m4v)" },
        { status: 400 }
      );
    }

    if (isImageType && buffer.length > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: `Изображение слишком большое (макс. ${MAX_IMAGE_BYTES / 1024 / 1024} МБ)` }, { status: 400 });
    }
    if (isVideoType && buffer.length > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: `Видео слишком большое (макс. ${MAX_VIDEO_BYTES / 1024 / 1024} МБ)` }, { status: 400 });
    }

    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]/g, "_")
      .slice(0, 60);
    const timestamp = Date.now().toString(36);
    const fileName = `${baseName}-${timestamp}`;

    const useSharp = isImageType && ext !== "svg";

    let savedPath: string;

    if (useSharp) {
      const webpName = `${fileName}.webp`;
      const webpPath = path.join(uploadsDir, webpName);
      try {
        await sharp(buffer)
          .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(webpPath);
        savedPath = `/uploads/${webpName}`;
      } catch (sharpError) {
        // Sharp может падать на некоторых серверах (musl, Alpine) — сохраняем оригинал
        console.warn("[UPLOAD] Sharp failed, saving original:", sharpError);
        const finalName = `${fileName}.${ext}`;
        const filePath = path.join(uploadsDir, finalName);
        await writeFile(filePath, buffer);
        savedPath = `/uploads/${finalName}`;
      }
    } else {
      const finalName = `${fileName}.${ext}`;
      const filePath = path.join(uploadsDir, finalName);
      await writeFile(filePath, buffer);
      savedPath = `/uploads/${finalName}`;
    }

    return NextResponse.json({ url: savedPath });
  } catch (error) {
    console.error("[UPLOAD]", error);
    return NextResponse.json({ error: "Ошибка сохранения файла" }, { status: 500 });
  }
}
