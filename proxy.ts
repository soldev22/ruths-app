import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files (images, css, js, etc.) to bypass auth
  if (
    pathname.match(/^\/(?:_next|favicon|.*\.(?:png|svg|jpg|jpeg|gif|ico|css|js))$/)
  ) {
    return NextResponse.next();
  }

  // Public routes
  if (
    pathname === "/" ||
    pathname === "/register" ||
    pathname === "/landing" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/subscription") ||
    pathname === "/about" ||
    pathname === "/faq" ||
    pathname === "/privacy" ||
    pathname === "/contact" ||
    pathname === "/user-guide" ||
    pathname === "/scoring-guide"
  ) {
    return NextResponse.next();
  }

  // Read the auth cookie
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
