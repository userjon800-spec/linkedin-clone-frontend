import { NextResponse, NextRequest } from "next/server";
export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;
  const publicRouters = [
    "/auth/role/login",
    "/auth/role/register",
    "/auth/forgot",
    "/auth/role",
    "/auth/reset-password",
  ];
  const isPublicRoute = publicRouters.some((route) =>
    pathname.startsWith(route),
  );
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/role", req.url));
  }
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
