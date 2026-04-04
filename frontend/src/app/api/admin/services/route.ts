import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ensureDefaultServicesIfNeeded } from "@/lib/seed-default-services";

export async function GET() {
  try {
    await ensureDefaultServicesIfNeeded();
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("[ADMIN SERVICES]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

function generateSlug(title: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return title
    .toLowerCase()
    .split("")
    .map((c) => map[c] || c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      shortDescription,
      serviceType,
      icon,
      coverImage,
      videoUrl,
      bannerImageDesktop,
      bannerImageMobile,
      published,
      order,
    } = body;

    if (!title || !shortDescription || !serviceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let slug = body.slug || generateSlug(title);
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const service = await prisma.service.create({
      data: {
        slug,
        title,
        shortDescription,
        serviceType,
        icon: icon || "zap",
        coverImage: coverImage || null,
        videoUrl: videoUrl || null,
        bannerImageDesktop: bannerImageDesktop ?? null,
        bannerImageMobile: bannerImageMobile ?? null,
        published: published ?? true,
        order: order ?? 0,
      } as unknown as Prisma.ServiceCreateInput,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("[ADMIN SERVICE CREATE]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
