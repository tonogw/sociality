import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
}

export const config = {
  matcher: "/:path*",
};
