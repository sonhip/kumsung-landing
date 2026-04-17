import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "./src/lib/auth";

const isAuthenticated = (request) =>
  request.cookies.get(ADMIN_SESSION_COOKIE)?.value === "authenticated";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (isAuthenticated(request)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.next();
    }

    if (!isAuthenticated(request)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: "Phiên đăng nhập admin không hợp lệ." },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
