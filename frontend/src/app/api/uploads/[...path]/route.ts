import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".m4v": "video/x-m4v",
  ".avi": "video/x-msvideo",
  ".ogv": "video/ogg",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const segments = params.path;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const safeName = segments
    .map((s) => s.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]/g, "_"))
    .join("/");

  const filePath = path.join(process.cwd(), "public", "uploads", safeName);

  if (!filePath.startsWith(path.join(process.cwd(), "public", "uploads"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
