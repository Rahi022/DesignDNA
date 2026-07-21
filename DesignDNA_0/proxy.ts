import { NextRequest, NextResponse } from "next/server";

const AUTH_ONLY_PREFIXES = [
  "/dashboard",
  "/upload",
  "/generate-logo",
  "/logo-history",
  "/profile",
  "/settings",
  "/analytics",
  "/history",
];

const ADMIN_ONLY_PREFIX = "/admin";

const GUEST_ONLY_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = Boolean(
    request.cookies.get("accessToken")?.value
  );

  const role = request.cookies.get("role")?.value;

  const isAuthPath = AUTH_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const isAdminPath = pathname.startsWith(ADMIN_ONLY_PREFIX);

  const isGuestPath = GUEST_ONLY_PATHS.some(
    (path) => pathname === path
  );

  if ((isAuthPath || isAdminPath) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isGuestPath && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/generate-logo/:path*",
    "/logo-history/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/history/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
