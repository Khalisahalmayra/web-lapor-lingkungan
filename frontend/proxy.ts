import { NextResponse } from "next/server";

export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user",
    "/user/:path*",
    "/admin",
    "/admin/:path*",
    "/superadmin",
    "/superadmin/:path*",
  ],
};