import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("[ADMIN POST GET]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, coverImage, published } = body;

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[ADMIN POST UPDATE]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN POST DELETE]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
