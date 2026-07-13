import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export function middleware(req: NextRequest) {
  // Apply rate limiting to all API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const limited = rateLimit(req);
    if (limited) return limited;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
