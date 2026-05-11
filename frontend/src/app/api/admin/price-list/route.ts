import { NextRequest, NextResponse } from "next/server";
import { stat, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import {
  PRICE_LIST_DOWNLOAD_NAME_DEFAULT,
  PRICE_LIST_HREF,
  PRICE_LIST_PUBLIC_FILE,
} from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SETTINGS_KEY = "price_list_download_name";
const MAX_BYTES = 20 * 1024 * 1024;

function publicPdfPath(): string {
  return path.join(process.cwd(), "public", PRICE_LIST_PUBLIC_FILE);
}

export async function GET() {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: SETTINGS_KEY } });
    let fileExists = false;
    let fileSize = 0;
    let mtimeMs: number | null = null;
    try {
      const st = await stat(publicPdfPath());
      fileExists = st.isFile();
      fileSize = st.size;
      mtimeMs = st.mtimeMs;
    } catch {
      /* нет файла */
    }
    return NextResponse.json({
      downloadName: row?.value?.trim() || PRICE_LIST_DOWNLOAD_NAME_DEFAULT,
      href: PRICE_LIST_HREF,
      fileExists,
      fileSize,
      updatedAt: mtimeMs != null ? new Date(mtimeMs).toISOString() : null,
    });
  } catch (e) {
    console.error("[admin price-list GET]", e);
    return NextResponse.json({ error: "Не удалось загрузить настройки" }, { status: 500 });
  }
}

/** Обновить только имя при скачивании (без загрузки файла). */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body.downloadName !== "string") {
      return NextResponse.json({ error: "Укажите downloadName" }, { status: 400 });
    }
    const name = body.downloadName.trim().slice(0, 240);
    if (!name) {
      await prisma.siteSettings.deleteMany({ where: { key: SETTINGS_KEY } });
    } else {
      await prisma.siteSettings.upsert({
        where: { key: SETTINGS_KEY },
        create: { key: SETTINGS_KEY, value: name },
        update: { value: name },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin price-list PATCH]", e);
    return NextResponse.json({ error: "Не удалось сохранить имя файла" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const dn = formData.get("downloadName");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length < 5 || buf.slice(0, 5).toString("ascii") !== "%PDF-") {
      return NextResponse.json({ error: "Нужен файл PDF" }, { status: 400 });
    }
    if (buf.length > MAX_BYTES) {
      return NextResponse.json({ error: `Файл слишком большой (макс. ${MAX_BYTES / 1024 / 1024} МБ)` }, { status: 400 });
    }

    await writeFile(publicPdfPath(), buf);

    if (typeof dn === "string" && dn.trim()) {
      const name = dn.trim().slice(0, 240);
      await prisma.siteSettings.upsert({
        where: { key: SETTINGS_KEY },
        create: { key: SETTINGS_KEY, value: name },
        update: { value: name },
      });
    }

    return NextResponse.json({ ok: true, href: PRICE_LIST_HREF });
  } catch (e) {
    console.error("[admin price-list POST]", e);
    const err = e as NodeJS.ErrnoException;
    if (err?.code === "EACCES" || err?.code === "EPERM") {
      return NextResponse.json({ error: "Нет прав на запись в папку public" }, { status: 500 });
    }
    return NextResponse.json({ error: "Не удалось сохранить PDF" }, { status: 500 });
  }
}
