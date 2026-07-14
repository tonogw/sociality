import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("COOKIE:", request.cookies.getAll());

  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  const isProtected =
    pathname.startsWith("/posts") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/saved") ||
    pathname.startsWith("/me") ||
    pathname.startsWith("/create");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/posts", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/posts/:path*",
    "/search/:path*",
    "/saved/:path*",
    "/me/:path*",
    "/create/:path*",
  ],
};
