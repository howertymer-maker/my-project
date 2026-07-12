"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CATEGORY_META } from "@/lib/mission-templates";

type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorBadge: string;
  category: string;
  categoryLabel: string;
  xpReward: number;
  title: string;
  body: string;
  likes: number;
  likedByMe: boolean;
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

const POST_CATEGORIES = ["mental", "physical", "discipline", "social", "financial", "appearance"];

export function CommunityScreen() {
  const [filter, setFilter] = useState<string>("all");
  const url =
    filter === "all" ? "/api/community" : `/api/community?filter=${filter}`;
  const { data, loading } = useApi<CommunityData>(url);
  const [composing, setComposing] = useState(false);

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
          onClick={() => setComposing(true)}
          className="flex items-center gap-1.5 bg-primary-container text-on-primary rounded-lg px-3 py-1.5 neon-glow-primary active:scale-95 transition-transform"
          aria-label="Новый пост"
        >
          <MaterialIcon name="edit" size={16} />
          <span className="font-display text-[11px] font-bold uppercase tracking-wider">
            Пост
          </span>
        </button>
      </section>

      {/* Compose modal */}
      {composing && (
        <ComposeModal onClose={() => setComposing(false)} onPosted={() => setComposing(false)} />
      )}

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
            {filter === "mine" ? "Вы ещё не публиковали посты" : "Постов пока нет"}
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

function ComposeModal({
  onClose,
  onPosted,
}: {
  onClose: () => void;
  onPosted: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("mental");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Заполните заголовок и текст", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-post",
          title,
          body,
          category,
        }),
      });
      if (!res.ok) throw new Error("Не удалось создать пост");
      toast({ title: "Пост опубликован!" });
      onClose();
      // trigger global refresh so the feed reloads
      window.dispatchEvent(new CustomEvent("neon-refresh"));
    } catch (e) {
      toast({
        title: "Ошибка",
        description: e instanceof Error ? e.message : "Не удалось",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[560px] glass-panel rounded-xl p-5 flex flex-col gap-3 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
            <MaterialIcon name="edit_note" size={20} className="text-primary-container" fill />
            Новый пост
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Закрыть"
          >
            <MaterialIcon name="close" size={20} />
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            Категория
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POST_CATEGORIES.map((c) => {
              const meta = CATEGORY_META[c as keyof typeof CATEGORY_META];
              const active = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md border font-mono text-[10px] uppercase tracking-wider transition-all"
                  style={{
                    color: active ? meta.color : "#b9cacb",
                    borderColor: active ? `${meta.color}66` : "rgba(255,255,255,0.08)",
                    background: active ? `${meta.color}14` : "transparent",
                  }}
                >
                  <MaterialIcon name={meta.icon} size={12} fill={active} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            Заголовок
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="О чём пост?"
            className="bg-surface-container/60 border border-outline-variant/40 rounded-lg px-3 py-2.5 font-mono text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container/60 transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            Текст
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Поделитесь опытом, спросите совета..."
            rows={5}
            className="bg-surface-container/60 border border-outline-variant/40 rounded-lg px-3 py-2.5 font-mono text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container/60 transition-colors resize-none"
          />
        </label>

        <div className="flex gap-2 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-surface-container/60 text-on-surface-variant border border-outline-variant/40 font-display text-[12px] font-bold uppercase tracking-wider transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary font-display text-[12px] font-bold uppercase tracking-wider neon-glow-primary active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {busy ? "Публикация..." : "Опубликовать"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ authorName: string; body: string }[]>([]);

  const toggleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => c + (wasLiked ? -1 : 1));
    try {
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: wasLiked ? "unlike" : "like",
          postId: post.id,
        }),
      });
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => c + (wasLiked ? 1 : -1));
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
        body: JSON.stringify({ action: "comment", postId: post.id, text }),
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
          {post.xpReward > 0 ? (
            <span className="flex items-center gap-1 bg-surface-container-high/60 rounded px-1.5 py-0.5">
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
                {post.categoryLabel}
              </span>
              <span className="font-display text-[11px] font-bold text-primary-fixed ml-1">
                +{post.xpReward} очк
              </span>
            </span>
          ) : (
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
            <MaterialIcon name="thumb_up" size={16} fill={liked} />
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
