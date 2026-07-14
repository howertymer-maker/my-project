"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Post = {
  id: string;
  authorName: string;
  authorBadge: string;
  category: string;
  categoryLabel: string;
  title: string;
  body: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
};

type Comment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  post: Post | null;
};

const HUES = [190, 80, 280, 30, 330, 210];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return "только что"; // future timestamp (clock skew)
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "меньше минуты назад";
  if (mins < 60) return `${mins} мин назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч назад`;
  return `${Math.floor(hrs / 24)} д назад`;
}

function CommentAvatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const hue = HUES[name.charCodeAt(0) % HUES.length];
  return (
    <div
      className="w-8 h-8 rounded-full grid place-items-center border border-outline-variant/40 font-display text-[10px] font-extrabold text-primary-fixed shrink-0"
      style={{ background: `linear-gradient(135deg, hsl(${hue},70%,18%), #0A0A0B)` }}
    >
      {initials}
    </div>
  );
}

export function CommentsSidebar({ open, onOpenChange, post }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchComments = () => {
    if (!post) return;
    setLoading(true);
    fetch(`/api/community/comments?postId=${post.id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setComments(d.comments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open && post) {
      Promise.resolve().then(() => fetchComments());
    }
  }, [open, post]);

  const submit = async () => {
    if (!text.trim() || !post) return;
    setSending(true);
    const trimmed = text.trim();
    setText("");
    // optimistic
    setComments((c) => [
      { id: "temp", authorName: "Вы", body: trimmed, createdAt: new Date().toISOString() },
      ...c,
    ]);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "comment", postId: post.id, text: trimmed }),
      });
      if (!res.ok) throw new Error("Ошибка");
      fetchComments(); // refresh with real data
    } catch {
      // revert optimistic
      setComments((c) => c.filter((x) => x.id !== "temp"));
      setText(trimmed);
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[400px] bg-[#1c1b1c] border-l border-primary-container/20 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-outline-variant/30 shrink-0">
          <SheetTitle className="font-display text-xl font-bold text-on-surface flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MaterialIcon name="comment" size={22} className="text-primary-container" fill />
              Комментарии
            </span>
            <span className="font-mono text-[11px] text-on-surface-variant normal-case tracking-wider">
              {post ? post.commentsCount + comments.length : 0}
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 flex flex-col gap-4">
          {post && (
            <>
              {/* Post context */}
              <div className="glass-panel rounded-xl p-4 border border-primary-container/30 bg-[#2a2a2b]">
                <div className="flex items-center gap-2 mb-3">
                  <MaterialIcon name="keep" size={16} className="text-primary-container" fill />
                  <span className="font-display text-[11px] font-bold text-primary-container uppercase tracking-wider">
                    Контекст поста
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CommentAvatar name={post.authorName} />
                  <div className="flex flex-col">
                    <span className="font-display text-[13px] font-bold text-on-surface">
                      {post.authorName}
                    </span>
                    <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-sm font-bold text-on-surface mb-1">
                  {post.title}
                </h3>
                <p className="font-mono text-[12px] text-on-surface-variant leading-relaxed line-clamp-3">
                  {post.body}
                </p>
              </div>

              {/* Comments list */}
              <div className="flex flex-col gap-3">
                {loading ? (
                  <div className="text-center py-8 font-mono text-[12px] text-on-surface-variant">
                    Загрузка...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 font-mono text-[12px] text-on-surface-variant">
                    Пока нет комментариев. Будьте первым!
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <CommentAvatar name={c.authorName} />
                      <div className="flex-1 min-w-0">
                        <div className="bg-[#353436] rounded-xl rounded-tl-none p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-display text-[12px] font-bold text-on-surface">
                              {c.authorName}
                            </span>
                            <span className="font-mono text-[9px] text-on-surface-variant">
                              {timeAgo(c.createdAt)}
                            </span>
                          </div>
                          <p className="font-mono text-[12px] text-on-surface-variant leading-relaxed break-words">
                            {c.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-1 ml-2">
                          <button className="font-mono text-[10px] text-on-surface-variant hover:text-primary-container transition-colors">
                            Ответить
                          </button>
                          <button className="flex items-center gap-1 font-mono text-[10px] text-on-surface-variant hover:text-primary-container transition-colors">
                            <MaterialIcon name="thumb_up" size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Comment input */}
        <div className="px-4 py-3 border-t border-outline-variant/30 bg-[#1c1b1c] shrink-0">
          <div className="flex items-center gap-3 bg-[#353436] rounded-full p-2 border border-outline-variant/40 focus-within:border-primary-container/60 transition-colors">
            <div className="w-7 h-7 rounded-full grid place-items-center border border-primary-container/40 bg-gradient-to-br from-[#0e3a3d] to-[#0A0A0B] shrink-0">
              <span className="font-display text-[10px] font-extrabold text-primary-fixed">
                N
              </span>
            </div>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !sending && submit()}
              placeholder="Написать комментарий..."
              className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] text-on-surface placeholder:text-on-surface-variant/50"
              disabled={sending}
            />
            <button
              onClick={submit}
              disabled={sending || !text.trim()}
              className="w-8 h-8 grid place-items-center rounded-full text-primary-container hover:text-primary-fixed hover:bg-primary-container/10 transition-colors disabled:opacity-40 shrink-0"
            >
              <MaterialIcon name="send" size={18} fill />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
