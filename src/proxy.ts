import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

// Optimistic check only — redirects unauthenticated visitors away from the
// admin shell before render. Real authorization happens in
// `src/app/admin/layout.tsx` via `requireAdmin()`, which verifies the JWT.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const hasToken = request.cookies.has(ADMIN_COOKIE_NAME);

  if (!hasToken) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
