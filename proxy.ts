import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (
    pathname === "/register" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth")
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
    return NextResponse.redirect(new URL("/register", req.url));
  }
}

export const config = {
  // Protect EVERYTHING except public endpoints
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
