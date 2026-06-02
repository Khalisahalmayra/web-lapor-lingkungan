import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function proxy(req: Request) {
  const session = await getServerSession();
  console.log("Session in middleware:", session);
  if (!session) {
    return NextResponse.redirect(new URL("/masuk", req.url));
  }

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
}