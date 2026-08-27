import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "telapsy_session";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    const signin = new URL("/signin", request.url);
    signin.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(signin);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*", "/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/orders/:path*", "/notifications/:path*", "/cart/:path*"] };
