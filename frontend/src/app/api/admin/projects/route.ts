import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") || "";

  try {
    const projects = await prisma.project.findMany({
      where: search
        ? { title: { contains: search, mode: "insensitive" } }
        : undefined,
      orderBy: { order: "asc" },
      include: { images: { orderBy: { order: "asc" } }, _count: { select: { hotspots: true } } },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[ADMIN PROJECTS]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body.slug || generateSlug(body.title);

    const project = await prisma.project.create({
      data: {
        slug,
        title: body.title,
        category: body.category || "OTHER",
        service: body.service || "ELECTRICAL",
        area: body.area ? parseInt(body.area) : null,
        description: body.description || "",
        coverImage: body.coverImage || "",
        videoUrl: body.videoUrl || null,
        location: body.location || null,
        year: body.year || null,
        industry: body.industry || null,
        projectType: body.projectType || null,
        features: body.features || null,
        goals: body.goals || null,
        leftText1: body.leftText1 || null,
        rightText1: body.rightText1 || null,
        leftText2: body.leftText2 || null,
        rightText2: body.rightText2 || null,
        showcaseLabel1: body.showcaseLabel1 || null,
        showcaseLabel2: body.showcaseLabel2 || null,
        showcaseImage1: body.showcaseImage1 || null,
        showcaseImage2: body.showcaseImage2 || null,
        published: body.published ?? false,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[ADMIN PROJECT CREATE]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
