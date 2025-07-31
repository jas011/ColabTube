import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: "hello123",
  });

  const { cookies } = req;
  const pathname = req.nextUrl.pathname;

  const isOnboarded = cookies.get("onboarded")?.value === "true";
  const isAuthPage = pathname.startsWith("/auth");
  const isOnboardingPage = pathname.startsWith("/onboarding");
  // const isFileSpacePage = pathname.startsWith("/file-space");

  // Unauthenticated user trying to access protected pages
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Authenticated but not onboarded, redirect to onboarding
  if (token && !isOnboarded && !isOnboardingPage) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Authenticated and onboarded, redirect to /file-space only if at root or irrelevant page
  if (
    token &&
    isOnboarded &&
    (pathname === "/" || pathname === "/auth" || pathname === "/onboarding")
  ) {
    return NextResponse.redirect(new URL("/file-space", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/team/:path*",
    "/auth",
    "/file-space",
    "/",
  ],
};
