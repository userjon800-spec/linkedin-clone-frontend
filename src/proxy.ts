import { NextResponse, NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let response = NextResponse.next();

  if (!token && refreshToken) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        },
      );

      if (res.ok) {
        // Backend yuborgan Set-Cookie (accessToken va refreshToken) ni ushlab olamiz
        const setCookieHeader = res.headers.get("set-cookie");

        response = NextResponse.next();

        // Backend qo'ygan yangi cookie'larni to'g'ridan-to'g'ri brauzerga uzatamiz (forward)
        if (setCookieHeader) {
          response.headers.set("set-cookie", setCookieHeader);
        }

        // Server componentlar shu so'rovning o'zida darhol o'qiy olishi uchun
        const data = await res.json();
        if (data.success && data.token) {
          req.cookies.set("accessToken", data.token);
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          // Set-cookie headerini qaytadan o'rnatib qo'yamiz
          if (setCookieHeader) {
            response.headers.set("set-cookie", setCookieHeader);
          }
        }
      }
    } catch (error) {
      console.error("Token yangilashda xatolik:", error);
    }
  }
  // proxy middlewaredagi code faqat user sahifaga kirganda ishlaydi va route lar almashganda ishga tushadi.
  // 2-QADAM: Yo'naltirish (Routing) mantiqi
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

  // Hozirgi tokenni qayta tekshiramiz (agar yuqorida yangilangan bo'lsa, u mavjud bo'ladi)
  const currentToken =
    response.cookies.get("accessToken")?.value ||
    req.cookies.get("accessToken")?.value;

  if (!currentToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/role", req.url));
  }

  if (currentToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
