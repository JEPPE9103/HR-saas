import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal placeholder: In a real app use session cookies or headers.
export function middleware(req: NextRequest) {
  // Public routes
  const publicPaths = ["/", "/login", "/signup", "/privacy", "/security", "/terms", "/api", "/_next", "/sample.csv"];
  if (publicPaths.some((p) => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }
  // Demo: let everything through for now. Hook up auth cookies here later.
  return NextResponse.next();
}


