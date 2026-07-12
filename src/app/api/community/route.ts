import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all";

  let where: Record<string, unknown> = {};
  if (filter === "advice") {
    where = { isAdvice: true };
  } else if (filter === "trending") {
    where = { likes: { gte: 100 } };
  }

  const posts = await db.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { comments: true },
  });

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      authorName: p.authorName,
      authorBadge: p.authorBadge,
      category: p.category,
      categoryLabel: p.categoryLabel,
      xpReward: p.xpReward,
      title: p.title,
      body: p.body,
      likes: p.likes,
      commentsCount: p.comments.length,
      isAdvice: p.isAdvice,
      createdAt: p.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body as {
    action: "like" | "comment";
    postId: string;
    text?: string;
    authorName?: string;
  };

  if (action === "like") {
    const post = await db.post.update({
      where: { id: body.postId },
      data: { likes: { increment: 1 } },
    });
    return NextResponse.json({ id: post.id, likes: post.likes });
  }

  if (action === "comment") {
    const comment = await db.comment.create({
      data: {
        postId: body.postId,
        authorName: body.authorName || "Вы",
        body: body.text || "",
      },
    });
    return NextResponse.json({ comment });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
