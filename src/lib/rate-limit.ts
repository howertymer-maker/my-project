import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (per IP, per minute window).
// For production with multiple instances, use Redis or Upstash Ratelimit.

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60; // 60 req/min per IP

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(req: NextRequest): NextResponse | null {
  // Skip rate limiting for static assets and auth callbacks
  const path = req.nextUrl.pathname;
  if (
    path.startsWith("/_next/") ||
    path.startsWith("/api/auth/") ||
    path.match(/\.(svg|png|jpg|mp4|ico|webp|woff2?)$/)
  ) {
    return null;
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Слишком много запросов", retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  return null;
}
