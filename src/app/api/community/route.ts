import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { notify } from "@/lib/notify";
import { getRankByPoints } from "@/lib/ranks";
import { CATEGORY_META } from "@/lib/mission-templates";

export const dynamic = "force-dynamic";

// GET community feed — returns posts from ALL users (global feed).
// Optional filter: all | trending | mine | advice
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all";

  let where: Record<string, unknown> = {};
  if (filter === "advice") {
    where = { isAdvice: true };
  } else if (filter === "trending") {
    where = { likes: { gte: 50 } };
  } else if (filter === "mine") {
    where = { authorId: user.id };
  }

  const posts = await db.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      comments: true,
      likesRel: { where: { userId: user.id } },
    },
    take: 50,
  });

  // Compute rank for each post author based on their total skill points
  const authorIds = [...new Set(posts.map((p) => p.authorId))];
  const authorAttrs = await db.attribute.findMany({
    where: { userId: { in: authorIds } },
    select: { userId: true, points: true },
  });
  const authorPoints = new Map<string, number>();
  for (const a of authorAttrs) {
    authorPoints.set(a.userId, (authorPoints.get(a.userId) ?? 0) + a.points);
  }

  return NextResponse.json({
    posts: posts.map((p) => {
      const pts = authorPoints.get(p.authorId) ?? 0;
      const rank = getRankByPoints(pts);
      return {
      id: p.id,
      authorId: p.authorId,
      authorName: p.authorName,
      authorBadge: rank.title,
      category: p.category,
      categoryLabel: p.categoryLabel,
      xpReward: p.xpReward,
      title: p.title,
      body: p.body,
      likes: p.likes,
      likedByMe: p.likesRel.length > 0,
      commentsCount: p.comments.length,
      isAdvice: p.isAdvice,
      createdAt: p.createdAt.toISOString(),
      };
    }),
  });
}

// POST — create a new post or like/comment
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body as {
    action: "create-post" | "like" | "unlike" | "comment" | "delete-post";
    postId?: string;
    title?: string;
    body?: string;
    category?: string;
    text?: string;
  };

  if (action === "create-post") {
    const title = (body.title || "").trim();
    const postBody = (body.body || "").trim();
    const category = body.category || "mental";
    if (!title || !postBody) {
      return NextResponse.json({ error: "Заголовок и текст обязательны" }, { status: 400 });
    }
    const cat = CATEGORY_META[category as keyof typeof CATEGORY_META];
    if (!cat) {
      return NextResponse.json({ error: "Неизвестная категория" }, { status: 400 });
    }
    // Compute author rank dynamically
    const authorAttrs = await db.attribute.findMany({
      where: { userId: user.id },
      select: { points: true },
    });
    const authorTotalPoints = authorAttrs.reduce((s, a) => s + a.points, 0);
    const authorRank = getRankByPoints(authorTotalPoints).title;

    const post = await db.post.create({
      data: {
        authorId: user.id,
        authorName: user.displayName,
        authorBadge: authorRank,
        category,
        categoryLabel: cat.label.toUpperCase(),
        xpReward: 0,
        title,
        body: postBody,
        likes: 0,
        commentsCount: 0,
        isAdvice: false,
      },
    });
    return NextResponse.json({ post: { id: post.id } });
  }

  if (action === "like") {
    const existing = await db.postLike.findUnique({
      where: { postId_userId: { postId: body.postId!, userId: user.id } },
    });
    if (existing) {
      return NextResponse.json({ likes: 0, already: true });
    }
    await db.postLike.create({
      data: { postId: body.postId!, userId: user.id },
    });
    const post = await db.post.update({
      where: { id: body.postId },
      data: { likes: { increment: 1 } },
    });
    // notify the post author (skip self-likes)
    if (post.authorId !== user.id) {
      await notify({
        userId: post.authorId,
        type: "social",
        icon: "thumb_up",
        color: "#e9b3ff",
        title: "Новый лайк на пост",
        body: `${user.displayName} оценил(а) ваш пост «${post.title}».`,
      });
    }
    return NextResponse.json({ id: post.id, likes: post.likes });
  }

  if (action === "unlike") {
    await db.postLike.deleteMany({
      where: { postId: body.postId!, userId: user.id },
    });
    const post = await db.post.update({
      where: { id: body.postId },
      data: { likes: { decrement: 1 } },
    });
    return NextResponse.json({ id: post.id, likes: post.likes });
  }

  if (action === "comment") {
    const text = (body.text || "").trim();
    if (!text) {
      return NextResponse.json({ error: "Пустой комментарий" }, { status: 400 });
    }
    const comment = await db.comment.create({
      data: {
        postId: body.postId!,
        authorId: user.id,
        authorName: user.displayName,
        body: text,
      },
    });
    const post = await db.post.update({
      where: { id: body.postId },
      data: { commentsCount: { increment: 1 } },
    });
    // notify the post author (skip self-comments)
    if (post.authorId !== user.id) {
      await notify({
        userId: post.authorId,
        type: "social",
        icon: "chat_bubble",
        color: "#e9b3ff",
        title: "Новый комментарий",
        body: `${user.displayName}: «${text.length > 60 ? text.slice(0, 60) + "…" : text}» под вашим постом.`,
      });
    }
    return NextResponse.json({
      comment: { id: comment.id, authorName: comment.authorName, body: comment.body },
    });
  }

  if (action === "delete-post") {
    const post = await db.post.findUnique({ where: { id: body.postId } });
    if (!post) {
      return NextResponse.json({ error: "Пост не найден" }, { status: 404 });
    }
    if (post.authorId !== user.id) {
      return NextResponse.json({ error: "Нельзя удалить чужой пост" }, { status: 403 });
    }
    await db.post.delete({ where: { id: body.postId } });
    return NextResponse.json({ ok: true, deleted: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
