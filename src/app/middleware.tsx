import { decodeJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import React from "react";

const roleRoutes = {
  ADMIN: ["/admin"],
  TEACHER: ["/teacher"],
  STUDENT: ["/student"],
};
function middleware(req: NextRequest) {
  const token = req.cookies.get("sipadi_token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = decodeJwt(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const allowedPaths = roleRoutes[payload.role] || [];

  const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

  if (!isAllowed) {
    return NextResponse.redirect(
      new URL(`/${payload.role.toLowerCase()}/dashboard`, req.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/admin/:path*"],
};
