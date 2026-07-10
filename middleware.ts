import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/search/:path*",
    "/create/:path*",
    "/my/:path*",
    "/saved/:path*",
    "/settings/:path*",
  ],
};
