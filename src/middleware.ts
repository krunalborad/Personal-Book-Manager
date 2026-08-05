import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

// Note: we only check for the presence of the cookie here (edge middleware
// can't easily use the Node `jsonwebtoken` verify with crypto). The actual
// token is verified server-side in every API route before any data access,
// so this middleware is a UX redirect, not the security boundary.
export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedPage = pathname.startsWith("/dashboard");

  if (isProtectedPage && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
