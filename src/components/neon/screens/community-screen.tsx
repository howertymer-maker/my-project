"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Post = {
  id: string;
  authorName: string;
  authorBadge: string;
  category: string;
  categoryLabel: string;
  xpReward: number;
  title: string;
  body: string;
  likes: number;
  commentsCount: number;
  isAdvice: boolean;
  createdAt: string;
};

type CommunityData = { posts: Post[] };

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Всё" },
  { key: "trending", label: "Актуальное" },
  { key: "mine", label: "Мои посты" },
  { key: "advice", label: "Советы" },
];

export function CommunityScreen() {
  const [filter, setFilter] = useState<string>("all");
  const url =
    filter === "all" || filter === "mine"
      ? "/api/community"
      : `/api/community?filter=${filter}`;
  const { data, loading } = useApi<CommunityData>(url);

  return (
    <div className="flex flex-col gap-4 pt-4">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary-container">
            <MaterialIcon name="group" size={26} fill />
          </span>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Сообщество
          </h1>
        </div>
        <button
          className="flex items-center gap-1.5 bg-primary-container text-on-primary rounded-lg px-3 py-1.5 neon-glow-primary active:scale-95 transition-transform"
          aria-label="Новый пост"
        >
          <MaterialIcon name="edit" size={16} />
          <span className="font-display text-[11px] font-bold uppercase tracking-wider">
            Пост
          </span>
        </button>
      </section>

      {/* Filter tabs */}
      <section className="-mx-5 px-5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 w-max pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap",
                  active
                    ? "bg-primary-container/15 text-primary-fixed border-primary-container/50"
                    : "bg-surface-container/40 text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
                )}
              >
                <span className="font-display text-[11px] font-bold uppercase tracking-wider">
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Posts feed */}
      <section className="flex flex-col gap-3">
        {loading || !data ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="glass-panel rounded-xl p-4 h-48 animate-pulse bg-surface-container-high/40"
              />
            ))}
          </>
        ) : data.posts.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-on-surface-variant font-mono text-sm">
            Постов пока нет
          </div>
        ) : (
          data.posts.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))
        )}
      </section>
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ authorName: string; body: string }[]>([]);

  const toggleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    if (next) {
      try {
        await fetch("/api/community", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "like", postId: post.id }),
        });
      } catch {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    const text = commentText.trim();
    setComments((c) => [...c, { authorName: "Вы", body: text }]);
    setCommentText("");
    try {
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "comment",
          postId: post.id,
          text,
          authorName: "Вы",
        }),
      });
    } catch {
      /* ignore */
    }
  };

  const isLong = post.body.length > 160;
  const body = expanded || !isLong ? post.body : post.body.slice(0, 160);

  return (
    <article
      className="glass-panel rounded-xl p-4 flex flex-col gap-3 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}
    >
      {/* author header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={post.authorName} />
          <div className="flex flex-col min-w-0">
            <span className="font-display text-sm font-bold text-on-surface truncate">
              {post.authorName}
            </span>
            <div className="flex items-center gap-1.5">
              {post.authorBadge && (
                <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
                  {post.authorBadge}
                </span>
              )}
              {post.isAdvice && (
                <span className="font-mono text-[9px] text-tertiary-fixed-dim uppercase tracking-wider">
                  · Советы
                </span>
              )}
              <span className="font-mono text-[9px] text-on-surface-variant">
                · {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <button
          className="w-7 h-7 grid place-items-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          aria-label="Опции поста"
        >
          <MaterialIcon name="more_horiz" size={18} />
        </button>
      </div>

      {/* content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-base font-bold text-on-surface leading-tight">
          {post.title}
        </h3>
        <p className="font-mono text-[13px] text-on-surface-variant leading-relaxed">
          {body}
          {isLong && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-primary-fixed ml-1 hover:text-primary-container transition-colors"
            >
              {expanded ? "Свернуть" : "Читать далее"}
            </button>
          )}
        </p>
      </div>

      {/* engagement bar */}
      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
        <div className="flex items-center gap-2">
          {post.xpReward > 0 && (
            <span className="flex items-center gap-1 bg-surface-container-high/60 rounded px-1.5 py-0.5">
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
                {post.categoryLabel}
              </span>
              <span className="font-display text-[11px] font-bold text-primary-fixed ml-1">
                +{post.xpReward} очк
              </span>
            </span>
          )}
          {post.xpReward === 0 && (
            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
              {post.categoryLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLike}
            className="flex items-center gap-1 text-on-surface-variant hover:text-secondary-fixed transition-colors active:scale-90"
            style={liked ? { color: "#b6f700" } : undefined}
            aria-label="Нравится"
          >
            <MaterialIcon
              name={liked ? "thumb_up" : "thumb_up"}
              size={16}
              fill={liked}
            />
            <span className="font-mono text-[11px] font-medium">{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComments((s) => !s)}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary-fixed transition-colors active:scale-90"
            aria-label="Комментарии"
          >
            <MaterialIcon name="chat_bubble_outline" size={16} />
            <span className="font-mono text-[11px] font-medium">
              {post.commentsCount + comments.length}
            </span>
          </button>
          <button
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary-fixed transition-colors active:scale-90"
            aria-label="Перевести"
          >
            <MaterialIcon name="translate" size={16} />
            <span className="font-mono text-[10px] uppercase tracking-wider hidden sm:inline">
              Перевести
            </span>
          </button>
        </div>
      </div>

      {/* comments */}
      {showComments && (
        <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-2">
              <Avatar name={c.authorName} small />
              <div className="flex flex-col bg-surface-container/60 rounded-lg px-2.5 py-1.5 max-w-[80%]">
                <span className="font-display text-[11px] font-bold text-on-surface">
                  {c.authorName}
                </span>
                <span className="font-mono text-[12px] text-on-surface-variant">
                  {c.body}
                </span>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            <Avatar name="Вы" small />
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Добавить комментарий..."
              className="flex-1 bg-surface-container/60 border border-outline-variant/30 rounded-lg px-3 py-1.5 font-mono text-[12px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container/60 focus:ring-1 focus:ring-primary-container/30 transition-colors"
            />
            <button
              onClick={submitComment}
              className="px-3 rounded-lg bg-primary-container text-on-primary font-display text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-transform"
            >
              ОК
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function Avatar({ name, small }: { name: string; small?: boolean }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const size = small ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-[12px]";
  // deterministic gradient from name
  const hues = [190, 80, 280, 30, 330, 210];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className={cn(
        "shrink-0 rounded-full grid place-items-center border border-primary-container/30 font-display font-extrabold text-primary-fixed",
        size
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue},70%,18%), #0A0A0B)`,
      }}
    >
      {initials}
    </div>
  );
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  if (hrs < 1) return "только что";
  if (hrs < 24) return `${hrs} ч назад`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "вчера";
  return `${days} дн назад`;
}
