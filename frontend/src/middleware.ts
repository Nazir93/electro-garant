import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isApiAuth = pathname.startsWith("/api/auth");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApi) return NextResponse.next();
  if (isApiAuth) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
  });

  if (isAdminRoute && !isLoginPage && !token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminApi && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
