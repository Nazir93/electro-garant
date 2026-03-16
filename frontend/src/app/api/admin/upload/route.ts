import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]/g, "_")
      .slice(0, 60);
    const timestamp = Date.now().toString(36);
    const fileName = `${baseName}-${timestamp}`;

    const isImage = ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"].includes(ext);

    let savedPath: string;

    if (isImage && ext !== "svg") {
      const webpName = `${fileName}.webp`;
      const webpPath = path.join(uploadsDir, webpName);

      await sharp(buffer)
        .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(webpPath);

      savedPath = `/uploads/${webpName}`;
    } else {
      const finalName = `${fileName}.${ext}`;
      const filePath = path.join(uploadsDir, finalName);
      await writeFile(filePath, buffer);
      savedPath = `/uploads/${finalName}`;
    }

    return NextResponse.json({ url: savedPath });
  } catch (error) {
    console.error("[UPLOAD]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
